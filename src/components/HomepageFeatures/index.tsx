import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Multiple Version Support',
    Svg: require('@site/static/img/multiple_version_support.svg').default,
    description: (
      <>
        Supports versions from 1.2 to the latest, allowing you to set the minimum protocol in the config for seamless gameplay.
      </>
    ),
  },
  {
    title: 'AI Entity Support',
    Svg: require('@site/static/img/ai_entity_support.svg').default,
    description: (
      <>
        Most entities with AI are fully supported, ensuring a dynamic and immersive environment for players.
      </>
    ),
  },
  {
    title: 'Vanilla Command Support',
    Svg: require('@site/static/img/vanilla_command_support.svg').default,
    description: (
      <>
        Fully supports vanilla commands, allowing you to manage and enhance gameplay with familiar commands.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
