---
sidebar_position: 8
---

# Inventory 库存指南

`Inventory` 接口是Nukkit-MOT中所有物品栏系统的核心基类，用于管理玩家、容器等实体的物品存储与交互。

## Inventory 核心概述 {#inventory-core-overview}

位于 [cn.nukkit.inventory](https://github.com/MemoriesOfTime/Nukkit-MOT/blob/master/src/main/java/cn/nukkit/inventory/Inventory.java) 包中，定义了库存操作的基本契约。

:::tip 主要实现类
- **PlayerInventory** - 玩家随身物品栏（36格背包+4格装备+副手）
- 各类容器库存（ChestInventory, EnderChestInventory等）
:::

## 获取库存实例 {#obtaining-inventory-instances}

### 在线玩家库存
```java
// 获取玩家主物品栏
PlayerInventory playerInv = player.getInventory();

// 获取玩家副手物品栏
PlayerOffhandInventory offhandInv = player.getOffhandInventory();
```

### 离线玩家数据
```java
// 通过UUID获取离线玩家NBT数据
CompoundTag playerData = Server.getInstance()
    .getOfflinePlayerData(uuid);

// 通过在线玩家转换
Player onlinePlayer = Server.getInstance().getPlayer(name);
if (onlinePlayer != null) {
    CompoundTag onlineData = Server.getInstance()
        .getOfflinePlayerData(onlinePlayer.getUniqueId());
}
```

## 库存基本操作 {#basic-inventory-operations}

### 获取与设置内容
```java
// 获取全部物品（返回Map<槽位, 物品>）
Map<Integer, Item> allItems = inventory.getContents();

// 批量设置库存内容
inventory.setContents(itemMap);

// 操作单个槽位
Item item = inventory.getItem(0);      // 获取槽位0的物品
inventory.setItem(0, newItem);          // 设置槽位0的物品
inventory.clear(0);                     // 清空槽位0
```

### 玩家副手操作
```java
// 获取副手物品
Item offhandItem = player.getOffhandInventory().getItem(0);

// 设置副手物品
player.getOffhandInventory().setItem(0, Item.get(Item.SHIELD));
```

## 槽位系统详解 {#slot-system-details}

### 槽位标识对照表
| 槽位范围/标识 | 对应区域 | Inventory API 槽位 | NBT存储槽位 |
|--------------|----------|-------------------|------------|
| 0-8 | 快捷栏 | 0-8 | 0-8 |
| 9-35 | 主物品栏 | 9-35 | 9-35 |
| 36-39 | 装备栏（头盔-靴子） | 36-39 | 100-103 |
| 特殊标识 | 副手 | 通过`getOffhandInventory()` | -106 |

### 槽位转换示例
```java
// 从NBT数据加载物品时的槽位转换
int nbtSlot = itemTag.getByte("Slot");
if (nbtSlot >= 100 && nbtSlot < 104) {
    // 盔甲槽位：100(头盔) -> 36, 101(胸甲) -> 37, 102(护腿) -> 38, 103(靴子) -> 39
    inventory.setItem(nbtSlot - 100 + 36, item);
} else if (nbtSlot == -106) {
    // 副手槽位
    player.getOffhandInventory().setItem(0, item);
} else if (nbtSlot >= 0 && nbtSlot < 36) {
    // 主背包槽位（NBT与API槽位一致）
    inventory.setItem(nbtSlot, item);
}
```

## NBT数据操作 {#nbt-data-operations}

### 读写玩家NBT数据
```java
// 获取玩家完整NBT数据
CompoundTag playerData = Server.getInstance()
    .getOfflinePlayerData(player.getUniqueId());

// 获取库存NBT列表
ListTag<CompoundTag> inventoryTag = playerData.getList("Inventory", CompoundTag.class);

// 保存修改后的数据
Server.getInstance().saveOfflinePlayerData(
    player.getUniqueId(), 
    playerData, 
    false // 异步保存
);
```

### 物品与NBT互相转换
```java
// Item 转换为 CompoundTag（包含槽位信息）
CompoundTag itemTag = NBTIO.putItemHelper(item, slot);

// CompoundTag 转换为 Item
Item item = NBTIO.getItemHelper(itemTag);
```

## 库存同步机制 {#inventory-synchronization}

### 实时同步模式
```java
// 场景：玩家A查看玩家B的背包
// 1. 将B的背包内容同步到A的查看界面
viewerInventory.setContents(targetPlayer.getInventory().getContents());

// 2. 将A的修改同步回B的实际背包
targetPlayer.getInventory()
    .setContents(viewerInventory.getContents());
```

### 强制客户端更新
```java
// 更新玩家整个库存视图
player.getInventory().sendContents(player);

// 更新单个槽位
player.getInventory().sendSlot(5, player);
```

## 实用工具方法 {#utility-methods}

### 玩家查找工具
```java
/**
 * 通过玩家名查找玩家（支持在线和离线）
 */
public static CompoundTag findPlayerByName(String name) {
    // 1. 优先查找在线玩家
    Player onlinePlayer = Server.getInstance().getPlayer(name);
    if (onlinePlayer != null) {
        return Server.getInstance()
            .getOfflinePlayerData(onlinePlayer.getUniqueId());
    }
    
    // 2. 扫描离线数据文件
    File dataDir = new File(Server.getInstance().getDataPath(), "players/");
    Pattern uuidPattern = Pattern.compile(
        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\.dat$"
    );
    
    File[] playerFiles = dataDir.listFiles(file -> 
        file != null && uuidPattern.matcher(file.getName()).matches()
    );
    
    // 3. 比对玩家名
    if (playerFiles != null) {
        for (File file : playerFiles) {
            UUID uuid = UUID.fromString(file.getName().replace(".dat", ""));
            CompoundTag playerData = Server.getInstance().getOfflinePlayerData(uuid);
            if (playerData != null && playerData.getString("Name").equals(name)) {
                return playerData;
            }
        }
    }
    
    return null;
}
```

### 库存数据转换
```java
/**
 * 在线玩家背包转换为NBT数据
 */
public static CompoundTag convertToOffline(PlayerInventory onlineInv) {
    // 获取玩家NBT数据
    CompoundTag playerTag = Server.getInstance()
        .getOfflinePlayerData(onlineInv.getHolder().getUniqueId());
    
    // 创建新的库存标签列表
    ListTag<CompoundTag> inventoryList = new ListTag<>("Inventory");
    
    // 添加主背包内容
    for (Map.Entry<Integer, Item> entry : onlineInv.getContents().entrySet()) {
        int slot = entry.getKey();
        Item item = entry.getValue();
        
        if (item == null || item.getId() == Item.AIR) continue;
        
        CompoundTag itemTag = NBTIO.putItemHelper(item, slot);
        inventoryList.add(itemTag);
    }
    
    // 添加副手内容
    Item offhandItem = onlineInv.getHolder().getOffhandInventory().getItem(0);
    if (offhandItem != null && offhandItem.getId() != Item.AIR) {
        CompoundTag offhandTag = NBTIO.putItemHelper(offhandItem, -106);
        inventoryList.add(offhandTag);
    }
    
    // 更新玩家数据中的库存
    playerTag.putList(inventoryList);
    
    return playerTag;
}
```

## 创建自定义库存界面 {#creating-custom-inventory}

### 使用 FakeInventories（推荐）
```java
// 添加Maven依赖
/*
<dependency>
    <groupId>com.nukkitx</groupId>
    <artifactId>fakeinventories</artifactId>
    <version>1.0.3-MOT-SNAPSHOT</version>
    <scope>provided</scope>
</dependency>
*/

// 创建自定义GUI
ChestFakeInventory menu = new ChestFakeInventory(null, "§6自定义菜单");

// 设置物品和事件监听
menu.setItem(13, Item.get(Item.BOOK).setCustomName("§e信息手册"));
menu.addListener(event -> {
    event.setCancelled();
    event.getPlayer().sendMessage("菜单被点击！");
});

// 显示给玩家
player.addWindow(menu);
```

## 注意事项与最佳实践 {#notes-and-best-practices}

### 线程安全
- 库存操作应在主服务器线程执行
- 使用状态标记控制并发访问
- 考虑使用`ScheduledExecutorService`进行定时更新

### 槽位注意事项
1. **槽位偏移**：NBT存储的槽位与API槽位存在差异，需注意转换
2. **特殊槽位**：副手槽位标识为-106，盔甲槽位从100开始
3. **客户端同步**：修改后可能需要手动调用`sendContents()`或`sendSlot()`

### 内存管理
```java
// 及时清理不再使用的库存引用
inventoryHolder = null;
// 建议在合适时机调用，避免强制垃圾回收
// System.gc(); // 通常不建议手动调用
```

### 数据保存
```java
// 修改离线玩家数据后必须保存
Server.getInstance().saveOfflinePlayerData(uuid, playerData, false);

// 在线玩家数据会自动保存，但重要操作可强制保存
player.save();
```

## 常用常量参考 {#common-constants}

```java
// 槽位常量
int HOTBAR_START = 0;
int HOTBAR_END = 8;
int INVENTORY_START = 9;
int INVENTORY_END = 35;
int ARMOR_START = 36;
int ARMOR_END = 39;
int OFFHAND_SLOT = -106; // NBT存储用

// 物品常量
int AIR = 0;
int MAX_STACK_SIZE = 64;

// 玩家槽位数量
int INVENTORY_SIZE = 36; // 快捷栏(9) + 主背包(27)
```

## 故障排除 {#troubleshooting}

### 物品不同步问题
```java
// 1. 检查是否在主线程操作
Server.getInstance().getScheduler()
    .scheduleTask(this, () -> {
        // 库存操作代码
    });

// 2. 强制更新客户端视图
player.getInventory().sendContents(player);

// 3. 检查槽位映射是否正确
System.out.println("槽位映射: " + inventory.getContents().keySet());
```

### NBT数据损坏
```java
try {
    CompoundTag data = Server.getInstance()
        .getOfflinePlayerData(uuid);
    // 操作数据...
} catch (IOException e) {
    // 备份损坏文件并创建新数据
    File backup = new File("players/" + uuid + ".dat.bak");
    File playerDataFile = new File("players/" + uuid + ".dat");
    if (playerDataFile.exists()) {
        playerDataFile.renameTo(backup);
    }
    player.kick("数据损坏，已修复");
}
```
