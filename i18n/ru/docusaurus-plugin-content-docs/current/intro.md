---
sidebar_position: 1
description: Nukkit-MOT — многоверсионный сервер Minecraft Bedrock Edition с поддержкой клиентов NetEase, ИИ-сущностями, ванильными командами и развитой экосистемой плагинов.
keywords:
  - Nukkit-MOT
  - Сервер Nukkit
  - Сервер Minecraft Bedrock
  - Серверное ПО Minecraft Bedrock Edition
  - Многоверсионный сервер Bedrock
  - API плагинов Nukkit
---

# Nukkit-MOT {#nukkit-mot}

![Nukkit-MOT](/images/banner.png)

## Введение {#introduction}
Nukkit-MOT — это форк [Nukkit](https://github.com/CloudburstMC/Nukkit), обеспечивающий поддержку множества версий игры, совместимость с клиентами NetEase и хорошо развитую экосистему плагинов.

Интересуют только новые версии? Возможно, вам подойдут [Lumi](https://github.com/KoshakMineDEV/Lumi) или [PowerNukkitX](https://github.com/PowerNukkitX/PowerNukkitX).

### Что нового в Nukkit-MOT? {#whats-new}
1. Поддержка версий с 1.2 по 1.26.50 (минимальный протокол можно задать в конфигурации)
2. Поддержка большинства сущностей с ИИ
3. Поддержка Нижнего мира (Nether) и Энда (The End)
4. Генерация подземелий и пещер
5. Поддержка ванильных команд
6. Поддержка клиентов NetEase

## Как установить? {#how-to-install}
1. Установите Java 17 или новее
2. Скачайте .jar-файл по ссылкам ниже
3. Введите команду для запуска: `java -jar Nukkit-MOT-SNAPSHOT.jar` (замените `Nukkit-MOT-SNAPSHOT.jar` на имя скачанного вами файла)

### Запуск через Docker {#run-with-docker}
```bash
docker run -d --name nukkit-mot \
  -p 19132:19132/udp \
  -p 19132:19132/tcp \
  -v $(pwd)/data:/data \
  -e JAVA_OPTS="-Xms2G -Xmx2G" \
  --restart unless-stopped \
  memoriesoftime/nukkit-mot:latest
```
- Теги `:latest` и `:<короткий-SHA>` — снимки разработки (snapshot), собранные из ветки master.
- Теги вида `:1.26.30-R1` — стабильные релизы, соответствующие Maven Central.
- Все миры, плагины, данные игроков и `server.properties` хранятся в томе `/data`.

## Ссылки {#links}
- __🌐 Скачать: [Jenkins](https://motci.cn/job/Nukkit-MOT/) / [GitHub Actions](https://github.com/MemoriesOfTime/Nukkit-MOT/actions/workflows/maven.yml?query=branch%3Amaster)__
- __💬 Обсуждение: [Discord](https://discord.gg/pJjQDQC) / [QQ-группа](https://jq.qq.com/?_wv=1027&k=5aIuYMH)__
- __🔌 Плагины: [Форум Nukkit](https://cloudburstmc.org/resources/categories/nukkit-plugins.1/) / [Форум Nukkit-MOT](https://bbs.nukkit-mot.com/resources/)__
- __🐞 [Сообщить об ошибке](https://github.com/MemoriesOfTime/Nukkit-MOT/issues/new/choose)__

## Разделы документации {#documentation-paths}

Документация разделена на два основных направления:

- **Пользовательская документация**: для владельцев и администраторов серверов. Начните с раздела [Начало с нуля](user-guide/starting_from_scratch.md), затем продолжите с разделами [Начало работы](user-guide/getting-started/preparation.md) и [Конфигурация сервера](user-guide/server-config/server-properties.mdx).
- **Документация для разработчиков**: для разработчиков плагинов и инструментов. Начните с раздела [Первый плагин на Java](developer-guide/tutorial-basics/frist_java_plugin.mdx), затем продолжите с разделами [Руководства](developer-guide/guides/world.md) и [API кастомного контента](/docs/developer-guide/tutorial-extras/custom).

## Maven {#maven}
#### Репозиторий: {#maven-repository}
```xml
<repositories>
    <!-- Release builds come from Maven Central; SNAPSHOT builds require the repo.lanink.cn repo -->
    <repository>
        <id>repo-lanink-cn</id>
        <url>https://repo.lanink.cn/repository/maven-public/</url>
    </repository>
</repositories>
```

#### Зависимости: {#maven-dependencies}
```xml
<!-- Release -->
<dependencies>
    <dependency>
        <groupId>com.nukkit-mot</groupId>
        <artifactId>nukkit-mot</artifactId>
        <version>1.26.40-R1</version>
        <scope>provided</scope>
    </dependency>
</dependencies>

<!-- SNAPSHOT -->
<dependencies>
    <dependency>
        <groupId>cn.nukkit</groupId>
        <artifactId>Nukkit</artifactId>
        <version>MOT-SNAPSHOT</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

## Gradle {#gradle}
#### Репозиторий: {#gradle-repository}
```kts
repositories {
    mavenCentral()
    // SNAPSHOT builds require the repo.lanink.cn repo
    maven("https://repo.lanink.cn/repository/maven-public/")
} 
```

#### Зависимости: {#gradle-dependencies}
```kts
// Release
dependencies {
    compileOnly("com.nukkit-mot:nukkit-mot:1.26.40-R1")
}

// SNAPSHOT
dependencies {
    compileOnly("cn.nukkit:Nukkit:MOT-SNAPSHOT")
}
```
