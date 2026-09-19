---
sidebar_position: 3
---

# Настройка сервера

После первого запуска сервера файлы конфигурации будут созданы автоматически. Вы можете изменить эти настройки в соответствии со своими потребностями.

## Основной файл конфигурации

Основной файл конфигурации — **server.properties**, его можно отредактировать любым текстовым редактором.

### Основные параметры конфигурации

Вот некоторые часто используемые параметры конфигурации:

```properties
# Server port
server-port=19132

# Bind IP address (0.0.0.0 means listen on all network interfaces)
server-ip=0.0.0.0

# Default game mode
# 0=Survival, 1=Creative, 2=Adventure, 3=Spectator
gamemode=0

# Game difficulty
# 0=Peaceful, 1=Easy, 2=Normal, 3=Hard
difficulty=1

# Maximum number of players
max-players=20

# Enable whitelist
white-list=false

# Server description (displayed in server list)
motd=A Nukkit Server
```

### Изменение конфигурации

1. Откройте `server.properties` в текстовом редакторе
2. При необходимости измените значения параметров конфигурации
3. Сохраните файл
4. Перезапустите сервер, чтобы изменения вступили в силу

:::warning Обратите внимание
Чтобы изменения конфигурации вступили в силу, необходимо перезапустить сервер!
:::

## Подробная документация по конфигурации

Полную документацию по `server.properties` смотрите здесь:

- [Руководство по настройке server.properties](../server-config/server-properties.mdx)

## Другие файлы конфигурации

Помимо `server.properties`, существуют и другие файлы конфигурации:

- `server.properties`: конфигурация сервера
- `ops.txt`: список администраторов
- `white-list.txt`: белый список
- `banned-players.txt`: список заблокированных игроков
- `banned-ips.txt`: список заблокированных IP-адресов

## Рекомендации по настройке

### Оптимизация производительности

Для серверов с большим количеством игроков рекомендуется изменить следующие параметры:

```properties
# Reducing view distance can improve performance
view-distance=8

# Limit maximum number of players
max-players=50
```

### Настройки безопасности

Для обеспечения безопасности сервера рекомендуется:

```properties
# Enable whitelist (only allow specified players to join)
white-list=true

# Enable online verification (requires genuine account)
xbox-auth=true
```

## Дальнейшие шаги

После завершения настройки вы можете:
- Перейти к [Установке плагинов](plugins.md), чтобы расширить функциональность сервера
- Или сразу [Подключиться к серверу](connect.md) и начать играть
