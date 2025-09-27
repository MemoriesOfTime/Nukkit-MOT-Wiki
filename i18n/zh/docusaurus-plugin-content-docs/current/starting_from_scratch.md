---
sidebar_position: 2
---

# 从0开始的 Nukkit 服务器搭建教程

本教程将引导你从零开始搭建一个 **Nukkit 服务器**，让你能够运行自己的 **Minecraft 基岩版服务器**。  
教程内容覆盖 **环境准备、安装、配置、运行、进阶设置与常见问题**。

---

## 一、准备工作

### 1. 系统要求

- **操作系统**：Windows、Linux 或 macOS
- **Java**：Nukkit 需要 **Java 17 或更高版本**
- **内存**：至少 1GB

### 2. 安装 Java

1. 访问 [adoptium website](https://adoptium.net/zh-CN/temurin/releases?version=17) 下载并安装 Java。
2. 安装完成后验证是否成功：

```bash
# 在Linux终端或Windows CMD中运行
java -version
   ```

如果能显示版本号，说明安装成功。

---

## 二、下载 Nukkit MOT

1. 从 [Jenkins](https://motci.cn/job/Nukkit-MOT/job/master/lastSuccessfulBuild/artifact/target/Nukkit-MOT-SNAPSHOT.jar/) 或 [GitHub Actions](https://github.com/MemoriesOfTime/Nukkit-MOT/actions/workflows/maven.yml?query=branch%3Amaster) 下载最新版本的Nukkit-MOT。
2. 正常情况下，下载到的文件名称是 `Nukkit-MOT-SNAPSHOT.jar`。

---

## 三、设置服务器

### 1. 创建服务器文件夹

- 新建一个文件夹例如 `NukkitServer`，将下载的 JAR 文件放进去。

### 2. 创建启动脚本

#### Windows

新建文件 `start.bat` 并填写如下内容：

```bat
@echo off
java -Xms1G -Xmx1G -jar Nukkit-MOT-SNAPSHOT.jar
pause
```

#### Linux/macOS

新建文件 `start.sh`：

```bash
#!/bin/bash
java -Xms1G -Xmx1G -jar Nukkit-MOT-SNAPSHOT.jar
```

然后赋予执行权限：

```bash
chmod +x start.sh
```

> ✅ 提示：`-Xms` 和 `-Xmx` 控制分配最小和和最大内存，可根据需求调整（如 -Xmx2G）。

---

## 四、首次启动

1. 运行 `start.bat`（Windows）或 `./start.sh`（Linux/macOS）。
2. 第一次启动会生成服务器配置文件和默认世界等数据。
3. 出现类似以下提示表示启动成功：

```
[main] [INFO]: Done (xx.xxs)! For help, type "help"
   ```
4. 输入 `stop` 关闭服务器，准备进行配置。

---

## 五、配置服务器

服务器配置文件为 **server.properties**，可用文本编辑器打开。

```properties
# 基本设置
server-port=19132        # 默认端口
server-ip=0.0.0.0        # 绑定 IP
gamemode=0               # 默认游戏模式 0=生存，1=创造
difficulty=1             # 游戏难度 0=和平，1=简单，2=普通，3=困难
max-players=20           # 最大玩家数
white-list=false         # 是否启用白名单
motd=A Nukkit Server     # 服务器描述
```

详细配置说明请参考 [server.properties](server-config/server-properties.md)。

---

## 六、安装插件

1. 前往相关网站寻找插件 （如 [Cloudburst(Nukkit Forum)](https://cloudburstmc.org/resources/categories/nukkit-plugins.1/) \ [MineBBS](https://www.minebbs.com/resources/categories/nukkit.40/)）。
2. 下载 `.jar` 插件文件。
3. 将下载到的 `.jar` 后缀文件放入 `plugins` 文件夹。
4. 重启服务器
5. 输入 `plugins` 命令检查插件列表是否成功加载（显示插件名称且为绿色）。

---

## 七、进入服务器

1. 确认服务器已成功启动完成。
2. 在 Minecraft 基岩版客户端 中输入服务器的IP和端口。

IP为服务器IP地址，若为本地服务器则为 `127.0.0.1` 或 `localhost`（本地进入需解锁系统回环限制）。
默认端口为 19132，若在配置文件中修改了端口，请输入修改后的端口。

---

## 八、常见问题

- **服务器无法启动** → 检查 Java 是否安装正确、JAR 名称是否对应、下载的Nukkit-MOT是否完整。
- **玩家无法进入服务器** → 检查服务器防火墙是否放通19132 UDP 端口，本地连接需解除系统回环限制。
- **仅网易客户端无法进入服务器** → 检查服务器配置文件中 `netease-client-support` 是否开启。

---