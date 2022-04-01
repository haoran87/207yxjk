<template>
  <div>
    <box-show :style="{'height':$store.state.yqInfo.MAINHEIGHT+'px'}">
      <div v-if="!drawer">
        <div class="input-box">
          <div class="input-label">字典名称:</div>
          <div class="input-con">
            <tis-input v-model="name" placeholder="请输入"></tis-input>
          </div>
          <div class="input-label">字典编号:</div>
          <div class="input-con">
            <tis-input
                v-model="value"
                placeholder="请输入"
            >
            </tis-input>
          </div>
          <tis-button type="primary" @click="search">查 询</tis-button>
          <tis-button type="info" @click="clean">重 置</tis-button>
          <tis-button type="primary" @click="addForm">添 加</tis-button>
        </div>
        <div style="margin: 0 16px 0">
          <self-table
              ref="selfTable"
              :tableData="tableData"
              :tableObj="tableObj"
              :tableHeight='$store.state.yqInfo.MAINHEIGHT - 56 - 48 '
          >
            <template v-slot:handle="props">
              <div class="selected-color">
                <span @click="setItem(props.cellData)">字典配置</span>{{ "&nbsp;" }}
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
      </div>
      <div v-else>
        <dict-item :dictId="dictId" @closeItem="closeItem"></dict-item>
      </div>
    </box-show>
    <dictForm :form="form" :edit="show" @page="search" @close="close"></dictForm>

  </div>
</template>

<script>

import dictForm from "./form";
import dictItem from "./dictItem/index";

export default {
  data() {
    return {
      drawer: false,
      curPage: 1,
      pageSize: 15,
      pageInfo: null,
      dictId: "",//字典ID
      name: "",//字典名称
      value: "",//字典编号
      tableObj: {
        name: {
          slot: false,
          lable: "字典名称",
          class: "tabel-col-2",
          sortable: false,
        },
        value: {
          slot: false,
          lable: "字典编号",
          class: "tabel-col-2",
          sortable: false,
        },
        description: {
          slot: false,
          lable: "描述",
          class: "tabel-col-3",
          sortable: false,
        },

        handle: {
          slot: true,
          lable: "操作",
          class: "tabel-col-2 handle-cell",
          sortable: false,
        },
      },
      tableData: [],//列表信息
      form: {},//表单信息
      show: false//是否展示
    }
  },
  components: { dictForm, dictItem},
  mounted() {
    //分页列表查询
    this.loadData()
  },
  methods: {
    //关闭字典配置
    closeItem() {
      this.drawer = false;
    },
    //字典配置
    setItem(item) {
      this.dictId = item.id
      this.drawer = true
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
      let path = "/insight/dict/page";
      let params = {
        page_no: this.curPage,
        page_size: this.pageSize,
        url: this.form.url,
        name: this.name,
        value: this.value
      };
      this.$api.getServerAction(path, params).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          let tem = [];
          this.tableData = tem.concat(res.data.items);
          this.pageInfo = res.data.page;
        } else {
          this.$message.error(res.info)
        }
      });
    },
    /**
     * 添加
     */
    addForm() {
      this.form = {}
      this.show = true
    },
    /**
     * 修改
     */
    editForm(item) {
      this.form = {}
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
              .getServerAction("/insight/dict/delete", {id: item.id})
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
  }
}
</script>

<style lang="scss" scoped>

</style>
