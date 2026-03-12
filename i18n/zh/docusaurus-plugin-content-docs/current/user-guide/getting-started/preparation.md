---
sidebar_position: 1
---

# 准备工作

在开始搭建 Nukkit 服务器之前,你需要准备好必要的环境和工具。

## 系统要求

运行 Nukkit 服务器需要满足以下基本要求:

- **操作系统**: Windows、Linux 或 macOS
- **Java**: Nukkit 需要 **Java 17 或更高版本**
- **内存**: 至少 1GB RAM (建议 2GB 或更多)
- **存储空间**: 至少 500MB 可用空间

## 安装 Java

### 下载 Java

1. 访问 [Adoptium 官网](https://adoptium.net/zh-CN/temurin/releases?version=17) 下载 Java 17 或更高版本
2. 选择适合你操作系统的安装包
3. 下载并运行安装程序

### 验证安装

安装完成后,需要验证 Java 是否正确安装:

```bash
# 在终端(Linux/macOS)或命令提示符(Windows)中运行
java -version
```

如果看到类似以下的输出,说明 Java 安装成功:

```
openjdk version "17.0.x" 20xx-xx-xx
OpenJDK Runtime Environment Temurin-17.0.x (build ...)
OpenJDK 64-Bit Server VM Temurin-17.0.x (build ...)
```

:::tip 提示
如果提示 `java` 命令未找到,可能需要配置环境变量或重新启动终端/命令提示符。
:::

## 下一步

环境准备完成后,你可以继续 [下载和安装](installation.md) Nukkit 服务器。
