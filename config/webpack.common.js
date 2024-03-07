/* global require, module */
const settings = require('../package.json');
const BannerPlugin = require('./bannerPlugin');
const paths = require('./paths');

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

module.exports = {
  entry: {
    'orfdl.user': ['@/orfdl.js'],
  },

  output: {
    path: paths.build,
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['css-loader', 'postcss-loader']
      },
    ],
  },

  plugins: [new BannerPlugin({ banner })],

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src,
    },
  },
};
