import CanvasImage from "./lib/CanvasImage";
import fs from 'node:fs';
import { decodeJPEG } from "./lib/utils/decoders";

function printImage(path: string): void {
  const jpegData = fs.readFileSync(path);
  const rawImageData = decodeJPEG(new Uint8Array(jpegData), { useTArray: true });
  const { data, width, height } = rawImageData;

  const canvasImage = new CanvasImage(data, width, height);
  const badCanvas = canvasImage.toBadCanvas();

  console.log(badCanvas.toColourGrid());
}


printImage('./firefox.jpg');
