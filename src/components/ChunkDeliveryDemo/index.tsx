import React, { useId, useState } from 'react';
import styles from './styles.module.css';

interface Props {
    labelCache?: string;
    labelPull?: string;
    modeFull?: string;
    modeCache?: string;
    modePull?: string;
    modePullCache?: string;
    descFull?: string;
    descCache?: string;
    descPull?: string;
    descPullCache?: string;
    laneFull?: string;
    laneBlobIds?: string;
    laneShell?: string;
    laneBiomeBlob?: string;
    laneBlobStatus?: string;
    laneRequest?: string;
    laneMissResponse?: string;
    laneEntries?: string;
    labelServer?: string;
    labelClient?: string;
    labelFirst?: string;
    labelRevisit?: string;
    labelBytes?: string;
    labelOn?: string;
    labelOff?: string;
    chipChunkSettings?: string;
    chipSerializer?: string;
    chipBlobStore?: string;
    chipChunkCache?: string;
    chipRenderer?: string;
    chipSubChunks?: string;
    caption?: string;
}

// Illustrative per-column figures (16x16 column, ~14 non-empty sub-chunks).
const COLUMN_KB = 18;
const SHELL_KB = 1;
const VISIBLE = 0.38;
const HASHES = 15;
const HASH_KB = (HASHES * 8) / 1024;
const SCALE_KB = 18.5;

