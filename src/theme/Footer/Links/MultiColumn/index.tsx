import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import LinkItem from '@theme/Footer/LinkItem';
import type {Props} from '@theme/Footer/Links/MultiColumn';
import styles from './styles.module.css';

type ColumnType = Props['columns'][number];
type ColumnItemType = ColumnType['items'][number];

function ColumnLinkItem({item}: {item: ColumnItemType}) {
  return item.html ? (
    <li
      className={clsx('footer__item', item.className)}
      // HTML is configured by the site, so render it directly.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: item.html}}
    />
  ) : (
    <li key={item.href ?? item.to} className="footer__item">
      <LinkItem item={item} />
    </li>
  );
}

function DesktopColumn({column}: {column: ColumnType}) {
  return (
    <div
      className={clsx(
        ThemeClassNames.layout.footer.column,
        'col footer__col',
        styles.desktopColumn,
        column.className,
      )}>
      <div className="footer__title">{column.title}</div>
      <ul className="footer__items clean-list">
        {column.items.map((item, i) => (
          <ColumnLinkItem key={item.href ?? item.to ?? i} item={item} />
        ))}
      </ul>
    </div>
  );
}

function MobileColumn({column}: {column: ColumnType}) {
  return (
    <details className={clsx(styles.accordion, column.className)}>
      <summary className={styles.accordionSummary}>{column.title}</summary>
      <ul className={clsx('footer__items clean-list', styles.accordionItems)}>
        {column.items.map((item, i) => (
          <ColumnLinkItem key={item.href ?? item.to ?? i} item={item} />
        ))}
      </ul>
    </details>
  );
}

export default function FooterLinksMultiColumn({columns}: Props): ReactNode {
  return (
    <>
      <div className={clsx('row footer__links', styles.desktopLinks)}>
        {columns.map((column, i) => (
          <DesktopColumn key={i} column={column} />
        ))}
      </div>

      <div className={clsx('footer__links', styles.mobileLinks)}>
        {columns.map((column, i) => (
          <MobileColumn key={i} column={column} />
        ))}
      </div>
    </>
  );
}
