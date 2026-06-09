#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const DEFAULTS = {
  seed: "silver-haired racer, offshore platform, reaching gesture",
  archetype: "street racer",
  world: "offshore racing platform",
  outfitAnchor: "transparent PVC racing jacket",
  heroMoment:
    "natural bare open palm reaching toward viewer, palm facing camera, exactly one thumb on the side plus four fingers only, five digits total, fingers naturally grouped and softly curved, clear fingertip separation, visible palm lines, hand not cropped",
  emotion: "reckless confidence",
  colorProfile: "solar_chrome",
  lightingProfile: "daylight_impact",
  camera: "24mm foreshortening",
  fxLayer: "lens flare; water droplets on glossy outfit; volumetric light shaft",
  hair: "short silver-white hair, windswept mid-motion",
  eyes: "large luminous pale grey eyes",
  faceShape:
    "URI-style compact soft round-oval face, softly rounded cheeks, gentle lower-face fullness, short rounded chin, soft U-shaped jaw curve",
  skinTone: "light warm translucent skin with subsurface glow",
  outfitDetail: "yellow athletic top under transparent jacket, choker, technical straps",
  decals: "URI; DREAM LAB; 05",
};

const PRESETS = {
  "xhs-default": {
    archetype: "street racer",
    world:
      "offshore racing platform, clear blue sky, seagulls, mechanical dock structures, one tall signature tower sign",
    outfitAnchor: "transparent PVC racing jacket",
    heroMoment:
      "natural bare open palm reaching toward viewer, palm facing camera, exactly one thumb on the side plus four fingers only, five digits total, fingers naturally grouped and softly curved, clear fingertip separation, visible palm lines, hand not cropped",
    emotion: "reckless confidence",
    colorProfile: "solar_chrome",
    lightingProfile: "daylight_impact",
    camera: "24mm foreshortening low-angle close-up",
    fxLayer: "lens flare; water droplets on glossy outfit; volumetric light shaft",
    outfitDetail:
      "yellow sport top, white transparent jacket, blue harness straps, choker, utility belt, glossy technical panels",
  },
  "bright-offshore-racer": {
    archetype: "street racer",
    world:
      "offshore racing platform, clear blue sky, seagulls, mechanical dock structures, one tall signature tower sign",
    outfitAnchor: "transparent PVC racing jacket",
    heroMoment:
      "natural bare open palm reaching toward viewer, palm facing camera, exactly one thumb on the side plus four fingers only, five digits total, fingers naturally grouped and softly curved, clear fingertip separation, visible palm lines, hand not cropped",
    emotion: "reckless confidence",
    colorProfile: "solar_chrome",
    lightingProfile: "daylight_impact",
    camera: "24mm foreshortening low-angle close-up",
    fxLayer: "lens flare; water droplets on glossy outfit; volumetric light shaft",
    outfitDetail:
      "yellow sport top, white transparent jacket, blue harness straps, choker, utility belt, glossy technical panels",
  },
  "neon-pit-lane-rider": {
    seed: "silver-haired motorbike rider, bright URI pit lane, chrome helmet and electric sport motorcycle",
    archetype: "motorbike rider",
    world:
      "bright open-air pit lane beside one electric sport motorcycle, blue sky visible above chrome structures, clean white charging dock, restrained neon signage, one clean DREAM LAB sign",
    outfitAnchor: "glossy moto racing jacket with transparent shell",
    heroMoment:
      "chrome helmet tucked under one arm, raised visor visible, direct eye contact, leaning beside one electric sport motorcycle",
    emotion: "reckless confidence",
    colorProfile: "solar_chrome",
    lightingProfile: "daylight_impact",
    camera: "35mm low angle with character dominant and motorcycle supporting the silhouette",
    fxLayer: "sun lens flare; glossy material water droplets; volumetric light shaft",
    outfitDetail:
      "yellow sport top, white transparent moto jacket, chrome helmet, blue harness straps, reflective zippers, bare visible hand, readable URI decals",
  },
  "neon-rooftop-idol": {
    archetype: "idol off-duty",
    world:
      "rooftop helipad at night, neon city skyline, wet reflective floor, one signature sign",
    outfitAnchor: "oversized chrome bomber with hood",
    heroMoment: "lowering goggles with direct eye contact",
    emotion: "cold amusement",
    colorProfile: "cyber_violet",
    lightingProfile: "neon_midnight",
    camera: "35mm low angle",
    fxLayer: "neon reflections on wet ground; steam haze; eye catchlight",
    outfitDetail:
      "black compression top, chrome bomber, magenta trim, headset, bare hands",
  },
  "storm-courier": {
    archetype: "storm chaser",
    world:
      "storm-hit coastal highway, maglev lane, rain mist, distant offshore tower",
    outfitAnchor: "clear rain shell over technical courier suit",
    heroMoment: "checking wrist device while stepping from platform edge",
    emotion: "focused calm",
    colorProfile: "jade_core",
    lightingProfile: "storm_edge",
    camera: "50mm full body slight low angle",
    fxLayer: "rain droplets; hair rim glow; subtle film grain",
    outfitDetail:
      "olive and teal courier suit, clear rain shell, utility belt, wrist device, compact tool",
  },
  "lab-test-pilot": {
    archetype: "ship navigator",
    world:
      "storm-ringed high-altitude research station, white gantry, glass dock rail, cold cloud-gap light",
    outfitAnchor: "high-collar military flight suit",
    heroMoment: "looking back over shoulder with wind-hit hair",
    emotion: "quiet intensity",
    colorProfile: "void_arc",
    lightingProfile: "storm_edge",
    camera: "85mm portrait",
    fxLayer: "cloud mist; hair rim glow; subtle film grain",
    outfitDetail:
      "white and black flight suit, silver harness, headset, clean chest logo",
  },
  "golden-hour-navigator": {
    archetype: "ship navigator",
    world:
      "orbital station observation deck at sunset, warm clouds, distant city lights",
    outfitAnchor: "holographic fabric jacket",
    heroMoment: "wind-hit hair turn beside a glowing rail",
    emotion: "sudden vulnerability",
    colorProfile: "sakura_burn",
    lightingProfile: "golden_hour_burst",
    camera: "85mm portrait",
    fxLayer: "bokeh foreground; hair rim glow; floating dust motes",
    outfitDetail:
      "warm white jacket, dusty rose accents, amber trim, translucent collar",
  },
  "cyber-shaman-surreal": {
    seed: "URI tech-shaman pilot, bright Dream Lab platform, open sky energy",
    archetype: "tech shaman",
    world:
      "bright high-altitude tech-temple platform, blue-white sky, chrome structures, one clean signature sign",
    outfitAnchor: "translucent chrome-white tactical jacket with soft holographic lining",
    heroMoment: "floating half-step with arms open, wind lifting jacket",
    emotion: "fierce joy",
    colorProfile: "solar_chrome",
    lightingProfile: "daylight_impact",
    camera: "24mm controlled wide angle, slight low-angle presence",
    fxLayer: "floating liquid chrome droplets; volumetric light shaft; eye catchlight",
    outfitDetail:
      "soft holographic lining, anti-gravity fabric lift, high-gloss tech harness, readable URI decals",
  },
  "tactical-spectacle": {
    seed: "URI arena champion, glossy sport-tech suit, direct eye contact",
    archetype: "tournament champion",
    world: "bright sport-tech arena with chrome rails, wet reflective floor, clean signature sign",
    outfitAnchor: "exo-frame partial armor over glossy technical suit",
    heroMoment: "crouching then rising mid-motion, one hand reaching toward viewer",
    emotion: "barely-controlled fury",
    colorProfile: "cyber_violet",
    lightingProfile: "neon_midnight",
    camera: "35mm low angle with controlled foreground energy",
    fxLayer: "shattered geometric glass frozen in mid-air; eye catchlight; restrained neon rim glow",
    outfitDetail:
      "reflective zippers, asymmetric armored shoulder piece, chrome-white panels, highly specular wet surfaces",
  },
};

