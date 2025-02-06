export function padLeft(value: number, length: number) {
  const raw = value.toString();
  if (raw.length > length) {
    throw new Error(
      `Attempting to pad a value too large. Received value ${value} with desired length ${length}`,
    );
  }
  if (raw.length === length) {
    return raw;
  }

  let padded = "";
  for (let i = 0; i < length - raw.length; i++) {
    padded += "0";
  }
  return `${padded}${raw}`;
}
