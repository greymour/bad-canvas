import { expect, test } from 'vitest';
import { rgbToAnsiTrueColourFG, rgbToAnsiTrueColourBG } from '../../lib/utils/colours';

test('Setting foreground colours works as expected', () => {
  expect(rgbToAnsiTrueColourFG(1, 2, 3)).toEqual('\x1b[38;2;1;2;3m');
});

test('Setting background colours works as expected', () => {
  expect(rgbToAnsiTrueColourBG(4, 5, 6)).toEqual('\x1b[48;2;4;5;6m');
});
