<template>
  <transition name="fade" mode="out-in">
    <div>
      <div class="bottom-bar bottom-bg" ref="bottombar">
        <!-- <div class="bottom-logo" @click="goIndex">
					<div class="bottom-logo-dot">
						<i class="el-icon-more"></i>
					</div>
				</div> -->
        <div class="yq-bottom-content" style="margin-left: 16px">
          <div class="bottom-right">
            <div v-for="(navItem, idx) in navList" :key="idx">
              <div
                class="nav-item"
                :class="{
                  'nav-item-selected':
                    navItem.id === $store.state.yqInfo.parentNavId ||
                    navItem.id === $store.state.yqInfo.navId,
                }"
                @mouseenter="navHover(navItem)"
                @mouseleave="navleave"
                v-if="navItem.menu_type == '0'"
                @click.stop="navClick(navItem)"
              >
                <div style="width: 100%; text-align: center; postion: relative">
                  {{ navItem.menu_name }}
                  <nav-pop
                    v-if="navItem.children && navItem.children.length > 0"
                    :chooseNav="chooseNav"
                    :nav="navItem"
                    @hidePop="navOut"
                  ></nav-pop>
                </div>
              </div>
            </div>
          </div>
          <div class="bottom-left">
            <div
              class="ip-label"
              style="position: relative"
              @mouseenter="ipHover"
              @mouseleave="ipleave"
            >
              <span v-if="$store.state.yqInfo.chooseIP == '0'">
                无在线的设备
              </span>
              <span v-else>
                {{ $store.state.yqInfo.chooseIP }}
              </span>

              <up-pop :showPop="ipStu">
                <div class="ip-box">
                  <div
                    v-for="(ipItem, idx) in ipList"
                    :key="idx"
                    @click="changeIP(ipItem)"
                  >
                    <div
                      v-if="
                        ipItem.ip !== $store.state.yqInfo.chooseIP &&
                        ipItem.status != -1
                      "
                      class="nav-pop-item"
                    >
                      {{ ipItem.ip }}
                    </div>
                    <div
                      v-else-if="ipItem.ip !== $store.state.yqInfo.chooseIP"
                      class="nav-pop-item-notclick"
                    >
                      <!-- <i class="el-icon-circle-close"></i> -->
                      {{ ipItem.ip }}
                    </div>
                  </div>
                </div>
              </up-pop>
            </div>
            <!-- <div class="arrow-icon" @click="hideNav">
              <i class="el-icon-arrow-down"></i>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import NavPop from "./nav-pop.vue";
import UpPop from "../page/up-pop.vue";
import { ToNavPath } from "@/utils/util";
import bus from "@/utils/bus";

