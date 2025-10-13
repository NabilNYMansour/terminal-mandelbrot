# Terminal Mandelbrot
![Mandelbrot set on the terminal](https://github.com/user-attachments/assets/b650329a-3808-457e-afad-9e04cb68bf0d)

Interactive Mandelbrot fractal explorer for your terminal — written in TypeScript and powered by tsx.
Pan, zoom, and explore the Mandelbrot set directly from your command line.

Checkout how I made it here: https://www.youtube.com/watch?v=ZxorPDD1niY

### Quick Start

Run instantly with npx (no install needed):
```bash
npx terminal-mandelbrot
```

Or install locally:
``` bash
git clone https://github.com/NabilNYMansour/terminal-mandelbrot.git
cd terminal-mandelbrot
pnpm install
pnpm start
```

(Optional) Install globally:
```bash
npm install -g terminal-mandelbrot
terminal-mandelbrot
```

## Controls
| Key           | Action   |
| ------------- | -------- |
| ← / → / ↑ / ↓ | Pan      |
| Z             | Zoom in  |
| X             | Zoom out |
| Ctrl+C        | Exit     |

## Requirements

Node.js 20 or newer (checked at startup)

POSIX-like terminal (macOS, Linux, or WSL)

## Features

Real-time ASCII rendering

Smooth pan and zoom controls

Auto-resize with terminal window

Clean, dependency-light TypeScript implementation

## License
MIT © Nabil Mansour
