 <template>
  <div>
    <div class="mx-2 mx-sm-0" :style="{ background: isMobile ? '#00221A' : 'transparent', paddingLeft: fitSize(80, 4) }">
        <div :style="{ maxWidth: isMobile ? '98%' : '62.5vw', minWidth: isMobile ? '98%' : '62.5vw'}" class="d-flex">
            <button class="mt-5 mt-sm-12" style="flex:1;" @click="showCreateTask">
                <div class="lease-btn" :style="{ height: btnHeight + 'px', borderRadius: (btnHeight * 0.5 + 'px')}">
                    <v-img class="ml-2 ml-sm-4" :max-width="fitSize(126, 50, true)" :max-height="fitSize(126, 50, true)" min-width="50px" min-height="50px" src="/static/ui/my/taskCenter/leaseAdd.png"/>
                    <div class="ml-2 ml-sm-8 d-flex flex-column align-start">
                        <div class="lease-title" :style="{ fontSize: fitSize(48, 16, true)}">{{$t('my.taskCenter.createTask')}}</div>
                        <div style="height:1px;background:#00000020;" :style="{minWidth: isMobile ? (100 + 'px') : (300 + 'px')}"></div>
                        <div class="lease-tips mt-1" :style="{ fontSize: fitSize(20, 12, true)}">{{$t('my.taskCenter.tapToCreate')}}</div>
                        <div class="lease-tips" :style="{ fontSize: fitSize(20, 12, true)}">{{$t('my.taskCenter.createTips')}}</div>
                    </div>
                    <v-spacer/>
                    <v-img style="position:absolute;" :max-height="fitSize(160, 70, true)" src="/static/ui/my/taskCenter/leaseLight.png"></v-img>
                    <v-img class="mr-8 mr-sm-11" :max-height="fitSize(160, 70, true)" :max-width="fitSize(220, 96, true)" min-width="96px" min-height="70px" src="/static/ui/my/taskCenter/leaseIcon.png"/>
                </div>
            </button>
        </div>

        <div class="mr-0 mr-sm-0" :style="{ width: isMobile ? '98%' : '62.5vw', maxWidth: isSmall ? '98%' : '62.5vw'}">
            <div class="lease-title mt-5 mt-sm-10" :style="{ fontSize: fitSize(24, 16)}">{{$t('my.taskCenter.myLeaseTask')}}</div>
            <div class="mt-1 mt-sm-2" style="color:#498779;" :style="{ fontSize: fitSize(16, 12)}">{{$t('my.taskCenter.tapTableTips')}}</div>
            <v-tabs v-model="tab" class="mt-3 mt-sm-6" background-color="transparent" color="#00FFCA" @change="onTabChange">
                <v-tab class="tab" :style="{ color: tabColor(0)}">
                    {{$t('my.taskCenter.taskPublishHistory')}}
                </v-tab>
                <v-tab class="tab" :style="{ color: tabColor(1)}">
                    {{$t('my.taskCenter.taskReceiveHistory')}}
                </v-tab>
            </v-tabs>

            <div v-if="dataList[0]" style="width:100%;">
                <div v-if="isMobile" class="table mt-4 mt-sm-8">
                    <div v-for="(data, idx) in dataList" :key="data._id || data.createdAt">

                        <div @click="onItemClick(idx)" style="height:50px;">
                            <div class="d-flex flex-row mt-2">
                                <div class="list-text-mobile ml-2">{{ tab === 1 ? data.receiveTime : data.time }}</div>
                                <v-spacer></v-spacer>
                                <div class="list-text-mobile mr-2">{{$t('my.taskCenter.publishId') + ':' + data._id}}</div>
                            </div>

                            <div class="d-flex flex-row justify-space-between align-center mt-3">
                                <div class="d-flex flex-row justify-center align-center ml-2">
                                    <v-img max-width="23px" max-height="18px" :src="getLandGradeImageUrl(data.requirements.land)"></v-img>
                                    <div class="list-text-mobile ml-1" >{{data.requirements.land.state.idOnChain || ''}}</div>
                                </div>
                                <div class="d-flex flex-row justify-center align-center white--text" style="font-size:10px;height:12px;">
                                    <v-img max-width="12px" max-height="12px" src="/static/ui/utils/coins/LUSD.svg"></v-img>
                                    <div class="list-text-mobile">{{getCompleteCondition(data.progress)}}</div>
                                    /
                                    <v-img max-width="12px" max-height="12px" :src="'/static/ui/utils/coins/'+ getReward(data.rewards).token +'.svg'"></v-img>
                                    <div class="list-text-mobile">{{getReward(data.rewards).amount}}</div>
                                </div>
                                <div class="list-text-mobile" :style="{color: getTaskStatus(data.status, data.isReceivedRewards).color}">{{getTaskStatus(data.status, data.isReceivedRewards).title}}</div>
                                <button 
                                    class="list-text-mobile" 
                                    style="text-decoration-line: underline;color:#2D4742;min-width:80px;"
                                    @click.stop="cancelOrder(data)"
                                >{{data.status === 0 ? $t('my.taskCenter.cancelOrder') : ''}}</button>
                            </div>
                        </div>

                    </div>
                </div>

                <div v-else class="table mt-4 mt-sm-8 mr-3 d-flex flex-column" style="overflow: auto;width:100%;">
                    <div class="d-flex flex-row jutify-center align-center" style="background: #00322E;width:100%;">
                        <div class="table-head table-item">{{ tab === 1 ? $t('my.taskCenter.receiveTime') : $t('my.taskCenter.publishTime') }}</div>
                        <div class="table-head table-item-120 ml-0 ml-md-6">{{$t('base.status')}}</div>
                        <div class="table-head table-item-90 mr-0 mr-md-4">{{' '}}</div>
                        <div class="table-head table-item-120 mr-0 mr-md-4">{{$t('my.taskCenter.landId')}}</div>
                        <div class="table-head table-item">{{$t('my.taskCenter.reward')}}</div>
                        <div class="table-head table-item">{{$t('my.taskCenter.publishId')}}</div>
                    </div>

                    <div style="width:100%;overflow:visible;">
                        <div v-for="(data, idx) in dataList" :key="data._id || data.createdAt" 
                        class="d-flex flex-row"
                        style="width:100%;"
                        >
                        <v-hover v-slot="{ hover }" style="width:200%;">
                            <button @click="onItemClick(idx)" style="width:100%;"
                            :style="{background : (idx + 1) % 2 === 0 ? 'rgba(0, 50, 46, 0.2)' : 'transparent'}">
                                <div 
                                    class="d-flex flex-row" 
                                    style="width:100%;"
                                    :style="{background: hover ? '#2D4742' : 'transparent'}"
                                >
                                    <div class="table-list table-item">{{ tab === 1 ? data.receiveTime : data.time }}</div>
                                    <div class="table-list table-item-120 ml-0 ml-md-6" :style="{color: getTaskStatus(data.status, data.isReceivedRewards).color}">{{getTaskStatus(data.status, data.isReceivedRewards).title}}</div>
                                    <div class="table-item-90 mr-4">
                                        <button class="table-list mx-4" style="text-decoration-line: underline;color:#498779;"
                                        @click.stop="cancelOrder(data)">{{data.status === 0 ? $t('my.taskCenter.cancelOrder') : ''}}</button>
                                    </div>
                                    <div class="table-list table-item-120 mr-0 mr-md-4">
                                        <div class="d-flex flex-row justify-center align-center mx-8">
                                            <v-img max-width="23px" max-height="18px" :src="getLandGradeImageUrl(data.requirements.land)"></v-img>
                                            <div class="table-list ml-2" >{{data.requirements.land.state.idOnChain || ''}}</div>
                                        </div>
                                        </div>
                                    <div class="table-list table-item">
                                        <div class="d-flex flex-row justify-center align-center mx-0 mx-md-8">
                                            <v-img max-width="24px" max-height="24px" src="/static/ui/utils/coins/LUSD.svg"></v-img>
                                            <div class="table-list ml-2 mr-1" >{{getCompleteCondition(data.progress)}}</div>
                                            /
                                            <v-img class="ml-1" max-width="24px" max-height="24px" :src="'/static/ui/utils/coins/'+ getReward(data.rewards).token +'.svg'"></v-img>
                                            <div class="table-list ml-2" >{{getReward(data.rewards).amount}}</div>
                                        </div>
                                    </div>
                                    <div class="table-list table-item">{{data._id || ''}}</div>
                                </div>
                            </button>
                        </v-hover>
                        

                            
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="table mt-4 mt-sm-8" style="height: 400px;">
                <default-page :statusCode="2"></default-page>
            </div>



            <div class="text-center mt-15 mb-15">
                <v-pagination
                    v-if="pageLength > 1"
                    total-visible="7"
                    v-model="page"
                    :length="pageLength"
                    color="#F7CD0A"
                    @input="onPageChange"
                ></v-pagination>
            </div>
        </div>
    </div>

    <!-- 订单详情 -->
    <v-dialog v-model="isShowDetail" :max-width="fitSize(470, 320)">
        <v-card class="detail-dialog">
            <div class="d-flex flex-row align-center justify-center">
                <v-card-title class="dialog-card-title ml-5">{{$t('my.taskCenter.moreInfo')}}</v-card-title>
                <v-spacer></v-spacer>
                <button class="mr-8" @click="closeDetailDialog">
                    <v-img src="/static/ui/assets/img/cross-white.png"></v-img>
                </button>
            </div>
            <div style="background:#2D4742;height:1px;width:100%;"></div>
            <div class="ml-5 my-5 ml-sm-8 my-sm-8">
                <div>
                    <div class="dialog-title">{{$t('my.taskCenter.leaseMode')}}</div>
                    <div class="dialog-content mt-1 mt-sm-2">
                        {{ selectedOrder.requirements ? 
                        (selectedOrder.requirements.mode === 0 ? $t('my.taskCenter.borrowLand') :  $t('my.taskCenter.workingMode'))
                        : ''}}
                    </div>
                </div>

                <div class="mt-sm-5 mt-2">
                    <div class="dialog-title">{{$t('my.taskCenter.orderProfit')}}</div>
                    <div class="d-flex flex-row align-center mt-1 mt-sm-2">
                        <div class="dialog-profit" style="flex:1">{{getOrderProfit(selectedOrder, true)}}<span class="dialog-title">{{getOrderProfitTips(selectedOrder, true)}}</span></div>
                        <span class="dialog-title mr-6 ml-2" style="flex:1;"><span class="dialog-profit mr-1">{{getOrderProfit(selectedOrder, false)}}</span>{{getOrderProfitTips(selectedOrder, false)}}</span>
                    </div>
                </div>

                <div class="mt-sm-5 mt-2">
                    <div class="dialog-title">{{$t('my.taskCenter.timeLimit')}}</div>
                    <div class="dialog-content mt-1 mt-sm-2">{{ converHour2day(Number(selectedOrder.requirements ? selectedOrder.requirements.timeLimit : 12))}}</div>
                </div>

                <div class="mt-sm-5 mt-2">
                    <div class="dialog-title">{{$t('my.taskCenter.publisher')}}</div>
                    <div class="dialog-content mt-1 mt-sm-2">{{selectedOrder.publisher || '--'}}</div>
                </div>

                <div class="mt-sm-5 mt-2">
                    <div class="dialog-title">{{$t('my.taskCenter.receiver')}}</div>
                    <div class="dialog-content mt-1 mt-sm-2">{{selectedOrder.receiver || '--'}}</div>
                </div>
            </div>
        </v-card>
    </v-dialog>

    <!-- 取消订单 -->
    <v-dialog v-model="isShowCancelOrder" :max-width="fitSize(470, 320)">
        <v-card class="detail-dialog">
            <div class="d-flex flex-row align-center justify-center">
                <v-card-title class="dialog-card-title ml-5">{{$t('my.taskCenter.confirmCancel')}}</v-card-title>
                <v-spacer></v-spacer>
                <button class="mr-8" @click="isShowCancelOrder = false">
                    <v-img src="/static/ui/assets/img/cross-white.png"></v-img>
                </button>
            </div>
            <div style="background:#2D4742;height:1px;width:100%;"></div>
            <div class="d-flex align-center justify-center white--text" 
            :style="{ height : fitSize(160, 106), fontSize: fitSize(18, 14)}">
                {{$t('my.taskCenter.confirmCancelTips')}}
            </div>
            <div class="d-flex align-center justify-center mb-5 mb-sm-8">
                <v-btn
                    class="mr-4 mr-sm-5 cancel-btn"
                    :width="fitSize(160, 80)"
                    :height="fitSize(46, 30)"
                    @click="isShowCancelOrder = false"
                >
                    {{ $t("cancelBtn") }}
                </v-btn>
                <v-btn
                    class="ml-4 ml-sm-5"
                    :width="fitSize(160, 80)"
                    :height="fitSize(46, 30)"
                    :disabled="cancelOrderDisabled"
                    color="primary"
                    @click="confirmCancelOrder"
                >
                    {{ $t("base.confirm") }}
                </v-btn>
            </div>
        </v-card>
    </v-dialog>

    <!-- 创建任务 -->
    <v-dialog v-model="isShowCreateTask" :max-width="fitSize(668, 420)">
        <v-card class="detail-dialog d-flex flex-column align-center">
            <div class="d-flex flex-row align-center justify-center" style="width:100%">
                <v-card-title class="dialog-card-title ml-5">{{$t('my.taskCenter.createTask')}}</v-card-title>
                <v-spacer></v-spacer>
                <button class="mr-8" @click="isShowCreateTask = false">
                    <v-img src="/static/ui/assets/img/cross-white.png"></v-img>
                </button>
            </div>
            <div style="background:#2D4742;height:1px;width:100%;"></div>
            <div class="create-task ml-4 ml-sm-8 mt-sm-6 mt-3">
                <div class="d-flex flex-row">
                    <div class="create-task-title">{{$t('my.taskCenter.selectLand')}}</div>
                    <button 
                        class="create-task-myland ml-2" 
                        :style="{fontSize: fitSize(20, 14), color: (selectedLand ? '#F7CD0A' : '#00FFCA' ) }"
                        @click="selectMyLand"
                    >
                    {{ selectedLand ? $t('my.taskCenter.selected') : $t('my.taskCenter.myLand')}}
                    </button>
                    <div class="d-flex flex-row justify-center align-center ml-2">
                        <v-img v-if="selectedLand" :max-width="fitSize(34, 26)" :max-height="fitSize(24,18)" 
                        :src="getLandGradeImageUrl(selectedLand)"></v-img>
                        <div v-if="selectedLand" class="ml-2 white--text" :style="{fontSize: fitSize(20, 12)}">{{'ID ' + selectedLand.state.idOnChain}}</div>
                    </div>
                </div>

                <div class="d-flex flex-row align-center">
                    <div class="create-task-title">{{$t('my.taskCenter.timeLimit') + ":"}}</div>
                    <v-radio-group row mandatory class="ml-2" @change="selectTime" v-model="selectedTime">
                        <div v-for="tl in timeLimits" :key="tl" class="ml-2">
                            <v-radio dark :value="tl" color="#00FFCA" class="ml-n2 ml-sm-0">
                                <template v-slot:label>
                                    <div :style="{color : (selectedTime === tl ? '#00FFCA' : '#fff'), fontSize: fitSize(16, 12)}">{{converHour2day(tl)}}</div>
                                </template>
                            </v-radio>
                        </div>
                    </v-radio-group>

                </div>

                <div class="d-flex flex-column align-start">
                    <div class="create-task-title">{{$t('my.taskCenter.leaseMode') + ':'}}</div>
                    <div class="d-flex flex-column flex-sm-row mt-5">
                         <v-card 
                            class="mode d-flex flex-column align-center mr-4" 
                            style="flex:1"
                            elevation="0"
                            :style="{ border: (selectedMode === 0 ? '1px solid #00FFCA' : '1px solid #2D4742')}"
                            @click="selectedMode = 0"
                        >
                             <div class="title mt-3 mt-sm-5">{{$t('my.taskCenter.borrowLand')}}</div>

                             <div class="d-flex flex-row align-center justify-center mt-1 mt-sm-4" style="width:100%;">
                                 <div style="height:1px;background: #2D4742;width:50px;"></div>
                                 <div class="white--text mx-2" :style="{fontSize: fitSize(14, 12)}">{{$t('my.taskCenter.taskFinishCondition')}}</div>
                                 <div style="height:1px;background: #2D4742;width:50px;"></div>
                             </div>

                             <v-radio-group fluid mandatory class="ml-2" v-model="selectedModeOpt">
                                <div v-for="(r, idx) in leaseRewards" :key="r.index">
                                    <v-radio dark :value="r.index" :class="idx == 0 ? '' : ' mt-1 mt-sm-2'" color="#00FFCA">
                                        <template v-slot:label>
                                            <div
                                            class="ml-n1"
                                            style="color:#fff;"
                                            :style="{ fontSize: fitSize(16, 12)}"
                                            >
                                                <div class="d-flex flex-row">
                                                    <div>{{ $t('my.taskCenter.cultivate')}}</div>
                                                    <div class="mx-1" style="color:#00FFCA;text-align:center;">{{setReward(leaseRewards, idx).seedsCount}}</div>
                                                    <div>{{$t('my.taskCenter.seedReward')}}</div>
                                                    <div class="mx-1" style="color:#00FFCA;text-align:center;">{{setReward(leaseRewards, idx).amount}}</div>
                                                    <div>{{getTitleRewardToken(0)}}</div>
                                                </div>
                                            
                                            </div>
                                        </template>
                                    </v-radio>
                                </div>
                            </v-radio-group>

                            <v-divider></v-divider>
                            <div class="white--text mb-3 mb-sm-5" style="font-size:12px;text-align:center;">{{$t('my.taskCenter.farmerModeTips')}}</div>
                             
                         </v-card>

                         <v-card 
                            class="mode d-flex flex-column align-center mr-4 mt-2 mt-sm-0" 
                            style="flex:1"
                            elevation="0"
                            :style="{ border: (selectedMode === 1 ? '1px solid #00FFCA' : '1px solid #2D4742')}"
                            @click="selectedMode = 1"
                         >
                             <div class="title mt-3 mt-sm-5">{{$t('my.taskCenter.workingMode')}}</div>
                             
                             <div class="d-flex flex-row align-center justify-center mt-1 mt-sm-4" style="width:100%;">
                                 <div style="height:1px;background: #2D4742;width:50px;"></div>
                                 <div class="white--text mx-2" :style="{fontSize: fitSize(14, 12)}">{{$t('my.taskCenter.taskFinishCondition')}}</div>
                                 <div style="height:1px;background: #2D4742;width:50px;"></div>
                             </div>

                             <v-radio-group fluid mandatory class="ml-2" v-model="selectedModeOpt2">
                                <div v-for="(r, idx) in workRewards" :key="r.index">
                                    <v-radio dark :value="r.index" :class="idx == 0 ? '' : ' mt-1 mt-sm-2'" color="#00FFCA">
                                        <template v-slot:label>
                                            <div
                                            class="ml-n1"
                                            style="color:#fff;"
                                            :style="{ fontSize: fitSize(16, 12)}"
                                            >
                                                <div class="d-flex flex-row">
                                                    <div>{{ $t('my.taskCenter.cultivate')}}</div>
                                                    <div class="mx-1" style="color:#00FFCA;text-align:center;">{{setReward(workRewards, idx).seedsCount}}</div>
                                                    <div>{{ $t('my.taskCenter.seedReward')}}</div>
                                                    <div class="mx-1" style="color:#00FFCA;text-align:center;">{{setReward(workRewards, idx).amount}}</div>
                                                    <div>{{getTitleRewardToken(1)}}</div>
                                                </div>
                                            
                                            </div>
                                        </template>
                                    </v-radio>
                                </div>
                            </v-radio-group>

                            <v-divider></v-divider>
                            <div class="white--text mb-3 mb-sm-5" style="font-size:12px;text-align:center;">{{$t('my.taskCenter.workingModeTips')}}</div>
                             
                         </v-card>
                    </div>

                </div>


            </div>

            <div class="d-flex flex-row align-center justify-center" style="width:100%">
                <v-btn
                    class="mt-5 mt-sm-8 mb-5 mx-4"
                    style="flex:1"
                    max-width="380px"
                    :height="fitSize(46, 30)"
                    color="primary"
                    @click="confirmCreateOrder"
                >
                    {{$t('my.taskCenter.confirmCreate')}}
                </v-btn>
            </div>


        </v-card>
    </v-dialog>


    <!-- 我的土地 -->
    <ChoicePledge
        active-class="pledg-dialog-class"
        :show="isShowSelectMyLand"
        :title="myLandTitle"
        :isPledge="false"
        width="730px"
        @closeDialog="isShowSelectMyLand = false"
        :pledgeLists="landList"
        @update="getMyLand"
        @confirm="chooseLand"
        :count.sync="landCount"
    >
    </ChoicePledge>

  </div>
