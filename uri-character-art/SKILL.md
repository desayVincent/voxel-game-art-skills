---
name: uri-character-art
description: Use when designing, prompting, or generating URI Dream Lab style hyper-realistic 3D anime character illustrations from text or uploaded/reference images; optimized for futuristic, urban, sporty, glossy, high-saturation character art with dynamic perspective, strong lighting, technical outfits, translucent skin, silky hair, and cinematic FX. Do not use for URI/URL syntax, API route naming, or web address formatting.
---

# URI Character Art

Use this skill for URI Dream Lab style character art: hyper-realistic 3D anime illustration, futuristic and high-saturation, with strong perspective, glossy technical materials, translucent skin, silky high-detail hair, cinematic lighting, and a character-first composition.

This skill is for:

- futuristic anime character portraits
- dynamic adult heroine or hero key art
- racing, port, lab, urban, tactical, cyber, sport-tech, or sci-fantasy scenes
- high-saturation social poster images
- reference-image edits into URI Dream Lab style
- prompt packages for image generation models

It does not copy one fixed uploaded image. Treat reference images as style grammar: color energy, material language, camera behavior, lighting intensity, hair finish, skin finish, and composition rhythm. Generate original characters from the user's brief every time.

## Workflow

1. If the user provides prompt text from a template image, first run the template decomposition workflow below.
2. If the user provides 5-10 reference images for one URI Dream Lab style, run the visual reverse-engineering workflow below and merge the result into the prompt formula.
3. Inspect the user brief or reference image. Extract durable anchors only: character role, face/eye appeal, hair color and motion, outfit anchor, material finish, pose, camera angle, light direction, color profile, scene context, FX, and any explicit branding/text decals.
4. If important fields are missing, infer creatively. Ask at most one short clarification round with no more than 3 questions only when a wrong assumption would materially change the result.
5. Produce an `art_brief` using the shape below.
6. Create `creative_style` by routing the brief through the dynamic visual engine.
7. Produce a `prompt_package` with `main_prompt`, `compact_prompt`, `negative_prompt`, `edit_prompt`, and consistency locks.
8. If the user asks to generate or edit an image, use `scripts/xbai-image.mjs`.

## Reference Reverse Engineering

When a user uploads a prompt-template image that contains a positive prompt and negative prompt, decompose it before generating anything:

1. `style_anchor_tags`: always-on style words that should survive every subject change.
2. `scene_variables`: swappable content words such as character, outfit, action, setting, weather, props, and decals.
3. `weighted_terms`: terms with explicit syntax such as `(tag:1.2)`, `((tag))`, `[tag]`, or model-specific weights.
4. `negative_precision_terms`: exact exclusions that prevent the style from drifting.

Use this output shape:

```json
{
  "template_decomposition": {
    "style_anchor_tags": ["..."],
    "scene_variables": ["..."],
    "weighted_terms": ["..."],
    "negative_precision_terms": ["..."],
    "notes": ["which terms are prompt-framework-specific vs style-specific"]
  }
}
```

When the user provides 5-10 consistent reference images, use a vision model such as `gpt-image-2` or the current available image-understanding model to reverse-engineer the style across all images together. Use this prompt:

```text
You are a professional AI prompt engineer specializing in reverse-engineering
visual art styles for Stable Diffusion / Midjourney / DALL-E 3.

I will provide you with 5-10 reference images that represent a consistent
visual style called "URI Dream Lab" — hyper-realistic 3D anime character art.

Your task is to extract a precise, reusable prompt formula by analyzing ALL
images together (not individually).

Output:
1. Style Anchor Tags (always-on, never remove)
2. Skin & Face Formula
3. Hair Formula
4. Outfit & Material Formula
5. Camera & Perspective Formula
6. Lighting Formula
7. Color Grading Formula
8. FX Layer Tags
9. Negative Prompt Formula
10. Assembled Base Prompt (80 words max)
```

Map the reverse-engineered output back into this file:

