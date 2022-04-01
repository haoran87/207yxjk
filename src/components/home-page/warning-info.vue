<template>
  <div>
    <sub-title
      :titleMsg="titleMsg"
      :eNum="1"
      :moduleKey="moduleKey"
      @changeModule="changeModule"
    ></sub-title>
    <div
      class="flex-column-center"
      v-if="$store.state.yqInfo.connectedStu"
      :style="{ height: ch, width: chartWidth }"
      ref="scrollTarget"
    >
      <div class="scroll-title" ref="scrollTitle">
        <div class="s-name">告警名称</div>
        <div class="s-time">告警时间</div>
        <div class="s-remark">告警描述</div>
        <div class="s-status">告警状态</div>
      </div>
      <div id="scroll-box" :style="{ height: scrollHeight }">
        <div
          v-if="items.length > 0"
          id="con1"
          ref="con1"
          :class="{ anim: animate == true }"
          @mouseenter="clearTimer"
          @mouseleave="initTimer"
        >
          <div
            v-for="(item, idx) in items"
            :key="idx"
            class="scroll-item"
            :class="{ 'scroll-item-other': item.bgshow }"
            @click="infoClick(item)"
          >
            <div class="s-name">{{ item.alarm_name }}</div>
            <div class="s-time">{{ item.create_time | infoTime }}</div>
            <div class="s-remark">{{ item.description }}</div>
            <div class="s-status warning-color" v-if="item.level == 10">
              一般警告
            </div>
            <div class="s-status danger-color" v-else-if="item.level == 20">
              严重警告
            </div>
            <div class="s-status" v-else>正常</div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex-column-center"
      :style="{ height: ch, width: chartWidth }"
    >
      <weijietong></weijietong>
    </div>
  </div>
</template>
<script>
import { homePageMixins } from "@/utils/home-module";
import { formatHourDate } from "@/utils/util";
export default {
  mixins: [homePageMixins],
  components: {
    weijietong: () => import("@/components/home-page/weijietong.vue"),
  },
  data() {
    return {
      titleMsg: "实时告警信息",
      animate: false,
      wfTimer: null,
      items: [],
      tempArr: [],
      scrollHeight: "160px",
      scrollLen: 5,
      itemHeight:32,
    };
  },
  created() {
    this.getSh();
  },
  mounted() {
    let rect = this.$refs.scrollTitle.getBoundingClientRect()
    this.itemHeight = rect.height;
    console.log("单行参数 === ",rect,this.itemHeight)
    this.getWarningInfo();
  },
  watch: {
    ch() {
      // console.log("告警监听到ch", this.chartHeight, this.ch);
      if (this.chartHeight !== "0px") {
        this.getSh();
      }
    },
  },
  destroyed() {
    this.clearTimer();
  },
  filters: {
    infoTime(h) {
      return formatHourDate(h);
    },
  },
  methods: {
    infoClick(info) {
      this.$navigateTo(301, info);
    },
    getSh() {
      if (this.$refs.scrollTarget) {
        if (this.$refs.scrollTarget.offsetHeight) {
          this.scrollLen = Math.floor(
            (this.$refs.scrollTarget.offsetHeight - this.itemHeight - 4) / this.itemHeight
          );
          if (this.scrollLen > 0) {
            this.scrollHeight = this.scrollLen * this.itemHeight + "px";
            this.addInfo();
          }
        }
        // setTimeout(() => {
        //     console.log(
        //   "1000hou获取滚动的目标啊",
        //   this.$refs.scrollTarget.offsetHeight
        // );
        // }, 1000);
        // console.log(
        //   "获取滚动的目标啊",
        //   this.$refs.scrollTarget.offsetHeight,
        //   this.scrollLen
        // );
      }
      //  let sh =  parseFloat(this.chartHeight) - 38 - 32
    },
    getWarningInfo() {
      this.items = [];
      this.clearTimer();
      this.$api
        .getServerAction("/insight/alarmInfo/getInfoLimitList",{ip:this.$store.state.yqInfo.chooseIP})
        .then((res) => {
          if (res.code == 200) {
            // console.log("获取的告警信息",res.data,res.data.length)
            this.tempArr = res.data;
            this.addInfo();
            this.initTimer();
          }
        });
    },
    addInfo() {
      if (this.items.length < this.scrollLen && this.tempArr.length > 0) {
        let lastBgshow =
          this.items.length > 0
            ? this.items[this.items.length - 1].bgshow
            : false;
        this.tempArr[0].bgshow = !lastBgshow;
        this.items.push(this.tempArr[0]);
        this.tempArr.shift();
        this.addInfo();
      } else if (this.tempArr.length > 0) {
        // console.log(this.items, "获取的数组单元");
        let lastBgshow =
          this.items.length > 0
            ? this.items[this.items.length - 1].bgshow
            : false;
        this.tempArr[0].bgshow = !lastBgshow;
        this.items.push(this.tempArr[0]);
        this.tempArr.shift();
        if (this.tempArr.length == 0) {
          this.$api
            .getServerAction("/insight/alarmInfo/getInfoLimitList",{ip:this.$store.state.yqInfo.chooseIP})
            .then((res) => {
              if (res.code == 200) {
                this.tempArr = res.data;
              }
            });
        }
      }
    },
    scroll() {
      if (this.items.length <= this.scrollLen) return;
      let con1 = this.$refs.con1;
      if (con1) {
        con1.style.marginTop = -this.itemHeight+"px";
        this.animate = !this.animate;
        var that = this;
        setTimeout(function () {
          if (that.items.length > this.scrollLen) {
            that.addInfo();
            that.items.shift();
          } else {
            that.items.push(that.items[0]);
            that.items.shift();
          }
          con1.style.marginTop = "0px";
          that.animate = !that.animate;
        }, 500);
      }
    },
    clearTimer() {
      clearInterval(this.wfTimer);
      this.wfTimer = null;
    },
    initTimer() {
      if (this.items.length <= this.scrollLen) return;
      this.wfTimer = setInterval(this.scroll, 1000);
    },
  },
};
</script>
<style lang="scss" scoped>
.scroll-title {
  width: calc(100% - 0px);
  background-color: var(--layout-bg-3);
  display: flex;
  justify-content: space-between;
  line-height: 2vw;
  color: var(--text-color-weak);
  font-size: var(--text-size-small);
}
#scroll-box {
  width: 100%;
  line-height: 2vw;
  overflow: hidden;
  font-size: var(--text-size-small);
  /* padding:0 16px; */
  /* border: 1px solid black; */
  transition: all 0.5s;
}
.scroll-item {
  display: flex;
  justify-content: space-between;
  padding: 0 0px;
  border-bottom: var(--status-bar-tools-border);
  height: 2vw;
}
.anim {
  transition: all 0.5s;
}
.s-time {
  width: 25%;
  text-align: center;
  overflow: hidden;

}
.s-remark {
  width: 25%;
  text-align: center;
  overflow: hidden;
}
.s-status {
  width: 25%;
  text-align: center;
  overflow: hidden;
}
.s-name {
  width: 25%;
  text-align: center;
  overflow: hidden;
}
</style>
