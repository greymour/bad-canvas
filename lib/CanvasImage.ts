import Canvas from "./Canvas";
import { Decoder, Extractor } from "./utils/decoders";
import Matrix from "./utils/Matrix";
import { RGBPixel, Ratio } from "./utils/types";

export default class CanvasImage<ImageType> {
  private matrix: Matrix<RGBPixel>;
  public width: number;
  public height: number;
  // numerator is width, denominator is height
  private readonly correctionFactorRatio: Ratio;
  private readonly correctionFactor: number;

  constructor(imageFile: Uint8Array, decoder: Decoder<ImageType>, extractor: Extractor, correctionFactor: Ratio = [1, 1]) {
    if (correctionFactor[1] <= 0) {
      throw new Error(`Received invalid correctionFactor denominator for CanvasImage constructor: ${correctionFactor}. \`correctionFactor\` must be greater than 0.`);
    }
    this.correctionFactorRatio = correctionFactor;
    this.correctionFactor = this.correctionFactorRatio[0] / this.correctionFactorRatio[1];
    if (Number.isNaN(this.correctionFactor)) {
      throw new Error('Could not calculate correction factor for supplied ratio value.');
    }
    // the correctionFactor value attempts to address terminal fonts being taller than they are wide, and interpolates
    // every nth pixel, where n is the closest integer value to the `correctionFactor`.
    const { data, width, height } = decoder(imageFile);

    if (width <= 0) {
      throw new Error(`Received invalid width for CanvasImage constructor: ${width}. \`width\` must be greater than 0.`);
    } else if (height <= 0) {
      throw new Error(`Received invalid height for CanvasImage constructor: ${height}. \`Height\` must be greater than 0.`);
    }

    if (this.correctionFactor !== 0) {
      this.width = Math.round(width * this.correctionFactor);
    } else {
      this.width = width;
    }
    this.height = height;

    const pixelMatrix = Matrix.fromArray(data, height).map((row) => {
      // can safely assert the type here since the rows in the intermediate Matrix are guaranteed to be Uint8Arrays
      const pixelRow = extractor(row as unknown as Uint8Array);

      if (this.correctionFactor !== 1) {
        this.correctRow(pixelRow, width);
      }

      if (pixelRow.length !== this.width) {
        throw new Error(`Row wrong size, expected ${this.width} got ${pixelRow.length}`);
      }
      return pixelRow;
    });
    this.matrix = pixelMatrix;
  }

  correctRow(pixelRow: RGBPixel[], originalWidth: number) {
    const dif = this.width - originalWidth;
    const bigStep = Math.round(this.correctionFactor);
    if (bigStep === 1) {
      return;
    }
    let smallStep = Math.floor(this.correctionFactor);

    let lastStep = bigStep;
    let i = 0;
    let insertCount = 0;
    const limit = Math.floor(dif / 2);
    // insert first at the beginning, then from the end
    // do this in two separate loops because otherwise the indexing gets crazy borked
    while (insertCount <= limit) {
      if (lastStep === smallStep && i % bigStep === 0) {
        pixelRow.splice(i, 0, { ...pixelRow[i] });
        lastStep = bigStep;
        i += bigStep + 1;
        insertCount++;
      } else if (lastStep === bigStep && i % smallStep === 0) {
        pixelRow.splice(i, 0, { ...pixelRow[i] });
        lastStep = smallStep;
        i += smallStep;
        insertCount++;
      } else {
        i++;
      }
    }

    i = pixelRow.length - 1;
    while (insertCount < dif) {
      if (lastStep === smallStep && i % bigStep === 0) {
        pixelRow.splice(i, 0, { ...pixelRow[i] });
        lastStep = bigStep;
        i -= bigStep + 1;
        insertCount++;
      } else if (lastStep === bigStep && i % smallStep === 0) {
        pixelRow.splice(i, 0, { ...pixelRow[i] });
        lastStep = smallStep;
        i -= smallStep;
        insertCount++;
      } else {
        i--;
      }
    }
  }

  toCanvas(): Canvas {
    const canvas = new Canvas(this.width, this.height);

    for (let colIdx = 0; colIdx < this.height; colIdx++) {
      for (let rowIdx = 0; rowIdx < this.width; rowIdx++) {
        const cell = canvas.cellAt(rowIdx, colIdx);
        const pixel = this.matrix.cellAt(rowIdx, colIdx);
        if (!cell || !pixel) {
          throw new Error(`Mismatch between canvas and matrix dimensions, this indicates a serious regression. cell: ${cell} pixel: ${pixel}`);
        }
        cell.paint(pixel);
      }
    }
    return canvas;
  }
}
