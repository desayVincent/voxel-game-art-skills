---
name: voxel-art-brief
description: Use when the user wants to clarify and creatively strengthen a voxel, low-poly, or blocky chibi game-art brief before prompt writing or image generation; always includes a creative_style layer and does not generate images by itself.
---

# Voxel Art Brief

Use this skill before `$voxel-game-art` when the user has a vague idea, wants a short clarification interview, or needs a voxel / low-poly / blocky chibi game-art direction.

This skill does not generate images. It produces:

- `art_brief`: the compact production brief.
- `creative_style`: the default high-impact narrative, camera, lighting, action, and restraint layer.

## Workflow

1. If the user gave enough information, skip questions and summarize the brief.
2. If important information is missing, ask one short clarification round with at most 3 questions.
3. Produce `art_brief`.
4. Always produce `creative_style` as part of the pre-production brief.
5. Hand the result to `$voxel-game-art` when the user wants prompts or images.

## Question Rule

Ask only for missing high-impact fields. Prefer option-style questions and include a recommended default.

Default questions:

1. Asset type: character, prop, avatar/icon, card art, or scene block?
2. Usage: concept exploration, game-ready baseline, marketing image, or batch style guide?
3. Variation strength: close to reference, medium remix, or bold redesign?

If the user says "you decide", use the defaults below.

## Defaults

- `asset_type`: character
- `purpose`: concept exploration
- `style_direction`: voxel-like low-poly blocky chibi mobile game art
- `composition`: full-body centered single subject on clean background
- `camera_view`: 3/4 view
- `creative_matrix.variation_strength`: medium remix
- `negative_constraints`: no photorealism, no PBR, no messy background, no text
- `success_criteria`: strong silhouette, recognizable role, clean game asset presentation

## Art Brief Shape

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

## Creative Matrix

When creating or refining the idea, generate from dimensions rather than copying a known case. Pick 1-2 values from each relevant row:

| Dimension | Options |
| --- | --- |
| Source theme | profession, animal, plant, food, architecture, machine, weather, festival, myth, tool, sport, music, toy, emotion |
| World | forest, ocean, volcano, desert, sky, underground, starfield, workshop, clocktower, candy realm, postal network, mechanical garden |
| Silhouette driver | hat/head object, cape, backpack, handheld prop, mount/board, orbiting pieces, round body, sharp horns, giant sleeves, tail |
| Action state | standing display, sprinting, floating, casting, guarding, collecting, repairing, cooking, fishing, mining, delivering, driving |
| Anchor zones | head, face, hands, back, waist, feet, orbiting objects, shadow/base, color pattern |
| Material feel | wood toy, clay toy, candy, stone block, paper craft, soft vinyl, translucent frosted glass cubes, polished ceramic voxels, anodized metal blocks, brushed metal, glowing glass, bioluminescent voxel elements |
| Variation strength | close to reference, medium remix, bold redesign |

Reduce the result to 3-5 large readable anchors. A few strong shapes beat many small decorations.

## Creative Style

Always produce `creative_style`. Image creation should have a strong creative layer by default; do not ask the user whether to enable it.

Core rule: be bold, strange, cinematic, and memorable, but keep the output toy-like, readable, and game-asset friendly. If the user asks for a conservative or close-to-reference result, strengthen material contrast, camera, lighting, pose, and presentation while preserving the subject identity.

Do not merely translate the user's idea into simple English voxel words. Act as an automatic prompt expander: infer the subject, atmosphere, material system, camera setup, lighting design, color grading, and negative constraints in the background.

Always keep:

- voxel-like / low-poly / blocky chibi style
- one clean subject on a controlled white, light neutral, dark, or atmospheric stage chosen by the lighting profile
- 3-5 large visual anchors
- stylized premium material hierarchy: body, bevel, accent zone, and ground/AO each have a distinct visual job
- camera-first direction: choose focal length, perspective feel, and framing before adding effects
- lighting design with key, fill, rim, shadow, atmosphere, and mood logic, not loose lighting adjectives
- one dominant anchor only: head object, weapon/tool, mount/base, cape/back, or orbiting system
- up to two secondary anchors
- tags under 18 total
- out-of-focus foreground bokeh blocks or shallow-depth air layers when they do not cover the subject
- one micro-FX layer such as floating pixel particles, glowing embers, geometric sparks, or chunky debris

Creative style shape:

