# Nukkit-MOT Wiki 文档缺口可执行待办表

最后更新：2026-03-12
来源：基于 `Nukkit-MOT-Wiki` 当前文档仓库与 `Nukkit-MOT` 源码的静态覆盖审计
状态：待执行

## 使用说明

这份待办表用于指导后续文档补全工作，目标不是记录想法，而是直接用于排期、编写和验收。

执行约束：

- 所有新增或重写页面默认同时更新英文 `docs/` 与中文 `i18n/zh/docusaurus-plugin-content-docs/current/`
- 优先补齐已有占位页，再新增缺失专题页
- 所有示例以 Nukkit-MOT 当前源码能力为准，不引用已不存在或未验证的 API
- 每完成一个任务，至少执行一次 `npm run build` 和一次 `npm run typecheck`

## 总览

| ID | 优先级 | 状态 | 任务 | 目标产出 |
| --- | --- | --- | --- | --- |
| DOC-01 | P0 | done | 重写 World 指南 | 完整的世界/维度/生成器/粒子/常加载区块文档 |
| DOC-02 | P0 | todo | 重做插件入门链路 | 能从 0 到 1 创建、构建、运行、发布插件 |
| DOC-03 | P0 | todo | 新增命令系统指南 | 覆盖 `plugin.yml` 命令、命令类、参数、选择器 |
| DOC-04 | P0 | todo | 新增调度器与异步任务指南 | 覆盖 `NukkitRunnable`、同步/异步、线程边界 |
| DOC-05 | P1 | todo | 新增 Scoreboard 指南 | 覆盖 objective、line、display slot、viewer |
| DOC-06 | P1 | todo | 新增 NBT 指南 | 覆盖 `CompoundTag`、`ListTag`、`NBTIO` 读写 |
| DOC-07 | P1 | todo | 完成自定义附魔教程 | 从空页补成可实操教程 |
| DOC-08 | P1 | todo | 完善 runtime block state 教程 | 从占位文档补成可执行流程 |
| DOC-09 | P2 | todo | 新增资源包管理指南 | 覆盖资源包/行为包加载、协议匹配、插件内资源包 |
| DOC-10 | P2 | todo | 新增多版本与网易兼容专题 | 覆盖 multiversion、NetEase、协议边界 |

## 任务明细

### DOC-01 重写 World 指南

- 优先级：P0
- 现状：
  - `docs/guides/world.md` 仅有标题
  - `i18n/zh/docusaurus-plugin-content-docs/current/guides/world.md` 仅有标题
- 建议产出：
  - 重写现有 `world.md`
  - 同步补全英文和中文版本
- 目标读者：
  - 插件开发者
  - 需要管理多世界的服主
- 必写章节：
  - 世界对象与基础获取方式
  - 默认世界、额外世界、按名称/文件夹加载世界
  - 维度与高度范围
  - 生成器类型与生成器配置
  - 区块加载、区块生成状态、世界安全访问注意事项
  - Ticking Area 常加载区块
  - 粒子与声音的世界级发送
  - 常见坑：异步线程改世界、未生成区块访问、跨维度传送
- 验收标准：
  - 读者可以根据页面完成世界读取、世界创建、基础传送和常加载区块配置
  - 页面至少包含 3 个可运行示例
  - 页面明确说明哪些操作不能在异步线程执行
- 主要源码依据：
  - `Nukkit-MOT/src/main/java/cn/nukkit/level/Level.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/level/DimensionData.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/level/generator/Generator.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/level/biome/Biome.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/level/tickingarea/manager/TickingAreaManager.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/level/particle/Particle.java`
- 备注：
  - 这是当前最大缺口之一，建议最先落地
  - 2026-03-12：英文 `docs/guides/world.md` 与中文对应页已完成重写
  - 2026-03-12：`npm run build` 通过（含 `en` 与 `zh`）
  - 2026-03-12：`npm run typecheck` 被仓库现有首页类型问题阻塞：`src/components/HomepageFeatures/index.tsx`、`src/pages/index.tsx` 中 `Cannot find namespace 'JSX'`

### DOC-02 重做插件入门链路

- 优先级：P0
- 现状：
  - `docs/tutorial-basics/frist_java_plugin.mdx` 只覆盖拉取示例项目与构建
  - `docs/tutorial-basics/publish_first_plugin.mdx` 只覆盖分享到 GitHub
  - 当前缺少真正的“创建第一个插件、运行第一个插件、理解 plugin.yml”的完整链路
- 建议产出：
  - 重写 `frist_java_plugin.mdx`
  - 重写 `publish_first_plugin.mdx`
  - 必要时新增 `plugin-yml.mdx` 或 `plugin-basics.mdx`
- 目标读者：
  - 零基础插件开发者
- 必写章节：
  - 工程创建方式
  - Maven/Gradle 依赖配置
  - `plugin.yml` 基础字段
  - 主类与 `onEnable`
  - 打包并放入 `plugins/`
  - 本地运行与验证插件是否成功加载
  - 发布前检查项
