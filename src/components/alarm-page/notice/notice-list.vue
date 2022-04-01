<template>
  <div>
    <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
      <div class="table-style">
        <div class="input-box" ref="topCon">
          <div class="input-label">模板名称:</div>
          <div class="input-con">
            <tis-input v-model="name" placeholder="请输入告警名称"></tis-input>
          </div>
          <tis-button type="primary" @click="search">查 询</tis-button>
          <tis-button type="info" @click="clean">重 置</tis-button>
          <tis-button type="primary" @click="addForm">添 加</tis-button>
          <tis-button type="danger" @click="deleteByIds">删 除</tis-button>
        </div>
        <div style="margin: 0px 16px" v-if="topHeight > 0">
          <self-table
            ref="selfTable"
            :tableData="tableData"
            :tableObj="tableObj"
            checkable="true"
            :tableHeight="$store.state.yqInfo.MAINHEIGHT - topHeight - 48"
          >
            <template v-slot:status="props">
              <span v-if="props.cellValue == '1'" class="open-color">启用</span>
              <span v-else class="close-color">未启用</span>
            </template>
            <template v-slot:alarm_type="props">
              {{props.cellValue | dict}}
            </template>
            <template v-slot:create_time="props">
              {{ props.cellValue | fd }}
            </template>
            <template v-slot:handle="props">
              <div class="selected-color">
                <!-- <span @click="showDetail(props.cellData)">查 看</span>{{ "&nbsp;" }} -->
                <span
                  @click="enable(props.cellData, '1')"
                  v-if="props.cellData.status == '0'"
                  >启 用{{ "&nbsp;" }}</span
                >
                <span @click="enable(props.cellData, '0')" v-else
                  >禁 用 {{ "&nbsp;" }}</span
                >
                <span @click="editForm(props.cellData)" >编 辑</span
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
    <tis-dialog
      append-to-body
      :title="popTitle"
      :visible.sync="showPop"
      width="60%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-if="showPop">
        <notice-form
          ref="noticeform"
          :form="form"
          :showPop="showPop"
          :disabled="disabled"
          @page="page"
        ></notice-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <tis-button @click="closePop">取 消</tis-button>
        <tis-button type="primary" @click="submit">确 定</tis-button>
      </span>
    </tis-dialog>
  </div>
</template>

<script>

import { dictMixins } from "@/utils/home-module";
import { warningNoticeMixin } from "@/utils/mobileMixins/warningNoticeMixin";
import NoticeForm from "./notice-form";
export default {
  components: {
    NoticeForm,
  },
  mixins:[dictMixins,warningNoticeMixin],
  data() {
   return{

   }
  },
  
 
  mounted() {
    let rect = this.$refs.topCon.getBoundingClientRect();
    this.topHeight = rect.height;
  },
  
};
</script>

<style lang="scss" scoped>
.input-item {
  display: flex;
  align-items: center;
}
</style>
