---
name: uri-art-brief
description: Use when the user wants to clarify and creatively strengthen a URI Dream Lab hyper-realistic 3D anime character brief before prompt writing or image generation; produces a compact art_brief and creative_style but does not generate images.
---

# URI Art Brief

Use this skill before `$uri-character-art` when the user has a vague character idea, wants a short clarification interview, or needs a compact URI Dream Lab direction before prompt writing.

This skill does not generate images. It produces:

- `art_brief`: the compact production brief.
- `creative_style`: the routed color, lighting, camera, material, FX, and consistency layer.

## Workflow

1. If the user gave enough information, skip questions and summarize the brief.
2. If important information is missing, ask one short clarification round with at most 3 questions.
3. Produce `art_brief`.
4. Always produce `creative_style` as part of the pre-production brief.
5. Hand the result to `$uri-character-art` when the user wants prompt packages or images.

## Question Rule

Ask only for missing high-impact fields. Prefer option-style questions and include a recommended default.

Default questions:

1. Character archetype: street racer, idol off-duty, operative, engineer, navigator, medic, hacker, champion, or storm chaser?
2. Scene: open-air port, racing platform, city night, rooftop, lab dock, coastal road, station deck, or tech-temple?
3. Camera energy: portrait, full body, low-angle presence, or hand/prop reaching toward viewer?

If the user says "you decide", use the defaults below.

## Defaults

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

## Art Brief Shape

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
  signature_text_decals: ["URI", "DREAM LAB", "05"] # only large readable decals; minimal tiny text
  aspect_ratio: "2:3"
  quality_target: "Midjourney v6 / SDXL / DALL-E 3 / GPT Image"
```

## Creative Matrix

Pick or infer one value from each axis:

| Axis | Options |
| --- | --- |
| Character archetype | street racer, idol off-duty, covert operative, combat medic, ship navigator, underground hacker, rogue engineer, ghost soldier, cyber shaman, tournament champion, corporate saboteur, storm chaser |
| World and scene | offshore racing platform, rooftop helipad at dusk, underground neon arena, storm-hit coastal highway, space elevator loading dock, flooded cyberpunk alley, high-altitude research station, ancient temple with tech overlay, abandoned sports arena, orbital station observation deck |
| Outfit anchor | transparent PVC racing jacket, carbon fiber chest rig, oversized chrome bomber with hood, skin-tight combat suit with panel seams, layered technical streetwear with harness, wet neoprene dive suit, asymmetric armored shoulder piece, high-collar military flight suit, holographic fabric qipao hybrid, exo-frame partial armor |
| Hero moment | reaching hand toward camera at full extension, standing on edge of platform wind-hit, mid-turn with hair whipping across face, lowering visor with eye contact, back to viewer looking over shoulder, crouching then rising mid-motion, arms spread wide in defiance, equipment check with focused gaze |
| Emotion | focused calm, reckless confidence, quiet intensity, barely-controlled fury, detached precision, sudden vulnerability, cold amusement, fierce joy |

Reduce the final idea to 3-5 big anchors: face/eyes, hair motion, outfit anchor, hand/prop gesture, and scene/color identity.

## Auto-Completion Matrix

When the user gives only a short idea, complete the missing fields from this matrix instead of making them write prompt details.

| Need | Options |
| --- | --- |
| Xiaohongshu preset | bright offshore racer, neon rooftop idol, storm courier, lab test pilot, golden-hour navigator |
| Character role | racing champion, courier, mechanic idol, tech diver, aerial medic, hoverboard pilot, cyber photographer, data courier, marine engineer, tactical streamer |
| Gesture / action | hand reaching toward viewer, lowering goggles, holding floating capsule, pulling zipper, leaning on railing, wind-hit hair turn, stepping from platform edge, checking wrist device, looking back over shoulder |
| Body composition | upper-body close-up, waist-up hero portrait, 3/4 body with extended arm, full-body low-angle display, over-shoulder turn |
| Camera pairing | 24mm foreshortening for reaching hand, 35mm low angle for platform presence, 85mm portrait for face-first portrait, 50mm for full-body outfit display |
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

## Combination Guardrails

Good URI combinations keep a bright face, glossy techwear, one readable action, one dominant scene, high-saturation color, and 2-3 large decals.

Prefer:

- Open-air port/racing/lab platform + `solar_chrome` + `daylight_impact` + reaching hand or wind-hit turn.
- Rooftop/city night + `cyber_violet` + `neon_midnight` + goggles/headset gesture.
- Storm road/coastal platform + `jade_core` + `storm_edge` + courier wrist-device action.
- Research station/orbital deck + `void_arc` or `sakura_burn` + portrait/over-shoulder turn.

Avoid:

- Pure black studio portraits, low-saturation military realism, plain school uniforms, dense UI overlays, too many props, more than 3 FX layers, or tiny random text.

## Creative Style

Always produce `creative_style`. Route each brief through exactly one option from each system.

Color profiles:

- `solar_chrome`: sky blue, chrome white, warm gold, neon yellow accent.
- `cyber_violet`: deep navy, electric violet, hot pink, cyan edge.
- `jade_core`: muted olive, deep teal, bronze, acid green accent.
- `sakura_burn`: warm white, dusty rose, amber, crimson flare.
- `void_arc`: near-black, cold blue, silver, white core flash.

Lighting profiles:

- `daylight_impact`: strong 5600K sunlight, cool blue fill, warm gold hair rim, sharp jaw/collar shadows, lens flare, haze, high saturation.
- `neon_midnight`: cyan or magenta neon side key, complementary rim, deep dark background, wet reflections, smoke/steam haze.
- `golden_hour_burst`: warm 3200K low backlight, orange-gold rim, 20% front fill, amber skin glow, backlit dust.
- `storm_edge`: blue-grey overcast ambient, sharp cool cloud-gap highlight, rain droplets, mist, punchy shadows.

Camera rules:

- `85mm portrait`: face dominant, shallow DOF.
- `35mm low angle`: power/presence with environment visible.
- `24mm foreshortening`: hand or prop toward viewer, first-person energy.
- `50mm full body`: readable silhouette.
- `135mm close detail`: one eye or face detail focus.

Choose 2-3 FX items only: lens flare, volumetric light shaft, film grain, bokeh foreground, floating dust motes, water droplets, rain reflections, hair rim glow, eye catchlight, edge chromatic aberration, heat shimmer, sparks, wet-ground neon reflections, restrained anamorphic flare.

Creative style shape:

```json
{
  "creative_style": {
    "color_profile": "solar_chrome | cyber_violet | jade_core | sakura_burn | void_arc",
    "lighting_profile": "daylight_impact | neon_midnight | golden_hour_burst | storm_edge",
    "camera": "85mm portrait | 35mm low angle | 24mm foreshortening | 50mm full body | 135mm close detail",
    "fx_layer": ["..."],
    "material_language": "transparent PVC, technical fabric, reflective zippers, glossy/wet surface sheen, large readable URI / DREAM LAB / 05 decals only, minimal tiny text",
    "identity_anchors": ["face/eyes", "hair motion", "outfit anchor", "gesture", "dominant hue"],
    "restraint_note": "Keep the character dominant; background and FX support the subject."
  }
}
```

## Guardrails

- Do not generate images from this skill.
- Do not copy a fixed reference image; extract style grammar and generate original brief directions.
- Always include a camera, lighting profile, color profile, outfit anchor, expression, and 2-3 FX items.
- Do not let background detail compete with the character.
- Generate adult characters by default. If a user asks for a youthful character, keep outfit and posing age-appropriate and non-suggestive.
