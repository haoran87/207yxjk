import {MOBILEROUTERS} from "@/router/router.config"
export const menuMixins = {
    components:{
        MenuPop:() =>import("@/mobile/mobileModules/menuMobile.vue")
    },
    data(){
        return{
            menus:MOBILEROUTERS
        }
    },
    methods:{
        showMenu(){
            this.$refs.menuPop.show =true;
        },
        hideMenu(){
            this.$refs.menuPop.show =false;
        }
    }
}