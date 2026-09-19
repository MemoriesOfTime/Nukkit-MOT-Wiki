---
sidebar_position: 7
---

# Руководство по блокам

Класс `Block` — это ключевой класс в Nukkit для представления блоков игрового мира и работы с ними. Это руководство содержит подробные инструкции по работе с блоками через API Nukkit.

## Обзор класса Block {#block-class-overview}

Класс `Block` находится в пакете [cn.nukkit.block](https://github.com/MemoriesOfTime/Nukkit-MOT/blob/master/src/main/java/cn/nukkit/block/Block.java) и является базовым классом для всех типов блоков.

## Получение экземпляров блоков {#obtaining-blocks}

### Получение блоков по координатам мира
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

### Создание новых экземпляров блоков
```java
// Create using block ID
Block stone = Block.get(Block.STONE);

// Create with data value (variant)
Block graniteStone = Block.get(Block.STONE, 1); // Granite
```

## Основные операции {#main-operations}

### Установка блоков {#place-blocks}
```java
// Set block
Level level = player.getLevel();
level.setBlock(new Vector3(100, 64, 100), Block.get(Block.DIAMOND_BLOCK));

// Place and update surrounding blocks
level.setBlock(pos, Block.get(Block.STONE), true, true);
```

:::warning

Метод Level#setBlock() используется для прямой установки блоков. Для особых блоков (таких как двери, кровати и т. д.) попробуйте использовать метод `Block#place()`.

:::

### Разрушение блоков {#break-blocks}
```java
// Directly remove block (set to air)
level.setBlock(pos, Block.get(Block.AIR));

// Use break method (drops items)
Block block = level.getBlock(pos);
level.useBreakOn(pos, Item.get(Item.DIAMOND_PICKAXE), player); // Player breaks block with diamond pickaxe
```

### Запросы о блоках {#block-query}
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

:::tip Совет
Полный список ID блоков можно найти в классе `cn.nukkit.block.BlockID`.
:::

## Система свойств блоков {#block-properties}

### Базовые свойства
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

### Проверки особых свойств
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

## О значениях данных блоков {#block-data-values}

Многие блоки используют значения данных (Damage/Meta) для представления различных вариантов или состояний:

### Частые примеры значений данных блоков
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

## Расширенные операции с блоками {#advanced-operations}

### Операции с блоками-контейнерами
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

### Массовые операции с блоками
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

:::warning Важные напоминания
1. Всегда проверяйте перед массовыми операциями с блоками, загружены ли чанки, чтобы избежать ненужной загрузки чанков
2. При массовых операциях отключите обновления в реальном времени (установите параметр `update` метода `setBlock` в `false`), а затем выполните единое обновление после завершения
3. Будьте особенно осторожны при работе с жидкими блоками, так как механика растекания может затронуть множество окружающих блоков
4. Используйте `Block.clone()` для копирования экземпляров блоков и не допускайте, чтобы несколько позиций использовали один и тот же объект блока
:::
