<template>
  <div
    id="app"
    class="yqxxkjStyle"
    :class="{ yqxxkjPad: deviceType === 'pad' }"
  >
    <mobile  v-if="deviceType === 'mobile'"></mobile>
    <component :is="'Layout'" v-else></component>
  </div>
</template>
<script>
import Layout from "./components/page/layout.vue";
import Mobile from "./mobile/indexMobile.vue";
import { mapMutations } from "vuex";
export default {
  name: "App",
  components: {
    Layout,
    Mobile,
  },
  data() {
    return {
      compName: "",
      kt_yysc: "",
    };
  },
  created() {},
  mounted() {
    // console.log("我是应用框架,我的state:@@@@", this.testData);
    // this.$tis
    //   .loadComponent("testApp")
    //   .then((res) => {
    //     console.log("load component", res);
    //     this.compName = "testApp";
    //   })
    //   .catch((err) => {
    //     this.compName = "testApp";
    //     console.error(err);
    //   });
    // this.$tis
    //   .loadComponent("pcmarket")
    //   .then((res) => {
    //     this.kt_yysc = "pcmarket";
    //     console.log("load component", res.component, this.kt_yysc);
    //   })
    //   .catch((err) => {
    //     this.kt_yysc = "pcmarket";
    //     console.error(err);
    //   });
  },
  computed: {
    deviceType() {
      let type = this.$getPlatformType();
      this.modifyPlatform(type);
      return type;
    },
    // ...mapState("yqInfo", ["testData"]),
  },
  methods: {
    ...mapMutations("yqInfo", ["SET_PLATFORM"]),
    modifyPlatform(type) {
      if (type === "pad") {
        this.$platform.type = "pad";
        this.$platform.size = "mini";
      }

      this.SET_PLATFORM(type);
    },
  },
};
</script>

<style lang="scss">
@import "./assets/css/theme.scss";
@import "./assets/css/padStyle.scss";
</style>
