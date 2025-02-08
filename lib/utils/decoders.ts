import jpeg from 'jpeg-js';
import { RGBPixel } from './types';

export type ImageData<T = {}> = T & {
  width: number;
  height: number;
  data: Uint8Array;
}

export type Decoder<T> = (buf: Uint8Array) => ImageData<T>;

// a callback function that extracts pixel values from one row of image data
export type Extractor = (data: Uint8Array) => RGBPixel[];

export type JPEGData = ImageData<{
  exifBuffer?: Uint8Array;
}>;

// jpeg.decode() expects a `Buffer`, not a plain `Uint8Array`, but it works just fine (lol, lmao even)
// doing this for cross-platform compat (*cough* Deno) until I write my own decoder
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
