import { test, expect } from 'vitest';
import { isRatio } from '../../lib/utils/types';

test('isRatio type predicate', () => {
  expect(isRatio([])).toEqual(false);
  expect(isRatio([1])).toEqual(false);
  expect(isRatio([1, 2])).toEqual(true);
  expect(isRatio([1, 2, 3])).toEqual(false);
  expect(isRatio(['1', '2'])).toEqual(false);
  expect(isRatio([[1], [2]])).toEqual(false);
});
