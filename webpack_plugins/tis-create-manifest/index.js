const path = require('path');
const fs = require('fs')
const fileName = 'tisplatform.json';
const production = process.env.NODE_ENV === 'production' || process.env.VUE_APP_SDK === 'sdk';
const uc = require("upper-case");
function resolve(dir) {
    return path.join(__dirname,dir);
}
function parent_path_count(path_str,count) {
    let path_temp = path_str;
    for (let i = 0; i < count; i++) {
        path_temp = path.resolve(path_temp,'..')
    }
}
function createTisplatformPlugin(options){
    this.options = options;
}

createTisplatformPlugin.prototype.apply = function (compiler) {
    let _path = this.options.path;
    let sdkName = this.options.sdkName;
    let json = {};
    // console.log("prodcution了吗",production)
    // console.log("编译的对象",compiler)
    if(!production) return;
    compiler.plugin('compilation',function (compilation,options) {
        compilation.plugin('html-webpack-plugin-before-html-processing',function (htmlPluginData,callback) {
            // const title = htmlPluginData.plugin.options.title;
            // const ROOT_DIR_NAME = path.resolve(__dirname,'../../').split(path.sep).pop()
            // const title = uc(ROOT_DIR_NAME);
            json[sdkName] = {
                cssFiles : htmlPluginData.assets.css/*.map(css=>"/"+title+css)*/,
                jsFiles : htmlPluginData.assets.js/*.map(js=>"/"+title+js)*/,
                preload : true,
            };
            // console.log('资源',title,htmlPluginData)
            console.log('资源js** ',htmlPluginData.assets.js);
            // console.log('------------',_path);
            console.log('资源css** ',htmlPluginData.assets.css);
        })
    })
    compiler.plugin('done',function (compilation,options) {
        console.log(' compiler done********拼接文件 ',fileName)
        console.log("文件名称",path.join(_path,fileName))
        fs.writeFileSync(path.join(_path,fileName),JSON.stringify(json,null,"\t"))
        let config = JSON.parse(fs.readFileSync(path.join(_path,"esplug.json")));
        config.id = sdkName;
        config.icon = `/${sdkName}/icon.png`
        config.entry = `/${sdkName}/`;
        config.type = "app";
        config.version = "2";
        console.log('config file:',config);
        fs.writeFileSync(path.join(_path,"esplug.json"),JSON.stringify(config,null,"\t"));
    })
}

module.exports = createTisplatformPlugin;
