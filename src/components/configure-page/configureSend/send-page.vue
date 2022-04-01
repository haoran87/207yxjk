<template>
  <send-list v-if="!see" @showDetail="showDetail"></send-list>
  <send-look v-else @hideDetail="hideDetail" :id="id"></send-look>
</template>

<script>
import SendList from "./send-list";
import SendLook from "./send-look";

export default {
  components: {SendLook, SendList},
  data() {
    return {
      see: false,
      id: ""
    };
  },
  methods: {
    showDetail(id) {
      this.id = id;
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
