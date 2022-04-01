<template>
  <div class="index-mobile">
    <component  :is="compName" v-if='$store.state.yqInfo.chooseIP'></component>
    <suspension @menuClick="showMenu"></suspension>
    <menu-pop ref="menuPop"></menu-pop>
  </div>
</template>
<script>
import { menuMixins } from "@/utils/mobileMixins/menuMixin";
import Suspension from "./mobileModules/suspension.vue";
import { ToNavPath } from "@/utils/util";
import { mapMutations } from "vuex";
export default {
  mixins: [menuMixins],
  components: {
    Suspension,
  },
  data() {
    return {
      compName: "",
      temComp: "",
    };
  },
  created() {
    this.initMobileIP()
  },
  mounted() {
    let item = this.menus[0];
    if (this.$store.state.yqInfo.navId !== "") {
      item = this.menus.find((el) => {
        return el.id === this.$store.state.yqInfo.navId;
      });
    }
    ToNavPath(item);
  },
  watch: {
    "$store.state.yqInfo.componentPath": function (newPath) {
      this.compName = () => import("@/mobile" + newPath);
      this.temComp = newPath;
    },
  },
  methods: {
    ...mapMutations("yqInfo", ["SET_MOBILE_IP"]),
    initMobileIP(){
     this.$api
        .getServerAction("/insight/statusInfo/getLocalDeviceIPInfo")
        .then(res=>{
          if(res.code === 200){
            this.SET_MOBILE_IP(res.data.ip)
          }
        })
    }
  },
};
</script>
<style lang="scss" scoped>
  .index-mobile{
    height: 100%;
    color: var(--text-color);
  }
</style>