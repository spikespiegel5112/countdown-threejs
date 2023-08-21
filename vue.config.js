const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = defineConfig({
  publicPath: "./",
  transpileDependencies: true,
  chainWebpack(config) {
    config.module.rule("font")
      .test(/\.(ttf|woff)$/)
      .use("url-loader")
      .loader("url-loader").options({
        name: "static/[name].[ext]"//图片大于等于10k时，设置打包后图片的存放位置 name是文件名   ext是文件后缀
      })
  },

  configureWebpack: {
    optimization: {
      nodeEnv: false
    },
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      // new HtmlWebpackPlugin({
      //   title: '文心一言'
      // })
      // new BundleAnalyzerPlugin()
      // new webpack.DefinePlugin({
      //   // webpack自带该插件，无需单独安装
      //   "process.env": {
      //     NODE_ENV: process.env.NODE_ENV, // 将属性转化为全局变量，让代码中可以正常访问
      //   },
      // }),

    ],
  },
});
