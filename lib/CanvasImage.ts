import BadCanvas from "./BadCanvas";
import { decodeJPEG } from "./utils/decoders";
import Matrix from "./utils/Matrix";

type Uint8 = Uint8Array[number]; // making this its own type so I don't forget these are 8 bit ints
type RGBAPixel = {
  r: Uint8;
  b: Uint8;
  g: Uint8;
  a: Uint8;
};

export default class CanvasImage {
  private matrix: Matrix<RGBAPixel>;
  public width: number;
  public height: number;

  constructor(imageFile: Uint8Array) {
    const rawImageData = decodeJPEG(imageFile, { useTArray: true });
    const { data, width, height } = rawImageData;

    if (width <= 0) {
      throw new Error(`Received invalid width for CanvasImage constructor: ${width}. Width must be greater than 0.`);
    } else if (height <= 0) {
      throw new Error(`Received invalid height for CanvasImage constructor: ${height}. Height must be greater than 0.`);
    } else {
      const pixelMatrix = Matrix.fromArray(data, width * 4, height).map((row) => {
        const pixelRow = [];

        for (let i = 0; i < row.length; i += 4) {
          pixelRow.push({
            r: row[i],
            g: row[i + 1],
            b: row[i + 2],
            a: 0,
          } satisfies RGBAPixel);
        }
        return pixelRow;
      });
      this.matrix = pixelMatrix;
    }
    this.width = width;
    this.height = height;
  }

  toBadCanvas(): BadCanvas {
    const canvas = new BadCanvas(this.width, this.height);

    for (let colIdx = 0; colIdx < this.height; colIdx++) {
      for (let rowIdx = 0; rowIdx < this.width; rowIdx++) {
        const cell = canvas.cellAt(rowIdx, colIdx);
        const pixel = this.matrix.cellAt(rowIdx, colIdx);
        cell?.setColours(pixel);
      }
    }
    return canvas;
  }
}
