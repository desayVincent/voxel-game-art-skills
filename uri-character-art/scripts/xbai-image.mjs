#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_BASE_URL = "https://api.xbai.top/v1";
const DEFAULT_MODEL = "gpt-image-2";
const DEFAULT_SIZE = "1536x1024";
const DEFAULT_QUALITY = "high";
const DEFAULT_RETRIES = 3;

const scriptPath = fileURLToPath(import.meta.url);
const skillRoot = resolve(dirname(scriptPath), "..");

function printHelp() {
  console.log(`Usage:
  node scripts/xbai-image.mjs --prompt "..." --output output.png
  node scripts/xbai-image.mjs --ref reference.jpg --prompt "..." --output output.png

Options:
  --prompt <text>      Required. Generation or edit prompt.
  --promptfile <path>  Optional. Read prompt text from one file.
  --promptfiles <...>  Optional. Read prompt text from multiple files.
  --output <path>      Optional. Defaults to output.png.
  --ref <path>         Optional. Reference image; uses /images/edits.
  --image <path>       Backward-compatible alias for --ref.
  --ar <ratio>         Optional. Maps 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3 to size.
  --size <size>        Optional. Defaults to ${DEFAULT_SIZE}.
  --quality <quality>  Optional. Defaults to ${DEFAULT_QUALITY}.
  --model <model>      Optional. Defaults to ${DEFAULT_MODEL}.
  --base-url <url>     Optional. Defaults to XBAI_BASE_URL or ${DEFAULT_BASE_URL}.
  --retries <count>    Optional. Defaults to ${DEFAULT_RETRIES}.
  --json               Optional. Print machine-readable JSON.
  --help               Show this help.

Environment:
  XBAI_API_KEY or OPENAI_API_KEY  Required.
  XBAI_BASE_URL                   Optional.

Env files are loaded from:
  ${skillRoot}/.env
  ${skillRoot}/.env.local
  <current working directory>/.env
  <current working directory>/.env.local`);
}

