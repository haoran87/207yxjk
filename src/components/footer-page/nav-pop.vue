<template>
  <up-pop :showPop="showPop">
    <div class="nav-box">
      <div
        class="nav-pop-item"
        :class="{ 'nav-pop-selected': item.id === $store.state.yqInfo.navId }"
        v-for="(item, idx) in navList"
        :key="idx"
        @click.stop="navClick(item)"
      >
        {{ item.menu_name }}
      </div>
    </div>
  </up-pop>
</template>
<script>
import { ToNavPath } from "@/utils/util";
import upPop from "../page/up-pop.vue";
export default {
  components: { upPop },
  props: ["chooseNav", "nav"],
  data() {
    return {
      showPop: false,
      navList: [],
      maxLen: 0,
      styObj: {},
    };
  },
  created() {
    this.navList = this.nav.children;
    // let maxlen = 4;
  },
  watch: {
    chooseNav(newNav) {
      if (newNav) {
        this.showPop = newNav.id === this.nav.id;
      } else {
        this.showPop = false;
      }
    },
  },
  methods: {
    navClick(item) {
      if (item.id == this.$store.state.yqInfo.navId) return;
      if (item.url) {
        ToNavPath(item);
        this.$emit("hidePop");
      }
    },
  },
};
</script>
<style lang='scss'  scoped>
.nav-box {
  font-size: 1.25vw;
}
.nav-pop-item {
  color: var(--text-color);
  margin-bottom: 24px;
}
.nav-pop-item:hover {
  color: var(--hover-color);
}
.nav-pop-selected {
  color: var(--hover-color);
}
</style>