| Reverse output | Skill destination |
| --- | --- |
| Style Anchor Tags | Style Grammar -> Rendering & Quality Anchors |
| Skin & Face Formula | Style Grammar -> Skin & Face Rules |
| Hair Formula | Style Grammar -> Hair Rules |
| Outfit & Material Formula | Style Grammar -> Outfit & Material Rules |
| Camera Formula | Camera And Lens Rules |
| Lighting Formula | Lighting Profiles |
| Color Grading Formula | Color System |
| FX Layer Tags | FX Layer |
| Negative Prompt Formula | Prompt Package -> Negative prompt |
| Assembled Base Prompt | Prompt Package -> `quality_anchors` |

## Reverse-Engineered Base Formula

Use this as the default reusable formula when no stronger reference-derived formula is provided.

1. Style anchor tags:
   `(URI DREAM LAB style:1.25), (hyper-realistic 3D anime character art:1.25), (high saturation:1.2), (high exposure:1.12), masterpiece, best quality, 8K resolution, realistic 3D rendering, high contrast colors, rich vivid color, ultra-fine details, Japanese semi-realistic anime style, cinematic composition, bright clear colors`

2. Skin and face rendering:
   `(translucent skin:1.18), subsurface scattering, protected skin highlights, delicate facial features, large luminous eyes, glossy eye catchlight, soft blush, small clean nose, soft lips, slight 3/4 face angle, emotionally readable gaze`

3. Hair detail and lighting:
   `(silky high-detail hair:1.18), individual hair strands, windswept hair, floating stray hairs, glossy hair highlights, warm/cool rim light on hair edge, backlit hair separation`

4. Outfit material and texture:
   `future techwear, glossy white jacket, transparent PVC layer, technical fabric, reflective zippers, (large readable URI / DREAM LAB / 05 decals only:1.25), oversized sleeve decal, chest logo print, one background lab sign, nylon straps, choker, gloves, goggles/headset, wet/glossy material sheen, metal and plastic reflections, minimal tiny text`

5. Camera and DOF:
   `low-angle close-up, 24mm foreshortening for reaching hand shots, 35mm low-angle for presence, 85mm portrait for calmer shots, shallow depth of field, face and hand sharp, background softly blurred`

6. Lighting setup:
   `strong sunlight or bright neon key, clear key/fill/rim separation, hair rim light, cheek and nose highlights, bright sky bounce or neon bounce fill, volumetric haze, high contrast but readable skin`

7. Color grading:
   `blue-white-yellow dominant palette, sky blue background, chrome white clothing, yellow/gold accent, high saturation, high exposure, clean bright highlights, punchy shadows, protected skin tones`

8. FX layer tags:
   `lens flare, volumetric light shaft, bokeh foreground, water droplets, wind-blown hair, eye catchlight, subtle film grain, slight chromatic aberration, flying birds or small atmospheric motion cues`

9. Negative prompt:
   `(worst quality, low quality:1.4), flat 2D anime, painterly brush texture, sketch lines, dull muddy colors, low saturation, dark underexposed image, washed-out skin, dry matte skin, cheap plastic skin, generic AI face, no personality, flat neutral camera, cluttered background, overblown bloom, uncontrolled lens flare spam, small illegible text, random micro text, fake letters, garbled decals, dense typography clutter, watermark, deformed hands, extra fingers, anatomical errors, unsafe or age-inappropriate styling`

10. Assembled base prompt, under 80 words:
    `(URI DREAM LAB style:1.25), hyper-realistic 3D anime character art, high saturation, high exposure, 8K, realistic 3D rendering, Japanese semi-realistic face, translucent skin, luminous eyes, silky rim-lit hair, glossy techwear, (large readable URI / DREAM LAB / 05 decals only:1.25), minimal tiny text, dynamic low-angle perspective, shallow DOF, strong sunlight or neon key, volumetric haze, blue-white-yellow cinematic color grade`

## Clarification Rules

Ask only for missing high-impact fields. Default questions:

1. Character archetype: street racer, idol off-duty, operative, engineer, navigator, medic, hacker, champion, or storm chaser?
2. Scene: open-air port, racing platform, city night, rooftop, lab dock, coastal road, station deck, or tech-temple?
3. Camera energy: portrait, full body, low-angle presence, or hand/prop reaching toward viewer?