```json
{
  "creative_style": {
    "creative_narrative": "...",
    "hero_moment": "...",
    "style_tags": ["..."],
    "material_contrast": {
      "body_60_70": "...",
      "edge_bevel_10_15": "...",
      "accent_zone_10_20": "...",
      "ground_ao_5": "...",
      "override_note": "Respect explicit user material requests; skip contrast if the brief requires one uniform material."
    },
    "lighting_profile": "cozy_miniature | cyber_neon | cinematic_epic | ethereal_magic",
    "lighting_design": {
      "key_light": "...",
      "fill_light": "...",
      "rim_back_light": "...",
      "shadow": "...",
      "atmosphere": "...",
      "mood_word": "..."
    },
    "camera_spec": {
      "emotional_goal": "toy intimacy | heroic presence | mystery tension | product clarity",
      "focal_length": "135mm macro | 35mm wide-ish | 24mm Dutch | 85mm flat",
      "perspective_effect": "...",
      "framing": "..."
    },
    "camera_tags": ["..."],
    "lighting_tags": ["..."],
    "color_tags": ["..."],
    "action_tags": ["..."],
    "fx_tags": ["..."],
    "extra_negative_tags": ["..."],
    "dominant_anchor": "...",
    "restraint_note": "..."
  }
}
```

## Dynamic Visual Engine

Route each brief through exactly one lighting profile. Do not dump all profiles into one prompt.

| Profile | Use for | Lighting design |
| --- | --- | --- |
| `cozy_miniature` | houses, plants, food, daily objects, gentle characters | Key light: broad warm window light from 30-45 degrees above, 3000-3600K, soft edge. Fill light: gentle bounce at 35-45% key strength. Rim/back light: faint honey rim from behind small props. Shadow: soft contact AO under the subject. Atmosphere: dust motes only inside light shafts, never on the face. Mood word: tiny handmade world waking in morning light. |
| `cyber_neon` | sci-fi, monsters, machines, night scenes, cyber props | Key light: narrow neon sign or screen light from one side, saturated cyan or magenta, hard falloff. Fill light: almost black ambient at 5-10% key strength. Rim/back light: opposite orange or teal strip light outlining the silhouette. Shadow: sharp colored shadow drop. Atmosphere: thin colored haze behind the subject plus sparse pixel particles. Mood word: small outlaw figure caught in a wet neon alley glow. |
| `cinematic_epic` | knights, weapons, bosses, dramatic scenes, heroic characters | Key light: single hard spotlight from 45 degrees above, 4200K slightly warm, high intensity, clear shadow boundary. Fill light: very weak ambient at 10-15% key strength, only to avoid dead black. Rim/back light: opposite cool blue-violet 5500-6500K moon or magic rim. Shadow: deep sharp cast shadow and tight ground AO. Atmosphere: one-way volumetric fog or Tyndall beam behind or above the subject, never across the face. Mood word: lone hero standing in a divine spotlight, surrounded by battlefield darkness. |
| `ethereal_magic` | crystals, magic, water, ghosts, translucent creatures, fluid effects | Key light: large diffused glow from inside or below the accent core, cool 6500K with soft bloom. Fill light: low pearl ambient at 20-25% key strength. Rim/back light: pale lavender rim and refracted edge sparkle. Shadow: soft transparent shadow with caustic flecks. Atmosphere: glass caustics and suspended motes around accent zones only. Mood word: fragile artifact glowing in a quiet impossible chamber. |

Camera focal-length map:

| Emotional goal | Focal length | Use this language |
| --- | --- | --- |
| toy intimacy | 135mm macro | tight depth, compressed miniature scale, soft bokeh blocks at frame edges, floating subject |
| heroic presence | 35mm wide-ish | slight wide-angle distortion, worm's eye framing, forced perspective, large dominant silhouette |
| mystery tension | 24mm Dutch | edge distortion, tilted frame, compressed atmosphere, uneasy diagonal staging |
| product clarity | 85mm flat | neutral perspective, centered studio, clean shadow, readable silhouette without distortion |

Hero moment writing:

- Write `hero_moment` as a single-frame concept-art shot, not a functional inventory description.
- It must include action or state, one implied environment signal, and emotional tension.
- Format: `{subject} {action verb phrase}, {environment implied in one phrase}, {emotional beat}`.
- Bad: `A knight holding a glowing sword`.
- Good: `A lone crystal knight raises a cracked luminous shield as ethereal sparks rain down, a final defiant stand before oblivion`.

Material hierarchy:

