---
sidebar_position: 8
---

# Inventory 库存指南

`Inventory` 类用于管理玩家、容器等实体的物品栏系统。本指南将介绍如何通过Nukkit API操作库存系统。

## Inventory 类概述 \{#inventory-class-overview}

位于 [cn.nukkit.inventory](https://github.com/MemoriesOfTime/Nukkit-MOT/blob/master/src/main/java/cn/nukkit/inventory/Inventory.java) 包中，所有库存类型的基类。

:::tip 常用子类
- **PlayerInventory** 玩家随身物品栏
- **ChestInventory** 箱子容器库存
- **EnderChestInventory** 末影箱库存
:::

## 获取库存实例 \{#obtaining-inventory}

通常不需要直接实例化库存对象，而是通过实体获取：

```java
// 获取玩家物品栏
PlayerInventory playerInv = player.getInventory();

// 获取打开的箱子库存
ChestInventory chestInv = (ChestInventory) player.getWindowById(WindowId.CHEST);
```

## 主要操作方法 \{#main-operations}

### 添加物品 \{#add-items}
```java
Item diamond = Item.get(Item.DIAMOND);

// 直接给予玩家
player.giveItem(diamond);

// 安全添加（返回未放入的物品）
Item[] leftovers = playerInv.addItem(diamond);

// 强制添加到指定槽位
playerInv.setItem(0, diamond); // 0为热键栏第一个格子
```

### 移除物品 \{#remove-items}
```java
// 移除指定数量的物品
playerInv.removeItem(Item.get(Item.DIAMOND, 0, 5)); // 移除5个钻石

// 清空指定槽位
playerInv.clear(36); // 移除装备栏头盔位置
```

### 物品查询 \{#item-query}
```java
// 获取主手物品
Item mainHand = playerInv.getItemInHand();

// 检查是否有至少64个圆石
boolean hasCobble = playerInv.contains(Item.get(Item.COBBLESTONE, 0, 64));

// 获取所有物品
Item[] contents = playerInv.getContents().values().toArray(new Item[0]);
```

## 槽位系统 \{#slot-system}

### 玩家库存槽位对应表
| 槽位编号 | 说明               |
|----------|--------------------|
| 0-8      | 快捷栏             |
| 9-35     | 主物品栏           |
| 36-39    | 装备栏（头盔-靴子）|
| 40       | 副手               |

### 装备操作示例
```java
// 给玩家装备钻石胸甲
Item chestplate = Item.get(Item.DIAMOND_CHESTPLATE);
playerInv.setItem(38, chestplate); // 38为胸甲槽位

// 获取玩家头盔
Item helmet = playerInv.getHelmet();
```

## 库存事件监听 \{#inventory-events}

### 基础监听示例
```java
@EventHandler
public void onInventoryClick(InventoryClickEvent event) {
    Player player = event.getPlayer();
    Item clicked = event.getSourceItem();
    
    // 取消所有钻石的点击
    if(clicked.getId() == Item.DIAMOND) {
        event.setCancelled();
        player.sendMessage("禁止操作钻石！");
    }
}
```

### 高级交易监听
```java
@EventHandler
public void onTransaction(InventoryTransactionEvent event) {
    for(InventoryAction action : event.getTransaction().getActions()) {
        if(action instanceof SlotChangeAction) {
            SlotChangeAction slotAction = (SlotChangeAction) action;
            // 检测箱子第一格被放入钻石
            if(slotAction.getInventory() instanceof ChestInventory 
               && slotAction.getSlot() == 0 
               && slotAction.getTargetItem().getId() == Item.DIAMOND) {
                event.setCancelled();
            }
        }
    }
}
```

## 特殊库存操作 \{#advanced-operations}

### 保存/恢复库存
```java
// 保存全部物品
Map<Integer, Item> savedItems = new HashMap<>(playerInv.getContents());

// 清空库存
playerInv.clearAll();

// 恢复库存
savedItems.forEach((slot, item) -> playerInv.setItem(slot, item));
```

### 自定义库存布局
```java
// 创建虚拟库存
CustomInventory myInv = new CustomInventory(InventoryType.CHEST.getDefaultTitle());

// 设置占位符
Item border = Item.get(Item.STAINED_GLASS_PANE, 14).setCustomName(" ");
for(int i : new int[]{0,1,7,8,9,17,18,26,27,35,36,44}){
    myInv.setItem(i, border);
}

// 添加功能按钮
Item infoBtn = Item.get(Item.BOOK).setCustomName("§e点击查看信息");
myInv.setItem(22, infoBtn);
```

:::warning 重要提醒
1. 操作非玩家库存时（如箱子），务必先检查 `inventory.getHolder()` 是否有效
2. 修改库存后可能需要调用 `inventory.sendContents(player)` 同步客户端
3. 对于容器库存，使用 `InventoryCloseEvent` 来保存数据
:::

## 实用工具方法 \{#utility-methods}

### 快速填充方法
```java
// 填充一组圆石到所有空位
Item cobble = Item.get(Item.COBBLESTONE, 0, 64);
for(int i=0; i<playerInv.getSize(); i++){
    if(playerInv.getItem(i).isNull()){
        playerInv.setItem(i, cobble.clone());
    }
}

// 随机清空库存
List<Integer> slots = new ArrayList<>(playerInv.getContents().keySet());
Collections.shuffle(slots);
slots.subList(0, 5).forEach(slot -> playerInv.clear(slot)); // 随机清空5格
```

## 常见问题处理 \{#troubleshooting}

### 物品不同步问题
使用以下方法强制更新：
```java
playerInv.sendContents(player); // 更新整个库存
playerInv.sendSlot(0, player);  // 更新指定槽位
```

### 处理不可堆叠物品
```java
Item specialItem = Item.get(Item.DIAMOND_SWORD);
specialItem.setCompoundTag(new CompoundTag().putString("UniqueID", UUID.randomUUID().toString()));

// 添加时会占用不同槽位
playerInv.addItem(specialItem.clone(), specialItem.clone()); 
```
