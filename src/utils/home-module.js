import {formatDate} from "./util"

export const hpm = {
    leftOne: "/home-page/gauge",
    leftTwo: "/home-page/monitor",
    rightOne: "/chart-page/bar-chart",
    rightTwo: "/home-page/status-scan",
    rightThree: "/home-page/cpu-trend",
    rightFour: "/home-page/warning-info",
}
// export const homeModuleList = [
//     { title: "健康度", path: "/home-page/jiankangdu" },
//     { title: "监控总览", path: "/home-page/monitor" },
//     { title: "进程内存使用率Top5", path: "/home-page/software" },
//     { title: "进程CPU使用率Top5", path: "/home-page/process-cpu-bar" },
//     { title: "状态总览", path: "/home-page/status-scan" },
//     // { title: "CPU使用趋势", path: "/home-page/cpu-trend" },
//     // { title: "内存使用趋势", path: "/home-page/ram-trend" },
//     { title: "实时警告信息", path: "/home-page/warning-info" },
// ]

export const hpmA = {
    leftOne: "jiankangdu",
    leftTwo: "jiankongzonglan",
    rightOne: "jcncsyl",
    rightTwo: "rjcpusyl",
    rightThree: "zhuangtaizonglan",
    rightFour: "ssjgxx",
}
export const chartPath = {
    "仪表盘": "/chart-page/gauge-chart",
    "双环形图": "/home-page/monitor",
    "柱状图x": "/chart-page/bar-chart",
    "柱状图": "/chart-page/bar-y-chart",
    "玫瑰图": "/chart-page/rose-chart",
    "饼图": "/chart-page/bie-chart",
    "告警饼图": "/chart-page/warning-pie",
    "折线图": "/chart-page/trend-chart",
    "环形图": "/chart-page/annular-chart",
    "scroll": "/home-page/warning-info",
    "健康度": "/home-page/jiankangdu",
}
export const homeModuleListA = [
    {
        attribute: "",
        create_time: "",
        id: "jiankangdu",
        name: "健康度",
        plugin: "",
        type: "健康度",
        update_time: "",
        isLock: true,
    },
    {
        attribute: "",
        create_time: "",
        id: "jiankongzonglan",
        name: "监控总览",
        plugin: "",
        type: "双环形图",
        update_time: "",
        isLock: true,
    },
    {
        attribute: "",
        create_time: "",
        id: "jcncsyl",
        name: "进程内存使用率",
        plugin: "",
        type: "柱状图x",
        update_time: "",
        isLock: true,
    },
    {
        attribute: "",
        create_time: "",
        id: "jccpusyl",
        name: "进程CPU使用率",
        plugin: "",
        type: "柱状图x",
        update_time: "",
        isLock: true,
    },
    {
        attribute: "",
        create_time: "",
        id: "zhuangtaizonglan",
        name: "状态总览",
        plugin: "",
        type: "告警饼图",
        update_time: "",
        show_type: '0',
    },
    {
        attribute: "",
        create_time: "",
        id: "rjncsyl",
        name: "软件内存使用率",
        plugin: "",
        type: "柱状图x",
        update_time: "",
        isLock: true,
    },
    {
        attribute: "",
        create_time: "",
        id: "rjcpusyl",
        name: "软件CPU使用率",
        plugin: "",
        type: "柱状图x",
        update_time: "",
        isLock: true,
    },
    // {
    //     attribute: "",
    //     create_time: "",
    //     id: "ncsyqs",
    //     name: "内存使用趋势",
    //     plugin: "",
    //     type: "折线图",
    //     update_time: "",
    // },
    // {
    //     attribute: "",
    //     create_time: "",
    //     id: "cpusyqs",
    //     name: "CPU使用趋势",
    //     plugin: "",
    //     type: "折线图",
    //     update_time: "",
    // },
    {
        attribute: "",
        create_time: "",
        id: "ssjgxx",
        name: "实时警告信息",
        plugin: "",
        type: "scroll",
        update_time: "",
        isLock: true,
    },
]
export const chartInfoObj = function () {
    return {
        attribute: "",
        create_time: "",
        id: "",
        name: "",
        plugin: "",
        type: "",
        update_time: "",
    }
}
export const topObj = {
    softCpuNum: 5,
    softRamNum: 5,
    threadCpuNum: 5,
    threadRamNum: 5,
    serviceCpuNum: 5,
    serviceRamNum: 5,
}
export const homePageMixins = {
    components: {
        SubTitle: () => import("@/components/home-page/title.vue"),
    },
    props: ["boxWidth", "moduleKey", "mData", "titleSet", "chartHeight", "chartWidth"],
    data() {
        return {
            drawTimer: null,
            isAni: true,
            ch: '0px',
            titleH: '3.1vh',
            chartId: "chartId",
        }
    },
    created() {
        this.chartId = this.moduleKey + "_" + this.mData.id
        this.ch = 'calc(' + parseFloat(this.chartHeight) + 'px' + ' - ' + this.titleH + ')'
    },
    watch: {
        "$store.state.yqInfo.listenStu"() {
            if (this.$store.state.yqInfo.connectedStu) {
                this.getData();
                this.initDrewTimer()
            } else {
                this.clearDrawTimer()
            }
        },
        chartHeight(h) {
            this.ch = parseFloat(h) - 38 + "px";
            if (this.getMoniterHeight) {
                this.getMoniterHeight();
            }
            if (this.$store.state.yqInfo.connectedStu) {
                this.getData();
                this.initDrewTimer()
            } else {
                this.clearDrawTimer()
            }
        }
    },
    destroyed() {
        this.clearDrawTimer();
    },
    methods: {
        resetTimer() {
            this.getData()
            this.clearDrawTimer();
            this.initDrewTimer()
        },
        initDrewTimer() {
            if (this.drawTimer === null) {
                this.drawTimer = setInterval(() => {
                    this.isAni = false;
                    this.getData();
                }, 1000 * 10);
            }
        },
        clearDrawTimer() {
            if (this.drawTimer) {
                clearInterval(this.drawTimer);
                this.drawTimer = null;
            }

        },
        changeModule() {
            this.$emit("changModule")
        },
        getData() {
            if (this.mData.id == "jccpusyl") {
                this.getCpuTop()
            } else if (this.mData.id == "jcncsyl") {
                this.getRamTop();
            } else if (this.mData.id == "jiankongzonglan") {
                this.getCPURate()
                this.getRAMRate()
            } else if (this.mData.id == "rjcpusyl") {
                this.getSoftCpuTop("procCpu");
            } else if (this.mData.id == "rjncsyl") {
                this.getSoftCpuTop("procMem");
            } else if (this.mData.plugin && (this.mData.type == "饼图" || this.mData.type == "仪表盘" || this.mData.type == "环形图")) {
                this.getPluginSingle()
            } else if (this.mData.plugin) {
                this.getPluginMul()
            } else if (this.mData.id == "jiankangdu") {
                this.getHealthRate()
            } else if (this.mData.id == "zhuangtaizonglan") {
                this.getWariningType()
            }
        },
        getWariningType() {
            this.$api.getServerAction("/insight/alarmInfo/getInfoByType").then((res) => {
                if (res.code == 200) {
                    this.roseData = []
                    let allNum = res.data.reduce((sum, el) => {
                        return sum + Number(el.alarm_total)
                    }, 0)
                    res.data.forEach((el) => {
                        let tem = {
                            name: el.alarm_type,
                            value: Number((el.alarm_total / allNum * 100).toFixed(2)),
                        }
                        this.roseData.push(tem)
                    })
                    // console.log("rosedata == ",this.roseData)
                    this.drawStatus();
                    // this.drawRose()
                }
            })
        },
        getHealthRate() {
            let pams = {
                ip: this.$store.state.yqInfo.chooseIP,
            }
            this.$api.getServerAction("/insight/telegraf/getHealthyNum", pams).then((res) => {
                if (res.code == 200) {
                    this.detailInfo = res.data;
                    this.healthDegree = res.data.total;
                    this.drawStatus();
                }
            })
        },
        getPluginSingle() {
            let pams = {
                ip: this.$store.state.yqInfo.chooseIP,
                pluginCode: this.mData.plugin,
                fieldName: this.mData.attribute,
            };
            this.$api
                .getServerAction("/insight/plugin/findOneByInfluxDB", pams)
                .then((res) => {
                    this.roseData = [];
                    this.chartTitle = "";
                    this.gaugeTitle = "";
                    this.healthDegree = "";
                    this.rateNum = 0;
                    if (res.code == 200 && res.data) {
                        this.chartTitle = formatDate(res.data.time)
                        this.rateNum = res.data.value;
                        let msg = this.mData.attribute == 'memRate' ? "内存使用率" : "CPU使用率"
                        this.annularTitle = msg;
                        this.gaugeTitle = msg;
                        this.healthDegree = res.data.value
                        this.roseData = [
                            {
                                name: msg,
                                value: res.data.value,
                                startColor: "#CEDD3D",
                                endColor: "#5DC656",

                            },
                            {
                                name: "",
                                value: 100 - res.data.value,
                                startColor: "#F9E10C",
                                endColor: "#E6AB13",
                            }
                        ]

                    }
                    this.drawStatus();

                });
        },
        getPluginMul() {
            let pams = {
                ip: this.$store.state.yqInfo.chooseIP,
                pluginCode: this.mData.plugin,
                fieldName: this.mData.attribute,
                sum: 5,
            };
            this.$api
                .getServerAction("/insight/plugin/findByInfluxDB", pams)
                .then((res) => {
                    if (this.mData.type == "柱状图") {
                        this.barData.data = []
                        this.barData.yAxisData = []
                    } else if (this.mData.type == "折线图") {
                        this.values = []
                        this.xData = []
                    }
                    if (res.code == 200 && res.data) {
                        res.data.forEach(element => {
                            let time = formatDate(element.time)
                            if (this.mData.type == "柱状图") {
                                this.barData.data.unshift(element.value)
                                this.barData.yAxisData.unshift(time)
                            } else if (this.mData.type == "折线图") {
                                this.values.unshift(element.value)
                                this.xData.unshift(time);
                            }
                        });

                    }
                    if (this.mData.type == "柱状图") {
                        this.drawBar();
                    } else if (this.mData.type == "折线图") {
                        this.drawTrend();
                    }
                });
        },
        getCpuTop() {
            let pams = {
                ip: this.$store.state.yqInfo.chooseIP,
                num: this.$store.state.yqInfo.topObj.threadCpuNum,
            };
            this.$api
                .getServerAction("/insight/telegraf/processCpuRateFrontByNum", pams)
                .then((res) => {
                    this.barData.data = []
                    this.barData.yAxisData = []
                    if (res.code == 200 && res.data) {
                        res.data.forEach(element => {
                            this.barData.data.unshift(element.procCpu)
                            this.barData.yAxisData.unshift(element.procName)
                        });
                    }
                    this.moduleTitle = "进程CPU使用率TOP" + this.$store.state.yqInfo.topObj.threadCpuNum
                    this.drawBar();
                });
        },
        getRamTop() {
            let pams = {
                ip: this.$store.state.yqInfo.chooseIP,
                num: this.$store.state.yqInfo.topObj.threadRamNum,
            };
            this.$api
                .getServerAction("/insight/telegraf/processMemRateFrontByNum", pams)
                .then((res) => {
                    this.barData.data = []
                    this.barData.yAxisData = []
                    if (res.code == 200 && res.data) {
                        res.data.forEach(element => {
                            this.barData.data.unshift(element.procMem)
                            this.barData.yAxisData.unshift(element.procName)
                        });
                    }
                    ;
                    this.moduleTitle = "进程内存使用率TOP" + this.$store.state.yqInfo.topObj.threadRamNum
                    this.drawBar();
                });
        },
        getSoftCpuTop(type) {
            let num;
            if (type == "procCpu") {
                num = this.$store.state.yqInfo.topObj.softCpuNum
                this.moduleTitle = "软件CPU使用率TOP" + num
            } else if (type == "procMem") {
                num = this.$store.state.yqInfo.topObj.softRamNum
                this.moduleTitle = "软件CPU使用率TOP" + num
            }
            let pams = {
                ip: this.$store.state.yqInfo.chooseIP,
                num: num,
                sortBy: type,
            };
            this.$api
                .getServerAction("/insight/softwareMonitor/softwareFrontByNum", pams)
                .then((res) => {
                    this.barData.data = []
                    this.barData.yAxisData = []
                    if (res.code == 200 && res.data) {
                        res.data.forEach(element => {
                            this.barData.data.unshift(element[type])
                            this.barData.yAxisData.unshift(element.procName)
                        });
                    }
                    ;
                    this.drawBar();
                });
        },
    }
}
let dicts = []
export const dictMixins = {
    filters: {
        dict(v) {
            if (v) {
                console.log(dicts)
                const dict = dicts.find(d => d.value === v)
                if (dict) {
                    return dict.name
                }
            }
        },
    },
    methods: {
        getValueByDict(type) {
            dicts = []
            this.$api.getServerAction("/insight/dictItem/getDictItemList", {value: type}).then((dict) => {
                if (dict.code == 200) {
                    if (dict.data != null) {
                        dicts = dict.data
                    } else {
                        dicts = []
                    }
                } else {
                    dicts = []
                }
            });
        },
    }
}
