---
sidebar_position: 6
---

# Block 方块类指南

`Block` 类是Nukkit中用于表示和操作游戏世界中方块的核心类。本指南将详细介绍如何通过Nukkit API操作方块。

## Block 类概述 {#block-class-overview}

位于 [cn.nukkit.block](https://github.com/MemoriesOfTime/Nukkit-MOT/blob/master/src/main/java/cn/nukkit/block/Block.java) 包中，`Block` 是所有方块类型的基类。

## 获取方块实例 {#obtaining-blocks}

### 从世界坐标获取
```java
// 通过玩家脚下位置获取
Block blockBelow = player.getLevel().getBlock(player.getFloorX(), player.getFloorY() - 1, player.getFloorZ());

// 通过Position对象获取
Position pos = new Position(100, 64, 100, level);
Block block = pos.getLevel().getBlock(pos);

// 通过Vector3对象获取
Vector3 vec = new Vector3(100, 64, 100);
Block block = level.getBlock(vec);
```

### 创建新方块实例
```java
// 通过方块ID创建
Block stone = Block.get(Block.STONE);

// 带数据值创建（变种）
Block graniteStone = Block.get(Block.STONE, 1); // 花岗岩
```

## 主要操作方法 {#main-operations}

### 设置方块 {#place-blocks}
```java
// 设置方块
Level level = player.getLevel();
level.setBlock(new Vector3(100, 64, 100), Block.get(Block.DIAMOND_BLOCK));

// 放置并更新周围方块
level.setBlock(pos, Block.get(Block.STONE), true, true);
```

:::warning

Level#setBlock() 方法用于直接设置方块，对于特殊方块（如门、床等），可尝试使用 `Block#place()` 方法。

:::

### 破坏方块 {#break-blocks}
```java
// 直接移除方块（设置为空气）
level.setBlock(pos, Block.get(Block.AIR));

// 使用break方法（会掉落物品）
Block block = level.getBlock(pos);
level.useBreakOn(pos, Item.get(Item.DIAMOND_PICKAXE), player); // 玩家使用钻石镐破坏方块
```

### 方块查询 {#block-query}
```java
// 获取方块ID
int blockId = block.getId();

// 获取方块数据值（变种）
int damage = block.getDamage();

// 获取方块完整ID（包含数据值）
int fullId = block.getFullId();

// 检查方块类型
if (block.getId() == Block.STONE) {
    player.sendMessage("这是石头！");
}

// 检查是否为固体方块
if (block.isSolid()) {
    player.sendMessage("这是固体方块");
}

// 检查是否透明（如玻璃等）
if (block.isTransparent()) {
    player.sendMessage("这是透明方块");
}
```

:::tip 提示
完整的方块ID列表可以在 `cn.nukkit.block.BlockID` 类中找到。
:::

## 方块属性系统 {#block-properties}

### 基础属性
```java
// 硬度和抗爆性
double hardness = block.getHardness();
double resistance = block.getResistance();

// 光照等级
int lightLevel = block.getLightLevel();

// 摩擦力
double friction = block.getFrictionFactor();

// 破坏工具类型要求（用于检查被破坏后是否掉落物品）
int toolType = block.getToolType();
```

### 特殊属性检查
```java
// 检查是否为液体
if (block instanceof BlockLiquid) {
    player.sendMessage("这是液体方块");
}

// 检查是否可燃烧
if (block.getBurnChance() > 0) {
    player.sendMessage("这个方块可以燃烧");
}
```

## 方块数据值详解 {#block-data-values}

许多方块使用数据值（Damage/Meta）来表示不同的变种或状态：

### 常见方块数据值示例
```java
// 木头类型（0-3分别为橡木、云杉、白桦、丛林）
Block oakLog = Block.get(Block.LOG, 0);
Block spruceLog = Block.get(Block.LOG, 1);

// 羊毛颜色（0-15代表不同颜色）
Block whiteWool = Block.get(Block.WOOL, 0);
Block redWool = Block.get(Block.WOOL, 14);

// 石头变种
Block stone = Block.get(Block.STONE, 0);      // 普通石头
Block granite = Block.get(Block.STONE, 1);    // 花岗岩
Block polishedGranite = Block.get(Block.STONE, 2); // 磨制花岗岩
```

## 特殊方块操作 {#advanced-operations}

### 容器方块操作
```java
// 获取箱子并操作其库存
Block chestBlock = level.getBlock(pos);
if (chestBlock instanceof BlockChest) {
    // 获取箱子实体
    BlockEntityChest chest = (BlockEntityChest) level.getBlockEntity(pos);
    if (chest != null) {
        // 向箱子中添加物品
        chest.getInventory().addItem(Item.get(Item.DIAMOND, 0, 64));
    }
}
```

### 批量方块操作
```java
// 创建一个立方体区域
public void fillCube(Level level, Vector3 pos1, Vector3 pos2, Block block) {
    int minX = Math.min(pos1.getFloorX(), pos2.getFloorX());
    int minY = Math.min(pos1.getFloorY(), pos2.getFloorY());
    int minZ = Math.min(pos1.getFloorZ(), pos2.getFloorZ());
    int maxX = Math.max(pos1.getFloorX(), pos2.getFloorX());
    int maxY = Math.max(pos1.getFloorY(), pos2.getFloorY());
    int maxZ = Math.max(pos1.getFloorZ(), pos2.getFloorZ());

    for (int x = minX; x <= maxX; x++) {
        for (int y = minY; y <= maxY; y++) {
            for (int z = minZ; z <= maxZ; z++) {
                level.setBlock(new Vector3(x, y, z), block.clone(), true, false);
            }
        }
    }
}

// 使用示例
fillCube(level, new Vector3(0, 64, 0), new Vector3(10, 74, 10), Block.get(Block.GLASS));
```

:::warning 重要提醒
1. 大量方块操作前务必检查区块是否已加载，避免触发不必要的区块加载
2. 批量操作时建议禁用实时更新（`setBlock`的`update`参数设为`false`），完成后统一更新
3. 操作液体方块时要特别注意流动机制，可能会影响周围大量方块
4. 使用`Block.clone()`来复制方块实例，避免多个位置共享同一个方块对象
:::
