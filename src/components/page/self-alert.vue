<template>
  <div class="yq-alert-style">
    <div class="loading-box" v-if="alertObj">
      <div class="alert alert-bg">
        <div>{{ alertObj.content }}</div>
        <div class="alert-button">
          <div @click="alertCancel" v-if="!alertObj.hideCancel" style="margin-right:16px">
            <tis-button type="primary">取消</tis-button>
          </div>
          <div @click="alertConfirm">
            <tis-button type="danger">确定</tis-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["alertObj"],
  data() {
    return {};
  },
  created() {},
  methods: {
    alertConfirm() {
      if (this.alertObj.suc) {
        this.alertObj.suc();
      }
      this.$store.commit("yqInfo/ALERT_FUNC", null);
    },
    alertCancel() {
      if (this.alertObj.cancel) {
        this.alertObj.cancel();
      }
      this.$store.commit("yqInfo/ALERT_FUNC", null);
    },
  },
};
</script>
<style lang='scss' scoped>
.yq-alert-style {
  .loading-box {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .alert {
    width: 500px;
    min-height: 180px;
    border-radius: 5px;
    border: var(--status-bar-tools-border);
    position: relative;
    text-align: left;
    padding: 16px;
    font-size: var(--text-size-small);
  }
  .alert-button {
    position: absolute;
    bottom: 16px;
    right: 16px;
    display: flex;
    align-items: center;
  }
}
</style>