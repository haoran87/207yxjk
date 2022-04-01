<template>
  <div
    class="mobile-table"
    :class="checkable ? 'checkable' : 'sortbale'"
    style="width: 100%;font-size:14px"
  >
    <div class="mobile-table-m-title flex">
      <div class="selection-m-cell m-cell" v-if="checkable">
        <choose-radio
          :ischecked="isAll"
          @radioClick="chooseAll()"
        ></choose-radio>
      </div>
      <div class="sort-m-cell m-cell" v-if="!hidesort">序号</div>
      <div class="flex flex-between" :style="rStyle">
        <div
          class="m-cell"
           :class="v.class"
           :style="{ width: `calc(${v.width} - 4px)` }"
          v-for="(v, k) in tableObj"
          :key="k"
        >
          <div @click="sortClick(k)">
            {{ v.lable }}
            <span v-if="v.sortable">
              <i
                class="el-icon-sort-up sort-do"
                v-if="v.sortable === 'asc'"
              ></i>
              <i
                class="el-icon-sort-down sort-do"
                v-else-if="v.sortable === 'desc'"
              ></i>
              <i class="el-icon-sort" v-else></i>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div :style="contStyle" ref="tableScroll">
      <div
        class="mobile-table-m-cell flex"
        :class="{'m-cell-bg':idx % 2 == 0}"
        v-for="(item, idx) in tableData"
        :key="idx"
      >
        <div class="selection-m-cell m-cell" v-if="checkable">
          <choose-radio
            :ischecked="chooseArr.includes(idx)"
            @radioClick="chooseSingle(idx, item)"
          ></choose-radio>
        </div>
        <div class="sort-m-cell m-cell" v-if="!hidesort">{{ idx + 1 }}</div>
        <div class="flex flex-between" :style="rStyle">
          <div
            class="m-cell"
            :class="v.class"
            :style="{ width: `calc(${v.width} - 4px)` }"
            v-for="(v, k) in tableObj"
            :key="k"
          >
            <tis-popover
              v-if="!v.slot"
              :disabled="!v.showPop"
              placement="top-start"
              width="200"
              trigger="hover"
              :content="item[k] + ''"
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
                :idx='idx'
              ></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChooseRadio from "@/components/page/choose-radio.vue";
export default {
  components: {
    ChooseRadio,
  },
  props: [
    "tableData",
    "tableObj",
    "checkable",
    "hidesort",
    "tableHeight",
    "swipeRight",
  ],
  data() {
    return {
      chooseArr: [],
      isAll: false,
      idData: [],
      data: [],
      contStyle: {},
      rStyle: {},
    };
  },
  created() {
    if (this.tableHeight) {
      this.contStyle = {
        "overflow-y": "scroll",
        height: `calc(${this.tableHeight}px - 34px)`,
      };
    }
   
    if (this.checkable && !this.hidesort) {
      this.rStyle = {width:"calc(100% - 56px)"};
    } else if (this.checkable) {
      this.rStyle = { width: `calc(100% - 20px)` };
    } else if (!this.hidesort) {
      this.rStyle = { width: `calc(100% - 36px)` };
    }
  },
  mounted() {},
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
.mobile-table {
  .m-cell {
    margin-right: 4px;
    line-height: 34px;
    text-align: left;
    overflow: hidden;
      word-break:break-all;
    display:-webkit-box;
    -webkit-line-clamp:1;
    -webkit-box-orient:vertical;
  }
  .m-cell-bg{
      background-color: var(--layout-bg-1);
  }
  .sort-m-cell {
    width: 32px;
  }
  .selection-m-cell {
    width: 16px;
    height: 16px;
  }
  .mobile-table-m-title {
    width: 100%;
  }
  .mobile-table-m-cell {
    width: 100%;
  }
  .cell-text-center{
      text-align:center;
  }
}
</style>