import CanvasCell from "./CanvasCell";
import Matrix from "./utils/Matrix";

export default class BadCanvas {
  public readonly width: number;

  public readonly height: number;
  private matrix: Matrix<CanvasCell>;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.matrix = new Matrix<CanvasCell>(Array(height).fill(undefined).map(() =>
      Array(width).fill(undefined).map(() => new CanvasCell())),
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

  toColourGrid() {
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
