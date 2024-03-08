/* global require, module */
const BannerPlugin = require('./bannerPlugin');
const paths = require('./paths');
const userScriptHeader = require('./userScriptHeader');

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

  plugins: [new BannerPlugin({ banner: userScriptHeader })],

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src,
    },
  },
};
