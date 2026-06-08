---
name: voxel-game-art
description: Use when designing, prompting, or generating voxel, low-poly, blocky chibi, Q-version mobile game art from text or uploaded/reference images; includes default creative styling, prompt packages, and optional image API generation/editing.
---

# Voxel Game Art

Use this skill for game art like voxel / low-poly / blocky chibi characters, props, icons, cards, and small scene assets. It is especially useful when the user provides a reference image and wants a similar game-ready style.

If the user mainly wants to clarify the idea before prompting or image generation, use `$voxel-art-brief` first.

## Workflow

1. Inspect any provided reference image first. Extract only durable art-direction anchors: silhouette, proportion, geometry language, material feel, camera, background, color logic, iconic props.
2. If the brief is incomplete but the user clearly wants direct output, infer conservative defaults or ask one short clarification round with at most 3 questions. For deeper planning, hand off to `$voxel-art-brief`.
3. Produce a compact `art_brief`.
4. Ensure there is a `creative_style`. If the user supplies one from `$voxel-art-brief`, preserve it; otherwise generate one internally before writing prompts.
5. Style Lock, optional but recommended for batches: if a canonical sample image exists, use `--ref {style_lock_image}` to lock the overall style and describe only the subject delta in the prompt. Prefer visual anchoring over repeating style words.
6. Produce a `prompt_package` with `main_prompt`, `compact_prompt`, and `edit_prompt`.
7. If the user asks to generate or edit an image, use `scripts/xbai-image.mjs`. Read the script only when execution or patching is needed.

This skill is intentionally OpenAI-compatible only. Do not add multi-provider routing here; use a separate general image-generation skill for that.

## Clarification Rules

Ask only for missing high-impact fields when direct output would otherwise be wrong. Prefer multiple-choice defaults.

Default first-round questions:

1. Asset type: character, prop, avatar/icon, card art, scene block?
2. Usage: concept exploration, game-ready baseline, marketing image, or batch style guide?
3. Keep closest to the reference, or change theme/profession/item?

If the reference image already answers a question, do not ask it. If the user says "you decide", use the defaults below.

## Style Grammar, Not Case Templates

Images in `../examples_test` are calibration samples, not subject templates. Use them to lock the visual grammar; do not keep recycling their exact topics, props, or layout formulas.

Lock these:

- Style: low-poly Q-version mobile game character, voxel-like block construction, toy-like 3D concept art.
- Proportions: oversized head, compact body, short limbs, readable chunky silhouette.
- Geometry: cubes, trapezoids, rectangular prisms, triangular prisms, faceted planes.
- Rendering: solid color block shading, clean bevels, soft studio light, no photoreal PBR.
- Presentation: single subject, centered, 3/4 view, clean white or light neutral background, no text.
- Detail logic: a few large iconic features beat many small noisy details.
- Character design logic: role/faction/theme must be readable from 3-5 large anchors.

Do not lock these:

- Huge headgear as the default solution.
- Weapon + shield as the default kit.
- Backpack + floating objects as a required formula.
- Existing sample subjects such as candy knight, rune mage, crow knight, lighthouse fisherman, lava courier, or star miner.

## Creative Remix Matrix

When creating or refining an idea, generate from dimensions rather than copying an existing case. Pick 1-2 values from each relevant row:

| Dimension          | Options                                                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Source theme       | profession, animal, plant, food, architecture, machine, weather, festival, myth, tool, sport, music, toy, emotion                 |
| World              | forest, ocean, volcano, desert, sky, underground, starfield, workshop, clocktower, candy realm, postal network, mechanical garden |
| Silhouette driver  | hat/head object, cape, backpack, handheld prop, mount/board, orbiting pieces, round body, sharp horns, giant sleeves, tail        |
| Action state       | standing display, sprinting, floating, casting, guarding, collecting, repairing, cooking, fishing, mining, delivering, driving    |
| Anchor zones       | head, face, hands, back, waist, feet, orbiting objects, shadow/base, color pattern                                                |
| Material feel      | wood toy, clay toy, candy, stone block, paper craft, soft vinyl, translucent frosted glass cubes, polished ceramic voxels, anodized metal blocks, brushed metal, glowing glass, bioluminescent voxel elements |
| Variation strength | close to reference, medium remix, bold redesign                                                                                   |

Use the matrix to create new combinations, then reduce them to 3-5 large readable anchors.

Good creative moves:

