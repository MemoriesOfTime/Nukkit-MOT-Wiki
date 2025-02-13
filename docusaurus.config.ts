import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import prismLight from './src/utils/prismLight';
import prismDark from './src/utils/prismDark';

const config: Config = {
  title: 'Nukkit Memories Of Time',
  tagline: 'A Minecraft server with multiple versions, built-in AI entities, and extensive plugin compatibility.',
  favicon: 'images/favicon.ico',

  // Set the production url of your site here
  url: 'https://www.nukkit-mot.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'MemoriesOfTime', // Usually your GitHub org/user name.
  projectName: 'Nukkit-MOT-Wiki', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],// https://zh.wikipedia.org/wiki/ISO_639-1%E4%BB%A3%E7%A0%81%E5%88%97%E8%A1%A8
    localeConfigs: {
      en: {
        htmlLang: 'en-US'
      },
      zh: {
        label: '汉语',
        htmlLang: 'zh'
      }
    }
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/MemoriesOfTime/Nukkit-MOT-Wiki/tree/master/',
          editLocalizedFiles: true
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/MemoriesOfTime/Nukkit-MOT-Wiki/tree/master/',
          editLocalizedFiles: true
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    // Replace with your project's social card
    image: 'images/banner.png',
    navbar: {
      title: 'NK-MOT Wiki',
      logo: {
        alt: 'Memories Of Time Logo',
        src: 'images/logo.png',
      },
      items: [
        /*{
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },*/
        {
          type: 'localeDropdown',
          position: 'right',
          // queryString: '?lang=en' //TODO: This configuration does not get the locale. 此配置暂时无法获取 locale
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial Basics',
              to: '/docs/category/tutorial-basics',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/pJjQDQC',
            },
            {
              label: 'QQ Group',
              href: 'https://qm.qq.com/q/FKyS4IT9As',
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/MemoriesOfTime/Nukkit-MOT',
            },
            {
              label: 'Forums',
              href: 'https://bbs.nukkit-mot.com/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Memories Of Time`,
    },
    docs: {
      sidebar: {
        hideable: true,
        //autoCollapseCategories: true,
      },
    },
    prism: {
      additionalLanguages: ['java', 'yaml', 'json', 'log', 'ini'],
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: {start: 'highlight-start', end: 'highlight-end'},
        },
        {
          className: 'code-block-error-line',
          line: 'This will error',
        },
      ],
      theme: prismLight,
      darkTheme: prismDark,
    },
    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },
    algolia: {
      // The application ID provided by Algolia
      appId: '5X0VFG8RCG',

      // Public API key: it is safe to commit it
      apiKey: '4fcf7e81c052c0dab7ac1710b228c6ce',

      indexName: 'nukkit-mot',

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      externalUrlRegex: 'nukkit-mot\\.com|www\\.nukkit-mot\\.com',

      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      replaceSearchResultPathname: {
        from: '/docs/', // or as RegExp: /\/docs\//
        to: '/',
      },

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',
    },
  } satisfies Preset.ThemeConfig,
  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],
  ]
};

export default config;
