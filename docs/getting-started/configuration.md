---
sidebar_position: 3
---

# Configure Server

After the server's first startup, configuration files will be automatically generated. You can modify these configurations according to your needs.

## Main Configuration File

The main configuration file is **server.properties**, which can be edited with any text editor.

### Basic Configuration Options

Here are some commonly used configuration options:

```properties
# Server port
server-port=19132

# Bind IP address (0.0.0.0 means listen on all network interfaces)
server-ip=0.0.0.0

# Default game mode
# 0=Survival, 1=Creative, 2=Adventure, 3=Spectator
gamemode=0

# Game difficulty
# 0=Peaceful, 1=Easy, 2=Normal, 3=Hard
difficulty=1

# Maximum number of players
max-players=20

# Enable whitelist
white-list=false

# Server description (displayed in server list)
motd=A Nukkit Server
```

### Modifying Configuration

1. Open `server.properties` with a text editor
2. Modify the values of configuration options as needed
3. Save the file
4. Restart the server for the configuration to take effect

:::warning Note
Configuration changes require a server restart to take effect!
:::

## Detailed Configuration Documentation

For complete documentation on `server.properties`, please refer to:

- [server.properties Configuration Guide](../server-config/server-properties.mdx)

## Other Configuration Files

Besides `server.properties`, there are other configuration files:

- `server.properties`: Server configuration
- `ops.txt`: Administrator list
- `white-list.txt`: Whitelist
- `banned-players.txt`: Banned players list
- `banned-ips.txt`: Banned IP addresses list

## Common Configuration Recommendations

### Performance Optimization

For servers with many players, it's recommended to adjust the following configurations:

```properties
# Reducing view distance can improve performance
view-distance=8

# Limit maximum number of players
max-players=50
```

### Security Settings

For server security, it's recommended to:

```properties
# Enable whitelist (only allow specified players to join)
white-list=true

# Enable online verification (requires genuine account)
xbox-auth=true
```

## Next Steps

After configuration is complete, you can:
- Continue to [Install Plugins](plugins.md) to extend server functionality
- Or directly [Connect to Server](connect.md) to start playing
