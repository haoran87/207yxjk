<template>
  <div>
    <div>
      <tis-form
          ref="issueForm"
          :model="form"

          style="margin-top: 10px"
      >
        <div style="display: flex">
          <tis-radio v-model="radio" label="1" style="margin-top: 14px;">自定义IP地址
          </tis-radio>
          <tis-form-item style="width: 100%" prop="url1" :rules="[
            { required: false,validator: validateCode, trigger: 'change' },
          ]">
            <tis-input v-model.trim="form.url1" placeholder="请输入IP地址" :disabled="disabled"></tis-input>
          </tis-form-item>


        </div>

        <div style="display: flex">
          <tis-radio v-model="radio" label="2" style="margin-top: 14px;">
            <span style="margin-left:15px">选择IP地址</span>
          </tis-radio>
          <tis-form-item style="width: 100%" prop="url" :rules="[
            { required: false,validator: validateCode1, trigger: 'change' },
          ]">
            <tis-input v-model.trim="form.url" :disabled="disabled1" placeholder="请输入IP地址"></tis-input>
          </tis-form-item>
        </div>
        <div v-show="radio=='2'">
          <tis-table
              :header-cell-style="{background:'var(--layout-bg-3)',color:'var(--text-color)',fontFamily:'',fontSize:'var(--text-size-big)'}"
              ref="multipleTable"
              :cell-style="setCellColor"
              :data="tableData"
              tooltip-effect="dark"
              highlight-current-row
              style="width: 100%"
              @selection-change="handleSelectionChange">
            <tis-table-column
                align="center"
                type="selection"
                width="55">
            </tis-table-column>
            <tis-table-column
                label="序号"
                type="index" align="center"
                width="60">

            </tis-table-column>
            <tis-table-column
                label="IP名称"
                prop="name"
                width="150">
            </tis-table-column>
            <tis-table-column
                prop="url"
                label="IP地址"
                show-overflow-tooltip>
              <template slot-scope="scope">
                <span @click="showUrl( scope.row )"> {{ scope.row.url }}</span>
              </template>
            </tis-table-column>
            <tis-table-column
                prop="describe"
                label="描述"
                show-overflow-tooltip>
            </tis-table-column>
          </tis-table>
          <list-page
              style="margin-top: 16px"
              :pageInfo="pageInfo"
              :curPage="curPage"
              :pageSize="pageSize"
              @cpc="curPageChange"
          ></list-page>
        </div>

        <div>
          <tis-form-item prop="path" label="配置地址"
                         :rules="[{ required: true, validator: validateUrl, trigger: 'change' }]">
            <el-autocomplete
                class="inline-input"
                ref="input"
                style="width: 80%"
                v-model="form.path"
                :fetch-suggestions="querySearch"
                placeholder="请选择或输入配置地址"
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
                  <span style="float: left">{{ item.value }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </div>
              </template>
            </el-autocomplete>
          </tis-form-item>
        </div>
        <tis-form-item>
          <tis-radio @click.native.prevent="clickitem('1')" v-model="force_status" label="0"
                     style="float: left;margin-top: 10px">强制下发
          </tis-radio>
        </tis-form-item>
        <tis-form-item>
          <div style="float: right;margin-top: 20px">
            <tis-button type="primary" @click="up">上一步</tis-button>
            <tis-button type="primary" @click="submit">下一步</tis-button>
          </div>

        </tis-form-item>
      </tis-form>

    </div>
    <tis-dialog
        title="IP信息"
        :visible.sync="showIP"
        :modal='false'
        :modal-append-to-body='false'
        :close-on-click-modal='false'
        :close-on-press-escape=' false'
        style="background-color: rgba(150,149,149,0.8)"
    >
      <tis-table
          :header-cell-style="{background:'var(--layout-bg-3)',color:'var(--text-color)',fontFamily:'',fontSize:'var(--text-size-big)'}"
          ref="ipTable"
          :data="ipdata"
          :row-key="(row) => { return row.url }"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="ipChange">
        <tis-table-column
            align="center"
            type="selection"
            :reserve-selection="true"
            width="55">
        </tis-table-column>
        <tis-table-column
            label="序号"
            type="index" align="center"
            width="120">
        </tis-table-column>
        <tis-table-column
            prop="url"
            label="IP地址"
            show-overflow-tooltip>
        </tis-table-column>
      </tis-table>


      <span slot="footer" class="dialog-footer">
		     <tis-button @click="closeIP">取 消</tis-button>
		     <tis-button type="primary" @click="submitIP">确 定</tis-button>
		   </span>
    </tis-dialog>
  </div>

</template>

<script>
export default {
  components: {},
  updated() {
    if (!this.showPop) {
      this.$emit("page");
    }
  },
  watch: {
    radio(val) {
      if (val == '1') {
        this.disabled1 = true
        this.disabled = false
        this.form.url = ""
      } else if (val == '2') {
        this.disabled = true
        this.disabled1 = false
        this.form.url1 = ""
      }
    },

  },
  created() {
    this.ipList();
  },
  props: {
    id: String,
    showPop: Boolean
  },
  computed: {
    showsClear() {
      return this.clearable && this.form.path && this.isHover;
    },

  },
  data() {
    return {
      clearable: {
        type: Boolean,
        default: true,
      },
      isHover: false,
      curPage: 1,
      pageSize: 5,
      pageInfo: null,
      radio: "0",
      force_status: "0",
      isAll: false,
      disabled: false,
      disabled1: false,
      showIP: false,
      showaa: true,
      options: [],//配置地址
      tableData: [],
      ipObject: {},//单个IP信息
      ipdata: [],//ip数组
      urlData: [],
      multipleSelection: [],//复选框内容
      ipArray: [],//IP组
      //表单信息
      form: {
        url: "",
        url1: "",
        path: "",
      }
    };
  },
  mounted() {
    //获取配置地址
    this.getDir()
  },
  methods: {
    //修改列表行颜色
    setCellColor({row, columnIndex}) {
      let obj ;
         if(columnIndex==3&&this.form.url!=''){
           for (let i = 0; i < this.form.url.split(",").length; i++) {
             if (row.url.indexOf(this.form.url.split(",")[i])!=-1){
               obj='color: var(--color-5)' // 返回对象 可以设置color 字体颜色，也可以设置background单元格的背景颜色
               break
             }
           }
         }
      return obj
    },
    //ip选择框
    ipChange(val) {
      this.multipleSelection = val;
    },
    //多选框回显
    toggleSelection() {
      //清除选择框勾选
      this.$refs.ipTable.clearSelection();
      this.urlData.forEach(row => {
        //勾选选择框
        this.$refs.ipTable.toggleRowSelection(row, true);
      })
    },
    //多选选择框
    handleSelectionChange(val) {
      this.ipArray = val
      this.addUrl(val)
    },
    //添加url
    addUrl(val) {
      let ids = ""
      if (val.length > 0) {
        val.forEach((o, index) => {
          if ((index + 1) == val.length) {
            ids += o.url
          } else {
            ids += o.url + ","
          }
        })
        this.form.url = ids
        if (this.multipleSelection.length > 0) {
          let arr = this.multipleSelection
          for (let i = 0; i < arr.length; i++){
            if (ids.indexOf(arr[i].url) == -1) {
              this.form.url += ","
              this.form.url += arr[i].url
            }else{
              arr.splice(i--, 1);
            }
          }
          this.multipleSelection= arr
        }
      } else {
        this.form.url = ""
        if (this.multipleSelection.length > 0) {
          let arr = this.multipleSelection
          for (let i = 0; i < arr.length; i++){
            if ((i + 1) == arr.length) {
              this.form.url += arr[i].url
            } else {
              this.form.url += arr[i].url + ","
            }
          }
        }
      }




    },
    //可搜索
    querySearch(queryString, cb) {
      var videoTableData = this.options;
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
    //输入框可输入
    handleIconClick() {
      if (this.showsClear) {
        this.form.path = "";
      } else {
        this.$refs.input.focus();
      }
    },
    //获取配置地址
    getDir() {
      this.$api
          .getOutServerAction(window.ALL_SERVICE_REGISTERINFO)
          .then((res) => {
            if (res != undefined) {
              if (res.ServiceRegInfo.length > 0) {
                for (let i = 0; i < res.ServiceRegInfo.length; i++) {
                  if (res.ServiceRegInfo[i].dir != "" || res.ServiceRegInfo[i].dir != undefined) {
                    if (res.ServiceRegInfo[i].dir.substr(res.ServiceRegInfo[i].dir.length - 4, 4) == "/bin" || res.ServiceRegInfo[i].dir.substr(res.ServiceRegInfo[i].dir.length - 4, 4) == "/Bin") {
                      this.options.push({
                        value: res.ServiceRegInfo[i].dir.slice(0, res.ServiceRegInfo[i].dir.length - 3) + "conf",
                        name: res.ServiceRegInfo[i].cname
                      })
                    } else {
                      this.options.push({
                        value: res.ServiceRegInfo[i].dir,
                        name: res.ServiceRegInfo[i].cname
                      })
                    }
                  }
                }

              }
            }
          });
    },
    //关闭IP选择
    closeIP() {
      this.showIP = false
    },
    //获取IP展示信息
    showUrl(item) {
      this.showIP = true
      this.ipObject = item
      this.$nextTick(() => {
        this.urlData = []
        let data = []
        item.url.split(",").forEach(o => {
          let a = {}
          a.url = o
          data.push(a)
        })
        this.ipdata = data
        this.form.url.split(",").forEach(o => {
          if (o != "") {
            let a = {}
            a.url = o
            this.urlData.push(a)
          }
        })
        this.toggleSelection()
      })
    },
    //确认IP信息
    submitIP() {
      this.form.url = ""

      this.multipleSelection.forEach((o, index) => {
        if ((index + 1) == this.multipleSelection.length) {
          this.form.url += o.url
        } else {
          this.form.url += o.url + ","
        }
      })
      this.showIP = false
      let arr = this.ipArray
      if (!this.checkIp()) {

        this.$refs.multipleTable.clearSelection()
        arr.forEach(o => {
          if (this.ipObject.id != o.id) {
            this.$refs.multipleTable.toggleRowSelection(o, true);
          }
        })
      } else {
        this.$refs.multipleTable.toggleRowSelection(this.ipObject, true);

      }
    },
    //检验IP
    checkIp() {
      let a = 0
      let b = this.ipObject.url.split(",")
      b.forEach(o => {
        if (this.form.url.indexOf(o) != -1) {
          a += 1
        }
      })
      if (a == b.length) {
        return true
      } else {
        return false
      }
    },
    //单选
    clickitem(val) {
      this.force_status === val ? this.force_status = '0' : this.force_status = val
    },
    //分页
    curPageChange(e) {
      this.curPage = e;
      this.ipList();
    },
    //校验
    validateCode(rule, value, callback) {
      if (this.radio == "0") {
        return callback(new Error("必须选择一项!"));
      }
      if (this.radio == "1" && this.form.url1 == "") {
        return callback(new Error("自定义IP地址不能为空"));
      }

      var reg1 = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(,(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]))*$/;
      var re1 = new RegExp(reg1);
      var ip1 = this.form.url1;
      if (!re1.test(ip1) && ip1 != "" && ip1 != undefined) {
        return callback(new Error("请填写有效的IP地址或者多个IP逗号未隔开"));
      }
      if (this.checkRepeat(this.form.url1.split(","))) {
        return callback(new Error("IP不能有重复值"));
      }
      return callback();
    },
    //配置地址检验
    validateUrl(rule, value, callback) {

      if (value == "" || value == undefined) {
        return callback(new Error("配置地址不能为空"));
      }
      return callback();
    },
    //校验
    validateCode1(rule, value, callback) {
      if (this.radio == "0") {
        return callback(new Error("必须选择一项!"));
      }
      if (this.radio == "2" && this.form.url.length == 0) {
        return callback(new Error("至少选择一项内容"));
      }
      if (this.radio == "2") {
        if (this.checkRepeat(this.form.url.split(","))) {
          return callback(new Error("IP不能有重复值"));
        }
      }

      var reg1 = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(,(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]))*$/;
      var re1 = new RegExp(reg1);
      var ip1 = this.form.url;
      if (!re1.test(ip1) && ip1 != "" && ip1 != undefined) {
        return callback(new Error("请填写有效的IP地址或者多个IP逗号未隔开"));
      }
      return callback();
    },
    //检测是否有重复
    checkRepeat(ary) {
      for (var i = 0; i < ary.length - 1; i++) {
        if (ary[i] == ary[i + 1]) {
          return true
        } else {
          return false
        }
      }
    },
    //ip信息
    ipList() {
      this.$yqLoading.show();
      let path = "/insight/ipManage/page";
      let params = {
        page_no: this.curPage,
        page_size: this.pageSize,
        url: this.form.url
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
     * 关闭弹出框
     * */
    chosePop() {
      this.showPop = false;
      this.$emit("closeIssue");
    },
    /**
     * 确定按钮
     */
    submit() {
      this.$refs.issueForm.validate((valid) => {
        if (valid) {
          this.$yqLoading.show();
          let path = "";
          let message = "下发完成";
          let param = null
          path = "/insight/configureSend/clientAddFileByCustom";
          let ips = ""
          if (this.radio == '1') {
            ips = this.form.url1.split(",");
          } else {
            ips = this.form.url.split(",");
          }
          param = {
            id: this.id,
            ips: JSON.stringify(ips),
            path: this.form.path,
            statue: this.force_status
          }
          this.$api.getServerAction(path, param).then((res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              this.$message.success(message);
              this.$emit("up", 3)
              this.$emit("listPage")
            } else {
              this.$message.error(res.info);
            }
          });
        } else {
          return false;
        }
      });
    },
    //上一步
    up() {
      this.$emit("up", 1)
    },
  }
};
</script>

<style lang="scss" scoped>
.text-cell {
  width: calc(100% / 4);
}

.selection-cell {
  width: 25px;
}

.self-table-w {
  height: 600px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
