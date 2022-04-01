<template>
  <div>
    <box-show style="padding: 0 8px; " :style="{'height':$store.state.yqInfo.MAINHEIGHT+'px'}">
      <div>
        <div class="flex-between">
          <div class="input-box">
            <div class="input-label">名称</div>
            <div class="input-con">
              <tis-input v-model="carName" placeholder="请输入名称"></tis-input>
            </div>
            <tis-button @click="searchDo" type="primary">查询</tis-button>
            <tis-button type="info" @click="resetSearch">重置</tis-button>
            <tis-button type="danger" @click="addCarInfo">添加</tis-button>
          </div>
          <div style="margin-right:16px">
            <span @click="hideDetail">
              <icon :name="'back'" :size="'24'" :color="'#E4E4E4'"></icon>
            </span>
          </div>
        </div>
        <div style="margin: 0px 16px ">
          <self-table :tableData="tableData" :tableObj="tableObj" :tableHeight='$store.state.yqInfo.MAINHEIGHT - 72 -16 '>
            <template v-slot:type="props">
              <span v-if="props.cellValue == 0">上级</span>
              <span v-else-if="props.cellValue == 1">同级</span>
              <span v-else-if="props.cellValue == 2">下级</span>
            </template>
            <template v-slot:handle="props">
              <span class="danger-color" @click="editCar(props.cellData)">
                编辑
              </span>
              <span
                style="margin-left: 16px"
                class="warning-color"
                @click="delCar(props.cellData)"
              >
                删除
              </span>
            </template>
          </self-table>
        </div>
      </div>
    </box-show>
    <tis-dialog :visible.sync="showPop" :modal-append-to-body='false'>
      <div slot="title" class="pop-title">{{ popTitle }}</div>
      <tis-form ref="carForm" :model="form" :rules="rules">
        <tis-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <tis-input   maxlength="50" show-word-limit v-model.trim="form.name" autocomplete="off"></tis-input>
        </tis-form-item>
        <tis-form-item label="IP" :label-width="formLabelWidth" prop="ip" :rules="[{ required: true, validator: validateIp, trigger: 'blur' }]">
          <tis-input maxlength="20" show-word-limit v-model.trim="form.ip" autocomplete="off"></tis-input>
        </tis-form-item>
        <!-- <tis-form-item label="端口" :label-width="formLabelWidth">
          <tis-input v-model="form.port" autocomplete="off"></tis-input>
        </tis-form-item> -->
        <tis-form-item label="类型" :label-width="formLabelWidth" prop="type">
          <tis-select
            v-model="form.type"
            placeholder="请选择类型"
            style="width: 100%"
          >
            <tis-option label="上级" value="0"></tis-option>
            <tis-option label="同级" value="1"></tis-option>
            <tis-option label="下级" value="2"></tis-option>
          </tis-select>
        </tis-form-item>
        <tis-form-item label="描述" :label-width="formLabelWidth">
          <tis-input
            type="textarea"
            maxlength="200"
            show-word-limit
            v-model="form.description"
            autocomplete="off"
          ></tis-input>
        </tis-form-item>
      </tis-form>
      <div slot="footer">
        <tis-button @click="hidePop">取 消</tis-button>
        <tis-button type="primary" @click="confirmSubmit">确 定</tis-button>
      </div>
    </tis-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      carName: "",
      tableData: [],
      showPop: false,
      popTitle: "添加车辆信息",
      formLabelWidth: "80px",
      isLoad: true,
      formData: null,
      pageInfo: null,
      curPage: 1,
      pageSize: 15,
      form: {
        name: "",
        ip: "",
        port: "",
        type: "",
        description: "",
      },
      tableObj: {
        name: {
          slot: false,
          lable: "名称",
          class: "tabel-col-2",
          sortable: false,
        },
        ip: {
          slot: false,
          lable: "IP",
          class: "tabel-col-2",
          sortable: false,
        },
        // port: {
        //   slot: false,
        //   lable: "端口",
        //   class: "tabel-col-1",
        //   sortable: false,
        // },
        type: {
          slot: true,
          lable: "类型",
          class: "tabel-col-2",
          sortable: false,
        },
        description: {
          slot: false,
          lable: "描述",
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
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getCarInfoList();
  },
  mounted() {},
  methods: {
    hideDetail(){
      this.$emit("hideDetail")
    },
    isValidIP(ip) {
      var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      return reg.test(ip);
    },
    validateIp(rule, value, callback){
      if (value == "" || value == undefined) {
        return callback(new Error("请输入IP"));
      }
      if (!this.isValidIP(value)) {
        return callback(new Error("请输入正确的IP地址"));
      }
      return callback();
    },
    hidePop() {
      this.showPop = false;
    },
    editCar(item) {
      if (this.$refs['carForm'] !== undefined) {
        // 清除表单内容和清除表单验证消息
        this.$refs['carForm'].resetFields();
      }
      this.popTitle = "编辑车辆信息";
      this.form = Object.assign({}, item);;
      this.showPop = true;
    },
    delCar(item) {
      this.$confirm("确定要删除这条信息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/connectionNode/deleteNode", {
              id: item.id,
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                  this.getCarInfoList()
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              }else{
                  this.$message.error(res.info)
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    addCarInfo() {
      this.showPop = true;
      if (this.$refs['carForm'] !== undefined) {
        // 清除表单内容和清除表单验证消息
        this.$refs['carForm'].resetFields();
      }
      this.popTitle = "添加车辆信息";
      this.form = {
        name: "",
        ip: "",
        // port: "",
        type: "",
        description: "",
      };
    },
    searchDo() {
      this.getCarInfoList();
    },
    resetSearch() {
      this.carName = "";
      this.getCarInfoList();
    },
    curPageChange(e) {
      this.curPage = e;
      this.getCarInfoList();
    },
    confirmSubmit() {
      this.$refs.carForm.validate((valid) => {
        if (valid) {
          this.$yqLoading.show();
          let path = "/insight/connectionNode/insert";
          if (this.form.id) path = "/insight/connectionNode/update";
          this.$api.postServerAction(path, this.form).then((res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              this.hidePop();
              this.getCarInfoList();
              this.$message.success("提交成功");
            } else {
              this.$message.error(res.info);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      console.log("12233444555666");
    },
    getCarInfoList() {
      this.$yqLoading.show();
      this.$api.getServerAction("/insight/connectionNode/list").then((res) => {
        this.$yqLoading.hide();
        if (this.carName) {
          this.tableData = res.data.filter((el) => {
            return el.name.includes(this.carName);
          });
        } else {
          this.tableData = res.data;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.input-box {
  display: flex;
  padding: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.input-label {
  margin-right: 16px;
}
.input-con {
  margin-right: 32px;
}
.footer-page-info {
  margin: 16px;
}
.pop-title {
  text-align: left;
  font-size: var(--pop-title-size);
}
</style>
