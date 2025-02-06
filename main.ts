import CanvasImage from "./lib/CanvasImage";
import fs from 'node:fs';

function printImage(path: string): void {
  const file = fs.readFileSync(path);
  const canvasImage = new CanvasImage(new Uint8Array(file));
  const badCanvas = canvasImage.toBadCanvas();

  console.log(badCanvas.render());
}


printImage('./firefox.jpg');
