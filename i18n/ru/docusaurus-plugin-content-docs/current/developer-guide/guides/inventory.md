---
sidebar_position: 9
---

# Руководство по инвентарю

Интерфейс `Inventory` — это базовый класс ядра для всех систем инвентаря в Nukkit-MOT, используемый для управления хранением предметов и взаимодействием с ними для таких сущностей, как игроки, контейнеры и т. д.

## Обзор ядра инвентаря {#inventory-core-overview}

Он расположен в пакете [cn.nukkit.inventory](https://github.com/MemoriesOfTime/Nukkit-MOT/blob/master/src/main/java/cn/nukkit/inventory/Inventory.java) и определяет базовый контракт операций с инвентарём.

:::tip Основные классы реализации
- **PlayerInventory** — личный инвентарь игрока (рюкзак на 36 слотов + 4 слота экипировки + вторая рука)
- Различные инвентари контейнеров (ChestInventory, EnderChestInventory и т. д.)
:::

## Получение экземпляров инвентаря {#obtaining-inventory-instances}

### Инвентарь игрока в сети
```java
// Get player's main inventory
PlayerInventory playerInv = player.getInventory();

// Get player's offhand inventory
PlayerOffhandInventory offhandInv = player.getOffhandInventory();
```

### Данные игрока не в сети
```java
// Get offline player NBT data through UUID
CompoundTag playerData = Server.getInstance()
    .getOfflinePlayerData(uuid);

// Convert through online player
Player onlinePlayer = Server.getInstance().getPlayer(name);
if (onlinePlayer != null) {
    CompoundTag onlineData = Server.getInstance()
        .getOfflinePlayerData(onlinePlayer.getUniqueId());
}
```

## Базовые операции с инвентарём {#basic-inventory-operations}

### Получение и установка содержимого
```java
// Get all items (returns Map<Slot, Item>)
Map<Integer, Item> allItems = inventory.getContents();

// Batch set inventory contents
inventory.setContents(itemMap);

// Operate on single slot
Item item = inventory.getItem(0);      // Get item in slot 0
inventory.setItem(0, newItem);          // Set item in slot 0
inventory.clear(0);                     // Clear slot 0
```

### Операции со второй рукой игрока
```java
// Get offhand item
Item offhandItem = player.getOffhandInventory().getItem(0);

// Set offhand item
player.getOffhandInventory().setItem(0, Item.get(Item.SHIELD));
```

## Подробности системы слотов {#slot-system-details}

### Справочная таблица идентификации слотов
| Диапазон/идентификатор слота | Соответствующая область | Слот API инвентаря | Слот хранения NBT |
|----------------------|-------------------|-------------------|------------------|
| 0-8 | Хотбар | 0-8 | 0-8 |
| 9-35 | Основной инвентарь | 9-35 | 9-35 |
| 36-39 | Панель экипировки (шлем — ботинки) | 36-39 | 100-103 |
| Особый идентификатор | Вторая рука | Через `getOffhandInventory()` | -106 |

### Пример преобразования слотов
```java
// Slot conversion when loading items from NBT data
int nbtSlot = itemTag.getByte("Slot");
if (nbtSlot >= 100 && nbtSlot < 104) {
    // Armor slots: 100(helmet) -> 36, 101(chestplate) -> 37, 102(leggings) -> 38, 103(boots) -> 39
    inventory.setItem(nbtSlot - 100 + 36, item);
} else if (nbtSlot == -106) {
    // Offhand slot
    player.getOffhandInventory().setItem(0, item);
} else if (nbtSlot >= 0 && nbtSlot < 36) {
    // Main backpack slots (NBT and API slots are consistent)
    inventory.setItem(nbtSlot, item);
}
```

## Операции с данными NBT {#nbt-data-operations}

### Чтение/запись NBT-данных игрока
```java
// Get complete player NBT data
CompoundTag playerData = Server.getInstance()
    .getOfflinePlayerData(player.getUniqueId());

// Get inventory NBT list
ListTag<CompoundTag> inventoryTag = playerData.getList("Inventory", CompoundTag.class);

// Save modified data
Server.getInstance().saveOfflinePlayerData(
    player.getUniqueId(), 
    playerData, 
    false // asynchronous save
);
```

### Взаимное преобразование Item и NBT
```java
// Convert Item to CompoundTag (including slot information)
CompoundTag itemTag = NBTIO.putItemHelper(item, slot);

// Convert CompoundTag to Item
Item item = NBTIO.getItemHelper(itemTag);
```

## Механизм синхронизации инвентаря {#inventory-synchronization}

### Режим синхронизации в реальном времени
```java
// Scenario: Player A views Player B's inventory
// 1. Sync B's inventory content to A's viewing interface
viewerInventory.setContents(targetPlayer.getInventory().getContents());

// 2. Sync A's modifications back to B's actual inventory
targetPlayer.getInventory()
    .setContents(viewerInventory.getContents());
```

### Принудительное обновление клиента
```java
// Update player's entire inventory view
player.getInventory().sendContents(player);

// Update single slot
player.getInventory().sendSlot(5, player);
```

## Вспомогательные методы {#utility-methods}

### Инструмент поиска игрока
```java
/**
 * Find player by name (supports online and offline)
 */
public static CompoundTag findPlayerByName(String name) {
    // 1. Prioritize finding online players
    Player onlinePlayer = Server.getInstance().getPlayer(name);
    if (onlinePlayer != null) {
        return Server.getInstance()
            .getOfflinePlayerData(onlinePlayer.getUniqueId());
    }
    
    // 2. Scan offline data files
    File dataDir = new File(Server.getInstance().getDataPath(), "players/");
    Pattern uuidPattern = Pattern.compile(
        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\.dat$"
    );
    
    File[] playerFiles = dataDir.listFiles(file -> 
        file != null && uuidPattern.matcher(file.getName()).matches()
    );
    
    // 3. Compare player names
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

### Преобразование данных инвентаря
```java
/**
 * Convert online player inventory to NBT data
 */
public static CompoundTag convertToOffline(PlayerInventory onlineInv) {
    // Get player NBT data
    CompoundTag playerTag = Server.getInstance()
        .getOfflinePlayerData(onlineInv.getHolder().getUniqueId());
    
    // Create new inventory tag list
    ListTag<CompoundTag> inventoryList = new ListTag<>("Inventory");
    
    // Add main inventory content
    for (Map.Entry<Integer, Item> entry : onlineInv.getContents().entrySet()) {
        int slot = entry.getKey();
        Item item = entry.getValue();
        
        if (item == null || item.getId() == Item.AIR) continue;
        
        CompoundTag itemTag = NBTIO.putItemHelper(item, slot);
        inventoryList.add(itemTag);
    }
    
    // Add offhand content
    Item offhandItem = onlineInv.getHolder().getOffhandInventory().getItem(0);
    if (offhandItem != null && offhandItem.getId() != Item.AIR) {
        CompoundTag offhandTag = NBTIO.putItemHelper(offhandItem, -106);
        inventoryList.add(offhandTag);
    }
    
    // Update inventory in player data
    playerTag.putList(inventoryList);
    
    return playerTag;
}
```

## Создание пользовательского интерфейса инвентаря {#creating-custom-inventory}

### Использование FakeInventories (рекомендуется)
```java
// Add Maven dependency
/*
<dependency>
    <groupId>com.nukkitx</groupId>
    <artifactId>fakeinventories</artifactId>
    <version>1.0.3-MOT-SNAPSHOT</version>
    <scope>provided</scope>
</dependency>
*/

// Create custom GUI
ChestFakeInventory menu = new ChestFakeInventory(null, "§6Custom Menu");

// Set items and event listeners
menu.setItem(13, Item.get(Item.BOOK).setCustomName("§eInformation Manual"));
menu.addListener(event -> {
    event.setCancelled();
    event.getPlayer().sendMessage("Menu clicked!");
});

// Display to player
player.addWindow(menu);
```

## Замечания и лучшие практики {#notes-and-best-practices}

### Потокобезопасность
- Операции с инвентарём должны выполняться в главном потоке сервера
- Используйте флаги состояния для управления параллельным доступом
- Рассмотрите возможность использования `ScheduledExecutorService` для отложенных обновлений

### Особенности слотов
1. **Смещение слотов**: слоты хранения NBT отличаются от слотов API, необходимо преобразование
2. **Особые слоты**: слот второй руки идентифицируется как -106, слоты брони начинаются со 100
3. **Синхронизация с клиентом**: после изменений может потребоваться вручную вызвать `sendContents()` или `sendSlot()`

### Управление памятью
```java
// Clean up unused inventory references in a timely manner
inventoryHolder = null;
// Recommended to call at appropriate times to avoid forced garbage collection
// System.gc(); // Manual calling is generally not recommended
```

### Сохранение данных
```java
// Must save after modifying offline player data
Server.getInstance().saveOfflinePlayerData(uuid, playerData, false);

// Online player data is automatically saved, but important operations can force saving
player.save();
```

## Справочник общих констант {#common-constants}

```java
// Slot constants
int HOTBAR_START = 0;
int HOTBAR_END = 8;
int INVENTORY_START = 9;
int INVENTORY_END = 35;
int ARMOR_START = 36;
int ARMOR_END = 39;
int OFFHAND_SLOT = -106; // For NBT storage

// Item constants
int AIR = 0;
int MAX_STACK_SIZE = 64;

// Player slot counts
int INVENTORY_SIZE = 36; // Hotbar(9) + Main inventory(27)
```

## Устранение неполадок {#troubleshooting}

### Проблемы синхронизации предметов
```java
// 1. Check if operating on main thread
Server.getInstance().getScheduler()
    .scheduleTask(this, () -> {
        // Inventory operation code
    });

// 2. Force update client view
player.getInventory().sendContents(player);

// 3. Check if slot mapping is correct
System.out.println("Slot mapping: " + inventory.getContents().keySet());
```

### Повреждение данных NBT
```java
try {
    CompoundTag data = Server.getInstance()
        .getOfflinePlayerData(uuid);
    // Operate on data...
} catch (IOException e) {
    // Backup corrupted file and create new data
    File backup = new File("players/" + uuid + ".dat.bak");
    File playerDataFile = new File("players/" + uuid + ".dat");
    if (playerDataFile.exists()) {
        playerDataFile.renameTo(backup);
    }
    player.kick("Data corrupted, fixed");
}
```
