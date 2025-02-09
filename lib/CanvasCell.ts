import { rgbToAnsiTrueColourBG, rgbToAnsiTrueColourFG } from "./utils/colours";
import { RGBPixel } from "./utils/types";

type ColourKey = keyof RGBPixel;

const COLOUR_KEYS: ColourKey[] = ["r", "g", "b"] as const;

function isColourKey(key: string): key is ColourKey {
  // @ts-expect-error checking for a string in a list of constants, Array.prototype.includes() is so strict
  return COLOUR_KEYS.includes(key);
}

export type CanvasCellArgs = RGBPixel & {
  char?: string;
}

// Using RGBA for colour values. I guess I could let users pick their colour profile in the future
export default class CanvasCell {
  private r: number;

  private g: number;

  private b: number;

  private char: string;

  // default to white
  constructor({ r = 255, g = 255, b = 255, char = '█' }: Partial<CanvasCellArgs>) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.char = char;
  }

  paint(colours: Partial<RGBPixel>): CanvasCell {
    for (const key in colours) {
      if (!isColourKey(key)) {
        continue;
      }
      const colourValue = colours[key];
      if (typeof colourValue !== "number") {
        throw new Error(
          `Received value of incorrect type when setting colours. Expected type number, received type ${typeof colourValue}`,
        );
      }

      if (colourValue < 0 || colourValue > 255) {
        throw new Error(
          `Attempting to set colour of key ${key} to an invalid value: ${colourValue}. Value must be in the range 0 <= x <= 255`,
        );
      }
      this[key] = colours[key]!;
    }
    return this;
  }

  setChar(char: string) {
    this.char = char;
  }

  copy(): CanvasCell {
    return new CanvasCell({
      r: this.r,
      g: this.g,
      b: this.b,
      char: this.char
    });
  }

  private pad(val: number) {
    return val.toString().padStart(3, '0')

  }

  toString(): string {
    return `{${this.pad(this.r)},${this.pad(this.g)},${this.pad(this.b)}}`;
  }

  toColourBlock(): string {
    if (this.char === ' ') {
      return `${rgbToAnsiTrueColourBG(this.r, this.g, this.b)}${this.char}\x1b[0m`;
    } else {
      return `${rgbToAnsiTrueColourFG(this.r, this.g, this.b)}${this.char}\x1b[0m`;
    }
  }
}
