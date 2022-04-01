<template>
  <div class="card">
    <h3 class="title">事件通信示例1</h3>
    <div>我的计数器数值：{{ count }}</div>
    <div class="msg" v-if="msg">收到消息: {{ msg }}</div>
    <button @click="onIncrease">计数器+1</button>
    <button @click="onSendMsg">把我的计数器数值发送给其他应用和组件</button>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      count: 0,
      msg: "",
    };
  },
  computed: {},
  created() {
    // console.log('gggg',this.$tis)
    // this._off = this.$tis.$on(
    //   "COUNT", //  监听的事件
    //   { appIds: ["widget_demo"] }, // 限定监听来源
    //   (payload) => {
    //     this.msg = payload;
    //   }
    // );
  },
  beforeDestroy() {
    if (this._off) {
      this._off();
    }
  },
  methods: {
    onIncrease() {
      this.count++;
    },
    onSendMsg() {
      this.$tis.$emit("COUNT", this.$tis.appId + " count is " + this.count);
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid #fff;
  padding: 5px;
  margin: 10px;
}
button {
  font-size: var(--text-size-light);
  padding: 2px 10px;
  cursor: pointer;
  margin: 10px;
}
.msg {
  color: red;
}
</style>
