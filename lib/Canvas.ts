import CanvasCell, { CanvasCellArgs } from "./CanvasCell";
import Matrix from "./utils/Matrix";

export default class Canvas {
  public readonly width: number;

  public readonly height: number;
  private matrix: Matrix<CanvasCell>;

  constructor(width: number, height: number, defaults: Partial<CanvasCellArgs> = { r: 255, g: 255, b: 255, char: '█' }) {
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

  // Find the cell using the Normal method that more closely matches the underlying array
  cellAtN(rowIdx: number, colIdx: number) {
    return this.matrix.cellAt(colIdx, rowIdx);
  }

  // Find the cell at its visual coordinates - for the artist in all of us
  cellAtVisual(x: number, y: number) {
    return this.matrix.cellAt(x, (this.matrix.height - 1 - y));
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

  toJSON() {
    return this.matrix.map(row => row.map(cell => cell.toJSON()));
  }

  toJSONString() {
    return this.matrix.map(row => row.map(cell => cell.toJSONString()));
  }

  *[Symbol.iterator]() {
    for (const cell of this.matrix) {
      yield cell;
    }
  }
}
