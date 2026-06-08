# Voxel Game Art Skills

这是一组面向 Codex 的体素 / 低多边形 / 方块 Q 版游戏美术 skills。它们把模糊想法整理成清晰美术 brief，默认加入高级材质、镜头、光影、色彩和负面控制，再生成提示词，并可选调用图片 API 直接生成或编辑图片。

对外只有两个入口：

1. `voxel-art-brief`: 把需求想清楚。
2. `voxel-game-art`: 生成 prompt 或直接出图。

## 适合什么

- 参考图转体素 / 低多边形 / 方块 Q 版游戏资产
- 角色、道具、头像、卡面、小场景块设计
- 批量角色风格统一
- 把普通角色概念改得更有视觉冲击力
- 生成英文主 prompt、短 prompt、编辑 prompt
- 用参考图做风格或形象约束后再出图

目标风格：

- voxel-like / low-poly / blocky chibi
- Q 版移动游戏资产
- 单主体、干净背景、3/4 视角
- 大头短身、块面结构、玩具感材质
- 3-5 个大而清晰的视觉锚点
- 体素方块形状 + 电影级物理光影的反差

## 两个 Skill 怎么用

### 1. `voxel-art-brief`

用于“先想清楚”。它不会生成图片，只负责把需求整理成可执行的美术方向，并默认加入创意强化。

它会输出：

- `art_brief`: 资产类型、用途、风格方向、参考锚点、创意矩阵、构图、色彩、限制条件。
- `creative_style`: 默认的创意强化层，包括叙事、材质、镜头、灯光、色彩、动作、特效、主视觉锚点和克制原则。

示例：

```text
Use $voxel-art-brief 帮我把一个火山邮差 Q 版体素角色的需求问清楚，并做得更有视觉冲击力。
```

适合：

- 你只有一个模糊点子。
- 你想先统一风格和限制条件。
- 你觉得当前角色太普通，需要更强的画面钩子。
- 你准备批量做同一世界观的资产。

### 2. `voxel-game-art`

用于“直接执行”。它会根据文本、`art_brief`、`creative_style` 或参考图生成 prompt package；如果没有传入 `creative_style`，会先自动生成创意强化层，再在用户要求时调用脚本出图。

它不会只把中文翻译成简单英文，而是后台自动扩写：

- 材质：磨砂玻璃方块、陶瓷体素、阳极氧化金属、发光玻璃、生物发光体素。
- 镜头：移轴微缩、微距、85mm 浅景深、荷兰角、虫视角、动态 3/4 视角。
- 光影：体积雾、轮廓光、上帝光、明暗对比、全局光照、类光追反射。
- 色彩：电影级调色、青橙对比、高对比强调色、和谐高饱和体素调色盘。
- 负面控制：排除光滑曲面、真实皮肤、非方块元素、低对比、杂乱随机色、平光。

它会输出：

- `main_prompt`: 完整英文出图提示词。
- `compact_prompt`: 更短的提示词版本。
- `edit_prompt`: 有参考图时使用的编辑提示词。
- `locked_style_fields`: 批量资产中应保持一致的字段。
- `variable_fields`: 批量资产中可以变化的字段。

示例：

```text
Use $voxel-game-art 根据这个参考图设计一个低多边形方块 Q 版游戏角色，并直接出图。
```

适合：

- 你已经知道要画什么。
- 你有参考图。
- 你想要 prompt package。
- 你想直接生成或编辑图片。

## 推荐工作流

需求还不清楚时：

```text
Use $voxel-art-brief 先帮我问清楚需求，然后交给 $voxel-game-art 生成 prompt。
```

已经知道要画什么时：

```text
Use $voxel-game-art 直接生成一个低多边形方块 Q 版游戏角色。
```

有参考图时：

```text
Use $voxel-game-art 按这张参考图的风格和比例，生成一个同风格的新角色。
```

## 目录结构

```text
skills/
├── voxel-art-brief/
│   ├── SKILL.md
│   └── agents/openai.yaml
└── voxel-game-art/
    ├── SKILL.md
    ├── agents/openai.yaml
    ├── .env.example
    └── scripts/xbai-image.mjs
```

## 安装

把两个 skill 目录复制到你的 Codex skills 目录。

常见位置：

```bash
~/.codex/skills/
```

示例：

```bash
cp -R voxel-art-brief ~/.codex/skills/
cp -R voxel-game-art ~/.codex/skills/
```

## 图片生成配置

`voxel-game-art` 内置图片脚本：

```bash
node voxel-game-art/scripts/xbai-image.mjs \
  --prompt "Create a voxel-like low-poly blocky chibi mobile game character..." \
  --output output.png
```

使用参考图编辑：

```bash
node voxel-game-art/scripts/xbai-image.mjs \
  --ref reference.jpg \
  --prompt "Use the input image as the strict style reference..." \
  --output output.png
```

需要配置 API key。可以复制示例文件：

```bash
cp voxel-game-art/.env.example voxel-game-art/.env
```

然后填写：

```env
XBAI_API_KEY=sk-your-key
XBAI_BASE_URL=https://api.xbai.top/v1
```

也可以使用：

```env
OPENAI_API_KEY=sk-your-key
```

不要提交真实 API key。

常用参数：

```bash
--ar 1:1
--ar 16:9
--ar 9:16
--size 1536x1024
--quality high
--retries 3
--json
```

## 不适合什么

- 通用摄影、写实图像或电商产品图
- 像素画，除非用户明确要求
- 复杂 UI 界面生成
- 多角色复杂场景
- 需要精确 3D 建模拓扑或可直接进引擎的模型文件

## 设计取舍

原本的 `grill-voxel-art` 和 `voxel-creative-stylist` 已合并为 `voxel-art-brief`。

原因是普通用户并不需要决定是否开启“创意强化”：做图片创作时它应该默认存在，只是强度会根据需求变化。用户真正关心的是：

- 我还没想清楚，帮我问清楚。
- 我已经想好了，帮我直接画。

所以公开使用时保留两个入口最清晰。
