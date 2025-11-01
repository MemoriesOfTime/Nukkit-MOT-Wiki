---
sidebar_position: 5
---

# 连接服务器

当服务器成功启动后,你就可以使用 Minecraft 基岩版客户端连接到服务器了。

## 确认服务器状态

在连接之前,请确保:

1. **服务器已启动完成**
   - 控制台显示 `Done (xx.xxs)! For help, type "help"`

2. **服务器正在运行**
   - 控制台可以正常输入命令

## 连接方式

### 本地连接 (同一台电脑)

如果你在服务器所在的电脑上游戏:

1. 打开 Minecraft 基岩版客户端
2. 点击 "游戏" → "服务器" → "添加服务器"
3. 填写服务器信息:
   - **服务器名称**: 自定义名称
   - **服务器地址**: `127.0.0.1` 或 `localhost`
   - **端口**: `19132` (默认端口,如果修改过请填写实际端口)
4. 点击 "保存" 并连接

:::warning Windows 10/11 本地连接注意事项
Windows 系统默认启用了回环限制,需要解除才能本地连接:

1. 以管理员身份运行 PowerShell
2. 执行以下命令:
```powershell
CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftUWP_8wekyb3d8bbwe"
```
:::

### 局域网连接 (同一网络)

如果你和服务器在同一局域网内:

1. 获取服务器的局域网 IP 地址:
   - **Windows**: 在命令提示符中运行 `ipconfig`,查找 IPv4 地址
   - **Linux/macOS**: 在终端中运行 `ifconfig` 或 `ip addr`

2. 在 Minecraft 客户端中:
   - **服务器地址**: 服务器的局域网 IP (如 `192.168.1.100`)
   - **端口**: `19132` (或自定义端口)

### 公网连接 (远程服务器)

如果服务器部署在远程主机或云服务器:

1. **获取公网 IP**
   - 询问服务器管理员或查看云服务器控制台

2. **配置防火墙**
   - 确保防火墙允许 **UDP 19132** 端口的入站连接
   - 云服务器需要在安全组中开放端口

3. **配置端口转发** (如果需要)
   - 如果服务器在路由器后面,需要设置端口转发

4. 在客户端填写:
   - **服务器地址**: 公网 IP
   - **端口**: `19132` (或自定义端口)

## 常见客户端

Nukkit 服务器支持以下基岩版客户端:

- Minecraft 基岩版 (Windows 10/11)
- Minecraft PE (Android/iOS)
- Minecraft (Nintendo Switch)
- Minecraft (Xbox)
- Minecraft (PlayStation)
- **网易我的世界** (需开启 `netease-client-support` 配置)

:::info 网易客户端支持
如果使用网易我的世界客户端,请确保在 `server.properties` 中启用:
```properties
netease-client-support=true
```
:::

## 验证连接

成功连接后:

1. 你应该能看到服务器的出生点
2. 服务器控制台会显示你的连接信息
3. 可以正常移动和交互

## 遇到问题?

如果无法连接,请查看 [常见问题](troubleshooting.md) 章节寻找解决方案。
