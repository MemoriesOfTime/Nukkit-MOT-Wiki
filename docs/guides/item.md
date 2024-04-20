---
sidebar_position: 4
---

# Item Guide


The `Item` class is a very important part of Nukkit's API and is used to handle all item related operations on the server. A detailed documentation for describing the main functions and usage of the `Item` class is provided below.

### 1. `Item` class overview

The `Item` class, located in the `cn.nukkit.item` package, provides a large number of methods for creating and managing in-game items. These items can be cubes, tools, food, and so on.

### 2. Constructors

The `Item` class provides several constructors that allow the creation of item instances from different parameters.

#### Example code:
``java
// Import the Item class
import cn.nukkit.item.

public class Example {
    public void example() {
        // Create the item by item ID and quantity
        Item diamond = Item.get(Item.DIAMOND, 0, 1); // create 1 diamond
        // Give the player a diamond
        player.giveItem(diamond)
        // Or
        player.getInventory().addItem(diamond)
    }
}
```

#### Code explanation:
:::warning
    Always use `Item.get` or directly `ItemApple()` instead of `Item(id, meta, count)` to get items!
:::
- `Item.DIAMOND`: This is the item ID of the diamond, each item has a unique ID.
- `0`: This is the item's variant number, for most items this will be 0.
- `1`: This represents the number of the item.

### 3. Main methods

The following are descriptions and examples of some common methods in the `Item` class.

#### `getId()`.
Returns the ID of the item.
``java
int id = diamond.getId(); // Get the ID of the diamond
```

#### `getCount()`
Returns the count of the item.
```java
int count = diamond.getCount(); // Get the number of diamonds
```

#### `getName()`
Returns the name of the item.
```java
String name = diamond.getName(); // Get the name of the diamond
```

#### `getEnchantmentLevel(int id)`
Get the enchantment level of an item.
You can find the relevant enchantment ID at ``cn/nukkit/item/enchantment/Enchantment.java``.
`` java
int level = diamond.getEnchantmentLevel(Enchantment.ID_DAMAGE_ALL); // Get the diamond's sharpness level. If it's not enchanted, return 0.
```

### 4. Handling item properties

Attributes of items can be managed through various setter and getter methods.

#### Setting the number of items
``` java
diamond.setCount(3); // Set the number of diamonds to 3
```

#### Example code - Setting item basic information:

``Java
public class Example {
    public void example() {
        Item diamond = Item.get(Item.DIAMOND, 0, 1);
        diamond.setLore("first row", "second row"); // you can keep adding rows
        diamond.setCustomName("custom name for item"); // if you don't want the text to be skewed you can reset the formatting by adding "§r" to the top of the text
        diamond.addEnchantment(new Enchantment.get(Enchantment.ID_DAMAGE_ALL).setLevel(5), new Enchantment.get(Enchantment.ID_PROTECTION_ALL) .setLevel(4)) // Add Sharpness 5 and Protection 4 enchantments to the item
    }
}
``
