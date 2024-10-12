const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

// console.log('Resolved stream-http:', require.resolve('stream-http'));
// console.log('Resolved process:', require.resolve('process/browser'));
// console.log('Resolved buffer:', require.resolve('buffer'));

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      fs: false,
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      tty: require.resolve('tty-browserify'),
      zlib: require.resolve('browserify-zlib'),
      os: require.resolve('os-browserify/browser'),
      events: require.resolve('events/'),
      crypto: require.resolve('crypto-browserify'),
      querystring: require.resolve('querystring-es3'),
      net: false,
      async_hooks: false, // Add this line to handle async_hooks
      process: require.resolve('process/browser.js') // Ensure full path with .js extension
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-react', { runtime: 'automatic' }]]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico'
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
    // new NodePolyfillPlugin()
  ],
  stats: 'minimal'
};
