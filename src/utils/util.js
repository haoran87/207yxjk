import Store from "@/store";
import { Loading } from 'element-ui';
import API from "@/utils/api";
import { routerList } from "@/utils/routerList";
import { SERVERDATA } from "@/utils/serverData";
import Vue from 'vue'

let v = new Vue()

export function getFomateDate(num, type) {
    let date = new Date();
    if (typeof (num) !== "number") return
    if (type == "after" && num > 0) {
        date.setDate(date.getDate() + num);
    } else if (type == "before" && num > 0) {
        date.setDate(date.getDate() - num);
    }
    // let seperator1 = "-";
    // let seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = month + "/" + strDate
    // let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    //         + " " + date.getHours() + seperator2 + date.getMinutes()
    //         + seperator2 + date.getSeconds();
    return currentdate;
}

export function formatDate(d) {
    let dstr = new Date(d);
    let month = dstr.getMonth() + 1;
    let strDate = dstr.getDate();
    let strSecond = dstr.getSeconds()
    let strMin = dstr.getMinutes()
    let strHour = dstr.getHours();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strSecond < 10) {
        strSecond = "0" + strSecond
    }
    if (strMin < 10) {
        strMin = "0" + strMin
    }
    if (strHour < 10) {
        strHour = "0" + strHour
    }
    let seperator1 = "-";
    let seperator2 = ":";
    let currentdate = dstr.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + strHour + seperator2 + strMin
        + seperator2 + strSecond;
    return currentdate;
}

export function formatHourDate(d) {
    let dstr = new Date(d);
    let month = dstr.getMonth() + 1;
    let strDate = dstr.getDate();
    let strSecond = dstr.getSeconds()
    let strMin = dstr.getMinutes()
    let strHour = dstr.getHours();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strSecond < 10) {
        strSecond = "0" + strSecond
    }
    if (strMin < 10) {
        strMin = "0" + strMin
    }
    if (strHour < 10) {
        strHour = "0" + strHour
    }
    // let seperator1 = "-";
    let seperator2 = ":";
    let currentdate = strHour + seperator2 + strMin
        + seperator2 + strSecond;
    return currentdate;
}

export function getPlatformType() {
    return v.$tis.getDeviceType() || "pc";
}

export function getNavList() {
    return routerList
}

export function getNavTarget(navList, id) {
    let item = null;
    for (let i = 0; i < navList.length; i++) {
        if (id == navList[i].id) {
            item = navList[i];
        } else if (navList[i].children != null) {
            item = navList[i].children.find(el => {
                return el.id === id;
            })
        }
        if (item) {
            return item;
        }
    }
}

export function ToNavPath(item, pageData) {
    Store.commit("yqInfo/SET_NAVID", item)
    let bread = item.menu_name ? item.menu_name + "/" + item.menu_name : item.menu_name
    Store.commit('yqInfo/SET_BREADREUMB', bread)
    Store.commit('yqInfo/SET_PAGEDATA', pageData)
    if (item.children != null) {
        window.localStorage.setItem("LOGIN_USER_BUTTON_AUTH", JSON.stringify(item.children));
    } else {
        window.localStorage.setItem("LOGIN_USER_BUTTON_AUTH", JSON.stringify([]));
    }
    scrollTo(0, 0);
}

export function navigateTo(id, pageData) {
    let navList = Store.state.yqInfo.menuData
    if (pageData) {
        pageData.backNav = Store.state.yqInfo.navId;
    }
    for (let i = 0; i < navList.length; i++) {
        let nav = navList[i];
        if (nav.id == id) {
            ToNavPath(nav, pageData);
            return;
        } else if (nav.children != null) {
            let cnav = nav.children.find(el => {
                return el.id == id;
            })
            if (cnav) {
                ToNavPath(cnav, pageData);
                return;
            } else {
                if (i + 1 === navList.length) {
                    v.$message.warning("此用户未配置该权限!")
                    break;
                }
            }
        }
    }
}

export function getPageData() {
    let pageData = Store.state.yqInfo.pageData;
    if (Store.state.yqInfo.pageData) {
        Store.commit('yqInfo/SET_PAGEDATA', null)
    }
    return pageData;

}

export function Load(text) {
    return Loading.service({
        text: text,
        background: "rgba(20,20,20,0.5)",
        spinner: 'el-icon-loading',
        customClass: "loading-mask"
    })
}

