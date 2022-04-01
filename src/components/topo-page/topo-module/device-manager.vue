<template>
  <div>
    <div>
      <div class="flex" style="margin-bottom: 16px">
        <tis-button type="danger" @click="showAddForm" round>
          添加设备分类
        </tis-button>
      </div>
      <div class="topo-seat-box device-scroll-box">
        <div class="device-collapse">
          <div
            class="device-collapse-item"
            v-for="(t, k) in deviceTypes"
            :key="k"
            @click="collapseClick(k)"
          >
            <div class="device-collapse-item-title flex-between">
              <div class="right">{{ t.name }}</div>
              <div class="left flex">
                <tis-button type="text" @click.stop="delDeviceType(t)">
                  <i class="el-icon-delete el-icon-left"></i>
                  删除设备类型
                </tis-button>
                <tis-button type="text" @click.stop="editDeviceType(t)">
                  <i class="el-icon-edit el-icon-left"></i>
                  编辑
                </tis-button>
                <tis-button type="text" @click.stop="upLoadDeviceImgFunc(t)">
                  <i class="el-icon-upload el-icon-left"></i>
                  添加设备图片
                </tis-button>

                <span style="margin-left: 16px">
                  <i class="el-icon-arrow-down" v-if="activeName == k"></i>
                  <i class="el-icon-arrow-right" v-else></i>
                </span>
              </div>
            </div>
            <div class="device-collapse-item-body" v-if="activeName == k">
              <div
                class="topo-seat-item topo-seat-icon"
                v-for="(img, idx) in t.status_list"
                :key="idx"
              >
                <div>
                  <div style="margin-right: 16px">
                    <img
                      style="max-height: 40px"
                      :src="$store.state.yqInfo.serverIp + img.img_path"
                      alt=""
                    />
                    <span style="margin-left: 16px" v-if="img.status == '0'">
                      正常
                    </span>
                    <span
                      style="margin-left: 16px"
                      v-else-if="img.status == '10'"
                    >
                      一般告警
                    </span>
                    <span
                      style="margin-left: 16px"
                      v-else-if="img.status == '20'"
                    >
                      严重告警
                    </span>
                    <span style="margin-left: 16px" v-else> 离线 </span>
                  </div>
                </div>
                <div class="seat-icon-del">
                  <tis-button @click.stop="editDeviceImg(t, img)" type="text"
                    ><i class="el-icon-edit"></i>编辑</tis-button
                  >
                  <tis-button @click.stop="delDeviceImg(img)" type="text"
                    ><i class="el-icon-delete"></i>删除</tis-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <add-device-type ref="addDeviceForm"></add-device-type>
    <upload-device-img
      ref="uploadImgForm"
      :formTitle="upLoadImgTitle"
    ></upload-device-img>
  </div>
