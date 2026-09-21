---
sidebar_position: 1
description: Nukkit-MOT is a multi-version Minecraft Bedrock Edition server fork with NetEase client support, AI entities, vanilla commands, and a well-established plugin ecosystem.
keywords:
  - Nukkit-MOT
  - Nukkit server
  - Minecraft Bedrock server
  - Minecraft Bedrock Edition server software
  - multi-version Bedrock server
  - Nukkit plugin API
---

# Nukkit-MOT {#nukkit-mot}

![Nukkit-MOT](/images/banner.png)

## Introduction {#introduction}
Nukkit-MOT is a fork of [Nukkit](https://github.com/CloudburstMC/Nukkit) that provides multi-version support, compatibility with NetEase clients, and a well-established plugin ecosystem.

Only interested in newer versions? You might want to try [Lumi](https://github.com/KoshakMineDEV/Lumi) or [PowerNukkitX](https://github.com/PowerNukkitX/PowerNukkitX).

### What's new in Nukkit-MOT? {#whats-new}
1. Support for 1.2 – 1.26.50 version (you can set the minimum protocol in the config)
2. Supports most entities with AI
3. Support for the nether world and The End
4. Generation of dungeons and caves
5. Support for vanilla commands
6. Support for NetEase clients

## How to install? {#how-to-install}
1. Install java 17 or higher
2. Download the .jar file from the links below
3. Write a command to run: `java -jar Nukkit-MOT-SNAPSHOT.jar` (change `Nukkit-MOT-SNAPSHOT.jar` to the name of the file you downloaded)

### Run with Docker {#run-with-docker}
```bash
docker run -d --name nukkit-mot \
  -p 19132:19132/udp \
  -p 19132:19132/tcp \
  -v $(pwd)/data:/data \
  -e JAVA_OPTS="-Xms2G -Xmx2G" \
  --restart unless-stopped \
  memoriesoftime/nukkit-mot:latest
```
- `:latest` and `:<short-sha>` are development snapshots built from the master branch.
- `:1.26.30-R1` style tags are stable releases mirroring Maven Central.
- All worlds, plugins, players and `server.properties` live under the `/data` volume.

## Links {#links}
- __🌐 Download: [Jenkins](https://motci.cn/job/Nukkit-MOT/) / [GitHub Actions](https://github.com/MemoriesOfTime/Nukkit-MOT/actions/workflows/maven.yml?query=branch%3Amaster)__
- __💬 Discuss: [Discord](https://discord.gg/pJjQDQC) / [QQ Group](https://jq.qq.com/?_wv=1027&k=5aIuYMH)__
- __🔌 Plugins: [Nukkit Forum](https://cloudburstmc.org/resources/categories/nukkit-plugins.1/) / [Nukkit-MOT Forum](https://bbs.nukkit-mot.com/resources/)__
- __🐞 [Report a Bug](https://github.com/MemoriesOfTime/Nukkit-MOT/issues/new/choose)__

## Documentation Paths {#documentation-paths}

The documentation is now split into two main tracks:

- **User Documentation**: for server owners and administrators. Start with [Start from Scratch](user-guide/starting_from_scratch.md), then continue with [Getting Started](user-guide/getting-started/preparation.md) and [Server Config](user-guide/server-config/server-properties.mdx).
- **Developer Documentation**: for plugin and tooling developers. Start with [First Java Plugin](developer-guide/tutorial-basics/frist_java_plugin.mdx), then continue with [Guides](developer-guide/guides/world.md) and [Custom Content APIs](/docs/developer-guide/tutorial-extras/custom).

## Maven {#maven}
#### Repository: {#maven-repository}
```xml
<repositories>
    <!-- Release builds come from Maven Central; SNAPSHOT builds require the repo.lanink.cn repo -->
    <repository>
        <id>repo-lanink-cn</id>
        <url>https://repo.lanink.cn/repository/maven-public/</url>
    </repository>
</repositories>
```

#### Dependencies: {#maven-dependencies}
```xml
<!-- Release -->
<dependencies>
    <dependency>
        <groupId>com.nukkit-mot</groupId>
        <artifactId>nukkit-mot</artifactId>
        <version>1.26.40-R1</version>
        <scope>provided</scope>
    </dependency>
</dependencies>

<!-- SNAPSHOT -->
<dependencies>
    <dependency>
        <groupId>cn.nukkit</groupId>
        <artifactId>Nukkit</artifactId>
        <version>MOT-SNAPSHOT</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

## Gradle {#gradle}
#### Repository: {#gradle-repository}
```kts
repositories {
    mavenCentral()
    // SNAPSHOT builds require the repo.lanink.cn repo
    maven("https://repo.lanink.cn/repository/maven-public/")
} 
```

#### Dependencies: {#gradle-dependencies}
```kts
// Release
dependencies {
    compileOnly("com.nukkit-mot:nukkit-mot:1.26.40-R1")
}

// SNAPSHOT
dependencies {
    compileOnly("cn.nukkit:Nukkit:MOT-SNAPSHOT")
}
```