If the user says "you decide", use the defaults below.

## Style Grammar

Lock these:

- Style: URI Dream Lab hyper-realistic 3D anime character illustration, not flat 2D anime and not human photography.
- Rendering and quality anchors: `(URI DREAM LAB style:1.25), (hyper-realistic 3D anime character art:1.25), (high saturation:1.2), (high exposure:1.12), masterpiece, best quality, 8K resolution, realistic 3D rendering, high contrast colors, rich vivid color, ultra-fine details, Japanese semi-realistic anime style, cinematic composition, bright clear colors`.
- CG quality: Unreal Engine 5 / premium 3D CG illustration feel, physically based material response, ray-traced reflections, glossy reflections, crisp material micro-detail.
- Subject priority: one main character dominates the image.
- Skin and face formula: `(translucent skin:1.18), subsurface scattering, protected skin highlights, delicate facial features, large luminous eyes, glossy eye catchlights, clean minimal makeup, soft nose bridge highlight, emotionally readable expression, slight 3/4 face angle`.
- Hair formula: `(silky high-detail hair:1.18), individual strand separation, hair rim glow, windswept hair, floating hair strands, directional upper-rear rim light, silver-white / platinum / deep black / vivid dyed color range by default`.
- Outfit and material formula: technical fabrics, transparent PVC, nylon, latex, mesh, neoprene, athletic compression wear, futuristic armor panels, structured streetwear, reflective zippers, transparent overlay layers, straps, seams, wet/glossy surface sheen, `(large readable URI / DREAM LAB / 05 decals only:1.25)`, oversized sleeve decal, chest logo print, one background lab sign, minimal tiny text.
- Signature item: always include 1-2 iconic outfit or prop anchors such as transparent racing jacket, chrome bomber, tech harness, visor, neon collar, thigh strap, equipment rig, glove, headset, or panelled armor piece.
- Signature text decals: by default include only prominent, readable `URI`, `DREAM LAB`, and `05` decals on 2-3 large surfaces such as chest print, one sleeve patch, one jacket panel, or one background sign. Use `(large readable URI / DREAM LAB / 05 decals only:1.25)` unless the user explicitly disables text. Avoid dense micro typography; small filler text should be absent or visually minimal. Use `06` only when the user explicitly asks for it.
- Camera: always specify camera angle and depth of field. For reaching or first-person energy, use 24mm foreshortening language.
- Lighting: strong named lighting profile, clear key/fill/rim logic, visible catchlights, hair rim, and controlled highlights.
- Background: futuristic, urban, sport-tech, coastal, industrial, lab, platform, station, or sci-fantasy context. It supports the character and never competes.
- Finish: high saturation, high contrast, protected skin highlights, crisp material detail, subtle film grain or lens behavior when appropriate.

Do not lock these:

- one fixed character identity
- one fixed outfit
- one fixed pose
- one fixed background
- one fixed color profile
- flat cel-shaded illustration
- painterly brush texture
- photoreal human photo language
- generic "pretty character" with no personality, outfit, scene, or camera logic

## Color System

Use one primary color profile. It controls background hue, skin temperature, rim light, outfit specular color, and accent behavior.

| Profile | Dominant palette | Accent | Mood |
| --- | --- | --- | --- |
| `solar_chrome` | sky blue, chrome white, warm gold | neon yellow | energetic, open-air, port, racing, free |
| `cyber_violet` | deep navy, electric violet, hot pink | cyan edge | nocturnal, city, dangerous cool |
| `jade_core` | muted olive, deep teal, bronze | acid green | tactical, grounded, military-urban |
| `sakura_burn` | warm white, dusty rose, amber | crimson flare | emotional, golden-hour, dramatic soft |
| `void_arc` | near-black, cold blue, silver | white core flash | extreme contrast, boss energy |

## Lighting Profiles

Route every prompt through exactly one lighting profile.

