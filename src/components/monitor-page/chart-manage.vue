<template>
  <div>
    <chart-list
      @addChart="addChart"
      @editChart="editChart"
      @scanChart="scanChart"
      ref="chartList"
      v-if="!isscan"
    ></chart-list>
    <chart-scan
      v-else
      :chartInfo="scanChartInfo"
      @hideScan="hideScan"
    ></chart-scan>
    <tis-dialog
      :title="popTitle"
      :visible.sync="addShow"
      width="50%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <tis-form
        :model="chartObj"
        :rules="rules"
        ref="chartForm"
        label-width="100px"
      >
        <tis-form-item label="图表名称：" prop="Name">
          <tis-input
            v-model.trim="chartObj.Name"
            placeholder="请输入图表名称"
          ></tis-input>
        </tis-form-item>
        <tis-form-item label="选择插件：" prop="Plugin">
          <tis-select
            v-model="chartObj.Plugin"
            clearable
            placeholder="请选择插件"
            style="width: 100%"
            @change="pluginChange"
          >
            <tis-option
              v-for="plugin in pluginList"
              :key="plugin.id"
              :label="plugin.name"
              :value="plugin.code"
            >
            </tis-option>
          </tis-select>
        </tis-form-item>
        <tis-form-item label=" 选择数据：" prop="Attribute">
          <div class="f-body">
            <div class="f-data">
              <div v-for="(attr, idx) in pluginAttrs" :key="idx">
                <div
                  v-if="attr.alarm"
                  class="f-data-item"
                  :class="{
                    'f-data-item-checked': chartObj.Attribute == attr.code,
                  }"
                  @click="checkAttrFunc(attr)"
                >
                  <div>
                    {{ attr.name }}
                  </div>
                  <div v-show="chartObj.Attribute == attr.code">
                    <i class="el-icon-check"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </tis-form-item>
        <tis-form-item label="图表类型：" prop="Type">
          <tis-select
            v-model="chartObj.Type"
            clearable
            placeholder="请选择图表类型"
            style="width: 100%"
          >
            <tis-option
              v-for="type in typeList"
              :key="type.id"
              :label="type.name"
              :value="type.name"
            >
            </tis-option>
          </tis-select>
        </tis-form-item>
      </tis-form>

      <span slot="footer" class="dialog-footer">
        <tis-button @click="cancelAdd">取 消</tis-button>
        <tis-button type="primary" @click="submitChart">确 定</tis-button>
      </span>
    </tis-dialog>
  </div>
</template>
<script>
import chartList from "../chart-page/chart-list.vue";
import { handleOK } from "@/utils/util";
import ChartScan from "../chart-page/chart-scan.vue";
export default {
  components: {
    chartList,
    ChartScan,
  },
  data() {
    return {
      popTitle: "添加图表",
      addShow: false,
      chartObj: {
        Name: "",
        Plugin: "",
        Type: "",
        Attribute: "",
      },
      rules: {
        Name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        Plugin: [{ required: true, message: "请选择插件", trigger: "blur" }],
        Attribute: [
          { required: true, message: "请选择数据属性", trigger: "blur" },
        ],
        Type: [{ required: true, message: "请选择图表类型", trigger: "blur" }],
      },
      pluginList: [],
      pluginAttrs: [],
      typeList: [
        {
          id: 1,
          name: "折线图",
        },
        {
          id: 2,
          name: "饼图",
        },
        {
          id: 3,
          name: "柱状图",
        },
      ],
      validList: {
        Name: "请输入图表名称",
        Plugin: "请选择插件",
        Attribute: "请选择数据属性",
        Type: "请选择图表类型",
      },
      isscan: false,
      scanChartInfo: null,
      pageData: null,
    };
  },
  created() {
    this.pageData = this.$pageData();
  },
  mounted() {},
  methods: {
    submitChart() {
      this.$refs["chartForm"].validate((valid) => {
        if (valid) {
          let path = this.chartObj.ID
            ? "/insight/chart/edit"
            : "/insight/chart/create";
          handleOK({
            path: path,
            formData: this.chartObj,
            // valiData: this.validList,
            suc: () => {
              this.$message.success("提交成功");
              this.cancelAdd();
              this.$refs.chartList.getChartList();
            },
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    checkAttrFunc(e) {
      this.chartObj.Attribute = e.code;
    },
    scanChart(e) {
      this.scanChartInfo = e;
      this.isscan = true;
    },
    hideScan() {
      this.isscan = false;
    },
    addChart() {
      this.chartObj = {
        Name: "",
        Plugin: "",
        Type: "",
        Attribute: "",
      };
      this.getPluginAll();
      this.popTitle = "添加图表";
      this.addShow = true;
    },
    editChart(chart) {
      this.getPluginAll();
      this.chartObj = {
        ID: chart.id,
        Name: chart.name,
        Plugin: chart.plugin,
        Type: chart.type,
        Attribute: chart.attribute,
      };
      this.getPluginData();
      this.popTitle = "编辑图表";
      this.addShow = true;
    },
    cancelAdd() {
      this.chartObj = {
        Name: "",
        Plugin: "",
        Type: "",
        Attribute: "",
      };
      this.pluginList = [];
      this.pluginAttrs = [];
      this.addShow = false;
    },
    pluginChange() {
      this.chartObj.Attribute = "";
      this.getPluginData();
    },
    getPluginAll() {
      this.$api.getServerAction("/insight/plugin/getPluginList").then((res) => {
        if (res.code == 200) {
          this.pluginList = res.data;
        }
      });
    },
    getPluginData() {
      let params = {
        code: this.chartObj.Plugin,
      };
      this.$yqLoading.show();
      this.$api
        .getServerAction("/insight/plugin/getPluginAttributes", params)
        .then((res) => {
          this.$yqLoading.hide();
          if (res.code == 200) {
            this.pluginAttrs = res.data;
          } else {
            this.pluginAttrs = [];
          }
          console.log("获取插件属性", res);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.f-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.f-item-basic {
  align-items: start;
}

.f-label {
  width: 20%;
  text-align: right;
  margin-right: 16px;
}

.f-body {
  width: 60%;
}

.f-data {
  border: 1px solid var(--text-color);
  width: 100%;
  height: 240px;
  overflow-y: scroll;
  padding: 8px 0;
}

.f-data-item {
  padding: 8px;
  margin: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-size-small);
}

.f-data-item-checked {
  color: var(--hover-color);
}

.f-data-item:hover {
  color: var(--hover-color);
}
</style>
