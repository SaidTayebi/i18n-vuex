import path from 'path'
import webpack from 'webpack'

export default {
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js',
    library: ['i18n-vuex'],
    libraryTarget: 'umd'
  },
  devtool: "source-map",
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