export default {
  components: {
    NavPop,
    UpPop,
  },
  data() {
    return {
      showPop: false,
      navList: [],
      chooseNav: null,
      maxLen: 0,
      ipStu: false,
      ipList: [],
      localDeviceInfo: null, //本地设备信息
    };
  },
  created() {
    bus.$off("change-menu");
    bus.$on("change-menu", () => {
      this.getMenu();
    });
    this.getLocalIP();
    this.getMaxLen();
  },
  mounted() {},
  destroyed() {},
  methods: {
    getMenu() {
      let that = this;
      this.$api
        .getServerAction("/insight/rolePermission/getMenuListByRunRole")
        .then((res) => {
          if (res.code === 200) {
            that.navList = [];
            this.$nextTick(() => {
              that.navList = res.data;
            });
          }
        });
    },
    goIndex() {
      this.$navigateTo(1);
    },
    //获取本地设备ip及其他信息
    getLocalIP() {
      let that = this;
      this.$api
        .getServerAction("/insight/statusInfo/getLocalDeviceIPInfo")
        .then((res) => {
          if (res.code === 200) {
            if (res.success) {
              that.localDeviceInfo = res.data;
              //将本地设备信息保存到 VUEX
              this.$store.commit(
                "yqInfo/SET_LOCAL_DEVICE_INFO",
                that.localDeviceInfo
              );
              console.log("本地设备信息", res.data);
              //获取菜单权限
              this.getMenu();
              //获取IP列表
              this.getIPList();
            } else {
              this.$message.error(
                "获取本地设备IP及状态信息失败，请重启本地服务！"
              );
            }
          } else {
            this.$message.error(
              "获取本地设备IP及状态信息失败，请检查本地服务是否正常运行！"
            );
          }
        })
        .catch((error) => {
          console.log("获取本地设备IP及状态信息失败", error);
          this.$message.error(
            "获取本地设备IP及状态信息失败，请检查本地服务是否正常运行！"
          );
        });
    },
    getIPList() {
      let that = this;
      this.$api
        .getServerAction("/insight/statusInfo/getAllDeviceIPList")
        .then((res) => {
          if (res.code === 200) {
            that.ipList = res.data;
            console.log("获取的ip列表", res.data);
            // this.$store.commit("yqInfo/SET_IPDATA", this.ipList);
            if (that.$store.state.yqInfo.chooseIP) {
              that.initIP(that.$store.state.yqInfo.chooseIP);
            } else {
              //默认选择本地展示
              that.initIP(that.localDeviceInfo);
              if (that.ipList.length == 0) {
                this.$message.warning(
                  "未获取到接入主服务器的设备信息，自动启用单机模式！"
                );
              }
            }
          }
        });
    },
    //初始化默认选择的设备ip，默认选择server类型的设备，如果没有，默认选择设备列表的第一个
    initIP(item) {
      let ip = item.ip || this.$store.state.yqInfo.chooseIP;
      let cip = ip;
      this.ipStu = false;

      let ds = false; //选中的采集客户端是否在线
      ds = item.status != -1;
      let chooseIpObj = {
        ip: cip,
        connectedStu: ds,
      };
      this.$store.commit("yqInfo/CHANGE_IP", chooseIpObj);
    },
    //切换右下角ip
    changeIP(item) {
      let ip = item.ip || this.$store.state.yqInfo.chooseIP;
      if (item.status == -1) {
        this.$message.warning("设备处于离线状态！");
      } else {
        let cip = ip;
        this.ipStu = false;
        let ds = false; //选中的采集客户端是否在线
        ds = item.status != -1;
        let chooseIpObj = {
          ip: cip,
          connectedStu: ds,
        };
        this.$store.commit("yqInfo/CHANGE_IP", chooseIpObj);
      }
    },
    getMaxLen() {
      this.maxLen = 4;
      this.navList.forEach((element) => {
        element.children.forEach((cel) => {
          if (cel.menu_name.length > this.maxLen) {
            this.maxLen = cel.menu_name.length;
          }
        });
      });
    },
    navClick(item) {
      if (item.id == this.$store.state.yqInfo.navId) return;
      if (item.url) {
        ToNavPath(item);
        this.$emit("hideNav");
      }
    },
    navleave() {
      this.chooseNav = null;
    },
    navOut() {
      this.chooseNav = null;
      this.$emit("hideNav");
    },
    navHover(item) {
      // console.log("hover里得到了大量的", item);
      this.chooseNav = item;
    },
    hideNav() {
      this.$emit("hideNav");
    },
    ipHover() {
      let localDevice = this.$store.state.yqInfo.localDeviceInfo;
      if (localDevice) {
        console.log("本地设备信息", localDevice);
      }

      // let temobj = {
      //   code: "test212",
      //   create_time: "2022-02-14T09:36:47.931059+08:00",
      //   description: "测试设备212自动注册",
      //   id: "20220214093647931490703602220599",
      //   ip: "192.168.16.212",
      //   name: "测试设备212",
      //   port: "8082",
      //   status: 0,
      //   type: "client",
      //   update_time: "2022-02-14T09:36:47.93106+08:00",
      // };
      // if(this.ipList.length < 2){
      //    this.ipList.push(temobj);
      // }

      // this.ipStu = true;
      this.$api
        .getServerAction("/insight/statusInfo/getAllDeviceIPList")
        .then((res) => {
          if (res.code === 200) {
            this.ipList = res.data;
            this.ipStu = true;
          }
        });
    },
    ipleave() {
      this.ipStu = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import url("../../assets/css/bottom.scss");

.bottom-right {
  width: 70%;
  display: flex;
}

.nav-item {
  margin-right: 24px;  
  position: relative;
  /* width: calc(1.25vw * 5); */
}
.yqxxkjPad{
  .nav-item{
     margin-right: 8px;  
  }
}

.nav-item-selected {
  color: var(--hover-color);
}
</style>
