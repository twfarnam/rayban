const createStyledComponentsTransformer = require('typescript-plugin-styled-components')
  .default
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  mode: 'development',
  entry: {
    bundle: './src/index.tsx',
  },
  output: {
    filename: '[name].[contenthash].js',
  },
  plugins: [
    new CleanTerminalPlugin(),
    new HTMLWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          getCustomTransformers: () => ({
            before: [createStyledComponentsTransformer()],
          }),
        },
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { url: false } },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')],
              },
            },
          },
        ],
      },
    ],
  },
  devtool: 'inline-source-map',
  devServer: { host: '0.0.0.0', contentBase: 'static' },
}
