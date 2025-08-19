<template>
    <!-- 推薦列表 -->
    <div>
        <!-- 1、標題模塊 -->
        <div class="title-group">
            <div class="main-title">{{$t('admin.gameHistory')}}</div>
        </div>

        <!-- 2、篩選模塊 -->
        <div style="display:flex;align-items:center;">
            <el-input v-model="keyword" :placeholder="$t('admin.searchUser')" style="width: 200px;"
                @keyup.enter.native="_fetchData()" />

            <el-select style="margin-left:15px;width: 120px;" clearable v-model="selectedType" :placeholder="'游戏类型'">
                <el-option v-for="type in gameTypes" :key="type" :label="setupGameType(type)" :value="type">
                </el-option>
            </el-select>

            <el-date-picker style="margin-left:15px;" type="datetimerange" v-model="selectedDate" :range-separator="$t('admin.to')"
                :start-placeholder="$t('admin.beginTime')" :end-placeholder="$t('admin.endTime')" :placeholder="$t('admin.selectTimeRange')"
                :picker-options="datePickerOptions">
            </el-date-picker>

            <el-button type="primary" @click="search()" style="height:34px;margin-left:10px;">{{$t('admin.search')}}</el-button>

        </div>

        <div v-if="totalData" class="stat-info">
            <div class="mt-2 ml-5">{{$t('admin.total')}}</div>
            <div class="ml-5 mt-1">
                <div>{{$t('admin.totalCost') + fixNum(totalData.totalCost)}}</div>
                <div>{{$t('admin.totalPayout') + fixNum(totalData.totalPayout)}}</div>
                <div>{{$t('admin.totalProfit') + fixNum(totalData.totalPayout - totalData.totalCost)}}</div>
            </div>
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
                    <span>{{row.userData.userInfo.id || ''}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.username')" min-width="200" align="center">
                <template slot-scope="{row}">
                    <span>{{row.userData.userInfo.name || ''}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.gameType')" min-width="100" align="center">
                <template slot-scope="{row}">
                    <div>{{setupGameType(row.userData.settleType)}}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.settleDirection')" min-width="100" align="center">
                <template slot-scope="{row}">
                    <div>{{setupGameDirection(row)}}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('my.taskCenter.landId')" min-width="100" align="center">
                <template slot-scope="{row}">
                    <a @click="showLandDetail(row)">{{row.userData.slot.land.state.idOnChain || ''}}</a>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.status')" min-width="80" align="center">
                <template slot-scope="{row}">
                    <div>{{row.status == 1 ? $t('admin.finished') : $t('admin.unfinish')}}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.cost')" min-width="120" align="center">
                <template slot-scope="{row}">
                    <div>{{fixNum(row.userData.seed.price * row.userData.number)}}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.payout')" min-width="120" align="center">
                <template slot-scope="{row}">
                    <div>{{row.userData.result ? fixNum(row.userData.result.totalPayout) : ''}}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.gameProfit')" min-width="120" align="center">
                <template slot-scope="{row}">
                    <div>{{row.userData.result ? fixNum(row.userData.result.totalPayout - row.userData.seed.price * row.userData.number) : ''}}</div>
                </template>
            </el-table-column>


            <el-table-column :label="$t('admin.time')" sortable prop="createdAt" min-width="180" align="center">
                <template slot-scope="{row}">
                    <span>{{row.time}}</span>
                </template>
            </el-table-column>

        </el-table>

        <!-- 4、分頁模塊 -->
        <pagination :total="total" :page.sync="page" :limit.sync="pageSize" @pagination="_fetchData"
            style="margin-top: 16px;" />



        <el-dialog :title="$t('admin.nftDetail')" :visible.sync="isShowNFTDetail" append-to-body class="dialog-add" width="400px">
            <div style="display:flex;flex-dirction:row;">
                <div style="width: 400px;">
                    <div style="font-size:16px;font-weight:bold;margin-bottom: 20px;">{{$t('admin.nftInfo')}}</div>
                    <div class="user-detail-item">{{'NFT ID：'+ selectedNFT.nftId || ''}}</div>
                    <div class="user-detail-item">
                        {{'Chain ID：'+ (selectedNFT.state ? (selectedNFT.state.idOnChain || '') : '') }}</div>
                    <div class="user-detail-item">
                        {{'Chain int ID：'+ (selectedNFT.state ? (selectedNFT.state.idOnChain2Int || '') : '') }}</div>
                        <div class="user-detail-item">
                        {{'Name' + '：'+ (selectedNFT.info ? (selectedNFT.info.nftPool.name || '') : '')}}</div>
                    <div class="user-detail-item">
                        {{$t('admin.fromBlindBoxId') + '：'+ (selectedNFT.info ? (selectedNFT.info.nftPool.bboxId || '') : '')}}</div>
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
        TokenChangeType
    } from '/imports/api/tokens/collections.js'
    import {
        Permissions
    } from '/imports/api/account/services'
    import { money_filter } from '/imports/utils/money'


    export default {
        name: "user-manage",
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

                // 总盈亏 总花费
                totalData: null,

                selectedToken: '',

                allTypeValueKeys: {},
                selectedType: null,

                selectedDate: [moment().startOf('day').toDate(), moment().endOf('day').toDate()],

                isShowNFTDetail: false,
                selectedNFT: {},

                role: '',
                isProxy: false,
                isService: false,

                gameTypes: [0,1,2],

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
            },
            allTypes() {
                let types = Object.keys(TokenChangeType)
                if (this.isService) {
                    let proxyRewardIdx = types.indexOf("ProxyReward")
                    if (proxyRewardIdx != -1) {
                        types.splice(proxyRewardIdx, 1)
                    }
                    let proxyBuyBackIdx = types.indexOf("ProxyBuyBack")
                    if (proxyBuyBackIdx != -1) {
                        types.splice(proxyBuyBackIdx, 1)
                    }
                }
                return types
            }

        },
        created() {
            this._checkRoles()
        },
        methods: {
            fixNum(num) {
                return num ? money_filter(num, 2) : ''
            },
            setupGameType(type) {
                if (type === 0) {
                    return this.$t('admin.random')
                } else if (type === 1) {
                    return this.$t('admin.btcWind')
                } else if (type === 2) {
                    return this.$t('admin.ethRain')
                }
                return ''
            },
            setupGameDirection(data) {
                let direction = data.userData.settleDirection
                if (direction) {
                    if (direction === 1) {
                        return this.$t('admin.bullish')
                    } else if (direction === -1) {
                        return this.$t('admin.bearish')
                    }
                }
                return ''
            },
            showLandDetail(data) {
                this.selectedNFT = data.userData.slot.land
                this.isShowNFTDetail = true
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
                        if (role.user._id === Meteor.userId()){
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
                    // 客服只能搜索当前时间31天内的内容
                    if (startTime === '' || startTime < (new Date()).getTime() - 3600 * 1000 * 24 * 31) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
                        startTime =  start
                        endTime = end
                    }
                }

                let params = {
                    token: this.selectedToken,
                    
                    startTime: startTime,
                    endTime: endTime,
                    offset: (this.page - 1) * this.pageSize,
                    limit: this.pageSize,
                    search: this.keyword,
                    role: this.role,
                }
                if (this.selectedType) {
                    params.type = this.selectedType
                }
                const self = this;
                this.isLoading = true


                Meteor.call("admin_getGameHistory", params, (err, res) => {
                    self.isLoading = false;
                    if (err) {

                    } else {
                        let index = 0;
                        self.dataList = res.list.map(d => {
                            index = index + 1;
                            d.index = index;
                            d.time = d.createdAt ? dateFormat(d.createdAt, 'yyyy-MM-dd hh:mm:ss') : ''
                            return d;
                        });
                        self.total = res.count;
                        self.totalData = res.total
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

    }

    .stat-info {
        background: #ffffff;
        // height: 45px;
        margin-top: 20px;
        // width: auto;
        padding: 10px;
    }

</style>