# Bad Canvas
A WIP library for displaying images on the command line. Currently only supports JPEGs.

```typescript
import { CanvasImage } from 'bad-canvas';
import fs from 'node:fs';

const file = fs.readFileSync('./cool-jpg.jpg');

const canvasImage = new CanvasImage(new Uint8Array(file));

const badCanvas = canvasImage.toBadCanvas();

console.log(badCanvas.toColourGrid());
```

<img width="670" alt="The Firefox logo being printed to a terminal" src="https://github.com/user-attachments/assets/3a44203e-e2a4-4144-b69a-18ef9ab19b83" />