| Profile | Use for | Lighting design |
| --- | --- | --- |
| `daylight_impact` | default; open-air, port, racing, bright tech scenes | Strong direct sunlight from upper-right, 5600K key light. 15% cool blue fill from opposite side. Warm gold hair rim light. Sharp shadow under collar and jaw. Lens flare from sun position, volumetric atmosphere haze, high contrast, high saturation. |
| `neon_midnight` | city night, cyber, underground, hacker, operative scenes | Zero ambient feel, single dominant cyan or magenta neon side key, opposite complementary rim, deep black background, wet surface reflections, pupil catchlight, subtle smoke or steam haze, extreme contrast and color-isolated shadows. |
| `golden_hour_burst` | emotional, warm, rooftop, coastal, travel, soft drama scenes | Warm 3200K low-angle backlight behind subject, orange-gold rim on shoulders and hair, 20% soft front fill, warm amber skin glow, backlit dust particles, lens flare near light source edge, saturated warm grade. |
| `storm_edge` | coastal road, storm, military, intense action scenes | Overcast high-key diffused blue-grey ambient, single cool 6500K sharp highlight through clouds, rain droplets on skin or outfit, mist in background, desaturated midtones, punchy shadows. |

## Camera And Lens Rules

| Intent | Focal length | Language |
| --- | --- | --- |
| intimacy / portrait | 85mm | shallow DOF, face dominant, soft background separation, slight compression |
| power / presence | 35mm low angle | worm's-eye feeling, slight distortion, character towers, environment visible |
| reaching / dynamic | 24mm foreshortening | hand or prop toward viewer, extreme perspective, first-person interaction energy |
| full body display | 50mm | neutral perspective, full silhouette readable, slight low angle |
| hyper-close detail | 135mm | extreme face crop, one eye in focus, compressed bokeh background |

Default camera rule:

- Always specify camera angle.
- Include depth-of-field behavior in every prompt.
- Prefer dynamic diagonal body lines, slight low angles, reaching gestures, mid-turn poses, or wind-hit movement.
- Keep face and primary gesture sharp. If a hand reaches toward camera, face and hand should both remain readable.
- Do not use flat front-facing neutral staging unless the user explicitly asks for product clarity.

## FX Layer

Choose 2-3 FX items per prompt. Do not use all at once.

- lens flare
- volumetric light shaft
- film grain overlay
- bokeh foreground elements
- floating dust motes
- water droplets on skin or glossy outfit
- rain surface reflections
- hair rim glow
- eye catchlight
- subtle chromatic aberration at frame edge
- heat shimmer haze
- embers or spark particles
- neon reflections on wet ground
- restrained anamorphic horizontal flare streak

## Creative Remix Matrix

Use this engine to generate original characters without copying a fixed image.

| Axis | Options |
| --- | --- |
| Character archetype | street racer, idol off-duty, covert operative, combat medic, ship navigator, underground hacker, rogue engineer, ghost soldier, cyber shaman, tournament champion, corporate saboteur, storm chaser |
| World and scene | offshore racing platform, rooftop helipad at dusk, underground neon arena, storm-hit coastal highway, space elevator loading dock, flooded cyberpunk alley, high-altitude research station, ancient temple with tech overlay, abandoned sports arena, orbital station observation deck |
| Outfit anchor | transparent PVC racing jacket, carbon fiber chest rig, oversized chrome bomber with hood, skin-tight combat suit with panel seams, layered technical streetwear with harness, wet neoprene dive suit, asymmetric armored shoulder piece, high-collar military flight suit, holographic fabric qipao hybrid, exo-frame partial armor |
| Hero moment | reaching hand toward camera at full extension, standing on edge of platform wind-hit, mid-turn with hair whipping across face, lowering visor with eye contact, back to viewer looking over shoulder, crouching then rising mid-motion, arms spread wide in defiance, equipment check with focused gaze |
| Emotion | focused calm, reckless confidence, quiet intensity, barely-controlled fury, detached precision, sudden vulnerability, cold amusement, fierce joy |

Reduce the final design to 3-5 big anchors: face/eyes, hair motion, outfit anchor, hand/prop gesture, and scene/color identity.

## Auto-Completion Matrix

When the user gives only a short idea, complete the missing fields from this matrix instead of asking them to write prompt details.

