import jpeg from 'jpeg-js';

export type JPEGData = {
  width: number;
  height: number;
  exifBuffer?: unknown;
  data: Uint8Array;
}

type DecodeJPEGOptions = Parameters<typeof jpeg['decode']>[1];

export function decodeJPEG(buf: Uint8Array, options?: DecodeJPEGOptions): JPEGData {
  const opts = options ? { ...options, useTArray: true } : { useTArray: true };
  // jpeg.decode() expects a `Buffer`, not a plain `Uint8Array`, but it works just fine (lol, lmao even)
  // doing this for cross-platform compat (*cough* Deno) until I write my own decoder
  return jpeg.decode(buf, opts) as JPEGData;
}
