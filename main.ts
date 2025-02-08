import CanvasImage from "./lib/CanvasImage";
import * as fs from 'node:fs';
import * as path from 'path';
import * as jpeg from 'jpeg-js';
import { Fraction } from "./lib/utils/types";
import { BadCanvas } from "./lib";
import { isFraction } from "./lib/utils/types";
import { Decoder, Extractor, ImageData } from "./lib/utils/decoders";
import { RGBPixel } from "./lib/utils/types";

type JPEGData = ImageData<{
  exifBuffer?: Uint8Array;
}>;

// jpeg.decode() expects a `Buffer`, not a plain `Uint8Array`, but it works just fine (lol, lmao even)
// doing this for cross-platform compat (*cough* Deno)
export const decodeJPEG: Decoder<JPEGData> = (buf: Uint8Array) => jpeg.decode(buf, { useTArray: true });

export const extractFromJPEG: Extractor = (row) => {
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

console.clear();
const imagePathArg = process.argv.find((arg) => arg.startsWith('--path'));
let imagePath: string = '';
if (imagePathArg) {
  imagePath = imagePathArg.split('=')[1];
  imagePath = path.join(__dirname, imagePath);
}

const correctionFactorArg = process.argv.find((arg) => arg.startsWith('--cfactor'))
let correctionFactor: Fraction = [5, 3];
if (correctionFactorArg) {
  const rawFactor = correctionFactorArg.split('=')[1]?.trim();
  if (rawFactor) {
    const parsed = rawFactor.split('/').map(val => parseInt(val));
    if (!isFraction(parsed)) {
      throw new Error(`correctionFactor must have the shape 'X/Y', received ${rawFactor}`);
    }
    correctionFactor = parsed;
  }
}

if (imagePath) {
  const file = fs.readFileSync(imagePath);
  const canvasImage = new CanvasImage(new Uint8Array(file), decodeJPEG, extractFromJPEG, correctionFactor as Fraction);
  const bc = canvasImage.toBadCanvas();
  console.log(bc.render());
}


// create the initial canvas and give it a yellow background
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
coords.forEach(([x, y]) => badCanvas.cellAt(x, y)?.setColours({
  r: 0,
  g: 0,
  b: 0,
}));

console.log(badCanvas.render());
