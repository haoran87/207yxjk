import tis, { setup } from "./tis";
import App from "./App.vue";
// const esplug = require('/esplug.json');

// import {registerApps} from './scriptsLoader/index'
// 生命周期函数
function bootstrap(params) {
  console.log(`[SubApp: ${tis.appId}] boostrap`, params);
}
function mount(params) {
  window.tisApp = tis;
  // console.log('app_demo.....',window.tisApp.Vue)
  // registerApps();
  console.log(`[SubApp: ${tis.appId}] mount`, params);

}
function show(params) {
  console.log(`[SubApp: ${tis.appId}] show`, params);
}
function hide(params) {
  console.log(`[SubApp: ${tis.appId}] hide`, params);
}
function unmount(params) {
  console.log(`[SubApp: ${tis.appId}] unmount`, params);
}
// 收到消息
function onMessage(params) {
  console.log(`[SubApp: ${tis.appId}] onMessage`, params);
}


//api初始化


// 启动
setup(App, {
  bootstrap,
  mount,
  hide,
  show,
  unmount,
  onMessage
});

// for qiankun framework
export * from "./tis";
