# Bad Canvas
A zero-dependency library for making images and displaying them on the command line. Requires terminal support for ANSI true colour.

## A note on spelling
Every instance of the word `colour` is spelled with a U, like nature intended.

## Making art
Either pull this repo directly and run the demo in `main.ts`, or simply import the `BadCanvas` class and start drawing!
```typescript
import { BadCanvas } from 'bad-canvas';

// Create the initial canvas and give it a yellow background
// This uses the default character `█` to fill in the cells
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
BadCanvas can also load images from a file and transform them into pixel art using the `CanvasImage` class. This works for any image type that can be expressed using 256-bit RGB colours.

The `CanvasImage` class requires three arguments:
- The raw image data as a `Uint8Array`
- A `Decoder` function that transforms the raw binary data into a format that can then be used to reconstruct the image's pixels
- An `Extractor` function that parses the decoded image data into objects containing each pixel's RGB values

Here's an example of handling JPEGs using the [`jpeg-js`](https://www.npmjs.com/package/jpeg-js) library:

```typescript
import * as fs from 'node:fs';
import jpeg from 'jpeg-js';
import { CanvasImage } from 'bad-canvas';
import type { ImageData, Decoder, Extractor } from 'bad-canvas';

const file = fs.readFileSync('./cool-jpg.jpg');

type JPEGData = ImageData<{
    exifBuffer?: Uint8Array;
}>

// JPEGData is now a type that looks like this:
// {
//   width: number;
//   height: number;
//   data: Uint8Array;
//   exifBuffer?: Uint8Array;
// }

const decodeJPEG: Decoder<JPEGData> = (buf: Uint8Array) => jpeg.decode(buf, { useTArray: true });

const extractFromJPEG: Extractor = (row) => {
  const pixelRow: RGBPixel[] = [];

  // the data here has the pattern [r, g, b, a, r, g, b, a], so grab the data in groups of 4 and ignore the
  // alpha channel
  for (let i = 0; i < row.length; i += 4) {
    pixelRow.push({
      r: row[i],
      g: row[i + 1],
      b: row[i + 2],
    });
  }

  return pixelRow;
}

const canvasImage = new CanvasImage(new Uint8Array(file), decodeJPEG, extractFromJPEG);

const badCanvas = canvasImage.toBadCanvas();

console.log(badCanvas.toColourGrid());
```
### Correcting for font size
In most terminals the font being used will be taller than it is wide, which will distort the image and make it look stretched vertically. To compensate for this, the `CanvasImage` class accepts a `correctionFactor` value which is a tuple representing a fraction. The `CanvasImage` will attempt to interpolate pixels horizontally to offset the vertical distortion based on this value. If your image doesn't look quite right, play with the `correctionFactor`. In a terminal displaying the font `MartianMono Nerd Font Mono` at a size of `16px`, the default ratio `[5 / 3]` works quite well.
