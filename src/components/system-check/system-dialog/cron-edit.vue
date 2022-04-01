<template>
  <div>
    <!--    接口信息-->
    <tis-dialog
        :title="title"
        :visible.sync="showCron"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="80%"
    >
      <tis-form ref="formCron" :model="formCron" label-width="100px">
        <tis-form-item
            label="接口名称"
            prop="name"
            :rules="[
            { required: true, message: '请输入接口名称', trigger: 'change' },
          ]"
        >
          <tis-input
              v-model.trim="formCron.name"
              placeholder="请输入接口名称"
              maxlength="50"
              show-word-limit
          ></tis-input>
        </tis-form-item>
        <tis-form-item
            v-for="(domain, index) in formCron.headerList"
            :key="'info-' + index"
            label="请求头"
            :prop="'headerList.' + index"
            :rules="[{ required: false, validator: validate, trigger: 'change' }]"
        >
          <div class="flex">
            <tis-input
                @input="change($event)"
                placeholder="请输入key值"
                v-model.trim="domain.key"
                style="margin-right: 10px"
            >
            </tis-input>
            <tis-input
                @input="change($event)"
                placeholder="请输入value值"
                v-model.trim="domain.value"
            >
            </tis-input>
            <tis-button
                v-if="index == 0"
                @click="addHeader"
                type="primary"
                icon="el-icon-plus"
                style="margin-left: 10px"
            ></tis-button>
            <tis-button
                v-if="index != 0"
                @click.prevent="removeHeader(domain)"
                type="danger"
                icon="el-icon-minus"
                style="margin-left: 10px"
            ></tis-button>
          </div>
        </tis-form-item>
        <tis-form-item
            label="请求方式"
            prop="method_type"
            :rules="[
            { required: true, message: '请选择请求方式', trigger: 'change' },
          ]"
        >
          <select-dict
              v-model="formCron.method_type"
              placeholder="请选择请求方式"
              type="requestType"
          ></select-dict>
        </tis-form-item>
        <tis-form-item
            label="接口地址"
            prop="url"
            :rules="[
            { required: true, validator: validateHttp, trigger: 'change' },
          ]"
        >
          <tis-input
              v-model.trim="formCron.url"
              maxlength="200"
              show-word-limit
              placeholder="请输入接口地址"
          ></tis-input>
        </tis-form-item>
        <tis-form-item label="接口说明" prop="description">
          <tis-input
              placeholder="请输入接口说明"
              type="textarea"
              maxlength="200"
              show-word-limit
              :rows="3"
              v-model="formCron.description"
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
            :rules="[{ required: false, validator: validate, trigger: 'change' }]"
        >
          <div class="flex">
            <tis-input
                placeholder="请输入key值"
                style="margin-right: 10px"
                v-model.trim="domain.key"
                @input="change($event)"
            >
            </tis-input>
            <tis-input
                placeholder="请输入value值"
                v-model.trim="domain.value"
                @input="change($event)"
            >
            </tis-input>
            <tis-button
                v-if="index == 0"
                @click="addDomain"
                type="primary"
                icon="el-icon-plus"
                style="margin-left: 10px"
            ></tis-button>
            <tis-button
                v-if="index != 0"
                @click.prevent="removeDomain(domain)"
                type="danger"
                icon="el-icon-minus"
                style="margin-left: 10px"
            ></tis-button>
          </div>
        </tis-form-item>

        <tis-form-item
            v-if="formCron.checkType != '1'"
            label="执行效率"
            prop="cron"
            :rules="[
            { required: true, message: '请输入执行效率', trigger: 'change' },
          ]"
        >
          <tis-input
              placeholder="请输入执行效率"
              v-model="formCron.cron"
              :disabled="true"
          >
            <a slot="append" class="config-btn">
              <tis-button type="primary" @click="dialogVisible = true"
              >配置cron
              </tis-button>
            </a>
          </tis-input>
        </tis-form-item>

        <tis-form-item label="返回成功属性" prop="custom_code">
          <tis-input
              v-model.trim="formCron.custom_code"
              placeholder="请输入返回成功状态码属性"
              maxlength="20"
              show-word-limit
          ></tis-input>
        </tis-form-item>
        <tis-form-item label="返回成功值" prop="custom_success">
          <tis-input
              v-model.trim="formCron.custom_success"
              maxlength="20"
              show-word-limit
              placeholder="请输入返回成功值"
          ></tis-input>
        </tis-form-item>
      </tis-form>
      <span slot="footer" class="dialog-footer">
        <tis-button @click="closeCron">取 消</tis-button>
        <tis-button type="primary" @click="submitCron">确 定</tis-button>
      </span>
    </tis-dialog>
    <!-- cron表达式    -->
    <tis-dialog
        title="配置cron"
        append-to-body
        width='80%'
        :visible.sync="dialogVisible"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :show-close="false"
        :close-on-press-escape="false"
        :style="$store.state.yqInfo.dialogBg"
    >
      <span>
        <easy-cron
            v-model="formCron.cron"
            width="60%"
            @handleClose="handleClose"
            :exeStartTime="0"
            :hideYear="true"
            :remote="null"
            :hideSecond="false"
        >
        </easy-cron>
      </span>

    </tis-dialog>
  </div>
