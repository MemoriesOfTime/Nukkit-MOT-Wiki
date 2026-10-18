import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

interface Props {
    labelBudget?: string;
    labelPending?: string;
    labelPerTick?: string;
    labelCleared?: string;
    labelTicks?: string;
    labelSeconds?: string;
    labelPlay?: string;
    labelPause?: string;
    labelReset?: string;
    caption?: string;
}

// One teleport-sized pull request: the client asks for this many sub-chunks at once.
const TOTAL = 512;
const TICK_MS = 130;

interface DrainState {
    pending: number;
    answered: number;
    ticks: number;
}

const SubChunkBudgetDemo: React.FC<Props> = ({
    labelBudget = 'subchunk-entries-per-tick',
    labelPending = 'queued offsets',
    labelPerTick = 'answered this tick',
    labelCleared = 'queue clears in',
    labelTicks = 'ticks',
    labelSeconds = 's',
    labelPlay = 'Start',
    labelPause = 'Pause',
    labelReset = 'Reset',
    caption = 'A client that teleports asks for hundreds of sub-chunks at once. The server answers at most subchunk-entries-per-tick of them per tick and requeues the rest, so a big request stretches over several ticks instead of stalling one.',
}) => {
    const [budget, setBudget] = useState(64);
    const [state, setState] = useState<DrainState>({ pending: TOTAL, answered: 0, ticks: 0 });
    const [playing, setPlaying] = useState(true);

    useEffect(() => {
        if (!playing) {
            return;
        }
        const id = setInterval(() => {
            setState(prev => {
                if (prev.pending <= 0) {
                    return prev;
                }
                const served = Math.min(budget, prev.pending);
                return { pending: prev.pending - served, answered: served, ticks: prev.ticks + 1 };
            });
        }, TICK_MS);
        return () => clearInterval(id);
    }, [playing, budget]);

    const done = state.pending === 0;

    // Stop the clock once the queue is drained; the interval above would
    // otherwise keep firing no-op updates forever.
    useEffect(() => {
        if (done) {
            setPlaying(false);
        }
    }, [done]);

    const ticksNeeded = Math.ceil(TOTAL / budget);
    const cells = Math.min(ticksNeeded, 64);

    const reset = () => {
        setState({ pending: TOTAL, answered: 0, ticks: 0 });
        setPlaying(true);
    };

    return (
        <div className={styles.demo}>
            <div className={styles.controls}>
                <div className={styles.sliderRow}>
                    <code>
                        {labelBudget} = {budget}
                    </code>
                    <input
                        type="range"
                        min={16}
                        max={256}
                        step={16}
                        value={budget}
                        onChange={e => {
                            setBudget(Number(e.target.value));
                            reset();
                        }}
                    />
                    <div className={styles.tickLabels}>
                        <span>16</span>
                        <span>256</span>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <button type="button" className={styles.button} onClick={() => setPlaying(p => !p)} disabled={done}>
                        {playing ? labelPause : labelPlay}
                    </button>
                    <button type="button" className={styles.buttonGhost} onClick={reset}>
                        {labelReset}
                    </button>
                </div>
            </div>

            <div className={styles.queue}>
                <div className={styles.queueHead}>
                    <span className={styles.queueLabel}>{labelPending}</span>
                    <span className={styles.queueValue}>
                        {state.pending} / {TOTAL}
                    </span>
                </div>
                <div className={styles.queueTrack}>
                    <div className={styles.queueFill} style={{ width: `${(state.pending / TOTAL) * 100}%` }} />
                </div>
            </div>

            <svg className={styles.strip} viewBox={`0 0 ${Math.max(cells * 12, 120)} 34`} role="img">
                {Array.from({ length: cells }, (_, i) => {
                    const served = i < state.ticks - 1 ? budget : i === state.ticks - 1 ? state.answered : 0;
                    const fill =
                        served === 0 ? styles.cellIdle : served >= budget ? styles.cellFull : styles.cellPartial;
                    return <rect key={i} x={i * 12} y={4} width={9} height={26} rx={2} className={fill} />;
                })}
            </svg>

            <div className={styles.stats}>
                <span>
                    {labelPerTick}: <strong>{state.answered}</strong>
                </span>
                <span>
                    {labelCleared}: <strong>{ticksNeeded}</strong> {labelTicks} ≈{' '}
                    <strong>{(ticksNeeded / 20).toFixed(2)}</strong> {labelSeconds}
                </span>
            </div>

            <p className={styles.caption}>{caption}</p>
        </div>
    );
};

export default SubChunkBudgetDemo;
