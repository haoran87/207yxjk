export const serviceMixin = {
    data() {
        return {
            totalSum: 0,
            successSum: 0,
            errorSum: 0,
            isAll: false,
            serviceName: "",
            procPath: "",
            typeValue: "",
            stuValue: "",
            tableData: [],
            tableObj: {
                cName: {
                    slot: false,
                    lable: "服务名称",
                    class: "tabel-col-2",
                    sortable: false,
                },
                cpuUsage: {
                    slot: true,
                    lable: "CPU占用率",
                    class: "tabel-col-2 tabel-content-center",
                    sortable: true,
                },
                memUsage: {
                    slot: true,
                    lable: "内存占用",
                    class: "tabel-col-2 tabel-content-center",
                    sortable: true,
                },
                status: {
                    slot: true,
                    lable: "进行状态",
                    class: "tabel-col-2 tabel-content-center",
                    sortable: true,
                },
                startup: {
                    slot: true,
                    lable: "启动形式",
                    class: "tabel-col-2 tabel-content-center",
                    sortable: true,
                },
                handle: {
                    slot: true,
                    lable: "操作",
                    class: "tabel-col-2 handle-cell",
                    sortable: false,
                },
            },
            multipleSelection: [],
            value1: "",
            pageInfo: null,
            curPage: 1,
            pageSize: 10,
            sortKey: "",
            sortType: "",
        };
    },
    created() {
        this.resetKey();
     },
     mounted() {},
     methods: {
       showCard() {
         this.$emit("showCard", "card");
       },
       startOff(item, type) {
         let url;
         let showMessage = "";
         if (type == 2) {
           url = window.STOPSERVICE;
           showMessage = "停用";
         } else if (type == 1) {
           url = window.STARTSERVICE;
           showMessage = "启用";
         }
         // console.log("启用禁用", item);
         let pams = {
           service: item.serverName,
           node: this.$store.state.yqInfo.chooseIP,
         };
   
         let contentStr = "确认" + showMessage + item.cName + "？";
   
         this.$yqAlert({
           content: contentStr,
           hideCancel: false,
           suc: () => {
             this.$yqLoading.show();
             this.$api.getOutServerAction(url, pams).then((res) => {
               if (res.return && res.return.toLowerCase() == "ok") {
                 this.$message.success(showMessage + "成功，正在" + showMessage);
               } else {
                 this.$message.error(showMessage + "失败");
               }
               setTimeout(() => {
                 //执行启停反应没那么快，等待2秒后再重新刷新列表
                 this.getServiceList();
                 this.$yqLoading.hide();
               }, 2000);
             });
           },
         });
       },
       sortClick(e) {
         this.sortKey = e.sortKey;
         this.sortType = e.sortType;
         this.getServiceList();
       },
       resetKey() {
         this.serviceName = "";
         this.getServiceList();
       },
       searchKey() {
         this.getServiceList();
       },
       curPageChange(e) {
         this.curPage = e;
         this.getServiceList();
       },
       getServiceList() {
           console.log("执行了吗 === ",this.$store.state.yqInfo.chooseIP)
         let that = this;
         let pams = {
           node: this.$store.state.yqInfo.chooseIP,
         };
         this.$yqLoading.show();
         this.tableData = [];
         this.$api
           .getOutServerAction(window.ALLSERVICELOADINFO, pams)
           .then((res) => {
             if (res.errCode === 0) {
               // console.log("获取的结果",res.data.serviceList,that.serviceName)
               this.$yqLoading.hide()
               if (res.data.serviceList.length > 0) {
                 let temData = [];
                 if (
                   that.serviceName == undefined ||
                   that.serviceName == "" ||
                   that.serviceName == null
                 ) {
                   temData = res.data.serviceList.slice();
                 } else {
                   for (let i = 0; i < res.data.serviceList.length; i++) {
                     if (
                       res.data.serviceList[i].cName.indexOf(that.serviceName) !=
                       -1
                     ) {
                       temData.push(res.data.serviceList[i]);
                     }
                   }
                 }
                 this.successSum = 0
                 this.totalSum = 0
                 this.errorSum = 0
                 temData.forEach(o => {
                   if (o.status === 0) {
                     this.successSum += 1
                   } else {
                     this.errorSum += 1
                   }
                 })
                 this.totalSum=temData.length
                 if (this.sortKey && this.sortType) {
                   this.sortTableData(temData);
                 } else {
                   this.tableData = temData;
                 }
               }
             }
           });
       },
       sortTableData(arr) {
         arr.sort((m, n) => {
           let a = m[this.sortKey];
           let b = n[this.sortKey];
           if (this.sortType === "asc") {
             if (a < b) return -1;
             if (a > b) return 1;
             return 0;
           } else if (this.sortType === "desc") {
             if (a < b) return 1;
             if (a > b) return -1;
             return 0;
           }
         });
         this.tableData = arr;
       },
     },
}