<template>
  <div>
    <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
      <div>
        <div ref="topCon">
          <div class="input-box">
            <div class="input-label">告警名称:</div>
            <div class="input-con">
              <tis-input
                v-model="name"
                placeholder="请输入告警名称"
              ></tis-input>
            </div>
            <div class="input-label">模板状态:</div>
            <div class="input-con">
              <el-select
                popper-class="pickerClass"
                v-model="status"
                placeholder="请选择模板状态"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <tis-button type="primary" @click="search">查 询</tis-button>
            <tis-button type="info" @click="clean">重 置</tis-button>
          </div>
          <div class="btn-box">
            <tis-button type="primary" @click="addForm">添 加</tis-button>
            <tis-button type="danger" @click="deleteByIds">删除</tis-button>
            <tis-button type="primary" @click="exportExcel">导出</tis-button>
            <tis-button type="primary" @click="importExcel">导入</tis-button>
            <tis-button type="primary" @click="excelDownload"
              >模板下载</tis-button
            >
          </div>
        </div>
        <div style="margin: 8px 16px 0" v-if="topHeight > 0">
          <self-table
            ref="selfTable"
            :tableData="tableData"
            :tableObj="tableObj"
            @sortClick="sortClick"
            checkable="true"
            :tableHeight="$store.state.yqInfo.MAINHEIGHT - topHeight - 48"
          >
            >
            <template v-slot:status="props">
              <span v-if="props.cellValue == '1'" class="open-color">启用</span>
              <span v-else class="close-color">未启用</span>
            </template>
            <template v-slot:handle="props">
              <div class="selected-color">
                <span @click="showDetail(props.cellData)">查 看</span
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
          </self-table>
        </div>

        <list-page
          :pageInfo="pageInfo"
          :curPage="curPage"
          :pageSize="pageSize"
          @cpc="curPageChange"
        ></list-page>
        <!-- <div style="height: 100px"></div> -->
      </div>
    </box-show>
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
  </div>
</template>

<script>
import TemplateForm from "./template-form";
import ImportExcel from "../../page/importExcel";
import {warningTemplateMixin} from "@/utils/mobileMixins/warningTemplateMixin"
export default {
  mixins:[warningTemplateMixin],
  components: {
    TemplateForm,
    ImportExcel,
  },
   mounted() {
        let rect = this.$refs.topCon.getBoundingClientRect();
        this.topHeight = rect.height + 8;
      },
};
</script>

<style lang="scss" scoped>
.input-item {
  display: flex;
  align-items: center;
}
.btn-box {
  display: flex;
  margin: 0 16px;
}
</style>
