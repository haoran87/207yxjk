<template>
  <page-mobile>
    <template slot-scope="{ boxHeight }">
      <search-top-mobile
        :placeholder="'请输入告警名称'"
        @search="search"
        @clear="search"
        @input="inputFunc"
      >
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
          <template v-slot:alarm_type="props">
            {{ props.cellValue | dict }}
          </template>
          <template v-slot:create_time="props">
            {{ props.cellValue | fd }}
          </template>
          <template v-slot:handle="props">
            <div class="selected-color">
              <span
                @click="enable(props.cellData, '1')"
                v-if="props.cellData.status == '0'"
                >启 用{{ "&nbsp;" }}</span
              >
              <span @click="enable(props.cellData, '0')" v-else
                >禁 用 {{ "&nbsp;" }}</span
              >
              <span @click="editForm(props.cellData)">编 辑</span>{{ "&nbsp;" }}
              <span @click="deleteTemplate(props.cellData)">删 除</span>
            </div>
          </template>
        </list-mobile>
      </div>
      <div class="flex flex-between" style="margin: 0 8px">
          <div>
            <m-button @click="addForm"> 添加 </m-button>
            <m-button @click="deleteByIds" style="margin-left: 8px"
              >删除
            </m-button>
          </div>
          <pagination-mobile
            :pageInfo="pageInfo"
            :curPage="curPage"
            @pageChange="curPageChange"
          ></pagination-mobile>
      </div>
      <tis-dialog
      append-to-body
      :title="popTitle"
      :visible.sync="showPop"
      width="90%"
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
    </template>
  </page-mobile>
</template>

<script>
import { dictMixins } from "@/utils/home-module";
import { warningNoticeMixin } from "@/utils/mobileMixins/warningNoticeMixin";
import NoticeForm from "@/components/alarm-page/notice/notice-form";
import PaginationMobile from "../mobileModules/PaginationMobile.vue";
export default {
  components: {
    NoticeForm,
    PaginationMobile
  },
  mixins: [dictMixins, warningNoticeMixin],
  data() {
    return {
      listObj: {
        name: {
          slot: false,
          lable: "模板名称",
          class: "",
          sortable: false,
          width: "20%",
        },
        alarm_type: {
          slot: true,
          lable: "通知分类",
          class: "",
          sortable: false,
          width: "20%",
        },
        status: {
          slot: true,
          lable: "状态",
          class: "",
          sortable: false,
          width: "10%",
        },
        create_time: {
          slot: true,
          lable: "创建时间",
          class: "",
          sortable: false,
          width: "20%",
        },
        handle: {
          slot: true,
          lable: "操作",
          class: "cell-text-center",
          sortable: false,
          width: "20%",
        },
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    inputFunc(e) {
      this.name = e;
    },
  },
};
</script>

<style>
</style>