- Turn an abstract role into a physical silhouette object.
- Make one everyday object oversized and iconic.
- Use a small orbiting system only when it clarifies the role.
- Allow dynamic pose, hoverboard, jet boots, or energy trail if readability stays high.
- Allow simple stylized transparent/glowing parts for sci-fi assets, but keep them toy-like.

Calibration examples, for style only:

- Candy knight proves food-theme translation.
- Rune mage proves floating magic systems.
- Crow knight proves dark faction identity.
- Lighthouse fisherman proves architecture-as-headgear.
- Lava courier proves dynamic delivery/action poses.
- Star core miner proves sci-fi transparent helmet and tool emphasis.

GLOBAL_NEGATIVE, append once at the end of the final prompt:

```text
no photorealism, no realistic anatomy, no gritty texture, no PBR material maps, no messy background, no text, no UI frame, no extra characters, no over-detailed micro ornaments
no smooth surfaces, no realistic curves, no human skin textures, no non-cubic elements, no low contrast, no messy random colors, no flat lighting
no cheap plastic, no flat ambient lighting, no dull colors, no soft clay deformation, no muddy shadows, no overexposed highlights
```

Positive material constraint to pair with negatives:

```text
solid color block shading, clean bevels, crisp voxel planes, subsurface accent limited to eyes and translucent accent zones only
```

## Creative Style Input

`creative_style` is required for image creation and prompt writing. If it is available from `$voxel-art-brief`, treat it as a required middle layer, not optional decoration. If it is missing, create it internally before producing the prompt package.

Consume these fields in the final prompt:

- `creative_narrative`
- `hero_moment`
- `style_tags`
- `material_contrast`
- `lighting_profile`
- `lighting_design`
- `camera_spec`
- `camera_tags`
- `lighting_tags`
- `color_tags`
- `action_tags`
- `fx_tags`
- `extra_negative_tags`
- `dominant_anchor`
- `restraint_note`

If an older `$voxel-art-brief` result provides `material_tags` instead of `material_contrast`, convert it before writing the final prompt: infer `body_60_70`, `edge_bevel_10_15`, `accent_zone_10_20`, and `ground_ao_5`. Do not pass raw `material_tags` through as the main material system.

The matrix chooses the ingredients; `creative_style` turns them into the dramatic picture. Keep the creative language vivid, but keep the final asset readable and uncluttered.

When creating `creative_style` internally, auto-expand the user's brief with:

1. Core subject: a concrete visual identity, not a literal translation.
2. Atmosphere: inferred world mood, such as cyberpunk night, cozy workshop, heroic fantasy, or eerie toy fairytale.
3. Hero moment: write a single-frame concept-art shot with action/state, implied environment, and emotional tension.
4. Camera system: choose focal length and perspective first, then add tilt-shift, macro, Dutch angle, worm's eye view, or out-of-focus foreground bokeh blocks.
5. Lighting profile: choose exactly one of `cozy_miniature`, `cyber_neon`, `cinematic_epic`, or `ethereal_magic`, then specify key, fill, rim/back, shadow, atmosphere, and mood.
6. Material hierarchy: describe body 60-70%, edge/bevel 10-15%, accent zone 10-20%, and ground/AO 5%. Respect explicit user material requests; skip contrast if the brief requires one uniform material.
7. Micro-FX: one environment effect such as floating glowing embers, magical geometric sparks, floating pixel particles, dust motes in light shafts, glass caustics, or slow-motion chunky debris.
8. Color grading: cinematic color grading, teal-orange contrast, high contrast accents, or vibrant but harmonious voxel palette.
9. Voxel-specific negative control: use GLOBAL_NEGATIVE once; express material quality as positive constraints.

### Dynamic Visual Engine

Use the visual engine to route the prompt before writing it. Do not combine all profiles.

