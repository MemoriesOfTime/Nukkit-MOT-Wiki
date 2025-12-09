---
sidebar_position: 2
---

# Download and Installation

This section will guide you through downloading Nukkit-MOT and completing the basic server setup.

## Download Nukkit-MOT

You can obtain the latest version of Nukkit-MOT from the following sources:

- [Jenkins CI](https://motci.cn/job/Nukkit-MOT/job/master/lastSuccessfulBuild/artifact/target/Nukkit-MOT-SNAPSHOT.jar) - Faster access in China
- [GitHub Actions](https://github.com/MemoriesOfTime/Nukkit-MOT/actions/workflows/maven.yml?query=branch%3Amaster) - Official builds

After downloading, you will get a file named `Nukkit-MOT-SNAPSHOT.jar`.

:::info Note
It's recommended to download from Jenkins CI for faster and more stable access.
:::

## Server Setup

### Create Server Folder

1. Create a new folder, for example `NukkitServer`
2. Place the downloaded `Nukkit-MOT-SNAPSHOT.jar` file into this folder

### Create Startup Script

To make starting the server easier, we need to create a startup script.

#### Windows Users

Create a new file named `start.bat` in the server folder with the following content:

```bat
@echo off
java -Xms1G -Xmx1G -jar Nukkit-MOT-SNAPSHOT.jar
pause
```

#### Linux/macOS Users

Create a new file named `start.sh` in the server folder with the following content:

```bash
#!/bin/bash
java -Xms1G -Xmx1G -jar Nukkit-MOT-SNAPSHOT.jar
```

Then grant execute permissions:

```bash
chmod +x start.sh
```

:::tip Memory Settings
- `-Xms1G`: Sets initial memory to 1GB
- `-Xmx1G`: Sets maximum memory to 1GB
- Adjust according to your needs, e.g., `-Xmx2G` for maximum 2GB memory
:::

## First Startup

### Start the Server

- **Windows**: Double-click to run `start.bat`
- **Linux/macOS**: Run `./start.sh` in the terminal

### Wait for Initialization

On the first startup, the server will:
1. Automatically generate configuration files (`server.properties`, etc.)
2. Create default world
3. Load necessary resources

This process may take a few minutes.

### Confirm Successful Startup

When you see a message similar to the following, it means the server has started successfully:

```
[main] [INFO]: Done (xx.xxs)! For help, type "help"
```

### Shut Down the Server

After the first successful startup, it's recommended to shut down the server for configuration:

Type in the console:
```
stop
```

Wait for the server to completely shut down, then you can proceed with configuration.

## Next Steps

After server installation is complete, you can proceed to [Configure Server](configuration.md) to customize your server settings.
