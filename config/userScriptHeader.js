import pkg from '../package.json';

const icon =
  'https://raw.githubusercontent.com/lemon3/mediathek-plus/main/_assets/dl.svg';

const userScriptHeader = `// ==UserScript==
// @name         ${pkg.displayName}
// @namespace    https://github.com/lemon3/
// @version      ${pkg.version}
// @description  ${pkg.description}
// @author       ${pkg.author}
// @match        https://on.orf.at/*
// @icon         ${icon}
// @grant        none
// @run-at       document-idle
// @noframes
// @license      ${pkg.license}
// @copyright    lemon3
// @homepage     https://github.com/lemon3/mediathek-plus
// @updateURL    https://raw.githubusercontent.com/lemon3/mediathek-plus/main/dist/mediathek-plus.meta.js
// @downloadURL  https://raw.githubusercontent.com/lemon3/mediathek-plus/main/dist/mediathek-plus.user.js
// ==/UserScript==
`;

export { userScriptHeader };
