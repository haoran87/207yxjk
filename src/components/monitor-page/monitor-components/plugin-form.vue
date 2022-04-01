<template>
	<div>
    <tis-form ref="form" :model="pluginObj" label-width="100px">
      <tis-form-item
          label="插件标识"
          prop="code"
          :rules="[
            { required: true, validator:validateCode, trigger: 'change' },
          ]"
      >
        <tis-input v-model.trim="pluginObj.code" placeholder="请输入插件标识"   maxlength="50" show-word-limit></tis-input>
      </tis-form-item>

      <tis-form-item
          label="插件名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入插件名称', trigger: 'change' },
          ]"
      >
        <tis-input v-model.trim="pluginObj.name" placeholder="请输入插件名称"  maxlength="50" show-word-limit></tis-input>
      </tis-form-item>

      <tis-form-item
          label="应用类型"
          prop="type"
          :rules="[
            { required: true, message: '请输入选择应用类型', trigger: 'change' },
          ]"
      >
        <tis-select filterable allow-create v-model="pluginObj.type" placeholder="请选择应用类型" style="width: 100%">
          <tis-option v-for="(item, idx) in typeList" :key="idx" :label="item.name" :value="item.code">
          </tis-option>
        </tis-select>
      </tis-form-item>

      <tis-form-item
          label="插件"
          prop="f"
          :rules="[
            { required: true,validator: validateFile, trigger: 'change' },
          ]"
      >
        <drag-upload :dragInputId="'pluginDrag'" :fileName="pluginStr" :upTip="'拖到或点击这里上传插件'" @dragClick="dragClick('pluginDrag')"
                     @dragUpLoad="iconChoose($event, 1)" @delFile="delFile('plugin')"></drag-upload>
      </tis-form-item>

      <tis-form-item
          label="启动脚本"
      >
        <drag-upload :dragInputId="'shellDrag'" :fileName="pluginObj.script" :upTip="'拖到或点击这里上传启动脚本'" @dragClick="dragClick('shellDrag')"
                     @dragUpLoad="iconChoose($event, 2)" @delFile="delFile('script')"></drag-upload>
      </tis-form-item>


      <tis-form-item
          label="图标"
      >
        <click-upload style="float: left" ref="imgup" :fileName="pluginIcon" :filePath="iconPath" :inputId="'iconInput'" @upLoad="iconChoose($event, 3)"
                      @delImg="delImg()">
          <div class="icon-btn">
            <tis-button type="primary" :plain="true" icon="el-icon-upload" @click="iconClicked">
              上传图标
            </tis-button>
          </div>
        </click-upload>
      </tis-form-item>

      <tis-form-item
          label="描述"
          prop="description"
      >
        <tis-input type="textarea"  maxlength="200"
                   show-word-limit :autosize="{ minRows: 4, maxRows: 4 }" placeholder="请输入描述内容" v-model="pluginObj.description">
        </tis-input>
      </tis-form-item>

    </tis-form>
  </div>
