// node 模块
const path = require('path')
// 清空 dist 插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// 静态资源拷贝
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 从 js 中抽离 css
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/**
 * path.join 字符拼接并进行路径规范化
 * path.resolve 绝对路径，相当于将路径逐一进行 cd 操作
 * __dirname 被执行 JS 的绝对路径
 * 
 * entry 路径相对于 context 来确定，而 context 默认为 package.json 所在的目录
 * output 的 path 必须是一个绝对路径，而 publicPath 的路径：静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径
 * HtmlWebpackPlugin 的 template 属性路径是相对于 compiler.context（项目目录），filename 属性的路径是相对于 output.path
 */

module.exports = {
  entry: {
    index: './src/index.js',
    app: './src/app.js'
  },
  output: {
    // 必须是绝对路径
    path: path.resolve(__dirname, '../dist'),
    // 下面的 name 对应入口文件的 chunkName
    filename: '[name].[hash:8].js', 
    // 通常是 CDN 地址
    publicPath: '/' 
  },
  // // resolve 配置 webpack 如何寻找模块所对应的文件
  // resolve: {
  //   // 不可缺省文件后缀
  //   enforceExtension: true,
  //   // 从左到右依次查找
  //   // 可通过 import Dialog from 'dialog' 导入
  //   // 而不需要写 import Dialog from './src/components/dialog'
  //   // modules: [resolve('src/components'), 'node_modules'],
  //   // 别名
  //   alias: {
  //     '@': resolve('src')
  //   }
  // },
  module: {
    rules: [
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
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns:['**/*', '!dll', '!dll/**'] //不删除dll目录下的文件
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/**/*.js',
          to: path.resolve(__dirname, '../dist', 'js'),
          // 不拷贝文件夹
          flatten: true, 
          globOptions: {
            // 忽略文件（不拷贝）
            ignore: ['**/config.js']
          }
        }
        // 其他需要拷贝的文件
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath 
      // publicPath: '../'
    })
  ]
}
