// html 插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build'];
// node 模块
const path = require('path')
// 清空 dist 插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: './src/index.js',
  output: {
    // 必须是绝对路径
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[hash:8].js',
    // 通常是 CDN 地址
    publicPath: '/' 
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: ['style-loader', 'css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: function() {
              return [
                require('autoprefixer')({
                  'overrideBrowserslist': [
                    '>0.25%',
                    'not dead'
                  ]
                })
              ]
            }
          }
        }, 'less-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          // 通过 .babelrc 配置
          // // options: {
          // //   presets: ["@babel/preset-env"],
          // //   plugins: [
          // //     [
          // //       "@babel/plugin-transform-runtime",
          // //       {
          // //         "corejs": 3
          // //       }
          // //     ]
          // //   ]
          // // }
        },
        exclude: /node_modules/
      },
      {
        test: /.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 小于 10k，转换为 base64
              limit: 10240,
              // 允许使用 require 语句导入图片
              esModule: false,
              // 生成的文件名（默认是 MD5 哈希值）
              name: '[name]_[hash:8].[ext]',
              // 打包到 dist/assets 目录下
              outputPath: 'assets'
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      // 配置动态变量
      config: config.template, 
      minify: {
        // 移除双引号
        removeAttributeQuotes: false, 
        // 移除多余空格
        collapseWhitespace: false 
      }
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns:['**/*', '!dll', '!dll/**'] //不删除dll目录下的文件
    })
  ],
  devServer: {
    // 端口号
    port: 3000, 
    // 编译出错时在浏览器窗口全屏输出错误
    overlay: true 
  },
  // 将编译后的代码映射到源代码
  devtool: 'cheap-module-eval-source-map'
}
