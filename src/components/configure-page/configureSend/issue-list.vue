<template>
  <div >
    <div class="input-box">
      <div class="input-label">IP名称:</div>
      <div class="input-con">
        <tis-input v-model="ip" placeholder="请输入IP"></tis-input>
      </div>

      <tis-button type="primary" @click="submit">查询</tis-button>
      <tis-button type="info" @click="resetKey">重置</tis-button>
    </div>
    <div style="width: 100%">
      <div>
        <tis-table
            :header-cell-style="{background:'var(--layout-bg-3)',color:'var(--text-color)',fontFamily:'',fontSize:'var(--text-size-big)'}"
            ref="ipTable"
            :height="height"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%">
          <tis-table-column
              label="序号"
              type="index" align="center"
              width="50">
          </tis-table-column>
          <tis-table-column
              prop="configure_name"
              label="配置名称"
              show-overflow-tooltip>
          </tis-table-column>
          <tis-table-column
              prop="create_time"
              label="时间"
              width="160">
            <template slot-scope="scope">
              {{ scope.row.create_time | fd }}
            </template>
          </tis-table-column>
          <tis-table-column
              prop="ip_url"
              label="目标IP"
              show-overflow-tooltip>
          </tis-table-column>
          <tis-table-column
              prop="status"
              label="状态"
              show-overflow-tooltip>
            <template slot-scope="scope">
                <span class="warning-color" v-if="scope.row.status== '0'"
                >下发中</span
                >
              <span class="open-color" v-else-if="scope.row.status== '1'"
              >下发成功</span
              >
              <span class="danger-color" v-else-if="scope.row.status== '2'"
              >下发失败</span
              >
              <span class="gay-font" v-else-if="scope.row.status== '3'"
              >下发审核中</span
              >
              <span class="danger-color" v-else-if="scope.row.status == '4'"
              >下发审核失败</span
              >
              <span class="open-color" v-else-if="scope.row.status == '5'"
              >回滚成功</span
              >
              <span class="danger-color" v-else-if="scope.row.status == '6'"
              >回滚失败</span
              >
            </template>
          </tis-table-column>
          <tis-table-column
              label="操作"
              show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="selected-color">
              <span @click="see(scope.row)" v-if="status != '1'"
              >查 看</span
              >{{ "&nbsp;" }}
                <span @click="examineMessage(scope.row)" v-if="status == '1'"
                >审 核</span
                >{{ "&nbsp;" }}
                <span
                    @click="rollBack(scope.row)"
                    v-if="scope.row.status == '1' || scope.row.status == '5' || scope.row.status == '6'"
                >回 滚</span
                >{{ "&nbsp;" }}
              </div>
            </template>
          </tis-table-column>
        </tis-table>
      </div>
    </div>
    <div style="margin-top: 5px">
      <list-page
          :pageInfo="pageInfo"
          :curPage="curPage"
          @cpc="curPageChange"
          :pageSize="pageSize"
      ></list-page>
    </div>
    <div style="float: right" v-if="!show">
      <span slot="footer" class="dialog-footer">
        <tis-button type="primary" @click="up" v-if="status != '1'"
        >上一步</tis-button
        >
        <tis-button @click="chosePop">关 闭</tis-button>
      </span>
    </div>
    <div style="height: 40px"></div>

    <tis-dialog
        append-to-body
        title="下发信息"
        :visible.sync="showPop"
        style="background-color: rgba(150,149,149,0.8)"
        :modal="false"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="55%"
    >
      <div>
        <table class="altrowstable">
          <tr>
            <td class="altrowstable-left">配置名称</td>
            <td class="altrowstable-right">
              {{ data.configure_name }}
            </td>
            <td class="altrowstable-left">IP地址</td>
            <td class="altrowstable-right">
              {{ data.ip_url }}
            </td>
          </tr>

          <tr>
            <td class="altrowstable-left">状态</td>
            <td class="altrowstable-right">
              <span class="warning-color" v-if="data.status == '0'"
              >下发中</span
              >
              <span class="open-color" v-else-if="data.status == '1'"
              >下发成功</span
              >
              <span class="danger-color" v-else-if="data.status == '2'"
              >下发失败</span
              >
              <span class="gay-font" v-else-if="data.status == '3'"
              >下发审核中</span
              >
              <span class="danger-color" v-else-if="data.status == '4'"
              >下发审核失败</span
              >
              <span class="open-color" v-else-if="data.status == '5'"
              >回滚成功</span
              >
              <span class="danger-color" v-else-if="data.status == '6'"
              >回滚失败</span
              >
            </td>
            <td class="altrowstable-left">是否强制下发</td>
            <td class="altrowstable-right">
              <span v-if="data.force_status == '0'">是</span>
              <span v-else-if="data.force_status == '1'">否</span>
            </td>
          </tr>

          <tr>
            <td class="altrowstable-left">创建时间</td>
            <td colspan="5" style="text-align: left; padding: 0 8px">
              <span>{{ data.create_time | fd }}</span>
            </td>
          </tr>
          <tr>
            <td class="altrowstable-left">配置下发地址</td>
            <td colspan="5" style="text-align: left; padding: 0 8px">
              <span>{{ data.configure_path }}</span>
            </td>
          </tr>

          <tr>
            <td class="altrowstable-left">失败原因</td>
            <td colspan="5" style="text-align: left; padding: 0 8px">
              <span v-if="data.status == '4'">{{ data.examine_cause }}</span>
              <span v-else>{{ data.failure_reason }}</span>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <tis-button type="primary" @click="closePop">关 闭</tis-button>

      </span>
    </tis-dialog>
  </div>
