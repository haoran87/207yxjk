<template>
  <div>
    <topo-edit v-if="isEdit" @hideEdit="hideEdit" :topoObj="topoObj"></topo-edit>
    <topo-list v-else @addTopo="addTopo" @editTopo="editTopo"></topo-list>
  </div>
</template>
<script>
import topoEdit from "./topo-edit.vue";
import TopoList from "./topo-list.vue";
export default {
  components: { topoEdit, TopoList },
  data() {
    return {
        outerVisible: false,
        innerVisible: false,
      isEdit: false,
      topoObj:null,
    };
  },
  created() {
    
  },
  mounted() {},
  methods: {
    hideEdit() {
      this.isEdit = false;
    },
    editTopo(topo){
      this.topoObj = topo;
      this.isEdit = true;
    },
    addTopo() {
      this.topoObj = {
        TOPO_NAME: "",
        TOPO_CODE: "",
        TOPO_TYPE: "",
        TOPO_DATA: "",
        TOPO_IMAGE: "",
        SHOW_TYPE:"0",
      }
      this.isEdit = true;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>