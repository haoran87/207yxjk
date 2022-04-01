<template>
  <div
    class="self-table"
    :class="checkable ? 'checkable' : 'sortbale'"
    style="width: 100%"
  >
    <div class="self-table-cell table-title">
      <div class="selection-cell cell" v-if="checkable">
        <choose-radio
          :ischecked="isAll"
          @radioClick="chooseAll()"
        ></choose-radio>
      </div>
      <div class="sort-cell cell" v-if="!hidesort">序号</div>
      <div class="cell" :class="v.class" v-for="(v, k) in tableObj" :key="k">
        <div @click="sortClick(k)">
          {{ v.lable }}
          <span v-if="v.sortable">
            <i class="el-icon-sort-up sort-do" v-if="v.sortable === 'asc'"></i>
            <i
              class="el-icon-sort-down sort-do"
              v-else-if="v.sortable === 'desc'"
            ></i>
            <i class="el-icon-sort" v-else></i>
          </span>
        </div>
      </div>
    </div>
    <div :style="contStyle" ref="tableScroll">
      <div
        class="self-table-cell table-con"
        v-for="(item, idx) in tableData"
        :key="idx"
      >
        <div class="selection-cell cell" v-if="checkable">
          <choose-radio
            :ischecked="chooseArr.includes(idx)"
            @radioClick="chooseSingle(idx, item)"
          ></choose-radio>
        </div>
        <div class="sort-cell cell" v-if="!hidesort">{{ idx + 1 }}</div>
        <div class="cell" :class="v.class" v-for="(v, k) in tableObj" :key="k">
          <tis-popover
            v-if="!v.slot"
            :disabled="!v.showPop"
            placement="top-start"
            width="200"
            trigger="hover"
            :content="item[k]+''"
          >
            <div slot="reference">
              {{ item[k] }}
            </div>
          </tis-popover>

          <div v-else>
            <slot
              :name="k"
              :cellData="item"
              :cellKey="k"
              :cellValue="item[k]"
            ></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChooseRadio from "@/components/page/choose-radio.vue";
export default {
  props: ["tableData", "tableObj", "checkable", "hidesort", "tableHeight"],
  components: {
    ChooseRadio,
  },
  data() {
    return {
      chooseArr: [],
      isAll: false,
      idData: [],
      data: [],
      contStyle: {},
    };
  },
  created() {
    if (this.tableHeight) {
      this.contStyle = {
        "overflow-y": "scroll",
        height: `calc(${this.tableHeight}px - 4vw)`,
      };
    }
  },
  methods: {
    sortClick(sortKey) {
      if (!this.tableObj[sortKey].sortable) return;
      for (let k in this.tableObj) {
        if (k !== sortKey && this.tableObj[k].sortable) {
          this.tableObj[k].sortable = true;
        }
      }
      let str;
      switch (this.tableObj[sortKey].sortable) {
        case "asc":
          str = "desc";
          break;
        case "desc":
          str = true;
          break;
        default:
          str = "asc";
      }
      // console.log(sortKey, str);
      this.tableObj[sortKey].sortable = str;
      this.$emit("sortClick", {
        sortKey: sortKey,
        sortType: str === true ? "" : str,
      });
    },
    initChoose() {
      this.chooseArr = [];
      this.idData = [];
      this.data = [];
      this.isAll = false;
    },
    chooseAll() {
      if (this.isAll) {
        this.chooseArr.splice(0, this.chooseArr.length);
        this.idData.splice(0, this.idData.length);
        this.data.splice(0, this.data.length);
        this.isAll = false;
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          if (!this.chooseArr.includes(i)) {
            this.chooseArr.push(i);
            this.idData.push(this.tableData[i].id);
            this.data.push(this.tableData[i]);
          }
        }
        this.isAll = true;
      }
    },
    chooseSingle(idx, item) {
      if (this.chooseArr.includes(idx)) {
        this.chooseArr.splice(this.chooseArr.indexOf(idx), 1);
        this.idData.splice(this.idData.indexOf(idx), 1);
        this.data.splice(this.data.indexOf(idx), 1);
      } else {
        this.chooseArr.push(idx);
        this.idData.push(item.id);
        this.data.push(item);
      }
      this.isAll = true;
      for (let i = 0; i < this.tableData.length; i++) {
        if (!this.chooseArr.includes(i)) {
          this.isAll = false;
          break;
        }
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.yqxxkjPad {
  .self-table {
    --sort-width: 3.2vw;
  }
}
.checkable {
  --tdm: calc(100% - 16px - var(--sort-width) - var(--selected-width));
}

.sortable {
  --tdm: calc(100% - 16px - var(--sort-width));
}

.tabel-col-1 {
  width: calc(var(--tdm) * 0.1 - 8px);
}

.tabel-col-2 {
  width: calc(var(--tdm) * 0.2 - 8px);
}

.tabel-content-center{
  text-align:center !important;
}
.tabel-content-right{
  text-align:right !important;
}

.tabel-col-3 {
  width: calc(var(--tdm) * 0.3 - 8px);
}

.tabel-col-4 {
  width: calc(var(--tdm) * 0.4 - 8px);
}

.tabel-col-5 {
  width: calc(var(--tdm) * 0.5 - 8px);
}

.tabel-col-6 {
  width: calc(var(--tdm) * 0.6 - 8px);
}

.tabel-col-7 {
  width: calc(var(--tdm) * 0.7 - 8px);
}

.tabel-col-8 {
  width: calc(var(--tdm) * 0.8 - 8px);
}

.tabel-col-9 {
  width: calc(var(--tdm) * 0.9 - 8px);
}

.sort-do {
  color: var(--hover-color);
}
</style>