| Profile | Use for | Lighting design |
| --- | --- | --- |
| `cozy_miniature` | houses, plants, food, daily props, gentle characters | Key light: broad warm window light from 30-45 degrees above, 3000-3600K, soft edge. Fill light: bounce at 35-45% key. Rim/back light: faint honey rim. Shadow: soft contact AO. Atmosphere: dust motes only in light shafts. Mood: tiny handmade world waking in morning light. |
| `cyber_neon` | sci-fi, monsters, machines, night scenes, cyber props | Key light: narrow neon sign or screen light from one side, saturated cyan or magenta, hard falloff. Fill light: nearly black ambient at 5-10% key. Rim/back light: opposite orange or teal strip light. Shadow: sharp colored drop. Atmosphere: thin colored haze behind subject plus sparse pixel particles. Mood: small outlaw figure caught in wet neon alley glow. |
| `cinematic_epic` | knights, swords, weapons, bosses, heroic characters, large dramatic scenes | Key light: single hard spotlight from 45 degrees above, 4200K slightly warm, high intensity, clear shadow boundary. Fill light: weak ambient at 10-15% key. Rim/back light: opposite cool blue-violet 5500-6500K moon or magic rim. Shadow: deep sharp cast shadow and tight ground AO. Atmosphere: one-way volumetric fog or Tyndall beam behind or above the subject, never across the face. Mood: lone hero standing in a divine spotlight, surrounded by battlefield darkness. |
| `ethereal_magic` | crystals, magic, water, ghosts, translucent creatures, fluid effects | Key light: large diffused glow from inside or below the accent core, cool 6500K with soft bloom. Fill light: pearl ambient at 20-25% key. Rim/back light: pale lavender rim and refracted edge sparkle. Shadow: soft transparent shadow with caustic flecks. Atmosphere: glass caustics and suspended motes around accent zones only. Mood: fragile artifact glowing in a quiet impossible chamber. |

Camera focal-length map:

| Emotional goal | Focal length | Use this language |
| --- | --- | --- |
| toy intimacy | 135mm macro | tight depth, compressed miniature scale, soft bokeh blocks at frame edges, floating subject |
| heroic presence | 35mm wide-ish | slight wide-angle distortion, worm's eye framing, forced perspective, large dominant silhouette |
| mystery tension | 24mm Dutch | edge distortion, tilted frame, compressed atmosphere, uneasy diagonal staging |
| product clarity | 85mm flat | neutral perspective, centered studio, clean shadow, readable silhouette without distortion |

Hero moment:

- Write `hero_moment` as a single-frame concept-art shot, not a functional inventory description.
- Include action or state, one implied environment signal, and emotional tension.
- Format: `{subject} {action verb phrase}, {environment implied in one phrase}, {emotional beat}`.
- Bad: `A knight holding a glowing sword`.
- Good: `A lone crystal knight raises a cracked luminous shield as ethereal sparks rain down, a final defiant stand before oblivion`.

Material hierarchy:

- Body 60-70%: main volume material and dominant color.
- Edge/Bevel 10-15%: bevel highlight, usually 1-2 stops brighter, metallic trim, frosted glass edge, or controlled specular ridge.
- Accent Zone 10-20%: eyes, core, blade, window, staff head, rune slot, or orbiting pieces; glow, transparency, metal, and caustics belong here.
- Ground/AO 5%: contact shadow, tiny plinth, or floating shadow that gives the asset weight.
- If the user explicitly asks for one uniform material, preserve that material and add only camera and lighting hierarchy.

Spatial depth and micro-FX:

- `camera_tags` should include macro or tilt-shift depth plus out-of-focus foreground bokeh blocks when compatible with the asset.
- `fx_tags` should include exactly one atmospheric micro-FX family. The FX must frame the subject and reinforce the chosen lighting profile.
- End the prompt with a restraint note when effects are strong: `Ensure the lighting and effects do not obscure the clean geometric silhouette of the main subject.`

## Art Brief Shape

Use this compact structure internally and show it when useful:

```json
{
  "asset_type": "character | prop | avatar | card_art | scene_block",
  "purpose": "concept exploration | game-ready baseline | marketing image | batch style guide",
  "style_direction": "voxel-like low-poly blocky chibi mobile game art",
  "reference_anchors": ["..."],
  "iconic_features": ["..."],
  "creative_matrix": {
    "source_theme": "...",
    "world": "...",
    "silhouette_driver": "...",
    "action_state": "...",
    "anchor_zones": ["..."],
    "material_feel": "...",
    "variation_strength": "close to reference | medium remix | bold redesign"
  },
  "composition": "full-body centered single subject on clean background",
  "camera_view": "3/4 view",
  "color_palette": "...",
  "mood": "...",
  "consistency_need": "single image | same character variants | same world batch",
  "negative_constraints": ["..."],
  "success_criteria": [
    "strong silhouette",
    "recognizable role",
    "clean game asset presentation",
    "eye-catching creative hook"
  ]
}
```

## Prompt Package

Default output:

```json
{
  "prompt_package": {
    "mode": "generation_prompt | edit_prompt",
    "main_prompt": "...",
    "compact_prompt": "...",
    "edit_prompt": "...",
    "locked_style_fields": ["..."],
    "variable_fields": ["..."],
    "notes": ["..."]
  }
}
```

### Main Prompt Pattern

