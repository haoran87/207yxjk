<template>
  <div v-if="pluginItem">
    <div class="plugin-item-title">
      <div class="plugin-logo">
        <img
          v-if="pluginItem.icon"
          :src="
            $store.state.yqInfo.serverIp +
            '/insight/plugin/download/' +
            pluginItem.icon
          "
          style="width: 2vw;height: 2vw;"
          alt=""
        />
        <i v-else class="el-icon-s-operation"></i>
      </div>
      <div class="title-content">
        <div class="title-content-z text-line-double">
          {{ pluginItem.name }}
        </div>
        <div class="title-content-e text-line-only">{{ pluginItem.code }}</div>
      </div>
    </div>
    <div class="plugin-item-content">
      <div class="p-con-item">
        <div class="plugin-content-top "  >插件类型</div>
        <span style="color:var(--color-5)"> {{typeArr[pluginItem.type]}}</span>
      </div>
      <div class="p-con-item">
        <div class="plugin-content-top">插件状态</div>
        <div class="plugin-content-bottom" v-if="pluginItem.show_status == 3">
          <span class="stu-dot stu-dot-primary"></span>
          <span>已启用</span>
        </div>
        <div
          class="plugin-content-bottom"
          v-else-if="pluginItem.show_status == 2"
        >
          <span class="stu-dot stu-dot-warning"></span>
          <span>未启用</span>
        </div>
        <div
          class="plugin-content-bottom"
          v-else-if="pluginItem.show_status == 1"
        >
          <span class="stu-dot stu-dot-danger"></span>
          <span>未加载</span>
        </div>
      </div>
      <!-- <div class="p-con-item">
        <div class="plugin-content-top">应用类型</div>
        <div>{{ pluginItem.type }}</div>
      </div> -->
    </div>
    <!-- <div class="plugin-refresh">
      <i class="el-icon-refresh-right"></i>
    </div> -->
    <div class="plugin-bottom" v-if="!isInfo">
      <div class="plugin-bottom-item" @click="pluginEdit" v-has="'update'">编辑</div>
      <div
        class="plugin-bottom-item"
        @click="installClick(true)"
        v-if="pluginItem.show_status == 1"
      >
        加载
      </div>
      <div class="plugin-bottom-item" @click="installClick(false)" v-else>
        卸载
      </div>
      <div
        class="plugin-bottom-item hide-line"
        v-if="pluginItem.show_status == 3"
        @click="onOffClick(false)"
      >
        禁用
      </div>
      <div
        class="plugin-bottom-item hide-line"
        v-else
        @click="onOffClick(true)"
      >
        启用
      </div>
    </div>
    <div class="plugin-info-bottom" v-else>
      <tis-button
      style="width: 80%"
      type="primary"
      plain
      round
      @click="toDetail"
        >查看详情</tis-button
      >
    </div>
  </div>
</template>
<script>
export default {
  props: ["pluginItem", "isInfo"],
  data() {
    return {
      visible: false,
      throtting: false,
      typeArr:{
         'server':'服务',
           "script":'脚本'
      },
    };
  },
  created() {
    // console.log("接收到的组件信息",this.pluginItem)
  },
  mounted() {},
  methods: {
    toDetail(){
      this.$emit("showDetail",this.pluginItem)
    },
    installClick(install) {
      this.$emit("installClick", install);
    },
    onOffClick(enable) {
      if (this.pluginItem.show_status == 1) {
        this.$message({
          message: "请先加载插件！",
        });
        return;
      }
      let path = "/insight/plugin/enable";
      this.pluginItem.enable = enable;
      this.$api.postServerAction(path, this.pluginItem).then((res) => {
        if (res.code == 200) {
          this.pluginItem.show_status = enable ? 3 : 2;
          this.$message({
            message: enable ? "插件已启用！" : "插件已禁用！",
            type: enable ? "success" : "warning"
          });
        } else {
          this.$message.error(res.info)
        }
      });
    },
    unloadClick() {
      this.visible = false;
    },
    loadClick() {
      this.visible = false;
    },
    pluginEdit() {
      this.$emit("pluginEdit");
    },
  },
};
</script>
<style lang='scss' scoped>
  // @import "../../../assets/css/test.scss";
.num-text {
  color: var(--color-5);
}
.stu {
  display: flex;
  justify-content: center;
  align-items: center;
}

.p-con-item {
  width: calc(100% / 3);
}
.plugin-content-top {
  margin-bottom: 8px;
}
.plugin-item-content {
  margin: 16px;
  display: flex;
  justify-content: space-around;
  color: var(--text-color-weak);
  font-size: var(--text-size-small);
}
.plugin-item-title {
  display: flex;
  margin: 28px 16px;
  align-items: center;
}
.plugin-logo {
  color: var(--color-5);
  font-size: 2vw;
  margin-right: 8px;
}
.title-content {
  text-align: left;
  font-size: var(--tab-title-size);
}
.title-content-e {
  color: var(--text-color-weak);
  font-size: var(--text-size-small);
}
.plugin-bottom {
  /* position: absolute; */
   margin-top:32px;
  bottom: 0;
  width: 100%;
  background-color: var(--status-bar-tools-bg);
  display: flex;
   font-size: var(--text-size-small);
  line-height: 2.4vw;
}

.plugin-info-bottom {
  /* position: absolute; */
  margin-top:32px;
  bottom: 0;
  width: 100%;
  display: flex;
  text-align: center;
  display: block;
  padding: 0;
  padding-bottom: 16px;
}
.plugin-bottom-item {
  width: calc(100% / 3);
  text-align: center;
  border-right: var(--status-bar-tools-border);
}
.plugin-refresh {
  position: absolute;
  right: 16px;
  top: 16px;
}
.hide-line {
  border: none;
}

</style>