- 验收标准：
  - 从零开始的读者可根据文档做出一个能加载的 HelloWorld 插件
  - 至少提供 `plugin.yml` 完整示例
  - 至少提供 1 个“如何确认插件加载成功”的验证步骤
- 主要源码依据：
  - `Nukkit-MOT/src/main/java/cn/nukkit/plugin/PluginDescription.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/plugin/PluginBase.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/plugin/PluginManager.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/plugin/JavaPluginLoader.java`
- 备注：
  - 此任务建议与 DOC-03 一起规划，但先独立交付也可

### DOC-03 新增命令系统指南

- 优先级：P0
- 现状：
  - 文档没有系统性的命令开发专题
  - 仅在权限和事件文档中零散出现命令相关片段
- 建议产出：
  - 新增 `docs/guides/command.mdx`
  - 新增 `i18n/zh/docusaurus-plugin-content-docs/current/guides/command.mdx`
- 目标读者：
  - 插件开发者
- 必写章节：
  - `plugin.yml` 中的 `commands` 字段
  - `CommandExecutor` 与 `PluginCommand`
  - `SimpleCommand` 的适用场景
  - 参数校验、usage、权限校验
  - 控制台与玩家命令发送者差异
  - 目标选择器 `@a @p @e @r @s @initiator`
  - 命令别名、错误处理、国际化提示
- 验收标准：
  - 页面至少包含 2 种命令实现方式
  - 页面至少包含 1 个选择器示例
  - 页面明确说明命令执行中的权限与 sender 判断
- 主要源码依据：
  - `Nukkit-MOT/src/main/java/cn/nukkit/command/Command.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/command/PluginCommand.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/command/simple/SimpleCommand.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/command/selector/EntitySelectorAPI.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/command/data/`

### DOC-04 新增调度器与异步任务指南

- 优先级：P0
- 现状：
  - 文档没有 scheduler 专题
  - 当前只在少数页面中顺手调用 `getScheduler()`
- 建议产出：
  - 新增 `docs/guides/scheduler.mdx`
  - 新增 `i18n/zh/docusaurus-plugin-content-docs/current/guides/scheduler.mdx`
- 目标读者：
  - 插件开发者
- 必写章节：
  - `NukkitRunnable` 基础用法
  - 同步任务、延迟任务、重复任务
  - 异步任务与 `AsyncTask`
  - 主线程与异步线程边界
  - 哪些 API 不能异步调用
  - 常见模式：延迟执行、异步读取后切回主线程
- 验收标准：
  - 至少提供 3 个示例：延迟、循环、异步
  - 明确给出“不要在异步线程直接改世界/实体/玩家状态”的警告
  - 页面中提供 1 个推荐任务封装模板
- 主要源码依据：
  - `Nukkit-MOT/src/main/java/cn/nukkit/scheduler/NukkitRunnable.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/scheduler/ServerScheduler.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/scheduler/AsyncTask.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/scheduler/Task.java`

### DOC-05 新增 Scoreboard 指南

- 优先级：P1
- 现状：
  - 文档站没有 scoreboard 专题
  - 源码已具备完整计分板能力
- 建议产出：
  - 新增 `docs/guides/scoreboard.mdx`
  - 新增 `i18n/zh/docusaurus-plugin-content-docs/current/guides/scoreboard.mdx`
- 目标读者：
  - 插件开发者
- 必写章节：
  - objective、line、scorer 的概念
  - display slot 的区别
  - 玩家加入/退出时的 viewer 行为
  - 假玩家行与实体行
  - 常见的 sidebar 用法
- 验收标准：
  - 至少提供 1 个 sidebar 示例和 1 个更新分数示例
  - 说明 objectiveName 与显示名称的区别
- 主要源码依据：
  - `Nukkit-MOT/src/main/java/cn/nukkit/scoreboard/manager/ScoreboardManager.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/scoreboard/scoreboard/IScoreboard.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/scoreboard/scorer/`

### DOC-06 新增 NBT 指南

- 优先级：P1
- 现状：
  - 目前只有物品和背包页面零散介绍 `CompoundTag`
  - 缺少系统性的 NBT 读写、序列化、网络格式说明
- 建议产出：
  - 新增 `docs/guides/nbt.mdx`
  - 新增 `i18n/zh/docusaurus-plugin-content-docs/current/guides/nbt.mdx`
- 目标读者：
  - 插件开发者
- 必写章节：
  - 常见 Tag 类型
  - `CompoundTag` 与 `ListTag` 操作
  - 物品与 NBT 相互转换
  - 文件读写、压缩读写、字节数组读写
  - 大端/小端与 network 模式差异
  - 常见错误：根标签类型错误、漏 `setNamedTag`
- 验收标准：
  - 至少提供 1 个物品 NBT 示例
  - 至少提供 1 个文件读写示例
  - 至少提供 1 个压缩/网络格式示例
- 主要源码依据：
  - `Nukkit-MOT/src/main/java/cn/nukkit/nbt/NBTIO.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/nbt/tag/`
  - `Nukkit-MOT/src/main/java/cn/nukkit/nbt/stream/`

