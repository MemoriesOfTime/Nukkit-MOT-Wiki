import React, { useEffect, useId, useState } from 'react';
import styles from './styles.module.css';

interface Props {
    labelUnload?: string;
    labelQueue?: string;
    labelDisk?: string;
    labelPressure?: string;
    labelPaused?: string;
    caption?: string;
}

const LIMITS = [32, 64, 128, 256];
// chunks per second the async disk commit drains from the queue
const DRAIN = 12;

const PendingWritesDemo: React.FC<Props> = ({
    labelUnload = 'Chunk unload',
    labelQueue = 'Pending writes',
    labelDisk = 'LevelDB',
    labelPressure = 'Write pressure',
    labelPaused = 'unloading paused (backpressure)',
    caption = 'When the queue reaches the limit, chunk unloading pauses until the disk catches up (backpressure).',
}) => {
    // `max-pending-chunk-writes` defaults to `128`
    const [limitIdx, setLimitIdx] = useState(2);
    const [pressure, setPressure] = useState(10);
    const [level, setLevel] = useState(0);
    const [backlogged, setBacklogged] = useState(false);
    // incremented each time backpressure kicks in, so the badge animation replays
    const [episode, setEpisode] = useState(0);
    const limit = LIMITS[limitIdx];
    const uid = useId();

    const pathIds = {
        inflow: `${uid}-inflow`,
        outflow: `${uid}-outflow`,
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setLevel(prev => {
                const inflow = backlogged ? 0 : pressure;
                return Math.max(0, Math.min(limit * 1.1, prev + (inflow - DRAIN) * 0.25));
            });
        }, 250);
        return () => clearInterval(timer);
    }, [pressure, limit, backlogged]);

    // hysteresis so the paused state does not flicker around the limit
    useEffect(() => {
        if (!backlogged && level >= limit) {
            setBacklogged(true);
            setEpisode(e => e + 1);
        } else if (backlogged && level <= limit * 0.5) {
            setBacklogged(false);
        }
    }, [level, limit, backlogged]);

    const shown = Math.min(level, limit);
    const ratio = shown / limit;
    const barClass = backlogged || ratio >= 0.85 ? styles.bad : ratio >= 0.5 ? styles.warn : styles.ok;

    const renderPackets = (pathId: string, offsets: string[], dur: string, hidden: boolean) =>
        offsets.map((begin, i) => (
            <circle key={`${pathId}-${i}`} r="4" className={`${styles.packet} ${hidden ? styles.gone : ''}`}>
                <animateMotion dur={dur} begin={begin} repeatCount="indefinite">
                    <mpath href={`#${pathId}`} />
                </animateMotion>
            </circle>
        ));

    return (
        <div className={styles.demo}>
            <div className={styles.controls}>
                <div className={styles.sliderRow}>
                    <code>max-pending-chunk-writes = {limit}</code>
                    <input
                        type="range"
                        min={0}
                        max={LIMITS.length - 1}
                        step={1}
                        value={limitIdx}
                        onChange={e => setLimitIdx(Number(e.target.value))}
                    />
                    <div className={styles.tickLabels}>
                        {LIMITS.map(l => (
                            <span key={l}>{l}</span>
                        ))}
                    </div>
                </div>
                <div className={styles.sliderRow}>
                    <code>
                        {labelPressure} = {pressure}/s
                    </code>
                    <input
                        type="range"
                        min={4}
                        max={40}
                        step={2}
                        value={pressure}
                        onChange={e => setPressure(Number(e.target.value))}
                    />
                    <div className={styles.tickLabels}>
                        <span>4/s</span>
                        <span>40/s</span>
                    </div>
                </div>
            </div>
            <p className={styles.caption}>{caption}</p>

            <svg className={styles.stage} viewBox="0 0 640 240" role="img">
                <defs>
                    <path id={pathIds.inflow} d="M142,120 L270,120" />
                    <path id={pathIds.outflow} d="M450,120 L520,120" />
                </defs>

                {/* backpressure badge: flashes briefly when backpressure kicks in,
                    the red crossed path remains as the persistent indicator */}
                {backlogged && (
                    <text key={episode} x="360" y="50" textAnchor="middle" className={styles.paused}>
                        {labelPaused}
                    </text>
                )}

                {/* flow lines */}
                <use
                    href={`#${pathIds.inflow}`}
                    className={`${styles.flow} ${backlogged ? styles.flowBlocked : styles.flowAsync}`}
                />
                <use href={`#${pathIds.outflow}`} className={styles.flow} />

                {/* cross on the inflow when unloading is paused */}
                <g className={`${styles.cross} ${backlogged ? '' : styles.gone}`}>
                    <line x1="197" y1="111" x2="215" y2="129" />
                    <line x1="197" y1="129" x2="215" y2="111" />
                </g>

                {/* packets */}
                {renderPackets(pathIds.inflow, ['0s', '-1s'], '2s', backlogged)}
                {renderPackets(pathIds.outflow, ['0s', '-0.75s'], '1.5s', false)}

                {/* unload box */}
                <rect x="12" y="92" width="130" height="56" rx="8" className={styles.box} />
                <text x="77" y="124" textAnchor="middle" className={styles.label}>
                    {labelUnload}
                </text>

                {/* queue box */}
                <rect
                    x="270"
                    y="70"
                    width="180"
                    height="100"
                    rx="8"
                    className={`${styles.box} ${backlogged ? styles.boxDanger : ''}`}
                />
                <text x="360" y="94" textAnchor="middle" className={styles.label}>
                    {labelQueue}
                </text>
                <rect x="290" y="120" width="140" height="14" rx="7" className={styles.loadTrack} />
                <rect
                    x="290"
                    y="120"
                    height="14"
                    rx="7"
                    width={140 * ratio}
                    className={`${styles.queueFill} ${barClass}`}
                />
                <text x="360" y="158" textAnchor="middle" className={styles.mono}>
                    {Math.round(shown)} / {limit}
                </text>

                {/* disk box */}
                <rect x="520" y="92" width="108" height="56" rx="8" className={styles.box} />
                <text x="574" y="124" textAnchor="middle" className={styles.label}>
                    {labelDisk}
                </text>
            </svg>
        </div>
    );
};

export default PendingWritesDemo;