</template>

<script>
import EasyCron from "../../easy-cron/index";

export default {
  components: {
    EasyCron,
  },
  data() {
    return {
      title: "",//标题
      dialogVisible: false,//配置cron开关
      showCron: false,//接口信息开关
      //接口信息
      formCron: {
        id: "",
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
        cron: this.cronValue,
      },
    };
  },
  watch: {
    cronValue(newVal) {
      if (newVal === this.formCron.cron) {
        return;
      }

      this.formCron.cron = newVal;
    },
    formCron(newVal) {
      if (newVal.cron != undefined) {
        this.$emit("change", newVal);
      }
    },
  },
  model: {
    prop: "cronValue",
    event: "change",
  },
  methods: {
    //定时任务
    showDetail(form) {
      if (this.$refs["formCron"] !== undefined) {
        // 清除表单内容和清除表单验证消息
        this.$refs["formCron"].resetFields();
      }
      this.formCron.paramList = [];
      this.formCron.headerList = [];
      if (form.id == "") {
        this.title = "添加配置";
      } else {
        this.title = "编辑配置";
      }
      this.showCron = true;
      this.formCron = form;
    },
    //接口信息提交
    submitCron() {
      this.formCron.class_id = this.$parent.classId;
      this.$refs.formCron.validate((valid) => {
        if (valid) {
          let path = "/insight/systemCheck/updateCronJob";
          let message = "修改成功";
          if (this.formCron.id == "") {
            path = "/insight/systemCheck/addCronJob";
            message = "添加成功";
            this.formCron.status = "0";
          }

          let params = {};
          this.formCron.paramList.forEach((item) => {
            if (item.key != "" || item.value != "") {
              params[item.key] = item.value;
            }
          });
          if (JSON.stringify(params) != "{}") {
            this.formCron.params = JSON.stringify(params);
          } else {
            this.formCron.params = "";
          }

          let headers = {};
          this.formCron.headerList.forEach((item) => {
            if (item.key != "" || item.value != "") {
              headers[item.key] = item.value;
            }
          });
          if (JSON.stringify(headers) != "{}") {
            this.formCron.headers = JSON.stringify(headers);
          } else {
            this.formCron.headers = "";
          }
          if (this.formCron.checkType == "1") {
            path = "/insight/systemCheckBatch/update";
          }

          this.$api.postServerAction(path, this.formCron).then((res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              this.$message.success(message);
              this.showCron = false;
              if (this.formCron.checkType == "1") {
                this.$parent.$refs.batchPage.page();
              } else {
                this.$parent.$refs.child.page(this.$parent.classId);
              }
            } else {
              this.$message.error(res.info);
            }
          });
        } else {
          return false;
        }
      });
    },
    //关闭接口信息窗口
    closeCron() {
      this.showCron = false;
    },
    //新增参数
    addDomain() {
      this.$forceUpdate();
      this.formCron.paramList.push({
        value: "",
        key: "",
      });
    },
    //删除参数
    removeDomain(item) {
      this.$forceUpdate();
      var index = this.formCron.paramList.indexOf(item);
      if (index !== -1) {
        this.formCron.paramList.splice(index, 1);
      }
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
    //请求头、参数检验
    validate(rule, value, callback) {
      console.log(value);
      if (value.key == "" && value.value != "") {
        return callback(new Error("请输入key值"));
      }
      if (value.key != "" && value.value == "") {
        return callback(new Error("请输入value值"));
      }
      return callback();
    },
    //IP地址验证
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
    //关闭cron表达式弹框
    handleClose(sum) {

      if (this.formCron.cron!=""){
        for (let i =sum.length-1;i>-1; i--) {
          let a=this.timeStamp(sum[i])
          if(i-1>-1){
            let b=this.timeStamp(sum[i-1])
            let c=a-b
            console.log(c)
            if (c<30000){

              console.log("每秒指定执行时间必须大于30秒")
              this.$message.error("每秒指定执行时间必须大于30秒")
              return
            }
          }
        }
      }
      this.dialogVisible=false
    },
    //时间转换
    timeStamp(time) {
      var date = time;
      date = date.substring(0, 19);
      date = date.replace(/-/g, '/'); //必须把日期'-'转为'/'
      var timestamp = new Date(date).getTime();
      return timestamp
    },
    change() {
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