### DOC-07 完成自定义附魔教程

- 优先级：P1
- 现状：
  - `docs/tutorial-extras/custom/custom_enchantment.mdx` 当前为空页
  - 中文对应页也为空页
- 建议产出：
  - 直接补完现有占位页
- 目标读者：
  - 有一定基础的插件开发者
- 必写章节：
  - 自定义附魔的适用场景
  - 附魔类结构
  - 注册流程
  - 与自定义物品/原版物品的交互方式
  - 附魔等级、兼容性、触发时机
- 验收标准：
  - 至少提供 1 个完整自定义附魔示例
  - 示例能说明注册点和行为触发点
- 主要源码依据：
  - `Nukkit-MOT/src/main/java/cn/nukkit/item/enchantment/Enchantment.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/item/enchantment/EnchantmentType.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/item/enchantment/`

### DOC-08 完善 runtime block state 教程

- 优先级：P1
- 现状：
  - 英文页几乎为占位文本
  - 中文页仍以“未完待续”结束
- 建议产出：
  - 补齐现有 `runtime_block_state.mdx`
  - 保证中英文内容对齐
- 目标读者：
  - 参与核心源码开发的贡献者
- 必写章节：
  - runtime block state 的作用
  - 与自定义方块的区别
  - 涉及的源码目录与资源目录
  - 更新流程
  - 生成/转换工具链
  - 验证方式
- 验收标准：
  - 读者能按文档完成一次原版方块状态资源更新
  - 文档明确列出需要修改的目录和验证步骤
- 主要源码依据：
  - `Nukkit-MOT/src/main/java/cn/nukkit/block/`
  - `Nukkit-MOT/src/main/resources/`
  - 现有教程：`docs/tutorial-extras/custom/custom_block.mdx`

### DOC-09 新增资源包管理指南

- 优先级：P2
- 现状：
  - 当前只有资源包加密页面
  - 缺少资源包/行为包加载与协议筛选说明
- 建议产出：
  - 新增 `docs/guides/resourcepacks.mdx`
  - 新增 `i18n/zh/docusaurus-plugin-content-docs/current/guides/resourcepacks.mdx`
- 目标读者：
  - 服主
  - 插件开发者
- 必写章节：
  - 普通资源包与行为包的区别
  - 服务器资源包目录约定
  - 加载流程与重载行为
  - 协议版本匹配
  - 插件内资源包
  - 与加密资源包文档的关系
- 验收标准：
  - 页面能解释资源包为何会因协议不匹配而不生效
  - 页面能区分普通资源包和行为包的适用场景
- 主要源码依据：
  - `Nukkit-MOT/src/main/java/cn/nukkit/resourcepacks/ResourcePackManager.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/resourcepacks/JarPluginResourcePack.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/resourcepacks/loader/`

### DOC-10 新增多版本与网易兼容专题

- 优先级：P2
- 现状：
  - 首页与配置页提到多版本、网易支持
  - 但没有独立专题说明兼容边界和使用建议
- 建议产出：
  - 新增 `docs/guides/multiversion-and-netease.mdx`
  - 新增 `i18n/zh/docusaurus-plugin-content-docs/current/guides/multiversion-and-netease.mdx`
- 目标读者：
  - 服主
  - 有跨版本需求的插件开发者
- 必写章节：
  - 多版本支持的基本概念
  - 最低/最高协议配置
  - 网易模式与 only-netease 的差异
  - 资源包、粒子、物品、方块等在不同协议下的差异意识
  - 调试与排错建议
- 验收标准：
  - 页面能让服主理解什么时候要改 `multiversion-min-protocol`
  - 页面能让读者理解为什么不同客户端看到的内容可能不同
- 主要源码依据：
  - `Nukkit-MOT/src/main/java/cn/nukkit/GameVersion.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/network/protocol/ProtocolInfo.java`
  - `Nukkit-MOT/src/main/java/cn/nukkit/resourcepacks/ResourcePackManager.java`
  - `docs/server-config/nukkit-mot-yml.mdx`

## 推荐执行顺序

1. DOC-01 World 指南
2. DOC-02 插件入门链路
3. DOC-03 命令系统指南
4. DOC-04 调度器与异步任务指南
5. DOC-05 Scoreboard 指南
6. DOC-06 NBT 指南
7. DOC-07 自定义附魔教程
8. DOC-08 runtime block state 教程
9. DOC-09 资源包管理指南
10. DOC-10 多版本与网易兼容专题

## 每个任务的通用完成定义

以下条件全部满足，任务才可从 `todo` 改为 `done`：

- 英文文档已更新
- 中文文档已更新
- 侧边栏可访问
- 至少 1 处代码示例已按当前源码接口复核
- `npm run build` 通过
- `npm run typecheck` 通过

## 备注

- 如果时间有限，优先处理 P0；P0 完成后，文档站的“入门可用性”和“核心 API 可发现性”会明显提升。
- 如果后续需要将这份待办同步到 issue tracker，可直接按 ID 拆分为 10 个任务。
