<template>
  <page-mobile>
    <template slot-scope="{ boxHeight }">
      <div v-if="!showActive">
        <search-top-mobile
          :placeholder="'请输入告警名称'"
          @search="search"
          @clear="search"
          @input="inputFunc"
        >
          <template v-slot:left>
            <drop-down-mobile
              :option="option1"
              @change="dropdownChange"
            ></drop-down-mobile>
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
            <template v-slot:status="props">
              <span v-if="props.cellValue == '1'" class="open-color">启用</span>
              <span v-else class="close-color">未启用</span>
            </template>
            <template v-slot:handle="props">
              <div class="selected-color">
                <span @click="showDetailM(props.cellData)">查 看</span
                >{{ "&nbsp;" }}
                <span @click="editForm(props.cellData)">编 辑</span
                >{{ "&nbsp;" }}
                <span
                  v-if="props.cellData.status == '1'"
                  @click="updateStatue(props.cellData, '0')"
                  >禁 用</span
                >
                <span v-else @click="updateStatue(props.cellData, '1')"
                  >启 用</span
                >{{ "&nbsp;" }}
                <span @click="deleteTemplate(props.cellData)">删 除</span>
              </div>
            </template>
          </list-mobile>
        </div>
        <div class="flex flex-between" style="margin: 0 8px">
          <div>
            <!-- <m-button >删除</m-button> -->
            <m-button @click="addForm"> 添加 </m-button>
            <m-button @click="deleteByIds" style="margin-left: 8px"
              >删除
            </m-button>
            <m-button @click="importExcel" style="margin-left: 8px">
              导入
            </m-button>
            <m-button style="margin-left: 8px" @click="exportExcel">
              导出
            </m-button>
            <m-button style="margin-left: 8px"> 模板下载 </m-button>
          </div>
          <pagination-mobile
            :pageInfo="pageInfo"
            :curPage="curPage"
            @pageChange="curPageChange"
          ></pagination-mobile>
        </div>
      </div>
      <warning-tem-mobile 
      v-else 
      :data="detailObj"
      @hideDetail="hideDetailM"
      ></warning-tem-mobile>
      <import-excel
        :action="action"
        :showImport="showImport"
        @page="getPageList"
        @close="closeImport"
        :tipText="'只能上传xls/xlsx文件'"
        :suffix="'.xlsx,.xls'"
        :href="href"
        ref="importExcel"
      ></import-excel>
      <tis-dialog
        append-to-body
        :title="popTitle"
        :visible.sync="formPop"
        width="90%"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div v-if="formPop">
          <template-form
            :form="form"
            :dynamicValidateForm="dynamicValidateForm"
            :pluginList="pluginList"
            @submitOk="getPageList"
            ref="templateForm"
          ></template-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <tis-button @click="closePop">取 消</tis-button>
          <tis-button type="primary" @click="submit">确 定</tis-button>
        </span>
      </tis-dialog>
    </template>
  </page-mobile>
</template>

<script>
import TemplateForm from "@/components/alarm-page/template/template-form";
import ImportExcel from "@/components/page/importExcel";
import DropDownMobile from "../mobileModules/DropDownMobile.vue";
import PaginationMobile from "../mobileModules/PaginationMobile.vue";
import { warningTemplateMixin } from "@/utils/mobileMixins/warningTemplateMixin";
import WarningTemMobile from '../mobileModules/WarningTemMobile.vue';
export default {
  mixins: [warningTemplateMixin],
  components: {
    DropDownMobile,
    PaginationMobile,
    ImportExcel,
    TemplateForm,
    WarningTemMobile,
  },
  data() {
    return {
      option1: [
        {
          value: "",
          text: "模板状态",
        },
        {
          value: "0",
          text: "未启用",
        },
        {
          value: "1",
          text: "启用",
        },
      ],
      listObj: {
        name: {
          slot: false,
          lable: "告警名称",
          class: "",
          sortable: false,
          width: "30%",
        },
        remark: {
          slot: false,
          lable: "告警描述",
          class: "",
          sortable: false,
          width: "30%",
        },
        status: {
          slot: true,
          lable: "模板状态",
          class: "",
          sortable: false,
          width: "10%",
        },
        handle: {
          slot: true,
          lable: "操作",
          class: "cell-text-center",
          sortable: false,
          width: "30%",
        },
      },
      actions: [{ text: "查看" }, { text: "删除" }],
      showActive:false,
      detailObj:{}
    };
  },
  created() {},
  mounted() {},
  methods: {
    showDetailM(e){
      this.showActive = true;
      this.detailObj =e;
    },
    hideDetailM(){
      this.showActive = false;
    },
    showHandle() {
      console.log(this.tableData);
      // item.showPopover =true;
    },
    handleClick(e, data) {
      data.showPopover = false;
      console.log("点击了啊啊啊 === ", e.target.dataset, data);
    },
    inputFunc(e) {
      this.name = e;
    },
    dropdownChange(e) {
      this.status = e;
      this.search();
    },
  },
};
</script>

<style lang="scss" scoped>
.m-menu-item {
  padding: 4px;
  width: 80px;
  text-align: center;
}
</style>