import { resolve } from 'path';
import fs from 'node:fs';

const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
const outDir = resolve(__dirname, 'dist');

const getSize = (bytes, decimals = 2, base = 1024) => {
  if (!Number(bytes)) return `0 ${sizes[0]}`;
  decimals = decimals < 0 ? 0 : decimals;
  const ind = Math.floor(Math.log(bytes) / Math.log(base));
  const result = parseFloat((bytes / Math.pow(base, ind)).toFixed(decimals));
  return `${result} ${sizes[ind]}`;
};

const writeFile = async (content, filename) => {
  const dir = './dist';

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', err);
  }

  fs.writeFile(`${dir}/${filename}`, content, (err) => {
    if (err) {
      console.error('\x1b[31m%s\x1b[0m', err);
    } else {
      console.log(
        '%s \x1b[36m%s\x1b[0m %s \x1b[36m%s\x1b[0m \x1b[90m| %s\x1b[0m',
        'file',
        filename,
        'was written to',
        dir,
        getSize(content.length)
      );
    }
  });
};

/**
 * the defaults
 */
const defaults = {
  content: '',
  outDir,
  filename: null,
};

export default function Writer(options) {
  if ('object' !== typeof options) {
    console.error('no valid input!\n');
  }

  if (!Array.isArray(options)) {
    options = [options];
  }

  return {
    name: 'writer-plugin',
    apply: 'build', // or 'serve'

    // closeBundle hook.
    // https://rollupjs.org/guide/en/#closebundle
    closeBundle: async () => {
      options.forEach((item) => {
        const setting = Object.assign({}, defaults, item);

        if (!setting.filename) {
          console.error('\x1b[31m%s\x1b[0m', 'no filename given!');
          return;
        }
        writeFile(setting.content, setting.filename);
      });
    },
  };
}
