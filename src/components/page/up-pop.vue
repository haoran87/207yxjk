<template>
  <div>
    <div class="pop bottom-bg" v-if="showPop">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: ["showPop"],
  data() {
    return {
      
    };
  },
  created() {
    
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped>
.pop {
  position: absolute;
  line-height: 1.25vw;
  bottom: 100%;
  padding: 16px 16px 0;
  left: -16px;
  width:100%;
}

</style>