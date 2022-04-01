<template>
	<div class="poppop" v-if="showPop">
		<div :class="
        showWidth
          ? 'widthShort pop-box pop-bg pop-border'
          : 'width pop-box pop-bg pop-border'
      ">
			<div class="pop-title flex-between">
				<div>
					{{ popTitle }}
				</div>
				<div @click="hidePop">
					<i class="el-icon-close"></i>
				</div>
			</div>
			<div>
				<slot></slot>
			</div>
			<div style="height: 80px"></div>
			<div class="pop-footer" v-if="showFoot == '1'">
				<tis-button class="pop-btn" type="primary" v-if="active != '3'" @click="confirmClick('1')">下一步</tis-button>
				<tis-button class="pop-btn" type="primary" v-if="active == '3'" @click="hidePop">关闭</tis-button>
				<tis-button class="pop-btn" type="primary" v-if="active != '1'" @click="confirmClick('2')">上一步</tis-button>
			</div>
			<div class="pop-footer" v-else-if="showFoot == '2'">
				<tis-button class="pop-btn" type="primary" @click="hidePop">关闭</tis-button>
				<tis-button class="pop-btn" type="primary" @click="confirmClick('0')">审核成功</tis-button>
				<tis-button class="pop-btn" type="danger" @click="confirmClick('1')">驳回</tis-button>
			</div>
			<div class="pop-footer" v-else-if="showFoot === 'footerslot'">
				<slot name="footer"></slot>
			</div>
			<div class="pop-footer" v-else>
				<tis-button class="pop-btn" type="danger" v-if="!disabled" @click="confirmClick">确定</tis-button>
				<tis-button class="pop-btn" type="primary" @click="hidePop">关闭</tis-button>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		props: ["popTitle", "isShow", "disabled", "showFoot", "active", "showWidth"],
		data() {
			return {
				showPop: false,
			};
		},
		created() {},
		mounted() {
			//监听键盘按键事件
			let self = this;
			this.$nextTick(function() {
				document.addEventListener("keyup", function(e) {
					if (e.keyCode == 27) {
						self.close();
					}
				});
			});
		},
		watch: {
			isShow(newShow) {
				this.showPop = newShow;
			},
		},
		methods: {
			close() {
				this.$emit("close");
			},
			confirmClick(sum) {
				this.$emit("confirm", sum);
			},
			hidePop() {
				this.$emit("close");
			},
		},
	};
</script>
<style lang='scss' scoped>
	.poppop {
		width: 100vw;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.widthShort {
		width: 500px;
		left: calc(50% - 500px / 2);
	}

	.width {
		width: 1000px;

		left: calc(50% - 1000px / 2);
	}

	.pop-box {
		position: absolute;
		min-height: 400px;
		top: 30px;
		border-radius: 5px;
		padding: 16px;
	}

	.pop-title {
		padding: 0 16px 16px;
		font-size: var(--pop-title-size);
	}

	.pop-footer {
		display: flex;
		position: absolute;
		flex-direction: row-reverse;
		bottom: 16px;
		right: 0;
	}

	.pop-footer .pop-btn {
		margin-right: 16px;
	}
</style>
