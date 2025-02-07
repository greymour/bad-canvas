import CanvasCell, { CanvasCellArgs } from "./CanvasCell";
import Matrix from "./utils/Matrix";

export default class BadCanvas {
  public readonly width: number;

  public readonly height: number;
  private matrix: Matrix<CanvasCell>;

  constructor(width: number, height: number, defaults: CanvasCellArgs = { r: 0, g: 0, b: 0, a: 1, char: '█' }) {
    this.width = width;
    this.height = height;
    this.matrix = new Matrix<CanvasCell>(Array(height).fill(undefined).map(() =>
      Array(width).fill(undefined).map(() => new CanvasCell(defaults))),
      width,
      height,
    );
  }

  cellAt(x: number, y: number) {
    return this.matrix.cellAt(x, y);
  }

  toString() {
    return this.matrix.flatMap((row) =>
      row.map((cell) => cell.toString()).join(", ")
    ).join("\n");
  }

  render() {
    return this.matrix.data.map((row) =>
      row.map((cell) => cell.toColourBlock()).join("")
    ).join("\n");
  }

  getRows(): Matrix<CanvasCell> {
    return this.matrix;
  }

  *[Symbol.iterator]() {
    for (const cell of this.matrix) {
      yield cell;
    }
  }
}