</template>

<script>

import ChoicePledge from "/imports/ui/views/pledge/components/pledgeNFT/components/ChoicePledge";
import { dateFormat } from '/imports/utils/dateFormat'
import DefaultPage from "/imports/ui/components/defaultPage/DefaultPage";

export default {
  name: 'Task',
  components: {
      ChoicePledge,
      DefaultPage
  },
  mounted () {
      this.logEvent('go_order_center')
      this.fetchOrderConfig()
      this.fetchOrders()
  },
  computed: {
      isMobile() { return this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm'},
      isSmall() { return this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm' || this.$vuetify.breakpoint.name === 'md' },
      btnHeight() { return (this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm') ? 70 : 160; },
      cancelOrderDisabled() {
          return false
      },
      myLandTitle() {
          return this.$t('topbar.land')
      }
  },
  data() {
      return {
          tab: 0,
          items: ["finished", "fragment"],
          dataList: [],
          dataCount: 0,
          page: 1,
          pageLength: 1,
          pageSize: 10,
          taskType: 0, // 任务类型
          isShowDetail: false,
          isShowCancelOrder: false,
          isShowCreateTask: false,
          isLoading: false,
          isShowSelectMyLand: false,
          onIcon: '/static/ui/components/card/sss.png',
          selectedTime: 12,
          selectedMode: 0,
          selectedModeOpt: 0,
          selectedModeOpt2: 0,

          landList: [],
          landCount: 0,
          selectedLand: null,

          // rule
          rule: {},
          timeLimits: [12, 24, 48, 72],
          leaseRewards: [],
          workRewards: [],

          selectedOrder: {}, // 选中订单
          isReceiveList: false,
      }
  },
  methods: {
      fitSize(big, small, isSm) {
          if (isSm && isSm === true) {
              if (this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm') {
                  return (small + 'px')
              } else {
                  return (big + 'px')
              }
          } else {
              return this.$vuetify.breakpoint.name === 'xs' ? (small + 'px') : (big + 'px')
          }
      },
      onTabChange(tab) {
          this.tab = tab
          this.fetchOrders()
      },
      tabColor(idx) {
          return idx === this.tab ? '#00FFCA' : '#95C6B7'
      },
      showCreateTask() {
          this.selectedLand = null
          this.selectedMode = 0
          this.selectedModeOpt = 0
          this.selectedModeOpt2 = 0
          this.selectedTime = this.timeLimits.length > 0 ? this.timeLimits[0] : 1
          this.isShowCreateTask = true

          this.setupReward()
      },
      onPageChange(page) {
          this.page = page
          this.fetchOrders()
      },
      onItemClick(idx) {
          this.selectedOrder = this.dataList[idx]
          this.isShowDetail = true
          this.fetchOrderDetail()
      },
      closeDetailDialog() {
        this.isShowDetail = false
      },
      cancelOrder(order) {

          this.selectedOrder = order
          this.isShowCancelOrder = true
      },
      confirmCancelOrder() {
          const taskId = this.selectedOrder._id
          const self = this
          Meteor.call("cancelTask",taskId, (err, res) => {
              if (!err) {
                  self.isShowCancelOrder = false
                  this.$toast.success(this.$t('my.taskCenter.cancelOrderSuccess'))
                  this.fetchOrders()
              } else {
                  this.toasterErr(Number(err.reason) || err.reason)
              }
          })
      },
      selectTime(time) {
          this.selectedTime = time
          this.setupReward()
      },
      selectMyLand() {
          this.getMyLand(0)
          this.isShowSelectMyLand = true
      },
      getMyLand(skip) {
        this.landList = [];

        const params = {offset:skip, limit: 8, lease: true}

        Meteor.call("nftItems", params, (err, res) => {
            if (!err) {
                this.landList = res.list;
                this.landCount = res.count;
            }
        });
      },
      converHour2day(hour) {
          return hour < 24 ? (hour + 'h') : ((hour / 24) + ' day')
      },
      setReward(rewards, idx) {
          let index = 0
          for (let i = 0;i < rewards.length; ++i) {
              const r = rewards[i]
              if (r.time == this.selectedTime && idx == index) {
                  return { seedsCount: r.seedsCount, amount : r.rewards[0].amount }
              }
              index++;
          }
          return { seedsCount: 0, amount : 0 }
      },
      fetchOrderConfig() {
          const self = this;
          Meteor.call('bountyTaskRule', 0, (err, res) => {
              if (res.rule.active && res.rule.type === 0) {
                  self.rule = res.rule
                  const rules = res.rule.rules
                  self.timeLimits = rules.timeLimit
                  self.selectedTime = self.timeLimits.length > 0 ? self.timeLimits[0] : 12
                this.setupReward()
              }
          });
      },
      confirmCreateOrder() {

          if (!this.selectedLand) {
              this.$toast.error(this.$t('my.taskCenter.selectLandFirst'))
              return
          }

          const rules = {
              timeLimit: this.selectedTime,
              mode: this.selectedMode,
              landId: this.selectedLand._id,
              level: this.selectedMode === 0 ? this.selectedModeOpt : this.selectedModeOpt2,
              seed: 'primary_grape'
          }

          Meteor.call("publishTask", this.rule._id, rules, (err, res)=> {
              if (!err) {
                  this.isShowCreateTask = false
                  this.$toast.success(this.$t('my.taskCenter.createOrderSuccess'))
                  this.selectedLand = null
                  this.fetchOrders()
              } else {
                  this.toasterErr(Number(err.reason) || err.reason)
              }
          })
      },
      fetchOrders() {

          let params = {
              offset: (this.page - 1) * this.pageSize,
              limit: this.pageSize,
              type: this.taskType,
          }

          if (this.tab === 1) {
              params['receiver'] = true
              params['status'] = [1,2,3,4]
              params['sort'] =  {'startTime':-1}
          } else {
              params['publisher'] = Meteor.userId()
              params['status'] = [0,1,2,3,4]
              params['sort'] =  {'createdAt': -1}
          }

          const self = this;
          this.dataList = []
          Meteor.call("bountyTaskList", params, (err, res) => {
              if (err) {
                  this.toasterErr(Number(err.reason) || err.reason)
              } else {
                  const list = res.list
                  list.forEach(e => {
                      e.time = dateFormat(e.createdAt, 'yyyy-MM-dd hh:mm:ss')
                      e.receiveTime = dateFormat(e.startTime, 'yyyy-MM-dd hh:mm:ss')
                  });
                  self.dataList = list
                  self.pageLength = Math.ceil(res.count / self.pageSize)
              }
          })
      },
      fetchOrderDetail() {

          const taskId = this.selectedOrder._id
          Meteor.call("getBountyTask",taskId, (err, res) => {

          })
      },
      getLandGradeImageUrl(land) {
          let grade = land.info.totalNftPool.info.grade || ''
          return grade.length > 0 ? ('/static/ui/components/card/'+grade.toLowerCase()+'.png') : ''
      },
      getReward(rewardList) {
          // 奖励目前就取第一个
          return rewardList.length > 0 ? rewardList[0] : {amount: '0', token: 'LUCK'}
      },
      getCompleteCondition(progress) {
          return progress ? (progress.seedsCount || 0) : 0
      },
      getOrderProfit(order, isMining) {
          if (order.extraData != null) {
              if (isMining) {
                  let profit = (order.extraData.mineAmount || '0')
                  profit = Number(profit).toFixed(2)
                  profit = profit > 0 ? '+' + profit : profit
                  return profit + ' ' + order.extraData.mineToken
              } else {
                  let profit = (order.extraData.harvestAmount || '0')
                  profit = Number(profit).toFixed(2)
                  profit = profit > 0 ? '+' + profit : profit
                  return profit + ' ' + order.extraData.harvestToken
              }
          }
          return isMining ? '--' : ''
      },
      getOrderProfitTips(order, isMining) {
        if (order.extraData != null) {
            if (isMining) {
                if (order.receiver === Meteor.userId()) {
                    return this.$t('my.taskCenter.landLord')
                }
            } else {
                if (order.requirements.mode === 0 && order.publisher === Meteor.userId()) {
                    return this.$t('my.taskCenter.tenantFarmer')
                } else if (order.requirements.mode === 1 && order.receiver === Meteor.userId()) {
                    return this.$t('my.taskCenter.landLord')
                }
            }
        }
        return ''
      },
      getTaskStatus(status, isReceivedRewards) {
        const isReceive = this.tab === 1
        let statusStr = 'status.' + status
        let color = ''
        switch (status) {
            case 0:
                color = '#13AA6D'
                break;
            case 1:
                color = '#F7CD0A'
                break;
            case 2:
                if (isReceive) {
                    if (isReceivedRewards) {
                        color = '#FFF'
                    } else {
                        statusStr = 'rewardToReceive'
                        color = '#13AA6D'
                    }
                } else {
                    color = '#FFF'
                }
                
                break;
            case 3:
                color = '#CF2C46'
                break;
            case 4:
                color = '#D8D8D8'
                break;
            default:
                color = '#13AA6D'
                break;
        }
        return { title: this.$t('my.taskCenter.' + statusStr), color }
      },
      getTitleRewardToken(mode) {
          let rewardToken = ''
          if (mode === 0) {
              const rewards = this.leaseRewards.filter ( r => { return r.index === this.selectedModeOpt })
              if (rewards.length === 1) {
                  rewardToken = rewards[0].rewards[0].token
              }
          } else if (mode === 1) {
              const rewards = this.workRewards.filter ( r => { return r.index === this.selectedModeOpt2 })
              if (rewards.length === 1) {
                  rewardToken = rewards[0].rewards[0].token
              }
          }
          return rewardToken
      },
      chooseLand(land) {
          this.isShowSelectMyLand = false
          this.selectedLand = land
      },
      setupReward() {
        if (!this.rule) return
        const rules = this.rule.rules
        for (let i = 0;i < rules.mode.length;++i) {
            const m = rules.mode[i]
            if (m.type === 'lease') {
                let rewards = m.level
                for (let i = 0;i < rewards.length;++i) {
                    rewards[i].index = i
                }
                this.leaseRewards = rewards.filter( r=> { return r.time === this.selectedTime})
            } else if (m.type === 'work') {
                let rewards = m.level
                for (let i = 0;i < rewards.length;++i) {
                    rewards[i].index = i
                }
                this.workRewards = rewards.filter( r=> { return r.time === this.selectedTime})
            }
        }
        this.selectedModeOpt = this.leaseRewards[0].index
        this.selectedModeOpt2 = this.workRewards[0].index
      }

  }
}
</script>

<style lang="scss" scoped>


.lease-btn {
    background: linear-gradient(274.16deg, #FFD12F 9.04%, #FF8E00 91.36%);
    height: 160px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.lease-title {
    font-weight: 600;
    color: #fff;
}

.lease-tips {
    font-weight: 400;
    color: #fff;
}

.tab {
    min-width: auto;
    margin-right: 26px;
    font-size: 14px;
    width: auto !important;
    padding: 0px !important;
}

.table {
    border: 1px solid #2D4742;
    box-sizing: border-box;
    box-shadow: 0px 5px 8px 0.5px rgba(0, 20, 15, 0.5);
    border-radius: 8px;
    // overflow: hidden;
}

.table-head {
    background: #00322E;
    text-align: center;
    line-height: 60px;
    height: 60px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    white-space:nowrap;
}

.table-item {
    width: 210px;
    min-width: 210px;
    max-width: 210px;
}

.table-item-150 {
    width: 150px;
    min-width: 150px;
    max-width: 150px;
}

.table-item-120 {
    width: 120px;
    min-width: 120px;
    max-width: 120px;
}

.table-item-90 {
    width: 90px;
    min-width: 90px;
    max-width: 90px;
}

.table-list {
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: white;
    font-size: 16px;
    font-weight: 400;
    white-space:nowrap;
}

.list-text-mobile {
    font-size: 10px;
    color: white;
    white-space:nowrap;
    vertical-align: middle;
    // text-align: center;
    line-height: 12px;
}

.pledge-NFT-title {
  font-weight: 600;
  font-size: 36px;
  color: #ffffff;

  text-shadow: 0px 5px 8px rgba(0, 20, 15, 0.5);
}

.detail-dialog {
    background: #00322E;
    border: 1px solid #00FFCA;
    box-sizing: border-box;
    box-shadow: 0px 5px 8px 1px rgba(0, 37, 19, 0.503391);
    border-radius: 8px;

    .dialog-card-title {
        font-weight: 600;
        font-size: 24px;
        color: #fff;
    }

    .dialog-title {
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        color: #D8D8D8;
    }

    .dialog-content {
        font-weight: 600;
        font-size: 20px;
        line-height: 28px;
        color: #FFFFFF;
    }

    .dialog-profit {
        font-weight: 700;
        line-height: 15px;
        color: #F7CD0A;
    }
}

.cancel-btn {
    background: linear-gradient(142.1deg, #727272 -41.15%, #CACACA 94.16%) !important;
}

.create-task {

    display: flex;
    flex-direction: column;

    .create-task-title {
        font-weight: 600;
        font-size: 20px;
        line-height: 28px;
        color: #FFFFFF;
        white-space: nowrap;
    }

    .create-task-myland {
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
        text-decoration-line: underline;
        color: #00FFCA;
    }

    .land-id {
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
        color: #FFFFFF;
    }

    .mode {
        border-radius: 4px;
        background: transparent;

        .title {
            font-weight: 600;
            font-size: 16px;
            color: #F7CD0A;
        }

    }

}

.theme--light.v-icon {
    color: #ffffff !important;
}

@media screen and (max-width: 599px) {

    .create-task {
        .create-task-title {
            font-size: 14px;
            line-height: 20px;
        }

        .create-task-myland {
            font-size: 14px;
            line-height: 20px;
        }

        .mode {
            .title {
                font-size: 14px;
            }
        }
    }

    .detail-dialog {
        .dialog-card-title {
            font-size: 16px;
        }

        .dialog-title {
            font-size: 12px;
            line-height: 17px;
        }

        .dialog-content {
            font-size: 14px;
            line-height: 20px;
        }

        .dialog-profit {
            font-size: 12px;
            line-height: 15px;
        }
    }
    
}

</style>
