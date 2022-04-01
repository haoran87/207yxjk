# sub_app_example

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### less 变量全局引入 step1
npm i style-resources-loader vue-cli-plugin-style-resources-loader -D

### 配置vue.config.js step2
pluginOptions: {
      'style-resources-loader': {
        'preProcessor': 'less',
        'patterns': [
          path.resolve(__dirname, './src/assets/yq.less'),
        ]
      }
    }


### self-table 使用说明
<self-table ref="selfTable" :tableData="tableData" :tableObj="tableObj" @sortClick="sortClick"  >
            <template v-slot:procId='props'> 
              {{ props.cellData == 2 ? "进行中" : "已挂起" }}
            </template>
  </self-table>
tableData 列表数据
tableObj  列表要展示字段
  tableObj: {
        procId: { //字段
          slot: false, //字段显示样式是否自定义  自定义props 返回值 cellKey 字段名 cellValue 字值         //cellData 字段父对象
          lable: "进程ID",  //表头内容
          class: "tabel-col-1",//字段width   1-10
          sortable:true, // 该字段是否添加排序功能
        },
  }

  sortClick //排序字段点击事件 事件值为 {
        sortKey: sortKey,
        sortType: str,
      }
  checkable //是否显示选择器
  hidesort //隐藏序号

  //通过this.$ref.selfTable.idData 获取选中数据id



  ### 页面路由跳转使用
  this.$navigateTo(id,pageData)  //要跳转的页面id    要向页面传的参数 obj
  在跳转的页面 中 通过 this.$pageData() 获取 页面传入的参数