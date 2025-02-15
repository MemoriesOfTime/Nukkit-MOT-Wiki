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
1. 支持 1.2 – 1.21.60 版本（你可以在配置中设置最小协议）
2. 支持大多数具有 AI 的实体
3. 支持下界和末地
4. 生成地牢和洞穴
5. 支持原版命令

## 如何安装？ {#how-to-install}
1. 安装 Java 17 或更高版本
2. 从下面的链接下载 .jar 文件
3. 运行命令：`java -jar Nukkit-MOT-SNAPSHOT.jar`（将 `Nukkit-MOT-SNAPSHOT.jar` 替换为你下载的文件名）

## 链接 {#links}
- __🌐 下载地址: [Jenkins](https://motci.cn/job/Nukkit-MOT/) / [GitHub Actions](https://github.com/MemoriesOfTime/Nukkit-MOT/actions/workflows/maven.yml?query=branch%3Amaster)__
- __💬 交流社区: [Discord](https://discord.gg/pJjQDQC) / [QQ 群](https://jq.qq.com/?_wv=1027&k=5aIuYMH)__
- __🔌 插件资源: [Nukkit 论坛](https://cloudburstmc.org/resources/categories/nukkit-plugins.1/) / [Nukkit-MOT 论坛](https://bbs.nukkit-mot.com/resources/)__
- __🐞 [提交问题反馈](https://github.com/MemoriesOfTime/Nukkit-MOT/issues/new/choose)__

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