<template>
  <div class="pagination-box" v-if="pageInfo">
    <div style="display: inherit; align-items: center">
      <div style="margin-right: 16px">
        <tis-pagination
          layout="prev, pager, next"
          :total="pageInfo.total_count"
          :background="true"
          @current-change="curPageChange"
          :current-page="curPage"
          :page-size='pageSize'
        >
        </tis-pagination>
      </div>
      <div style="margin-right: 16px">
        共{{  pageInfo.page_count }}页
      </div>
      <div style="margin-right: 16px">
        共{{ pageInfo.total_count}}条
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["pageInfo","curPage","pageSize"],
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    curPageChange(e) {
      this.$emit("cpc",e)
    },
  },
};
</script>
<style lang="scss" scoped>
.pagination-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin:8px;
}
</style>