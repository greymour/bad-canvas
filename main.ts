import CanvasImage from "./lib/CanvasImage";
import * as fs from 'node:fs';
import path from 'path';
import { Fraction } from "./lib/utils/types";
import { BadCanvas } from "./lib";
import { isFraction } from "./lib/utils/types";
import { decodeJPEG } from "./lib/utils/decoders";
import { extractFromJPEG } from "./lib/utils/decoders";

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
coords.forEach(([x, y]) => badCanvas.cellAt(x, y).setColours({
  r: 0,
  g: 0,
  b: 0,
}));

console.log(badCanvas.render());
