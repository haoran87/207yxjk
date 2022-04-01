<template>
  <div>
    <!-- 查看历史记录详情   -->
    <tis-dialog
      title="接口结果信息"
      width="80%"
      :visible.sync="showResult"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :style="$store.state.yqInfo.dialogBg"
    >
      <div>
        <table class="altrowstable" style="margin-top: 50px">
          <tr>
            <td class="altrowstable-left">接口名称</td>
            <td class="altrowstable-right">
              {{ cronJob.name }}
            </td>
            <td class="altrowstable-left">请求方式</td>
            <td class="altrowstable-right">
              {{ cronJob.method_type }}
            </td>
            <td class="altrowstable-left">参数类型</td>
            <td class="altrowstable-right">
              {{ cronJob.params_type }}
            </td>
          </tr>
          <tr>
            <td class="altrowstable-left">状态</td>
            <td class="altrowstable-right">
              {{ resultData.code }}
            </td>
            <td class="altrowstable-left">返回</td>
            <td class="altrowstable-right">
              <span v-if="resultData.success == 'true'" class="open-color"
                >成功</span
              >
              <span
                v-else-if="resultData.success == 'false'"
                class="close-color"
                >失败</span
              >
            </td>
            <td class="altrowstable-left">创建时间</td>
            <td class="altrowstable-right">
              {{ resultData.create_time | fd }}
            </td>
          </tr>
          <tr>
            <td class="altrowstable-left">请求参数</td>
            <td
              colspan="5"
              @click="jsonClick(cronJob.params)"
              @mouseover="mouseover('1')"
              @mouseleave="mouseleave('1')"
              :style="
                active == '' ? 'text-align: left; padding: 0 8px' : active
              "
              v-if="cronJob.params"
            >
              <span v-if="cronJob.params.length >= 100">
                {{ cronJob.params.substring(0, 100) + "..." }}
              </span>
              <span v-else> {{ cronJob.params }}</span>
            </td>
            <td colspan="5" style="text-align: left; padding: 0 8px" v-else>
              {{ cronJob.params }}
            </td>
          </tr>
          <tr>
            <td class="altrowstable-left">请求头</td>

            <td
              colspan="5"
              @click="jsonClick(cronJob.headers)"
              @mouseover="mouseover('3')"
              @mouseleave="mouseleave('3')"
              :style="
                active2 == '' ? 'text-align: left; padding: 0 8px' : active2
              "
              v-if="cronJob.headers"
            >
              <span v-if="cronJob.headers.length >= 100">
                {{ cronJob.headers.substring(0, 100) + "..." }}
              </span>
              <span v-else> {{ cronJob.headers }}</span>
            </td>
            <td colspan="5" style="text-align: left; padding: 0 8px" v-else>
              {{ cronJob.headers }}
            </td>
          </tr>
          <tr>
            <td class="altrowstable-left">请求路径</td>
            <td colspan="5" style="text-align: left; padding: 0 8px">
              {{ cronJob.url }}
            </td>
          </tr>
          <tr>
            <td class="altrowstable-left">接口说明</td>
            <td colspan="5" style="text-align: left; padding: 0 8px">
              {{ cronJob.description }}
            </td>
          </tr>
          <tr>
            <td class="altrowstable-left">结果信息</td>
            <td
              colspan="5"
              @click="jsonClick(resultData.result)"
              @mouseover="mouseover('2')"
              @mouseleave="mouseleave('2')"
              :style="
                active1 == '' ? 'text-align: left; padding: 0 8px' : active1
              "
              v-if="resultData.result && resultData.code != '500'"
            >
              {{ resultData.result.substring(0, 100) + "..." }}
            </td>
            <td colspan="5" style="text-align: left; padding: 0 8px" v-else>
              {{ resultData.result }}
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <tis-button @click="closeResult">关 闭</tis-button>
      </span>
    </tis-dialog>
  </div>
</template>

<script>
import { formatDate } from "@/utils/util";
export default {
  data() {
    return {
      showResult: false,//接口结果信息开关
      cronJob: {},//接口结果信息
      resultData: {},//接口结果信息
      active: "", //样式
      active1: "", //样式
      active2: "", //样式
    };
  },
  filters: {
    fd(time) {
      return formatDate(time);
    },
  },
  methods: {
    //json信息展示
    jsonClick(data) {
      this.$emit("jsonClick", data);
    },
    //关闭弹框
    closeResult() {
      this.showResult = false;
    },
    //鼠标移入事件
    mouseover(sum) {
      if (sum == "1") {
        this.active =
          "text-align: left; padding: 0 8px;color: var(--hover-color);cursor: pointer";
      } else if (sum == "2") {
        this.active1 =
          "text-align: left; padding: 0 8px;color: var(--hover-color);cursor: pointer";
      } else if (sum == "3") {
        this.active2 =
          "text-align: left; padding: 0 8px;color: var(--hover-color);cursor: pointer";
      }
    },
    //鼠标离开事件
    mouseleave(sum) {
      if (sum == "1") {
        this.active = "";
      } else if (sum == "2") {
        this.active1 = "";
      } else if (sum == "3") {
        this.active2 = "";
      }
    },
  },
};
</script>

<style lang='scss' scoped>

</style>
