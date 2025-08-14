const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './frontend/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: './dist',
    port: 8080,
   proxy: [
  {
    context: ['/submit', '/average'],
    target: 'http://localhost:3000',
  }
]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './frontend/public/index.html',
    }),
     new HtmlWebpackPlugin({
      template: './frontend/public/feelingSlides.html',
      filename: 'feelingSlides.html', // <-- this emits /feelingSlides.html
    }),
  ],
  module: {
    rules: [
        {
      test: /\.js$/,
      exclude: /node_modules/,
     use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
      sourceType: 'module'
    }
  },
    },
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    },
]
  },
  mode: 'development'
};
