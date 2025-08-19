<template>
  <div class="pledge-wrapper">
    <!-- 分紅 -->
    <Bonus :stakeInfo="stakeInfo" @updateInfo="getStakeInfo"/>

    <!-- 質押NFT -->
    <PledgeNFT :stakeInfo="stakeInfo" @updateInfo="getStakeInfo"/>

    <!-- 質押LUCK -->
    <PledgeLUCK :stakeInfo="stakeInfo" @updateInfo="getStakeInfo"/>

  </div>
</template>

<script>
import Bonus from './components/bonus/Bonus'
import PledgeNFT from './components/pledgeNFT/PledgeNFT'
import PledgeLUCK from './components/pledgeLUCK/PledgeLUCK'

export default {
  name: 'Pledge',
  components:{
    Bonus,
    PledgeNFT,
    PledgeLUCK
  },
  data(){
    return {
      stakeInfo:{
        stake:Decimal(0),
        hashrate:Decimal(0),
        bonus:Decimal(0),
        balance:Decimal(0),
        stakePool: {
          totalStake: Decimal(0),
          hashrate:Decimal(0),
          userDivPool:0.1,
        },
      }
    }
  },
  mounted() {
    this.logEvent('go_stake')
    this.getStakeInfo()
  },
  methods:{
    getStakeInfo(){
      Meteor.call("getMyStakeInfo", (err,res)=>{
        if (err){
          console.error('getStakeInfo err', err)
          this.toasterErr(Number(err.reason) || err.reason)
        }else{
          this.stakeInfo = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../assets/css/utils/variables.scss';

.pledge-wrapper {
}
</style>