- Body 60-70%: main volume material and dominant color, such as matte ceramic, brushed metal, carved wood, clay, or soft vinyl.
- Edge/Bevel 10-15%: bevel highlight, usually 1-2 stops brighter, metallic trim, frosted glass edge, or controlled specular ridge.
- Accent Zone 10-20%: eyes, core, blade, window, staff head, rune slot, or orbiting pieces; allow glow, transparency, metal, or caustics here.
- Ground/AO 5%: contact shadow, tiny plinth, or floating shadow that gives the asset weight.
- If the user explicitly requests a uniform material such as all wood, all ice, or fully transparent slime, honor that request and use lighting/camera hierarchy instead.

Spatial depth and micro-FX:

- Add camera language for macro scale, tilt-shift, shallow depth of field, and out-of-focus foreground bokeh blocks.
- Add exactly one micro-FX family that supports the profile: floating glowing embers, magical geometric sparks, floating pixel particles, suspended dust motes, glass caustics, or slow-motion chunky debris.
- The foreground and FX must frame the subject, not hide it.

## Tag Banks

Use 1-2 tags from each relevant bank. Do not dump every tag into one prompt. Choose tags that fit the subject and atmosphere, not random luxury words.

Material:

- body: matte ceramic voxels; bevel: 1-2 stop brighter frosted edge; accent: glowing bioluminescent core; ground/AO: tight contact shadow
- body: soft vinyl toy blocks; bevel: subtle satin highlight; accent: translucent frosted glass eyes or windows; ground/AO: tiny clean plinth
- body: carved wood toy blocks; bevel: metallic gold edge trim; accent: warm inner rune slots; ground/AO: soft tabletop shadow
- body: brushed metal blocks; bevel: bright steel ridge; accent: neon glass seams; ground/AO: sharp industrial contact shadow
- body: stone block construction; bevel: pale crystal edge catchlight; accent: glass caustic highlights; ground/AO: mossy base shadow

Camera:

- low-angle hero shot, character towering above camera
- dynamic 3/4 view, slight tilt, cinematic framing
- floating 3/4 collectible figure view
- close-up bust shot with exaggerated depth
- Dutch angle for tension
- worm's eye view for dramatic scale
- shot on 85mm lens, f/1.8 aperture, shallow depth of field
- macro lens effect, tilt-shift miniature model effect
- out-of-focus foreground bokeh blocks framing the subject
- layered air depth with soft background falloff

Lighting:

- warm god rays, floating dust motes in light shafts, soft ambient occlusion, bright and airy
- pitch-black environment, strong neon rim light, vivid teal and orange bioluminescence, sharp shadow drop
- dramatic chiaroscuro, heavy volumetric fog, single directional spotlight, moody atmosphere
- subsurface scattering, ray-traced refractions, glass caustics, soft glowing bloom
- cinematic backlight halo and controlled rim light

Color:

- cinematic color grading
- teal and orange contrast
- vibrant yet harmonious voxel palette
- high contrast accent color against restrained base colors
- neon cyberpunk night palette
- warm heroic key light with cool shadow tones

Action:

- frozen in mid-sprint just above the ground, debris hanging in the air
- impact frame of the spell, particles exploding outward
- captured at the exact second of transformation
- hovering in a weightless action pose

Mood:

- whimsical dark fairytale toy world
- cozy yet ominous arcane workshop
- weird premium toyline energy
- playful but dangerous adventure mood

FX:

- suspended cubes of light
- frozen particle arc
- ribbon-like energy trail
- orbiting charms with clear spacing
- slow-motion debris made of chunky blocks
- floating glowing embers
- magical geometric sparks
- floating pixel particles
- glass caustic highlights
- dust motes in light shafts

Negative:

- no cheap plastic
- no flat dull lighting
- no flat ambient lighting
- no low contrast
- no muddy colors
- no dull colors
- no soft clay deformation
- no muddy shadows
- no overexposed highlights
- no messy random colors
- no busy cluttered props
- no tiny noisy texture
- no random background horizon
- no generic fantasy armor
- no over-polished realistic figurine look
- no smooth surfaces
- no realistic curves
- no human skin textures
- no non-cubic elements

## Output

When information is missing:

```md
## 还需要确认

1. ...
2. ...
3. ...
```

When information is enough, always return both blocks:

```json
{
  "art_brief": {},
  "creative_style": {}
}
```

Then say: `确认后可以交给 $voxel-game-art 生成 prompt 或直接出图。`