export function yqLoading() {
    return {
        show: (text) => {
            window.$yqLoading = v.$loading({
                lock: true,
                text: text,
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
        },
        hide: () => {
            if (window.$yqLoading) {
                window.$yqLoading.close();
            }
        }
    }
}

export function yqAlert(obj) {
    v.$confirm(obj.content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        showCancelButton: !obj.hideCancel,
        type: 'warning'
    }).then(() => {
        if (obj.suc) {
            obj.suc()
        }
    }).catch(() => {
        if (obj.cancel) {
            obj.cancel()
        }
    });
    // Store.commit("yqInfo/ALERT_FUNC", obj)
}

export function handleOK(obj) {
    if (!obj.path || !obj.formData) return;
    if (obj.valiData) {
        for (var k in obj.valiData) {
            if (obj.formData[k] === "") {
                v.$message.warning(obj.valiData[k])
                return;
            }
        }
    }
    yqLoading().show()
    API.postServerAction(obj.path, obj.formData).then((res) => {
        yqLoading().hide()
        if (res.code == 200) {
            obj.suc(res)
        } else {
            this.$message.error("提交失败！")
        }
    })
}

export function getTestPlugin() {
    return SERVERDATA
}
export function getTestLogData() {
/*
    let ServiceRegInfo = []
    for (let i = 0; i < 50; i++) {
        let tem = {
            name: 'example',
            type: 'onngx',
            startup: 'auto',
            version: '',
            description: '',
            'load-balance': '',
            argv: '',
            lib: '',
            env: '',
            priority: '',
            dir: '/root/insight-server-dev/bin',
            //dir: '/home/kylin/go-space/src/insight-server',
            exe: '',
            platform: '',
            cname: '测试服务示例',
            depends: '',
            startpos: '',
            maxtrystart: 5
        }
        tem.name = tem.name + i;
        ServiceRegInfo.push(tem);
    }
    */
   let ServiceRegInfo = [{
            name: 'example1',
            type: 'onngx',
            startup: 'auto',
            version: '',
            description: '',
            'load-balance': '',
            argv: '',
            lib: '',
            env: '',
            priority: '',
            dir: '/home/kylin/go-space/src/insight-client',
            exe: '',
            platform: '',
            cname: '测试客户端示例',
            depends: '',
            startpos: '',
            maxtrystart: 5
        },{
            name: 'example2',
            type: 'onngx',
            startup: 'auto',
            version: '',
            description: '',
            'load-balance': '',
            argv: '',
            lib: '',
            env: '',
            priority: '',
            dir: '/home/kylin/go-space/src/insight-server',
            exe: '',
            platform: '',
            cname: '测试服务端示例',
            depends: '',
            startpos: '',
            maxtrystart: 5
        },{
            name: 'example3',
            type: 'onngx',
            startup: 'auto',
            version: '',
            description: '',
            'load-balance': '',
            argv: '',
            lib: '',
            env: '',
            priority: '',
            dir: '/home/kylin/go-space/src',
            exe: '',
            platform: '',
            cname: '测试服务示例无日志',
            depends: '',
            startpos: '',
            maxtrystart: 5
        }]
    return { ServiceRegInfo: ServiceRegInfo }
}

export function getneralId(type) {
    var timestamp = new Date().getTime();
    var timestamp32 = timestamp.toString(32);
    let length = 11
    if (length < 9) {
        var start_num = 9 - length;
        var res_str = timestamp32.substring(start_num, 9);
        console.log("ffff", res_str)
    } else if (length > 9) {
        var sublen = length - 9;
        var str = "";
        var str_arr = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
            "_",
        ];
        for (var i = 0; i < sublen; i++) {
            var r = parseInt(Math.random() * 62); //生成0-62之间的随机数
            str += str_arr[r];
        }
        res_str = str + timestamp32;
    }
    return type + "_" + res_str;
}

export function getDeviceState(cb) {
    API.getServerAction("/insight/statusInfo/getAllDeviceIPList").then(res => {
        cb(res)
    })
}

export function testsvg() {
    return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns:svgjs="http://svgjs.dev/svgjs" width="100%" height="100%">
        <image width="824" height="580" xlink:href="http://192.168.16.211:8080/static/upload/image/car1.png"></image>
        <image width="78" height="67" xlink:href="http://192.168.16.211:8080/static/upload/image/server1.png" x="194"
            y="34"></image>
        <image width="89" height="66" xlink:href="http://192.168.16.211:8080/static/upload/image/enternal.png" x="539"
            y="223.99998474121094"></image>
        <polyline points="211,86 131,124 406,282 474,246 533,287 559,273" fill="none" stroke-width="0.6"
            stroke="#ffffff"></polyline>
    </svg>
}
