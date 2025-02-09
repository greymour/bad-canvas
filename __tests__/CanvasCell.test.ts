import { test, expect } from 'vitest';
import CanvasCell from '../lib/CanvasCell';

test('constructor', () => {
  const c1 = new CanvasCell({});
  // @ts-expect-error testing private field
  expect(c1.r).toEqual(255);
  // @ts-expect-error testing private field
  expect(c1.g).toEqual(255);
  // @ts-expect-error testing private field
  expect(c1.b).toEqual(255);
  // @ts-expect-error testing private field
  expect(c1.char).toEqual('█');

  const c2 = new CanvasCell({ r: 1, g: 20, b: 240, char: 'A' });
  // @ts-expect-error testing private field
  expect(c2.r).toEqual(1);
  // @ts-expect-error testing private field
  expect(c2.g).toEqual(20);
  // @ts-expect-error testing private field
  expect(c2.b).toEqual(240);
  // @ts-expect-error testing private field
  expect(c2.char).toEqual('A');

  expect(() => new CanvasCell({ r: 300 })).toThrow();
  expect(() => new CanvasCell({ g: -5 })).toThrow();
});
