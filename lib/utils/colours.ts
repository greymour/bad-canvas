export function rgbToAnsiTrueColorFG(r: number, g: number, b: number) {
  return `\x1b[38;2;${r};${g};${b}m`;
}

export function rgbToAnsiTrueColorBG(r: number, g: number, b: number) {
  return `\x1b[48;2;${r};${g};${b}m`;
}
