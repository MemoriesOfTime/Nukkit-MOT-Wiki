---
sidebar_position: 7
---

# World Guide

In Nukkit-MOT, a world is represented by `Level`. It is responsible for world data, chunks, spawn position, particles, sounds, and dimension metadata. This guide focuses on the APIs you will use most often when building plugins that read, create, or manage multiple worlds.

:::tip Source-backed scope
This page is written against the current Nukkit-MOT source, especially `Server`, `Level`, `DimensionData`, `Generator`, and the ticking area manager. The examples below avoid unverified APIs.
:::

## World Basics {#world-basics}

The terms "world" and "dimension" are related but not identical:

- A **world** is a loaded `Level` instance.
- A **dimension** is part of the world's metadata, available through `level.getDimension()` and `level.getDimensionData()`.
- World lookup by `Server#getLevelByName()` matches the world's **folder name**.

Common entry points:

```java
Server server = Server.getInstance();

Level defaultLevel = server.getDefaultLevel();
Level lobby = server.getLevelByName("lobby");

for (Level level : server.getLevels().values()) {
    server.getLogger().info(level.getFolderName());
}
```

## Loading Existing Worlds {#loading-existing-worlds}

Use folder names under `worlds/` for normal plugin work. If a world is not loaded yet, load it before using it.

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

### Default World, Extra Worlds, and Safe Lookup

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
Do not assume `getLevelByName()` will auto-load a world. It only returns an already loaded `Level`.
:::

## Creating Worlds and Choosing Generators {#creating-worlds-and-choosing-generators}

`Server#generateLevel(...)` creates and loads a world in one step. The current registered generator names in Nukkit-MOT include:

| Name | Typical use |
| --- | --- |
| `normal` / `default` | Standard overworld terrain |
| `oldnormal` | Legacy normal terrain |
| `flat` | Flat lobby or test maps |
| `void` | Empty map for minigames or custom building |
| `nether` | Nether dimension world |
| `the_end` | End dimension world |

### Example 1: Create a Flat Lobby World

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

### Example 2: Create a Void World for a Minigame

```java
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
`Generator.getGeneratorList()` can be used when you want to inspect registered generator names dynamically.
:::

## Dimensions and Height Ranges {#dimensions-and-height-ranges}

Read dimension metadata from the world itself, not from hard-coded constants in your plugin logic.

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

Current source-backed defaults:

| Dimension | ID | Default Y range |
| --- | --- | --- |
| Overworld | `0` | `-64` to `319` |
| Nether | `1` | `0` to `127` |
| The End | `2` | `0` to `255` |

:::warning
Do not hard-code the overworld height as `0..255`. Nukkit-MOT exposes the actual range through `level.getMinBlockY()` and `level.getMaxBlockY()`. Also note that some providers can fall back to legacy height behavior.
:::

## Chunk Loading, Generation State, and Safe Access {#chunks-and-safe-access}

World access is often really chunk access. The important distinction is:

- `getChunk(x, z, true)` and `loadChunk(x, z)` may create or generate missing chunk data.
- `getChunkIfLoaded(x, z)` only returns a loaded chunk.
- `loadChunk(x, z, false)` tries to load an existing chunk without generating a new one.
- `isChunkGenerated(x, z)` and `isChunkPopulated(x, z)` tell you how far chunk preparation has progressed.

### Example 3: Read a Block Without Accidentally Generating New Terrain

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
        player.sendMessage("Target chunk is not loaded and will not be generated automatically.");
        return;
    }
}

if (!level.isChunkGenerated(chunkX, chunkZ)) {
    player.sendMessage("Chunk exists, but terrain generation is not finished yet.");
    return;
}

Block block = level.getBlock(new Vector3(x, y, z));
player.sendMessage("Block under your feet: " + block.getName());
```

### Teleporting Across Worlds Safely

Always ensure the target world is loaded before teleporting. Using `getSafeSpawn()` is the simplest way to avoid spawning inside blocks.

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

## Ticking Area (Always-Loaded Chunks) {#ticking-area}

Use ticking areas when a world region must stay loaded, for example:

- spawn systems
- redstone or automation hubs
- world-level timers or machines
- lobby chunks that should never unload

The manager is available through `Server#getTickingAreaManager()`. Stored ticking areas are persisted to `worlds/<level>/tickingarea.json`.

### Example 4: Register a Small Spawn Ticking Area

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

Common manager calls:

```java
TickingArea area = server.getTickingAreaManager().getTickingArea("spawn-area");
boolean exists = server.getTickingAreaManager().containTickingArea("spawn-area");
server.getTickingAreaManager().removeTickingArea("spawn-area");
```

## World-Level Particles and Sounds {#particles-and-sounds}

`Level` can broadcast particles and sounds to players near the target chunk, or to a specific player list.

```java
import cn.nukkit.level.Sound;
import cn.nukkit.level.particle.FlameParticle;
import cn.nukkit.math.Vector3;

Level level = player.getLevel();
Vector3 pos = player.add(0, 1, 0);

level.addParticle(new FlameParticle(pos));
level.addSound(pos, Sound.BLOCK_BELL_HIT, 1.0f, 1.0f);
```

You can also use particle effect identifiers when you specifically need effect-based particles:

```java
import cn.nukkit.level.ParticleEffect;

level.addParticleEffect(pos, ParticleEffect.ENDROD);
```

## Common Pitfalls {#common-pitfalls}

### 1. Modifying Worlds from Async Threads

`Level`, chunks, blocks, entities, and players should be treated as main-thread APIs. Do not set blocks, teleport players, or read/write world state directly from async tasks.

Recommended pattern:

1. Do slow I/O or computation asynchronously.
2. Switch back to the main thread before touching `Level`, `Player`, `Entity`, or chunk data.

### 2. Assuming a Loaded Chunk Is Fully Generated

`loadChunk()` only guarantees chunk loading. For newly created terrain, generation and population may still be incomplete. Check:

- `level.isChunkGenerated(x, z)`
- `level.isChunkPopulated(x, z)`

### 3. Cross-Dimension Teleport Without Preparing the Target World

Before teleporting to another world or dimension:

- make sure the target world is loaded
- prefer `getSafeSpawn()` or a validated `Position`
- ensure your target Y is inside `level.getMinBlockY()` and `level.getMaxBlockY()`

### 4. Looking Up Worlds by the Wrong Name

`Server#getLevelByName()` compares the loaded world's folder name. In normal setups, this means you should pass the world folder name, not a display label you invented elsewhere.
