<template>
    <!-- 推薦列表 -->
    <div>
        <!-- 1、標題模塊 -->
        <div class="title-group">
            <div class="main-title">{{$t('admin.areaData')}}</div>
        </div>

        <!-- 2、篩選模塊 -->
        <div style="display:flex;align-items:center;">
            <el-input v-model="keyword" :placeholder="$t('admin.searchUser')" style="width: 200px;"
                @keyup.enter.native="_fetchData()" />

            <el-select style="margin-left:15px;width: 200px;" clearable v-model="selectedArea" :placeholder="'地区选择'">
                <el-option v-for="area in areas" :key="area" :label="countrySymbol[area] || area" :value="area">
                </el-option>
            </el-select>

            <el-date-picker style="margin-left:15px;" type="datetimerange" v-model="selectedDate" :range-separator="$t('admin.to')"
                :start-placeholder="$t('admin.beginTime')" :end-placeholder="$t('admin.endTime')" :placeholder="$t('admin.selectTimeRange')"
                :picker-options="datePickerOptions">
            </el-date-picker>

            <el-button type="primary" @click="search()" style="height:34px;margin-left:10px;">{{$t('admin.search')}}</el-button>
        </div>

        <el-table :data="dataList" style="width:100%;margin-top: 20px;" border fit highlight-current-row
            v-loading="isLoading">

            <el-table-column label="No." sortable prop="index" min-width="50" align="center">
                <template slot-scope="{row}">
                    <span>{{row.index}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.userId')" min-width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{row._id}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.username')" min-width="180" align="center">
                <template slot-scope="{row}">
                    <a @click="showDetail(row)">{{row.username}}</a>
                </template>
            </el-table-column>

            <el-table-column :label="'地区'" min-width="150" align="center">
                <template slot-scope="{row}">
                    <div>{{row.status ? (countrySymbol[row.status.countryCode] || row.status.countryCode): '' }}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.profit', { var : 'LUSD'})" min-width="150" align="center">
                <template slot-scope="{row}">
                    <div>{{fixNum(row.statistics && row.statistics.profitLossData &&  (row.statistics.profitLossData.LUSD || 0)) }}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.mineProfit', { var : 'LUSD'})" min-width="150" align="center">
                <template slot-scope="{row}">
                    <div>{{fixNum(row.statistics && row.statistics.minedData &&  (row.statistics.minedData.LUSD || 0)) }}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.referralMineProfit', { var : 'LUCK'})" min-width="150" align="center">
                <template slot-scope="{row}">
                    <div>{{fixNum(row.statistics && row.statistics.referralMinedData &&  (row.statistics.referralMinedData.LUCK || 0)) }}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('recharge.title')" min-width="150" align="center">
                <template slot-scope="{row}">
                    <div v-for="key in Object.keys(row.statistics && row.statistics.depositData) || []" :key="key">
                        <div>{{key + "：" + fixNum(row.statistics.depositData[key])}}</div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('recharge.withdraw')" min-width="150" align="center">
                <template slot-scope="{row}">
                    <div v-for="key in Object.keys(row.statistics && row.statistics.withdrawData) || []" :key="key">
                        <div>{{key + "：" + fixNum(row.statistics.withdrawData[key])}}</div>
                    </div>
                </template>
            </el-table-column>
            
            <el-table-column :label="$t('admin.inviteCount')" min-width="150" prop="time" align="center">
                <template slot-scope="{row}">
                    <div>{{row.statistics && (row.statistics.subordinateCount || '')}}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.registerTime')" sortable min-width="180" prop="time" align="center">
                <template slot-scope="{row}">
                    <span>{{row.time}}</span>
                </template>
            </el-table-column>


        </el-table>

        <!-- 4、分頁模塊 -->
        <pagination :total="total" :page.sync="page" :limit.sync="pageSize" @pagination="_fetchData"
            style="margin-top: 16px;" />


        <el-dialog :title="$t('admin.userDetail')" :visible.sync="showUserDetail" append-to-body class="dialog-add" width="400px">
            <div style="display:flex;flex-dirction:row;">
                <div style="width: 400px;">
                    <div style="font-size:16px;font-weight:bold;margin-bottom: 20px;">{{$t('admin.userInfo')}}</div>
                    <div class="user-detail-item">{{$t('admin.userId') + '：'+ selectedUser._id || ''}}</div>
                    <div class="user-detail-item">{{$t('admin.username') + '：'+ selectedUser.username || ''}}</div>
                    <div v-if="!isService" class="user-detail-item">{{$t('admin.phone')+ selectedUser.mobileNum }}</div>
                    <div v-if="!isService" class="user-detail-item">{{$t('base.email')+'：'+ (selectedUser && selectedUser.emails ? (selectedUser.emails[0].address || '') : '')}}</div>
                    <div class="user-detail-item">{{$t('admin.nickname')+'：'+ selectedUser.nickname || ''}}</div>
                    <div class="user-detail-item">{{$t('admin.registerTime')+'：'+ selectedUser.time}}</div>
                    <div class="user-detail-item">{{$t('admin.registerType')+'：'+ selectedUser.registerType || ''}}</div>

                </div>
            </div>
        </el-dialog>


    </div>
