const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

const html = new HtmlWebpackPlugin({
  inject: false,
  templateContent: ({ htmlWebpackPlugin }) => `
    <html>
      <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        ${htmlWebpackPlugin.tags.headTags}
      </head>
      <body>
        <div id='root'></div>
        ${htmlWebpackPlugin.tags.bodyTags}
      </body>
    </html>
  `
})

const devServer = {
  contentBase: path.join(__dirname, 'public'),
  historyApiFallback: true,
  port: 9000,
  hot: true,
  hotOnly: true
}

const config = {
  entry: {
    main: './src/index.tsx'
  },
  mode,
  devtool: mode === 'production' ? 'source-map' : 'eval-cheap-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/]
      },
      {
        test: /react-spring/,
        sideEffects: true
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      root: __dirname,
      src: path.resolve(__dirname, 'src')
    },
    fallback: {
      stream: require.resolve('stream-browserify')
    }
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
      maxSize: 1024 * 1024,
      hidePathInfo: true,
      usedExports: true
    }
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins: [
    html,
    new NodePolyfillPlugin({
      excludeAliases: ['console']
    })
  ],
  devServer
}

module.exports = config
