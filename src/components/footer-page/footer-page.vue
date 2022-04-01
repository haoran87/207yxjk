<template>
  <div style="padding:0;marin:0" id="yq_footer">
    <!-- <bottom-bar v-if="bottomStu === 1" @showNav="doShowNav"></bottom-bar> -->
    <bottom-pop  v-if="bottomStu === 2" @hideNav="doHideNav"></bottom-pop>
  </div>
</template>
<script>
// import BottomBar from "./bottom-bar.vue";
import BottomPop from './bottom-pop.vue';
export default {
  components: {
    // BottomBar,
    BottomPop,
  },
  data() {
    return {
    };
  },
  mounted() {},
  computed:{
    bottomStu(){
      return this.$store.state.yqInfo.bottomStu
    }
  },
  methods: {
    doHideNav() {
      // this.$store.commit('yqInfo/CHANGE_BSTU',1)
    },
    doShowNav() {
      this.$store.commit('yqInfo/CHANGE_BSTU',2)
    },
  },
};
</script>
