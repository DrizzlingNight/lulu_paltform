import { mapGetters } from "vuex";

export default {
    name: "login",
    data(){
        return {
            isRotated:false,
            isLandscape:false
        }
    },
    computed: {
        // ...mapGetters(['currentGame']),

    },
    watch:{
        $route(){
            this.update();
        },
        // isPc(){
        //     this.update();
        // },
        // games(){
        //     this.update();
        // }
    },
    mounted() {
        this.update();
        window.addEventListener("resize", ()=>{this.update()}, false);
    },
    beforeDestroy() {
        // 移除監聽
        window.removeEventListener("resize", ()=>{this.update()}, false);
    },
    methods:{
        update(){
        //     this.isLandscape = window.innerWidth > window.innerHeight;
        //     if (this.isPc || !this.games || !this.games.length || !this.$route.path.includes("/game/")){this.isRotated = false; return}
        //     if (document.documentElement.clientWidth > document.documentElement.clientHeight) {this.isRotated = false; return}

        //     if(!this.currentGame)
        //         this.isRotated = false;
        //     else
        //         this.isRotated = this.currentGame.isrotated;
        //     console.log("isRotated",this.currentGame,this.isrotated);
        }
    }
};
