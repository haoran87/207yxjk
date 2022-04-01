<template>
  <transition name="fade" mode="out-in">
    <div>
      <div class="bottom-bar bottom-bg navbar-fixed-bottom">
        <div class="bottom-logo" @click="goIndex">
          <div class="bottom-logo-dot">
            <i class="el-icon-more"></i>
          </div>
        </div>
        <div class="yq-bottom-content">
          <div class="bottom-right" style="position: relative"></div>
          <div class="bottom-left" v-if="!isScan && !isCarManage">
            <div style="display: flex; align-item: center; height: 40px">
              <!-- <div style="margin-right: 32px">
                <tis-button
                  :size="btnSize"
                  type="primary"
                  @click="scanTopo"
                  >力导向效果展示</tis-button>
              </div> -->
              <div style="margin-right: 32px">
                <tis-button
                  :size="btnSize"
                  type="primary"
                  :disabled="footerText == '编辑背景'"
                  @click="upStep"
                  >上一步</tis-button
                >
              </div>
              <div style="margin-right: 32px">
                <tis-button
                  type="primary"
                  :size="btnSize"
                  :disabled="footerText == '保存'"
                  @click="nextStep"
                  >下一步</tis-button
                >
              </div>
              <div style="margin-right: 32px">
                <tis-button
                  :size="btnSize"
                  type="info"
                  @click="cancelEdit"
                  >取消</tis-button
                >
              </div>
              <div>
                <tis-button
                  :size="btnSize"
                  type="danger"
                  @click="confirm"
                  >保存</tis-button
                >
              </div>
              <!-- <div >
                <tis-button type="danger" @click="footerClick">{{footerText}}</tis-button>
              </div> -->
            </div>
          </div>
          <div class="bottom-left" v-else-if="isScan">
            <div class="bottom-btn" style="margin-right: 16px">
              <tis-button
                :size="btnSize"
                type="danger"
                style="margin-right: 32px"
                @click="cancelScan"
                >返回</tis-button
              >
            </div>
          </div>
          <div class="bottom-left" v-else-if="isCarManage">
            <div
              class="bottom-btn"
              style="margin-right: 16px"
              @click="cancelManageCar"
            >
              <tis-button :size="btnSize" type="danger"
                >返回拓扑图</tis-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  components: {},
  props: ["isScan", "isCarManage", "footerText"],
  data() {
    return {
      btnSize: "",
    };
  },
  created() {
    if (this.$platform.type === "pad") {
      this.btnSize = "medium ";
    } else {
      this.btnSize = "small";
    }
  },
  mounted() {},
  destroyed() {},
  computed: {},
  methods: {
    goIndex() {
      this.$store.commit("yqInfo/CHANGE_BSTU", 2);
      this.$navigateTo(1);
    },
    cancelScan() {
      this.$emit("cancelScan");
    },
    scanTopo() {
      this.$emit("scan");
    },
    cancelEdit() {
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("confirm");
    },
    upStep() {
      let type;
      switch (this.footerText) {
        case "添加设备":
          type = "info";
          break;
        case "连接设备":
          type = "bg";
          break;
        case "保存":
          type = "device";
          break;
      }
      this.$emit("footerClick", type);
    },
    nextStep() {
      this.footerClick();
    },
    footerClick() {
      let type;
      switch (this.footerText) {
        case "编辑背景":
          type = "bg";
          break;
        case "添加设备":
          type = "device";
          break;
        case "连接设备":
          type = "lines";
          break;
        case "保存":
          type = "preserve";
          break;
      }
      this.$emit("footerClick", type);
    },
    cancelManageCar() {
      this.$emit("hideCarManage");
    },
  },
};
</script>
<style lang="scss" scoped>
@import url("../../assets/css/bottom.scss");
.yqxxkjPad {
  .bottom-bar {
    height: 5.469vw !important;
    line-height: 5.469vw !important;
    font-size: var(--app-title-size) !important;
  }
}
</style>