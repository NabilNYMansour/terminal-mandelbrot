#!/usr/bin/env tsx

const [major] = process.versions.node.split('.').map(Number);
if (major < 20) {
  console.error(`terminal-mandelbrot requires Node.js 20 or newer (current: ${process.version})`);
  process.exit(1);
}

import * as readline from "readline";

// Check for gray flag
const useGray = process.argv.includes("--gray");

const gradient = " _.-,=+:;cba!?0123456789$W#@";
const maxIterations = 1000;
const charAspect = 0.5;

let zoom = 1.0;
let centerX = -0.5;
let centerY = 0.0;

const panSpeed = 0.1;
const zoomFactor = 1.2;

// Background color (RGB) only needed if not gray
const BG_COLOR: [number, number, number] = [25, 0, 25];
const BG_CODE = useGray ? "" : `\x1b[48;2;${BG_COLOR[0]};${BG_COLOR[1]};${BG_COLOR[2]}m`;

// Precompute gradient colors
const gradientColors: string[] = Array.from({ length: gradient.length }, (_, i) => {
  if (useGray) return gradient[i];
  const h = i / (gradient.length - 1);
  const v = 1 - h;
  const [r, g, b] = hsv2rgb(h, 1, v);
  return `${BG_CODE}\x1b[38;2;${r};${g};${b}m${gradient[i]}\x1b[0m`;
});

// Screen coordinates
let width = 0, height = 0, aspect = 0;
let xValues: Float64Array = new Float64Array(0);
let yValues: Float64Array = new Float64Array(0);

function computeCoordinates() {
  const halfW = width / 2;
  const halfH = height / 2;
  if (xValues.length !== width) xValues = new Float64Array(width);
  if (yValues.length !== height) yValues = new Float64Array(height);

  const invZoom = 1 / zoom;
  for (let x = 0; x < width; x++) {
    xValues[x] = ((x - halfW) / halfW) * invZoom * aspect + centerX;
  }
  for (let y = 0; y < height; y++) {
    yValues[y] = ((y - halfH) / halfH) * invZoom + centerY;
  }
}

function mandelbrot(x: number, y: number): number {
  let zx = 0, zy = 0, n = 0;
  while (zx * zx + zy * zy < 4 && n < maxIterations) {
    const zx2 = zx * zx - zy * zy + x;
    zy = 2 * zx * zy + y;
    zx = zx2;
    n++;
  }
  return n;
}

function hsv2rgb(h: number, s: number, v: number): [number, number, number] {
  const i = (h * 6) | 0;
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const map = (vals: number[]) => vals.map(x => (x * 255) | 0) as [number, number, number];
  switch (i % 6) {
    case 0: return map([v, t, p]);
    case 1: return map([q, v, p]);
    case 2: return map([p, v, t]);
    case 3: return map([p, q, v]);
    case 4: return map([t, p, v]);
    case 5: return map([v, p, q]);
  }
  return [0, 0, 0];
}

const lineBuffer: string[] = [];

function render() {
  width = process.stdout.columns || 80;
  height = process.stdout.rows - 2 || 24;
  aspect = (width / height) * charAspect;
  computeCoordinates();

  lineBuffer.length = width;
  let frame = "";

  for (let y = 0; y < height; y++) {
    const py = yValues[y];
    for (let x = 0; x < width; x++) {
      const px = xValues[x];
      const iter = mandelbrot(px, py);
      const idx = (iter * (gradient.length - 1) / maxIterations) | 0;
      lineBuffer[x] = gradientColors[idx];
    }
    frame += lineBuffer.join("") + "\n";
  }

  process.stdout.write(`\x1b[H${frame}`);
  console.log(`Zoom: ${zoom.toFixed(2)}, Center: (${centerX.toFixed(4)}, ${centerY.toFixed(4)}), arrow keys: pan, Z/X: zoom, Ctrl+C: exit.`);
}

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on("keypress", (_, key) => {
  if (key.ctrl && key.name === "c") process.exit();

  if (key.name === "left") centerX -= panSpeed / zoom;
  if (key.name === "right") centerX += panSpeed / zoom;
  if (key.name === "up") centerY -= panSpeed / zoom;
  if (key.name === "down") centerY += panSpeed / zoom;

  if (key.name === "z") zoom *= zoomFactor;
  if (key.name === "x") zoom /= zoomFactor;

  render();
});

process.stdout.on("resize", render);

// Move cursor to top-left and clear screen
process.stdout.write("\x1b[2J\x1b[H");
render();