</template>

<script>
import {formatDate} from "@/utils/util";

export default {
  data() {
    return {
      curPage: 1,
      pageSize: 15,
      height:"420px",//高度
      pageInfo: null,
      ip: "",//IP名称
      showPop: false,
      message: "",
      data: {},
      tableData: [],
      tableObj: {
        configure_name: {
          slot: false,
          lable: "配置名称",
          class: "tabel-col-1",
          sortable: false,
        },
        create_time: {
          slot: true,
          lable: "时间",
          class: "tabel-col-2",
          sortable: false,
        },
        ip_url: {
          slot: false,
          lable: "目标IP",
          class: "tabel-col-1",
          sortable: false,
        },
        status: {
          slot: true,
          lable: "状态",
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
    };
  },
  created() {
    if (this.$store.state.yqInfo.platform === "pad") {
      this.height = "240px";
    }
  },
  watch: {
    active: {
      handler(newName) {
        if (newName == 3) {
          this.submit();
        }
      },
      immediate: true,
    },
  },
  props: {
    id: String,
    status: String,
    active: {
      type: [Number, String],
      default: 0,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    fd(time) {
      return formatDate(time);
    },
  },
  methods: {
    //上一步
    up() {
      this.$emit("up", 2);
    },
    //关闭
    chosePop() {
      if (this.status != "1") {
        this.$emit("chosePop");
      } else {
        this.$emit("closeIssue");
      }
    },
    //查看
    see(data) {
      this.data = data;
      this.showPop = true;
    },
    /**
     * 取消弹出框
     */
    closePop() {
      this.showPop = false;
    },
    //回滚功能
    rollBack(data) {
      this.$yqLoading.show();
      let path = "/insight/configureSend/rollBack";
      this.$api.getServerAction(path, {id: data.id}).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          this.$message.success("操作成功！");
          this.submit();
        } else {
          this.$message.error(res.info);
        }
      });
    },
    //审核功能
    examineMessage(item) {
      this.$emit("examine", item.id);
    },
    //重置
    resetKey() {
      this.ip = "";
      this.submit();
    },
    //分页
    curPageChange(e) {
      this.curPage = e;
      this.submit();
    },
    /**
     * 分页查询
     */
    submit() {
      this.$yqLoading.show();
      let path = "/insight/sendRecord/pageByConfigureId";
      if (this.status == "1") {
        path = "/insight/sendRecord/pageByStatus";
      }
      let params = {
        page_no: this.curPage,
        page_size: this.pageSize,
        id: this.id,
        ip: this.ip,
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
  },
};
</script>

<style lang="scss" scoped>

table.altrowstable {
  font-family: verdana, arial, sans-serif;
  font-size: var(--text-size-small);
  color: #333333;
  border-width: 1px;
  border-color: #747474;
  border-collapse: collapse;
  color: #fff;
}

table.altrowstable th {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  width: 25vh;
  border-color: #747474;
  text-align: center;
  color: #fff;
  /* background: #78ccc6; */
}

table.altrowstable td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #747474;
  text-align: center;
}

.altrowstable-left {
  background: #373734;
  width: 15%;
  font-size: var(--text-size-small);
}

.altrowstable-right {
  /* background: #f2f6fc; */
  font-size: var(--text-size-small);
}

table {
  width: 100%;
  height: 200px;
  /* border-collapse属性设置表格的边框是否被合并为一个单一的边框，还是像在标准的HTML中那样分开显示 */
  /* separate：默认值，边框会分开 */
  /* collapse: 如果可能，边框会合并为单一的边框 */
  border-collapse: collapse;
}
</style>
