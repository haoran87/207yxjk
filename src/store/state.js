import { hpmA, homeModuleListA, chartPath, topObj, chartInfoObj } from "@/utils/home-module";
// console.log("ffffff",localStorage.getItem("hpmData"))
const HOMEPAGEMODULE = JSON.parse(localStorage.getItem("hpmData")) || hpmA;
const TOPOLIST = JSON.parse(localStorage.getItem("topoList")) || [];
const TOPOBJ = JSON.parse(localStorage.getItem("topobj")) || topObj
// const CHOOSETOPO = localStorage.getItem("chooseTopo") || "bf2038cf-5a1c-4eaf-9967-a7e63c997227";
const state = {
    serverIp: window.YQWEBURL,
    breadCrumb: "",
    menuData: [],
    navId: "",
    parentNavId: "",
    componentPath: '',
    isLoading: false,
    loadingText: "",
    homePageModule: HOMEPAGEMODULE,
    homeModuleList: homeModuleListA,
    homeModuleAll: homeModuleListA,
    chartPath: chartPath,
    localDeviceInfo: null, //本地设备信息
    chooseIP: '', //当前选择的IP
    connectedStu: true,
    listenStu: true,
    topoList: TOPOLIST,
    bottomStu: 2,
    alertShow: false,
    alertObj: null,
    topObj: TOPOBJ,
    chartInfoObj: chartInfoObj,
    chooseTopo: '',
    topoStatusImage: null, //拓扑状态图片缓存
    topoStatusImageChange: false,  //拓扑状态图片变化标记
    pageData: null,
    TOPOWITH:'693',
    TOPOHEIGHT:'507',
    ipData:null,
    MAINHEIGHT:"100vh",
    platform:'pc',
    dialogBg:'background-color:rgba(150,149,146,0.8)',
    ipCheckedStu:false,
}
export default state;
