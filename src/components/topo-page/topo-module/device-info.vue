<template>
  <div class="topo-seat-property">
    <div style="padding: 0 16px">
      <div class="bar-back-nav">
        <div>设备信息</div>
        <div class="back-left" @click="backClick">
          <icon :name="'back'" :size="'24'" :color="'#E4E4E4'"></icon>
        </div>
      </div>
      <div v-if="topoType == 'inside'">
        <div class="topo-seat-input">
          <div class="input-label">名称</div>
          <tis-input
            placeholder="请输入设备名称"
            v-model.trim="device_name"
            @change="deviceInfoChange($event, 'name')"
          >
          </tis-input>
        </div>
        <div class="topo-seat-input">
          <div class="input-label">IP</div>
          <tis-input
            placeholder="请输入设备ip"
            v-model.trim="device_ip"
            @change="deviceInfoChange($event, 'ip')"
          >
          </tis-input>
        </div>
      </div>
      <div v-if="topoType == 'between'">
       <!-- <div class="topo-seat-input">
          <div style="width: 120px">车辆信息：</div>
          <tis-select
            v-model="carId"
            placeholder="请选择车辆信息"
            style="width: 100%"
            clearable
            @change="carChange"
          >
            <tis-option
              v-for="item in carList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.ip
              }}</span>
            </tis-option>
          </tis-select>
        </div> -->

		<div class="topo-seat-input">
          <div class="input-label">名称</div>
          <tis-input
			disabled
            placeholder="请输入车辆显示名称"
            v-model.trim="device_name"
            @change="deviceInfoChange($event, 'name')"
          >
          </tis-input>
        </div>
		<div class="topo-seat-input">
          <div class="input-label">IP</div>
          <tis-input
			disabled
            placeholder=""
            v-model.trim="device_ip"
            @change="deviceInfoChange($event, 'name')"
          >
          </tis-input>
        </div>
      </div>
      <div class="topo-seat-input" >
        <tis-button type="danger" style="width: 100%" @click="delDevice"
          >删除设备</tis-button
        >
      </div>
      <div class="topo-seat-input">
        <tis-button type="primary" style="width: 100%" @click="backClick"
          >返回设备列表</tis-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["infoObj", "topoType"],
  data() {
    return {
      device_name: "",
      device_ip: "",
      device_topo: "",
      carId: "",
      carList: [],
      deviceInfo: null,
      hasname:false,
    };
  },
  created() {
    this.deviceInfo = this.infoObj;
    this.getCarList();
    this.init();
  },
  methods: {
    init() {
      this.device_name = this.deviceInfo.getAttrs().text.text;
      if(this.device_name){
          this.hasname = true;
      }
      this.device_ip = this.deviceInfo.data.device_ip;
      this.device_topo = this.deviceInfo.data.device_topo;
      if (this.topoType === "between") {
        if (this.deviceInfo.data.car_info) {
          this.carId = this.deviceInfo.data.car_info.id;
        } else {
          this.carId = "";
        }
      }
    },
    delDevice() {
      this.$emit("delDevice");
    },
    backClick() {
      this.$emit("deviceInfoBack");
    },
    deviceInfoChange(e, type) {
      if (type === "name") {
           let namestr =e
          if(e){
              this.hasname = true;
          }
          else {
              if(this.deviceInfo.data.car_info)
              namestr = this.deviceInfo.data.car_info.name ;
              this.hasname = false;
          }

        this.deviceInfo.setAttrs({ text: { text: namestr } });
        this.deviceInfo.setData({ device_name: namestr });
      }
      if (type === "ip") {
        this.deviceInfo.setData({ device_ip: e });
      }
    },
    carChange(e) {
      let info = this.carList.find((el) => {
        return el.id === e;
      });
      if (!info) {
        info = "";
      }
      console.log("车辆信息变了", e, this.carId, info);
      this.deviceInfo.setData({ car_info: info });
      if (!this.hasname && info) {
          this.device_name = info.name
        this.deviceInfo.setAttrs({ text: { text: info.name } });
        this.deviceInfo.setData({ device_name: info.name });
      }
    },
    getCarList() {
      this.$yqLoading.show();
      this.$api.getServerAction("/insight/connectionNode/list").then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          this.carList = res.data;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.topo-seat-input {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
</style>
