const path = require('path');
const fs = require('fs')
const fileName = 'tisplatform.json';
const production = process.env.NODE_ENV === 'production';

function resolve(dir) {
    return path.join(__dirname, dir);
}

function injectSdks(options) {
    this.options = options;
}

injectSdks.prototype.apply = function (compiler) {
    let _path = this.options.path;
    let sdkName = this.options.sdkName;
    let json = {};
    if (production) return;
    compiler.plugin('compilation', (compilation) => {
        console.log('The compiler is starting a new compilation...');
        try {
            const assert = require('../../sdk/tisplatform');
            compilation.plugin(
                'html-webpack-plugin-before-html-processing',
                (data, cb) => {
                    Object.values(assert).forEach(resource => {
                        const {cssFiles, jsFiles} = resource;
                        // console.log('aaaaa',cssFiles)
                        // console.log('aaaaa',jsFiles)
                        data.assets.js.push(...jsFiles);
                        data.assets.css.push(...cssFiles);
                        console.log('js assert', data.assets.js)
                        console.log('css assert', data.assets.css)
                    });


                    data.html += 'The Magic Footer'

                    // cb(null, data)
                }
            )
        } catch (e) {

        }
    })
}

module.exports = injectSdks;