</template>
<script>
	import dragUpload from "../../page/drag-upload.vue";
	import ClickUpload from "../../page/click-upload.vue";
	export default {
		props: ["formData","showPop"],
		components: {
			dragUpload,
			ClickUpload
		},
    watch:{
      showPop(val){
        if (val){
          if (this.$refs['form']!==undefined) {
            // 清除表单内容和清除表单验证消息
            this.$refs['form'].resetFields();
          }
        }

      }
    },
		data() {
			return {
				imgType: "image/jpeg,image/png,image/jpg,image/svg+xml",
				shellFileName: "",
				pluginFileName: "",
				iconPath: "", //图表显示的路径
				typeList: [{
					code: "server",
					name: "服务"
				}, {
					code: "script",
					name: "脚本"
				}],
				pluginObj: {},
				validObj: {
					code: "请输入插件标识",
					name: "请输入插件名称",
					type: "请选择插件类型",
					plugin: "请上传插件文件",
					// script: "请上传启动脚本文件",
				},
			};
		},
		created() {
			this.initFormData()
			if (this.formData) {
			  Object.assign(this.pluginObj, this.formData);
			}
		},
		mounted() {
			if (this.pluginObj.icon) {
				this.iconPath = this.$store.state.yqInfo.serverIp + "/insight/plugin/download/" + this.pluginObj.icon
			} else {
				this.iconPath = ""
			}
		},
		computed: {
			pluginScript() {
				if (this.pluginObj.script) {
					let arr = this.pluginObj.script.split("/");
					return arr[arr.length - 1];
				} else {
					return "";
				}
			},
			pluginStr() {
				if (this.pluginObj.plugin) {
					let arr = this.pluginObj.plugin.split("/");
					return arr[arr.length - 1];
				} else {
					return "";
				}
			},
			pluginIcon() {
				if (this.pluginObj.icon) {
					let arr = this.pluginObj.icon.split("/");
					return arr[arr.length - 1];
				} else {
					return "";
				}
			},
		},
		methods: {
      validateCode(rule, value, callback){
        if (value == "" || value == undefined) {
          callback(new Error("请输入插件标识"));
        }
        var a=/[^a-zA-Z-0-9-_-]/g
        if (a.test(value)) {
          callback(new Error("只可输入英文数字和 '-'  '_' 字符"));
        }
        callback();
      },
      //校验文件
      validateFile(rule, value, callback) {
        if (this.pluginObj.plugin == "" || this.pluginObj.plugin == undefined) {
          return callback(new Error("请选择插件"));
        }
        return callback();
      },
			initFormData() {
				this.pluginObj = {
					name: "",
					code: "",
					type: "",
					plugin: "",
					script: "",
					icon: "",
					description: "",
				}
			},
			delFile(key) {
				this.pluginObj[key] = "";
			},
			//删除图片
			delImg() {
				this.pluginObj.icon = "";
				this.iconPath = ""
			},
			dragClick(id) {

				document.getElementById(id).click();
			},
			iconClicked() {

				document.getElementById("iconInput").click();
			},
			iconChoose(e, key) {

				var file = e;
				console.log("上传图片", file);
				//   var iconImgsize = file.size;
				//   this.isUpIcon = true;
				if (key == 3) {
					var iconImgtype = file.type;
					let imgType = this.imgType;
					if (!iconImgtype || imgType.indexOf(iconImgtype) == -1) {
						//   this.$refs.imgup.isUpIcon = false;
						this.$message.error("请选择正确的格式,jpg,png,svg");
						return;
					}
				}
				let formData = new FormData();
				formData.append("file", file);
				formData.append("filename", this.pluginObj.code);
				formData.append("fileKey", key); //文件的分类标识（1服务，2脚本，3图标）
				this.$yqLoading.show("正在上传文件");
				this.$api
					.postServerAction("/insight/fileUpload/uploadFile", formData)
					.then(
						(res) => {
							//   this.$refs.imgup.isUpIcon = false;
							this.$yqLoading.hide();
							if (res.code == 200) {
								if (key == 1) {
									this.pluginObj.plugin = res.data;
								} else if (key == 2) {
									this.pluginObj.script = res.data;
								} else {
									this.pluginObj.icon = res.data; //接口正常换到返回值的地方
									this.iconPath =
										this.$store.state.yqInfo.serverIp +
										"/insight/plugin/download/" +
										res.data;
								}
							} else {
								this.$message.error(res.info);
							}
							console.log("上传文件返回", res);
						},
						() => {
							this.$yqLoading.hide();
						}
					);
			},
      validateSubmit(){
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$emit("submit")
          }
        })
      },
		},
	};
</script>
<style lang="scss" scoped>
	.f-item {
		display: flex;
		align-items: center;
		margin-bottom: 16px;
	}

	.f-item-basic {
		align-items: start;
	}

	.f-label {
		width: 20%;
		text-align: right;
		margin-right: 16px;
	}

	.f-body {
		width: 60%;
	}

	.pop-body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 32px;
	}

	.icon-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60px;
	}
</style>
