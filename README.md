# Terminal Mandelbrot

Interactive Mandelbrot fractal explorer that runs in your terminal. Written in TypeScript and powered by `tsx`, this small CLI program renders an ASCII approximation of the Mandelbrot set and lets you pan and zoom in real time.

## Features

- Fast, dependency-light TypeScript implementation
- Keyboard controls for panning and zooming
- Aspect correction for better-looking ASCII output
- Configurable parameters in `index.ts` (zoom, pan speed, iterations, gradient)

## Requirements

- Node.js 20 or newer (the program checks this at startup)
- A POSIX-like terminal (Linux, macOS, or WSL on Windows) with TTY support
- `tsx` is used to run the TypeScript entrypoint; the project already depends on it in `package.json`

## Installation

Clone the repository and install dependencies with your package manager of choice. The project includes a `pnpm-lock.yaml` so `pnpm` is recommended, but `npm`/`yarn` work too.

```bash
git clone https://github.com/NabilNYMansour/terminal-mandelbrot.git
cd terminal-mandelbrot
pnpm install
```

Or with npm:

```bash
npm install
```

You can run directly with the included script or install the CLI globally:

```bash
pnpm start
# or
npx tsx index.ts

# to install globally (optional)
npm install -g .
# then run as
terminal-mandelbrot
```

## Usage

Run the program in a terminal. It will draw the fractal and print a small help line with the current zoom and center.

Controls

- Left/Right/Up/Down arrows — pan the view
- Z — zoom in
- X — zoom out
- Ctrl+C — exit

The current zoom level and center coordinates are shown in the status line.

## How it works (brief)

The program maps each terminal character cell to a point in the complex plane, iterates the Mandelbrot recurrence z <- z^2 + c up to `maxIterations`, and chooses a character from a gradient string based on the escape time. A `charAspect` correction compensates for non-square character cells so the fractal looks correct in typical terminals.

Core parameters are defined at the top of `index.ts`:

- `gradient` — string of characters used to represent iteration density
- `maxIterations` — iteration cutoff for escape time
- `charAspect` — aspect ratio correction value
- `panSpeed` / `zoomFactor` — control interaction sensitivity

Edit these values to tweak rendering quality and responsiveness.

## Performance tips

- Reduce the terminal width/height to render faster (resize the window)
- Lower `maxIterations` to speed up rendering at the cost of detail
- Increase `charAspect` or change `gradient` to tune visual appearance

## Troubleshooting

- If you see an error about Node.js version, make sure `node --version` is 20.x or higher.
- If keyboard input doesn't work, ensure you're running in a TTY (not piping stdin) and your terminal emulator supports raw mode.
- On Windows, run inside WSL or use a terminal that supports POSIX-style input; behavior may vary on native Windows shells.

## Contributing

Contributions are welcome. Open issues or PRs on the repository. Small, focused changes (typo fixes, small performance tweaks, or configuration options) are easiest to review.

## License

This project is licensed under the MIT License — see `package.json` for author and license information.

---

If you'd like, I can add color support, a configuration file, or package the CLI for npm publishing. Tell me which improvement you'd like next.
