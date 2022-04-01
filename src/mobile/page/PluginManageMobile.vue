<template>
  <page-mobile>
    <template slot-scope="{ boxHeight }">
      <search-top-mobile
        :placeholder="'请输入插件名称'"
        @search="searchPlugin"
        @clear="searchPlugin"
        @input="inputFunc"
      >
      </search-top-mobile>
      <div style="margin: 0px 8px">
        <list-mobile
          ref="selfTable"
          :checkable="false"
          :tableObj="listObj"
          :tableData="pluginList"
          :tableHeight="boxHeight - 54 - 56"
        >
          <template v-slot:type="props">
            {{ typeArr[props.cellValue] }}
          </template>
          <template v-slot:show_status="props">
            <div>
              <span class="open-color" 
              v-if="props.cellValue == 3"
              >已启用</span>
              <span 
              class="warning-color" 
              v-if="props.cellValue == 1"
              >未加载</span>
              <span 
              class="danger-color" 
              v-if="props.cellValue == 2"
              >未启用</span>
            </div>
          </template>
          <template v-slot:handle="props">
            <div class="selected-color">
              <span @click="itemEdit(props.idx)">编 辑</span>{{ "&nbsp;" }}
              <span
                @click="itemInstall(true, props.idx)"
                v-if="props.cellData.show_status == 1"
                >加载{{ "&nbsp;" }}</span
              >
              <span @click="itemInstall(false, props.idx)" v-else
                >卸载{{ "&nbsp;" }}</span
              >

              <span
                v-if="props.cellData.show_status == 3"
                @click="onOffClick(props.cellData, false)"
                >禁用</span
              >
              <span v-else @click="onOffClick(props.cellData, true)"
                >启用
              </span>
            </div>
          </template>
        </list-mobile>
      </div>
      <div class="flex flex-between" style="margin: 0 8px">
        <div>
          <m-button @click="addPluginClick"> 添加 </m-button>
        </div>
        <pagination-mobile
          :pageInfo="pageInfo"
          :curPage="curPage"
          @pageChange="curPageChange"
        ></pagination-mobile>
      </div>
       <tis-dialog
        :title="popTitle"
        :visible.sync="showPop"
        width="90%"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
      <plugin-form ref="pform" :formData="formData" @submit="submit" :showPop="showPop"></plugin-form>
      <span slot="footer" class="dialog-footer">
        <tis-button @click="closePop">取 消</tis-button>
        <tis-button type="primary" @click="check()">确 定</tis-button>
      </span>
    </tis-dialog>
    </template>
  </page-mobile>
</template>

<script>
import PaginationMobile from "../mobileModules/PaginationMobile.vue";
import PluginForm from "@/components/monitor-page/monitor-components/plugin-form.vue";
import { pluginMixin } from "@/utils/mobileMixins/pluginManageMixin";
export default {
  mixins: [pluginMixin],
  components: {
    PaginationMobile,
    PluginForm
  },
  data() {
    return {
      listObj: {
        name: {
          slot: false,
          lable: "插件名称",
          class: "",
          sortable: false,
          width: "25%",
        },
        code: {
          slot: false,
          lable: "插件标识",
          class: "",
          sortable: false,
          width: "25%",
        },
        show_status: {
          slot: true,
          lable: "状态",
          class: "",
          sortable: false,
          width: "10%",
        },
        type: {
          slot: true,
          lable: "类型",
          class: "",
          sortable: false,
          width: "10%",
        },
        handle: {
          slot: true,
          lable: "操作",
          class: "cell-text-center",
          sortable: false,
          width: "20%",
        },
      },
      typeArr: {
        server: "服务",
        script: "脚本",
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    inputFunc(e) {
      this.pluginName = e;
    },
    onOffClick(pluginItem, enable) {
      if (pluginItem.show_status == 1) {
        this.$message({
          message: "请先加载插件！",
        });
        return;
      }
      let path = "/insight/plugin/enable";
      pluginItem.enable = enable;
      this.$api.postServerAction(path, pluginItem).then((res) => {
        if (res.code == 200) {
          pluginItem.show_status = enable ? 3 : 2;
          this.$message({
            message: enable ? "插件已启用！" : "插件已禁用！",
            type: enable ? "success" : "warning",
          });
        } else {
          this.$message.error(res.info);
        }
      });
    },
    pluginEdit() {
      this.$emit("pluginEdit");
    },
  },
};
</script>

<style>
</style>