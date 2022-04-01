<template>
  <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
    <div style="display: relative">
      <div class="back-btn" style="margin-top: 5px; padding: 10px">
        <div @click="hideDetail">
          <icon :name="'back'" :size="'24'" :color="'#E4E4E4'"></icon>
        </div>
      </div>

      <tis-tabs tab-position="left" style="margin-top: 5px">
        <tis-tab-pane label="基本信息">
          <div style="text-align: left;margin: 0 16px">
            <table class="altrowstable">
              <tr>
                <td class="altrowstable-left">配置名称</td>
                <td class="altrowstable-right">
                  {{ data.name }}
                </td>
                <td class="altrowstable-left">配置类型</td>
                <td class="altrowstable-right">
                  {{ data.type }}
                </td>
              </tr>
              <tr>
                <td class="altrowstable-left">配置文件</td>
                <td class="altrowstable-right">{{ data.file_name }}</td>
                <td class="altrowstable-left">创建时间</td>
                <td class="altrowstable-right">{{ data.create_time | fd }}</td>
              </tr>
              <tr>
                <td class="altrowstable-left">配置描述</td>
                <td colspan="5" style="text-align: left; padding: 0 8px">
                  {{ data.describe }}
                </td>
              </tr>
            </table>
          </div>
        </tis-tab-pane>
        <tis-tab-pane label="下发记录">
          <issue-list
            :show="true"
            :id="id"
            :active="actNum"
          ></issue-list>
        </tis-tab-pane>
      </tis-tabs>
    </div>
  </box-show>
</template>

<script>
import { formatDate } from "@/utils/util";
import IssueList from "./issue-list";

export default {
  components: { IssueList },
  filters: {
    fd(time) {
      return formatDate(time);
    },
  },
  props: ["id"],
  data() {
    return {
      data: {

      },
      actNum: 3,
    };
  },
  created() {
    //配置下发信息
    this.getData();
  },
  methods: {
    //返回
    hideDetail() {
      this.$emit("hideDetail");
    },
    //配置下发信息
    getData() {
      this.$yqLoading.show();
      let path = "/insight/configureSend/getById";
      let params = {
        id: this.id,
      };
      this.$api.getServerAction(path, params).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          this.data = res.data;
        }
      });
    },
  },
};
</script>

<style  scoped>
.back-btn {
  display: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row-reverse;
}

table.altrowstable {
  font-size: var(--text-size-small);
  border: var(--status-bar-tools-border);
  border-collapse: collapse;
}

table.altrowstable th {
  padding: 8px;
  width: 25vh;
  border: var(--status-bar-tools-border);
  text-align: center;
}

table.altrowstable td {
  padding: 8px 0;
  height: 60px;
  border: var(--status-bar-tools-border);
  text-align: center;
}

.altrowstable-left {
  background: var(--layout-bg-3);
  width: 10%;
  font-size: var(--text-size-small);
}

.altrowstable-right {
  font-size: var(--text-size-small);
}

table {
  width: 100%;
  border-collapse: collapse;
}
::v-deep .el-tabs__item{
    font-size: 17px !important;

}
</style>
