<template>

    <box-show :style="{'height':$store.state.yqInfo.MAINHEIGHT+'px'}">
        <div class="info-title" style="margin-top: 20px;padding: 10px">
            <span>接口信息</span>

            <span @click="hideDetail">
          <icon :name="'back'" :size="'25'"></icon>
        </span>
        </div>
        <table class="altrowstable" >
            <tr>
                <td class="altrowstable-left">接口名称</td>
                <td class="altrowstable-right">
                    {{ data.name }}
                </td>
                <td class="altrowstable-left">请求方式</td>
                <td class="altrowstable-right">
                    {{ data.method_type }}
                </td>
            </tr>
            <tr>

                <td class="altrowstable-left">状态</td>
                <td class="altrowstable-right">
                    {{ data.code }}
                </td>
                <td class="altrowstable-left">返回</td>
                <td class="altrowstable-right">
                    <span v-if=" data.success =='true'" class="open-color">成功</span>
                    <span v-else-if=" data.success =='false'" class="close-color">失败</span>
                </td>
            </tr>

          <tr>
            <td class="altrowstable-left">创建时间</td>
            <td class="altrowstable-right">
              {{ data.create_time | fd }}
            </td>
             <td class="altrowstable-left">修改时间</td>
            <td class="altrowstable-right">
              <span v-if="data.update_time=='0001-01-01T00:00:00+08:00'"></span>
              <span v-else>{{ data.update_time | fd }}</span>
            </td>
          </tr>
          <tr>
            <td class="altrowstable-left">参数类型</td>
            <td colspan="5" style="text-align: left; padding: 0 8px">
              {{ data.params_type }}
            </td>
          </tr>

            <tr>
                <td class="altrowstable-left">请求参数</td>
                <td colspan="5" @click="jsonClick(data.params)" @mouseover="mouseover('1')" @mouseleave="mouseleave('1')"
                    :style="active==''?'text-align: left; padding: 0 8px':active" v-if="data.params">
                    <span v-if="data.params.length>=100">
                        {{data.params.substring(0, 100)+'...' }}
                    </span>
                    <span v-else> {{data.params }}</span>

                </td>
                <td colspan="5" style="text-align: left; padding: 0 8px"  v-else>{{ data.params }}</td>
            </tr>
            <tr>
                <td class="altrowstable-left">请求头</td>
                <td colspan="5"  @click="jsonClick(data.headers)" @mouseover="mouseover('3')" @mouseleave="mouseleave('3')"
                    :style="active2==''?'text-align: left; padding: 0 8px':active2" v-if="data.headers">
                    <span v-if="data.headers.length>=100">
                        {{data.headers.substring(0, 100)+'...' }}
                    </span>
                    <span v-else> {{data.headers }}</span>
                </td>
                <td colspan="5" style="text-align: left; padding: 0 8px" v-else>{{ data.headers }}</td>
            </tr>
            <tr>
                <td class="altrowstable-left">请求路径</td>
                <td colspan="5" style="text-align: left; padding: 0 8px">
                    {{ data.url }}
                </td>
            </tr>
            <tr>
                <td class="altrowstable-left">接口说明</td>
                <td colspan="5" style="text-align: left; padding: 0 8px">
                    {{ data.description }}
                </td>
            </tr>
            <tr>
                <td class="altrowstable-left">结果信息</td>
                <td colspan="5" @click="jsonClick(data.result)" @mouseover="mouseover('2')"
                    @mouseleave="mouseleave('2')"
                    :style="active1==''?'text-align: left; padding: 0 8px':active1" v-if="data.result&&data.code!='500'">
                    {{ data.result.substring(0, 100)+'...' }}
                </td>
                <td colspan="5"
                    style="text-align: left; padding: 0 8px" v-else >
                    {{ data.result }}
                </td>
            </tr>
        </table>
        <!--查看json格式数据-->
        <tis-dialog
            append-to-body
            title="json数据展示"
            :visible.sync="jsonShow"
            :modal-append-to-body='false'
            :close-on-click-modal = 'false'
            :close-on-press-escape = ' false'
        >
            <div style="text-align: left">
              <json-viewer :value="jsonMessage" v-if="isJson"
                           sort theme="my-awesome-json-theme"></json-viewer>
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
    import {formatDate} from "@/utils/util";
    import JsonViewer from 'vue-json-viewer'
    export default {
      components: {JsonViewer},
        props: ["data"],
        filters: {
            fd(time) {
                return formatDate(time);
            },
        },
        data() {
            return {
                jsonMessage: "",//json数据
                jsonShow: false,//json数据弹出框展示
                isJson: false,
                active: "",//样式
                active1: "",//样式
                active2: "",//样式
            }
        },
        methods: {
            //打开json展示弹框
            jsonClick(message) {
                this.jsonShow = true;
              try {
                var obj = JSON.parse(message);
                this.jsonMessage = obj
                this.isJson = true
              } catch (e) {
                this.jsonMessage = message
                this.isJson = false
              }
            },
            //关闭json展示弹框
            jsonClose() {
                this.jsonShow = false;
                this.jsonMessage = "";
            },
            hideDetail() {
                this.$emit("showFalse")
            },
            //鼠标移入事件
            mouseover(sum) {
                if (sum == '1') {
                    this.active = "text-align: left; padding: 0 8px;color: var(--hover-color);cursor: pointer"
                } else if (sum == '2') {
                    this.active1 = "text-align: left; padding: 0 8px;color: var(--hover-color);cursor: pointer"
                } else if (sum == '3') {
                    this.active2 = "text-align: left; padding: 0 8px;color: var(--hover-color);cursor: pointer"
                }
            },
            //鼠标移出事件
            mouseleave(sum) {
                if (sum == '1') {
                    this.active = ""
                } else if (sum == '2') {
                    this.active1 = ""

                } else if (sum == '3') {
                    this.active2 = ""
                }

            },

        }
    }
</script>

<style lang="scss" scoped>
    .info-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: var(--pop-title-size);
    }

    table.altrowstable {
        font-size: var(--text-size-small);
        border: var(--status-bar-tools-border);
        border-collapse: collapse;
    }

    table.altrowstable th {
        padding: 8px;
        width: 25vh;
        border: var(--status-bar-tools-border);
        text-align: center;
    }

    table.altrowstable td {
        padding: 8px 0;
        height: 29px;
        border: var(--status-bar-tools-border);
        text-align: center;
    }

    .altrowstable-left {
        background: var(--layout-bg-3);
        width: 10%;
        font-size: var(--text-size-small);
    }

    .altrowstable-right {
        font-size: var(--text-size-small);
        width: 23%;
    }

    table {
        width: 100%;
        /* height: 200px; */
        /* border-collapse属性设置表格的边框是否被合并为一个单一的边框，还是像在标准的HTML中那样分开显示 */
        /* separate：默认值，边框会分开 */
        /* collapse: 如果可能，边框会合并为单一的边框 */
        border-collapse: collapse;
    }
</style>
