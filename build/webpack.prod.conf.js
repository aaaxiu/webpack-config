const {merge} = require('webpack-merge')
const { build } = require('../public/config')
const baseWebpackConfig = require('./webpack.base.conf.js')
// html 插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 从 js 中抽离 css
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      // 要引入的 js 文件，否则会引入多页中所有 js，可对比 dist/app.html 查看
      chunks: ['index'],
      // 配置动态变量
      config: build.template, 
      minify: {
        // 移除双引号
        removeAttributeQuotes: true, 
        // 移除多余空格
        collapseWhitespace: true 
      }
    }),
    new HtmlWebpackPlugin({
      template: './public/app.html',
      filename: 'app.[hash:8].html'
    }),
  ]
})
