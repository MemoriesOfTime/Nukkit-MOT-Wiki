---
sidebar_position: 4
---

# Install Plugins

Nukkit supports extending server functionality through plugins, such as adding new gameplay mechanics, management tools, economy systems, etc.

## Getting Plugins

You can download Nukkit plugins from the following sources:

- [Cloudburst (Nukkit Forum)](https://cloudburstmc.org/resources/categories/nukkit-plugins.1/) - Official plugin repository
- [MineBBS](https://www.minebbs.com/resources/categories/nukkit.40/) - Chinese community plugin repository
- [GitHub](https://github.com/) - Search for open-source plugin projects

:::tip Tips
When downloading plugins, please note:
- Confirm the plugin supports your Nukkit version
- Check plugin dependencies
- Read the plugin usage instructions
:::

## Installing Plugins

### Installation Steps

1. **Download Plugin File**
   - Plugin files are usually in `.jar` format

2. **Place Plugin**
   - Put the downloaded `.jar` file into the server's `plugins` folder
   - If the `plugins` folder doesn't exist, create it manually

3. **Restart Server**
   - Save all changes and shut down the server
   - Restart the server to load new plugins

### Verify Plugin Installation

After the server starts, type in the console:

```
plugins
```

Or the shortened version:

```
pl
```

You will see a list of installed plugins:

- **Green plugin name**: Plugin loaded successfully
- **Red plugin name**: Plugin failed to load

:::warning Note
If a plugin appears in red, check:
- Whether the plugin is compatible with the current Nukkit version
- Whether dependency plugins are missing
- Whether there are error messages in the console
:::

## Configuring Plugins

Most plugins will automatically generate configuration files on first load, usually located at:

```
plugins/PluginName/config.yml
```

You can modify configuration files according to plugin documentation. After modification, you need to:
- Restart the server, or
- Use the plugin's reload command (if supported)

## Managing Plugins

### View Plugin List

```
plugins
```

### Reload Plugin (some plugins support this)

```
reload
```

:::caution Warning
Frequent use of the `reload` command may cause memory leaks or other issues. It's recommended to restart the server instead.
:::

### Uninstall Plugin

1. Stop the server
2. Remove the plugin's `.jar` file from the `plugins` folder
3. Delete the plugin's configuration folder (optional)
4. Restart the server

## Recommended Common Plugins

Here are some commonly used Nukkit plugins:

- **EconomyAPI** - Economy system
- **LuckPerms** - Permission management
- **Multiverse** - Multi-world management
- **EssentialsNK** - Essential commands collection
- **WorldEdit** - Creative world editing

## Next Steps

After installing plugins, you can [Connect to Server](connect.md) and start playing!
