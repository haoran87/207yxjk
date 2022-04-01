<template>
  <m-popup
    v-model="show"
    position="right"
    :style="{ height: '100%', width: '120px' }"
  >
    <div class="menu-box" @click="menuClick">
      <div
        class="menu-item"
        :class="{'menu-item-s':item.id == $store.state.yqInfo.navId}"
        :data-idx="idx"
        v-for="(item, idx) in menus"
        :key="idx"
      >
        {{ item.name }}
      </div>
    </div>
  </m-popup>
</template>
<script>
import { MOBILEROUTERS } from "@/router/router.config";
import { ToNavPath } from "@/utils/util";
export default {
  data() {
    return {
      show: false,
      menus: MOBILEROUTERS,
    };
  },
  created() {},
  mounted() {},
  methods: {
    menuClick(e) {
      ToNavPath(this.menus[e.target.dataset.idx]);
      this.show = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.menu-box {
  margin: 16px;
  .menu-item {
   padding: 8px;
  }
  .menu-item-s{
    background-color:var(--color-6);
    color:#000;
  }
}
</style>
