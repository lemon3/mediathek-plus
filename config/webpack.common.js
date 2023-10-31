/* global require, module */
const paths = require('./paths');

module.exports = {
  entry: {
    orfdl: ['@/orfdl.js'],
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

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src,
    },
  },
};
