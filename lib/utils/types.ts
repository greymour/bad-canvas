// random types that need to be shared between files
export type Uint8 = Uint8Array[number]; // making this its own type so I don't forget these are 8 bit ints

export type RGBPixel = Record<'r' | 'g' | 'b', Uint8>
export type RGBAPixel = RGBPixel & {
  a: Uint8;
};

export type Fraction = [numberator: number, denominator: number];

export function isFraction(list: unknown[]): list is Fraction {
  if (list.length !== 2) {
    return false;
  }
  return list.every(val => typeof val === 'number');
}
