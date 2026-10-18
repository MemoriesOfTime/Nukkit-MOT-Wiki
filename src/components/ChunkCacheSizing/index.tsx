import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

interface Props {
    labelViewDistance?: string;
    labelPlayers?: string;
    labelClustered?: string;
    labelDispersed?: string;
    labelStore?: string;
    labelPending?: string;
    labelWorkingSet?: string;
    labelBudget?: string;
    labelDefault?: string;
    labelColumns?: string;
    caption?: string;
    warning?: string;
    overflow?: string;
}

// Rough per-column resident cost in the blob store: sub-chunk blobs + biomes.
const COLUMN_KB = 18;
// Hashes one column owes a hit/miss report for: sections plus the biomes blob.
const SECTIONS = 28;
const STORE_BUCKETS = [16, 32, 64, 96, 128, 192, 256, 384, 512, 768, 1024];
const CAP_BUCKETS = [128, 256, 384, 512, 768, 1024];

const ChunkCacheSizing: React.FC<Props> = ({
    labelViewDistance = 'view distance',
    labelPlayers = 'players online',
    labelClustered = 'players together',
    labelDispersed = 'players dispersed',
    labelStore = 'blob-store-max-mb',
    labelPending = 'blob-pending-cap',
    labelWorkingSet = 'working set',
    labelBudget = 'recommended budget',
    labelDefault = 'default 64 MB',
    labelColumns = 'columns to hold',
    caption = 'Working set = unique columns on screen × ~18 KB. The recommended budget leaves 30% headroom; the pending cap covers the columns a player receives in one burst.',
    warning = 'The default 64 MB is below this working set: blobs get evicted, clients report misses and the server re-sends payloads. Raise blob-store-max-mb.',
    overflow = 'This working set exceeds the largest sensible budget (1024 MB). Size for the hot spots instead: the store is shared, so clustered players still hit the cache.',
}) => {
    const { i18n } = useDocusaurusContext();
    const numberLocale = i18n.currentLocale === 'zh' ? 'zh-CN' : i18n.currentLocale === 'ru' ? 'ru-RU' : 'en-US';

    const [viewDistance, setViewDistance] = useState(12);
    const [players, setPlayers] = useState(20);
    const [dispersed, setDispersed] = useState(false);

    const perPlayer = (2 * viewDistance + 1) ** 2;
    const columns = dispersed ? perPlayer * players : perPlayer;
    const workingSet = (columns * COLUMN_KB) / 1024;
    const recommended = STORE_BUCKETS.find(b => b >= workingSet * 1.3) ?? 1024;
    // True when even the top bucket cannot hold the working set with headroom.
    const overflowed = workingSet * 1.3 > STORE_BUCKETS[STORE_BUCKETS.length - 1];

    // A player receives columns in bursts; big view distances queue more of them.
    const inFlight = 4 + Math.round(viewDistance / 4);
    const pendingNeed = (SECTIONS + 1) * inFlight;
    const cap = CAP_BUCKETS.find(b => b >= pendingNeed) ?? 1024;

    const scale = Math.max(recommended, workingSet, 64) * 1.05;

    const bar = (label: string, value: number, cls: string, text: string) => (
        <div className={styles.barRow}>
            <span className={styles.barLabel}>{label}</span>
            <span className={styles.barTrack}>
                <span className={`${styles.barFill} ${cls}`} style={{ width: `${Math.max(2, (value / scale) * 100)}%` }} />
            </span>
            <span className={styles.barValue}>{text}</span>
        </div>
    );

    return (
        <div className={styles.demo}>
            <div className={styles.controls}>
                <div className={styles.sliderRow}>
                    <code>
                        {labelViewDistance} = {viewDistance}
                    </code>
                    <input
                        type="range"
                        min={4}
                        max={32}
                        step={1}
                        value={viewDistance}
                        onChange={e => setViewDistance(Number(e.target.value))}
                    />
                    <div className={styles.tickLabels}>
                        <span>4</span>
                        <span>32</span>
                    </div>
                </div>
                <div className={styles.sliderRow}>
                    <code>
                        {labelPlayers} = {players}
                    </code>
                    <input
                        type="range"
                        min={1}
                        max={100}
                        step={1}
                        value={players}
                        onChange={e => setPlayers(Number(e.target.value))}
                    />
                    <div className={styles.tickLabels}>
                        <span>1</span>
                        <span>100</span>
                    </div>
                </div>
                <div className={styles.segmented} role="group">
                    <button
                        type="button"
                        className={!dispersed ? styles.segActive : styles.seg}
                        onClick={() => setDispersed(false)}
                    >
                        {labelClustered}
                    </button>
                    <button
                        type="button"
                        className={dispersed ? styles.segActive : styles.seg}
                        onClick={() => setDispersed(true)}
                    >
                        {labelDispersed}
                    </button>
                </div>
            </div>

            <div className={styles.results}>
                <div className={styles.result}>
                    <span className={styles.resultKey}>{labelStore}</span>
                    <span className={styles.resultValue}>{recommended}</span>
                </div>
                <div className={styles.result}>
                    <span className={styles.resultKey}>{labelPending}</span>
                    <span className={styles.resultValue}>{cap}</span>
                </div>
                <div className={styles.result}>
                    <span className={styles.resultKey}>{labelColumns}</span>
                    <span className={styles.resultValue}>{columns.toLocaleString(numberLocale)}</span>
                </div>
            </div>

            <div className={styles.bars}>
                {bar(labelWorkingSet, workingSet, styles.fillNeutral, `${workingSet.toFixed(1)} MB`)}
                {bar(labelBudget, recommended, styles.fillOk, `${recommended} MB`)}
                {bar(labelDefault, 64, styles.fillWarn, '64 MB')}
            </div>

            <p className={styles.caption}>{overflowed ? overflow : workingSet > 64 ? warning : caption}</p>
        </div>
    );
};

export default ChunkCacheSizing;
