import React, { useId, useState } from 'react';
import styles from './styles.module.css';

interface Props {
    labelSmall?: string;
    labelMedium?: string;
    labelLarge?: string;
    labelPlayers?: string;
    labelCompressed?: string;
    labelRaw?: string;
    caption?: string;
}

const STOPS = [0, 256, 4096, 262144];
const STOP_LABELS = ['0', '256', '4 KB', '256 KB'];

interface Lane {
    key: 'small' | 'medium' | 'large';
    y: number;
    size: number;
    sizeLabel: string;
}

const LANES: Lane[] = [
    { key: 'small', y: 55, size: 100, sizeLabel: '~100 B' },
    { key: 'medium', y: 165, size: 4096, sizeLabel: '~4 KB' },
    { key: 'large', y: 275, size: 131072, sizeLabel: '~128 KB' },
];

const CompressionThresholdDemo: React.FC<Props> = ({
    labelSmall = 'Small packet',
    labelMedium = 'Batch packet',
    labelLarge = 'Chunk packet',
    labelPlayers = 'Players',
    labelCompressed = 'compressed',
    labelRaw = 'uncompressed',
    caption = 'Packets smaller than the threshold are sent at compression level 0 — i.e. uncompressed.',
}) => {
    // `compression-threshold` defaults to `256`
    const [stop, setStop] = useState(1);
    const threshold = STOPS[stop];
    const uid = useId();

    const laneLabels = { small: labelSmall, medium: labelMedium, large: labelLarge };

    const renderPackets = (pathId: string, offsets: string[], dur: string, r: number, hidden: boolean) =>
        offsets.map((begin, i) => (
            <circle key={`${pathId}-${i}`} r={r} className={`${styles.packet} ${hidden ? styles.gone : ''}`}>
                <animateMotion dur={dur} begin={begin} repeatCount="indefinite">
                    <mpath href={`#${pathId}`} />
                </animateMotion>
            </circle>
        ));

    return (
        <div className={styles.demo}>
            <div className={styles.sliderRow}>
                <code>compression-threshold = {STOP_LABELS[stop]}</code>
                <input
                    type="range"
                    min={0}
                    max={STOPS.length - 1}
                    step={1}
                    value={stop}
                    onChange={e => setStop(Number(e.target.value))}
                />
                <div className={styles.tickLabels}>
                    {STOP_LABELS.map(l => (
                        <span key={l}>{l}</span>
                    ))}
                </div>
            </div>
            <p className={styles.caption}>{caption}</p>

            <svg className={styles.stage} viewBox="0 0 640 340" role="img">
                <defs>
                    {LANES.map(lane => (
                        <React.Fragment key={lane.key}>
                            <path id={`${uid}-${lane.key}-comp-in`} d={`M182,${lane.y} L300,${lane.y}`} />
                            <path id={`${uid}-${lane.key}-comp-out`} d={`M420,${lane.y} L508,${lane.y}`} />
                            <path
                                id={`${uid}-${lane.key}-bypass`}
                                d={`M182,${lane.y} C260,${lane.y} 260,${lane.y + 46} 360,${lane.y + 46} C460,${lane.y + 46} 460,${lane.y} 508,${lane.y}`}
                            />
                        </React.Fragment>
                    ))}
                </defs>

                {LANES.map(lane => {
                    // Zlib: data.length < threshold ? level 0 (raw) : compressed
                    const compressed = lane.size >= threshold;
                    const compIn = `${uid}-${lane.key}-comp-in`;
                    const compOut = `${uid}-${lane.key}-comp-out`;
                    const bypass = `${uid}-${lane.key}-bypass`;

                    return (
                        <g key={lane.key}>
                            {/* flow lines */}
                            <use
                                href={`#${compIn}`}
                                className={`${styles.flow} ${compressed ? styles.flowAsync : styles.flowDisabled}`}
                            />
                            <use
                                href={`#${compOut}`}
                                className={`${styles.flow} ${compressed ? styles.flowAsync : styles.flowDisabled}`}
                            />
                            <use
                                href={`#${bypass}`}
                                className={`${styles.flow} ${compressed ? styles.flowDisabled : styles.flowAsync}`}
                            />

                            {/* cross on the inactive route */}
                            <g className={`${styles.cross} ${compressed ? styles.gone : ''}`}>
                                <line x1="232" y1={lane.y - 9} x2="250" y2={lane.y + 9} />
                                <line x1="232" y1={lane.y + 9} x2="250" y2={lane.y - 9} />
                            </g>
                            <g className={`${styles.cross} ${compressed ? '' : styles.gone}`}>
                                <line x1="351" y1={lane.y + 37} x2="369" y2={lane.y + 55} />
                                <line x1="351" y1={lane.y + 55} x2="369" y2={lane.y + 37} />
                            </g>

                            {/* packets (compressed output is drawn smaller) */}
                            {renderPackets(compIn, ['0s', '-1s'], '2s', 4, !compressed)}
                            {renderPackets(compOut, ['0s', '-1s'], '2s', 3, !compressed)}
                            {renderPackets(bypass, ['0s', '-1s'], '2s', 4, compressed)}

                            {/* source box */}
                            <rect x="12" y={lane.y - 24} width="170" height="48" rx="8" className={styles.box} />
                            <text x="97" y={lane.y - 4} textAnchor="middle" className={styles.label}>
                                {laneLabels[lane.key]}
                            </text>
                            <text x="97" y={lane.y + 14} textAnchor="middle" className={styles.mono}>
                                {lane.sizeLabel}
                            </text>

                            {/* zlib box */}
                            <rect
                                x="300"
                                y={lane.y - 22}
                                width="120"
                                height="44"
                                rx="8"
                                className={`${styles.box} ${compressed ? styles.boxAsync : styles.boxDisabled}`}
                            />
                            <text
                                x="360"
                                y={lane.y + 4}
                                textAnchor="middle"
                                className={`${styles.label} ${compressed ? '' : styles.labelDisabled}`}
                            >
                                zlib
                            </text>

                            {/* players box */}
                            <rect x="508" y={lane.y - 24} width="120" height="48" rx="8" className={styles.box} />
                            <text x="568" y={lane.y + 4} textAnchor="middle" className={styles.label}>
                                {labelPlayers}
                            </text>

                            {/* route status */}
                            <text
                                x="464"
                                y={lane.y - 12}
                                textAnchor="middle"
                                className={compressed ? styles.statusOn : styles.statusOff}
                            >
                                {compressed ? labelCompressed : labelRaw}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default CompressionThresholdDemo;
