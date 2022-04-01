<template>
	<div>
		<div class="flex" style="margin-bottom: 16px;">
			<click-upload :inputId="'bgInput'" @upLoad="imgChoose($event, 'topo_bg')">
				<tis-button round type="primary" @click="uploadImgClicked('bgInput')">
					上传背景图片
				</tis-button>
			</click-upload>
		</div>
		<div class="topo-bg-box">
			<div class="flex" style="flex-wrap: wrap">
				<div class="bg-img" v-for="(img, idx) in topoBgList" :key="idx" ref="bgImg">
					<img :style="imgStyle" :src="
                $store.state.yqInfo.serverIp +
                '/insight/file/download/' +
                img.FILENAME
              "
					 alt="" />
					<div class="bg-del" @click.stop="delTopoBg(img, 'topo_bg')">
						<i class="el-icon-delete"></i>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import ClickUpload from "../../page/click-upload.vue";
	import bus from "@/utils/bus";
	export default {
		components: {
			ClickUpload
		},
		props: [],
		data() {
			return {
				topoBgList: [],
				imgStyle: {
					width: '90%',
					height: '90%'
				}
			};
		},
		created() {
			this.getImgList("topo_bg");
		},
		mounted() {

		},
		methods: {
			bgOK() {
				this.$emit('bgOk')
			},
			delBg() {
				bus.$emit("topo-handle", {
					name: "clearBg",
				});
			},
			getImgList(imgType) {
				this.$yqLoading.show();
				this.$api
					.getServerAction("/insight/file/getFileList", {
						type: imgType
					})
					.then((res) => {
						this.$yqLoading.hide();
						if (res.code == 200) {
							if (imgType == "topo_bg") {
								this.topoBgList = res.data;
								setTimeout(() => {
									this.imgStyle.width =
										(this.$refs['bgImg'][0].clientWidth / 10) * 8;
									this.imgStyle.height =
										(this.imgStyle.width / this.$store.state.yqInfo.TOPOWITH) *
										this.$store.state.yqInfo.TOPOHEIGHT +
										"px";
									this.imgStyle.width += 'px'
								}, 1)
							}
						}
					});
			},
			imgChoose(e, key) {
				var file = e;
				var iconImgtype = file.type;
				let imgType = "image/jpeg,image/png,image/jpg";
				if (!iconImgtype || imgType.indexOf(iconImgtype) == -1) {
					this.$message.error("请选择正确的格式,jpg,png");
					return;
				}
				let formData = new FormData();
				formData.append("uploadFile", file);
				formData.append("type", key);
				this.$yqLoading.show("正在上传图片", formData);
				console.log("上传背景图片的参数", formData);
				this.$api.postServerAction("/insight/file/create", formData).then(
					(res) => {
						this.$yqLoading.hide();
						if (res.code == 200) {
							this.$message.success("上传成功！");
							this.getImgList(key);
						} else {
							this.$message.error("上传失败！");
						}
					},
					() => {
						this.$yqLoading.hide();
					}
				);
			},
			uploadImgClicked(id) {
				console.log("选择图片时", document.getElementById(id).value);
				document.getElementById(id).value = "";
				document.getElementById(id).click();
			},
			delTopoBg(img, type) {
				console.log("删除背景图片222")
				this.$confirm('确定要删除这个背景吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(()=>{
					this.$api
					  .getServerAction("/insight/file/delete", { id: img.ID })
					  .then((res) => {
					    if (res.code == 200) {
					      this.$message.success("删除成功");
					      this.getImgList(type);
					    } else {
					      this.$message.success("删除失败");
					    }
					  });
				})
			
			},
		},
	};
</script>
<style lang="scss" scoped>
	.topo-bg-box {
		overflow-y: scroll;
		height: 60vh;
	}

	.bg-img {
		margin: 0 8px 16px;
		position: relative;
		border: var(--status-bar-tools-border);
		/* margin-right: 8px; */
		padding: 8px 0;
		width: calc(100% / 4 - 18px);
		/* height: 20vh; */
		display: flex;
		justify-content: center;
		align-items: center;
		
	}

	.bg-img .bg-del {
		position: absolute;
		right: 16px;
		top: 16px;
	}

	.bg-img .bg-del:hover {
		color: var(--hover-color);
	}
</style>