const COLOR_PROFILES = {
  solar_chrome:
    "sky blue and chrome white dominant, warm gold specular accents, neon yellow highlights, high saturation, protected skin highlights",
  cyber_violet:
    "deep navy and electric violet dominant, hot pink accents, cyan edge light, nocturnal high contrast",
  jade_core:
    "muted olive and deep teal dominant, bronze materials, acid green accent, tactical grounded grade",
  sakura_burn:
    "warm white and dusty rose dominant, amber glow, crimson flare accent, emotional golden-hour grade",
  void_arc:
    "near-black and cold blue dominant, silver material response, white core flash, extreme contrast",
};

const LIGHTING_PROFILES = {
  daylight_impact:
    "strong direct sunlight from upper-right, 5600K key light, 15% cool blue fill, warm gold hair rim, sharp shadow under collar and jaw, volumetric atmosphere haze",
  neon_midnight:
    "cyan or magenta neon side key, opposite complementary rim, deep blue reflective background instead of pure black, wet surface reflections, pupil catchlight, subtle smoke haze, strong contrast with protected skin",
  golden_hour_burst:
    "warm 3200K low-angle backlight behind subject, orange-gold rim on shoulders and hair, 20% front fill, amber skin glow, backlit dust particles",
  storm_edge:
    "blue-grey overcast ambient, single cool 6500K cloud-gap highlight, rain droplets, mist background, punchy shadows",
  chiaroscuro_drama:
    "optional spectacle-mode high-contrast accent lighting, targeted gobo shadow, bright face and eye catchlights, clean rim light, protected skin highlights, glossy specular accents, avoid pure black cyber poster drift",
};

