import {loadResources, createStylesheet, createScript} from './resource'

const resourcesLoaded = new Set()
//开发态要获取当前的域名端口
const dev = process.env.NODE_ENV === 'development' ;
const baseUrl = dev ? process.env.BASE_URL : '';
let currentBaseUrl = "";
export async function registerApps(appObject,curBaseUrl) {
    //开发态需要根据域名加载资源，运行态不需要加publicPath
    let reg =  /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)/;
    currentBaseUrl = reg.test(curBaseUrl) ? curBaseUrl : "";
    // if(process.env.NODE_ENV === 'development'){
    //     console.log('ppppp',baseUrl)
    //         const response = await  fetch(`${baseUrl}/tisplatform.json`,{method:'get'});
    //     const scripts = await response.json()
    //     console.log('000000000000',Object.values(scripts))
    //     Object.values(scripts).map(async script => await getAppLoader(script)())
    // }else{
    if (appObject === undefined || appObject == null) {
        return Promise.resolve('[所加载资源为null]');
    }
    await getAppLoader(appObject)();
    // }

}

function getAppLoader(info) {
    return async function () {
        if (info === undefined || info == null) return
        const {cssFiles, jsFiles} = info
        if (cssFiles) {
            await loadResources([
                ...cssFiles.filter(notLoaded).map(appendBaseUrl).map(createStylesheet),
                ...jsFiles.filter(notLoaded).map(appendBaseUrl).map(createScript)
            ], resourcesLoaded)
        } else {
            await loadResources([
                ...jsFiles.filter(notLoaded).map(appendBaseUrl).map(createScript)
            ], resourcesLoaded)

        }
    }
}

function appendBaseUrl(target) {
    return (currentBaseUrl ? currentBaseUrl : baseUrl) + target;
}

function notLoaded(file) {
    const loaded = resourcesLoaded.has(file)
    resourcesLoaded.add(file)
    return !loaded
}

