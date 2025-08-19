<template>
    <!-- 推薦列表 -->
    <div>
        <!-- 1、標題模塊 -->
        <div class="title-group">
            <div class="main-title">挖矿详情</div>
        </div>

        <!-- 2、篩選模塊 -->
        <div style="display:flex;align-items:center;">
            <el-input v-model="keyword" :placeholder="$t('admin.searchUser')" style="width: 200px;"
                @keyup.enter.native="_fetchData()" />

            <el-date-picker style="margin-left:15px;" type="datetimerange" v-model="selectedDate" :range-separator="$t('admin.to')"
                :start-placeholder="$t('admin.beginTime')" :end-placeholder="$t('admin.endTime')" :placeholder="$t('admin.selectTimeRange')"
                :picker-options="datePickerOptions">
            </el-date-picker>

            <el-button type="primary" @click="search()" style="height:34px;margin-left:10px;">{{$t('admin.search')}}</el-button>

        </div>

        <el-breadcrumb v-if="navMenus.length > 1" separator=">" style="margin-top:30px;">
            <transition-group name="breadcrumb">
                <el-breadcrumb-item v-for="(item, index) in navMenus" :key="item + index">
                    <span v-if="index==navMenus.length-1">{{ item }}</span>
                    <a v-else @click.prevent="clickMenu(item)">{{ item }}</a>
                </el-breadcrumb-item>
            </transition-group>
        </el-breadcrumb>

        <el-table v-if="data._id" :data="[data]" style="width:100%;margin-top: 20px;" border fit highlight-current-row
            v-loading="isLoading">

            <el-table-column :label="$t('admin.userId')" min-width="180" align="center">
                <template slot-scope="{row}">
                    <span>{{row._id}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.username')" min-width="180" align="center">
                <template slot-scope="{row}">
                    <span>{{row.username}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.referral')" min-width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{row.referral}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.profit', { var : 'LUSD'})" min-width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{fixNum(row.totalProfitLoss || '')}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.ownAndReferralProfit', { var : 'LUSD'})" min-width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{ fixNum((row.totalProfitLoss || 0.0) + (row.subTotalProfitLoss || 0.0))}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.referralProfit', { var : 'LUSD'})" min-width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{ fixNum(row.subTotalProfitLoss || '')}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.mineProfit', { var : 'LUCK'})" min-width="150" align="center">
                <template slot-scope="{row}">
                    <a @click="showMiningInfo(row)">{{row.totalMining || ''}}</a>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.referralMineProfit', { var : 'LUCK'})" min-width="150" align="center">
                <template slot-scope="{row}">
                    <a @click="showMiningInfo(row, 3)">{{row.totalReferralMining || ''}}</a>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.referralMine', { var : 'LUCK'})" min-width="150" align="center">
                <template slot-scope="{row}">
                    <a @click="showMiningInfo(row, 2)">{{row.subTotalMining || ''}}</a>
                </template>
            </el-table-column>

            <el-table-column min-width="150" align="center">
                <template slot-scope="{row}">
                    <a @click="showAllMiningInfo(row)">{{ $t('admin.allMineDetail') }}</a>
                </template>
            </el-table-column>


        </el-table>

        <div v-if="data._id" style="margin-top:20px">{{$t('admin.referralList')}}</div>

        <!-- 3、表格模塊 -->
        <el-table :data="data.subUser ? (data.subUser.list || []) : dataList" style="width:100%;margin-top: 20px;"
            border fit highlight-current-row v-loading="isLoading">

            <el-table-column label="No." sortable prop="index" min-width="50" align="center">
                <template slot-scope="{row}">
                    <span>{{row.index}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.userId')" min-width="180" align="center">
                <template slot-scope="{row}">
                    <span>{{row._id}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.username')" min-width="180" align="center">
                <template slot-scope="{row}">
                    <a @click="showUserProfitDetail(row.username)">{{row.username}}</a>
                </template>
            </el-table-column>

            <el-table-column v-if="dataList.length > 0" :label="$t('admin.referral')" min-width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{row.referral}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.profit', { var : 'LUSD'})" sortable prop="totalProfitLoss" min-width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{fixNum(row.totalProfitLoss || '')}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.mineProfit', { var : 'LUCK'})" sortable prop="totalMining" min-width="150" align="center">
                <template slot-scope="{row}">
                    <a @click="showMiningInfo(row)">{{row.totalMining || ''}}</a>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.referralMineProfit', { var : 'LUCK'})" sortable prop="totalReferralMining" min-width="150" align="center">
                <template slot-scope="{row}">
                    <a @click="showMiningInfo(row, 3)">{{row.totalReferralMining || ''}}</a>
                </template>
            </el-table-column>

        </el-table>

        <!-- 4、分頁模塊 -->
        <pagination :total="total" :page.sync="page" :limit.sync="pageSize" @pagination="_fetchData"
            style="margin-top: 16px;" />

        <!-- 挖矿详情 -->
        <el-dialog :title="$t('admin.mineDetail', { var : 'LUCK'})" :visible.sync="showMiningDetail" append-to-body width="400px">
            <div style="display:flex;flex-dirction:row;">
                <div style="width: 400px;">
                    <div class="user-detail-item">{{`${$t('admin.totalText')}：`+ selectedMiningTotal}}</div>
                    <div class="user-detail-item">
                        {{'SSS：'+ (selectedMiningData['SSS'] || '')}}
                    </div>
                    <div class="user-detail-item">
                        {{'SS：'+ (selectedMiningData['SS'] || '')}}
                    </div>
                    <div class="user-detail-item">
                        {{'S：'+ (selectedMiningData['S'] || '')}}
                    </div>
                    <div class="user-detail-item">
                        {{'A：'+ (selectedMiningData['A'] || '')}}
                    </div>
                    <div class="user-detail-item">
                        {{'B：'+ (selectedMiningData['B'] || '')}}
                    </div>

                </div>
            </div>
        </el-dialog>

        <el-dialog :title="$t('admin.userDetail')" :visible.sync="showUserDetail" append-to-body class="dialog-add" width="800px">
            <div style="display:flex;flex-dirction:row;">
                <div style="width: 400px;">
                    <div style="font-size:16px;font-weight:bold;margin-bottom: 20px;">{{$t('admin.userInfo')}}</div>
                    <div class="user-detail-item">{{$t('admin.userId') + '：'+ selectedUser._id || ''}}</div>
                    <div class="user-detail-item">{{$t('admin.username') + '：'+ selectedUser.username || ''}}</div>
                    <div class="user-detail-item">{{$t('admin.phone')+ selectedUser.mobileNum || ''}}</div>
                    <div class="user-detail-item">{{$t('base.email')+'：'+ (selectedUser && selectedUser.emails ? (selectedUser.emails[0].address || '') : '')}}</div>
                    <div class="user-detail-item">{{$t('admin.nickname')+'：'+ selectedUser.nickname || ''}}</div>
                    <div class="user-detail-item">{{$t('admin.role')+'：'+ selectedUser.role || ''}}</div>
                    <div class="user-detail-item">{{$t('admin.registerTime')+'：'+ selectedUser.time || ''}}</div>
                    <div class="user-detail-item">{{$t('admin.lastRegisterTime')+'：'+ selectedUser.lastLoginTime || ''}}</div>
                    <div class="user-detail-item">{{$t('admin.registerType')+'：'+ selectedUser.registerType || ''}}</div>

                </div>
                <div style="width: 400px;">
                    <div style="font-size:16px;font-weight:bold;margin-bottom: 20px;">{{$t('admin.balance')}}</div>
                    <div v-for="b in selectedUser.balance" :key="b._id+b.token">
                        <div class="user-detail-item">{{b.token + "：" + b.amount}}</div>
                    </div>
                    <div class="user-detail-item">
                        {{ `${$t('admin.casting')}：`+ (selectedUser.userStatistical != null ? (selectedUser.userStatistical.mintCount || '') : '')}}
                    </div>
                    <div class="user-detail-item">
                        {{ `${$t('admin.castingCost')}：`+ (selectedUser.userStatistical != null ? (selectedUser.userStatistical.mintConsumeAmount || '') : '')}}
                    </div>
                    <div class="user-detail-item">
                        {{ `${$t('admin.recharging')}：`+ selectedUser.myDeposit }}
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import moment from "moment/moment";
    import Pagination from '/imports/ui/components/Pagination'
    import {
        mapGetters
    } from 'vuex'
    import { money_filter } from '/imports/utils/money'
    import {
        Permissions
    } from '/imports/api/account/services'
    

    export default {
        name: "agent-manage",
        components: {
            Pagination,
        },
        data() {
            return {
                dataList: [],
                isLoading: false,

                keyword: '',
                page: 1,
                pageSize: 10,


                total: 0,

                data: {},

                navMenus: ['All'],

                selectedUser: {},
                showUserDetail: false,

                selectedMiningTotal: '',
                selectedMiningData: {},
                showMiningDetail: false,

                isProxy: false,
                role: '',


                selectedDate: [moment().startOf('day').toDate(), moment().endOf('day').toDate()],

                datePickerOptions: {
                    shortcuts: [{
                        text: 'All',
                        onClick(picker) {
                            picker.$emit('pick', []);
                        }
                    }, {
                        text: this.$t('admin.dayBefore'),
                        onClick(picker) {
                            const end = moment().endOf('day').toDate();
                            const start = moment().startOf('day').toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: this.$t('admin.threeDayBefore'),
                        onClick(picker) {
                            const end = moment().endOf('day').toDate();
                            const start = moment().startOf('day').subtract(2, 'day').toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: this.$t('admin.weekBefore'),
                        onClick(picker) {
                            const end = moment().endOf('day').toDate();
                            const start = moment().startOf('day').subtract(6, 'day').toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },

            }
        },
        computed: {
            ...mapGetters(["user"])
        },
        created() {
            // this._fetchData()
            this._checkRoles()
        },
        methods: {
            fixNum(m) {
                return m ? money_filter(m, 2) : ''
            },
            clickMenu(menu) {
                if (menu === 'All') {
                    this.keyword = ''
                    this.navMenus = ['All']
                    this.page = 1
                    this._fetchData()
                    return
                }
                var last = this.navMenus.pop()
                while (last != menu && this.navMenus.length > 1) {
                    last = this.navMenus.pop()
                }
                this.navMenus.push(last)
                this.keyword = menu
                this._fetchData()
            },
            showUser(user) {
                this.selectedUser = user
                this.showUserDetail = true
            },
            showAllMiningInfo(data) {
                const total = parseFloat(data.totalMining) + parseFloat(data.subTotalMining)

                let detail = data.miningDetail
                let keys = ['SSS', 'SS', 'S', 'A', 'B']
                let detailData = [0, 0, 0, 0, 0]
                for (idx in keys) {
                    detailData[idx] += parseFloat(data.miningDetail[keys[idx]] || 0)
                    detailData[idx] += parseFloat(data.subMiningDetail[keys[idx]] || 0)
                    detail[keys[idx]] = detailData[idx]
                }
                this.selectedMiningData = detail
                this.selectedMiningTotal = total
                this.showMiningDetail = true
            },
            /** type 1为挖矿详情 2为下级挖矿详情 3为下级挖矿带来的收益 默认1 */
            showMiningInfo(data, type = 1) {
                if (type == 2) {
                    this.selectedMiningTotal = data.subTotalMining
                    this.selectedMiningData = data.subMiningDetail

                } else if (type == 3) {
                    this.selectedMiningTotal = data.totalReferralMining
                    this.selectedMiningData = data.totalReferralMiningDetail
                } else {
                    this.selectedMiningTotal = data.totalMining
                    this.selectedMiningData = data.miningDetail
                }

                this.showMiningDetail = true
            },

            search() {
                this.navMenus = ['All']
                if (this.keyword.length > 0) this.navMenus.push(this.keyword)
                this.page = 1
                this._fetchData()
            },
            showUserProfitDetail(key) {
                this.navMenus.push(key)
                this.page = 1
                this.keyword = key
                this._fetchData()
            },
            _checkRoles() {
                const self = this
                Meteor.call('getUserRoles', (err, res) => {
                    const role = res[0]
                    if (role != null) {
                        let roleId = role.role._id
                        if (role.user._id === Meteor.userId() &&
                            (roleId === Permissions.Proxy)) {
                            self.isProxy = true
                        }
                    }
                    this._fetchData()
                })
            },
            _fetchData() {


                let startTime = this.selectedDate && this.selectedDate.length == 2 ? this.selectedDate[0] : ''
                let endTime = this.selectedDate && this.selectedDate.length == 2 ? this.selectedDate[1] : ''

                const params = {
                    search: this.keyword,
                    offset: (this.page - 1) * this.pageSize,
                    limit: this.pageSize,
                    startTime: startTime,
                    endTime: endTime,
                    role: this.role,
                }
                const self = this;
                this.isLoading = true
                Meteor.call("admin_getMiningData", params, (err, res) => {
                    self.isLoading = false;
                    if (err) {

                    } else {
                        if (res.data && res.data._id) {
                            self.data = res.data
                            self.total = res.data.subUser.count;
                            self.dataList = []
                            let index = 0
                            res.data.subUser.list.forEach(u => {
                                ++index
                                u.index = index
                            })
                        } else {
                            self.data = {}
                            self.total = 0;
                            self.dataList = []
                            if (res.list && res.list.length > 0) {
                                self.dataList = res.list
                                self.total = res.count
                                let index = 0
                                self.dataList.forEach(u => {
                                    ++index
                                    u.index = index
                                })
                            }
                        }

                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .sub-title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(80, 80, 80, 1);
    }

    .main-title {
        margin-top: 16px;
        margin-bottom: 24px;
        font-size: 26px;
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
    }

    .el-table .child-row {
        background: #fafafa;
    }
</style>

<style lang="scss">
    .dialog-add {
        .el-dialog__body {
            padding-right: 40px;
        }

        .el-form-item {

            // margin-bottom: 4px;
            &:last-child {
                margin-top: 30px;
            }
        }
    }
</style>