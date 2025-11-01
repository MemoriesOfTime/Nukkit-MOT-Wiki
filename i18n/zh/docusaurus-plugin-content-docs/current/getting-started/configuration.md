---
sidebar_position: 3
---

# 配置服务器

服务器首次启动后会自动生成配置文件,你可以根据需求修改这些配置。

## 主配置文件

主要的配置文件是 **server.properties**,使用任意文本编辑器打开即可编辑。

### 基本配置项

以下是一些常用的配置项:

```properties
# 服务器端口
server-port=19132

# 绑定 IP 地址 (0.0.0.0 表示监听所有网络接口)
server-ip=0.0.0.0

# 默认游戏模式
# 0=生存模式, 1=创造模式, 2=冒险模式, 3=旁观模式
gamemode=0

# 游戏难度
# 0=和平, 1=简单, 2=普通, 3=困难
difficulty=1

# 最大玩家数
max-players=20

# 是否启用白名单
white-list=false

# 服务器描述 (在服务器列表中显示)
motd=A Nukkit Server
```

### 修改配置

1. 使用文本编辑器打开 `server.properties`
2. 根据需要修改配置项的值
3. 保存文件
4. 重启服务器使配置生效

:::warning 注意
修改配置后必须重启服务器才能生效!
:::

## 详细配置说明

关于 `server.properties` 的完整配置说明,请参考:

- [server.properties 配置详解](../server-config/server-properties.mdx)

## 其他配置文件

除了 `server.properties` 外,还有一些其他配置文件:

- `server.properties`: 服务器配置
- `ops.txt`: 管理员列表
- `white-list.txt`: 白名单列表
- `banned-players.txt`: 封禁玩家列表
- `banned-ips.txt`: 封禁 IP 列表

## 常用配置建议

### 性能优化

对于人数较多的服务器,建议调整以下配置:

```properties
# 减少视距可以提高性能
view-distance=8

# 限制最大玩家数
max-players=50
```

### 安全设置

为了服务器安全,建议:

```properties
# 启用白名单(仅允许指定玩家进入)
white-list=true

# 启用在线验证(需要正版账号)
xbox-auth=true
```

## 下一步

配置完成后,你可以:
- 继续 [安装插件](plugins.md) 来扩展服务器功能
- 或直接 [连接到服务器](connect.md) 开始游戏
