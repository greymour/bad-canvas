# Pointillism
A zero-dependency library for making ASCII art, inspired by the Pointillist art movement.
> "Pointillism (/ˈpwæ̃tɪlɪzəm/, also US: /ˈpwɑːn-ˌ ˈpɔɪn-/) is a technique of painting in which small, distinct dots of color are applied in patterns to form an image."
> - [Wikipedia](https://en.wikipedia.org/wiki/Pointillism)

Requires terminal support for ANSI true colour when used on the command line.

## A note on spelling
Every instance of the word `colour` is spelled with a U, like nature intended.

## Making art
Install the package, import the `Canvas` class, and start painting!
```typescript
import { Canvas } from 'pointillism';

// Create the initial canvas and give it a yellow background
// This uses the default character `█` to fill in the cells
const canvas = new Canvas(5, 4, {
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

// paint a smile!
coords.forEach(([x, y]) => canvas.cellAt(x, y)?.paint({
  r: 0,
  g: 0,
  b: 0,
}));

// The Canvas.render() method returns a string with each row separated by a newline character
console.log(canvas.render());
```

## Loading real images
Pointillism can also load images from a file and transform them into pixel art using the `CanvasImage` class. This works for any image type that can be expressed using 256-bit RGB colours.

The `CanvasImage` class takes four arguments:
- The raw image data as a `Uint8Array`
- A `Decoder` function that transforms the raw binary data into a format that can then be used to reconstruct the image's pixels.
- An `Extractor` function that parses the decoded image data into objects containing each pixel's RGB values.
- An optional `correctionFactor` which is a tuple representing the ratio of how many horizontal characters equal one vertical character in total area.

Here's an example of handling JPEGs using the [`jpeg-js`](https://www.npmjs.com/package/jpeg-js) library:

```typescript
import * as fs from 'node:fs';
import jpeg from 'jpeg-js';
import { CanvasImage } from 'pointillism';
import type { ImageData, Decoder, Extractor } from 'pointillism';

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

const canvasImage = new CanvasImage(new Uint8Array(file), decodeJPEG, extractFromJPEG, [5/3]);

const canvas = canvasImage.toCanvas();

console.log(canvas.toColourGrid());
```
### Correcting for font size
In most terminals the font being used will be taller than it is wide, which will distort the image and make it look stretched vertically. To compensate for this, the `CanvasImage` class accepts a `correctionFactor` value which is a tuple representing the ratio of how many horizontal characters equal one vertical character in total area. The `CanvasImage` will attempt to interpolate pixels horizontally to offset the vertical distortion based on this value. If your image doesn't look quite right, play with the `correctionFactor`. In a terminal displaying the font `MartianMono Nerd Font Mono` at a size of `16px`, a 5:3 ratio (expressed as `[5,3]`) works quite well.
