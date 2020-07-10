const webpack = require('webpack')
const { dev } = require('../public/config')
const {merge} = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf.js')
// html 插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 从 js 中抽离 css
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩 css
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, //替换 style-loader
            options: {
              // 在开发环境启动热更新
              hmr: true,
              // 如果hmr没工作，这是一个强有力的方法
              reloadAll: true
            }
          },
          'css-loader', 
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [
                  require('autoprefixer')(
                    // 通过 .browserslistrc 配置，可以多个 loader 共享
                    // // {
                    // //   'overrideBrowserslist': [
                    // //     '>0.25%',
                    // //     'not dead'
                    // //   ]
                    // // }
                  )
                ]
              }
            }
          }, 
          'less-loader'
        ],
        exclude: /node_modules/
      },
    ]
  },
  devServer: {
    // 热更新
    hot: true,
    // 端口号
    port: 3000, 
    // 编译出错时在浏览器窗口全屏输出错误
    overlay: true,
    // 代理
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        pathRewrite: {
          '/api': ''
        }
      }
    }
  },
  // 将编译后的代码映射到源代码
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      // 要引入的 js 文件，否则会引入多页中所有 js，可对比 dist/app.html 查看
      chunks: ['index'],
      // 配置动态变量
      config: dev.template
    }),
    new HtmlWebpackPlugin({
      template: './public/app.html',
      filename: 'app.[hash:8].html'
    }),
    new OptimizeCssPlugin(),
    // webpack 内置热更新插件
    new webpack.HotModuleReplacementPlugin()
  ]
})
