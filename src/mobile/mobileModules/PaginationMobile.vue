<template>
  <div class="flex" style="padding: 7px 0" v-if="pageInfo">
    <div >
      <m-pagination
        v-model="currentPage"
        :page-count="pageInfo.page_count"
        :total-items="pageInfo.total_count"
        :items-per-page="pageInfo.page_size"
        :show-page-size="6"
        force-ellipses
        @change="pageChange"
      >
      </m-pagination>
    </div>
    <span class="p-count">共 {{ pageInfo.page_count }} 页 </span>
    <span class="p-count">共 {{ pageInfo.total_count }} 条 </span>
  </div>
</template>

<script>
export default {
  props: ["pageInfo", "curPage"],
  data() {
    return {
      currentPage: 1,
    };
  },
  created() {
      
  },
  watch: {
    curPage(newv) {
      this.currentPage = newv;
    },
  },
  methods: {
    pageChange(e) {
      this.$emit("pageChange", e);
    },
  },
};
</script>

<style lang="scss" scoped>
.p-count {
  margin-left: 12px;
}
</style>