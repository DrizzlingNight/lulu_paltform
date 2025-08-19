<template>
    <div>
        <v-container class="mb-0 mb-sm-10 ranking-container">
            <v-col class="mt-10">
                <v-row v-if="isShow.length === 1" class="d-flex flex-row align-center justify-center">
                    <div class="text-h4">{{topTitle}}</div>
                </v-row>
                <v-row v-if="isMobile && (isShowGrape || isShowInvite || isShowWinStreak) && isShowMint">
                    <v-tabs centered background-color="transparent" color="#fff" slider-color="#00FFCA" v-model="selectedTab">
                        <v-tab v-if="isShowMint" @click="clickTab(0)" style="color:#fff;">{{$t('home.ranking.miningBuyBack')}}</v-tab>
                        <v-tab v-if="isShowWinStreak" @click="clickTab(1)" style="color:#fff;">{{$t('home.ranking.winStreak')}}</v-tab>
                        <v-tab v-if="isShowGrape" @click="clickTab(2)" style="color:#fff;">{{$t('home.ranking.grape')}}</v-tab>
                        <v-tab v-if="isShowInvite" @click="clickTab(3)" style="color:#fff;">{{$t('home.ranking.invite')}}</v-tab>
                    </v-tabs>
                </v-row>
                <v-row v-if="!isMobile && (isShowGrape || isShowInvite || isShowWinStreak) && isShowMint" class="d-flex flex-row align-center justify-center">
                    <button
                        v-if="isShowMint"
                        @click="clickTab(0)"
                        :class="selectedTab === 0 ? 'tab-btn-selected' : 'tab-btn'">
                        {{$t('home.ranking.miningBuyBack')}}
                    </button>

                    <button
                        v-if="isShowWinStreak"
                        @click="clickTab(1)"
                        class="mx-3 mx-sm-5"
                        :class="selectedTab === 1 ? 'tab-btn-selected' : 'tab-btn'">
                        {{$t('home.ranking.winStreak')}}
                    </button>

                    <button
                        v-if="isShowGrape"
                        @click="clickTab(2)"
                        class="mx-3 mx-sm-5"
                        :class="selectedTab === 2 ? 'tab-btn-selected' : 'tab-btn'">
                        {{$t('home.ranking.grape')}}
                    </button>

                    <button
                        v-if="isShowInvite"
                        @click="clickTab(3)"
                        :class="selectedTab === 3 ? 'tab-btn-selected' : 'tab-btn'">
                        {{$t('home.ranking.invite')}}
                    </button>
                </v-row>

                <v-row class="d-flex flex-column align-center justify-center">
                    <div class="d-flex flex-row align-center justify-center mt-11">
                        <v-hover v-slot="{hover}">
                            <button @click="switchTime(-1)">
                                <v-img class="switch-img" :src="hover ? '/static/ui/home/ranking/left_selected.png' : '/static/ui/home/ranking/left.png'"></v-img>
                            </button>
                        </v-hover>

                        <div class="d-flex flex-row align-center justify-center mx-5 mx-sm-10">
                            <div class="font-sm-weight-bold font-regular text-h6 text-sm-h5">{{startTime + ' -- ' + endTime}}</div>
                        </div>

                        <v-hover v-slot="{hover}">
                            <button @click="switchTime(1)">
                                <v-img class="switch-img right-img" :src="hover ? '/static/ui/home/ranking/left_selected.png' : '/static/ui/home/ranking/left.png'"></v-img>
                            </button>
                        </v-hover>
                    </div>

                    <div v-if="countDownTime.length > 0" class="d-flex flex-row align-center justify-center">
                        <v-img max-height="20px" max-width="20px" src="/static/ui/home/ranking/time.png"></v-img>
                        <div class="ml-2 text-subtitle-1">{{countDownTime}}</div>
                    </div>

                </v-row>

                <v-row class="my-10 d-flex justify-center">
                    <v-card class="list-wrapper mx-3 mx-md-8 mx-lg-0" :height="isMobile ? '560px' : '660px'">

                        <v-simple-table style="background-color:transparent;">
                            <thead v-if="!isMobile" style="width:100%;background-color:#00322E;height:60px;">
                                <tr>
                                    <th style="text-align:center">
                                        <div class="list-content">{{ $t('home.ranking.ranking')}}</div>
                                    </th>
                                    <th>
                                        <div class="list-content">{{ $t('home.ranking.player')}}</div>
                                    </th>
                                    <th style="text-align:start">
                                        <div class="list-content">{{ isShowMint ? $t('home.ranking.totalMining') : $t('home.ranking.winStreakCount')}}</div>
                                    </th>
                                    <th style="text-align:start">
                                        <div class="list-content">{{ isShowMint ? $t('home.ranking.buyBack') : $t('home.ranking.buyBack')}}</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody style="width:100%;">
                                <tr
                                v-for="(data, idx) in dataList"
                                :key="data.rank"
                                :style="{background : rankBackground(idx+1)}"
                                :height="isMobile ? '50px' : '60px'"
                                >
                                    <td>
                                        <div class="flex-center ml-n4 ml-sm-0">
                                            <v-img v-if="idx<3" max-height="48px" max-width="48px" width="48px" height="48px" :src="'/static/ui/home/ranking/rank_' + (idx+1) + '.png'"></v-img>
                                            <div v-else class="list-content text-h6 font-weight-bold;">{{ data.rank || (idx+1)}}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class=" ml-n5 ml-sm-0">
                                            <div class="list-content">{{data.showId || ''}}</div>
                                            <div class="d-flex d-sm-none flex-row align-center mt-1">
                                                <div v-if="data.number" style="font-size:10px;color:#D8D8D8;">{{ isShowMint ? $t('home.ranking.mining') : $t('home.ranking.winStreakCount')}}</div>
                                                <v-img v-if="isShowMint && data.number" class="mx-1" max-height="11px" max-width="11px" src="/static/ui/utils/coins/LUCK.svg"></v-img>
                                                <div class="list-content font-weight-bold" :class="isShowMint ? 'ml-0' : 'ml-1'">{{data.number || ''}}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td v-if="!isMobile" style="text-align:center">
                                        <div class="flex-start d-sm-flex d-none">
                                            <v-img v-if="isShowMint && data.number" max-height="24px" max-width="24px" src="/static/ui/utils/coins/LUCK.svg"></v-img>
                                            <div class="list-content ml-2">{{data.number || ''}}</div>
                                        </div>
                                    </td>
                                    <td v-if="!isMobile" style="text-align:center">
                                        <div class="d-sm-flex d-none justify-start">
                                            <v-img v-if="data.buyback_quota" max-height="24px" max-width="24px" src="/static/ui/utils/coins/LUCK.svg"></v-img>
                                            <div class="list-content ml-2">{{data.buyback_quota || ''}}</div>
                                        </div>
                                    </td>
                                    <td v-if="isMobile">
                                        <div class="d-flex d-sm-none flex-column align-end justify-center">
                                            <div class="d-flex d-sm-none flex-row align-center justify-center">
                                                <v-img v-if="data.buyback_quota" max-height="11px" max-width="11px" src="/static/ui/utils/coins/LUCK.svg"></v-img>
                                                <div class="list-content font-weight-bold ml-1">{{data.buyback_quota || ''}}</div>
                                            </div>
                                            <div v-if="isShowMint" style="font-size:10px;color:#D8D8D8;">{{data.buyback_quota ? $t('home.ranking.canBuyBack') : ''}}</div>
                                            <div v-else-if="data.buyback_quota" style="font-size:10px;color:#D8D8D8;">{{$t('home.ranking.reward')}}</div>
                                        </div>

                                    </td>

                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-card>
                </v-row>
            </v-col>
        </v-container>
    </div>
