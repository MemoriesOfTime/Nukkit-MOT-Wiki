---
sidebar_position: 7
---

# World 地图类指南

在 Nukkit-MOT 中，世界由 `Level` 表示。它负责世界数据、区块、出生点、粒子、声音以及维度元数据。本文聚焦插件开发里最常用的世界相关 API，帮助你安全地读取、创建和管理多世界。

:::tip 基于源码编写
本页内容直接对照当前 Nukkit-MOT 源码整理，重点参考 `Server`、`Level`、`DimensionData`、`Generator` 和 ticking area 管理器，示例尽量只使用已验证的 API。
:::

## 世界基础概念 {#world-basics}

“世界”和“维度”有关联，但不是同一个概念：

- **世界** 是一个已经加载到服务器内存中的 `Level`
- **维度** 是这个世界的元数据，可通过 `level.getDimension()` 和 `level.getDimensionData()` 读取
- `Server#getLevelByName()` 按世界的**文件夹名**查找，而不是你自己定义的显示名称

最常见的入口如下：

```java
Server server = Server.getInstance();

Level defaultLevel = server.getDefaultLevel();
Level lobby = server.getLevelByName("lobby");

for (Level level : server.getLevels().values()) {
    server.getLogger().info(level.getFolderName());
}
```

## 加载已有世界 {#loading-existing-worlds}

常规插件开发里，建议直接使用 `worlds/` 目录下的世界文件夹名。世界未加载时，要先显式加载再使用。

```java
Server server = Server.getInstance();

if (!server.isLevelLoaded("survival")) {
    boolean loaded = server.loadLevel("survival");
    if (!loaded) {
        throw new IllegalStateException("World 'survival' does not exist or failed to load");
    }
}

Level survival = server.getLevelByName("survival");
```

### 默认世界、额外世界与安全回退

```java
Server server = Server.getInstance();

Level defaultLevel = server.getDefaultLevel();
Level target = server.getLevelByName("minigame-1");

if (target == null && server.loadLevel("minigame-1")) {
    target = server.getLevelByName("minigame-1");
}

if (target == null) {
    target = defaultLevel;
}
```

:::warning
不要把 `getLevelByName()` 当成“自动加载世界”的方法。它只会返回已经加载过的 `Level`，不会帮你隐式加载。
:::

## 创建世界与选择生成器 {#creating-worlds-and-choosing-generators}

`Server#generateLevel(...)` 会一步完成“创建世界并加载世界”。当前源码中已注册的生成器名称包括：

| 名称 | 典型用途 |
| --- | --- |
| `normal` / `default` | 标准主世界地形 |
| `oldnormal` | 旧版普通地形 |
| `flat` | 平坦大厅、测试地图 |
| `void` | 空岛、小游戏底图、自定义建筑图 |
| `nether` | 下界维度世界 |
| `the_end` | 末地维度世界 |

### 示例 1：创建一个平坦大厅世界

```java
import cn.nukkit.Server;
import cn.nukkit.level.Level;
import cn.nukkit.level.generator.Generator;

import java.util.HashMap;
import java.util.Map;

Server server = Server.getInstance();

if (!server.isLevelGenerated("flat-lobby")) {
    Map<String, Object> options = new HashMap<>();
    options.put("preset", "2;7,2x3,2;1;");
    options.put("decoration", true);

    boolean generated = server.generateLevel(
        "flat-lobby",
        20260312L,
        Generator.getGenerator("flat"),
        options
    );

    if (!generated) {
        throw new IllegalStateException("Failed to generate flat-lobby");
    }
}

Level flatLobby = server.getLevelByName("flat-lobby");
```

### 示例 2：为小游戏创建一个 Void 世界

```java
import cn.nukkit.Server;
import cn.nukkit.level.generator.Generator;

Server server = Server.getInstance();

if (!server.isLevelGenerated("arena-void")) {
    boolean generated = server.generateLevel(
        "arena-void",
        123456789L,
        Generator.getGenerator("void")
    );

    if (!generated) {
        throw new IllegalStateException("Failed to generate arena-void");
    }
}
```

:::tip
如果你想动态查看当前注册了哪些生成器，可以使用 `Generator.getGeneratorList()`。
:::

## 维度与高度范围 {#dimensions-and-height-ranges}

维度与高度信息应该从世界对象本身读取，而不是在插件里写死常量。

```java
import cn.nukkit.level.DimensionData;
import cn.nukkit.level.Level;

Level level = player.getLevel();

int dimensionId = level.getDimension();
DimensionData dimensionData = level.getDimensionData();

int minY = level.getMinBlockY();
int maxY = level.getMaxBlockY();

player.sendMessage("Dimension=" + dimensionId + ", Y=" + minY + ".." + maxY);
```

当前源码对应的默认范围如下：

| 维度 | ID | 默认 Y 范围 |
| --- | --- | --- |
| 主世界 | `0` | `-64` 到 `319` |
| 下界 | `1` | `0` 到 `127` |
| 末地 | `2` | `0` 到 `255` |

:::warning
不要把主世界高度硬编码成 `0..255`。Nukkit-MOT 应以 `level.getMinBlockY()` 和 `level.getMaxBlockY()` 为准；另外，不同 provider 还可能回退到旧版高度行为。
:::

## 区块加载、生成状态与安全访问 {#chunks-and-safe-access}