| Need | Options |
| --- | --- |
| Xiaohongshu preset | bright offshore racer, neon rooftop idol, storm courier, lab test pilot, golden-hour navigator |
| Character role | racing champion, courier, mechanic idol, tech diver, aerial medic, hoverboard pilot, cyber photographer, data courier, marine engineer, tactical streamer |
| Gesture / action | hand reaching toward viewer, lowering goggles, holding floating capsule, pulling zipper, leaning on railing, wind-hit hair turn, stepping from platform edge, checking wrist device, looking back over shoulder |
| Body composition | upper-body close-up, waist-up hero portrait, 3/4 body with extended arm, full-body low-angle display, over-shoulder turn |
| Camera pairing | 24mm foreshortening for reaching hand, 35mm low angle for tower/platform presence, 85mm for face-first portrait, 50mm for clean full-body outfit display |
| Outfit layer | yellow sport top, black compression top, white translucent jacket, blue harness straps, chrome bomber, clear rain shell, racing shorts, tech skirt, utility belt, fingerless gloves |
| Prop anchor | headset, goggles, hover capsule, race pass, wrist device, floating drone, helmet, data card, cable hook, compact tool |
| Decal placement | chest `URI`, sleeve `DREAM LAB`, single `05` patch, background `DREAM LAB` sign. Use only these large words unless the user requests other text. |
| Weather / atmosphere | clear blue sky, sea-salt mist, light rain sparkle, rooftop sunset haze, neon steam, storm backlight, wind tunnel gust |
| Background object | lab tower, crane arm, offshore platform, glass dock rail, maglev lane, rooftop antenna, city skyline, station gantry, holographic sign |
| FX bundle | sun lens flare + water droplets + volumetric shaft; neon reflection + steam haze + eye catchlight; rain droplets + rim glow + film grain; bokeh foreground + hair rim glow + dust motes |

Preset routing:

- `xhs-default`: alias for `bright offshore racer`; best first test for Xiaohongshu.
- `bright offshore racer`: street racer, offshore racing platform, transparent PVC racing jacket, reaching hand, reckless confidence, `solar_chrome`, `daylight_impact`, 24mm foreshortening.
- `neon rooftop idol`: idol off-duty, rooftop helipad, oversized chrome bomber, lowering goggles, cold amusement, `cyber_violet`, `neon_midnight`, 35mm low angle.
- `storm courier`: storm chaser, storm-hit coastal highway, clear rain shell, checking wrist device, focused calm, `jade_core`, `storm_edge`, 50mm full-body display.
- `lab test pilot`: ship navigator, high-altitude research station, high-collar flight suit, looking back over shoulder, quiet intensity, `void_arc`, `daylight_impact`, 85mm portrait.
- `golden-hour navigator`: ship navigator, orbital observation deck, holographic fabric jacket, wind-hit hair turn, sudden vulnerability, `sakura_burn`, `golden_hour_burst`, 85mm portrait.

Do not combine every option. Pick one coherent path, then add only 2-3 FX items and 2-3 large decals.

## Combination Guardrails

URI Dream Lab works best when the combination has a clear poster hook: bright face, glossy techwear, one readable action, one dominant scene, and high-saturation color.

Good combinations:

- Open-air port/racing/lab platform + `solar_chrome` + `daylight_impact` + reaching hand or wind-hit turn.
- Rooftop/city night + `cyber_violet` + `neon_midnight` + goggles/headset gesture.
- Storm road/coastal platform + `jade_core` + `storm_edge` + courier wrist-device action.
- Research station/orbital deck + `void_arc` or `sakura_burn` + portrait/over-shoulder turn.

Avoid weak or off-style combinations:

- Dark gothic studio portrait with pure black background; it loses the URI outdoor/tech-world signal.
- Low-saturation military realism; it suppresses the high-saturation URI color identity.
- Plain T-shirt, school uniform, or fantasy robe without transparent/reflective tech material.
- Multiple props plus multiple drones plus multiple text signs; it creates clutter and AI text artifacts.
- More than 3 FX layers or dense UI overlays; it breaks the clean character-first poster look.
- Tiny text strips, serial numbers, random paragraphs, or fake interface labels. Use only large `URI`, `DREAM LAB`, and `05`.

