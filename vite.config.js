/* global __dirname */
import { resolve } from 'path';
import { defineConfig } from 'vite';
import pkg from './package.json';

import StringReplace from 'vite-plugin-string-replace';
import banner from 'vite-plugin-banner';
import { userScriptHeader } from './config/userScriptHeader.js';

import Writer from 'vite-plugin-create-file';

const search = 'my-app';
const replace = 'l3-' + ('' + Math.random()).slice(2, 6);

export default defineConfig({
  build: {
    target: 'es2015', // esnext
    rollupOptions: {
      input: {
        main: '@/index.js',
      },
      output: {
        format: 'iife',
        dir: './dist',
        entryFileNames: (entry) => {
          let out = pkg.name + ('main' === entry.name ? '.user' : '.meta');
          return `${out}.js`;
        },
      },
    },
  },

  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
    ],
  },

  plugins: [
    // babel(),
    banner({
      content: userScriptHeader,
      outDir: './dist',
      verify: false,
    }),
    StringReplace([
      {
        search,
        replace,
      },
    ]),
    Writer([
      {
        // outDir: './dist',
        content: () => userScriptHeader,
        filename: pkg.name + '.meta.js',
      },
      // {
      //   outDir: './dist',
      //   content: userScriptHeader,
      //   filename: pkg.name + '.meta2.js',
      // },
    ]),
  ],
});
