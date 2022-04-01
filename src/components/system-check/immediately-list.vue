<template>
  <div>
    <div
      style="padding: 0px 16px; display: flex"
      :style="{
        height: $store.state.yqInfo.MAINHEIGHT - 55 + 'px',
      }"
    >
      <div style="width: 50%">
        <div slot="header" class="clearfix">
          <span style="float: left">接口信息</span>
        </div>
        <div
         :style="{
            height: $store.state.yqInfo.MAINHEIGHT - 55 - 32   + 'px',
            overflow:'auto'
          }"
        >
          <tis-form ref="formCron" :model="formCron" style="margin-top: 10px">
            <tis-form-item
              label="请求方式"
              prop="method_type"
              :rules="[
                {
                  required: true,
                  message: '请选择请求方式',
                  trigger: 'change',
                },
              ]"
            >
              <select-dict
                v-model="formCron.method_type"
                placeholder="请选择请求方式"
                type="requestType"
              ></select-dict>
            </tis-form-item>

            <div v-if="formCron.headerList.length > 0">
              <tis-form-item
                v-for="(domain, index) in formCron.headerList"
                :key="index"
                label="请求头"
                :prop="'headerList.' + index"
                :rules="[
                  { required: false, validator: validate, trigger: 'change' },
                ]"
              >
                <br />
                <div style="display: flex; margin-left: 10px">
                  <tis-input
                    placeholder="请输入参数"
                    style="width: 70%; right: 10px"
                    v-model.trim="domain.key"
                    @input="change($event)"
                  >
                  </tis-input>
                  <tis-input
                    placeholder="请输入参数"
                    style="width: 70%; right: 0px"
                    v-model.trim="domain.value"
                    @input="change($event)"
                  >
                  </tis-input>
                  <tis-button
                    v-if="index == 0"
                    @click="addHeader"
                    type="primary"
                    icon="el-icon-plus"
                    style="margin-left: 5px"
                  ></tis-button>
                  <tis-button
                    v-if="index != 0"
                    @click.prevent="removeHeader(domain)"
                    type="danger"
                    icon="el-icon-minus"
                    style="margin-left: 5px"
                  ></tis-button>
                </div>
              </tis-form-item>
            </div>

            <tis-form-item
              label="接口地址"
              prop="url"
              :rules="[
                { required: true, validator: validateHttp, trigger: 'change' },
              ]"
            >
              <tis-input
                type="textarea"
                :rows="5"
                maxlength="200"
                show-word-limit
                v-model.trim="formCron.url"
                placeholder="请输入接口地址"
              ></tis-input>
            </tis-form-item>

            <tis-form-item
              v-if="formCron.method_type != 'get'"
              label="参数类型"
              prop="params_type"
            >
              <select-dict
                v-model="formCron.params_type"
                placeholder="请选择参数类型"
                type="paramsType"
              ></select-dict>
            </tis-form-item>
            <tis-form-item
              v-for="(domain, index) in formCron.paramList"
              :key="index"
              label="参数"
              :prop="'paramList.' + index"
              :rules="[
                { required: false, validator: validate, trigger: 'change' },
              ]"
            >
              <br />
              <div style="display: flex; margin-left: 10px">
                <tis-input
                  placeholder="请输入参数"
                  style="width: 70%; right: 10px"
                  v-model.trim="domain.key"
                  @input="change($event)"
                >
                </tis-input>
                <tis-input
                  placeholder="请输入参数"
                  style="width: 70%; right: 0px"
                  v-model.trim="domain.value"
                  @input="change($event)"
                >
                </tis-input>
                <tis-button
                  v-if="index == 0"
                  @click="addDomain"
                  type="primary"
                  icon="el-icon-plus"
                  style="margin-left: 5px"
                ></tis-button>
                <tis-button
                  v-if="index != 0"
                  @click.prevent="removeDomain(domain)"
                  type="danger"
                  icon="el-icon-minus"
                  style="margin-left: 5px"
                ></tis-button>
              </div>
            </tis-form-item>
            <tis-form-item style="float: right">
              <tis-button type="primary" @click="going">执行</tis-button>
              <tis-button type="info" @click="clearForm">重置</tis-button>
            </tis-form-item>
          </tis-form>
        </div>
      </div>

      <div style="width: 50%; margin-left: 20px">
        <div slot="header" class="clearfix">
          <span style="float: left">执行结果</span>
          <tis-button
            style="float: right"
            type="primary"
            @click="showHistory"
            size="small"
            >历史记录</tis-button
          >
        </div>
        <div
          style="margin-top: 16px"
           :style="{
            height: $store.state.yqInfo.MAINHEIGHT - 55 - 32 - 32  + 'px',
            overflow:'auto'
          }"
        >
          <tis-input

            v-if="!jsonExhibition"
            readonly
            placeholder="返回结果"
            type="textarea"
           :rows='13'
            v-model="formCron.result"
          ></tis-input>
          <div style="text-align: left" v-else>
            <json-viewer :value="jsonResult" sort theme="my-awesome-json-theme">
            </json-viewer>
          </div>
          <div style="float: right; margin-top: 10px">
            <tis-button :size='$platform.size' type="primary" @click="exportExcel">导出</tis-button>
            <!--            <tis-button type="info" @click="clearResult()">清空</tis-button>-->
          </div>
        </div>
      </div>
    </div>
    <tis-dialog
      append-to-body
      title="历史记录"
      :visible.sync="show"
      fullscreen
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div
        ref="bodyCon"
        style="height: calc(100vh - 55px - 70px - 60px); overflow-y: scroll"
      >
        <div ref="topcon" class="input-box">
          <div class="input-label">选择时间:</div>
          <div class="input-con">
            <tis-date-picker
              v-model="time"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            >
              >
            </tis-date-picker>
          </div>
          <tis-button type="primary" @click="getHistory()">查 询</tis-button>
          <tis-button type="info" @click="resetKey">重 置</tis-button>
          <tis-button type="primary" @click="deleteAllData()">清 空</tis-button>
        </div>
        <div v-if="tableHeight">
          <self-table
            :tableHeight="tableHeight"
            ref="selfTable"
            :tableData="tableData"
            :tableObj="tableObj"
          >

            <template v-slot:create_time="props">
              {{ props.cellValue | fd }}
            </template>
            <template v-slot:handle="props">
              <div class="selected-color">
                <span @click="seeData(props.cellData)">查 看</span
                >{{ "&nbsp;" }}
                <span @click="deleteData(props.cellData)">删 除</span
                >{{ "&nbsp;" }}
                <span @click="implementData(props.cellData)">执 行</span>
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
      <span slot="footer" class="dialog-footer">
        <tis-button @click="show = false">关 闭</tis-button>
      </span>
    </tis-dialog>
    <!-- 查看历史记录详情   -->
    <tis-dialog
      append-to-body
      title="接口结果信息"
      width="80%"
      :visible.sync="showResult"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :style="$store.state.yqInfo.dialogBg"
    >
      <table class="altrowstable" style="margin-top: 50px">
        <tr>
          <td class="altrowstable-left">请求方式</td>
          <td class="altrowstable-right">
            {{ data.method_type }}
          </td>
          <td class="altrowstable-left">参数类型</td>
          <td class="altrowstable-right">
            {{ data.params_type }}
          </td>
          <td class="altrowstable-left">创建时间</td>
          <td class="altrowstable-right">
            {{ data.create_time | fd }}
          </td>
        </tr>

        <tr>
          <td class="altrowstable-left">请求参数</td>
          <td
            colspan="5"
            @click="jsonClick(data.params)"
            @mouseover="mouseover('1')"
            @mouseleave="mouseleave('1')"
            :style="active == '' ? 'text-align: left; padding: 0 8px' : active"
            v-if="data.params"
          >
            <span v-if="data.params.length >= 100">
              {{ data.params.substring(0, 100) + "..." }}
            </span>
            <span v-else> {{ data.params }}</span>
          </td>
          <td colspan="5" style="text-align: left; padding: 0 8px" v-else>
            {{ data.params }}
          </td>
        </tr>
        <tr>
          <td class="altrowstable-left">请求头</td>

          <td
            colspan="5"
            @click="jsonClick(data.headers)"
            @mouseover="mouseover('3')"
            @mouseleave="mouseleave('3')"
            :style="
              active2 == '' ? 'text-align: left; padding: 0 8px' : active2
            "
            v-if="data.headers"
          >
            <span v-if="data.headers.length >= 100">
              {{ data.headers.substring(0, 100) + "..." }}
            </span>
            <span v-else> {{ data.headers }}</span>
          </td>
          <td colspan="5" style="text-align: left; padding: 0 8px" v-else>
            {{ data.headers }}
          </td>
        </tr>
        <tr>
          <td class="altrowstable-left">请求路径</td>
          <td colspan="5" style="text-align: left; padding: 0 8px">
            {{ data.url }}
          </td>
        </tr>
        <tr>
          <td class="altrowstable-left">结果信息</td>
          <td
            colspan="5"
            @click="jsonClick(data.result)"
            @mouseover="mouseover('2')"
            @mouseleave="mouseleave('2')"
            :style="
              active1 == '' ? 'text-align: left; padding: 0 8px' : active1
            "
            v-if="data.result && data.result.length >= 100"
          >
            {{ data.result.substring(0, 100) + "..." }}
          </td>
          <td colspan="5" style="text-align: left; padding: 0 8px" v-else>
            {{ data.result }}
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <tis-button @click="closeResult">关 闭</tis-button>
      </span>
    </tis-dialog>
    <!--查看json格式数据-->
    <tis-dialog
      append-to-body
      title="json数据展示"
      width="70%"
      :visible.sync="jsonShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :style="$store.state.yqInfo.dialogBg"
    >
      <div style="text-align: left">
        <json-viewer
          :value="jsonMessage"
          v-if="isJson"
          sort
          theme="my-awesome-json-theme"
        ></json-viewer>
        <div v-else>
          {{ this.jsonMessage }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <tis-button @click="jsonClose">关 闭</tis-button>
      </span>
    </tis-dialog>
  </div>
</template>

<script>
import { formatDate } from "@/utils/util";
import JsonViewer from "vue-json-viewer";
export default {
  components: { JsonViewer//json展示组件
  },
  filters: {
    fd(time) {
      return formatDate(time);
    },
  },
  data() {
    return {
      active: "", //样式
      active1: "", //样式
      active2: "", //样式
      isJson: false,//是否展示json
      //数据信息
      formCron: {
        paramList: [
          {
            key: "",
            value: "",
          },
        ],
        headerList: [
          {
            key: "",
            value: "",
          },
        ],
      },
      show: false,//历史记录
      showResult: false,//接口结果信息
      jsonShow: false,//json数据展示
      jsonExhibition: false,//基本数据展示
      curPage: 1,
      id: "",//返回执行ID
      jsonMessage: "",//json数据
      jsonResult: "",//json数据
      pageSize: 15,
      pageInfo: null,
      tableObj: {
        url: {
          slot: false,
          lable: "请求路径",
          class: "tabel-col-5",
          sortable: false,
        },
        method_type: {
          slot: false,
          lable: "请求方式",
          class: "tabel-col-1",
          sortable: false,
        },
        create_time: {
          slot: true,
          lable: "创建时间",
          class: "tabel-col-2",
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
      time: null,//时间
      data: {},//查看信息
      tableHeight: 0,
    };
  },
  props: {
    classId: String,
  },
  methods: {
    change() {
      this.$forceUpdate();
    },
    //执行
    implementData(form) {
      this.formCron = JSON.parse(JSON.stringify(form));
      if (form.params != "") {
        let dataObj = JSON.parse(form.params);
        let params = [];
        for (let d in dataObj) {
          let a = {};
          a["key"] = d;
          a["value"] = dataObj[d];
          params.push(a);
        }
        this.formCron.paramList = params;
      } else {
        this.formCron.paramList = [{ key: "", value: "" }];
      }

      if (form.headers != "") {
        let headerObj = JSON.parse(form.headers);
        let headers = [];
        for (let key in headerObj) {
          let a = {};
          a["key"] = key;
          a["value"] = headerObj[key];
          headers.push(a);
        }
        this.formCron.headerList = headers;
      } else {
        this.formCron.headerList = [{ key: "", value: "" }];
      }
      this.formCron.result = "";
      this.formCron.id = "";
      this.show = false;
      this.jsonExhibition=false
    },
    //查看
    seeData(data) {
      this.data = data;
      this.showResult = true;
    },
    //打开json展示弹框
    jsonClick(message) {
      this.jsonShow = true;
      /* this.jsonMessage = JSON.parse(message);*/
      try {
        var obj = JSON.parse(message);
        this.jsonMessage = obj;
        this.isJson = true;
      } catch (e) {
        console.log(e, "捕获错误123");
        this.jsonMessage = message;
        this.isJson = false;
      }
    },
    //鼠标移入事件
    mouseover(sum) {
      if (sum == "1") {
        this.active =
          "text-align: left; padding: 0 8px;color: var(--hover-color);cursor: pointer";
      } else if (sum == "2") {
        this.active1 =
          "text-align: left; padding: 0 8px;color: var(--hover-color);cursor: pointer";
      } else if (sum == "3") {
        this.active2 =
          "text-align: left; padding: 0 8px;color: var(--hover-color);cursor: pointer";
      }
    },
    //鼠标移出事件
    mouseleave(sum) {
      if (sum == "1") {
        this.active = "";
      } else if (sum == "2") {
        this.active1 = "";
      } else if (sum == "3") {
        this.active2 = "";
      }
    },
    //关闭历史记录
    closeResult() {
      this.showResult = false;
    },
    //关闭json展示弹框
    jsonClose() {
      this.jsonShow = false;
      this.jsonMessage = "";
    },
    //重置
    resetKey() {
      this.time = null;
      this.curPage = 1;
      this.getHistory();
    },
    //删除历史记录
    deleteData(data) {
      this.$yqAlert({
        content: "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/systemCheckOnce/deleteOnce", {
              id: data.id,
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.getHistory();
              } else {
                this.$message.warning("删除失败！");
              }
            });
        },
      });
    },
    //删除全部历史记录
    deleteAllData() {
      this.$yqAlert({
        content: "确认此操作？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/systemCheckOnce/deleteAllOnce", {
              classId: this.classId,
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("操作成功！");
                this.getHistory();
              } else {
                this.$message.warning("操作失败！");
              }
            });
        },
      });
    },
    //获取历史记录
    getHistory() {
      this.$yqLoading.show();
      var start_time = null;
      var end_time = null;
      if (this.time != null && this.time.length && this.time.length>0) {
        start_time = formatDate(this.time[0]);
        end_time = formatDate(this.time[1]);
      }
      let path = "/insight/systemCheckOnce/pageOnce";
      let params = {
        page_no: this.curPage,
        page_size: this.pageSize,
        classId: this.classId,
        start_time: start_time,
        end_time: end_time,
      };
      this.$api.getServerAction(path, params).then(
        (res) => {
          this.$yqLoading.hide();
          if (res.code == 200) {
            let tem = [];
            this.tableData = tem.concat(res.data.items);
            this.pageInfo = res.data.page;
          }
        },
        function () {
          this.$yqLoading.hide();
        }
      );
    },
    //分页
    curPageChange(e) {
      this.curPage = e;
      this.getHistory();
    },
    //历史记录弹出框
    showHistory() {
      this.getHistory();
      this.show = true;
      this.$nextTick(() => {
        let rect = this.$refs.bodyCon.getBoundingClientRect();
        let toprect = this.$refs.topcon.getBoundingClientRect();
        this.tableHeight = rect.height - toprect.height - 48;
      });
    },
    //校验HTTP
    validateHttp(rule, value, callback) {
      if (value == "" || value == undefined) {
        return callback(new Error("请输入请求地址"));
      }
      const reg =
        /^(?:http(s)?:\/\/)?[\w.-]+(?:.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入正确的请求地址"));
      }
      return callback();
    },
    //导出
    exportExcel() {
      if (this.formCron.result == undefined || this.formCron.result == "") {
        this.$message.error("执行结果不能为空！");
        return;
      }
      this.$yqLoading.show();
      let url =
        this.$store.state.yqInfo.serverIp +
        "/insight/systemCheckOnce/exportExcel?id=" +
        this.id;
      window.location.href = url;
      this.$yqLoading.hide();
    },
    //清空结果
    clearResult() {
      this.formCron.result = "";
      this.$forceUpdate();
    },
    //请求头、参数检验
    validate(rule, value, callback) {
      if (value.key == "" && value.value != "") {
        return callback(new Error("请输入key值"));
      }
      if (value.key != "" && value.value == "") {
        return callback(new Error("请输入value值"));
      }
      return callback();
    },
    //执行
    going() {
      this.$refs.formCron.validate((valid) => {
        if (valid) {
          this.$yqLoading.show();
          let params = {};
          this.formCron.paramList.forEach((item) => {
            if (item.key != "" || item.value != "") {
              params[item.key] = item.value;
            }
          });
          if (JSON.stringify(params) != "{}") {
            this.formCron.params = JSON.stringify(params);
          }
          let headers = {};
          this.formCron.headerList.forEach((item) => {
            if (item.key != "" || item.value != "") {
              headers[item.key] = item.value;
            }
          });
          if (JSON.stringify(headers) != "{}") {
            this.formCron.headers = JSON.stringify(headers);
          }
          this.formCron.class_id = this.classId;
          this.$api
            .postServerAction("/insight/systemCheckOnce/runOnce", this.formCron)
            .then((res) => {
              this.$yqLoading.hide();
              this.$message.success("执行成功！");
              if (res.code == 200) {
                this.formCron.result = res.data.result;
                try {
                  var obj = JSON.parse(this.formCron.result);
                  this.jsonResult = obj;
                  this.jsonExhibition = true;
                } catch (e) {
                  this.jsonExhibition = false;
                }
                this.id = res.data.id;
                this.$forceUpdate();
              } else {
                this.jsonExhibition = false;
                this.formCron.result = res.info;
                this.$forceUpdate();
              }
            });
        } else {
          return false;
        }
      });
    },
    //重置
    clearForm() {
      this.formCron = {
        paramList: [
          {
            value: "",
            key: "",
          },
        ],
        headerList: [
          {
            value: "",
            key: "",
          },
        ],
      };
    },
    //新增参数
    addDomain() {
      this.$forceUpdate();
      this.formCron.paramList.push({
        value: "",
        key: "",
      });
    },
    //新增请求头信息
    addHeader() {
      this.$forceUpdate();
      this.formCron.headerList.push({
        value: "",
        key: "",
      });
    },
    //删除请求头信息
    removeHeader(item) {
      this.$forceUpdate();
      var index = this.formCron.headerList.indexOf(item);
      if (index !== -1) {
        this.formCron.headerList.splice(index, 1);
      }
    },
    //删除参数
    removeDomain(item) {
      this.$forceUpdate();
      var index = this.formCron.paramList.indexOf(item);
      if (index !== -1) {
        this.formCron.paramList.splice(index, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>

