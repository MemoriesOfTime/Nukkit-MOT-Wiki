---
sidebar_position: 2
---

# Nukkit Server Setup Tutorial from Scratch

This tutorial will guide you through setting up a **Nukkit Server** from scratch, allowing you to run your own **Minecraft Bedrock Edition server**.
The content covers **environment preparation, installation, configuration, running, advanced settings, and common issues**.

------

## 1. Preparations

### 1.1 System Requirements

- **Operating System**: Windows, Linux, or macOS
- **Java**: Nukkit requires **Java 17 or higher**
- **Memory**: At least 1GB

### 1.2 Install Java

1. Visit the [adoptium website](https://adoptium.net/zh-CN/temurin/releases?version=17) to download and install Java.
2. Verify the installation after completion:

bash

```
# Run in Linux terminal or Windows CMD
java -version
```



If the version number is displayed, the installation was successful.

------

## 2. Download Nukkit MOT

1. Download the latest version of Nukkit-MOT from [Jenkins](https://motci.cn/job/Nukkit-MOT/job/master/lastSuccessfulBuild/artifact/target/Nukkit-MOT-SNAPSHOT.jar/) or [GitHub Actions](https://github.com/MemoriesOfTime/Nukkit-MOT/actions/workflows/maven.yml?query=branch%3Amaster).
2. Normally, the downloaded file will be named `Nukkit-MOT-SNAPSHOT.jar`.

------

## 3. Server Setup

### 3.1 Create a Server Folder

- Create a new folder, for example, `NukkitServer`, and place the downloaded JAR file inside it.

### 3.2 Create Startup Scripts

#### For Windows

Create a new file named `start.bat` with the following content:

bat

```
@echo off
java -Xms1G -Xmx1G -jar Nukkit-MOT-SNAPSHOT.jar
pause
```



#### For Linux/macOS

Create a new file named `start.sh`:

bash

```
#!/bin/bash
java -Xms1G -Xmx1G -jar Nukkit-MOT-SNAPSHOT.jar
```



Then grant execute permissions:

bash

```
chmod +x start.sh
```



> ✅ Tip: `-Xms` and `-Xmx` control the minimum and maximum allocated memory. Adjust these values according to your needs (e.g., -Xmx2G).

------

## 4. First Startup

1. Run `start.bat` (Windows) or `./start.sh` (Linux/macOS).
2. The first startup will generate server configuration files, default worlds, and other data.
3. A message similar to the following indicates a successful startup:

text

```
[main] [INFO]: Done (xx.xxs)! For help, type "help"
```



1. Type `stop` to shut down the server and proceed to configuration.

------

## 5. Configuring the Server

The main server configuration file is **server.properties**, which can be opened with a text editor.

properties

```
# Basic Settings
server-port=19132        # Default port
server-ip=0.0.0.0        # Bind IP address
gamemode=0               # Default game mode 0=Survival, 1=Creative
difficulty=1             # Game difficulty 0=Peaceful, 1=Easy, 2=Normal, 3=Hard
max-players=20           # Maximum number of players
white-list=false         # Enable whitelist
motd=A Nukkit Server     # Server description
```



For a detailed configuration guide, please refer to [server.properties](server-config/server-properties.mdx).

------

## 6. Installing Plugins

1. Go to relevant websites to find plugins (e.g., [Cloudburst (Nukkit Forum)](https://cloudburstmc.org/resources/categories/nukkit-plugins.1/) \ [MineBBS](https://www.minebbs.com/resources/categories/nukkit.40/)).
2. Download the plugin `.jar` file.
3. Place the downloaded `.jar` file into the `plugins` folder.
4. Restart the server.
5. Use the `plugins` command to check if the plugins loaded successfully (the plugin names should appear in green).

------

## 7. Joining the Server

1. Ensure the server has started successfully.

2. In the Minecraft Bedrock Edition client, enter the server's IP address and port.

   The IP is the server's IP address. For a local server, use `127.0.0.1` or `localhost` (local connections may require lifting the system loopback restriction).
   The default port is 19132. If you modified the port in the configuration file, enter the modified port.

------

## 8. Common Issues

- **Server fails to start** → Check if Java is installed correctly, if the JAR filename matches, and if the Nukkit-MOT download is complete.
- **Players cannot join the server** → Check if the server's firewall allows UDP port 19132. For local connections, ensure the system loopback restriction is lifted.
- **Only NetEase client cannot join the server** → Check if `netease-client-support` is enabled in the server configuration file.