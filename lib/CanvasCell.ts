import { rgbToAnsiTrueColorBG, rgbToAnsiTrueColorFG } from "./utils/colours";
import { padLeft } from "./utils/numbers";

const COLOUR_KEYS = ["r", "g", "b", "a"] as const;
type ColourKey = typeof COLOUR_KEYS[number];
type ColourRecord = Record<ColourKey, number>;

function isColourKey(key: string): key is ColourKey {
  // @ts-expect-error checking for a string in a list of constants, Array.prototype.includes() is so strict
  return COLOUR_KEYS.includes(key);
}

// Using RGBA for colour values. I guess I could let users pick their colour profile in the future
export default class CanvasCell {
  private r: number;

  private g: number;

  private b: number;

  private a: number;

  private char: string;

  // default to black at full opacity
  constructor(r = 0, g = 0, b = 0, a = 1, char = '█') {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.char = char;
  }

  setColours(colours: Partial<ColourRecord>): CanvasCell {
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

  copy(): CanvasCell {
    return new CanvasCell(this.r, this.g, this.b, this.a);
  }

  toString(): string {
    const pad = (val: number) => padLeft(val, 3);
    return `{${pad(this.r)},${pad(this.g)},${pad(this.b)},${this.a}}`;
  }

  toColourBlock(): string {
    if (this.char === ' ') {
      return `${rgbToAnsiTrueColorBG(this.r, this.g, this.b)}${this.char}\x1b[0m`;
    } else {
      return `${rgbToAnsiTrueColorFG(this.r, this.g, this.b)}${this.char}\x1b[0m`;
    }
  }
}
