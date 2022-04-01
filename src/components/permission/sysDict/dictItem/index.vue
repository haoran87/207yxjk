<template>
  <div>
    <div class="flex-between">
      <div class="input-box">
        <div class="input-label">名 称</div>
        <div class="input-con">
          <tis-input v-model="name" placeholder="请输入"></tis-input>
        </div>
        <tis-button type="primary" @click="search">查 询</tis-button>
        <tis-button type="info" @click="clean">重 置</tis-button>
        <tis-button type="primary" @click="addForm">添 加</tis-button>
        <!-- <tis-button type="primary" @click="closeItem">返 回</tis-button> -->
      </div>
      <div style="margin-right:16px">
            <span @click="closeItem">
              <icon :name="'back'" :size="'24'" :color="'#E4E4E4'"></icon>
            </span>
          </div>
    </div>

    <div style="margin: 0 16px 0">
      <self-table
        ref="selfTable"
        :tableData="tableData"
        :tableObj="tableObj"
        :tableHeight="$store.state.yqInfo.MAINHEIGHT - 56 - 48"
      >
        <template v-slot:status="props">
          <span v-if="props.cellValue == 0">否</span>
          <span v-else-if="props.cellValue == 1">是</span>
        </template>
        <template v-slot:handle="props">
          <div class="selected-color">
            <span @click="editForm(props.cellData)">编 辑</span>{{ "&nbsp;" }}
            <span @click="deleteDict(props.cellData)">删 除</span>
          </div>
        </template>
      </self-table>
    </div>
    <list-page
      :pageInfo="pageInfo"
      :curPage="curPage"
      :pageSize="pageSize"
      @cpc="curPageChange"
    ></list-page>

    <dictForm
      :form="form"
      :dictId="dictId"
      :edit="show"
      @page="search"
      @close="close"
    ></dictForm>
  </div>
</template>

<script>
import dictForm from "./form";

export default {
  data() {
    return {
      curPage: 1,
      pageSize: 15,
      pageInfo: null,
      name: "", //名称
      tableObj: {
        name: {
          slot: false,
          lable: "名称",
          class: "tabel-col-2",
          sortable: false,
        },
        value: {
          slot: false,
          lable: "数据值",
          class: "tabel-col-2",
          sortable: false,
        },
        status: {
          slot: true,
          lable: "可用",
          class: "tabel-col-2",
          sortable: false,
        },
        sort: {
          slot: false,
          lable: "排序",
          class: "tabel-col-1",
          sortable: false,
        },

        handle: {
          slot: true,
          lable: "操作",
          class: "tabel-col-2 handle-cell",
          sortable: false,
        },
      },
      tableData: [], //列表信息
      form: {}, //表单信息
      show: false,
    };
  },
  components: { dictForm },
  mounted() {
    //列表展示查询
    this.loadData();
  },
  props: {
    dictId: String,
  },
  methods: {
    //返回
    closeItem() {
      this.$emit("closeItem");
    },
    /**
     * 重置
     */
    clean() {
      this.curPage = 1;
      this.name = null;
      this.value = null;
      this.loadData();
    },
    /**
     * 查询
     */
    search() {
      this.curPage = 1;
      this.loadData();
    },
    /**
     * 关闭弹窗
     */
    close() {
      this.show = false;
    },
    /**
     * 查询结果
     */
    loadData() {
      this.$yqLoading.show();
      let path = "/insight/dictItem/page";
      let params = {
        page_no: this.curPage,
        page_size: this.pageSize,
        dictId: this.dictId,
        name: this.name,
      };
      this.$api.getServerAction(path, params).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          let tem = [];
          this.tableData = tem.concat(res.data.items);
          this.pageInfo = res.data.page;
        } else {
          this.$message.error(res.info);
        }
      });
    },
    /**
     * 添加
     */
    addForm() {
      this.form = { status: "1" };
      this.show = true;
    },
    /**
     * 修改
     */
    editForm(item) {
      this.form = {};
      this.form = JSON.parse(JSON.stringify(item));
      this.show = true;
    },
    /**
     * 删除
     */
    deleteDict(item) {
      this.$yqAlert({
        content: "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/dictItem/delete", { id: item.id })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.loadData();
              } else {
                this.$message.warning("删除失败！");
              }
            });
        },
      });
    },
    /**
     * 分页
     * @param e
     */
    curPageChange(e) {
      this.curPage = e;
      this.loadData();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
