  <template>
  <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
     <div class="info-title">
        <span>配置信息</span>
        <span @click="hideDetail">
          <icon :name="'back'" :size="'20'"></icon>
        </span>
      </div>
      <div class="table-box">
        <table class="altrowstable">
          <tr>
            <td class="altrowstable-left">接口名称</td>
            <td class="altrowstable-right">
              {{ data.name }}
            </td>
            <td class="altrowstable-left">请求方式</td>
            <td class="altrowstable-right">
              {{ data.method_type }}
            </td>
            <td class="altrowstable-left">执行效率</td>
            <td class="altrowstable-right">{{ data.cron }}</td>
          </tr>
          <tr>
            <td class="altrowstable-left">接口地址</td>
            <td colspan="5" style="text-align: left; padding: 0 8px">
              {{ data.url }}
            </td>
          </tr>
          <tr>
            <td class="altrowstable-left">请求头</td>
            <td
              colspan="5"
              @click="jsonClick(data.headers)"
              @mouseover="mouseover('3')"
              @mouseleave="mouseleave('3')"
              :style="
                active2 == '' ? 'text-align: left; padding: 0 8px' : active2
              "
              v-if="data.headers"
            >
              <span v-if="data.headers.length >= 100">
                {{ data.headers.substring(0, 100) + "..." }}
              </span>
              <span v-else> {{ data.headers }}</span>
            </td>
            <td colspan="5" style="text-align: left; padding: 0 8px" v-else>
              {{ data.headers }}
            </td>
          </tr>
          <tr>
            <td class="altrowstable-left">接口参数</td>
            <td
              colspan="5"
              @click="jsonClick(data.params)"
              @mouseover="mouseover('1')"
              @mouseleave="mouseleave('1')"
              :style="
                active == '' ? 'text-align: left; padding: 0 8px' : active
              "
              v-if="data.params"
            >
              <span v-if="data.params.length >= 100">
                {{ data.params.substring(0, 100) + "..." }}
              </span>
              <span v-else> {{ data.params }}</span>
            </td>
            <td colspan="5" style="text-align: left; padding: 0 8px" v-else>
              {{ data.params }}
            </td>
          </tr>

          <tr>
            <td class="altrowstable-left">接口说明</td>
            <td colspan="5" style="text-align: left; padding: 0 8px">
              {{ data.Description }}
            </td>
          </tr>
        </table>

      </div>
     <!--查看json格式数据-->
        <tis-dialog
          width="70%"
          append-to-body
          title="json数据展示"
          :visible.sync="jsonShow"
          :modal-append-to-body="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <div style="text-align: left">
            <json-viewer
              :value="jsonMessage"
              v-if="isJson"
              sort
              theme="my-awesome-json-theme"
            ></json-viewer>
            <div v-else>
              {{ this.jsonMessage }}
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <tis-button @click="jsonClose">关 闭</tis-button>
          </span>
        </tis-dialog>
  </box-show>
</template>

<script>
import { formatDate } from "@/utils/util";
import JsonViewer from "vue-json-viewer";
export default {
  components: { JsonViewer },
  props: ["data"],
  filters: {
    fd(time) {
      return formatDate(time);
    },
  },
  data() {
    return {
      jsonMessage: "", //json数据
      jsonShow: false, //json数据弹出框展示
      isJson: false,
      active: "", //样式
      active1: "", //样式
      active2: "", //样式
    };
  },

  methods: {
    //返回
    hideDetail() {
      this.$emit("showFalse");
    },
    //打开json展示弹框
    jsonClick(message) {
      this.jsonShow = true;
      try {
        var obj = JSON.parse(message);
        this.jsonMessage = obj;
        this.isJson = true;
      } catch (e) {
        this.jsonMessage = message;
        this.isJson = false;
      }
    },
    //关闭json展示弹框
    jsonClose() {
      this.jsonShow = false;
      this.jsonMessage = "";
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
    //鼠标移出事件
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

<style lang="scss" scoped>
.info-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--pop-title-size);
  margin:0 16px;
  height:40px
}
.table-box{
  text-align: left;
  margin:0 16px;
  height:calc(100% - 40px);
  overflow-y: scroll;
}
table.altrowstable {
  font-family: verdana, arial, sans-serif;
  font-size: var(--text-size-small);
  color: #333333;
  border-width: 1px;
  border-color: #747474;
  border-collapse: collapse;
  color: #fff;
}

table.altrowstable th {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  width: 25vh;
  border-color: #747474;
  text-align: center;
  color: #fff;
  /* background: #78ccc6; */
}

table.altrowstable td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #747474;
  text-align: center;
}

.altrowstable-left {
  background: #373734;
  width: 15%;
  font-size: var(--text-size-small);
}

.altrowstable-right {
  /* background: #f2f6fc; */
  font-size: var(--text-size-small);
}

table {
  width: 100%;
  height: 200px;
  /* border-collapse属性设置表格的边框是否被合并为一个单一的边框，还是像在标准的HTML中那样分开显示 */
  /* separate：默认值，边框会分开 */
  /* collapse: 如果可能，边框会合并为单一的边框 */
  border-collapse: collapse;
}
</style>
