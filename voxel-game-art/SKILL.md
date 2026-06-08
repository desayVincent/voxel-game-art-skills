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
5. Produce a `prompt_package` with `main_prompt`, `compact_prompt`, and `edit_prompt`.
6. If the user asks to generate or edit an image, use `scripts/xbai-image.mjs`. Read the script only when execution or patching is needed.

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

Default negative constraints:

```text
no photorealism, no realistic anatomy, no gritty texture, no PBR material maps, no messy background, no text, no UI frame, no extra characters, no over-detailed micro ornaments
no smooth surfaces, no realistic curves, no human skin textures, no non-cubic elements, no low contrast, no messy random colors, no flat lighting
no cheap plastic, no flat ambient lighting, no dull colors, no claymation without SSS, no muddy shadows, no overexposed highlights
```

## Creative Style Input

`creative_style` is required for image creation and prompt writing. If it is available from `$voxel-art-brief`, treat it as a required middle layer, not optional decoration. If it is missing, create it internally before producing the prompt package.

Consume these fields in the final prompt:

- `creative_narrative`
- `hero_moment`
- `style_tags`
- `material_contrast`
- `lighting_profile`
- `camera_tags`
- `lighting_tags`
- `color_tags`
- `action_tags`
- `fx_tags`
- `extra_negative_tags`
- `dominant_anchor`
- `restraint_note`

If an older `$voxel-art-brief` result provides `material_tags` instead of `material_contrast`, convert it before writing the final prompt: infer an 80% base material, a 20% accent material, and any edge or trim accents. Do not pass raw `material_tags` through as the main material system.

The matrix chooses the ingredients; `creative_style` turns them into the dramatic picture. Keep the creative language vivid, but keep the final asset readable and uncluttered.

When creating `creative_style` internally, auto-expand the user's brief with:

1. Core subject: a concrete visual identity, not a literal translation.
2. Atmosphere: inferred world mood, such as cyberpunk night, cozy workshop, heroic fantasy, or eerie toy fairytale.
3. Material contrast: default to 80% readable base material plus 20% highlight, glow, glass, or metal accent material. Respect explicit user material requests; skip contrast if the brief requires one uniform material.
4. Lighting profile: choose exactly one of `cozy_miniature`, `cyber_neon`, `cinematic_epic`, or `ethereal_magic` from the subject and mood.
5. Camera system: tilt-shift miniature model effect, macro lens effect, 85mm shallow depth of field, out-of-focus foreground bokeh blocks, Dutch angle, worm's eye view, or dynamic 3/4 framing.
6. Micro-FX: one environment effect such as floating glowing embers, magical geometric sparks, floating pixel particles, dust motes in light shafts, glass caustics, or slow-motion chunky debris.
7. Color grading: cinematic color grading, teal-orange contrast, high contrast accents, or vibrant but harmonious voxel palette.
8. Voxel-specific negative control: avoid smooth surfaces, realistic curves, human skin textures, non-cubic elements, low contrast, messy random colors, flat lighting, cheap plastic, muddy shadows, and overexposed highlights.

### Dynamic Visual Engine

Use the visual engine to route the prompt before writing it. Do not combine all profiles.

| Profile | Use for | Required lighting language |
| --- | --- | --- |
| `cozy_miniature` | houses, plants, food, daily props, gentle characters | warm god rays, floating dust motes in light shafts, soft ambient occlusion, bright and airy |
| `cyber_neon` | sci-fi, monsters, machines, night scenes, cyber props | pitch-black environment, strong neon rim light, vivid teal and orange bioluminescence, sharp shadow drop |
| `cinematic_epic` | knights, swords, weapons, bosses, heroic characters, large dramatic scenes | dramatic chiaroscuro, heavy volumetric fog, single directional spotlight, moody atmosphere |
| `ethereal_magic` | crystals, magic, water, ghosts, translucent creatures, fluid effects | subsurface scattering, ray-traced refractions, glass caustics, soft glowing bloom |

Material contrast:

- Default syntax: `80% {base_80} as the readable voxel body, contrasted with 20% {accent_20} on the core, edges, eyes, windows, blade, trim, or orbiting pieces`.
- Examples: 80% matte ceramic voxels with 20% glowing bioluminescent glass core and metallic gold accents; 80% brushed metal blocks with 20% neon glass seams.
- Keep glow, transparency, metal, and caustics in accent zones so the main silhouette stays clean.
- If the user explicitly asks for one uniform material, preserve that material and add only lighting/camera contrast.

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

Camera, lighting, action, and mood:
Lighting profile: {creative_style.lighting_profile}
{creative_style.camera_tags}
{creative_style.lighting_tags}
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
Use the material contrast engine: about 80% simple readable base material and about 20% high-impact accent material such as glowing glass, bioluminescent core, ray-traced frosted glass, metallic trim, crystal caustics, or neon edge seams. Keep the result blocky and toy-like, no complex texture maps, no micro-detail noise. If the user explicitly requested one uniform material, honor it and rely on lighting/camera contrast instead.

Success criteria:
{success_criteria}
Restraint:
{creative_style.restraint_note}

Negative constraints:
{negative_constraints}
{creative_style.extra_negative_tags}
no smooth surfaces, no realistic curves, no human skin textures, no non-cubic elements, no low contrast, no messy random colors, no flat lighting, no cheap plastic, no flat ambient lighting, no dull colors, no claymation without SSS, no muddy shadows, no overexposed highlights.
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
