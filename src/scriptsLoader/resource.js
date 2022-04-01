const jsAttachPoint = document.querySelector('body')

//const cssAttachPoint = document.querySelector('head')

export async function loadResources(resources) {
    if (!resources.length) return
    for (const resource of resources) {
        //
        jsAttachPoint.appendChild(resource);
        await onLoad(resource).catch(() => {

            // resourcesLoaded.forEach(item => {
            //     if (resource.src.indexOf(item) > 0) {
            //         let res = item.replace(new RegExp("/\static\/","gm"),``);
            //         console.error(`${res}资源加载失败，请检查该软件段是否正确安装!`);
            //         resourcesLoaded.delete(item);
            //     }
            // });
            // console.log(resourcesLoaded.entries());
            jsAttachPoint.removeChild(resource);
        });
    }
}


export function createStylesheet(href) {
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href', href)
    return link
}

export function createScript(src) {
    // const script = document.createElement('script')
    // script.setAttribute('type', 'text/javascript')
    // script.setAttribute('src', src.src? src.src :src);
    // if (/require.min.js/.test(src)) script.setAttribute("data-main", '/TIS_DLTS_WEB/esapp-map/Build/Js/main.js');

    const script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    // if (src && src === "/TIS_DLTS_WEB/esapp-map/Build/Js/require.min.js") script.setAttribute("data-main", '/TIS_DLTS_WEB/esapp-map/Build/Js/main.js');
    if (/require.min.js/.test(src)) {
        script.setAttribute('src', "/TIS_DLTS_WEB/esapp-map/Build/Js/require.min.js");
        script.setAttribute("data-main", '/TIS_DLTS_WEB/esapp-map/Build/Js/main.js');
    } else {
        script.setAttribute('src', src.src ? src.src : src);
    }
    return script
}

function onLoad(el) {
    return new Promise((resolve, reject) => {
        el.onload = el.onreadystatechange = function () {
            let readyState = el.readyState;
            if (typeof readyState === 'undefined' || /^(loaded|complete)$/.test(readyState)) {
                resolve();
            }
        };
        el.onerror = function () {
            let readyState = el.readyState;
            if (typeof readyState === 'undefined' || /^(loaded|complete)$/.test(readyState)) {
                console.log('load js resources failed')
                reject({error: 'load js resources failed'})
            }
        }
    })
}

