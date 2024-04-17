# 📚 Nukkit-MOT Wiki

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## 🛠️ Installation

```bash
$ yarn
```

## 🖥️ Local Development

```bash
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

> run `yarn start --locale zh` to running the Chinese version.
>
> `zh` is the language code. refer to [List of ISO 639 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) for more details.

## 🏗️ Build

```bash
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## 🎉 Innovation

### 🌍 Add a new language

```bash
$ yarn write-translations --locale <language code>
```

refer to [Adding a new language](https://docusaurus.io/docs/i18n/tutorial#adding-a-new-language) for more details.

### 🚀 Release a new version

```bash
$ yarn docusaurus docs:version <version>
```

refer to [Publishing a new version](https://docusaurus.io/docs/i18n/tutorial#publishing-a-new-version) for more details.

**Note**: Typically, Nukkit-MOT is only used during significant refactoring, although such a scenario is unlikely to occur in the near future.