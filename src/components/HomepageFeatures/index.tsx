import {useEffect, useRef} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

type FeatureItem = {
  ariaLabelId: string;
  /** 默认语言下的 aria-label 兜底文案：缺失翻译时 translate 会回退到 id 字符串 */
  ariaLabelMessage: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  title: React.ReactNode;
  description: React.ReactNode;
  /** “了解更多”深链目标：链到该特性最相关的文档页/锚点（Link 自动补 locale 前缀） */
  href: string;
};

const FeatureList: FeatureItem[] = [
  {
    ariaLabelId: 'homepage.feature.multipleVersion.title',
    ariaLabelMessage: 'Multiple Version Support',
    Svg: require('@site/static/img/multiple_version_support.svg').default,
    title: (
      <Translate id="homepage.feature.multipleVersion.title">
        Multiple Version Support
      </Translate>
    ),
    description: (
      <Translate id="homepage.feature.multipleVersion.description">
        Supports versions from 1.1 to the latest, allowing you to set the minimum protocol in the config for seamless gameplay.
      </Translate>
    ),
    href: '/docs/user-guide/server-config/nukkit-mot-yml#multiversion-min-protocol',
  },
  {
    ariaLabelId: 'homepage.feature.aiEntity.title',
    ariaLabelMessage: 'AI Entity Support',
    Svg: require('@site/static/img/ai_entity_support.svg').default,
    title: (
      <Translate id="homepage.feature.aiEntity.title">
        AI Entity Support
      </Translate>
    ),
    description: (
      <Translate id="homepage.feature.aiEntity.description">
        Most entities with AI are fully supported, ensuring a dynamic and immersive environment for players.
      </Translate>
    ),
    href: '/docs/user-guide/server-config/nukkit-mot-yml#entity-settings',
  },
  {
    ariaLabelId: 'homepage.feature.vanillaCommand.title',
    ariaLabelMessage: 'Vanilla Command Support',
    Svg: require('@site/static/img/vanilla_command_support.svg').default,
    title: (
      <Translate id="homepage.feature.vanillaCommand.title">
        Vanilla Command Support
      </Translate>
    ),
    description: (
      <Translate id="homepage.feature.vanillaCommand.description">
        Fully supports vanilla commands, allowing you to manage and enhance gameplay with familiar commands.
      </Translate>
    ),
    href: '/docs/intro#whats-new',
  },
  {
    ariaLabelId: 'homepage.feature.comprehensiveBlock.title',
    ariaLabelMessage: 'Comprehensive Block Support',
    Svg: require('@site/static/img/comprehensive_block_support.svg').default,
    title: (
      <Translate id="homepage.feature.comprehensiveBlock.title">
        Comprehensive Block Support
      </Translate>
    ),
    description: (
      <Translate id="homepage.feature.comprehensiveBlock.description">
        Built-in support for a broader range of vanilla blocks and newer-version variants, with placement, interaction, block entities, and redstone behavior continually brought closer to vanilla.
      </Translate>
    ),
    href: '/docs/user-guide/server-config/nukkit-mot-yml#custom-block-settings',
  },
  {
    ariaLabelId: 'homepage.feature.neteaseClient.title',
    ariaLabelMessage: 'NetEase Client Support',
    Svg: require('@site/static/img/netease_client_support.svg').default,
    title: (
      <Translate id="homepage.feature.neteaseClient.title">
        NetEase Client Support
      </Translate>
    ),
    description: (
      <Translate id="homepage.feature.neteaseClient.description">
        Seamlessly supports NetEase Minecraft clients alongside standard ones, with custom resource and behavior packs for the Chinese audience.
      </Translate>
    ),
    href: '/docs/user-guide/getting-started/connect#supported-clients',
  },
  {
    ariaLabelId: 'homepage.feature.pluginApi.title',
    ariaLabelMessage: 'Rich Plugin API',
    Svg: require('@site/static/img/plugin_api_support.svg').default,
    title: (
      <Translate id="homepage.feature.pluginApi.title">
        Rich Plugin API
      </Translate>
    ),
    description: (
      <Translate id="homepage.feature.pluginApi.description">
        A mature plugin ecosystem covering events, forms, scoreboards, and custom blocks, items, enchantments & recipes — extend the server your way.
      </Translate>
    ),
    href: '/docs/developer-guide/tutorial-basics/frist_java_plugin',
  },
];

function Feature({
  ariaLabelId,
  ariaLabelMessage,
  Svg,
  title,
  description,
  href,
  reversed,
}: FeatureItem & {reversed: boolean}) {
  return (
    <div className={clsx(styles.featureRow, reversed && styles.featureRowReverse)} data-reveal>
      <div className={styles.featureMedia}>
        <Svg className={styles.featureSvg} role="img" aria-label={translate({id: ariaLabelId, message: ariaLabelMessage})} />
      </div>
      <div className={styles.featureContent}>
        <Heading as="h2">{title}</Heading>
        <p>{description}</p>
        <Link className={styles.featureLink} to={href}>
          <Translate id="homepage.feature.learnMore" description="Feature deep link leading to the related docs page">
            Learn more
          </Translate>
          <span className={styles.featureLinkArrow} aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): React.ReactElement {
  const sectionRef = useRef<HTMLElement>(null);

  // SVG 内 SMIL 动画在 prefers-reduced-motion 或滚出视口时暂停（CSS 媒体查询无法控制 SMIL）
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    const svgs = Array.from(section.querySelectorAll('svg'));
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    // 默认视为全部可见；支持 IntersectionObserver 时再按实际可见性收窄
    const inView = new Set<Element>(svgs);
    const sync = () => {
      svgs.forEach((svg) => {
        const svgEl = svg as SVGSVGElement;
        if (mq.matches || !inView.has(svg)) {
          svgEl.pauseAnimations?.();
        } else {
          svgEl.unpauseAnimations?.();
        }
      });
    };
    sync();
    mq.addEventListener('change', sync);
    let observer: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      inView.clear();
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            inView.add(entry.target);
          } else {
            inView.delete(entry.target);
          }
        });
        sync();
      });
      svgs.forEach((svg) => io.observe(svg));
      observer = io;
    }
    return () => {
      mq.removeEventListener('change', sync);
      observer?.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.features}>
      <div className="container">
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} reversed={idx % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
