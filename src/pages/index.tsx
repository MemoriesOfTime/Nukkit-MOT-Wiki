import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import Translate from '@docusaurus/Translate';
import { useEffect } from 'react';
import { redirectToLanguageVersion } from '../redirects';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          <Translate
            id="homepage.title"
            description="The homepage title"
            values={{}}>
            {siteConfig.title}
          </Translate>
        </Heading>
        <p className="hero__subtitle">
          <Translate
            id="homepage.subtitle"
            description="The homepage subtitle"
            values={{}}>
            {siteConfig.tagline}
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="https://motci.cn/job/Nukkit-MOT/job/master/">
            <Translate
              id="homepage.downloadNukkitMot"
              description="The homepage message to ask the user to download nukkit-mot">
              🌐 Download
            </Translate>
          </Link>

          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            <Translate
              id="homepage.visitDocs"
              description="The homepage message to ask the user to visit docs">
              📖 Let's Go
            </Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  useEffect(() => {
    redirectToLanguageVersion();
  }, []);

  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main className={clsx(styles.heroMain)}>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
