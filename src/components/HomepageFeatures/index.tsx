import {useEffect, useRef} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

type FeatureItem = {
  ariaLabelId: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  title: React.ReactNode;
  description: React.ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    ariaLabelId: 'homepage.feature.multipleVersion.title',
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
  },
  {
    ariaLabelId: 'homepage.feature.aiEntity.title',
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
  },
  {
    ariaLabelId: 'homepage.feature.vanillaCommand.title',
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
  },
  {
    ariaLabelId: 'homepage.feature.comprehensiveBlock.title',
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
  },
  {
    ariaLabelId: 'homepage.feature.neteaseClient.title',
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
  },
  {
    ariaLabelId: 'homepage.feature.pluginApi.title',
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
  },
];

function Feature({
  ariaLabelId,
  Svg,
  title,
  description,
  reversed,
}: FeatureItem & {reversed: boolean}) {
  return (
    <div className={clsx(styles.featureRow, reversed && styles.featureRowReverse)} data-reveal>
      <div className={styles.featureMedia}>
        <Svg className={styles.featureSvg} role="img" aria-label={translate({id: ariaLabelId})} />
      </div>
      <div className={styles.featureContent}>
        <Heading as="h2">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): React.ReactElement {
  const sectionRef = useRef<HTMLElement>(null);

  // prefers-reduced-motion 下暂停 SVG 内 SMIL 动画（CSS 媒体查询无法控制 SMIL）
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    const svgs = section.querySelectorAll('svg');
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      svgs.forEach((svg) => {
        const svgEl = svg as SVGSVGElement;
        if (mq.matches) {
          svgEl.pauseAnimations?.();
        } else {
          svgEl.unpauseAnimations?.();
        }
      });
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
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