const ChunkDeliveryDemo: React.FC<Props> = ({
    labelCache = 'client-cache',
    labelPull = 'sub-chunk-requests',
    modeFull = 'Full push',
    modeCache = 'Client cache',
    modePull = 'Sub-chunk pull',
    modePullCache = 'Pull + cache',
    descFull = 'Every column is serialized and sent whole, every time it enters view.',
    descCache = 'Only blob ids travel; the client answers hit/miss, misses are re-sent once.',
    descPull = 'A biome-only shell arrives first; the client then pulls the sub-chunks it renders.',
    descPullCache = 'Pull mode with cached entries: shells and entries carry blob ids, payloads only on miss.',
    laneFull = 'LevelChunk = whole column',
    laneBlobIds = 'LevelChunk = blob ids + entities',
    laneShell = 'LevelChunk shell = biomes only',
    laneBiomeBlob = 'LevelChunk shell = biome blob id',
    laneBlobStatus = 'BlobStatus (hit / miss)',
    laneRequest = 'SubChunkRequest',
    laneMissResponse = 'MissResponse = payload',
    laneEntries = 'SubChunk × N',
    labelServer = 'Server',
    labelClient = 'Client',
    labelFirst = 'First visit',
    labelRevisit = 'After leaving view',
    labelBytes = 'wire bytes per column',
    labelOn = 'on',
    labelOff = 'off',
    chipChunkSettings = 'chunk-settings',
    chipSerializer = 'serializer',
    chipBlobStore = 'blob store',
    chipChunkCache = 'chunk cache',
    chipRenderer = 'renderer',
    chipSubChunks = 'sub-chunks',
    caption = 'Illustrative sizes: one column is about 18 KB on the wire, and the client renders roughly 38% of its sub-chunks. Real numbers depend on terrain, biomes and block entities.',
}) => {
    // Defaults mirror the shipped config: sub-chunk pull on, client cache off.
    const [cache, setCache] = useState(false);
    const [pull, setPull] = useState(true);
    const uid = useId();

    const mode = pull ? (cache ? 'pullCache' : 'pull') : cache ? 'cache' : 'full';
    const modeName = { full: modeFull, cache: modeCache, pull: modePull, pullCache: modePullCache }[mode];
    const modeDesc = { full: descFull, cache: descCache, pull: descPull, pullCache: descPullCache }[mode];

    const lane1 = pull ? (cache ? laneBiomeBlob : laneShell) : cache ? laneBlobIds : laneFull;
    const lane2 = pull ? (cache ? `${laneRequest} + ${laneBlobStatus}` : laneRequest) : cache ? laneBlobStatus : null;
    const lane3 = pull ? (cache ? `${laneEntries} / ${laneMissResponse}` : laneEntries) : cache ? laneMissResponse : null;

    const entryHashesKb = (HASHES * VISIBLE * 8) / 1024;
    const bytes: Record<string, [number, number]> = {
        full: [COLUMN_KB, COLUMN_KB],
        cache: [COLUMN_KB + HASH_KB, HASH_KB],
        pull: [SHELL_KB + COLUMN_KB * VISIBLE, SHELL_KB + COLUMN_KB * VISIBLE],
        pullCache: [HASH_KB + COLUMN_KB * VISIBLE, HASH_KB + entryHashesKb],
    };
    const [first, revisit] = bytes[mode];
    const saving = Math.round((1 - revisit / COLUMN_KB) * 100);

    const lanes = [
        { id: `${uid}-l1`, d: 'M140,88 L494,88', cls: styles.flowMain, label: lane1, y: 76, offsets: ['0s', '-1.2s'], dur: '1.8s' },
        { id: `${uid}-l2`, d: 'M500,140 L146,140', cls: styles.flowBack, label: lane2, y: 128, offsets: ['0s', '-0.8s'], dur: '1.4s' },
        { id: `${uid}-l3`, d: 'M140,192 L494,192', cls: styles.flowData, label: lane3, y: 180, offsets: ['0s', '-0.6s', '-1.2s'], dur: '1.6s' },
    ];

    const bar = (label: string, value: number, tone: string) => (
        <div className={styles.barRow}>
            <span className={styles.barLabel}>{label}</span>
            <span className={styles.barTrack}>
                <span
                    className={`${styles.barFill} ${tone}`}
                    style={{ width: `${Math.max(1.5, (value / SCALE_KB) * 100)}%` }}
                />
            </span>
            <span className={styles.barValue}>{value < 1 ? value.toFixed(2) : value.toFixed(1)} KB</span>
        </div>
    );

    return (
        <div className={styles.demo}>
            <div className={styles.toggles}>
                <label className={styles.toggleRow}>
                    <span className={styles.switch}>
                        <input type="checkbox" checked={cache} onChange={e => setCache(e.target.checked)} />
                        <span className={styles.slider} />
                    </span>
                    <code>{labelCache}</code>
                    <span className={cache ? styles.stateOn : styles.stateOff}>{cache ? labelOn : labelOff}</span>
                </label>
                <label className={styles.toggleRow}>
                    <span className={styles.switch}>
                        <input type="checkbox" checked={pull} onChange={e => setPull(e.target.checked)} />
                        <span className={styles.slider} />
                    </span>
                    <code>{labelPull}</code>
                    <span className={pull ? styles.stateOn : styles.stateOff}>{pull ? labelOn : labelOff}</span>
                </label>
            </div>

            <p className={styles.modeLine}>
                <span className={styles.modeBadge}>{modeName}</span>
                <span className={styles.caption}>{modeDesc}</span>
            </p>

            <svg className={styles.stage} viewBox="0 0 640 250" role="img">
                <defs>
                    <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M0,0 L10,5 L0,10 z" className={styles.arrowHead} />
                    </marker>
                    {lanes.map(lane => (
                        <path key={`motion-${lane.id}`} id={lane.id} d={lane.d} />
                    ))}
                </defs>

                {lanes.map(lane =>
                    lane.label ? (
                        <g key={`lane-${lane.id}`}>
                            <path
                                d={lane.d}
                                className={`${styles.flow} ${lane.cls}`}
                                markerEnd={`url(#${uid}-arrow)`}
                            />
                            <text x="320" y={lane.y} textAnchor="middle" className={styles.laneLabel}>
                                {lane.label}
                            </text>
                            {lane.offsets.map((begin, i) => (
                                <circle key={`${lane.id}-${i}`} r="4" className={styles.packet}>
                                    <animateMotion dur={lane.dur} begin={begin} repeatCount="indefinite">
                                        <mpath href={`#${lane.id}`} />
                                    </animateMotion>
                                </circle>
                            ))}
                        </g>
                    ) : null,
                )}

                <rect x="14" y="40" width="126" height="176" rx="8" className={styles.box} />
                <text x="77" y="66" textAnchor="middle" className={styles.label}>
                    {labelServer}
                </text>
                <rect x="32" y="84" width="90" height="20" rx="4" className={styles.chip} />
                <text x="77" y="98" textAnchor="middle" className={styles.chipText}>
                    {chipChunkSettings}
                </text>
                <rect x="32" y="116" width="90" height="20" rx="4" className={styles.chip} />
                <text x="77" y="130" textAnchor="middle" className={styles.chipText}>
                    {chipSerializer}
                </text>
                <rect x="32" y="148" width="90" height="20" rx="4" className={`${styles.chip} ${cache ? styles.chipOn : ''}`} />
                <text x="77" y="162" textAnchor="middle" className={styles.chipText}>
                    {chipBlobStore}
                </text>

                <rect x="500" y="40" width="126" height="176" rx="8" className={`${styles.box} ${styles.boxClient}`} />
                <text x="563" y="66" textAnchor="middle" className={styles.label}>
                    {labelClient}
                </text>
                <rect x="518" y="84" width="90" height="20" rx="4" className={styles.chip} />
                <text x="563" y="98" textAnchor="middle" className={styles.chipText}>
                    {chipChunkCache}
                </text>
                <rect x="518" y="116" width="90" height="20" rx="4" className={styles.chip} />
                <text x="563" y="130" textAnchor="middle" className={styles.chipText}>
                    {chipRenderer}
                </text>
                <rect x="518" y="148" width="90" height="20" rx="4" className={`${styles.chip} ${pull ? styles.chipOn : ''}`} />
                <text x="563" y="162" textAnchor="middle" className={styles.chipText}>
                    {chipSubChunks}
                </text>
            </svg>

            <p className={styles.barTitle}>
                {labelBytes}
                <span className={styles.caption}> · −{saving}%</span>
            </p>
            <div className={styles.bars}>
                {bar(labelFirst, first, mode === 'full' ? styles.fillWarn : styles.fillNeutral)}
                {bar(labelRevisit, revisit, revisit / COLUMN_KB < 0.2 ? styles.fillOk : styles.fillNeutral)}
            </div>
            <p className={styles.caption}>{caption}</p>
        </div>
    );
};

export default ChunkDeliveryDemo;
