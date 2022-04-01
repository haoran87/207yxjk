export const pluginMixin = {
    data() {
        return {
          pluginName: "",
          pluginList: [],
          showPop: false,
          popTitle: "添加插件",
          isLoad: true,
          formData: null,
          pageInfo: null,
          curPage: 1,
          pageSize: 15,
        };
      },
      created() {
        this.getPluginsList();
      },
      mounted() {
      },
      methods: {
        check() {
          this.$refs.pform.validateSubmit()
        },
        submit() {
          this.$yqLoading.show();
          let path = this.$refs.pform.pluginObj.id
              ? "/insight/plugin/edit"
              : "/insight/plugin/create";
          this.$api.postServerAction(path, this.$refs.pform.pluginObj, this.$refs.pform.validObj).then((res) => {
                this.$yqLoading.hide();
               if(res.success){
                 this.$message.success("提交成功");
                 this.getPluginsList();
                 this.showPop = false;
              }else {
                 this.$message.error(res.info)
               }
            })
    
        },
        itemInstall(install, idx) {
          console.log("ddd", this.$yqLoading);
          let text = install ? "加载插件" : "";
          this.$yqLoading.show(text);
          let path = "/insight/plugin/install";
          this.pluginList[idx].install = install;
          console.log("加载卸载插件", this.pluginList[idx]);
          this.$api.postServerAction(path, this.pluginList[idx]).then(
              (res) => {
                this.$yqLoading.hide();
                if (res.code == 200) {
                  this.getPluginsList();
                  this.$message({
                    message: install ? "插件已加载" : "插件已卸载！",
                    type: install ? "success" : "warning",
                  });
                } else {
                  this.$message.error(res.info);
                }
              },
              (error) => {
                console.log("请求报错", error);
              }
          );
        },
        closePop() {
          this.showPop = false;
        },
        itemEdit(idx) {
          this.popTitle = "编辑插件";
          this.formData = JSON.parse(JSON.stringify(this.pluginList[idx]));
          if (this.$refs.pform) {
            this.$refs.pform.pluginObj = this.formData;
          }
          this.showPop = !this.showPop;
        },
        addPluginClick() {
          if (this.$refs.pform) {
            this.$refs.pform.initFormData();
          }
          this.popTitle = "添加插件";
          this.showPop = !this.showPop;
        },
        searchPlugin() {
          this.getPluginsList();
        },
        resetPlugin() {
          this.pluginName = "";
          this.getPluginsList();
        },
        curPageChange(e) {
          this.curPage = e;
          this.getPluginsList();
        },
        getPluginsList() {
          this.$yqLoading.show();
          let path = "/insight/plugin/list";
          let params = {
            name: this.pluginName,
            page_no: this.curPage,
            page_size: this.pageSize,
          };
          //测试数据据
          // this.pluginList = getTestPlugin();
          this.$api.getServerAction(path, params).then(
              (res) => {
                this.$yqLoading.hide();
                if (res.code == 200) {
                  this.pluginList = res.data.items;
                  this.pageInfo = res.data.page;
                }
              },
              (err) => {
                this.$message.error("服务器拒绝访问！");
                console.log("获取插件报错", err);
                this.$yqLoading.hide();
              }
          );
        },
      },
    
}