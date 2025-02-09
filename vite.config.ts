import { ConfigEnv, defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }: ConfigEnv) => {
  return {
    build: {
      watch: mode === 'production' ? undefined : {
        include: 'lib/**',
      },
      lib: {
        entry: resolve(__dirname, 'lib/index.ts'),
        name: 'Pointillism',
        fileName: 'index',
      },
      minify: 'esbuild' as 'esbuild', // getting type errors without this ???, I love TypeScript
      reportCompressedSize: true,
    },
    esbuild: {
      keepNames: true,
    },
  }
});