## Dynamic Visual Engine

Before writing the prompt:

1. If the user gives a preset or vague idea, fill missing fields from the Auto-Completion Matrix.
2. Pick or receive `archetype`, `world`, `outfit_anchor`, `hero_moment`, and `emotion`.
3. Select one `color_profile` that matches world and mood.
4. Select one `lighting_profile` that matches time of day and scene energy.
5. Select one camera/lens strategy that matches the hero moment.
6. Select 2-3 FX items that match the environment.
7. Build character description: face, eyes, hair, skin, outfit material details, and weighted signature text decals by default.
8. Assemble final prompt in this order: quality anchors, character, action and pose, camera, scene and environment, lighting, FX, color grade.

## Art Brief Shape

Use this compact structure internally and show it when useful. Partial briefs are fine.

```yaml
uri_art_brief:
  character_seed: "silver-haired racer, offshore platform, reaching gesture"
  archetype: "street racer"
  world: "offshore racing platform"
  outfit_anchor: "transparent PVC racing jacket"
  hero_moment: "reaching hand toward camera at full extension"
  emotion: "reckless confidence"
  color_profile: "solar_chrome"
  lighting_profile: "daylight_impact"
  camera: "24mm foreshortening"
  fx_layer: ["lens flare", "water droplets on glossy outfit", "volumetric light shaft"]
  hair: "short silver-white, windswept"
  eyes: "large luminous pale grey eyes"
  skin_tone: "light warm, translucent"
  outfit_detail: "yellow athletic top under transparent jacket, choker, technical straps"
  signature_text_decals: ["URI", "DREAM LAB", "05"] # default weighted visual anchor
  aspect_ratio: "2:3"
  quality_target: "Midjourney v6 / SDXL / DALL-E 3 / GPT Image"
```

## Prompt Package

Default output:

```text
=== URI DREAM LAB - PROMPT PACKAGE ===

[BRIEF SUMMARY]
Archetype: {archetype}
World: {world}
Color Profile: {color_profile}
Lighting: {lighting_profile}
Camera: {camera}

[POSITIVE PROMPT]
{quality_anchors},
{character_description},
{action_and_pose},
{camera_direction},
{scene_and_environment},
{lighting_description},
{fx_layer},
{color_grade_language}

[NEGATIVE PROMPT]
{negative_prompt}

[STYLE CONSISTENCY LOCK]
{locked_style_fields}
Only vary: {variable_fields}
```

Main prompt pattern:

```text
Hyper-realistic anime style, Unreal Engine 5 render quality, 3D CG illustration, cinematic lighting, 8K resolution, masterpiece, extreme detail, physically based rendering, ray tracing reflections.

{character description with face, eyes, expression, skin translucency, hair color, hair strand detail, rim light, and character identity}

{outfit anchor and material detail: technical fabrics, transparent overlays, reflective zippers, seams, straps, wet/glossy surfaces, signature prop, weighted large readable URI / DREAM LAB / 05 decals only, minimal tiny text}

{hero moment and pose with emotional register}

{camera and lens language: angle, focal length, foreshortening if relevant, subject dominance, depth of field, what stays sharp}

{scene and environment: futuristic/urban/sport-tech context, background supports the subject}

{lighting profile: key, fill, rim, shadows, catchlights, atmospheric light}

{2-3 FX layer items only}

{color grade: selected color profile, high saturation, high contrast, protected skin highlights, punchy shadows, subtle film grain}
```

Compact prompt pattern:

```text
URI Dream Lab hyper-realistic 3D anime character, futuristic high-saturation style, translucent skin, luminous eyes, silky rim-lit hair, glossy technical outfit, {outfit_anchor}, {hero_moment}, {camera}, {lighting_profile}, {color_profile}, 2-3 controlled FX, high detail, dynamic perspective
```

Negative prompt:

