---
sidebar_position: 6
---

# Руководство по мирам

В Nukkit-MOT мир представлен классом `Level`. Он отвечает за данные мира, чанки, позицию спавна, частицы, звуки и метаданные измерения. Это руководство сосредоточено на API, которые вы будете использовать чаще всего при создании плагинов, читающих, создающих или управляющих несколькими мирами.

:::tip Область, основанная на исходном коде
Эта страница написана по текущему исходному коду Nukkit-MOT, особенно `Server`, `Level`, `DimensionData`, `Generator` и менеджеру областей тикования. Примеры ниже избегают непроверенных API.
:::

## Основы миров {#world-basics}

Термины «мир» и «измерение» связаны, но не идентичны:

- **Мир** — это загруженный экземпляр `Level`.
- **Измерение** — часть метаданных мира, доступная через `level.getDimension()` и `level.getDimensionData()`.
- Поиск мира через `Server#getLevelByName()` выполняется по **имени папки** мира.

Распространённые точки входа:

```java
Server server = Server.getInstance();

Level defaultLevel = server.getDefaultLevel();
Level lobby = server.getLevelByName("lobby");

for (Level level : server.getLevels().values()) {
    server.getLogger().info(level.getFolderName());
}
```

## Загрузка существующих миров {#loading-existing-worlds}

В обычной работе плагина используйте имена папок в `worlds/`. Если мир ещё не загружен, загрузите его перед использованием.

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

### Мир по умолчанию, дополнительные миры и безопасный поиск

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
Не предполагайте, что `getLevelByName()` автоматически загрузит мир. Он возвращает только уже загруженный `Level`.
:::

## Создание миров и выбор генераторов {#creating-worlds-and-choosing-generators}

`Server#generateLevel(...)` создаёт и загружает мир за один шаг. Текущие зарегистрированные в Nukkit-MOT имена генераторов включают:

| Имя | Типичное применение |
| --- | --- |
| `normal` / `default` | Стандартный рельеф обычного мира |
| `oldnormal` | Устаревший обычный рельеф |
| `flat` | Плоское лобби или тестовые карты |
| `void` | Пустая карта для миниигр или собственного строительства |
| `nether` | Мир измерения Нижний мир (Nether) |
| `the_end` | Мир измерения Край (End) |

### Пример 1: создание плоского мира-лобби

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

### Пример 2: создание пустого мира для миниигры

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
`Generator.getGeneratorList()` можно использовать, когда нужно динамически просмотреть зарегистрированные имена генераторов.
:::

## Измерения и диапазоны высот {#dimensions-and-height-ranges}

Читайте метаданные измерения из самого мира, а не из жёстко заданных констант в логике плагина.

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

Текущие значения по умолчанию, подтверждённые исходным кодом:

| Измерение | ID | Диапазон Y по умолчанию |
| --- | --- | --- |
| Обычный мир | `0` | от `-64` до `319` |
| Нижний мир | `1` | от `0` до `127` |
| Край | `2` | от `0` до `255` |

:::warning
Не задавайте жёстко высоту обычного мира как `0..255`. Nukkit-MOT предоставляет фактический диапазон через `level.getMinBlockY()` и `level.getMaxBlockY()`. Также учтите, что некоторые провайдеры могут откатываться к устаревшему поведению высот.
:::

## Загрузка чанков, состояние генерации и безопасный доступ {#chunks-and-safe-access}

Доступ к миру на самом деле часто означает доступ к чанкам. Важное различие:

- `getChunk(x, z, true)` и `loadChunk(x, z)` могут создать или сгенерировать отсутствующие данные чанка.
- `getChunkIfLoaded(x, z)` возвращает только уже загруженный чанк.
- `loadChunk(x, z, false)` пытается загрузить существующий чанк без генерации нового.
- `isChunkGenerated(x, z)` и `isChunkPopulated(x, z)` показывают, насколько продвинулась подготовка чанка.

### Пример 3: чтение блока без случайной генерации нового рельефа

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

### Безопасная телепортация между мирами

Всегда убеждайтесь, что целевой мир загружен перед телепортацией. Использование `getSafeSpawn()` — простейший способ избежать появления внутри блоков.

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

## Область тикования (всегда загруженные чанки) {#ticking-area}

Используйте области тикования, когда регион мира должен оставаться загруженным, например:

- системы спавна
- центры редстоуна или автоматизации
- таймеры или механизмы уровня мира
- чанки лобби, которые никогда не должны выгружаться

Менеджер доступен через `Server#getTickingAreaManager()`. Сохранённые области тикования записываются в `worlds/<level>/tickingarea.json`.

### Пример 4: регистрация небольшой области тикования для спавна

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

Распространённые вызовы менеджера:

```java
TickingArea area = server.getTickingAreaManager().getTickingArea("spawn-area");
boolean exists = server.getTickingAreaManager().containTickingArea("spawn-area");
server.getTickingAreaManager().removeTickingArea("spawn-area");
```

## Частицы и звуки уровня мира {#particles-and-sounds}

`Level` может отправлять частицы и звуки игрокам рядом с целевым чанком или конкретному списку игроков.

```java
import cn.nukkit.level.Sound;
import cn.nukkit.level.particle.FlameParticle;
import cn.nukkit.math.Vector3;

Level level = player.getLevel();
Vector3 pos = player.add(0, 1, 0);

level.addParticle(new FlameParticle(pos));
level.addSound(pos, Sound.BLOCK_BELL_HIT, 1.0f, 1.0f);
```

Также можно использовать идентификаторы эффектов частиц, когда нужны именно частицы на основе эффектов:

```java
import cn.nukkit.level.ParticleEffect;

level.addParticleEffect(pos, ParticleEffect.ENDROD);
```

## Частые ошибки {#common-pitfalls}

### 1. Изменение миров из асинхронных потоков

`Level`, чанки, блоки, сущности и игроков следует рассматривать как API основного потока. Не устанавливайте блоки, не телепортируйте игроков и не читайте/записывайте состояние мира напрямую из асинхронных задач.

Рекомендуемый шаблон:

1. Выполняйте медленный ввод-вывод или вычисления асинхронно.
2. Возвращайтесь в основной поток перед обращением к `Level`, `Player`, `Entity` или данным чанков.

### 2. Предположение, что загруженный чанк полностью сгенерирован

`loadChunk()` гарантирует только загрузку чанка. Для только что созданного рельефа генерация и популяция могут быть ещё не завершены. Проверяйте:

- `level.isChunkGenerated(x, z)`
- `level.isChunkPopulated(x, z)`

### 3. Телепортация между измерениями без подготовки целевого мира

Перед телепортацией в другой мир или измерение:

- убедитесь, что целевой мир загружен
- предпочитайте `getSafeSpawn()` или проверенный `Position`
- убедитесь, что целевая координата Y находится в пределах `level.getMinBlockY()` и `level.getMaxBlockY()`

### 4. Поиск миров по неправильному имени

`Server#getLevelByName()` сравнивает имя папки загруженного мира. В обычных конфигурациях это означает, что следует передавать имя папки мира, а не отображаемую метку, придуманную где-то ещё.