很多“世界访问”本质上都是“区块访问”。这里最容易踩坑的是 API 是否会隐式创建新区块：

- `getChunk(x, z, true)` 和 `loadChunk(x, z)` 可能会创建或生成缺失区块
- `getChunkIfLoaded(x, z)` 只返回已经加载到内存中的区块
- `loadChunk(x, z, false)` 只尝试加载已存在区块，不会补生成新区块
- `isChunkGenerated(x, z)` 与 `isChunkPopulated(x, z)` 可用于判断区块准备进度

### 示例 3：安全读取一个方块而不意外生成新地形

```java
import cn.nukkit.block.Block;
import cn.nukkit.level.Level;
import cn.nukkit.math.Vector3;

Level level = player.getLevel();
int x = player.getFloorX();
int y = player.getFloorY() - 1;
int z = player.getFloorZ();

int chunkX = x >> 4;
int chunkZ = z >> 4;

if (!level.isChunkLoaded(chunkX, chunkZ)) {
    boolean loaded = level.loadChunk(chunkX, chunkZ, false);
    if (!loaded) {
        player.sendMessage("目标区块未加载，且不会被自动生成。");
        return;
    }
}

if (!level.isChunkGenerated(chunkX, chunkZ)) {
    player.sendMessage("区块对象已存在，但地形生成尚未完成。");
    return;
}

Block block = level.getBlock(new Vector3(x, y, z));
player.sendMessage("你脚下的方块是: " + block.getName());
```

### 安全进行跨世界传送

跨世界传送前，先确保目标世界已经加载。为了避免把玩家传进方块内部，最简单的做法是用 `getSafeSpawn()`。

```java
import cn.nukkit.Player;
import cn.nukkit.Server;
import cn.nukkit.level.Level;

Server server = Server.getInstance();

if (!server.loadLevel("nether-hub")) {
    throw new IllegalStateException("nether-hub is not available");
}

Level netherHub = server.getLevelByName("nether-hub");
player.teleport(netherHub.getSafeSpawn());
```

## Ticking Area 常加载区块 {#ticking-area}

当某片区域必须长期保持加载时，可以使用 ticking area，例如：

- 出生点逻辑区
- 红石或自动化机器区
- 全局计时系统所在区域
- 不希望被卸载的大厅区块

管理入口是 `Server#getTickingAreaManager()`。持久化后的 ticking area 会写入 `worlds/<level>/tickingarea.json`。

### 示例 4：注册一个小型出生点常加载区块

```java
import cn.nukkit.Server;
import cn.nukkit.level.Level;
import cn.nukkit.level.tickingarea.TickingArea;

Server server = Server.getInstance();

if (!server.loadLevel("survival")) {
    throw new IllegalStateException("survival world is missing");
}

Level survival = server.getLevelByName("survival");

TickingArea area = new TickingArea(
    "spawn-area",
    survival.getName(),
    new TickingArea.ChunkPos(0, 0),
    new TickingArea.ChunkPos(0, 1),
    new TickingArea.ChunkPos(1, 0),
    new TickingArea.ChunkPos(1, 1)
);

server.getTickingAreaManager().addTickingArea(area);
area.loadAllChunk();
```

常用管理方法：

```java
TickingArea area = server.getTickingAreaManager().getTickingArea("spawn-area");
boolean exists = server.getTickingAreaManager().containTickingArea("spawn-area");
server.getTickingAreaManager().removeTickingArea("spawn-area");
```

## 世界级粒子与声音发送 {#particles-and-sounds}

`Level` 可以把粒子和声音广播给目标区块附近的玩家，也可以只发给指定玩家列表。

```java
import cn.nukkit.level.Sound;
import cn.nukkit.level.particle.FlameParticle;
import cn.nukkit.math.Vector3;

Level level = player.getLevel();
Vector3 pos = player.add(0, 1, 0);

level.addParticle(new FlameParticle(pos));
level.addSound(pos, Sound.BLOCK_BELL_HIT, 1.0f, 1.0f);
```

如果你需要使用基于标识符的粒子效果，也可以直接发送 `ParticleEffect`：

```java
import cn.nukkit.level.ParticleEffect;

level.addParticleEffect(pos, ParticleEffect.ENDROD);
```

## 常见坑点 {#common-pitfalls}

### 1. 在异步线程里改世界

`Level`、区块、方块、实体、玩家都应视为主线程 API。不要在异步任务里直接改方块、传送玩家，或读写世界状态。

推荐模式：

1. 异步线程只做慢 I/O 或纯计算
2. 真正访问 `Level`、`Player`、`Entity`、区块数据前，切回主线程

### 2. 误以为“区块已加载”就等于“区块可安全使用”

`loadChunk()` 只能保证区块对象被加载进来。对于新区域，地形生成和 populate 可能还没完成，最好额外检查：

- `level.isChunkGenerated(x, z)`
- `level.isChunkPopulated(x, z)`

### 3. 跨维度传送前没有准备目标世界

传送到另一个世界或维度前，至少要确认：

- 目标世界已经加载
- 优先使用 `getSafeSpawn()` 或者你自己验证过的 `Position`
- 目标 Y 值位于 `level.getMinBlockY()` 到 `level.getMaxBlockY()` 之间

### 4. 用错世界名称做查找

`Server#getLevelByName()` 按已加载世界的文件夹名匹配。正常情况下，你传入的应该是世界目录名，而不是你在配置文件里自定义的展示标签。
