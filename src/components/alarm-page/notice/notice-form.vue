<template>
  <div>
    <tis-form
      ref="form"
      :model="form"
      label-width="110px"
      style="margin-top: 10px"
    >
      <tis-form-item
        label="模板名称"
        prop="name"
        :rules="[
          { required: true, message: '请输入模板名称', trigger: 'blur' },
        ]"
      >
        <tis-input
          :disabled="disabled"
          v-model.trim="form.name"
          maxlength="50"
          show-word-limit
          placeholder="请输入模板名称"
        ></tis-input>
      </tis-form-item>

      <tis-form-item
        label="通知分类"
        prop="alarm_type"

      >
        <select-dict
          :disabled="disabled"
          v-model="form.alarm_type"
          placeholder="请选择通知分类"
          type="noticeType"
        ></select-dict>
      </tis-form-item>

      <tis-form-item
        label="告警模板"
        prop="alarm_ids"
        :rules="[
          { required: true, message: '请选择告警模板', trigger: 'blur' },
        ]"
      >
        <tis-select
          v-model="form.alarm_ids"
          multiple
          placeholder="请选择告警模板"
          style="width: 100%"
        >
          <tis-option
            v-for="item in alarmList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </tis-option>
        </tis-select>
      </tis-form-item>

      <tis-form-item
        label="标题"
        prop="title"
        :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]"
      >
        <tis-input
          placeholder="请输入标题"
          :disabled="disabled"
          maxlength="50"
          show-word-limit
          v-model.trim="form.title"
        ></tis-input>
      </tis-form-item>
      <tis-form-item
        label="通知请求地址"
        prop="request_url"
        :rules="[
          { required: true, validator: validateHttpUrl, trigger: 'blur' },
        ]"
      >
        <tis-input
          v-model.trim="form.request_url"
          placeholder="请输入请求地址"
          maxlength="200"
          show-word-limit
        ></tis-input>
      </tis-form-item>
      <tis-form-item label="模板内容" prop="contents">
        <editor ref="editor" v-model="form.contents"></editor>
      </tis-form-item>
    </tis-form>
  </div>
</template>

<script>
import editor from "../../page/editor";

export default {
  components: {
    editor: editor, //富文本框
  },
  props: {
    //告警模板信息
    form: {
      alarm_ids: [],
    },
    pluginList: {},
    alarmRuleList: [], //告警规则信息
    showPop: Boolean, //是否显示
    disabled: Boolean, //是否只读
  },
  data() {
    return {
      alarmList: null, //告警信息
    };
  },
  updated() {
    if (this.disabled && this.$refs.editor != undefined) {
      this.$refs.editor.noEdit();
    }
    if (!this.showPop && this.form.id != undefined) {
      this.$emit("page");
    }
  },
  mounted() {
    //获取告警信息
    this.getAlarmList();
  },
  methods: {
    //通知请求地址校验
    validateHttpUrl(rule, value, callback) {
      if (value == "" || value == undefined) {
        return callback(new Error("请求地址不能为空"));
      }

      if (!this.CHECK_URL(value)) {
        return callback(new Error("请求地址格式错误"));
      }

      return callback();
    }, //验证地址格式
    CHECK_URL(url) {
      //url= 协议://(ftp的登录信息)[IP|域名](:端口号)(/或?请求参数)
      var strRegex =
        "^((https|http|ftp)://)?" + //(https或http或ftp):// 可有可无
        "(([\\w_!~*'()\\.&=+$%-]+: )?[\\w_!~*'()\\.&=+$%-]+@)?" + //ftp的user@  可有可无
        "(([0-9]{1,3}\\.){3}[0-9]{1,3}" + // IP形式的URL- 3位数字.3位数字.3位数字.3位数字
        "|" + // 允许IP和DOMAIN（域名）
        "(localhost)|" + //匹配localhost
        "([\\w_!~*'()-]+\\.)*" + // 域名- 至少一个[英文或数字_!~*\'()-]加上.
        "\\w+\\." + // 一级域名 -英文或数字  加上.
        "[a-zA-Z]{1,6})" + // 顶级域名- 1-6位英文
        "(:[0-9]{1,5})?" + // 端口- :80 ,1-5位数字
        "((/?)|" + // url无参数结尾 - 斜杆或这没有
        "(/[\\w_!~*'()\\.;?:@&=+$,%#-]+)+/?)$"; //请求参数结尾- 英文或数字和[]内的各种字符
      var re = new RegExp(strRegex, "i"); //i不区分大小写
      //将url做uri转码后再匹配，解除请求参数中的中文和空字符影响
      if (re.test(encodeURI(url))) {
        return true;
      } else {
        return false;
      }
    },
    //获取告警信息
    getAlarmList() {
      let path = "/insight/noticeTemplate/getAllAlarmList";
      let params = {
        id: this.form.id,
      };
      if (this.form.id == undefined) {
        path = "/insight/noticeTemplate/getAlarmList";
        params = {};
      }
      this.$api.getServerAction(path, params).then((res) => {
        if (res.code == 200) {
          this.alarmList = res.data;
        } else {
          this.$message.warning(res.info);
        }
      });
    },
    /**
     * 确定按钮
     */
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$yqLoading.show();
          let path = "/insight/noticeTemplate/edit";
          let message = "修改成功";
          if (this.form.id == undefined) {
            path = "/insight/noticeTemplate/create";
            message = "添加成功";
          }
          console.log(this.form.alarm_ids);
          let ids = "";
          this.form.alarm_ids.forEach((item, index) => {
            if (index + 1 == this.form.alarm_ids.length) {
              ids += item;
            } else {
              ids += item + ",";
            }
          });
          this.form.alarm_ids = ids;
          this.$api.postServerAction(path, this.form).then(
            (res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success(message);
                this.lodaing();
              }
            },
            function () {
              // errorFunc(error, self.$message);
            }
          );
        } else {
          return false;
        }
      });
    },
    //加载信息
    lodaing() {
      this.$emit("page");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
