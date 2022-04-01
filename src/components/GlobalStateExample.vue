<template>
  <div class="card">
    <h3>读取/设置 全局变量示例</h3>
    <div>请在输入框里填写全局变量key:</div>
    <br />
    <input v-model="key" />
    <br />
    <br />
    <button @click="onSetValue">设置{{key}}全局变量</button>
    <button @click="onGetValue">获取{{key}}全局变量</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: "some_key",
    };
  },
  methods: {
    onSetValue() {
      const value = prompt(`请输入全局变量${this.key}的值:`);
      this.$tis.setGlobalState(this.key, value);
    },
    onGetValue() {
      const value = this.$tis.getGlobalState(this.key);
      alert(`全局变量${this.key}的值为:${value}`);
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
</style>