const QUALITY_ANCHORS =
  "(URI DREAM LAB style:1.25), (hyper-realistic 3D anime character art:1.25), (high saturation:1.2), (high exposure:1.12), (large readable URI / DREAM LAB / 05 decals only:1.25), minimal tiny text, masterpiece, best quality, 8K resolution, realistic 3D rendering, high contrast colors, rich vivid color, ultra-fine details, Japanese semi-realistic anime style, cinematic composition, bright clear colors, Unreal Engine 5 render quality, physically based rendering, ray tracing reflections";

const QUALITY_ANCHORS_WITH_CUSTOM_DECALS =
  "(URI DREAM LAB style:1.25), (hyper-realistic 3D anime character art:1.25), (high saturation:1.2), (high exposure:1.12), large readable custom decals only, minimal tiny text, masterpiece, best quality, 8K resolution, realistic 3D rendering, high contrast colors, rich vivid color, ultra-fine details, Japanese semi-realistic anime style, cinematic composition, bright clear colors, Unreal Engine 5 render quality, physically based rendering, ray tracing reflections";

const NEGATIVE_PROMPT =
  "(worst quality, low quality:1.4), flat shading, flat 2D anime, painting texture, sketch lines, watercolor texture, dull muddy colors, dark underexposed image, low saturation, low contrast, washed-out skin, dry matte skin, cheap plastic skin, heart-shaped face, inverted triangle face, narrow lower face, overly thin face, long narrow face, gaunt cheeks, hollow cheeks, pointed chin, long pointed chin, tapered chin, sharp jawline, sharp V-shaped jaw, sharp V-line face, glove, gloves, fingerless gloves, hand-only macro close-up, fingers spread too wide, cropped fingers, hidden fingers, extra finger-like highlights, deformed hands, extra fingers, extra digit, six fingers, six digits, duplicated fingers, duplicated fingertip, second thumb, double thumb, malformed thumb, missing thumb, fused fingers, webbed fingers, anatomical errors, bad proportions, generic AI face, no personality, bland expression, flat neutral camera, cluttered busy background fighting subject for attention, overblown bloom, uncontrolled lens flare spam, purple fringing, small illegible text, random micro text, fake letters, garbled decals, dense typography clutter, text artifacts, watermark, unsafe or age-inappropriate styling, unrequested gender presentation drift, low-resolution softness";

function printHelp() {
  console.log(`Usage:
  node scripts/generate-prompt.mjs --seed "silver-haired racer..."
  node scripts/generate-prompt.mjs --brief brief.json --json

Options:
  --brief <path>             Optional JSON file with brief fields.
  --preset <name>            xhs-default, bright-offshore-racer, neon-pit-lane-rider, neon-rooftop-idol, storm-courier, lab-test-pilot, golden-hour-navigator, cyber-shaman-surreal, tactical-spectacle.
  --list-presets             Print available presets.
  --seed <text>              Character seed.
  --archetype <text>         Character archetype.
  --world <text>             Scene/world.
  --outfit-anchor <text>     Dominant outfit anchor.
  --hero-moment <text>       Pose/action.
  --emotion <text>           Emotional register.
  --color-profile <name>     solar_chrome, cyber_violet, jade_core, sakura_burn, void_arc.
  --lighting-profile <name>  daylight_impact, neon_midnight, golden_hour_burst, storm_edge, chiaroscuro_drama.
  --camera <text>            Lens/camera language.
  --fx-layer <items>         Semicolon-separated FX list.
  --hair <text>              Hair description.
  --eyes <text>              Eye description.
  --face-shape <text>        Face shape language.
  --skin-tone <text>         Skin description.
  --outfit-detail <text>     Extra outfit details.
  --decals <items>           Semicolon-separated text decals.
  --json                     Print JSON instead of text.
  --help                     Show this help.`);
}

