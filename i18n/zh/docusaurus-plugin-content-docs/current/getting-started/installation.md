---
sidebar_position: 2
---

# 下载和安装

本章节将指导你下载 Nukkit-MOT 并完成服务器的基本设置。

## 下载 Nukkit-MOT

你可以从以下渠道获取最新版本的 Nukkit-MOT:

- [Jenkins CI](https://motci.cn/job/Nukkit-MOT/job/master/lastSuccessfulBuild/artifact/target/Nukkit-MOT-SNAPSHOT.jar) - 国内访问较快
- [GitHub Actions](https://github.com/MemoriesOfTime/Nukkit-MOT/actions/workflows/maven.yml?query=branch%3Amaster) - 官方构建

下载完成后,你会得到一个名为 `Nukkit-MOT-SNAPSHOT.jar` 的文件。

:::info 说明
建议从 Jenkins CI 下载,访问速度更快且更稳定。
:::

## 设置服务器

### 创建服务器文件夹

1. 新建一个文件夹,例如 `NukkitServer`
2. 将下载的 `Nukkit-MOT-SNAPSHOT.jar` 文件放入该文件夹

### 创建启动脚本

为了方便启动服务器,我们需要创建一个启动脚本。

#### Windows 用户

在服务器文件夹中新建文件 `start.bat`,内容如下:

```bat
@echo off
java -Xms1G -Xmx1G -jar Nukkit-MOT-SNAPSHOT.jar
pause
```

#### Linux/macOS 用户

在服务器文件夹中新建文件 `start.sh`,内容如下:

```bash
#!/bin/bash
java -Xms1G -Xmx1G -jar Nukkit-MOT-SNAPSHOT.jar
```

然后赋予执行权限:

```bash
chmod +x start.sh
```

:::tip 内存设置说明
- `-Xms1G`: 设置初始内存为 1GB
- `-Xmx1G`: 设置最大内存为 1GB
- 可根据实际情况调整,例如 `-Xmx2G` 表示最大 2GB 内存
:::

## 首次启动

### 启动服务器

- **Windows**: 双击运行 `start.bat`
- **Linux/macOS**: 在终端中运行 `./start.sh`

### 等待初始化

第一次启动时,服务器会:
1. 自动生成配置文件 (`server.properties` 等)
2. 创建默认世界
3. 加载必要的资源

这个过程可能需要几分钟时间。

### 确认启动成功

当你看到类似以下的提示时,表示服务器已成功启动:

```
[main] [INFO]: Done (xx.xxs)! For help, type "help"
```

### 关闭服务器

首次启动成功后,建议先关闭服务器进行配置:

在控制台中输入:
```
stop
```

等待服务器完全关闭后,就可以进行配置了。

## 下一步

服务器安装完成后,你可以继续 [配置服务器](configuration.md) 来自定义你的服务器设置。
