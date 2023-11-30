const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
  const isDev = process.env.mode ?? 'development';
  return {
    mode: isDev,
    entry: path.resolve(__dirname, 'src', 'scripts.js'),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].[contenthash].js',
      clean: true,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css',
      }),
      isDev && new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public','index.html') }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    devServer: {
      port: 5000,
      open: true,
      hot: true,
    }
  }
};
