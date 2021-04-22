const createStyledComponentsTransformer = require('typescript-plugin-styled-components')
  .default
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    bundle: './src/index.tsx',
  },
  output: {
    publicPath: 'http://localhost:8080/',
    path: __dirname + '/docs',
    filename: '[name].js',
  },
  plugins: [
    new CleanTerminalPlugin(),
    // new HtmlWebpackPlugin()
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
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
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
  devServer: {},
}
