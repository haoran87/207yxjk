<template>
  <div>
    <div class="dateInput">
      <div @click="showDateFunc">
        <span v-if="dateStr">{{ dateStr }}</span>
        <span v-else>{{ placeHolder }}</span>
      </div>
      <m-overlay z-index="100" :show="showPicker" @click="showPicker = false" />
      <div class="m-date-box" v-if="showPicker">
        <m-datetime-picker
          v-model="currentDate"
          type="date"
          :cancel-button-text="'清除'"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dateStr: {
      default: "",
      type: String,
      required: false,
    },
    placeHolder: {
      default: "请选择日期",
      type: String,
      required: false,
    },
  },
  data() {
    return {
      minDate: new Date(),
      maxDate: new Date(),
      currentDate: new Date(),
      showPicker: false,
    };
  },
  created() {
    this.initM();
  },
  mounted() {},
  methods: {
    initM() {
      let y = this.currentDate.getFullYear();
      this.minDate = new Date(y - 3, 0, 1);
      this.maxDate = new Date(y + 3, 11, 1);
    },
    onCancel() {
      this.showPicker = false;
      this.$emit("confirm", "");
    },
    onConfirm(e) {
      this.showPicker = false;
      this.$emit("confirm", this.dateFomatter(e));
    },
    showDateFunc() {
      this.showPicker = true;
    },
    dateFomatter(d) {
      let month = d.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = d.getDate();
      day = day < 10 ? "0" + day : day;
      return d.getFullYear() + "-" + month + "-" + day;
    },
  },
};
</script>

<style lang='scss' scoped>
.dateInput {
  width: 120px;
  line-height: 24px;
  padding: 5px;
  color: #fff;
  background-color: #21201e;
  border: solid 1px #494848;
  position: relative;
  font-size: 14px;
}
.m-date-box {
  position: absolute;
  width: 240px;
  top: 35px;
  left: -60px;
  z-index: 101;
}
</style>