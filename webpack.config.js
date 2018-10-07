//
// Webpack configuration file.
// Having this file allows running "webpack" without arguments.
//

const path = require('path');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'moneyframe.bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        test: /\.css$/,
        use:['style-loader','css-loader']
      }
    ]
  }
};
