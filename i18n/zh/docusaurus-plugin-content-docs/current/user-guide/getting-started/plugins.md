---
sidebar_position: 4
---

# 安装插件

Nukkit 支持通过插件来扩展服务器功能,例如添加新的游戏玩法、管理工具、经济系统等。

## 获取插件

你可以从以下渠道下载 Nukkit 插件:

- [Cloudburst (Nukkit Forum)](https://cloudburstmc.org/resources/categories/nukkit-plugins.1/) - 官方插件库
- [MineBBS](https://www.minebbs.com/resources/categories/nukkit.40/) - 中文社区插件库
- [GitHub](https://github.com/) - 搜索开源插件项目

:::tip 提示
下载插件时请注意:
- 确认插件支持的 Nukkit 版本
- 查看插件的依赖项
- 阅读插件的使用说明
:::

## 安装插件

### 安装步骤

1. **下载插件文件**
   - 插件文件通常是 `.jar` 格式

2. **放置插件**
   - 将下载的 `.jar` 文件放入服务器的 `plugins` 文件夹
   - 如果 `plugins` 文件夹不存在,请手动创建

3. **重启服务器**
   - 保存所有更改并关闭服务器
   - 重新启动服务器以加载新插件

### 验证插件安装

服务器启动后,在控制台中输入:

```
plugins
```

或简写:

```
pl
```

你会看到已安装插件的列表:

- **绿色插件名**: 插件已成功加载
- **红色插件名**: 插件加载失败

:::warning 注意
如果插件显示为红色,请检查:
- 插件是否兼容当前 Nukkit 版本
- 是否缺少依赖插件
- 控制台是否有错误信息
:::

## 配置插件

大多数插件在首次加载时会自动生成配置文件,通常位于:

```
plugins/插件名称/config.yml
```

你可以根据插件文档修改配置文件,修改后需要:
- 重启服务器,或
- 使用插件的重载命令 (如果支持)

## 管理插件

### 查看插件列表

```
plugins
```

### 重载插件 (部分插件支持)

```
reload
```

:::caution 警告
频繁使用 `reload` 命令可能导致内存泄漏或其他问题,建议重启服务器。
:::

### 卸载插件

1. 停止服务器
2. 从 `plugins` 文件夹中删除插件的 `.jar` 文件
3. 删除插件的配置文件夹 (可选)
4. 重新启动服务器

## 常用插件推荐

以下是一些常用的 Nukkit 插件:

- **EconomyAPI** - 经济系统
- **LuckPerms** - 权限管理
- **Multiverse** - 多世界管理
- **EssentialsNK** - 基础命令集合
- **WorldEdit** - 创世神(地图编辑)

## 下一步

安装好插件后,你可以 [连接到服务器](connect.md) 开始游戏了!
