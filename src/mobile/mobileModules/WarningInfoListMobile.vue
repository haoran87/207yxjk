<template>
  <page-mobile>
    <template slot-scope="{ boxHeight }">
      <search-top-mobile
        :placeholder="'请输入插件名称'"
        @search="searchKey"
        @clear="searchKey"
        @input="inputFunc"
      >
        <template v-slot:left>
          <div class="flex">
            <drop-down-mobile
              :option="option1"
              @change="dropdownChange"
            ></drop-down-mobile>
            <drop-down-mobile
              style="margin-left: 8px"
              :option="option2"
              @change="statuChange"
            ></drop-down-mobile>
            <date-picker-mobile
              style="margin-left: 8px"
              :dateStr="startDate"
              :placeHolder="'开始日期'"
              @confirm="onConfirm($event, 'start')"
            ></date-picker-mobile>
            <date-picker-mobile
              style="margin-left: 2px"
              :dateStr="endDate"
              :placeHolder="'结束日期'"
              @confirm="onConfirm($event, 'end')"
            ></date-picker-mobile>
          </div>
        </template>
      </search-top-mobile>
      <div style="margin: 0px 8px">
        <list-mobile
          ref="selfTable"
          checkable="true"
          :tableObj="listObj"
          :tableData="tableData"
          :tableHeight="boxHeight - 54 - 56"
        >
          <template v-slot:device="props">
            <span> {{ props.cellData.plugin_name || props.cellData.ip }}</span>
          </template>
          <template v-slot:level="props">
            <span class="warning-color" v-if="props.cellValue == 10"
              >一般告警</span
            >
            <span class="danger-color" v-else-if="props.cellValue == 20"
              >严重告警</span
            >
            <span v-else>正常</span>
          </template>
          <template v-slot:alarm_status="props">
            <span v-if="props.cellValue == '0'">正在告警</span>
            <span v-else>历史告警</span>
          </template>
          <template v-slot:confirm_status="props">
            <span v-if="props.cellValue == '1'">已读</span>
            <span class="warning-color" v-else>未读</span>
          </template>
          <template v-slot:start_time="props">
            <div slot="reference">
              <span> {{ props.cellValue | fd }}</span>
            </div>
          </template>
          <template v-slot:handle="props">
            <m-popover
              v-model="props.cellData.showPopover"
              trigger="click"
              theme="dark"
              placement="left-end"
              overlay
              :actions="actions"
              @select="onSelect($event, props)"
            >
              <template #reference>
                <span class="selected-color">操 作</span>
              </template>
            </m-popover>
          </template>
        </list-mobile>
      </div>
      <div class="flex flex-between" style="margin: 0 8px">
        <div>
          <m-button @click="delAll('1')">批量删除</m-button>
          <m-button @click="delAll('0')" style="margin-left: 12px"
            >清空</m-button
          >
        </div>
        <pagination-mobile
          :pageInfo="pageInfo"
          :curPage="curPage"
          @pageChange="curPageChange"
        ></pagination-mobile>
      </div>
    </template>
  </page-mobile>
</template>

<script>
import { warningInfoMixin } from "@/utils/mobileMixins/warningInfoMixin";
import PaginationMobile from "./PaginationMobile.vue";
import DropDownMobile from "./DropDownMobile.vue";
import DatePickerMobile from "./DatePickerMobile.vue";
export default {
  components: { PaginationMobile, DropDownMobile, DatePickerMobile },
  mixins: [warningInfoMixin],
  data() {
    return {
      listObj: {
        alarm_name: {
          slot: false,
          lable: "告警名称",
          class: "",
          sortable: false,
          showPop: false,
          width: "28%",
        },
        plugin_name: {
          slot: false,
          lable: "插件",
          class: "",
          sortable: false,
          showPop: false,
          width: "20%",
        },
        level: {
          slot: true,
          lable: "类型",
          class: "",
          sortable: false,
          width: "10%",
        },
        alarm_status: {
          slot: true,
          lable: "告警状态",
          class: "",
          sortable: false,
          width: "10%",
        },
        confirm_status: {
          slot: true,
          lable: "查看状态",
          class: "",
          sortable: false,
          width: "10%",
        },
        start_time: {
          slot: true,
          lable: "开始告警时间",
          class: "",
          sortable: false,
          width: "22%",
        },
        handle: {
          slot: true,
          lable: "操作",
          class: "handle-cell",
          sortable: false,
          width: "10%",
        },
      },
      actions: [{ text: "查看" }, { text: "删除" }],
      option1: [
        { text: "告警类型", value: "" },
        { text: "一般警告", value: 10 },
        { text: "严重警告", value: 20 },
      ],
      option2: [
        { text: "告警状态", value: "" },
        { text: "正在警告", value: 0 },
        { text: "历史警告", value: 1 },
      ],
      startDate: "",
      endDate: "",
    };
  },
  created() {},
  mounted() {},

  methods: {
    onConfirm(e, type) {
      if (type === "start") {
        this.startDate = e;
      } else if (type === "end") {
        this.endDate = e;
      }
      let bool = true;
      if (this.startDate && this.endDate) {
        bool = this.checkStartEnd(this.startDate, this.endDate);
      }
      if (!bool) {
        if (type === "start") {
          this.startDate = "";
        } else if (type === "end") {
          this.endDate = "";
        }
        this.$message.warning("开始时间不能大于结束时间");
        return;
      }
      this.searchKey();
    },
    checkStartEnd(s, e) {
      let sArr = s.split("-");
      let eArr = e.split("-");
      // console.log(" === ",sArr,eArr)
      for (let i = 0; i < sArr.length; i++) {
        if (sArr[i] > eArr[i]) {
          // console.log(" === ",sArr[i],eArr[i])
          return false;
        } else if (sArr[i] < eArr[i]) {
          return true;
        }
      }
      return true;
      // if (sArr[0] > eArr[0]) {
      //   return false;
      // } else if (sArr[1] > eArr[1]) {
      //   return false;
      // }
      // else if (sArr[2] > eArr[2]) {
      //   return false;
      // }
    },
    dropdownChange(e) {
      this.level = e;
      this.searchKey();
    },
    statuChange(e) {
      this.alarm_status = e;
      this.searchKey();
    },
    onSelect(act, item) {
      if (act.text === "查看") {
        this.showDetail(item.cellData);
      } else if (act.text === "删除") {
        this.deleteInfo(item.cellData);
      }
    },
    inputFunc(e) {
      this.plugin_code = e;
    },
  },
};
</script>

<style lang='scss' scoped>
</style>