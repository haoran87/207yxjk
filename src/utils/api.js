
import { service } from '@/utils/service'
import store from "../store";
export default {
    getOutServerAction(url,params){
        return service({
            url:  url,
            method: 'get',
            params: params
        })
    },
    clientUrl() {
        // console.log("调用客户端接口", window.YQCLIENTPORT)
        let port = ""
        if(window.YQCLIENTPORT){
            port = ":"+window.YQCLIENTPORT
        }
        return "http://" + store.state.yqInfo.chooseIP +port
    },
    postClientAction(url, parameter) {
        return service({
            url: this.clientUrl() + url,
            method: 'post',
            data: parameter
        })
    },
    getClientAction(url, parameter) {
        return service({
            url: this.clientUrl() + url,
            method: 'get',
            params: parameter
        })
    },

    
    serverUrl() {
        // console.log("调用客户端接口", window.YQCLIENTPORT)
        let ip = store.state.yqInfo.chooseIP 
        if(ip){
          let port = ""
          if(window.YQCLIENTPORT){
              port = ":"+window.YQSERVERPORT
          }
          return "http://" + store.state.yqInfo.chooseIP +port
        }else{
          return ""
        }
    },
    postServerAction(url, parameter) {
        return service({
            url: this.serverUrl() + window.YQWEBURL + url,
            method: 'post',
            data: parameter
        })
    },
    getServerAction(url, parameter) {
        return service({
            url: this.serverUrl() + window.YQWEBURL + url,
            method: 'get',
            params: parameter
        })
    },

    httpAction(url, parameter, method) {
        return service({
            url:  this.serverUrl() + window.YQWEBURL + url,
            method: method,
            data: parameter
        })
    },
    putAction(url, parameter) {
        return service({
            url: this.serverUrl() + window.YQWEBURL + url,
            method: 'put',
            data: parameter
        })
    }

}
