<template>
  <template-list v-if="!see" @showDetail="showDetail"></template-list>
  <template-look v-else  @hideDetail="hideDetail" :data="data"></template-look>
</template>

<script>

import TemplateList from "./template-list";
import TemplateLook from "./template-look";

export default {
  components: {
    TemplateLook,
    TemplateList
  },
  data() {
    return {
      see: false,
      data:{}
    };
  },
  methods: {
    showDetail(detail) {
      this.data = detail;
      this.see = true
    },
    hideDetail() {
      this.see = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