</template>

<script>

import moment from "moment";
import { dateFormat } from '/imports/utils/dateFormat'
import { settings } from "/imports/settings";

export default {
    name: 'Ranking',
    data() {
        return {
            selectedTab: 0,
            startTime: '',
            endTime: '',
            startTimestamp: '',
            endTimestamp: '',
            week: 0,
            countDownTime: '',
            dataList: [],
            timer: null,
        }
    },
    mounted () {
        // 默认前一周
        const lastWeek = moment().utc().startOf('week').unix()
        this.setBeginTime(lastWeek)
        this.countDown()

        this.getRankingList()

    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.name === 'xs'
        },
        isShowGrape() {
            return settings.display.home.showRanking.showGrape || false
        },
        isShowInvite() {
            return settings.display.home.showRanking.showInvite || false
        },
        isShowWinStreak() {
            return settings.display.home.showRanking.showWinStreak || false
        },
        isShowMint() {
            return settings.display.home.showRanking.showMint || false
        },
        isSafari() {
            const userAgent = navigator.userAgent;
            if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1) {
                return false
            } else if (userAgent.indexOf("Safari") > -1) {
                return true
            }
            return false
        },
        topTitle() {
            if (this.isShowMint && this.isShow.length === 1) {
                return this.$t('home.ranking.miningBuyBack')
            } else if (this.isShowWinStreak && this.isShow.length === 1) {
                return this.$t('home.ranking.winStreak')
            }
            return ''
        },
        isShow() {
            let show = []
            if (this.isShowMint) show.push(1)
            if (this.isShowWinStreak) show.push(1)
            if (this.isShowGrape) show.push(1)
            if (this.isShowInvite) show.push(1)
            return show
        },
    },
    methods: {
        clickTab(idx) {
            
            if (idx !== this.selectedTab) {
                this.dataList = []
                while(this.dataList.length < 10) {
                    this.dataList.push({})
                }
            }

            this.selectedTab = idx

            this.week = 0
            let week = moment().utc().startOf('week').unix()
            this.setBeginTime(week)
            this.countDown()
            this.getRankingList()
        },
        rankBackground(idx) {
            switch (idx) {
                case 0: return '#00322E'
                case 1: return '#A07D00'
                case 2: return '#005F7D'
                case 3: return '#007335'
                default: return idx % 2 === 0 ? '#00322E' : '#49877915'
            }
        },
        switchTime(switchWeek) {
            this.week += switchWeek
            if (this.week > 0) this.week = 0
            const begin = moment().utc().add('week', this.week).startOf('week').unix()
            if (this.week === 0) {
                this.countDown()
            } else {
                this.countDownTime = ''
                clearInterval(this.timer)
                this.timer = null
            }
            this.dataList = []
            while(this.dataList.length < 10) {
                this.dataList.push({})
            }
            this.setBeginTime(begin)
            this.getRankingList()
        },
        setBeginTime(begin) {
            if (begin > (new Date()).getTime() / 1000) {
                begin = moment().utc().startOf('week').unix()
            }
            this.startTimestamp = begin
            this.startTime = dateFormat(new Date(this.startTimestamp * 1000), 'yyyy-MM-dd')

            let end = this.startTimestamp + 7 * 24 * 60 * 60 - 1
            this.endTimestamp = end
            this.endTime = dateFormat(new Date(end * 1000), 'yyyy-MM-dd')
        },
        countDown() {
            if (this.timer) clearInterval(this.timer)
            this.timer = setInterval(()=> {
                if (this.week == 0) {
                    const countDown = this.endTimestamp - (new Date()).getTime() / 1000
                    if (countDown > 0) {
                        let day = parseInt(countDown / 60 / 60 / 24)
                        let hour = parseInt(countDown / 60 / 60 % 24)
                        let min = parseInt(countDown / 60 % 60)
                        let sec = parseInt(countDown % 60)
                        this.countDownTime = this.$t('home.ranking.countdown', {var1 : day, var2: hour, var3 : min, var4: sec })
                    }
                } else {
                    this.countDownTime = ''
                }
            }, 1000)
        },
        beforeDestroy() {
            clearInterval(this.timer)
            this.timer = null;
        },
        getRankingList() {

            const start = this.startTimestamp

            const type = this.isShowMint && this.selectedTab === 0 ? 'week-mining' : 'week-plant-harvest'

            Meteor.call('getRankingList', type, { start },(err,res)=>{
                if (this.startTimestamp !== start) {
                    return
                }
                if (!err) {
                    let list = res
                    list.forEach(data => {
                        const idStr = String(data.user._id)
                        data.showId = idStr.slice(0, 4) + '****' + idStr.slice(idStr.length - 4, idStr.length)
                    });
                    this.dataList = list

                    while(this.dataList.length < 10) {
                        this.dataList.push({})
                    }
                }
            })
        }
    }
}