</template>
<script>
import addDeviceType from "./add-device-type.vue";
import UploadDeviceImg from "./upload-device-img.vue";
import bus from "@/utils/bus";
export default {
  components: {
    addDeviceType,
    UploadDeviceImg,
  },
  props: ["topoType"],
  data() {
    return {
      upLoadImgTitle: "",
      seatImgList: [],
      deviceTypes: [],
      activeName: -1,
      editType: "draw",
      carData: [],
      carDevice: null,
    };
  },
  created() {
    this.getDeviceType();
    this.getCarInfoList();
  },
  methods: {
    getCarInfoList() {
      this.$yqLoading.show();
      this.$api.getServerAction("/insight/connectionNode/list").then((res) => {
        this.$yqLoading.hide();
        this.carData = res.data;
      });
    },
    deviceOK() {
      this.$emit("deviceOK");
    },
    editDevice() {
      this.editType = "upload";
    },

    drawDevice(e, device) {
      let that = this;
      bus.$emit("topo-handle", {
        name: "addDevice",
        topoType: that.topoType,
        carDevice: that.carDevice,
        device: device,
        event: e,
      });
      // this.$parent.$parent.$parent.$parent.drawSeat(de);
    },
    //添加设备状态图片
    upLoadDeviceImgFunc(item) {
      this.upLoadImgTitle = item.name + "图片";
      this.$refs.uploadImgForm.imgForm.device_Id = item.ID;
      this.$refs.uploadImgForm.imgForm.status = "";
      this.$refs.uploadImgForm.upLoadData.subjectStatus = "";
      this.$refs.uploadImgForm.upLoadData.subjectType = item.code;
      this.$refs.uploadImgForm.isEdit = false;
      this.$refs.uploadImgForm.img_path = "";
      this.$refs.uploadImgForm.switchAddBtn("");
      this.$refs.uploadImgForm.imgId = "";
      this.$refs.uploadImgForm.imgFiles = [];
      this.$refs.uploadImgForm.visibleShow = true;
    },
    //修改设备状态图片
    editDeviceImg(item, img) {
      this.upLoadImgTitle = "编辑 " + item.name + " 图片";
      this.$refs.uploadImgForm.imgForm=img
      this.$refs.uploadImgForm.imgForm.device_Id = item.ID;
      this.$refs.uploadImgForm.imgForm.name = img.name;
      this.$refs.uploadImgForm.isEdit = true;
      this.$refs.uploadImgForm.imgId = img.id;
      this.$refs.uploadImgForm.imgForm.status = img.status;
      this.$refs.uploadImgForm.imgForm.img_path = img.img_path;
      this.$refs.uploadImgForm.upLoadData.subjectType = item.code;
      this.$refs.uploadImgForm.upLoadData.subjectStatus = img.status;
      this.$refs.uploadImgForm.imgFiles = [
        {
          url: this.$store.state.yqInfo.serverIp + img.img_path,
        },
      ];
      this.$refs.uploadImgForm.visibleShow = true;
      setTimeout(() => {
        this.$refs.uploadImgForm.switchAddBtn("none");
      }, 10);
    },
    //删除设备状态图片
    delDeviceImg(img) {
      this.$confirm("确定要删除删除这个设备图片吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$yqLoading.show();
        const formData = new FormData();
        let params = {
          id: img.id,
        };
        Object.keys(params).forEach((key) => {
          formData.append(key, params[key]);
        });
        this.$api
          .postServerAction("/insight/deviceStatus/delete", formData)
          .then((res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              this.$message.success("删除成功！");
              this.getDeviceType();
            } else {
              this.$message.warning("删除失败！");
            }
          });
      });
    },
    //添加设备分类
    showAddForm() {
      this.$refs.addDeviceForm.initForm();
      this.$refs.addDeviceForm.visibleShow = true;
    },
    //编辑设备分类
    editDeviceType(item) {
      this.$refs.addDeviceForm.deviceForm = Object.assign({}, item);
      this.$refs.addDeviceForm.visibleShow = true;
    },
    //删除设备分类
    delDeviceType(item) {
      this.$confirm("确定要删除这种设备分类吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const formData = new FormData();
        let params = {
          id: item.ID,
        };
        Object.keys(params).forEach((key) => {
          formData.append(key, params[key]);
        });
        this.$api
          .postServerAction("/insight/topoDevice/delete", formData)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success("删除成功！");
              this.getDeviceType();
            } else {
              this.$message.warning("删除失败！");
            }
          });
      });
    },
    collapseClick(k, s) {
      if (this.activeName == k && !s) {
        this.activeName = -1;
      } else {
        this.activeName = k;
        this.getDeviceType();
      }
    },
    getDeviceType() {
      this.$yqLoading.show();
      this.deviceTypes = [];
      this.$api
        .getServerAction("/insight/topoDevice/getTopologyElementList")
        .then((res) => {
          this.$yqLoading.hide();
          if (res.code == 200) {
            this.deviceTypes = res.data;
            this.carDevice = this.deviceTypes.find((el) => {
              return el.code === "car";
            });
          }
        });
    },
    barBack() {
      if (this.editType === "upload") {
        this.editType = "draw";
        //退出设备类型状态图片编辑页面，标记拓扑图图片变化，监听实现刷新拓扑图元素的展示图片
        this.$store.commit(
          "yqInfo/TOPO_IMAGE_HAS_CHANGE",
          !this.$store.state.yqInfo.topoStatusImageChange
        );
      } else {
        this.$parent.tbName = "bar";
      }
    },
    getDeviceImgs(id) {
      this.$api
        .getServerAction("/insight/deviceStatus/getDeviceStatusByDeviceId", {
          device_id: id,
        })
        .then((res) => {
          if (res.code == 200) {
            console.log("获取的设备图片", res);
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.device-scroll-box {
  overflow-y: scroll;
  height: 60vh;
}

.device-collapse {
  border-top: var(--status-bar-tools-border);
}

.device-collapse-item {
  padding: 16px 0;
  border-bottom: var(--status-bar-tools-border);
}

/* .device-collapse-item-title .left{

} */
.device-collapse-item-body {
  padding: 16px;
}

.topo-seat-item {
  display: flex;
  align-items: center;
  margin-top: 16px;
}

.topo-seat-icon {
  justify-content: space-between;
}

.seat-icon-del ::v-deep .el-button {
  color: var(--text-color);
}

.topo-seat-icon .seat-icon-del:hover {
  color: var(--hover-color);
}

.device-item {
  width: 80%;
  height: 64px;
  padding: 0 16px;
  border: var(--status-bar-tools-border);
  margin-bottom: 16px;
  border-radius: 5px;
}

.device-item:hover {
  background-color: var(--layout-bg-3);
}
</style>
