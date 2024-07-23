// webpack.config.mjs
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ],
};