async function loadEnvFile(path) {
  let content = "";

  try {
    content = await readFile(path, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

async function loadEnv() {
  await loadEnvFile(resolve(skillRoot, ".env"));
  await loadEnvFile(resolve(skillRoot, ".env.local"));
  await loadEnvFile(resolve(".env"));
  await loadEnvFile(resolve(".env.local"));
}

function parseArgs(argv) {
  const args = {
    model: DEFAULT_MODEL,
    output: "output.png",
    promptFiles: [],
    quality: DEFAULT_QUALITY,
    retries: DEFAULT_RETRIES,
    size: DEFAULT_SIZE,
  };

  const takeValue = (arg, index) => {
    const value = argv[index + 1];
    if (!value || value.startsWith("-")) {
      throw new Error(`Missing value for ${arg}`);
    }
    return value;
  };

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

    if (arg === "--promptfile") {
      args.promptFiles.push(takeValue(arg, index));
      index += 1;
      continue;
    }

    if (arg === "--promptfiles") {
      index += 1;
      while (index < argv.length && !argv[index].startsWith("-")) {
        args.promptFiles.push(argv[index]);
        index += 1;
      }
      index -= 1;
      continue;
    }

    if (arg === "--ref" || arg === "--image") {
      args.image = takeValue(arg, index);
      index += 1;
      continue;
    }

    if (arg === "--ar") {
      args.aspectRatio = takeValue(arg, index);
      index += 1;
      continue;
    }

    if (
      [
        "--prompt",
        "--output",
        "--size",
        "--quality",
        "--model",
        "--base-url",
        "--retries",
      ].includes(arg)
    ) {
      const key = arg
        .slice(2)
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const value = takeValue(arg, index);
      args[key] = arg === "--retries" ? Number.parseInt(value, 10) : value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function validateArgs(args) {
  if (args.help) return;
  if (!args.prompt && args.promptFiles.length === 0) {
    throw new Error("Missing required --prompt or --promptfiles.");
  }
  for (const promptFile of args.promptFiles) {
    if (!promptFile)
      throw new Error("--promptfile/--promptfiles must include file paths.");
  }
  if (!args.output) throw new Error("--output must include a file path.");
  if (!Number.isInteger(args.retries) || args.retries < 1) {
    throw new Error("--retries must be a positive integer.");
  }
}

function getMimeType(path) {
  const ext = extname(path).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

function getSizeFromAspectRatio(aspectRatio) {
  if (!aspectRatio) return null;

  const normalized = aspectRatio.trim();
  const sizes = {
    "1:1": "1536x1536",
    "16:9": "1792x1024",
    "9:16": "1024x1792",
    "4:3": "1536x1152",
    "3:4": "1152x1536",
    "3:2": "1536x1024",
    "2:3": "1024x1536",
  };

  if (sizes[normalized]) return sizes[normalized];

  const match = normalized.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (!match) {
    throw new Error(
      `Invalid --ar "${aspectRatio}". Expected a ratio like 1:1 or 16:9.`,
    );
  }

  const width = Number.parseFloat(match[1]);
  const height = Number.parseFloat(match[2]);
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error(`Invalid --ar "${aspectRatio}".`);
  }

  return width >= height ? DEFAULT_SIZE : "1024x1536";
}

async function buildPrompt(args) {
  const parts = [];
  if (args.prompt) parts.push(args.prompt);

  for (const promptFile of args.promptFiles) {
    parts.push(await readFile(promptFile, "utf8"));
  }

  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n");
}

async function saveImageFromResult(result, outputPath) {
  const firstImage = result?.data?.[0];
  const absoluteOutputPath = resolve(outputPath);
  await mkdir(dirname(absoluteOutputPath), { recursive: true });

  if (firstImage?.b64_json) {
    await writeFile(
      absoluteOutputPath,
      Buffer.from(firstImage.b64_json, "base64"),
    );
    return { imageUrl: null, outputPath: absoluteOutputPath };
  }

  if (firstImage?.url) {
    const response = await fetch(firstImage.url);
    if (!response.ok) {
      throw new Error(
        `Failed to download generated image: ${response.status} ${response.statusText}`,
      );
    }
    const arrayBuffer = await response.arrayBuffer();
    await writeFile(absoluteOutputPath, Buffer.from(arrayBuffer));
    return { imageUrl: firstImage.url, outputPath: absoluteOutputPath };
  }

  throw new Error(
    "Image API response did not include data[0].url or data[0].b64_json.",
  );
}

async function createGenerationRequest(args, prompt) {
  return {
    body: JSON.stringify({
      model: args.model,
      prompt,
      quality: args.quality,
      size: args.size,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    path: "/images/generations",
  };
}

async function createEditRequest(args, prompt) {
  const imageBytes = await readFile(args.image);
  const form = new FormData();
  form.append("model", args.model);
  form.append("prompt", prompt);
  form.append("quality", args.quality);
  form.append("size", args.size);
  form.append(
    "image",
    new Blob([imageBytes], { type: getMimeType(args.image) }),
    basename(args.image),
  );

  return {
    body: form,
    headers: {},
    path: "/images/edits",
  };
}

async function requestImage({ apiKey, args, baseUrl, prompt }) {
  const request = args.image
    ? await createEditRequest(args, prompt)
    : await createGenerationRequest(args, prompt);
  const response = await fetch(`${baseUrl}${request.path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...request.headers,
    },
    body: request.body,
  });

  const responseText = await response.text();
  let result;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Image API returned non-JSON response: ${response.status} ${responseText}`,
    );
  }

  if (!response.ok) {
    const message =
      result?.error?.message || result?.message || response.statusText;
    throw new Error(`Image API failed: ${response.status} ${message}`);
  }

  const saved = await saveImageFromResult(result, args.output);
  return {
    ...saved,
    revisedPrompt: result?.data?.[0]?.revised_prompt,
  };
}

async function run(args) {
  await loadEnv();

  const apiKey = process.env.XBAI_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = (
    args.baseUrl ||
    process.env.XBAI_BASE_URL ||
    DEFAULT_BASE_URL
  ).replace(/\/$/, "");

  if (!apiKey) {
    throw new Error(
      "Missing XBAI_API_KEY or OPENAI_API_KEY. Add it to the skill .env or export it.",
    );
  }

  const sizeFromAspectRatio = getSizeFromAspectRatio(args.aspectRatio);
  if (sizeFromAspectRatio) {
    args.size = sizeFromAspectRatio;
  }

  const prompt = await buildPrompt(args);
  let lastError = null;

  for (let attempt = 1; attempt <= args.retries; attempt += 1) {
    try {
      const result = await requestImage({ apiKey, args, baseUrl, prompt });
      return {
        ...result,
        attempt,
        baseUrl,
        model: args.model,
        mode: args.image ? "edit" : "generation",
        size: args.size,
      };
    } catch (error) {
      lastError = error;
      if (attempt === args.retries) break;
      console.error(
        `Attempt ${attempt} failed: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  throw lastError;
}

try {
  const args = parseArgs(process.argv.slice(2));
  validateArgs(args);

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const result = await run(args);
  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Saved to: ${result.outputPath}`);
    console.log(`Mode: ${result.mode}`);
    console.log(`Model: ${result.model}`);
    console.log(`Size: ${result.size}`);
    console.log(`Attempt: ${result.attempt}`);
    if (result.revisedPrompt) {
      console.log(`Revised prompt: ${result.revisedPrompt}`);
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  console.error("Run with --help for usage.");
  process.exit(1);
}
