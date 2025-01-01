---
sidebar_position: 1
---

# Nukkit-MOT {#nukkit-mot}

![Nukkit-MOT](/images/banner.png)

## 前言 {#introduction}
Nukkit-MOT 是 [Nukkit](https://github.com/CloudburstMC/Nukkit) Minecraft Bedrock Edition 服务器软件的特殊版本。
它是基于 [NukkitPetteriM1Edition](https://github.com/PetteriM1/NukkitPetteriM1Edition) 的最后一个开源版本开发的。

注意：如果你需要更高版本的功能，请使用 [PowerNukkitX](https://github.com/PowerNukkitX/PowerNukkitX)。

### Nukkit-MOT 有什么新功能？ {#whats-new}
1. 支持 1.2 – 1.21.50 版本（你可以在配置中设置最小协议）
2. 支持大多数具有 AI 的实体
3. 支持下界和末地
4. 生成地牢和洞穴
5. 支持原版命令

## 如何安装？ {#how-to-install}
1. 安装 Java 17 或更高版本
2. 从下面的链接下载 .jar 文件
3. 编写运行命令：`java -jar file.jar`（将 `file` 更改为你下载的文件的名称）

## 链接 {#links}
- __🌐 下载：[Jenkins](https://motci.cn/job/Nukkit-MOT/job/master/) / [GitHub Actions](https://github.com/MemoriesOfTime/Nukkit-MOT/actions/workflows/maven.yml?query=branch%3Amaster)__
- __💬 [Discord](https://discord.gg/pJjQDQC)__
- __🔌 [Nukkit 插件](https://cloudburstmc.org/resources/categories/nukkit-plugins.1/)__
- __🐞 [报告错误](https://github.com/MemoriesOfTime/Nukkit-MOT/issues/new/choose)__

## Maven {#maven}
#### 仓库： {#maven-repository}
```xml title="pom.xml"
<repositories>
    <repository>
        <id>repo-lanink-cn</id>
        <url>https://repo.lanink.cn/repository/maven-public/</url>
    </repository>
</repositories>
```

#### 依赖： {#maven-dependencies}
```xml title="pom.xml"
<dependencies>
    <dependency>
        <groupId>cn.nukkit</groupId>
        <artifactId>Nukkit</artifactId>
        <version>MOT-SNAPSHOT</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

## 致谢 {#credits}
[Nukkit](https://github.com/CloudburstMC/Nukkit)  
[NukkitPetteriM1Edition](https://github.com/PetteriM1/NukkitPetteriM1Edition)  
[PowerNukkitX](https://github.com/PowerNukkitX/PowerNukkitX)

这个项目是基于 [Nukkit](https://github.com/CloudburstMC/Nukkit)，因此你应该遵守 [Nukkit](https://github.com/CloudburstMC/Nukkit) 的许可证

感谢 [jetbrains](https://jb.gg/OpenSourceSupport) 免费提供开发工具支持本项目！  
[<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png" width="200"/>](https://jb.gg/OpenSourceSupport)