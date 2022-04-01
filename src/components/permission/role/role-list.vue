<template>
  <div>
    <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
      <div class="table-style">
        <div class="input-box">
          <div class="input-label">角色名称:</div>
          <div class="input-con">
            <tis-input v-model="name" placeholder="请输入角色名称"></tis-input>
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
            :checkable="false"
            :tableHeight="$store.state.yqInfo.MAINHEIGHT - 56 - 48"
          >
            <template v-slot:status="props">
              <span v-if="props.cellValue === '1'" class="open-color"
                >启用</span
              >
              <span v-else class="close-color">未启用</span>
            </template>
            <template v-slot:handle="props">
              <div class="selected-color">
                <span @click="editForm(props.cellData)">编 辑</span
                >{{ "&nbsp;" }}
                <span @click="empower(props.cellData)">授 权</span
                >{{ "&nbsp;" }}
                <span
                  v-if="props.cellData.status === '1'"
                  @click="updateStatue(props.cellData, '0')"
                  >禁 用</span
                >
                <span v-else @click="updateStatue(props.cellData, '1')"
                  >启 用</span
                >{{ "&nbsp;" }}
                <span @click="deleteRole(props.cellData)">删 除</span>
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
    </box-show>
    <tis-dialog
      title="菜单权限信息"
      :visible.sync="showIP"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="60%"
    >
      <div>
        <tis-tree
          :data="menuData"
          show-checkbox
          node-key="id"
          default-expand-all
          ref="tree"
          :default-checked-keys="checkedKey"
          :props="defaultProps"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <el-tooltip
                content="隐藏路由"
                class="p-left"
                v-if="data.menu_type == '1'"
              >
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
              <el-tooltip
                content="菜单"
                class="p-left"
                v-if="data.menu_type == '0'"
              >
                <i class="el-icon-warning"></i>
              </el-tooltip>
              <el-tooltip
                content="按钮"
                class="p-left"
                v-if="data.menu_type == '2'"
              >
                <i class="el-icon-switch-button"></i>
              </el-tooltip>
              {{ node.label }}
            </span>
          </span>
        </tis-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <tis-button @click="closeIP">取 消</tis-button>
        <tis-button type="primary" @click="addMenu">确 定</tis-button>
      </span>
    </tis-dialog>
    <tis-dialog
      :title="popTitle"
      :visible.sync="showPop"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <notice-form
        ref="noticeform"
        :form="form"
        :showPop="showPop"
        @page="page"
      ></notice-form>
      <span slot="footer" class="dialog-footer">
        <tis-button @click="closePop">取 消</tis-button>
        <tis-button type="primary" @click="submit">确 定</tis-button>
      </span>
    </tis-dialog>
  </div>
</template>


<script>
import { formatDate } from "@/utils/util";
import NoticeForm from "./role-form";
import bus from "@/utils/bus";

export default {
  components: {
    NoticeForm,
  },
  data() {
    return {
      curPage: 1,
      pageSize: 15,
      pageInfo: null,
      showPop: false, //添加编辑信息
      showIP: false, //菜单权限信息
      name: null, //名称
      tableObj: {
        name: {
          slot: false,
          lable: "角色名称",
          class: "tabel-col-2",
          sortable: false,
        },
        code: {
          slot: false,
          lable: "角色编号",
          class: "tabel-col-2",
          sortable: false,
        },
        status: {
          slot: true,
          lable: "状态",
          class: "tabel-col-1",
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
      form: {}, //表单信息
      tableData: [], //列表信息
      menuData: [], //菜单信息
      roleId: "", //权限ID
      popTitle: "", //标题
      checkedKey: [], //已授权信息
      defaultProps: {
        children: "children",
        label: "menu_name",
        disabled: this.disabledFunc,
      },
    };
  },
  filters: {
    fd(time) {
      return formatDate(time);
    },
  },
  created() {
    //列表分页查询
    this.page();
  },
  methods: {
    disabledFunc(data) {
      if (data.url === "/permission/role/role-list") {
        return true;
      }
    },
    //修改状态
    updateStatue(item, status) {
      this.$yqAlert({
        content: "确认此操作？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/role/updateStatue", {
              id: item.id,
              status: status,
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code === 200) {
                this.$message.success("操作成功！");
                this.page();
                bus.$emit("change-menu")
              } else {
                this.$message.warning("操作失败！");
              }
            });
        },
      });
    },
    //授权
    addMenu() {
      if (this.$refs.tree.getCheckedKeys().length == 0) {
        this.$message.error("请选择授权信息");
        return;
      }
      this.$yqLoading.show();
      this.$api
        .getServerAction("/insight/rolePermission/empower", {
          permissionId: JSON.stringify(this.$refs.tree.getCheckedKeys()),
          roleId: this.roleId,
        })
        .then((res) => {
          this.$yqLoading.hide();
          if (res.code == 200) {
            this.$message.success("授权成功！");
            this.showIP = false;
            this.page();
            this.checkedKey = [];
            bus.$emit("change-menu")
          } else {
            this.$message.warning("授权失败！");
          }
        });
    },
    //关闭弹框
    closeIP() {
      this.showIP = false;
    },
    /**
     * 删除
     */
    deleteRole(item) {
      this.$yqAlert({
        content: "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/role/delete", { id: item.id })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.page();
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
      this.page();
    },
    /**
     * 取消弹出框
     */
    closePop() {
      this.showPop = false;
    },
    //添加信息
    submit() {
      this.$refs.noticeform.submit();
    },
    /**
     * 添加
     */
    addForm() {
      this.form = {};
      this.popTitle = "添加角色信息";
      this.showPop = true;
    },
    //修改
    editForm(item) {
      this.popTitle = "修改角色信息";
      this.form = {};
      this.form = JSON.parse(JSON.stringify(item));
      this.showPop = true;
    },
    //授权弹起弹框
    empower(data) {
      this.roleId = data.id;
      this.getMenuList();
      this.getMenus();
      this.showIP = true;
    },
    //获取菜单信息
    getMenuList() {
      this.$yqLoading.show();
      let path = "/insight/menu/list";
      this.$api.getServerAction(path).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          this.menuData = res.data;
        } else {
          this.$message.warning(res.info);
        }
      });
    },
    //获取已授权信息
    getMenus() {
      this.$yqLoading.show();
      let path = "/insight/rolePermission/getMenuList";
      this.$api.getServerAction(path, { roleId: this.roleId }).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          this.checkedKey = res.data;
        } else {
          this.$message.warning(res.info);
        }
      });
    },
    /**
     * 查询
     */
    search() {
      this.curPage = 1;
      this.page();
    },
    /**
     * 重置
     */
    clean() {
      this.curPage = 1;
      this.name = null;
      this.page();
    },
    /**
     * 分页查询
     */
    page() {
      this.showPop = false;
      this.$yqLoading.show();
      let path = "/insight/role/page";
      let params = {
        page_no: this.curPage,
        page_size: this.pageSize,
        name: this.name,
      };
      this.$api.getServerAction(path, params).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          this.tableData = res.data.items;
          this.pageInfo = res.data.page;
        } else {
          this.$message.warning(res.info);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
