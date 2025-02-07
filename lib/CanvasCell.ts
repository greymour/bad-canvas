import { rgbToAnsiTrueColorBG, rgbToAnsiTrueColorFG } from "./utils/colours";
import { RGBAPixel } from "./utils/types";

type ColourKey = keyof RGBAPixel;

const COLOUR_KEYS: ColourKey[] = ["r", "g", "b", "a"] as const;

function isColourKey(key: string): key is ColourKey {
  // @ts-expect-error checking for a string in a list of constants, Array.prototype.includes() is so strict
  return COLOUR_KEYS.includes(key);
}

export type CanvasCellArgs = RGBAPixel & {
  char?: string;
}

// Using RGBA for colour values. I guess I could let users pick their colour profile in the future
export default class CanvasCell {
  private r: number;

  private g: number;

  private b: number;

  private a: number;

  private char: string;

  // default to black at full opacity
  constructor({ r = 0, g = 0, b = 0, a = 1, char = '█' }: CanvasCellArgs) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.char = char;
  }

  setColours(colours: Partial<RGBAPixel>): CanvasCell {
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
      if (key === "a") {
        if (colourValue < 0 || colourValue > 1) {
          throw new Error(
            `Attempting to set opacity to an invalid value: ${colourValue}. Value must be in the range 0 <= x <= 1.`,
          );
        }
      } else {
        if (colourValue < 0 || colourValue > 255) {
          throw new Error(
            `Attempting to set colour of key ${key} to an invalid value: ${colourValue}. Value must be in the range 0 <= x <= 255`,
          );
        }
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
      a: this.a,
      char: this.char
    });
  }

  private pad(val: number) {
    return val.toString().padStart(3, '0')

  }

  toString(): string {
    return `{${this.pad(this.r)},${this.pad(this.g)},${this.pad(this.b)},${this.a}}`;
  }

  toColourBlock(): string {
    if (this.char === ' ') {
      return `${rgbToAnsiTrueColorBG(this.r, this.g, this.b)}${this.char}\x1b[0m`;
    } else {
      return `${rgbToAnsiTrueColorFG(this.r, this.g, this.b)}${this.char}\x1b[0m`;
    }
  }
}
