<template>
  <page-mobile ref="pageBox">
    <template slot-scope="{ boxHeight }">
      <search-top-mobile
        :placeholder="'请输入服务名称'"
        @search="searchKey"
        @clear="searchKey"
        @input="inputFunc"
      >
        <template v-slot:right>
          <div class="flex" style="margin-left: 12px">
            <m-tag style="margin-right: 8px" type="primary">
              总数：{{ totalSum }}</m-tag
            >
            <m-tag style="margin-right: 8px" type="success">
              正常：{{ successSum }}</m-tag
            >
            <m-tag style="margin-right: 8px" type="warning">
              异常：{{ errorSum }}</m-tag
            >
          </div>
        </template>
      </search-top-mobile>
      <div>
        <div style="margin: 0px 8px">
          <list-mobile
            :tableObj="listObj"
            :tableData="tableData"
            :tableHeight="boxHeight - 54 - 8"
            @sortClick="sortClick"
          >
            <template v-slot:cpuUsage="props">
              <div>{{ props.cellValue.toFixed(2) + "%" }}</div>
            </template>
            <template v-slot:memUsage="props">
              <div>{{ props.cellValue.toFixed(2) + "%" }}</div>
            </template>
            <template v-slot:status="props">
              <div class="open-color" v-if="props.cellValue >= 0">正常</div>
              <div class="close-color" v-else-if="props.cellValue == -1">
                异常
              </div>
            </template>
            <template v-slot:startup="props">
              <div v-if="props.cellValue === 'auto'">自动</div>
              <div v-else-if="props.cellValue === 'manual'">手动</div>
            </template>
            <template v-slot:handle="props">
              <div
                v-if="props.cellData.status >= 0"
                class="danger-color"
                @click="startOff(props.cellData, 2)"
              >
                停用
              </div>
              <div
                v-else
                class="warning-color"
                @click="startOff(props.cellData, 1)"
              >
                启用
              </div>
            </template>
          </list-mobile>
        </div>
      </div>
    </template>
  </page-mobile>
</template>

<script>
import { serviceMixin } from "@/utils/mobileMixins/serviceMixin";
export default {
  mixins: [serviceMixin],
  data() {
    return {
      listObj: {
        cName: {
          slot: false,
          lable: "服务名称",
          class: "tabel-col-2",
          sortable: false,
          width: "20%",
        },
        cpuUsage: {
          slot: true,
          lable: "CPU占用率",
          class: "tabel-col-2 tabel-content-center",
          sortable: true,
          width: "15%",
        },
        memUsage: {
          slot: true,
          lable: "内存占用",
          class: "tabel-col-2 tabel-content-center",
          sortable: true,
          width: "15%",
        },
        status: {
          slot: true,
          lable: "进行状态",
          class: "tabel-col-2 tabel-content-center",
          sortable: true,
          width: "15%",
        },
        startup: {
          slot: true,
          lable: "启动形式",
          class: "tabel-col-2 tabel-content-center",
          sortable: true,
          width: "15%",
        },
        handle: {
          slot: true,
          lable: "操作",
          class: "tabel-col-2 handle-cell",
          sortable: false,
        },
      },
    };
  },
  created() {},
  mounted() {},

  methods: {
    inputFunc(e) {
      this.serviceName = e;
    },
  },
};
</script>

<style lang='scss' scoped>
</style>