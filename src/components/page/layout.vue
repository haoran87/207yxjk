<template>
  <tis-container direction="vertical" style="position: relative" v-if="themeOK">
    <tis-main style="padding-top: 0; padding-bottom: 0; height: 100%">
      <component :is="compName"></component>
      <footer-page ref="yq_footer"></footer-page>
    </tis-main>
  </tis-container>
</template>
<script>
import FooterPage from "../footer-page/footer-page.vue";
import {getNavTarget,ToNavPath} from "@/utils/util";

export default {
  name: "layout",
  components: {
    FooterPage,
  },
  data() {
    return {
      compName: "",
      menuData: [],
      kt_yysc: "",
      themeOK: false,
       gutter: 16,
       temComp:"",
    };
  },
  created() {
    this.openPage();
  },
  mounted() {
     setTimeout(() => {
      this.getConHeight();
    }, 1);
    // this.compName =() => import("../home-page/home-page.vue")
  },
  watch: {
    "$store.state.yqInfo.componentPath": function (newPath) {
      this.compName = () => import("@/components" + newPath);
      this.temComp = newPath;
    },
    "$store.state.yqInfo.listenStu"(){
      if(this.temComp != "/home-page/home-page"){
        this.$nextTick(()=>{
          this.compName = '';
          this.compName = () => import("@/components" + this.temComp)
        })
      }
    }
  },
  // computed:{
  //   com(){
  //     return () => import("@/components"+this.$store.state.yqInfo.componentPath)
  //   }
  // },
  methods: {
      getConHeight() {
      let appParents = document.getElementsByClassName("status-bar-container");
      let fh =
        this.$refs.yq_footer.$children[0].$refs
          .bottombar.clientHeight;
      let dh;
      if (appParents.length > 0) {
        // console.log("顶部高度", document.documentElement.clientHeight);
        dh = document.body.clientHeight - appParents[0].clientHeight - fh;
      } else {
        dh = document.documentElement.clientHeight - fh;
      }
      this.$store.commit("yqInfo/SET_MAINHEIGHT", dh - this.gutter);
    },
    getMenu() {
      this.$api.getServerAction("/insight/rolePermission/getMenuListByRunRole").then((res) => {
        if (res.code === 200) {
          this.$store.commit("yqInfo/SET_MENUDATA", res.data);
          this.menuData=res.data
          let yqInfo = this.$store.state.yqInfo;
          if (!yqInfo.navId) {
             let item = null;
             if(this.menuData[0].url){
               item = this.menuData[0]
             }
              else{
                item = this.menuData[0].children[1]
              }
            ToNavPath(item);
          }
          else{
           let item = getNavTarget(this.menuData,yqInfo.navId);
            ToNavPath(item);
          }
        }else{
          this.$message.error(res.info)
        }
      });
    },
    openPage() {
      this.themeOK = true;
      this.getMenu();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
