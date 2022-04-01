if (window.__POWERED_BY_QIANKUN__) {
    // eslint-disable-next-line no-undef
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
import Vue from "vue";
import store from '../store';
Vue.config.productionTip = false;
import { registerApps } from '../scriptsLoader/index'
import axios from 'axios'
import Vuex from 'vuex'
import echarts from 'echarts'
import selfLoading from '../components/page/selfLoading.vue'
import weijietong from '../components/home-page/weijietong.vue'
import BoxShow from "../components/page/box-show.vue";
import SelfTable from "../components/page/self-table.vue";
import TableComponent from "../components/page/table-component.vue";
import SelectDict from "../components/page/select-dict.vue";
import ListPage from "@/components/page/list-page-bar.vue";
import PageMobile from "@/mobile/mobileModules/PageMobile.vue";
import ListMobile from "@/mobile/mobileModules/ListMobile.vue";
import SearchTopMobile from "@/mobile/mobileModules/SearchTopMobile.vue";
import { yqLoading, yqAlert, getDeviceState, navigateTo, getPageData,getPlatformType } from "@/utils/util"
import API from "@/utils/api";
import HasPermission from "@/utils/hasPermission";
import icon from "@/components/tools/icon"
import less from 'less'
import { SVG } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import moment from 'moment';
import syberh from '@syberos/jsbridge'
Vue.use(less)
Vue.use(HasPermission)
Vue.component("selfLoading", selfLoading);
Vue.component("icon", icon);
Vue.component("weijietong", weijietong);
Vue.component("BoxShow", BoxShow);
Vue.component("SelfTable", SelfTable);
Vue.component("TableComponent", TableComponent);
Vue.component("SelectDict", SelectDict);
Vue.component('ListPage', ListPage);
Vue.component('PageMobile', PageMobile);
Vue.component('ListMobile', ListMobile);
Vue.component('SearchTopMobile', SearchTopMobile);
Vue.prototype.$echarts = echarts;
Vue.prototype.$yqLoading = yqLoading();
Vue.prototype.$yqAlert = yqAlert;
Vue.prototype.$getDeviceState = getDeviceState;
Vue.prototype.$getPlatformType = getPlatformType
Vue.prototype.$navigateTo = navigateTo;
Vue.prototype.$pageData = getPageData;
Vue.prototype.$api = API;
Vue.prototype.$svg = SVG;
Vue.prototype.$moment = moment;
Vue.prototype.$platform = {type:'pc',size:''};
Vue.prototype.$syberh = syberh;
const dev = process.env.NODE_ENV === 'development';
Vue.prototype.$dev = dev;
import router from '../router'
// const sdk = process.env.VUE_APP_SDK === 'sdk';
//作为sdk向组件提供能力时，确保加载的资源是当前组件域下的资源，
// http://localhost:7001是一个写死的路径。。如何能正确的获取到组件的域
// 在这个文件中进行对kt的适配
const baseUrl = dev ? process.env.BASE_URL : "";
let curBaseUrl = '';
const bus = new Vue({
    data: {
        components: [], // components
        asserts: []
    }
})
let _App,
    _instance,
    _options = {},
    _props = {};
const tis = new Proxy(
    {
        Vue: Vue,
        async loadComponent(component) {
            const comp = bus.components.find(arg => arg.component === component) || {};
            let assets = null;
            let dependencies = [];
            try {
                const info = comp.segprefix;
                assets = bus.asserts[info];
                dependencies = comp.dependencies || [];
            } catch (e) {
                console.error(e)
            }
            // console.log('开始加载组件资源...',bus.components,component,comp,assets);
            //等待依赖下载完毕
            for (const refer of dependencies) {
                let reference = bus.asserts[refer] || null;
                await registerApps(reference, curBaseUrl);
            }
            return new Promise((resolve, reject) => {
                //加载组件资源
                // console.log('开始加载组件资源', assets, curBaseUrl)
                registerApps(assets, curBaseUrl).then(() => {
                    let startTime = new Date().getTime();
                    const looper = setInterval(() => {
                        if (Vue.component(`${component}`)) {
                            resolve(comp)
                            clearInterval(looper);
                        } else {
                            let nowTime = new Date().getTime();
                            if (nowTime - startTime > 2000) {
                                if (!assets) {
                                    reject(`[loading error:${component}]:组件资源加载失败`)
                                } else {
                                    reject(`[loading error:${component}]:loading component timed out`)
                                }
                                clearInterval(looper)
                            }
                        }
                    }, 300)
                }).catch(err => {
                    if (!assets) {
                        reject(`[loading error:${component}]:组件资源加载失败`)
                    } else {
                        reject(`[loading error:${component}]:${err}`)
                    }
                });


            })

        }

    },
    {
        get: function (_, k) {
            return (_props.tis && _props.tis[k]) ? _props.tis[k] : _[k]
        }
    }
);

export function setup(App, options = {}) {
    _App = App;
    _options = options;

    // registerApps(_options.components)
    // 独立运行时
    if (!window.__POWERED_BY_QIANKUN__) {
        Vue.prototype.$tis = tis;
        // console.log('----------','独立运行')
        mount();
    }
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap(props) {
    _props = props;
    Vue.prototype.$tis = tis;
    props.onMessage.ref = _options.onMessage // 暴露onMessage回调给宿主
    if (typeof _options.bootstrap === "function") {
        _options.bootstrap(props);
    };
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */

export async function mount(props = {}) {
    const { container } = props;
    console.log('框架传来的参数', props)
    //取得esplug
    console.log('当前运行环境', dev, 'tis.entry === ', props.tis, " baseurl == ", baseUrl);
    curBaseUrl = props.tis ? props.tis.entry : baseUrl;
    const esData = await axios.get(`${curBaseUrl}/esplug.json`).catch(err => console.error(err));
    const asserts = await axios.get(`${curBaseUrl}/tisplatform.json`).catch(err => console.error(err));
    try {
        bus.components = dev ? esData.data.components : props.tis.components;
        bus.asserts = dev ? asserts.data : props.tis.asserts;

    } catch (e) {
        console.error(e)
    }
    _instance = new Vue({
        store,
        router,
        render: h => h(_App),
    }).$mount(container ? container.querySelector("#app") : "#app");

    if (typeof _options.mount === "function") {
        _options.mount(props);
    }


    window.esapp = {
        Vue: Vue,
        vue: {},
        add_path: function (route, name, obj) {
            store.registerModule(name, obj);
        },
        add_store: function (module, data) {
            store.commit(module, data);
        },
        Vuex: Vuex,
        VueRouter: {},
    }
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props = {}) {
    if (_instance) {
        _instance.$destroy();
        _instance.$el.innerHTML = "";
        _instance = null;
    }
    if (typeof _options.unmount === "function") {
        _options.unmount(props);
    }
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props = {}) {
    if (props.show === true && typeof _options.show === 'function') {
        _options.show(props.params);
    }

    if (props.show === false && typeof _options.hide === 'function') {
        _options.hide(props.params);
    }

    if (typeof _options.update === "function") {
        _options.update(props);
    }
}

export default tis;
