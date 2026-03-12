---
sidebar_position: 6
---

# Block Guide

The `Block` class is the core class in Nukkit for representing and manipulating blocks in the game world. This guide provides detailed instructions on how to work with blocks using the Nukkit API.

## Block Class Overview {#block-class-overview}

Located in the [cn.nukkit.block](https://github.com/MemoriesOfTime/Nukkit-MOT/blob/master/src/main/java/cn/nukkit/block/Block.java) package, `Block` is the base class for all block types.

## Obtaining Block Instances {#obtaining-blocks}

### Getting Blocks from World Coordinates
```java
// Get block below player's feet
Block blockBelow = player.getLevel().getBlock(player.getFloorX(), player.getFloorY() - 1, player.getFloorZ());

// Get block using Position object
Position pos = new Position(100, 64, 100, level);
Block block = pos.getLevel().getBlock(pos);

// Get block using Vector3 object
Vector3 vec = new Vector3(100, 64, 100);
Block block = level.getBlock(vec);
```

### Creating New Block Instances
```java
// Create using block ID
Block stone = Block.get(Block.STONE);

// Create with data value (variant)
Block graniteStone = Block.get(Block.STONE, 1); // Granite
```

## Main Operations {#main-operations}

### Setting Blocks {#place-blocks}
```java
// Set block
Level level = player.getLevel();
level.setBlock(new Vector3(100, 64, 100), Block.get(Block.DIAMOND_BLOCK));

// Place and update surrounding blocks
level.setBlock(pos, Block.get(Block.STONE), true, true);
```

:::warning

The Level#setBlock() method is used to directly set blocks. For special blocks (such as doors, beds, etc.), try using the `Block#place()` method.

:::

### Breaking Blocks {#break-blocks}
```java
// Directly remove block (set to air)
level.setBlock(pos, Block.get(Block.AIR));

// Use break method (drops items)
Block block = level.getBlock(pos);
level.useBreakOn(pos, Item.get(Item.DIAMOND_PICKAXE), player); // Player breaks block with diamond pickaxe
```

### Block Queries {#block-query}
```java
// Get block ID
int blockId = block.getId();

// Get block data value (variant)
int damage = block.getDamage();

// Get full block ID (including data value)
int fullId = block.getFullId();

// Check block type
if (block.getId() == Block.STONE) {
    player.sendMessage("This is stone!");
}

// Check if solid block
if (block.isSolid()) {
    player.sendMessage("This is a solid block");
}

// Check if transparent (such as glass)
if (block.isTransparent()) {
    player.sendMessage("This is a transparent block");
}
```

:::tip Tip
The complete block ID list can be found in the `cn.nukkit.block.BlockID` class.
:::

## Block Property System {#block-properties}

### Basic Properties
```java
// Hardness and blast resistance
double hardness = block.getHardness();
double resistance = block.getResistance();

// Light level
int lightLevel = block.getLightLevel();

// Friction
double friction = block.getFrictionFactor();

// Tool type requirement for breaking (used to check if items drop after breaking)
int toolType = block.getToolType();
```

### Special Property Checks
```java
// Check if liquid
if (block instanceof BlockLiquid) {
    player.sendMessage("This is a liquid block");
}

// Check if flammable
if (block.getBurnChance() > 0) {
    player.sendMessage("This block can burn");
}
```

## Block Data Values Explained {#block-data-values}

Many blocks use data values (Damage/Meta) to represent different variants or states:

### Common Block Data Value Examples
```java
// Wood types (0-3 for Oak, Spruce, Birch, Jungle)
Block oakLog = Block.get(Block.LOG, 0);
Block spruceLog = Block.get(Block.LOG, 1);

// Wool colors (0-15 represent different colors)
Block whiteWool = Block.get(Block.WOOL, 0);
Block redWool = Block.get(Block.WOOL, 14);

// Stone variants
Block stone = Block.get(Block.STONE, 0);      // Normal stone
Block granite = Block.get(Block.STONE, 1);    // Granite
Block polishedGranite = Block.get(Block.STONE, 2); // Polished granite
```

## Advanced Block Operations {#advanced-operations}

### Container Block Operations
```java
// Get chest and manipulate its inventory
Block chestBlock = level.getBlock(pos);
if (chestBlock instanceof BlockChest) {
    // Get chest entity
    BlockEntityChest chest = (BlockEntityChest) level.getBlockEntity(pos);
    if (chest != null) {
        // Add items to chest
        chest.getInventory().addItem(Item.get(Item.DIAMOND, 0, 64));
    }
}
```

### Bulk Block Operations
```java
// Create a cubic region
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

// Usage example
fillCube(level, new Vector3(0, 64, 0), new Vector3(10, 74, 10), Block.get(Block.GLASS));
```

:::warning Important Reminders
1. Always check if chunks are loaded before bulk block operations to avoid unnecessary chunk loading
2. For bulk operations, disable real-time updates (set `update` parameter of `setBlock` to `false`), then update uniformly after completion
3. Be especially careful when working with liquid blocks as flow mechanics can affect many surrounding blocks
4. Use `Block.clone()` to copy block instances and avoid multiple positions sharing the same block object
:::
