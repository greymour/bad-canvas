import { test, expect } from 'vitest';
import Matrix from '../../lib/utils/Matrix';

test('Matrix computes size correctly', () => {
  const m = new Matrix([[1, 2, 3], [4, 5, 6]], 3, 2);
  expect(m.size).toEqual(6);
});

test('Matrix.fromArray generates a Matrix of the correct dimensions and size', () => {
  // this should create the following matrix:
  // [ [1, 2],
  //   [3, 4],
  //   [5, 6],
  //   [7, 8],
  // ]
  const m = Matrix.fromArray([1, 2, 3, 4, 5, 6, 7, 8], 4);
  expect(m.width).toEqual(2);
  expect(m.height).toEqual(4);
  expect(m.size).toEqual(8);
});

test('cellAt util method', () => {
  const m = Matrix.fromArray([1, 2, 3, 4], 2);
  expect(m.cellAt(0, 0)).toEqual(1);
  expect(m.cellAt(0, 0)).toEqual(m.data[0][0]);
  expect(m.cellAt(1, 1)).toEqual(4);
  expect(m.cellAt(1, 1)).toEqual(m.data[1][1]);
  expect(m.cellAt(0, 1)).toEqual(m.data[1][0]);
  expect(m.cellAt(5, 5)).toBeNull();
});

test('flatMap creates a one-dimensional array from matrix data', () => {
  const m = Matrix.fromArray([1, 2, 3, 4, 5, 6], 3);
  expect(m.width).toEqual(2);
  expect(m.height).toEqual(3);
  expect(m.flatMap(row => row.join('-'))).toEqual(['1-2', '3-4', '5-6']);
});

test('*[Symbol.iterator]() is implemented correctly', () => {
  const m = Matrix.fromArray([0, 1, 2, 3, 4, 5, 6, 7, 8], 3);
  let i = 0;

  for (const cell of m) {
    expect(cell).toEqual(i);
    i++;
  }
});

test('Mutations to reference types in the matrix affect objects in source data', () => {
  const testData: Record<string, number | string>[] = [{ val: 0 }, { val: 1 }, { val: 2 }, { val: 3 }];
  const m = Matrix.fromArray(testData, 2);

  m.cellAt(0, 0)!.val = 'no copying';

  expect(testData[0]).toEqual({ val: 'no copying' });
});
