import Vue from 'vue'
let v = new Vue()
import store from "../store"
import { yqLoading, getTestPlugin, getTestLogData } from '@/utils/util'
import axios from 'axios'
let ready = true;
const service = axios.create({
    // baseURL: "http://192.168.16.211:8080",
    // timeout: 9000,

})

service.interceptors.request.use(config => {
    // const token = Vue.ls.get(ACCESS_TOKEN)
    // if (token) {
    //   config.headers[ 'X-Access-Token' ] = token 
    // }
    // console.log("请求前",config)
    return config
}, (error) => {
    yqLoading().hide()
    console.log("请求失败222", error)

    // return Promise.reject(error)
})

service.interceptors.response.use((response) => {
    if (response.config.url.includes('/insight/statusInfo/getAllDeviceIPList')) {
        if (response.data.code === 200) {
            if(response.data.length === 0){
                checkIpStatus()
            }
            else if(store.state.yqInfo.ipCheckedStu){
                store.commit("yqInfo/SET_IPCHECKEDSTU", false);
            }

            
        }
    }
    return response.data
}, (error) => {
    yqLoading().hide()
    errorFunc(error)
    // console.log("errrrrrooorr",error.request)
    // console.log("errrrrrooorr",window.ENV)
    if (window.ENV === 'development') {
        if (error.response.config.url === window.ALLSERVICELOADINFO) {
            return getTestPlugin()
        }
        else if (error.response.config.url === window.ALL_SERVICE_REGISTERINFO) {
            return getTestLogData()
        }
    }
})

function errorFunc(error) {
    if (error.response) {
        let data = error.response.data
        switch (error.response.status) {
            case 403:
                v.$message.error("拒绝访问")
                break
            case 500:
                v.$message.error('服务端报错')
                break
            case 404:
                v.$message.error('很抱歉，资源未找到!')
                break
            case 504:
                v.$message.error('网络超时')
                break
            case 401:
                v.$message.error('未授权，请重新登录')
                break
            default:
                v.$message.error(data.message)
                break
        }
    }
    else {
        if (error.config.url.includes('/insight/statusInfo/getAllDeviceIPList')){
            checkIpStatus()
        }
        
    }
}
function checkIpStatus() {
    let ss = store.state.yqInfo
    if(ss.ipCheckedStu)return;
    if (ready && ss.chooseIP !== ss.localDeviceInfo.ip) {
        ready = false;
        v.$confirm('连接失败，是否切换到本地模式？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let chooseIpObj = {
                ip: ss.localDeviceInfo.ip,
                connectedStu: true,
            };
            store.commit("yqInfo/CHANGE_IP", chooseIpObj);
            ready = true;
        }).catch(() => {
            store.commit("yqInfo/SET_IPCHECKEDSTU", true);
            ready = true;
        });
    }

}
export {
    service
}