</template>
<script>
    import moment from "moment/moment";
    import {
        dateFormat
    } from '/imports/utils/dateFormat'
    import Pagination from '/imports/ui/components/Pagination'
    import {
        mapGetters
    } from 'vuex'
    import {
        Permissions
    } from '/imports/api/account/services'
    import { TokenChangeType } from '../../../api/tokens/collections'
    import { money_filter } from '/imports/utils/money'
    import countrySymbol from '/imports/settings/countrySymbol'


    export default {
        name: "user-manage",
        components: {
            Pagination,
        },
        data() {
            return {
                dataList: [],
                isLoading: false,

                selectedUser: {},
                showUserDetail: false,

                selectedType: null,
                selectedArea: null,

                keyword: '',
                page: 1,
                pageSize: 10,

                total: 0,

                selectedRoleUser: '',
                selectedRole: '',

                role: '',
                isSuperAdmin: false,
                isAdmin: false,
                isService: false,

                editType: '',
                editAmount: '',
                selectedToken: '',
                selectedBalanceUser: null,
                allTypes: Object.keys(TokenChangeType),
                tokenType: '',

                none: '',

                needRefetch: false,

                areas: [],

                selectedDate: [moment().startOf('day').toDate(), moment().endOf('day').toDate()],
                countrySymbol,

                // 需要合并的符号
                needMergeAreas: [
                    ['vi', 'vi-VN']
                ],

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
            ...mapGetters(["user"]),
            tokenList() {
                return this.$store.state.user.tokens
            }
        },
        created() {
            this._checkRoles()
            this._fetchAreaData()
            this._fetchData()
        },
        methods: {
            fixNum(m) {
                return m ? money_filter(m, 2) : ''
            },
            isMe(userId) {
                return Meteor.userId() == userId
            },
            showSelect(user) {
                this.selectedRoleUser = user
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
            statAmount(array) {
                if (array != null && array.length > 0) {
                    let amount = 0
                    let bnbId = 'BNB'
                    this.tokenList.forEach(t => {
                        if (t.name === 'BNB' || t.symbol === 'BNB') {
                            bnbId = t._id
                        }
                    })
                    array.forEach(item => {
                        if (item.token === bnbId) {
                            amount += item.amount
                        }
                    })
                    return amount
                }
                return ''
            },
            search() {
                this.page = 1
                this._fetchData()
            },
            showDetail(user) {
                this.selectedUser = user
                this.showUserDetail = true
            },
            _checkRoles() {
                const self = this
                Meteor.call('getUserRoles', (err, res) => {
                    const role = res[0]
                    if (role != null) {
                        let roleId = role.role._id
                        self.role = roleId
                        if (role.user._id === Meteor.userId()) {
                            if (roleId === Permissions.SuperAdmin) {
                                self.isSuperAdmin = true
                            } else if (roleId === Permissions.Service) {
                                self.isService = true
                            } else if (roleId === Permissions.Admin) {
                                self.isAdmin = true
                            }
                        }
                    }
                    if (self.needRefetch) {
                        self._fetchData()
                        self.needRefetch = false
                    }
                })
            },
            getCountryCodePamras() {
                if (!this.selectedArea) return null
                let selectedAreas = []
                if (this.selectedArea) {
                    for (let i = 0;i < this.needMergeAreas.length; ++i) {
                        let mergeAreas = this.needMergeAreas[i]
                        if (mergeAreas.indexOf(this.selectedArea) != -1) {
                            selectedAreas = mergeAreas
                            break
                        }
                    }
                }

                return selectedAreas.length > 0 ? selectedAreas : [this.selectedArea]
            },
            setupCountryCodes() {
                let areas = this.areas
                for (let i = 0;i < this.needMergeAreas.length; ++i) {
                    let mergeAreas = this.needMergeAreas[i]
                    let hasIdx = []
                    for (let j = 0;j < mergeAreas.length; ++j) {
                        let findIdx = areas.indexOf(mergeAreas[j])
                        if (findIdx != -1) {
                            hasIdx.push(findIdx)
                        }
                    }
                    if (hasIdx.length > 1) {
                        hasIdx = hasIdx.sort()
                        for (let i = 0;i < hasIdx.length-1;++i) {
                            const idx = hasIdx[i]
                            areas.splice(idx - i, 1)
                        }
                    }
                }
                this.areas = areas

            },
            _fetchData() {


                let startTime = this.selectedDate && this.selectedDate.length == 2 ? this.selectedDate[0] : ''
                let endTime = this.selectedDate && this.selectedDate.length == 2 ? this.selectedDate[1] : ''

                let countryCodes = this.getCountryCodePamras()

                const params = {
                    user: this.keyword,
                    offset: (this.page - 1) * this.pageSize,
                    limit: this.pageSize,
                    startTime: startTime,
                    endTime: endTime,
                    role: this.role,

                    'countryCodes': countryCodes,
                    'statistics':{
                        'profitLossData':1,
                        'minedData':1,
                        'referralMinedData':1,
                        'depositData':1,
                        'withdrawData':1,
                        'mintData':1,
                        'subordinateCount':1
                    }
                }

                const self = this;
                this.isLoading = true
                Meteor.call("admin_getUserData", params, (err, res) => {
                    self.isLoading = false;
                    if (err) {

                    } else {
                        self.dataList = res.list
                        self.total = res.count
                        let index = 0
                        res.list.forEach(u => {
                            ++index
                            u.time = u.createdAt ? dateFormat(u.createdAt, 'yyyy-MM-dd hh:mm:ss') : ''
                            u.index = index
                        })
                    }
                });
            },
            _fetchAreaData() {
                Meteor.call('getAreas', (err, res) => {
                    this.areas = res
                    this.setupCountryCodes()
                })
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

    .user-detail-item {
        height: 32px;
        font-size: 14px;

    }
</style>