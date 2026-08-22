import React, { useState } from 'react';
import styles from './styles.module.css';

interface Props {
    labelTickTime?: string;
    labelTps?: string;
    labelWorldTicks?: string;
    descOn?: string;
    descOff?: string;
}

// `auto-tick-rate-limit` defaults to 20
const AUTO_TICK_RATE_LIMIT = 20;

const AutoTickRateDemo: React.FC<Props> = ({
    labelTickTime = 'Simulated tick time',
    labelTps = 'Server TPS',
    labelWorldTicks = 'World tick speed',
    descOn = 'TPS stays at 20 — the overloaded world ticks less often instead (tickRate rises).',
    descOff = 'The world keeps ticking every server tick, so the whole server slows below 20 TPS.',
}) => {
    // `auto-tick-rate` defaults to `on`
    const [enabled, setEnabled] = useState(true);
    const [tickMs, setTickMs] = useState(90);

    // Server.java: tickMs >= 50 raises the level tickRate (capped by auto-tick-rate-limit),
    // so the world ticks less often and the server loop keeps 20 TPS.
    const tickRate =
        enabled && tickMs >= 50
            ? Math.max(2, Math.min(AUTO_TICK_RATE_LIMIT, Math.floor(tickMs / 50)))
            : 1;
    const tps = enabled ? 20 : Math.min(20, Math.round((1000 / tickMs) * 10) / 10);
    const worldTps = enabled ? Math.round((20 / tickRate) * 10) / 10 : tps;
    const worldPct = Math.round((worldTps / 20) * 100);

    const tpsClass = tps >= 20 ? styles.ok : tps >= 15 ? styles.warn : styles.bad;
    const worldClass = worldPct >= 100 ? styles.ok : worldPct >= 50 ? styles.warn : styles.bad;

    // one second of server ticks; green cells are ticks where the world actually ticks
    const serverTicks = Math.round(tps);

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
                <code>auto-tick-rate</code>
                <span className={enabled ? styles.stateOn : styles.stateOff}>
                    {enabled ? 'on' : 'off'}
                </span>
            </label>

            <div className={styles.sliderRow}>
                <code>
                    {labelTickTime} = {tickMs} ms
                </code>
                <input
                    type="range"
                    min={20}
                    max={200}
                    step={10}
                    value={tickMs}
                    onChange={e => setTickMs(Number(e.target.value))}
                />
                <div className={styles.tickLabels}>
                    <span>20 ms</span>
                    <span>200 ms</span>
                </div>
            </div>
            <p className={styles.caption}>{enabled ? descOn : descOff}</p>

            <div className={styles.meterRow}>
                <span className={styles.meterLabel}>{labelTps}</span>
                <span className={styles.meterTrack}>
                    <span className={`${styles.meterFill} ${tpsClass}`} style={{ width: `${(tps / 20) * 100}%` }} />
                </span>
                <code>{tps} / 20</code>
            </div>
            <div className={styles.meterRow}>
                <span className={styles.meterLabel}>{labelWorldTicks}</span>
                <span className={styles.meterTrack}>
                    <span className={`${styles.meterFill} ${worldClass}`} style={{ width: `${worldPct}%` }} />
                </span>
                <code>
                    {worldTps}/s · tickRate = {tickRate}
                </code>
            </div>

            <svg className={styles.strip} width={20 * 28 - 4} height="14" role="img">
                {Array.from({ length: 20 }, (_, i) => {
                    const active = i < serverTicks;
                    const worldTick = active && i % tickRate === 0;
                    return (
                        <rect
                            key={i}
                            x={i * 28}
                            y="0"
                            width="24"
                            height="14"
                            rx="3"
                            className={worldTick ? styles.stripWorld : active ? styles.stripActive : styles.stripIdle}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

export default AutoTickRateDemo;
