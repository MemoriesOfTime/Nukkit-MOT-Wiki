import React, { useId, useState } from 'react';
import styles from './styles.module.css';

interface Props {
    labelStorage?: string;
    labelMainThread?: string;
    labelAsyncChunk?: string;
    labelAsyncChunkSub?: string;
    labelAsyncIo?: string;
    labelAsyncIoSub?: string;
    labelPlayers?: string;
    labelLoad?: string;
}

const AsyncChunksDemo: React.FC<Props> = ({
    labelStorage = 'Chunk storage',
    labelMainThread = 'Main thread',
    labelAsyncChunk = 'Async chunk thread',
    labelAsyncChunkSub = 'serialize / encode',
    labelAsyncIo = 'Async IO thread',
    labelAsyncIoSub = 'read / decode / save',
    labelPlayers = 'Players',
    labelLoad = 'load',
}) => {
    // `async-chunks` defaults to `on`
    const [enabled, setEnabled] = useState(true);
    const uid = useId();

    const pathIds = {
        // async paths (enabled)
        ioFwd: `${uid}-io-fwd`, // storage -> IO thread (read)
        ioRev: `${uid}-io-rev`, // IO thread -> storage (save, motion only)
        mainIo: `${uid}-main-io`, // main -> IO thread (dirty chunk handoff)
        mainIoRev: `${uid}-main-io-rev`, // IO thread -> main (decoded chunk, motion only)
        mainSer: `${uid}-main-ser`, // main -> async chunk thread (chunk clone)
        serPlayers: `${uid}-ser-players`, // async chunk thread -> players
        // sync fallback paths (disabled)
        syncIoFwd: `${uid}-sync-io-fwd`, // storage -> main (blocking read)
        syncIoRev: `${uid}-sync-io-rev`, // main -> storage (blocking save, motion only)
        syncSend: `${uid}-sync-send`, // main -> players (serialize on main thread)
    };

    // When disabled, the main thread does IO and serialization itself and moves slowly (congestion).
    const asyncDur = '2s';
    const syncDur = '3.5s';

    const renderPackets = (pathId: string, offsets: string[], dur: string, save = false, hidden = false) =>
        offsets.map((begin, i) => (
            <circle
                key={`${pathId}-${i}`}
                r="4"
                className={`${styles.packet} ${save ? styles.packetSave : ''} ${hidden ? styles.gone : ''}`}
            >
                <animateMotion dur={dur} begin={begin} repeatCount="indefinite">
                    <mpath href={`#${pathId}`} />
                </animateMotion>
            </circle>
        ));

    return (
        <div className={styles.demo}>
            <label className={styles.toggleRow}>
                <span className={styles.switch}>
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={e => setEnabled(e.target.checked)}
                    />
                    <span className={styles.slider} />
                </span>
                <code>async-chunks</code>
                <span className={enabled ? styles.stateOn : styles.stateOff}>
                    {enabled ? 'on' : 'off'}
                </span>
            </label>

            <svg className={styles.stage} viewBox="0 0 640 340" role="img">
                <defs>
                    <path id={pathIds.ioFwd} d="M122,178 C170,178 170,290 248,290" />
                    <path id={pathIds.ioRev} d="M248,290 C170,290 170,178 122,178" />
                    <path id={pathIds.mainIo} d="M348,208 L348,262" />
                    <path id={pathIds.mainIoRev} d="M348,262 L348,208" />
                    <path id={pathIds.mainSer} d="M304,144 L304,86" />
                    <path id={pathIds.serPlayers} d="M392,58 C445,58 445,72 508,72" />
                    <path id={pathIds.syncIoFwd} d="M122,178 L248,178" />
                    <path id={pathIds.syncIoRev} d="M248,178 L122,178" />
                    <path id={pathIds.syncSend} d="M392,164 C445,164 445,72 508,72" />
                </defs>

                {/* async flow lines: grayed out and crossed when disabled */}
                <use
                    href={`#${pathIds.ioFwd}`}
                    className={`${styles.flow} ${styles.flowAsync} ${enabled ? '' : styles.flowDisabled}`}
                />
                <use
                    href={`#${pathIds.mainIo}`}
                    className={`${styles.flow} ${styles.flowAsync} ${enabled ? '' : styles.flowDisabled}`}
                />
                <use
                    href={`#${pathIds.mainSer}`}
                    className={`${styles.flow} ${styles.flowAsync} ${enabled ? '' : styles.flowDisabled}`}
                />
                <use
                    href={`#${pathIds.serPlayers}`}
                    className={`${styles.flow} ${styles.flowAsync} ${enabled ? '' : styles.flowDisabled}`}
                />

                {/* sync fallback flow lines (main thread does everything itself) */}
                {!enabled && (
                    <g className={styles.modeGroup}>
                        <use href={`#${pathIds.syncIoFwd}`} className={`${styles.flow} ${styles.flowBlocked}`} />
                        <use href={`#${pathIds.syncSend}`} className={`${styles.flow} ${styles.flowBlocked}`} />
                    </g>
                )}

                {/* crossed-out marks on async paths when disabled */}
                <g className={`${styles.cross} ${enabled ? styles.gone : ''}`}>
                    <line x1="161" y1="225" x2="179" y2="243" />
                    <line x1="161" y1="243" x2="179" y2="225" />
                    <line x1="339" y1="226" x2="357" y2="244" />
                    <line x1="339" y1="244" x2="357" y2="226" />
                    <line x1="295" y1="106" x2="313" y2="124" />
                    <line x1="295" y1="124" x2="313" y2="106" />
                    <line x1="438" y1="53" x2="456" y2="71" />
                    <line x1="438" y1="71" x2="456" y2="53" />
                </g>

                {/* async packets: blue = read/send, orange = save */}
                {renderPackets(pathIds.ioFwd, ['0s', '-1s', '-2s'], asyncDur, false, !enabled)}
                {renderPackets(pathIds.ioRev, ['-0.5s'], '3s', true, !enabled)}
                {renderPackets(pathIds.mainIo, ['-0.5s'], '3s', true, !enabled)}
                {renderPackets(pathIds.mainIoRev, ['0s', '-1.5s'], '1.5s', false, !enabled)}
                {renderPackets(pathIds.mainSer, ['0s', '-1s', '-2s'], asyncDur, false, !enabled)}
                {renderPackets(pathIds.serPlayers, ['0s', '-0.7s', '-1.4s'], asyncDur, false, !enabled)}

                {/* sync fallback packets (slow, blocking the main thread) */}
                {!enabled && (
                    <>
                        {renderPackets(pathIds.syncIoFwd, ['0s', '-1.75s'], syncDur)}
                        {renderPackets(pathIds.syncIoRev, ['-1s'], syncDur, true)}
                        {renderPackets(pathIds.syncSend, ['0s', '-1s', '-2s'], syncDur)}
                    </>
                )}

                {/* storage box */}
                <g className={styles.node}>
                    <rect x="12" y="150" width="110" height="56" rx="8" className={styles.box} />
                    <text x="67" y="182" textAnchor="middle" className={styles.label}>
                        {labelStorage}
                    </text>
                </g>

                {/* main thread box */}
                <g className={styles.node}>
                    <rect x="248" y="144" width="144" height="64" rx="8" className={`${styles.box} ${styles.boxMain}`} />
                    <text x="320" y="170" textAnchor="middle" className={styles.label}>
                        {labelMainThread}
                    </text>
                    {/* load meter */}
                    <rect x="258" y="190" width="124" height="8" rx="4" className={styles.loadTrack} />
                    <rect
                        x="258"
                        y="190"
                        height="8"
                        rx="4"
                        width={enabled ? 40 : 112}
                        className={`${styles.loadFill} ${enabled ? styles.loadLow : styles.loadHigh}`}
                    />
                    <text x="396" y="199" className={styles.loadLabel}>
                        {labelLoad}
                    </text>
                </g>

                {/* async chunk thread box (serialize/encode for sending) */}
                <g className={`${styles.node} ${enabled ? '' : styles.asyncBoxDisabled}`}>
                    <rect x="248" y="30" width="144" height="56" rx="8" className={`${styles.box} ${styles.boxAsync} ${enabled ? '' : styles.boxDisabled}`} />
                    <text x="320" y="54" textAnchor="middle" className={`${styles.label} ${enabled ? '' : styles.labelDisabled}`}>
                        {labelAsyncChunk}
                    </text>
                    <text x="320" y="72" textAnchor="middle" className={`${styles.mono} ${enabled ? '' : styles.labelDisabled}`}>
                        {labelAsyncChunkSub}
                    </text>
                </g>

                {/* async IO thread box (read/decode + encode/save) */}
                <g className={`${styles.node} ${enabled ? '' : styles.asyncBoxDisabled}`}>
                    <rect x="248" y="262" width="144" height="56" rx="8" className={`${styles.box} ${styles.boxAsync} ${enabled ? '' : styles.boxDisabled}`} />
                    <text x="320" y="286" textAnchor="middle" className={`${styles.label} ${enabled ? '' : styles.labelDisabled}`}>
                        {labelAsyncIo}
                    </text>
                    <text x="320" y="304" textAnchor="middle" className={`${styles.mono} ${enabled ? '' : styles.labelDisabled}`}>
                        {labelAsyncIoSub}
                    </text>
                </g>

                {/* players box */}
                <g className={styles.node}>
                    <rect x="508" y="44" width="120" height="56" rx="8" className={styles.box} />
                    <text x="568" y="76" textAnchor="middle" className={styles.label}>
                        {labelPlayers}
                    </text>
                </g>
            </svg>
        </div>
    );
};

export default AsyncChunksDemo;
