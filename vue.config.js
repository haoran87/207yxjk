const path = require("path");
const uc = require("upper-case");
// const {name} = require("./package");
const loadSdkPlugin = require('./webpack_plugins/tis-loadsdk-plugin');
const createTisplatformPlugin = require('./webpack_plugins/tis-create-manifest');
// const injectSdks = require('./webpack_plugins/tis-inject-sdk')
function resolve(dir) {
  return path.join(__dirname, dir);
}
const ROOT_DIR_NAME = resolve('').split(path.sep).pop();
const name = uc(ROOT_DIR_NAME);
// console.log("#############$$$$$$$%%%%%vueconfname=====",name)
const port = 7000; // dev port
const dev = process.env.NODE_ENV === 'development';
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   * 
   */
  publicPath: dev ? `http://localhost:${port}` : `/${name}/`,
  outputDir: `dist/${name}`,
  // assetsDir: "static",
  filenameHashing: false,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md

  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true
    },
    // proxy: {
    //   '/api': {
    //     target: 'http://192.168.16.211:8080/api',
    //     changeOrigin: true
    //   },
    // },
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    contentBase: ['sdk'],
  },
  // 自定义webpack配置
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            {
              loader: 'less-loader',
              options: {
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'sass-loader',
              options: {
               
              },
            },
          ],
        },
      ],
    },
    externals: {
      'tisui': 'TIS',// 
      'vue': {
        root: 'Vue',
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue'
      }
    },
    resolve: {
      alias: {
        "@": resolve("src")
      }
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: "umd",
      jsonpFunction: `webpackJsonp_${name}`
    },
    plugins: [
      new loadSdkPlugin({ sdkPath: 'sdk', jsonPath: 'sdk' }),
      // new injectSdks({path: path.resolve(`dist/${name}`),sdkName:name}),
      new createTisplatformPlugin({ path: path.resolve(`dist/${name}`), sdkName: name })
    ]
  },
  // pluginOptions: {
  //   'style-resources-loader': {
  //     'preProcessor': 'less',
  //     'patterns': [
  //       path.resolve(__dirname, './src/assets/yq.less'),
  //     ]
  //   }
  // }
};
