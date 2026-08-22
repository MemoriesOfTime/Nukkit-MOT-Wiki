import React, { useId, useState } from 'react';
import styles from './styles.module.css';

interface Props {
    labelThread1?: string;
    labelThread2?: string;
    labelPlayers?: string;
    labelDeflater?: string;
    labelSharedDeflater?: string;
    desc0?: string;
    desc1?: string;
    desc2?: string;
}

const PROVIDERS = [
    { value: 0, name: 'ZlibOriginal' },
    { value: 1, name: 'ZlibSingleThreadLowMem' },
    { value: 2, name: 'ZlibThreadLocal' },
];

const ZlibProviderDemo: React.FC<Props> = ({
    labelThread1 = 'Thread 1',
    labelThread2 = 'Thread 2',
    labelPlayers = 'Players',
    labelDeflater = 'Deflater',
    labelSharedDeflater = 'Shared Deflater',
    desc0 = 'Creates a new Deflater on every call — extra allocations and GC pressure.',
    desc1 = 'One shared synchronized instance — low memory, but threads queue up and compress one at a time.',
    desc2 = 'Each thread keeps its own Deflater — no repeated allocation, no lock contention.',
}) => {
    // `zlib-provider` defaults to `2`
    const [provider, setProvider] = useState(2);
    const uid = useId();

    const pathIds = {
        t1ToA: `${uid}-t1-a`,
        aToPlayers: `${uid}-a-players`,
        t2ToB: `${uid}-t2-b`,
        bToPlayers: `${uid}-b-players`,
        t1ToShared: `${uid}-t1-shared`,
        t2ToShared: `${uid}-t2-shared`,
        sharedToPlayers: `${uid}-shared-players`,
    };

    const desc = provider === 0 ? desc0 : provider === 1 ? desc1 : desc2;

    const renderPackets = (pathId: string, offsets: string[], dur: string) =>
        offsets.map((begin, i) => (
            <circle key={`${pathId}-${i}`} r="4" className={styles.packet}>
                <animateMotion dur={dur} begin={begin} repeatCount="indefinite">
                    <mpath href={`#${pathId}`} />
                </animateMotion>
            </circle>
        ));

    // Modes 0 and 2 use one Deflater per thread; mode 1 funnels both threads into a shared instance.
    const dualFlowClass = provider === 0 ? styles.flowOrange : styles.flowGreen;
    const dualBoxClass = provider === 0 ? styles.boxOrange : styles.boxGreen;

    return (
        <div className={styles.demo}>
            <div className={styles.selector}>
                {PROVIDERS.map(p => (
                    <button
                        key={p.value}
                        type="button"
                        className={`${styles.segBtn} ${provider === p.value ? styles.segBtnActive : ''}`}
                        onClick={() => setProvider(p.value)}
                    >
                        {p.value} · {p.name}
                    </button>
                ))}
            </div>
            <p className={styles.caption}>{desc}</p>

            <svg className={styles.stage} viewBox="0 0 640 300" role="img">
                <defs>
                    <path id={pathIds.t1ToA} d="M122,67 L240,67" />
                    <path id={pathIds.aToPlayers} d="M380,67 C440,67 450,150 508,150" />
                    <path id={pathIds.t2ToB} d="M122,233 L240,233" />
                    <path id={pathIds.bToPlayers} d="M380,233 C440,233 450,150 508,150" />
                    <path id={pathIds.t1ToShared} d="M122,67 C190,67 190,150 240,150" />
                    <path id={pathIds.t2ToShared} d="M122,233 C190,233 190,150 240,150" />
                    <path id={pathIds.sharedToPlayers} d="M380,150 L508,150" />
                </defs>

                {provider === 1 ? (
                    <g key="shared" className={styles.modeGroup}>
                        {/* flow lines */}
                        <use href={`#${pathIds.t1ToShared}`} className={`${styles.flow} ${styles.flowRed}`} />
                        <use href={`#${pathIds.t2ToShared}`} className={`${styles.flow} ${styles.flowRed}`} />
                        <use href={`#${pathIds.sharedToPlayers}`} className={`${styles.flow} ${styles.flowRed}`} />

                        {/* packets trickle through the shared lock one at a time */}
                        {renderPackets(pathIds.t1ToShared, ['0s'], '3.5s')}
                        {renderPackets(pathIds.t2ToShared, ['-1.75s'], '3.5s')}
                        {renderPackets(pathIds.sharedToPlayers, ['0s', '-2.4s'], '4.8s')}

                        {/* threads waiting on the synchronized lock */}
                        <circle cx="208" cy="150" r="3" className={styles.queueDot} />
                        <circle cx="220" cy="150" r="3" className={styles.queueDot} style={{ animationDelay: '0.5s' }} />
                        <circle cx="232" cy="150" r="3" className={styles.queueDot} style={{ animationDelay: '1s' }} />

                        {/* shared deflater box */}
                        <rect x="240" y="128" width="140" height="44" rx="8" className={`${styles.box} ${styles.boxRed}`} />
                        <text x="310" y="146" textAnchor="middle" className={styles.label}>
                            {labelSharedDeflater}
                        </text>
                        <text x="310" y="163" textAnchor="middle" className={styles.mono}>
                            synchronized
                        </text>
                    </g>
                ) : (
                    <g key="dual" className={styles.modeGroup}>
                        {/* flow lines */}
                        <use href={`#${pathIds.t1ToA}`} className={`${styles.flow} ${dualFlowClass}`} />
                        <use href={`#${pathIds.aToPlayers}`} className={`${styles.flow} ${dualFlowClass}`} />
                        <use href={`#${pathIds.t2ToB}`} className={`${styles.flow} ${dualFlowClass}`} />
                        <use href={`#${pathIds.bToPlayers}`} className={`${styles.flow} ${dualFlowClass}`} />

                        {/* packets */}
                        {renderPackets(pathIds.t1ToA, ['0s', '-1s'], provider === 0 ? '2.8s' : '2s')}
                        {renderPackets(pathIds.aToPlayers, ['0s', '-1s'], provider === 0 ? '2.8s' : '2s')}
                        {renderPackets(pathIds.t2ToB, ['-0.5s', '-1.5s'], provider === 0 ? '2.8s' : '2s')}
                        {renderPackets(pathIds.bToPlayers, ['-0.5s', '-1.5s'], provider === 0 ? '2.8s' : '2s')}

                        {/* per-thread deflater boxes */}
                        <rect x="240" y="45" width="140" height="44" rx="8" className={`${styles.box} ${dualBoxClass}`} />
                        <text x="310" y="71" textAnchor="middle" className={styles.label}>
                            {labelDeflater}
                        </text>
                        <rect x="240" y="211" width="140" height="44" rx="8" className={`${styles.box} ${dualBoxClass}`} />
                        <text x="310" y="237" textAnchor="middle" className={styles.label}>
                            {labelDeflater}
                        </text>

                        {/* ZlibOriginal re-creates the objects on every call */}
                        {provider === 0 && (
                            <>
                                <text x="310" y="105" textAnchor="middle" className={`${styles.mono} ${styles.blink}`}>
                                    new Deflater()
                                </text>
                                <text x="310" y="271" textAnchor="middle" className={`${styles.mono} ${styles.blink}`} style={{ animationDelay: '0.6s' }}>
                                    new Deflater()
                                </text>
                            </>
                        )}
                    </g>
                )}

                {/* thread boxes */}
                <g>
                    <rect x="12" y="45" width="110" height="44" rx="8" className={styles.box} />
                    <text x="67" y="71" textAnchor="middle" className={styles.label}>
                        {labelThread1}
                    </text>
                </g>
                <g>
                    <rect x="12" y="211" width="110" height="44" rx="8" className={styles.box} />
                    <text x="67" y="237" textAnchor="middle" className={styles.label}>
                        {labelThread2}
                    </text>
                </g>

                {/* players box */}
                <g>
                    <rect x="508" y="128" width="120" height="44" rx="8" className={styles.box} />
                    <text x="568" y="154" textAnchor="middle" className={styles.label}>
                        {labelPlayers}
                    </text>
                </g>
            </svg>
        </div>
    );
};

export default ZlibProviderDemo;
