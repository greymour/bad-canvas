export default class Matrix<T> {
  public data: T[][];
  public readonly width: number;
  public readonly height: number;
  public size: number;

  constructor(data: T[][], width?: number, height?: number) {
    if (width <= 0 || height <= 0) {
      throw new Error(`Cannot create matrix with the provided dimensions. Received width: ${width} and height: ${height}`);
    }
    if (!data.every(row => Array.isArray(row))) {
      throw new Error('Bad data passed to Matrix constructor. Receieved data with elements that were a mix of arrays and non-array types.');
    }

    this.width = width;
    this.height = height;

    this.data = data as T[][]; // we assume that if the first value in `data` is another array, that everthing is
    this.size = data.reduce((acc, row) => (row.length + acc), 0);
  }

  // it always messes me up doing matrix access, so I have this for my smooth brain
  cellAt(x: number, y: number): T | null {
    return this.data[y]?.[x] || null;
  }

  flatMap<U>(callbackfn: (row: T[], index: number) => U): U[] {
    return this.data.map(callbackfn);
  }

  forEach(callbackfn: (row: T[], index: number) => void): void {
    this.data.forEach(callbackfn);
  }

  map<U>(callbackfn: (row: T[], rowIndex: number) => U[]): Matrix<U> {
    const newData: U[][] = [];
    let idx = 0;
    let width = 0;
    for (const row of this.data) {
      const newRow = callbackfn(row, idx);
      if (newRow.length > width) {
        width = newRow.length;
      }
      newData.push(newRow);
      idx++;
    }
    const newMatrix = new Matrix<U>(newData, width, this.height);
    return newMatrix;
  }

  static fromArray<U extends ArrayLike<unknown>>(data: U, width: number, height: number): Matrix<U[number]> {
    if (width <= 0 || height <= 0) {
      throw new Error(`Cannot create matrix with the provided dimensions. Received width: ${width} and height: ${height}`);
    }
    const matrix = Array(height).fill(undefined).map(() => Array(width).fill(undefined))
    let dataIdx = 0;
    for (let rowIdx = 0; rowIdx < height; rowIdx++) {
      const row = matrix[rowIdx];
      for (let colIdx = 0; colIdx < width; colIdx++) {
        row[colIdx] = data[dataIdx];
        dataIdx++;
      }
    }
    return new Matrix(matrix, width, height);
  }

  *[Symbol.iterator]() {
    for (const row of this.data) {
      for (const cell of row) {
        yield cell;
      }
    }
  }
}
