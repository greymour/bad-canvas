import { RGBPixel } from './types';

export type ImageData<T = {}> = T & {
  width: number;
  height: number;
  data: Uint8Array;
}

export type Decoder<T> = (buf: Uint8Array) => ImageData<T>;

// a callback function that extracts pixel values from one row of image data
export type Extractor = (data: Uint8Array) => RGBPixel[];