```text
Create an original {asset_type} for a mobile game.

Style:
voxel-like low-poly Q-version 3D game art, blocky chibi proportions, oversized head and compact body, constructed from distinct volumetric cubes and chunky geometric blocks, crisp pixelated edges, faceted planes, solid color block shading, clean bevels, premium toy-like presentation.

Subject:
{subject and theme}

Creative transformation:
{source_theme} translated into {world}, using {silhouette_driver} as the main silhouette driver and {action_state} as the pose or state. Variation strength: {variation_strength}.

High-impact creative direction:
{creative_style.creative_narrative}

Hero moment:
{creative_style.hero_moment}

Camera direction:
{creative_style.camera_spec}
{creative_style.camera_tags}

Lighting design:
Lighting profile: {creative_style.lighting_profile}
{creative_style.lighting_design}
{creative_style.lighting_tags}

Action, color, style, and mood:
{creative_style.color_tags}
{creative_style.action_tags}
{creative_style.style_tags}
{creative_style.fx_tags}

Iconic features:
{1-5 large readable anchors}
Dominant anchor: {creative_style.dominant_anchor}

Composition:
{composition}, {camera_view}, controlled stage for the selected lighting profile, single clear subject, no text. Add shallow spatial depth with out-of-focus foreground bokeh blocks or light particles only at the edges of the frame; do not let foreground effects cover the subject.

Color and mood:
{palette and mood}

Geometry constraints:
all forms should feel built from cubes, trapezoids, rectangular prisms, triangular prisms, and chunky low-poly facets; avoid realistic anatomy and soft organic realism.

Material constraints:
{creative_style.material_contrast}
Use the material hierarchy engine: Body 60-70% defines the main volume and color; Edge/Bevel 10-15% creates crisp highlight separation; Accent Zone 10-20% carries glow, transparency, metal, caustics, eyes, core, blade, window, or rune details; Ground/AO 5% gives contact weight. Keep the result blocky and toy-like, no complex texture maps, no micro-detail noise. Use solid color block shading, clean bevels, crisp voxel planes, and subsurface accent limited to eyes and translucent accent zones only. If the user explicitly requested one uniform material, honor it and rely on lighting/camera contrast instead.

Success criteria:
{success_criteria}
Restraint:
{creative_style.restraint_note}

Negative constraints:
{GLOBAL_NEGATIVE}
{brief-specific negative constraints only if they are not duplicates}
{creative_style.extra_negative_tags only if they are not duplicates}
```

### Edit Prompt Pattern

Use when the user provides an input/reference image:

```text
Use the input image as the strict style and presentation reference.
Keep the same voxel-like low-poly Q-version mobile game art style, blocky chibi proportions, faceted geometry, clean studio presentation, readable silhouette, and toy-like material feel.
Change only: {requested_change}.
Preserve: {identity anchors to keep}.
Do not redesign unrelated parts. No text, no UI frame, no messy background.
```

## Image API Script

Bundled script. Run from the `voxel-game-art` skill directory:

```bash
node scripts/xbai-image.mjs \
  --prompt "..." \
  --output ./output.png
```

With a reference image:

```bash
node scripts/xbai-image.mjs \
  --ref ./reference.jpg \
  --prompt "..." \
  --output ./output.png
```

Prompt from files:

```bash
node scripts/xbai-image.mjs \
  --promptfiles style.md character.md \
  --output ./output.png
```

Useful production flags:

- `--ar 1:1|16:9|9:16|4:3|3:4|3:2|2:3`
- `--size 1536x1024`
- `--quality high|medium|low|auto|standard|hd`
- `--retries 3`
- `--json`

Environment:

- `XBAI_API_KEY` or `OPENAI_API_KEY`: required.
- `XBAI_BASE_URL`: optional, defaults to `https://api.xbai.top/v1`.

Place `.env` in the skill directory for this skill-specific setup:

```env
XBAI_API_KEY=sk-your-key
XBAI_BASE_URL=https://api.xbai.top/v1
```

Never print or commit real API keys.

## Guardrails

- Do not ask more than 3 questions in one round.
- Do not treat voxel art as pixel art unless the user asks.
- Do not overfit tiny decorations from a reference image; preserve large identity anchors.
- Do not claim an image was generated unless the script actually ran and saved the file.
- For batch assets, keep `locked_style_fields` stable and vary only role/theme/item/palette.
- Prefer `--ref` for uploaded/reference images. `--image` is kept only as a backward-compatible alias for reference input.
- For quick validation tests, save outputs under `/tmp/voxel-game-art-tests/`. Only save under the skill workspace when the user explicitly wants a reusable sample committed or reviewed there.
