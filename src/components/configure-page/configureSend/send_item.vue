<template>
  <div v-if="pluginItem">
    <div class="plugin-item-title flex-between">
      <div class="flex">
        <div class="plugin-logo">
          <i v-if="pluginItem.type == '配置文件'" class="el-icon-document"></i>
          <i v-else class="el-icon-tickets"></i>
        </div>
        <div class="title-content">
          <div>{{ pluginItem.name }}</div>
          <div class="title-content-e">
            {{ pluginItem.create_time | fd(that) }}
          </div>
        </div>
      </div>
    </div>

    <div class="plugin-item-content">
      <div class="p-con-item">
        <div class="plugin-content-top">配置类型:{{ "&nbsp;" }}</div>
        <div class="plugin-content-bottom">
          {{ pluginItem.type }}
        </div>
      </div>
      <div class="p-con-item">
        <div class="plugin-content-bottom text-line-double">
          <span class="plugin-content-top">描 述:</span>
          {{ pluginItem.describe }}
        </div>
      </div>
    </div>
    <div class="plugin-bottom">
      <div class="plugin-bottom-item" @click="showDetail">查看</div>
      <div class="plugin-bottom-item" @click="edit">编辑</div>
      <div class="plugin-bottom-item hide-line" @click="deleteSend()">删除</div>
    </div>
  </div>
</template>
<script>
// import { formatDate } from "@/utils/util";
export default {
  props: ["pluginItem"],
  data() {
    return {
      that: this,
    };
  },
  created() {
    // console.log("有moment maam",this.$moment())
  },
  filters: {
    fd(time, that) {
      // return formatDate(time)
      return that.$moment(time).format("YYYYMMDD");
    },
  },
  methods: {
    /**
     * 查看基本信息
     */
    showDetail() {
      this.$emit("showList", this.pluginItem.id);
    },
    /**
     * 修改
     */
    edit() {
      this.$emit("edit", this.pluginItem);
    },
    /**
     * 删除指定信息
     */
    deleteSend() {
      this.$yqAlert({
        content: "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/configureSend/delete", {
              id: this.pluginItem.id,
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.$emit("page");
              } else {
                this.$message.warning("删除失败！");
              }
            });
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.stu {
  display: flex;
  justify-content: center;
  align-items: center;
}

.p-con-item {
  display: flex;
  margin-bottom: 8px;
}

.plugin-content-top {
  color: var(--text-color-weak);
}

.plugin-content-bottom {
  text-align: justify;
  text-justify: newspaper;
  word-break: break-all;
}
.text-line-double{
  height:3vw;
}
.plugin-item-content {
  margin: 15px;
  justify-content: space-around;
  font-size: var(--text-size-big);
}

.plugin-item-title {
  margin: 25px 15px;
}

.plugin-logo {
  color: var(--color-5);
  margin-right: 8px;
  font-size: 2vw;
}

.title-content {
  text-align: left;
  font-size: var(--pop-title-size);
}

.title-content-e {
  color: var(--text-color-weak);
  font-size: var(--text-size-small);
}

.plugin-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: var(--layout-bg-3);
  display: flex;
   font-size: var(--text-size-small);
   line-height: 2.6vw;
}

.plugin-bottom-item {
  width: calc(100% / 2);
  text-align: center;
  border-right: var(--status-bar-tools-border);
}

.plugin-refresh {
  position: absolute;
  right: 16px;
  top: 16px;
}

.hide-line {
  border: none;
}
</style>
