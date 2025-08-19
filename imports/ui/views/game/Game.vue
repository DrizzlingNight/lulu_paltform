<template>
    <div>
        <div v-if="loading" class="game-wrap">
        </div>
        <keep-alive>
            <component :is="gameComponent"></component>
        </keep-alive>
    </div>

</template>

<script>
    import cocos from './cocos/index.vue'

    export default {
        name: 'game',
        data() {
            return {
                loading: true,
                color: "#6657ff",
                size: "15px",
                gameComponent: null,

            };
        },
        created() {
            const gameId = 'market'
            const active = true
            Meteor.call('getGame', gameId, active, (err, games) => {
                let haveMarket = false
                if (games && games.length > 0) {
                    games.forEach(g => {
                        haveMarket = g._id === 'market'
                    });
                }
                if (haveMarket) {
                    this.gameComponent = cocos
                } else {
                    this.$router.replace('/home')
                }
            })
        },
        mounted () {
            this.logEvent('enter_game')
            // this.$store.commit('SET_IS_LOADED_GAME', true)
            localStorage.setItem('isLoadedGame', true)
        }

    }
</script>

<style lang="scss" scoped>
    .game-wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        margin-top: 300px;
    }
</style>

<style lang="scss">
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }
</style>