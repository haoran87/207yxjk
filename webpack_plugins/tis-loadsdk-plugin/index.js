const path = require('path');
const fs = require('fs')
const fileName = 'tisplatform.json';
function loadSdkPlugin(options) {
    this.options = options;
}

loadSdkPlugin.prototype.apply = function (comppiler) {
    let sdkPath = this.options.sdkPath;
    let jsonPath = this.options.jsonPath;
    let sdks = {};
    let json = {};
    comppiler.plugin('done',function (compilation,callback) {
        //写入sdk配置
        try {
            const files = fs.readdirSync(path.resolve(sdkPath))
            files.forEach(function (item,index) {
                let stat = fs.lstatSync(path.join(sdkPath,item))
                if(stat.isDirectory()){
                    // console.log('aaaaa',path.join(jsonPath,fileName),fs.existsSync(path.join(jsonPath,fileName)))
                    if(!fs.existsSync(path.join(jsonPath,fileName))){
                        fs.writeFileSync(path.join(jsonPath,fileName),"{}","utf-8");
                    }
                    //抽取preload为true的sdk
                    let target = JSON.parse(fs.readFileSync(path.join(jsonPath,fileName),"utf-8"))
                    let sdkJson = JSON.parse(fs.readFileSync(path.join(sdkPath,item,fileName),"utf-8"));

                    //TODO 已有属性就不再写入
                    // console.log(target.hasOwnProperty(item));
                    // if(!target.hasOwnProperty(item)){
                        sdks[item] = sdkJson[item];

                        // console.log(path.join(jsonPath,fileName));
                        fs.writeFileSync(path.join(jsonPath,fileName),JSON.stringify(sdks,null,"\t"))
                    // };
                }
            })
            console.log("sdkssdkssdksdsk**&& = ",sdks);
            //自身platform
            // json = JSON.parse(fs.readFileSync(path.join(jsonPath,fileName),'utf-8'));
            // json['dependent'] = sdks;
            //
            // console.log(path.join(jsonPath,fileName))


            // callback();
        }catch (e) {
            console.log(e)
        }

        // console.log(sdks);
    })
}

module.exports = loadSdkPlugin