</script>

<style lang="scss" scoped>

.ranking-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px !important;
    padding: 0px !important;
    max-width: 100%;
}

.tab-btn-selected {
    color: #fff;
    background: linear-gradient(142deg, #007254 0%, #16C9A2 100%);
    height: 54px;
    width: 160px;
    border-radius: 27px;
    font-size: 24px;
}

.tab-btn {
    color: #fff;
    outline: 1px solid #007254;
    background: none;
    height: 54px;
    width: 160px;
    border-radius: 27px;
    font-size: 24px;
}

.right-img {
    transform: scale(-1);
}

.list-content {
    font-size: 16px;
    color: #fff;
}

.list-wrapper {
    border: 1px solid #00322E;
    background-color:transparent !important;
    background: transparent !important;
    border: 1px solid #00322E !important;
    width:100%;
    border-radius: 8px;
    overflow: hidden;
    max-width: 1200px;
}

.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.switch-img {
    max-width: 36px;
    max-height: 30px;
}

@media screen and (max-width: 599px) {
    .tab-btn {
        height: 30px;
        width: 80px;
        font-size: 12px;
    }

    .tab-btn-selected {
        height: 30px;
        width: 80px;
        font-size: 12px;
    }

    .list-content {
        font-size: 12px;
        font-weight: bold;
        max-width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .switch-img {
        max-width: 18px;
        max-height: 15px;
    }
}

</style>