function toCamelCase(flag) {
  return flag.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }
    if (arg === "--json") {
      args.json = true;
      continue;
    }
    if (arg === "--list-presets") {
      args.listPresets = true;
      continue;
    }
    if (!arg.startsWith("--")) throw new Error(`Unknown argument: ${arg}`);

    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${arg}`);
    }
    args[toCamelCase(arg.slice(2))] = value;
    index += 1;
  }

  return args;
}

async function loadBrief(path) {
  if (!path) return {};
  const content = await readFile(path, "utf8");
  return JSON.parse(content);
}

function asList(value) {
  return String(value || "")
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isDefaultDecalSet(decals) {
  const normalized = decals.map((item) => item.toUpperCase()).sort();
  return (
    normalized.length === 3 &&
    normalized[0] === "05" &&
    normalized[1] === "DREAM LAB" &&
    normalized[2] === "URI"
  );
}

function normalizeBrief(input) {
  const presetName = input.preset;
  const preset = presetName ? PRESETS[presetName] : {};
  if (presetName && !PRESETS[presetName]) {
    throw new Error(
      `Unknown preset "${presetName}". Use one of: ${Object.keys(PRESETS).join(", ")}`,
    );
  }

  const normalized = { ...DEFAULTS, ...preset, ...input };
  delete normalized.preset;
  return normalized;
}

function buildPackage(brief) {
  const colorGrade = COLOR_PROFILES[brief.colorProfile] || brief.colorProfile;
  const lighting =
    LIGHTING_PROFILES[brief.lightingProfile] || brief.lightingProfile;
  const fxItems = asList(brief.fxLayer).slice(0, 3);
  const decals = asList(brief.decals);
  const usesDefaultDecals = isDefaultDecalSet(decals);
  const qualityAnchors =
    decals.length > 0 && !usesDefaultDecals
      ? QUALITY_ANCHORS_WITH_CUSTOM_DECALS
      : QUALITY_ANCHORS;
  const decalText =
    decals.length === 0
      ? "no required text decals"
      : usesDefaultDecals
        ? `(large readable URI / DREAM LAB / 05 decals only:1.25), prominent clean signature decals "URI", "DREAM LAB", "05", max 3 large text surfaces total, chest print or sleeve patch or jacket panel or one background sign, minimal tiny text, no dense micro typography, no serial numbers, no random paragraphs`
        : `large readable custom text decals only: ${decals.map((item) => `"${item}"`).join(", ")}, remove default URI / DREAM LAB / 05 decals unless explicitly listed, max 3 large text surfaces total, minimal tiny text, no dense micro typography, no serial numbers, no random paragraphs, no fake interface labels`;

  const characterDescription = [
    `${brief.archetype}, ${brief.seed}`,
    `${brief.eyes}, emotionally readable ${brief.emotion}`,
    `${brief.faceShape}`,
    `${brief.skinTone}`,
    `${brief.hair}, individual strand separation, silky sheen, strong rim light`,
  ].join(", ");

  const outfitDescription = [
    `wearing ${brief.outfitAnchor}`,
    brief.outfitDetail,
    "technical fabrics, transparent overlays, reflective zippers, seams, straps, glossy material response",
    decalText,
  ].join(", ");

  const positivePrompt = [
    qualityAnchors,
    characterDescription,
    outfitDescription,
    `${brief.heroMoment}, ${brief.emotion}, dynamic diagonal body line, subject dominant in frame`,
    `${brief.camera}, dynamic perspective, depth of field defined, face and primary gesture sharp`,
    `${brief.world}, futuristic sport-tech environment, background supports the subject without competing`,
    lighting,
    fxItems.join(", "),
    `cinematic color grade: ${colorGrade}, high contrast, punchy shadows, subtle film grain`,
  ].join(",\n");

  const packageText = `=== URI DREAM LAB - PROMPT PACKAGE ===

[BRIEF SUMMARY]
Archetype: ${brief.archetype}
World: ${brief.world}
Color Profile: ${brief.colorProfile}
Lighting: ${brief.lightingProfile}
Camera: ${brief.camera}

[POSITIVE PROMPT]
${positivePrompt}

[NEGATIVE PROMPT]
${NEGATIVE_PROMPT}

[STYLE CONSISTENCY LOCK]
Preserve face shape and eye design, hair color and silhouette mass, outfit anchor piece, skin tone direction, color profile dominant hue.
Only vary: pose, expression, scene context, lighting profile, camera distance, FX selection, secondary outfit details.`;

  return {
    brief,
    positive_prompt: positivePrompt,
    negative_prompt: NEGATIVE_PROMPT,
    prompt_package: packageText,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (args.listPresets) {
    console.log(Object.keys(PRESETS).join("\n"));
    return;
  }

  const fileBrief = await loadBrief(args.brief);
  delete args.brief;
  delete args.json;
  delete args.listPresets;

  const promptPackage = buildPackage(normalizeBrief({ ...fileBrief, ...args }));
  if (parseArgs(process.argv.slice(2)).json) {
    console.log(JSON.stringify(promptPackage, null, 2));
    return;
  }
  console.log(promptPackage.prompt_package);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
