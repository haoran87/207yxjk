<template>
    <div>
        <div id="eddd" ref="editor" style="text-align:left;"></div>
    </div>
</template>

<script>
    import E from 'wangeditor'
export default {
  data() {
    return {
      editor: null,
      info_: null,
      isChange: false
    };
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: function () {
      if (!this.isChange) {
        this.editor.txt.html(this.value);
      }
      this.isChange = false;
    }
  },
  mounted() {
    this.setDditor()
    this.editor.txt.html(this.value)
  },
  methods: {
    //设置不可编辑
    noEdit() {
      this.editor.$textElem.attr('contenteditable', false);	//设置不可编辑
    },
    //设置编辑器
    setDditor() {
      this.editor = new E(this.$refs.editor);
      // 上传图片到服务器
      this.editor.config.uploadImgServer = this.$store.state.yqInfo.serverIp + '/insight/file/create?type=3'
      //隐藏网络图片tab
      this.editor.config.showLinkImg = false
      //设置文件上传的参数名称
      this.editor.config.uploadFileName = 'uploadFile'
      // 将图片大小限制为 10M
      this.editor.config.uploadImgMaxSize = 10 * 1024 * 1024
      //自定义上传图片事件
      this.editor.config.debug = true
      let ip = this.$store.state.yqInfo.serverIp
      this.editor.config.uploadImgHooks = {
        customInsert: function (insertImg, result) {
          console.log(result)
          if (result.success) {
            insertImg(ip + "/insight/file/download/" + result.data);
          }
        }
      };

      // 配置菜单
      this.editor.config.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'undo', // 撤销
        'redo', // 重复
      ]
      this.editor.config.showFullScreen = true
      this.editor.config.onchange = (html) => {
        this.isChange = true;
        this.info_ = html // 绑定当前逐渐地值
        this.$emit('change', this.info_) // 将内容同步到父组件中
      }
      // 创建富文本编辑器
      this.editor.create()
    }
  }
}
</script>
<style>

.w-e-menu {
  z-index: 2 !important;
}

.w-e-text-container {
  z-index: 1 !important;
}
#eddd .w-e-toolbar, .w-e-text-container, .w-e-menu-panel{
  background-color: #000000 !important;
}
</style>
