import React from 'react';
import styles from './styles.module.css';

interface Props {
    labelTcp?: string;
    labelUdp?: string;
    labelSignaling?: string;
    labelRaknet?: string;
    labelMedia?: string;
    labelIpv6Idle?: string;
    legendActive?: string;
    legendIdle?: string;
    caption?: string;
}

/**
 * Port usage of a default Nukkit-MOT config (server-port=19132, NetherNet on,
 * server-udp-ports=19134): TCP+UDP 19132 and UDP 19134 are listening, the rest
 * of the 1913x row stays free.
 */
const DefaultPortsGrid: React.FC<Props> = ({
    labelTcp = 'TCP',
    labelUdp = 'UDP',
    labelSignaling = 'NetherNet signaling',
    labelRaknet = 'RakNet',
    labelMedia = 'NetherNet media (ICE mux)',
    labelIpv6Idle = 'IPv6 listener (off by default)',
    legendActive = 'listening by default',
    legendIdle = 'not used by default',
    caption = 'Port usage with the default configuration (server-port=19132, NetherNet enabled, server-udp-ports=19134)',
}) => (
    <figure className={styles.figure}>
        <div className={styles.grid} role="table" aria-label={caption}>
            <div className={`${styles.cell} ${styles.cellHead}`} role="columnheader" />
            <div className={`${styles.cell} ${styles.cellHead}`} role="columnheader">19132</div>
            <div className={`${styles.cell} ${styles.cellHead}`} role="columnheader">19133</div>
            <div className={`${styles.cell} ${styles.cellHead}`} role="columnheader">19134</div>

            <div className={`${styles.cell} ${styles.cellHead}`} role="rowheader">{labelTcp}</div>
            <div className={`${styles.cell} ${styles.cellActive}`} role="cell">{labelSignaling}</div>
            <div className={`${styles.cell} ${styles.cellIdle}`} role="cell">—</div>
            <div className={`${styles.cell} ${styles.cellIdle}`} role="cell">—</div>

            <div className={`${styles.cell} ${styles.cellHead}`} role="rowheader">{labelUdp}</div>
            <div className={`${styles.cell} ${styles.cellActive}`} role="cell">{labelRaknet}</div>
            <div className={`${styles.cell} ${styles.cellIdle} ${styles.cellNote}`} role="cell">{labelIpv6Idle}</div>
            <div className={`${styles.cell} ${styles.cellActive}`} role="cell">{labelMedia}</div>
        </div>
        <figcaption className={styles.legend}>
            <span className={styles.legendItem}>
                <span className={`${styles.swatch} ${styles.swatchActive}`} aria-hidden="true" />
                {legendActive}
            </span>
            <span className={styles.legendItem}>
                <span className={`${styles.swatch} ${styles.swatchIdle}`} aria-hidden="true" />
                {legendIdle}
            </span>
        </figcaption>
    </figure>
);

export default DefaultPortsGrid;
