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
        name: 'Bad Canvas',
        fileName: 'index',
      },
      minify: 'esbuild',
      reportCompressedSize: true,
    },
    esbuild: {
      keepNames: true,
    },
  }
});
