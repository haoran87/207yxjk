<template>
  <tis-table
    ref="tableScroll"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%"
    :height="tableHeight + 'px'"
    @selection-change='selectEvent'
  >
    <tis-table-column v-if="checkable" type="selection" width="55">
    </tis-table-column>
    <tis-table-column v-if="!hidesort" label="序号" type="index" width="50">
    </tis-table-column>
    <tis-table-column
      v-for="(item, k) in tableObj"
      :key="k"
      :label="item.lable"
      :prop="k"
      :sortable="item.sortable"
    >
      <template slot-scope="scope">
        <slot
          v-if="item.slot"
          :name="k"
          :cellData="scope.row"
          :cellKey="k"
          :cellValue="scope.row[k]"
        ></slot>
        <div v-else>{{ scope.row[k] }}</div>
      </template>

      <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
    </tis-table-column>
  </tis-table>
</template>
<script>
export default {
  props: ["tableData", "tableObj", "checkable", "hidesort", "tableHeight"],
  data() {
    return {
      isAll: false,
      idData: [],
      contStyle: {},
    };
  },
  created() {
    console.log("表格对象啊啊", this.tableObj);
  },
  methods: {
    selectEvent(selection){
        this.idData = [];
        selection.forEach(element => {
            this.idData.push(element.id);
        });
        console.log("选择单行数据",selection, this.idData)
    },
    initChoose(){
        
    }
  },
};
</script>