<template>
    <!-- 推薦列表 -->
    <div>
        <!-- 1、標題模塊 -->
        <div class="title-group">
            <div class="main-title">{{$t('admin.transactionHistoryTitle')}}</div>
        </div>

        <!-- 2、篩選模塊 -->
        <div style="display:flex;align-items:center;">
            <el-input v-model="keyword" :placeholder="$t('admin.searchUser')" style="width: 200px;"
                @keyup.enter.native="_fetchData()" />

            <el-select style="margin-left:15px;width: 120px;" clearable v-model="selectedToken" :placeholder="$t('admin.selectToken')">
                <el-option v-for="token in tokenList" :key="token._id" :label="token._id" :value="token._id">
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

            <el-table-column :label="$t('admin.userId')" min-width="200" align="center">
                <template slot-scope="{row}">
                    <span>{{(row.userInfo[0] || {})._id || '' }}</span>
                </template>
            </el-table-column>

            <el-table-column v-if="!isService" :label="$t('admin.username')" min-width="200" align="center">
                <template slot-scope="{row}">
                    <span>{{(row.userInfo[0] || {}).username || ''}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.transactionId')" min-width="180" align="center">
                <template slot-scope="{row}">
                    <div v-if="isService">{{row.txId}}</div>
                    <a v-else @click="showTxDetail(row)">{{row.txId}}</a>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.token')" min-width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{row.token}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.amount')" sortable prop="amount" min-width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{row.amount }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.transactionType')" min-width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{convertType(row.type) }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.time')" sortable prop="createdAt" min-width="180" align="center">
                <template slot-scope="{row}">
                    <span>{{row.time}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.status')" min-width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{row.responseData ? row.responseData.status : '' }}</span>
                </template>
            </el-table-column>

        </el-table>

        <!-- 4、分頁模塊 -->
        <pagination :total="total" :page.sync="page" :limit.sync="pageSize" @pagination="_fetchData"
            style="margin-top: 16px;" />

        <el-dialog :title="$t('admin.transactionDetail')" :visible.sync="isShowTxDetail" append-to-body class="dialog-add" width="800px">
            <div style="display:flex;flex-dirction:row;">
                <div style="width: 300px;">
                    <div style="font-size:16px;font-weight:bold;margin-bottom: 20px;">{{$t('admin.userInfo')}}</div>
                    <div class="user-detail-item">
                        {{$t('admin.userId') + '：'+ (selectedTx.userInfo ? (selectedTx.userInfo[0] ? (selectedTx.userInfo[0]._id || '') : '') : '')}}</div>
                    <div v-if="!isService" class="user-detail-item">
                        {{$t('admin.username') + '：'+ (selectedTx.userInfo ? (selectedTx.userInfo[0] ? (selectedTx.userInfo[0].username || '') : '') : '')}}</div>
                    <div class="user-detail-item" v-for="info in userTotalTokenInfo" :key="info.type">
                        {{`${zh.my.balanceRecord[info.type.toLowerCase()] || info.type.toLowerCase()}: ${info.changed.toString()}`}}
                    </div>
                    <div class="user-detail-item">
                        {{`${$t('admin.balance')}: ${bal.toString()}`}}</div>
                    <div class="user-detail-item">
                        {{`${$t('admin.total')}: ${totalAmount.toString()}`}}</div>
                    <div class="user-detail-item" v-for="info in userTotalArticleInfo" :key="info.type">
                        {{`${info.article.name['zh-TW']} ${zhArticle[info.type]}: ${info.number}`}}</div>

                </div>
                <div style="width: 500px;">
                    <div style="font-size:16px;font-weight:bold;margin-bottom: 20px;">{{$t('admin.transactionInfo')}}</div>
                    <div class="user-detail-item">{{$t('admin.transactionType') + '：'+ convertType(selectedTx.type)}}</div>
                    <div class="user-detail-item">
                        {{ 'type：'+ (selectedTx.responseData ? (selectedTx.responseData.type || '') : '')}}</div>
                    <div class="user-detail-item">{{$t('admin.token') + '：'+ selectedTx.token}}</div>
                    <div class="user-detail-item">{{$t('admin.moneyAmount') + '：'+ selectedTx.amount}}</div>
                    <div class="user-detail-item">{{$t('admin.transactionId')+'：'+ selectedTx.txId }}</div>
                    <div v-if="(selectedTx.type || 1) == 1" class="user-detail-item">
                        {{$t('recharge.rechargeAddress')+ (selectedTx.responseData ? (selectedTx.responseData.source_address || '') : '')}}
                    </div>
                    <div v-else class="user-detail-item">
                        {{$t('recharge.withdrawAddress')+ (selectedTx.responseData ? (selectedTx.responseData.address || '') : '')}}</div>

                    <div class="user-detail-item">{{$t('admin.time') + '：'+ selectedTx.time}}</div>
                    <div class="user-detail-item">
                        {{ 'Memo：'+ (selectedTx.responseData ? (selectedTx.responseData.memo || '') : '')}}</div>
                    <div class="user-detail-item">
                        {{ $t('admin.status') + '：'+ (selectedTx.responseData ? (selectedTx.responseData.status || '') : '')}}</div>
                    <div class="user-detail-item">
                        风险：
                        <pre
                            style="color: red;">{{`${stateCheck[0] && "充值 &lt; 提现\n" || ''}${stateCheck[1] && "种植 &lt; 收获\n" || ''}${stateCheck[2] && "种植 + 种子消耗 &lt; 收获\n" || ''}${bal && bal.minus(totalAmount).abs().gt(0.01) && "总计 !== 余额\n" || ''}`}}</pre>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {
        dateFormat
    } from '/imports/utils/dateFormat'
    import Pagination from '/imports/ui/components/Pagination'
    import {
        mapGetters
    } from 'vuex'
    import {
        TransactionType
    } from '/imports/api/transactions/collections.js'
    import {
        Permissions
    } from '/imports/api/account/services'
    import moment from "moment/moment";
    import zh from "/imports/ui/lang/zh-TW/index"


    export default {
        name: "user-manage",
        components: {
            Pagination,
        },
        data() {
            return {
                zhArticle: {
                    SystemChange: "系统修改",
                    Consume: "合成消耗",
                    Make: "生成",
                    Cultivate: "种植"
                },
                zh,
                stateCheck: [true, true, true, true],
                dataList: [],
                isLoading: false,

                keyword: '',
                page: 1,
                pageSize: 10,

                total: 0,
                totalAmount: Decimal(0),


                selectedToken: '',

                selectedDate: [moment().startOf('day').toDate(), moment().endOf('day').toDate()],


                allTypes: Object.keys(TransactionType),
                allTypeValueKeys: {},


                selectedTx: {},

                role: '',
                isProxy: false,
                isService: false,

                isShowTxDetail: false,
                userTotalTokenInfo: [],
                userTotalArticleInfo: [],
                bal: Decimal(0),

                datePickerOptions: {
                    shortcuts: [{
                        text: 'All',
                        onClick(picker) {
                            picker.$emit('pick', []);
                        }
                    }, {
                        text: this.$t('admin.dayBefore'),
                        onClick(picker) {
                            const end = new Date(moment().startOf('day').add(24 * 60 * 60 * 1000))
                            const start = new Date(moment().startOf('day'))
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: this.$t('admin.threeDayBefore'),
                        onClick(picker) {
                            const end = moment().endOf('day').toDate();
                            const start = moment().start('day').subtract(2, 'day').toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: this.$t('admin.weekBefore'),
                        onClick(picker) {
                            const end = moment().endOf('day').toDate();
                            const start = moment().start('day').subtract(6, 'day').toDate();
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
            },
        },
        created() {
            this._checkRoles()
            // this._fetchData()
        },
        methods: {
            showTxDetail(tx) {
                this.userTotalTokenInfo = []
                this.selectedTx = tx
                this.isShowTxDetail = true
                this.totalAmount = Decimal(0)
                let deposit = Decimal(0)
                let withdraw = Decimal(0)
                this.cultivate = Decimal(0)
                this.payout = Decimal(0)
                this.seed_cultivate = Decimal(0)
                Meteor.call("admin_getBalance", tx.user, tx.token, (err, res) => {
                    if (res) {
                        this.bal = res
                    }
                })
                Meteor.call('admin_getTokenChangeHistorySum', tx.user, tx.token, (err, res) => {
                    if (res) {
                        this.userTotalTokenInfo = res
                        res.forEach(r => {
                            this.totalAmount = this.totalAmount.add(r.changed)
                            if (r.type === "Deposit")
                                deposit = Decimal(r.changed).abs()
                            if (r.type === "Withdraw")
                                withdraw = Decimal(r.changed).abs()
                            if (r.type === "Cultivate")
                                this.cultivate = Decimal(r.changed).abs()
                            if (r.type === "Payout")
                                this.payout = Decimal(r.changed).abs()
                        })
                        this.stateCheck[0] = withdraw.gt(deposit)
                        this.stateCheck[1] = this.payout.gt(this.cultivate)
                        this.stateCheck[2] = this.payout.gt(this.cultivate.add(this.seed_cultivate))
                    }
                })
                Meteor.call('admin_getArticleRecordSum', tx.user, (err, res) => {
                    if (res) {
                        this.userTotalArticleInfo = res
                        res.forEach(r => {
                            if (r.type === "Cultivate") {
                                this.seed_cultivate = Decimal(r.number).abs()
                            }
                        })
                    }
                    this.stateCheck[2] = this.payout.gt(this.cultivate.add(this.seed_cultivate))
                })
            },
            convertType(value) {
                if (Object.keys(this.allTypeValueKeys).length == 0) {
                    this.allTypes.forEach(k => {
                        this.allTypeValueKeys[TransactionType[k]] = k
                    })
                }
                return this.allTypeValueKeys[value]
            },
            search() {
                this.page = 1
                this._fetchData()
            },
            _checkRoles() {
                const self = this
                Meteor.call('getUserRoles', (err, res) => {
                    const role = res[0]
                    if (role != null) {
                        let roleId = role.role._id
                        self.role = roleId
                        if (role.user._id === Meteor.userId()) {
                            if (roleId === Permissions.Proxy) {
                                self.isProxy = true
                            } else if (roleId === Permissions.Service) {
                                self.isService = true
                            }
                        }
                    }
                    this._fetchData()
                })
            },
            _fetchData() {
                let startTime = this.selectedDate && this.selectedDate.length == 2 ? this.selectedDate[0] : ''
                let endTime = this.selectedDate && this.selectedDate.length == 2 ? this.selectedDate[1] : ''

                if (this.isService) {
                    if (!this.keyword || this.keyword.length === 0) {
                        this.dataList = []
                        this.total = 0
                        return
                    }
                }

                if (this.isService) {
                    // 客服只能搜索当前时间31天内的内容
                    if (startTime === '' || startTime < (new Date()).getTime() - 3600 * 1000 * 24 * 31) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
                        startTime =  start
                        endTime = end
                    }
                }

                const params = {
                    token: this.selectedToken,
                    startTime: startTime,
                    endTime: endTime,
                    offset: (this.page - 1) * this.pageSize,
                    limit: this.pageSize,
                    search: this.keyword,
                    role: this.role,
                }
                const self = this;
                this.isLoading = true
                Meteor.call("admin_getTransactionHistory", params, (err, res) => {
                    self.isLoading = false;
                    if (err) {

                    } else {
                        let index = 0;
                        self.dataList = res.list[0] ? res.list.map(d => {
                            index = index + 1;
                            d.index = index;
                            d.time = d.createdAt ? dateFormat(d.createdAt, 'yyyy-MM-dd hh:mm:ss') : ''
                            return d;
                        }) : [];
                        self.total = res.count;
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
    .user-detail-item {
        height: 32px;
        font-size: 14px;
        margin-top: 15px;
    }

    .stat-info {
        background: #ffffff;
        // height: 45px;
        margin-top: 20px;
        // width: auto;
        padding: 10px;
    }
</style>