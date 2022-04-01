<template>
  <div>
    <box-show
        style="padding: 0 8px"
        :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }"
    >
      <div v-if="$store.state.yqInfo.connectedStu">
        <div class="input-box">
          <div class="input-label">插件名称</div>
          <div class="input-con">
            <tis-input v-model="pluginName" placeholder="请输入"></tis-input>
          </div>
          <tis-button @click="searchPlugin" type="primary" v-has="'select'">查询</tis-button>
          <tis-button type="info" @click="resetPlugin" v-has="'select'">重置</tis-button>
        </div>
        <div
            :style="{
            height: $store.state.yqInfo.MAINHEIGHT - 56 - 48 + 'px',
            'overflow-y': 'scroll',
          }"
        >
          <div class="plugin-row">
            <div
                class="plugin-item plugin-add"
                :class="{ 'plugin-add-h': pluginList.length === 0 }"
                @click="addPluginClick" v-has="'Insert'"
            >
              <div class="plugin-add">
                <plugin-add-icon></plugin-add-icon>
                <div style="margin-top: 16px" >添加插件</div>
              </div>
            </div>
            <div class="plugin-item" v-for="(p, idx) in pluginList" :key="idx">
              <plugin-item
                  :pluginItem="p"
                  @installClick="itemInstall($event, idx)"
                  @pluginEdit="itemEdit(idx)"
              ></plugin-item>
            </div>
          </div>
        </div>

        <div class="footer-page-info">
          <list-page
              :pageInfo="pageInfo"
              :curPage="curPage"
              @cpc="curPageChange"
              :pageSize="pageSize"
          ></list-page>
        </div>
      </div>
      <div v-else>
        <weijietong></weijietong>
      </div>
    </box-show>
    <tis-dialog
        :title="popTitle"
        :visible.sync="showPop"
        width="50%"
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
   
  </div>
</template>
<script>
import pluginAddIcon from "./monitor-components/plugin-add-icon.vue";
import PluginItem from "./monitor-components/plugin-item.vue";
import PluginForm from "./monitor-components/plugin-form.vue";
import { pluginMixin } from "@/utils/mobileMixins/pluginManageMixin"
export default {
  mixins:[pluginMixin],
  components: {
    pluginAddIcon,
    PluginItem,
    PluginForm,
  },
  data() {
    return {
    };
  },
  
  
};
</script>
<style lang="scss" scoped>

</style>
