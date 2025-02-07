// random types that need to be shared between files
export type Uint8 = Uint8Array[number]; // making this its own type so I don't forget these are 8 bit ints

export type RGBAPixel = {
  r: Uint8;
  b: Uint8;
  g: Uint8;
  a: Uint8;
};

export type Fraction = [numberator: number, denominator: number];