```text
(worst quality, low quality:1.4), flat shading, flat 2D anime, painting texture, sketch lines, watercolor texture, dull muddy colors, dark underexposed image, low saturation, low contrast, washed-out skin, dry matte skin, cheap plastic skin, deformed hands, extra fingers, anatomical errors, bad proportions, generic AI face, no personality, bland expression, flat neutral camera, cluttered busy background fighting subject for attention, overblown bloom, uncontrolled lens flare spam, purple fringing, small illegible text, random micro text, fake letters, garbled decals, dense typography clutter, text artifacts, watermark, unsafe or age-inappropriate styling, unrequested gender presentation drift, low-resolution softness
```

Edit prompt pattern:

```text
Use the input image as identity and composition reference, but restyle it into URI Dream Lab hyper-realistic 3D anime character art.
Preserve: face identity, eye design, hair color and mass, outfit anchor, pose intent, color profile, and requested decals.
Change only: {requested_change}.
Add: translucent skin, silky rim-lit hair, glossy technical materials, dynamic perspective, strong named lighting profile, high-saturation futuristic color grade, and 2-3 controlled FX.
Do not redesign unrelated identity anchors. No watermark, no unintended nudity, no flat 2D anime, no cluttered background.
```

## Consistency Lock Rules

For same-character variants, preserve identity anchors in this order:

1. face shape and eye design
2. hair color and silhouette mass
3. outfit anchor piece
4. skin tone direction
5. color profile dominant hue

`locked_style_fields`: face shape, eye size and catchlight logic, hair color, hair mass grouping, skin translucency level, outfit anchor, material finish, signature decals, dominant hue, 3D anime render language.

`variable_fields`: pose, expression, scene context, lighting profile, camera distance, FX selection, secondary outfit details.

Do not let lighting, FX, or camera angle redesign the character identity.

## Example Internal Defaults

Use these defaults when the user says "you decide":

- `archetype`: street racer
- `world`: offshore racing platform
- `outfit_anchor`: transparent PVC racing jacket
- `hero_moment`: reaching hand toward camera at full extension
- `emotion`: reckless confidence
- `color_profile`: solar_chrome
- `lighting_profile`: daylight_impact
- `camera`: 24mm foreshortening
- `fx_layer`: lens flare, water droplets on glossy outfit, volumetric light shaft
- `aspect_ratio`: 2:3

## Image API Script

Run from the skill directory:

```bash
node scripts/xbai-image.mjs --prompt "..." --output ./output.png
node scripts/xbai-image.mjs --ref ./reference.jpg --prompt "..." --output ./output.png
node scripts/xbai-image.mjs --promptfiles style.md character.md --output ./output.png
```

Useful flags:

- `--ar 1:1|16:9|9:16|4:3|3:4|3:2|2:3`
- `--size 1536x1024`
- `--quality high|medium|low|auto|standard|hd`
- `--retries 3`
- `--json`

Recommended aspect ratios:

- portrait or social poster: `2:3`
- upper-body character card: `3:4`
- cinematic scene frame: `16:9`
- vertical splash visual: `9:16`

Environment:

- `XBAI_API_KEY` or `OPENAI_API_KEY`: required.
- `XBAI_BASE_URL`: optional, defaults to `https://api.xbai.top/v1`.
- Place `.env` in the skill directory for skill-specific setup.
- Never print or commit real API keys.

## Guardrails

- Do not ask more than 3 questions in one round.
- Do not copy a fixed reference image; extract style grammar and generate original characters.
- Always specify camera angle, lighting profile, color profile, outfit anchor, expression, and at least one FX item.
- Use 2-3 FX items maximum; too many creates visual noise.
- Do not use flat 2D anime, cel-shading, painterly brush, sketch, watercolor, or comic-panel language unless the user explicitly asks for a hybrid.
- Do not use photoreal human photography language; this is a 3D CG anime illustration, not a camera photo.
- Do not over-describe the background until it competes with the character.
- Generate adult characters by default. If a user asks for a youthful character, keep outfit and posing age-appropriate and non-suggestive.
- Do not claim an image was generated unless the script actually ran and saved the file.
- For quick validation tests, save temporary outputs under `/tmp/uri-character-art-tests/`. Only save under the skill workspace when the user explicitly wants reusable results.
