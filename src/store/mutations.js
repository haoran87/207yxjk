import * as yqInfo from './mutation-types'
const mutations = {
  [yqInfo.SET_TEST](state, data) {
    state.testData = data;
  },
  [yqInfo.SET_BREADREUMB](state, comName) {
    state.breadCrumb = comName;
  },
  [yqInfo.SET_NAVID](state, comObj) {
    state.parentNavId = comObj.parent_id;
    state.navId = comObj.id;
    state.componentPath = comObj.url;
  },
  [yqInfo.SET_MENUDATA](state, comObj) {
    state.menuData = comObj;
  },
  [yqInfo.SET_PAGEDATA](state, data) {
    state.pageData = data || null;
  },
  [yqInfo.LOADING_FUNC](state, loadObj) {
    state.isLoading = loadObj.stu;
    state.loadingText = loadObj.text;
  },
  [yqInfo.CHANGE_HOME_MODULE](state, obj) {
    state.homePageModule[obj.key] = obj.path;
    localStorage.setItem("hpmData", JSON.stringify(state.homePageModule))
  },
  [yqInfo.SET_LOCAL_DEVICE_INFO](state, obj) {
    state.localDeviceInfo = obj;
  },
  [yqInfo.CHANGE_IP](state, ipObj) {
    if (state.chooseIP != ipObj.ip || state.connectedStu != ipObj.connectedStu) {
      state.listenStu = !state.listenStu;
    }
    state.chooseIP = ipObj.ip;
    state.connectedStu = ipObj.connectedStu;
  },
  [yqInfo.CHANGE_BSTU](state, stu) {
    state.bottomStu = stu;
  },
  [yqInfo.CHANGE_TOPO](state, topoId) {
    localStorage.setItem("chooseTopo", topoId)
    state.chooseTopo = topoId;
  },
  //所有拓扑状态图片缓存
  [yqInfo.CHANGE_TOPO_IMAGE](state, obj) {
    state.topoStatusImage = obj;
  },
  //拓扑状态图片变化标记
  [yqInfo.TOPO_IMAGE_HAS_CHANGE](state, obj) {
    state.topoStatusImageChange = obj;
  },
  [yqInfo.ALERT_FUNC](state, obj) {
    state.alertObj = obj;
  },
  [yqInfo.GET_ALL_MODULE](state, list) {
    state.homeModuleAll = list;
  },
  [yqInfo.TOP_OBJ](state, obj) {
    Object.assign(state.topObj, obj)
    localStorage.setItem("topobj", JSON.stringify(state.topObj))

  },
  SET_MOBILE_IP(state,ip){
    state.chooseIP = ip;
  },
  SET_IPDATA(state,ipdata){
    state.ipData = ipdata;
  },
  SET_MAINHEIGHT(state,h){
    state.MAINHEIGHT = h ;
  },
  SET_PLATFORM(state,type){
    state.platform = type;
  },
  [yqInfo.SET_IPCHECKEDSTU](state,bool){
    state.ipCheckedStu = bool;
  }
}
export default mutations;

