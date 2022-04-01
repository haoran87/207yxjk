<template>
  <div>
    <div class="bar-back-nav">
      <span>连接设备</span>
      <!-- <tis-button type="primary"  @click="editLine(null)">
        新增折线
      </tis-button> -->
     <!-- <div class="back-left" @click="linesOK(1)">
        <icon :name="'back'" :size="'24'"></icon>
      </div> -->
    </div>
    <!-- <div>
      <tis-button type="danger" class="button-item" @click="delEdges"
        >删除</tis-button
      >
    </div> -->
    <!-- <div>
      <tis-button type="primary" class="button-item" @click="linesOK(2)"
        >完成并保存</tis-button
      >
    </div> -->
  </div>
</template>
<script>
// import bus from "@/utils/bus";
export default {
  props: [],
  data() {
    return {
      lineList: [],
    };
  },
  created() {
    this.lineList =
      this.$parent.$parent.$parent.$parent.$refs.drawsvg.svgObj.lineList;
  },
  methods: {
    linesOK(doType) {
      this.$emit("linesOK",doType);
    },
    delEdges() {
      this.$parent.delEdges();
    },
  },
};
</script>
<style lang="scss" scoped>
.button-item {
  width: 100%;
  margin-bottom: 16px;
}
</style>