#!/usr/bin/env tsx

import * as readline from "readline";

const gradient = " _.-,=+:;cba!?0123456789$W#@";
const maxIterations = 1000;
const charAspect = 0.5;

let zoom = 1.0;
let centerX = -0.5;
let centerY = 0.0;

const panSpeed = 0.1;
const zoomFactor = 1.2;

class Complex {
  real: number;
  imag: number;

  constructor(real: number, imag: number) {
    this.real = real;
    this.imag = imag;
  }

  magnitude(): number {
    // Use squared magnitude for performance
    return this.real * this.real + this.imag * this.imag;
  }

  square(): void {
    const real = this.real * this.real - this.imag * this.imag;
    const imag = 2 * this.real * this.imag;
    this.real = real;
    this.imag = imag;
  }

  add(real: number, imag: number): void {
    this.real += real;
    this.imag += imag;
  }
}

function mandelbrot(x: number, y: number): number {
  let n = 0;
  const z = new Complex(0, 0);
  while (z.magnitude() < 4 && n < maxIterations) {
    z.square();
    z.add(x, y);
    n++;
  }
  return n;
}

function render() {
  const width = process.stdout.columns || 80;
  const height = process.stdout.rows - 2 || 24;
  const aspect = (width / height) * charAspect;

  console.clear();
  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      // Shift the left corner from (0,0) to (-width/2, -height/2), multiply by aspect ratio and zoom, then shift by desied center
      const mx = ((x - width / 2) / (width / 2) / zoom) * aspect + centerX;
      const my = ((y - height / 2) / (height / 2) / zoom) + centerY;

      const iterations = mandelbrot(mx, my);
      const iterRatio = iterations / maxIterations;

      const char = gradient[Math.floor(iterRatio * (gradient.length - 1))];
      line += char;
    }
    console.log(line);
  }
  console.log(`Zoom: ${zoom.toFixed(2)}, Center: (${centerX.toFixed(4)}, ${centerY.toFixed(4)}), Use arrow keys to pan, Z/X to zoom, Ctrl+C to exit.`);
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

render();
