---
sidebar_position: 8
---

# Inventory Guide

The `Inventory` interface is the core base class for all inventory systems in Nukkit-MOT, used to manage item storage and interaction for entities like players and containers.

## Inventory Core Overview {#inventory-core-overview}

Located in the [cn.nukkit.inventory](https://github.com/MemoriesOfTime/Nukkit-MOT/blob/master/src/main/java/cn/nukkit/inventory/Inventory.java) package, it defines the basic contract for inventory operations.

:::tip Main Implementation Classes
- **PlayerInventory** - Player's personal inventory (36 slots backpack + 4 slots equipment + offhand)
- Various container inventories (ChestInventory, EnderChestInventory, etc.)
:::

## Obtaining Inventory Instances {#obtaining-inventory-instances}

### Online Player Inventory
```java
// Get player's main inventory
PlayerInventory playerInv = player.getInventory();

// Get player's offhand inventory
PlayerOffhandInventory offhandInv = player.getOffhandInventory();
```

### Offline Player Data
```java
// Get offline player data handler via UUID
OfflinePlayer offlinePlayer = Server.getInstance()
    .getOfflinePlayer(uuid);

// Convert from online player
Player onlinePlayer = Server.getInstance().getPlayer(name);
if (onlinePlayer != null) {
    OfflinePlayer offlinePlayer = (OfflinePlayer) Server.getInstance()
        .getOfflinePlayer(onlinePlayer.getUniqueId());
}
```

## Basic Inventory Operations {#basic-inventory-operations}

### Getting and Setting Contents
```java
// Get all items (returns Map<slot, item>)
Map<Integer, Item> allItems = inventory.getContents();

// Batch set inventory contents
inventory.setContents(itemMap);

// Operate on single slot
Item item = inventory.getItem(0);      // Get item at slot 0
inventory.setItem(0, newItem);          // Set item at slot 0
inventory.clear(0);                     // Clear slot 0
```

### Player Offhand Operations
```java
// Get offhand item
Item offhandItem = player.getOffhandInventory().getItem(0);

// Set offhand item
player.getOffhandInventory().setItem(0, Item.get(Item.SHIELD));
```

## Slot System Details {#slot-system-details}

### Slot Identifier Reference Table
| Slot Range/Identifier | Corresponding Area | Inventory API Slot | NBT Storage Slot |
|----------------------|-------------------|-------------------|-----------------|
| 0-8 | Hotbar | 0-8 | 0-8 |
| 9-35 | Main Inventory | 9-35 | 9-35 |
| 36-39 | Equipment Slots (Helmet-Boots) | 36-39 | 100-103 |
| Special Identifier | Offhand | Via `getOffhandInventory()` | -106 |

### Slot Conversion Examples
```java
// Slot conversion when loading items from NBT data
int nbtSlot = itemTag.getByte("Slot");
if (nbtSlot >= 100 && nbtSlot < 104) {
    // Armor slots: 100(boots) -> 39, 101(leggings) -> 38, 102(chestplate) -> 37, 103(helmet) -> 36
    inventory.setItem(103 - nbtSlot + 36, item);
} else if (nbtSlot == -106) {
    // Offhand slot
    player.getOffhandInventory().setItem(0, item);
} else if (nbtSlot >= 0 && nbtSlot < 36) {
    // Main backpack slots (NBT and API slots match)
    inventory.setItem(nbtSlot, item);
}
```

## NBT Data Operations {#nbt-data-operations}

### Reading and Writing Player NBT Data
```java
// Get player's complete NBT data
CompoundTag playerData = Server.getInstance()
    .getOfflinePlayerData(player.getUniqueId());

// Get inventory NBT list
ListTag<CompoundTag> inventoryTag = playerData.getList("Inventory", CompoundTag.class);

// Save modified data
Server.getInstance().saveOfflinePlayerData(
    player.getUniqueId(), 
    playerData, 
    false // Async save
);
```

### Item and NBT Interconversion
```java
// Convert Item to CompoundTag (includes slot information)
CompoundTag itemTag = NBTIO.putItemHelper(item, slot);

// Convert CompoundTag to Item
Item item = NBTIO.getItemHelper(itemTag);
```

## Inventory Synchronization Mechanism {#inventory-synchronization}

### Real-time Synchronization Mode
```java
// Scenario: Player A views Player B's inventory
// 1. Synchronize B's inventory contents to A's viewing interface
viewerInventory.setContents(targetPlayer.getInventory().getContents());

// 2. Synchronize A's modifications back to B's actual inventory
targetPlayer.getInventory()
    .setContents(viewerInventory.getContents());
```

### Force Client Update
```java
// Update player's entire inventory view
player.getInventory().sendContents(player);

// Update single slot
player.getInventory().sendSlot(5, player);
```

## Utility Methods {#utility-methods}

### Player Lookup Tool
```java
/**
 * Find player by name (supports both online and offline)
 */
public static OfflinePlayer findPlayerByName(String name) {
    // 1. Prioritize finding online player
    Player onlinePlayer = Server.getInstance().getPlayer(name);
    if (onlinePlayer != null) {
        return (OfflinePlayer) Server.getInstance()
            .getOfflinePlayer(onlinePlayer.getUniqueId());
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
            OfflinePlayer offlinePlayer = (OfflinePlayer) 
                Server.getInstance().getOfflinePlayer(uuid);
            if (offlinePlayer != null && offlinePlayer.getName().equals(name)) {
                return offlinePlayer;
            }
        }
    }
    
    return null;
}
```

### Inventory Data Conversion
```java
/**
 * Convert online player inventory to offline inventory data object
 */
public static OfflineInventory convertToOffline(PlayerInventory onlineInv) {
    // Get player NBT data
    CompoundTag playerTag = Server.getInstance()
        .getOfflinePlayerData(onlineInv.getHolder().getUniqueId());
    
    // Create offline inventory object
    OfflineInventory offlineInv = new OfflineInventory(
        playerTag,
        new OfflinePlayer(Server.getInstance(), onlineInv.getHolder().getUniqueId())
    );
    
    // Copy main inventory contents
    offlineInv.setContents(onlineInv.getContents());
    
    // Copy offhand contents
    offlineInv.setOffhandInventory(
        onlineInv.getHolder().getOffhandInventory().getItem(0)
    );
    
    return offlineInv;
}
```

## Creating Custom Inventory Interfaces {#creating-custom-inventory}

### Using FakeInventories (Recommended)
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
menu.setItem(13, Item.get(Item.BOOK).setCustomName("§eInformation Book"));
menu.addListener(event -> {
    event.setCancelled();
    event.getPlayer().sendMessage("Menu clicked!");
});

// Show to player
player.addWindow(menu);
```

## Notes and Best Practices {#notes-and-best-practices}

### Thread Safety
- Inventory operations should be executed on the main server thread
- Use state flags to control concurrent access
- Consider using `ScheduledExecutorService` for scheduled updates

### Slot Considerations
1. **Slot Offset**: NBT storage slots differ from API slots, pay attention to conversion
2. **Special Slots**: Offhand slot identifier is -106, armor slots start from 100
3. **Client Synchronization**: Manual calls to `sendContents()` or `sendSlot()` may be needed after modifications

### Memory Management
```java
// Clean up references to inventories no longer in use
inventoryHolder = null;
// Recommended to call at appropriate times, avoid forced garbage collection
// System.gc(); // Usually not recommended to call manually
```

### Data Saving
```java
// Must save after modifying offline player data
Server.getInstance().saveOfflinePlayerData(uuid, playerData, false);

// Online player data saves automatically, but force save for important operations
player.save();
```

## Common Constants Reference {#common-constants}

```java
// Slot constants
int HOTBAR_START = 0;
int HOTBAR_END = 8;
int INVENTORY_START = 9;
int INVENTORY_END = 35;
int ARMOR_START = 36;
int ARMOR_END = 39;
int OFFHAND_SLOT = -106;

// Item constants
int AIR = 0;
int MAX_STACK_SIZE = 64;

// Player slot counts
int SURVIVAL_SLOTS = 36; // Player.SURVIVAL_SLOTS
```

## Troubleshooting {#troubleshooting}

### Item Synchronization Issues
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

### NBT Data Corruption
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
    player.kick("Data corrupted, repaired");
}
```
