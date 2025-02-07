# Bad Canvas
A WIP library for making images and displaying them on the command line. Requires terminal support for ANSI true colour.

## A note on spelling
Every instance of the word `colour` is spelled with a U, like nature intended.

## Making art
Either pull this repo directly and run the demo in `main.ts`, or simply import the `BadCanvas` class and start drawing!
```typescript
import { BadCanvas } from 'bad-canvas';

// create the initial canvas and give it a yellow background
// this is using the default character `█` to fill in the cells
const badCanvas = new BadCanvas(5, 4, {
  r: 255,
  g: 213,
  b: 40,
});

// define a list of coordinates that we want to colour black
const coords = [
  [1, 1],
  [3, 1],
  [0, 2],
  [4, 2],
  [1, 3],
  [2, 3],
  [3, 3],
];

// draw a smile!
coords.forEach(([x, y]) => badCanvas.cellAt(x, y).setColours({
  r: 0,
  g: 0,
  b: 0,
}));
console.log(badCanvas.render());
```

## Loading real images
BadCanvas can also load images from a file and transform them into pixel art. Currently only supports JPEGs.
```typescript
import { CanvasImage } from 'bad-canvas';
import fs from 'node:fs';

const file = fs.readFileSync('./cool-jpg.jpg');

const canvasImage = new CanvasImage(new Uint8Array(file));

const badCanvas = canvasImage.toBadCanvas();

console.log(badCanvas.toColourGrid());
```
### Correcting for font size
In most terminals the font being used will be taller than it is wide, which will distort the image and make it look stretched vertically. To compensate for this, the `CanvasImage` class accepts a `correctionFactor` value which is a tuple representing a fraction. The `CanvasImage` will attempt to interpolate pixels horizontally to offset the vertical distortion based on this value. If your image doesn't look quite right, play with the `correctionFactor`. In a terminal displaying the font `MartianMono Nerd Font Mono` at a size of `16px`, the default ratio `[5 / 3]` works quite well.
