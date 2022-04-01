<template>
    <div class="widget">
        <h1>test........</h1>
        <div
                v-for="(m, index) in list"
                :key="index"
                class="message"
                :class="m.level"
                @click="onClick(m)"
        >
            <div class="title">
                {{ m.title }}
            </div>
            <div class="description">
                {{ m.description }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            params: Object
        },
        created() {
            console.log("浮窗组件接收到的打开参数为", this.params,this.$tis);
            this.off = this.$tis.$on("message",{ system: true }, this.onMessage);
        },
        data() {
            return {
                list: [],
            };
        },
        methods: {
            onClick(m) {
                console.log(m);
                this.$tis.openApp(m.appId, m);
            },
            onMessage(payload) {

                // console.log(payload);
                this.list.unshift(payload);
            }
        },
        beforeDestroy() {
            this.off ? this.off() :'';
        }
    };
</script>

<style lang="scss" scoped>
    .widget {
        background: rgba(0, 0, 0, 0.86);
        color: #fff;
        width: 348px;
        height: 270px;
        overflow: scroll;
        .message {
            cursor: pointer;
            &.urgency {
                background-image: linear-gradient(
                                90deg,
                                rgba(255, 0, 0, 0.26) 0%,
                                rgba(255, 255, 255, 0) 100%
                );
            }
            padding: 15px;
            .title {
                font-size: var(--text-size-small);
                margin-bottom: 5px;
            }
            .description {
                font-size: var(--text-size-light);
            }
        }
    }
</style>
