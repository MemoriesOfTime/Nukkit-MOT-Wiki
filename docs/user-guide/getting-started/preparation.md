---
sidebar_position: 1
---

# Preparation

Before setting up a Nukkit server, you need to prepare the necessary environment and tools.

## System Requirements

Running a Nukkit server requires meeting the following basic requirements:

- **Operating System**: Windows, Linux, or macOS
- **Java**: Nukkit requires **Java 17 or higher**
- **Memory**: At least 1GB RAM (2GB or more recommended)
- **Storage**: At least 500MB available space

## Installing Java

### Download Java

1. Visit the [Adoptium website](https://adoptium.net/temurin/releases?version=17) to download Java 17 or higher
2. Select the installation package suitable for your operating system
3. Download and run the installer

### Verify Installation

After installation, you need to verify that Java is correctly installed:

```bash
# Run in terminal (Linux/macOS) or command prompt (Windows)
java -version
```

If you see output similar to the following, Java is successfully installed:

```
openjdk version "17.0.x" 20xx-xx-xx
OpenJDK Runtime Environment Temurin-17.0.x (build ...)
OpenJDK 64-Bit Server VM Temurin-17.0.x (build ...)
```

:::tip Tip
If you get a `java` command not found error, you may need to configure environment variables or restart your terminal/command prompt.
:::

## Next Steps

Once the environment is ready, you can proceed to [Download and Installation](installation.md) of the Nukkit server.
