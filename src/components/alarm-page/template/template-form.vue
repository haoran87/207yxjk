<template>
  <div>
    <tis-form
      ref="form"
      :model="form"
      label-width="110px"
      style="margin-top: 5px"
    >
      <tis-form-item
        label="告警名称"
        prop="name"
        :rules="[
          { required: true, message: '请输入告警名称', trigger: 'change' },
        ]"
      >
        <tis-input
          v-model.trim="form.name"
          placeholder="请输入告警名称"
          maxlength="50"
          show-word-limit
        ></tis-input>
      </tis-form-item>
      <tis-form-item
        label="类型"
        prop="type"
        :rules="[{ required: true, message: '请选择类型', trigger: 'change' }]"
      >
        <select-dict
          v-model="form.type"
          placeholder="请选择类型"
          type="alarmClassType"
          @selected="changeType"
        ></select-dict>
      </tis-form-item>
      <tis-form-item
        v-if="form.type == 'log'"
        label="日志软件"
        prop="log_name_type"
        :rules="[
          {
            required: true,
            message: '请选择日志软件',
            trigger: 'change',
          },
        ]"
      >
        <tis-select
          style="width: 100%"
          v-model="form.log_name_type"
          placeholder="请选择日志软件"
          @change="logsorftChange"
        >
          <tis-option
            v-for="(item, idx) in logsofts"
            :key="idx"
            :label="item.cname"
            :value="idx + ''"
          ></tis-option>
        </tis-select>
      </tis-form-item>
      <!-- <tis-form-item
        v-if="form.type == 'log'"
        label="文件名称类型"
        prop="log_name_type"
        :rules="[
          {
            required: true,
            message: '请选择日志文件名称类型',
            trigger: 'change',
          },
        ]"
      >
        <tis-select
          style="width: 100%"
          v-model="form.log_name_type"
          placeholder="请选择类型"
        >
          <tis-option
            label="名称无日期后缀,直接匹配完整的文件名称"
            value="all"
          ></tis-option>
          <tis-option
            label="名称有日期后缀,根据系统时间自动匹配当天的日志文件"
            value="prefix"
          ></tis-option>
        </tis-select>
      </tis-form-item> -->
      <tis-form-item
        v-if="form.type == 'log'"
        label="日志文件"
        prop="log_file"
        ref="logFile"
        :rules="[
          { validator: validateLogfile, required: true, trigger: 'blur' },
        ]"
      >
        <tis-select
          v-model="form.log_file"
          filterable
          placeholder="请选择日志文件地址"
          style="width: 100%"
          @change="logFileChange"
        >
          <tis-option
            v-for="(item, idx) in logOptions"
            :key="idx"
            :label="item.name"
            :value="item.name"
          >
            <span style="float: left">{{ item.name }}</span>
            <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.name
            }}</span> -->
          </tis-option>
        </tis-select>
      </tis-form-item>
      <tis-form-item label="分类" prop="alarm_type">
        <tis-input
          v-model.trim="form.alarm_type"
          placeholder="请输入分类"
          maxlength="50"
          show-word-limit
        >
        </tis-input>
      </tis-form-item>
      <tis-form-item
        v-if="form.type == 'plugin'"
        label="插件"
        prop="plugin_id"
        :rules="[{ required: true, message: '请选择插件', trigger: 'change' }]"
      >
        <tis-select
          style="width: 100%"
          @change="getPluginAttributes"
          v-model="form.plugin_id"
          placeholder="请选择插件"
        >
          <tis-option
            v-for="item in pluginList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          >
          </tis-option>
        </tis-select>
      </tis-form-item>
      <!-- <tis-form-item
        label="设备IP"
        prop="equipment_id"
        :rules="[{ required: false, validator: validateIp, trigger: 'change' }]"
      >
        <el-autocomplete
          class="inline-input"
          ref="input"
          style="width: 100%"
          v-model="form.equipment_id"
          :fetch-suggestions="querySearch"
          placeholder="请选择或输入设备IP.不选择,对所有接入的设备生效,选择设备只对该IP的设备生效"
          @mouseenter.native="isHover = true"
          @mouseleave.native="isHover = false"
        >
          <i
            v-if="showsClear"
            class="el-icon-circle-close el-input__icon"
            slot="suffix"
            @click="handleIconClick"
          ></i>
          <i
            v-else
            class="el-icon-arrow-down el-input__icon"
            slot="suffix"
            @click="handleIconClick"
          ></i>
          <template slot-scope="{ item }">
            <div>
              <span>{{ item.value }}</span>
            </div>
          </template>
        </el-autocomplete>
      </tis-form-item> -->
      <tis-form-item label="告警描述" prop="remark">
        <tis-input
          type="textarea"
          placeholder="请输入告警描述"
          maxlength="200"
          show-word-limit
          :autosize="{ minRows: 5, maxRows: 20 }"
          v-model="form.remark"
        ></tis-input>
      </tis-form-item>
    </tis-form>
    <div v-if="form.type != undefined">
      <div class="flex-between" style="margin-top: 32px">
        <span>规则设置:</span>
        <tis-button plain type="primary" size="mini" @click.prevent="addRow()"
          >添加规则
        </tis-button>
      </div>
      <div style="margin-top: 16px">
        <tis-form
          v-if="form.type != 'log'"
          ref="alarmRuleForm"
          :model="dynamicValidateForm"
        >
          <div>
            <tis-table
              :data="dynamicValidateForm.alarmRuleList"
              style="width: 100%"
            >
              <tis-table-column
                prop="subject_index"
                label="指标"
                min-width="20%"
              >
                <template scope="scope">
                  <tis-form-item
                    class="yq-tis-form-item"
                    :prop="`alarmRuleList.${scope.$index}.subject_index`"
                    :rules="[
                      {
                        required: true,
                        message: '请选择指标',
                        trigger: 'change',
                      },
                    ]"
                  >
                    <tis-select
                      style="width: 100%"
                      v-if="form.type == 'device'"
                      v-model="scope.row.subject_index"
                      placeholder="请选择指标"
                      @change="
                        selectTelegraf(scope.row.subject_index, scope.$index)
                      "
                    >
                      <tis-option
                        v-for="item in telegrafList"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      >
                      </tis-option>
                    </tis-select>
                    <tis-select
                      v-else
                      v-model="scope.row.subject_index"
                      placeholder="请选择指标"
                    >
                      <tis-option
                        v-for="item in pluginAttributes"
                        :key="item.index"
                        :label="item.name"
                        :value="item.value"
                      >
                      </tis-option>
                    </tis-select>
                  </tis-form-item>
                </template>
              </tis-table-column>
              <tis-table-column prop="conditions" label="条件" min-width="20%">
                <template slot-scope="scope">
                  <tis-form-item
                    class="yq-tis-form-item"
                    :prop="`alarmRuleList.${scope.$index}.conditions`"
                    :rules="[
                      {
                        required: true,
                        message: '请选择条件',
                        trigger: 'change',
                      },
                    ]"
                  >
                    <tis-select
                      v-if="conditions"
                      v-model="scope.row.conditions"
                      placeholder="请选择条件"
                    >
                      <tis-option label="包含" value="contain"></tis-option>
                      <tis-option
                        label="不包含"
                        value="notContain"
                      ></tis-option>
                    </tis-select>
                    <tis-select
                      v-else
                      v-model="scope.row.conditions"
                      placeholder="请选择条件"
                    >
                      <tis-option label="大于" value=">"></tis-option>
                      <tis-option label="小于" value="<"></tis-option>
                      <tis-option label="大于等于" value=">="></tis-option>
                      <tis-option label="小于等于" value="<="></tis-option>
                      <tis-option label="等于" value="="></tis-option>
                      <tis-option label="不等于" value="!="></tis-option>
                    </tis-select>
                  </tis-form-item>
                </template>
              </tis-table-column>
              <tis-table-column label="一般告警" min-width="25%">
                <tis-table-column
                  prop="commonly"
                  label="指标阈值"
                  min-width="15%"
                >
                  <template slot-scope="scope">
                    <tis-form-item
                      class="yq-tis-form-item"
                      :rules="[{ validator: validatePass, trigger: 'blur' }]"
                      :prop="`alarmRuleList.${scope.$index}.commonly`"
                    >
                      <tis-input
                        v-model="scope.row.commonly"
                        placeholder="请输入"
                      ></tis-input>
                    </tis-form-item>
                  </template>
                </tis-table-column>
                <tis-table-column
                  prop="commonlySum"
                  label="连续出现次数"
                  min-width="10%"
                >
                  <template slot-scope="scope">
                    <tis-form-item
                      class="yq-tis-form-item"
                      :rules="[{ validator: validateSum, trigger: 'blur' }]"
                      :prop="`alarmRuleList.${scope.$index}.commonlySum`"
                    >
                      <tis-input
                        type="number"
                        v-model="scope.row.commonlySum"
                        placeholder="请输入"
                      ></tis-input>
                    </tis-form-item>
                  </template>
                </tis-table-column>
              </tis-table-column>
              <tis-table-column label="严重告警" min-width="25%">
                <tis-table-column
                  prop="serious"
                  label="指标阈值"
                  min-width="15%"
                >
                  <template slot-scope="scope">
                    <tis-form-item
                      class="yq-tis-form-item"
                      :rules="[{ validator: validatePass, trigger: 'blur' }]"
                      :prop="`alarmRuleList.${scope.$index}.serious`"
                    >
                      <tis-input
                        v-model="scope.row.serious"
                        placeholder="请输入"
                      ></tis-input>
                    </tis-form-item>
                  </template>
                </tis-table-column>
                <tis-table-column
                  prop="seriousSum"
                  label="连续出现次数"
                  min-width="10%"
                >
                  <template slot-scope="scope">
                    <tis-form-item
                      class="yq-tis-form-item"
                      :rules="[{ validator: validateSum, trigger: 'blur' }]"
                      :prop="'alarmRuleList.' + scope.$index + '.seriousSum'"
                    >
                      <tis-input
                        type="number"
                        v-model="scope.row.seriousSum"
                        placeholder="请输入"
                      ></tis-input>
                    </tis-form-item>
                  </template>
                </tis-table-column>
              </tis-table-column>
              <tis-table-column prop="handle" label="操作" min-width="10%">
                <template slot-scope="scope">
                  <span class="selected-color" @click="deleteRow(scope)"
                    >删除</span
                  >
                </template>
              </tis-table-column>
            </tis-table>
          </div>
          <div style="margin-top: 8px" class="flex">
            <tis-form-item
              prop="trigger_type"
              :rules="[
                { required: true, message: '请选择一项', trigger: 'change' },
              ]"
            >
              <tis-radio-group v-model="dynamicValidateForm.trigger_type">
                <tis-radio label="0">满足任意条件时触发</tis-radio>
                <tis-radio label="1">满足所有条件时触发</tis-radio>
              </tis-radio-group>
            </tis-form-item>
          </div>
        </tis-form>
        <tis-form
          v-else-if="form.type == 'log'"
          ref="alarmRuleForm"
          :model="dynamicValidateForm"
        >
          <div>
            <tis-table
              border
              :data="dynamicValidateForm.alarmRuleList"
              style="width: 100%"
            >
              <tis-table-column
                prop="commonly"
                label="一般告警"
                min-width="45%"
              >
                <template slot-scope="scope">
                  <tis-form-item
                    class="yq-tis-form-item"
                    :rules="[{ validator: validatePass, trigger: 'blur' }]"
                    :prop="`alarmRuleList.${scope.$index}.commonly`"
                  >
                    <tis-input
                      v-model="scope.row.commonly"
                      placeholder="请输入"
                    ></tis-input>
                  </tis-form-item>
                </template>
              </tis-table-column>
              <tis-table-column prop="serious" label="严重告警" min-width="45%">
                <template slot-scope="scope">
                  <tis-form-item
                    class="yq-tis-form-item"
                    :rules="[{ validator: validatePass, trigger: 'blur' }]"
                    :prop="`alarmRuleList.${scope.$index}.serious`"
                  >
                    <tis-input
                      v-model="scope.row.serious"
                      placeholder="请输入"
                    ></tis-input>
                  </tis-form-item>
                </template>
              </tis-table-column>
              <tis-table-column prop="handle" label="操作" min-width="10%">
                <template slot-scope="scope">
                  <span class="selected-color" @click="deleteRow(scope)"
                    >删除</span
                  >
                </template>
              </tis-table-column>
            </tis-table>
          </div>
          <div style="margin-top: 8px" class="flex">
            <tis-form-item
              prop="trigger_type"
              :rules="[
                { required: true, message: '请选择一项', trigger: 'change' },
              ]"
            >
              <tis-radio-group v-model="dynamicValidateForm.trigger_type">
                <tis-radio label="0">满足任意条件时触发</tis-radio>
                <tis-radio label="1">满足所有条件时触发</tis-radio>
              </tis-radio-group>
            </tis-form-item>
          </div>
        </tis-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    form: {},
    pluginList: {},
    dynamicValidateForm: { alarmRuleList: [], trigger_type: "" },
    // showPop: Boolean,
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      pluginAttributes: [], //插件的属性列表
      //指标信息
      telegrafList: [
        {
          index: "18",
          value: "cpuRateAvg",
          name: "cup平均使用率",
          key: "18-cpuRateAvg",
        },
        {
          index: "4",
          value: "usedPercent",
          name: "内存使用率",
          key: "4-usedPercent",
        },
        {
          index: "5",
          value: "usedPercent",
          name: "磁盘使用率",
          key: "5-usedPercent",
        },
      ],
      isHover: false, //ip选择or输入
      videoTableData: [], //IP信息
      logOptions: [], //日志文件信息
      conditions: false, //条件
      isShow: false,
      disabled: false,
      logsofts: [],
    };
  },
  created() {
    if (this.form && this.form.type == "plugin") {
      this.getPluginAttributes(this.form.plugin_id);
    }
    this.getLogSofts();
  },
  updated() {
    // console.log("数据更新了啊啊")
  },
  computed: {
    showsClear() {
      return this.clearable && this.form.equipment_id && this.isHover;
    },
  },
  watch: {
    form: {
      handler(newName) {
        if (newName.id != undefined) {
          this.disabled = true;
        }
        // if (newName.type == "log") {
        //   this.getLogs(); //获取日志文件信息
        // }
      },
      immediate: true,
    },
  },
  mounted() {
    this.getIpList(); //获取IP信息
  },
  methods: {
    logFileChange() {},
    //选中日志软件 获取对应日志文件
    logsorftChange(e) {
      this.$set(this.form,"log_file","")
      this.getLogFileList(e);
    },
    getLogFileList(e) {
      let soft = this.logsofts[e];
      let logFilePath = "";
      if (process.env.NODE_ENV === "development") {
        logFilePath = soft.dir;
      } else {
        logFilePath = soft.dir.substr(0, soft.dir.length - 4) + "/logs";
      }
      let pams = {
        ip: this.$store.state.yqInfo.chooseIP,
        path: logFilePath,
      };
      //清空日志文件列表数据
      this.logOptions = [];
      this.$api
        .getServerAction("/insight/logAlarm/getLogFilesList", pams)
        .then((res) => {
          if (res.code === 200) {
            this.logOptions = res.data.map((item) => {
              item.name = logFilePath + "/" + item.name;
              return item;
            });
          }
        });
    },
    //获取日志软件
    getLogSofts() {
      this.$api
        .getOutServerAction(window.ALL_SERVICE_REGISTERINFO)
        .then((res) => {
          if (res != undefined) {
            this.logsofts = res.ServiceRegInfo;
            if(this.form.log_name_type !== undefined){
                this.getLogFileList(this.form.log_name_type);
            }
          }
        });
    },
    //获取日志文件信息
    getLogs() {
      this.$api
        .getOutServerAction(window.ALL_SERVICE_REGISTERINFO)
        .then((res) => {
          if (res.ServiceRegInfo.length > 0) {
            for (let i = 0; i < res.ServiceRegInfo.length; i++) {
              if (
                res.ServiceRegInfo[i].dir != "" ||
                res.ServiceRegInfo[i].dir != undefined
              ) {
                if (
                  res.ServiceRegInfo[i].dir.substr(
                    res.ServiceRegInfo[i].dir.length - 4,
                    4
                  ) == "/bin" ||
                  res.ServiceRegInfo[i].dir.substr(
                    res.ServiceRegInfo[i].dir.length - 4,
                    4
                  ) == "/Bin"
                ) {
                  this.logOptions.push({
                    value:
                      res.ServiceRegInfo[i].dir.slice(
                        0,
                        res.ServiceRegInfo[i].dir.length - 3
                      ) + "logs",
                    name: res.ServiceRegInfo[i].cname,
                  });
                } else {
                  this.logOptions.push({
                    value: res.ServiceRegInfo[i].dir,
                    name: res.ServiceRegInfo[i].cname,
                  });
                }
              }
            }
          }
        });
    },
    //获取IP信息
    getIpList() {
      this.$api
        .getServerAction("/insight/statusInfo/getAllDeviceIPList")
        .then((res) => {
          if (res.code === 200) {
            for (let i = 0; i < res.data.length; i++) {
              this.videoTableData.push({
                value: res.data[i].ip,
              });
            }
          }
        });
    },
    //类型选择
    changeType() {
      this.dynamicValidateForm.alarmRuleList = [];
      if (this.form.id != undefined) {
        this.$api
          .getServerAction("/insight/alarmTemplate/getAlarmTemplateById", {
            id: this.form.id,
          })
          .then((res) => {
            if (res.code == 200) {
              if (res.data.type == this.form.type) {
                let item = res.data;
                if (item.alarmRuleList.length > 0) {
                  for (let i = 0; i < item.alarmRuleList.length; i++) {
                    var obj = eval("(" + item.alarmRuleList[i].contents + ")");
                    var a = null;
                    var a1 = null;
                    var b = null;
                    var b1 = null;
                    if (obj.length == 1 && obj[0].level == 10) {
                      a = obj[0].value;
                      a1 = obj[0].times;
                    } else if (obj.length == 1 && obj[0].level == 20) {
                      b = obj[0].value;
                      b1 = obj[0].times;
                    } else if (obj.length > 1) {
                      a = obj[0].value;
                      a1 = obj[0].times;
                      b = obj[1].value;
                      b1 = obj[1].times;
                    }
                    this.dynamicValidateForm.alarmRuleList.push({
                      subject_index: item.alarmRuleList[i].subject_index,
                      conditions: item.alarmRuleList[i].conditions,
                      commonly: a,
                      serious: b,
                      commonlySum: a1,
                      seriousSum: b1,
                      id: item.alarmRuleList[i].id,
                      contents: item.alarmRuleList[i].contents,
                    });
                  }
                }
              } else {
                this.dynamicValidateForm.alarmRuleList = [];
              }
            }
          });
      } else {
        this.addRow();
      }
    },
    //获取客户端信息
    selectTelegraf(vld, index) {
      let obj = this.telegrafList.find((item) => {
        return item.key === vld;
      });
      this.conditions = false;
      this.dynamicValidateForm.alarmRuleList[index].info_index = obj.index;
      this.dynamicValidateForm.alarmRuleList[index].conditions = "";
      this.dynamicValidateForm.alarmRuleList[index].commonly = "";
      this.dynamicValidateForm.alarmRuleList[index].commonlySum = "";
      this.dynamicValidateForm.alarmRuleList[index].serious = "";
      this.dynamicValidateForm.alarmRuleList[index].seriousSum = "";
    },
    //检验连续出现次数
    validateSum(rule, value, callback) {
      var a = rule.field.split(".");
      if (a[2] == "commonlySum") {
        if (
          this.dynamicValidateForm.alarmRuleList[a[1]].commonly != "" &&
          value == ""
        ) {
          return callback(new Error("出现次数不能为空"));
        }
      } else if (a[2] == "seriousSum") {
        if (
          this.dynamicValidateForm.alarmRuleList[a[1]].serious != "" &&
          value == ""
        ) {
          return callback(new Error("出现次数不能为空"));
        }
      } else {
        console.log("success");
        return;
      }
      callback();
    },
    validateLogfile(rule, value, callback) {
      if (rule.field == "log_file") {
        if (!this.form.log_file) {
          return callback(new Error("请选择日志文件地址"));
        }
      }
      return callback();
    },
    //检验IP
    validateIp(rule, value, callback) {
      var reg =
        /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-4][0-9])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;
      var re = new RegExp(reg);
      var ip = value;
      if (!re.test(ip) && ip != "" && ip != undefined) {
        return callback(new Error("请填写有效的IP地址！"));
      }

      return callback();
    },
    //检验指标阈值
    validatePass(rule, value, callback) {
      var a = rule.field.split(".");
      console.log(value);
      if (a[2] == "commonly") {
        if (
          this.dynamicValidateForm.alarmRuleList[a[1]].commonlySum != "" &&
          value == ""
        ) {
          return callback(new Error("一般告警不能为空"));
        }
        if (
          this.isEmpty(this.dynamicValidateForm.alarmRuleList[a[1]].serious) &&
          this.isEmpty(value)
        ) {
          return callback(new Error("告警必有一项不能为空"));
        }
      } else if (a[2] == "serious") {
        if (
          this.dynamicValidateForm.alarmRuleList[a[1]].seriousSum != "" &&
          value == ""
        ) {
          return callback(new Error("严重告警不能为空"));
        }
        if (
          this.isEmpty(this.dynamicValidateForm.alarmRuleList[a[1]].commonly) &&
          this.isEmpty(value)
        ) {
          return callback(new Error("告警必有一项不能为空"));
        }
      } else {
        console.log("success");
      }
      return callback();
    },
    //判断是否为空
    isEmpty(v) {
      switch (typeof v) {
        case "undefined":
          return true;
        case "string":
          if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, "").length == 0)
            return true;
          break;
        case "boolean":
          if (!v) return true;
          break;
        case "number":
          if (0 === v || isNaN(v)) return true;
          break;
        case "object":
          if (null === v || v.length === 0) return true;
          for (var i in v) {
            return false;
          }
          return true;
      }
      return false;
    },
    //输入框可输入
    handleIconClick() {
      if (this.showsClear) {
        this.form.equipment_id = "";
      } else {
        this.$refs.input.focus();
      }
    },
    //可搜索
    querySearch(queryString, cb) {
      var videoTableData = this.videoTableData;
      var results = queryString
        ? videoTableData.filter(this.createFilter(queryString))
        : videoTableData;
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    /**
     * 获取插件的属性列表
     * @param pluginCode 插件标识
     */
    getPluginAttributes(pluginCode) {
      this.pluginAttributes = [];
      this.$yqLoading.show();
      this.$api
        .getServerAction("/insight/plugin/getPluginAlarmAttributes", {
          code: pluginCode,
        })
        .then((res) => {
          this.$yqLoading.hide();
          if (res.code == 200) {
            this.pluginAttributes = res.data;
            console.log("属性列表：", this.pluginAttributes);
          } else {
            this.$message.warning("获取插件的属性列表失败！");
          }
        });
    },
    /**
     * 添加告警规则
     * */
    addRow() {
      if (!this.form.type) {
        this.$message.warning("请先选择模板信息类型！");
        return;
      }
      if (!this.dynamicValidateForm.alarmRuleList) {
        this.dynamicValidateForm.alarmRuleList = [];
      }
      var list = {
        subject_index: "",
        conditions: "",
        commonly: "",
        serious: "",
        commonlySum: "",
        seriousSum: "",
        contents: "",
        handle: "",
        handle2: "",
      };
      console.log("滴滴滴滴滴");
      this.dynamicValidateForm.alarmRuleList.push(list);
    },
    /**
     * 删除告警规则
     *
     * */
    deleteRow(data) {
      this.dynamicValidateForm.alarmRuleList.splice(data.$index, 1);
    },

    /**
     * 确定按钮
     */
    submit() {
      this.$refs.form.validate((valid) => {
        this.$refs.alarmRuleForm.validate((valid2) => {
          console.log(
            "validddddd === ",
            valid2,
            valid,
            this.$refs.alarmRuleForm
          );
          if (valid && valid2) {
            if (this.dynamicValidateForm.alarmRuleList.length > 0) {
              for (
                let i = 0;
                i < this.dynamicValidateForm.alarmRuleList.length;
                i++
              ) {
                let contentsArray = [];
                if (this.form.type == "log") {
                  this.dynamicValidateForm.alarmRuleList[i].commonlySum = "0";
                  this.dynamicValidateForm.alarmRuleList[i].seriousSum = "0";
                }
                if (
                  this.dynamicValidateForm.alarmRuleList[i].commonly != "" &&
                  this.dynamicValidateForm.alarmRuleList[i].commonlySum != ""
                ) {
                  contentsArray.push({
                    level: 10,
                    value: this.dynamicValidateForm.alarmRuleList[i].commonly,
                    times: parseInt(
                      this.dynamicValidateForm.alarmRuleList[i].commonlySum
                    ),
                  });
                }
                if (
                  this.dynamicValidateForm.alarmRuleList[i].serious != "" &&
                  this.dynamicValidateForm.alarmRuleList[i].seriousSum != ""
                ) {
                  contentsArray.push({
                    level: 20,
                    value: this.dynamicValidateForm.alarmRuleList[i].serious,
                    times: parseInt(
                      this.dynamicValidateForm.alarmRuleList[i].seriousSum
                    ),
                  });
                }
                this.dynamicValidateForm.alarmRuleList[i].contents =
                  JSON.stringify(contentsArray);
              }
              this.form.alarmRuleList = this.dynamicValidateForm.alarmRuleList;
              this.form.trigger_type = this.dynamicValidateForm.trigger_type;
              this.$yqLoading.show();
              let path = this.form.id
                ? "/insight/alarmTemplate/edit"
                : "/insight/alarmTemplate/create";
              let message = this.form.id ? "修改成功" : "添加成功";
              this.$api.postServerAction(path, this.form).then((res) => {
                this.$yqLoading.hide();
                if (res.code == 200) {
                  this.$message.success(message);
                  this.$emit("submitOk");
                }
              });
            } else {
              this.$message.error("告警规则不能为空！");
            }
          } else {
            return false;
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.m-title {
  margin: 16px 0;
  text-align: left;
}

.self-table-cell {
  height: 80px;
}

.table-title {
  height: 60px;
}

.cell {
  width: calc(100% / 7 - 8px);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cellLog {
  width: calc(100%);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.yq-tis-form-item {
  margin: 0px;
  padding: 0px;
}

.con-overplay {
  height: 300px;
  overflow: scroll;
  overflow-x: hidden;
}

.title-overplay {
  overflow: scroll;
  overflow-x: hidden;
}

.title-overplay::-webkit-scrollbar {
  width: 20;
  height: 60px;
  background-color: transparent;
}
.input-class {
  width: 400px;
}
</style>
