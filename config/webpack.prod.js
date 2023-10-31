/* global require, module */
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const TerserPlugin = require('terser-webpack-plugin');
const BannerPlugin = require('./bannerPlugin');

const settings = require('../package.json');

const search = 'my-app';
const replace = 'l3-' + ('' + Math.random()).slice(2, 6);
// const icon = 'data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MDAgNTAwIiB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMCAwaDUwMHY1MDBoLTUwMHoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtMjUwIDM4N2MtLjYgMC0xLjEgMC0xLjctLjEtNS42LS40LTExLTIuNy0xNS4zLTdsLTEyNS0xMjVjLTQuNy00LjctNy0xMC44LTctMTdzMi4zLTEyLjMgNy0xN2M5LjQtOS40IDI0LjYtOS40IDMzLjkgMGw4NC4zIDg0LjMuOS0yMzUuNWMuMS0xMy4yIDEwLjgtMjMuOSAyNC0yMy45aC4xYzEzLjMuMSAyNCAxMC44IDIzLjkgMjQuMWwtLjkgMjM0LjkgODMuOC04My44YzkuNC05LjQgMjQuNi05LjQgMzMuOSAwIDkuNCA5LjQgOS40IDI0LjYgMCAzMy45bC0xMjQuOCAxMjQuOWMtLjQuNC0uOC44LTEuMyAxLjItMy43IDMuMi04LjIgNS4yLTEyLjggNS43LTEgLjItMiAuMy0zIC4zeiIgZmlsbD0iIzFkMWQxYiIvPjxwYXRoIGQ9Im0zODguOCA0NDkuMmgtMjc3LjZjLTQyLjMgMC03Ni43LTM0LjQtNzYuNy03Ni43di03Ni43aDM4djc2LjdjMCAyMS4zIDE3LjQgMzguNyAzOC43IDM4LjdoMjc3LjZjMjEuMyAwIDM4LjctMTcuNCAzOC43LTM4Ljd2LTc2LjdoMzh2NzYuN2MwIDQyLjMtMzQuNCA3Ni43LTc2LjcgNzYuN3oiIGZpbGw9IiMxZDcxYjgiLz48L3N2Zz4=';

const icon = 'https://raw.githubusercontent.com/lemon3/orfdl/main/_assets/dl.svg';

const banner = `// ==UserScript==
// @name         ${settings.displayName}
// @namespace    https://github.com/lemon3/
// @version      ${settings.version}
// @description  ${settings.description}
// @author       ${settings.author}
// @match        https://*.tvthek.orf.at/*
// @icon         ${icon}
// @grant        none
// @run-at       document-end
// @license      ${settings.license}
// @copyright    lemon3
// @homepage     https://github.com/lemon3/orfdl
// @updateURL    https://raw.githubusercontent.com/lemon3/orfdl/main/dist/orfdl.meta.js
// @downloadURL  https://raw.githubusercontent.com/lemon3/orfdl/main/dist/orfdl.user.js
// ==/UserScript==

`;

module.exports = merge(common, {
  mode: 'production',

  entry: {
    'orfdl.meta': ['@/meta.js'],
  },

  output: {
    filename: '[name].js',
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.(js|css)$/,
        loader: 'string-replace-loader',
        options: {
          search,
          replace,
          flags: 'g',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },

  plugins: [new BannerPlugin({ banner })],

  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
