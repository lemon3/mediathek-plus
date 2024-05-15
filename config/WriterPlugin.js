// @filename: WriterPlugin.js
import fs from 'node:fs';

const writeFile = async (content, filename) => {
  const dir = './dist';

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  } catch (err) {
    console.error(err);
  }

  fs.writeFile(`${dir}/${filename}`, content, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`file '${filename}' was written to '${dir}'`);
    }
  });
};

export default function Writer(content, filename) {
  return {
    name: 'writer-plugin',
    // run during closeBundle hook. https://rollupjs.org/guide/en/#closebundle
    closeBundle: async () => {
      await writeFile(content, filename);
    },
  };
}
