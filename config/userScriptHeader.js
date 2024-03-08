/* global module, require */
const settings = require('../package.json');
const icon = 'https://raw.githubusercontent.com/lemon3/orfdl/main/_assets/dl.svg';

const banner = `// ==UserScript==
// @name         ${settings.displayName}
// @namespace    https://github.com/lemon3/
// @version      ${settings.version}
// @description  ${settings.description}
// @author       ${settings.author}
// @match        https://*.tvthek.orf.at/profile/*
// @match        https://on.orf.at/video/*
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

module.exports = banner;
