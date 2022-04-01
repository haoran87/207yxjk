<template>
    <div class="float_button">
        <div
            @click="onBtnClicked"
            ref="floatButton"
            class="float_info"
            :style="{'width': itemWidth + 'px', 'height': itemHeight + 'px', 'left': left + 'px', 'top': top + 'px'}"
        >
            <m-icon name="play" size="24" color="#fff"/>
            <!-- <span class="text">{{ text }}</span> -->
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            clientWidth: 0,
            clientHeight: 0,
            timer: null,
            currentTop: 0,
            left: 0,
            top: 0,
        }
    },
    props: {
        text: {                 // 按钮文本内容
            type: String,
            default: "菜单"
        },
        itemWidth: {            // 悬浮按钮宽度
            type: Number,
            default: 24
        },
        itemHeight: {           // 悬浮按钮高度
            type: Number,
            default: 50
        },
        gapWidth: {             // 距离左右两边距离     
            type: Number,
            default: 0
        },
        coefficientHeight: {    // 从上到下距离比例
            type: Number,
            default: 0.5
        }
    },
    created() {
        this.clientWidth = document.documentElement.clientWidth
        this.clientHeight = document.documentElement.clientHeight
        this.left = this.clientWidth - this.itemWidth - this.gapWidth
        this.top = this.clientHeight * this.coefficientHeight - (this.itemHeight/2)
    },
    methods: {
        onBtnClicked(){
            this.$emit("menuClick")
        },
        handleScrollStart() {
            this.timer && clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.handleScrollEnd()
            }, 300)
            this.currentTop = document.documentElement.scrollTop || document.body.scrollTop
            if(this.left > this.clientWidth / 2) {
                this.left = this.clientWidth - this.itemWidth / 2
            } else {
                this.left = -this.itemWidth / 2
            }
        },
        handleScrollEnd(){
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            if(scrollTop === this.currentTop) {
                if(this.left > this.clientWidth/2) {
                    this.left = this.clientWidth - this.itemWidth - this.gapWidth
                } else {
                    this.left = this.gapWidth
                }
                clearTimeout(this.timer)
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            const floatButton = this.$refs.floatButton
            floatButton.addEventListener("touchstart", () => {
                floatButton.style.transition = 'none'
            })
            
            // 在拖拽的过程中，组件应该跟随手指的移动而移动。
            floatButton.addEventListener("touchmove", (e) => {
                if (e.targetTouches.length === 1) {         // 一根手指
                    let touch = e.targetTouches[0]
                    this.left = touch.clientX - 20
                    this.top = touch.clientY - 25
                }
            })
            
			// 拖拽结束以后，重新调整组件的位置并重新设置过度动画。
            floatButton.addEventListener("touchend", () => {
                floatButton.style.transition = 'all 0.3s'
                if(this.left > document.documentElement.clientWidth / 2) {
                    this.left = document.documentElement.clientWidth - 24
                }else{
                    this.left = 0
                }
                if(this.top <0){
                    this.top = 0;
                }
                else if(this.top > document.documentElement.clientHeight - this.itemHeight){
                     this.top =document.documentElement.clientHeight - this.itemHeight
                }
            })
        })
    },
    beforeDestroy(){
        // 添加监听页面滚动
        window.removeEventListener('scroll', this.handleScrollStart)
    },
    destroyed() {}
}
</script>
<style lang="less">
.float_button {
    .float_info{
        color: #666666;
        transition: all 0.3s;
        position: fixed;
        right: 0;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        z-index: 999;
        background: var(--color-6);
        opacity: 0.8;
        border-radius: 5px;
        .text{
            font-size: 14px;
            color: var(--text-color);
        }
        // img{
        //     width: 44px;
        //     height: 44px;
        // }
    }
}
</style>

