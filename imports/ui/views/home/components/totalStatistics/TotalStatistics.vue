<template>
    <div class="container">
        <div ref="inner-container" class="inner-container scroll-animation">
            <span class="total-title">{{$t('home.totalStatistics.totalFund')}}</span>
            <span class="total-number">{{totalFund}}</span>
        </div>
        <div class="inner-container">
            <span class="total-title">{{$t('home.totalStatistics.totalMining')}}</span>
            <span class="total-number">{{totalMining}}</span>
        </div>
        <div ref="inner-container" class="inner-container">
            <span class="total-title">{{$t('home.totalStatistics.totalFund')}}</span>
            <span class="total-number">{{totalFund}}</span>
        </div>
    </div>

</template>

<script>
    import {
        MiningPool
    } from "../../../../../api/mining/collections";
    import {
        FundPool
    } from "../../../../../api/fund/collections";
    import { money_filter } from '/imports/utils/money'

    export default {
        name: 'TotalStatistics',
        computed: {
            totalFund() {
                let total = 0
                let unit = ''
                this.fundPool.forEach(m => {
                    total += Number(m.total)
                    unit = m.token
                });
                return money_filter(total, 2) + ' ' + unit
            },
            totalMining() {
                let total = 0
                let unit = ''
                this.miningPool.forEach(m => {
                    total += Number(m.total)
                    unit = m.token
                });
                return money_filter(total, 2) + ' ' + unit
            }
        },
        meteor: {
            $subscribe: {
                miningPool: [],
                fundPool: [],
            },
            miningPool() {
                return MiningPool.find({}).fetch()
            },
            fundPool() {
                return FundPool.find({}).fetch()
            }
        }
    }
</script>


<style lang="scss" scoped>
    $height: 60px;

    .container {
        width: 100%;
        height: $height;
        min-height: $height;
        max-height: $height;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        overflow: hidden;
    }

    .inner-container {
        width: 100%;
        height: $height;
        min-height: $height;
        max-height: $height;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .scroll-animation {
        animation-duration: 6s;
        animation-timing-function: linear;
        animation-name: scroll;
        animation-iteration-count: infinite;
        animation-fill-mode: forwards;
    }

    @keyframes scroll {
        0% {
            margin-top: 120px;
        }

        25% {
            margin-top: 120px;
        }

        50% {
            margin-top: 0px;
        }

        75% {
            margin-top: 0px;
        }

        100% {
            margin-top: -120px;
        }
    }

    .total-number {

        font-family: PingFang HK;
        font-style: normal;
        font-weight: 600;
        font-size: 24px;
        line-height: $height;
        height: $height;
        vertical-align: middle;

        color: #00FFCA;
    }

    .total-title {
        font-family: PingFang HK;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        height: $height;
        line-height: $height;
        vertical-align: middle;
        color: #FFFFFF;

        margin-right: 20px;
    }
</style>