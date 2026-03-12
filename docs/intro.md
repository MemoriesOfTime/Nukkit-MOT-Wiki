---
sidebar_position: 1
---

# Nukkit-MOT {#nukkit-mot}

![Nukkit-MOT](/images/banner.png)

## Introduction {#introduction}
Nukkit-MOT is a special version of [Nukkit](https://github.com/CloudburstMC/Nukkit) Minecraft Bedrock Edition server software.  
It is developed based on the last open source version of [NukkitPetteriM1Edition](https://github.com/PetteriM1/NukkitPetteriM1Edition)

note: if you need higher version features, please use [PowerNukkitX](https://github.com/PowerNukkitX/PowerNukkitX).

### What's new in Nukkit-MOT? {#whats-new}
1. Support for 1.2 – 1.26.0 version (you can set the minimum protocol in the config)
2. Supports most entities with AI
3. Support for the nether world and The Еnd
4. Generation of dungeons and caves
5. Support for vanilla commands

## How to install? {#how-to-install}
1. Install java 17 or higher
2. Download the .jar file from the links below
3. Write a command to run: `java -jar Nukkit-MOT-SNAPSHOT.jar` (change `Nukkit-MOT-SNAPSHOT.jar` to the name of the file you downloaded)

## Links {#links}
- __🌐 Download: [Jenkins](https://motci.cn/job/Nukkit-MOT/) / [GitHub Actions](https://github.com/MemoriesOfTime/Nukkit-MOT/actions/workflows/maven.yml?query=branch%3Amaster)__
- __💬 Discuss: [Discord](https://discord.gg/pJjQDQC) / [QQ Group](https://jq.qq.com/?_wv=1027&k=5aIuYMH)__
- __🔌 Plugins: [Nukkit Forum](https://cloudburstmc.org/resources/categories/nukkit-plugins.1/) / [Nukkit-MOT Forum](https://bbs.nukkit-mot.com/resources/)__
- __🐞 [Report a Bug](https://github.com/MemoriesOfTime/Nukkit-MOT/issues/new/choose)__

## Documentation Paths {#documentation-paths}

The documentation is now split into two main tracks:

- **User Documentation**: for server owners and administrators. Start with [Start from Scratch](user-guide/starting_from_scratch.md), then continue with [Getting Started](user-guide/getting-started/preparation.md) and [Server Config](user-guide/server-config/server-properties.mdx).
- **Developer Documentation**: for plugin and tooling developers. Start with [First Java Plugin](developer-guide/tutorial-basics/frist_java_plugin.mdx), then continue with [Guides](developer-guide/guides/world.md) and [Advanced Tutorials](developer-guide/tutorial-extras/runtime_block_state.mdx).

## Maven {#maven}
#### Repository: {#maven-repository}
```xml
<repositories>
    <repository>
        <id>repo-lanink-cn</id>
        <url>https://repo.lanink.cn/repository/maven-public/</url>
    </repository>
</repositories>
```

#### Dependencies: {#maven-dependencies}
```xml
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
    maven("https://repo.lanink.cn/repository/maven-public/")
} 
```

#### Dependencies: {#gradle-dependencies}
```kts
dependencies {
    compileOnly("cn.nukkit:Nukkit:MOT-SNAPSHOT")
}
```
