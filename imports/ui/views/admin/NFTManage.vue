<template>
    <!-- 推薦列表 -->
    <div>
        <!-- 1、標題模塊 -->
        <div class="title-group">
            <div class="main-title">{{$t('admin.nftManage')}}</div>
        </div>

        <!-- 2、篩選模塊 -->
        <div style="display:flex;align-items:center;">
            <el-input v-model="keyword" :placeholder="isService ? $t('admin.searchUser') : $t('admin.searchUserOrNFT')" style="width: 200px;"
                @keyup.enter.native="_fetchData()" />

            <el-select style="margin-left:15px;width: 120px;" clearable v-model="selectedBox" :placeholder="$t('admin.filtterBlindBox')">
                <el-option v-for="bbox in blindBoxes" :key="bbox._id" :label="bbox._id" :value="bbox._id">
                </el-option>
            </el-select>

            <el-date-picker style="margin-left:15px;" type="datetimerange" v-model="selectedDate" :range-separator="$t('admin.to')"
                :start-placeholder="$t('admin.beginTime')" :end-placeholder="$t('admin.endTime')" :placeholder="$t('admin.selectTimeRange')"
                :picker-options="datePickerOptions">
            </el-date-picker>

            <el-button type="primary" @click="search()" style="height:34px;margin-left:10px;">{{$t('admin.search')}}</el-button>

        </div>

        <div v-if="isSearchBySameToken && dataList.length > 0" class="stat-info">
            {{$t('admin.totalCurrentBalance') + totalCurrent + ' '+$t('admin.balanceChange') + totalChanged}}
        </div>

        <el-table :data="dataList" style="width:100%;margin-top: 20px;" border fit highlight-current-row
            v-loading="isLoading">

            <el-table-column label="No." sortable prop="index" min-width="50" align="center">
                <template slot-scope="{row}">
                    <span>{{row.index}}</span>
                </template>
            </el-table-column>

            <el-table-column v-if="!isService" label="Chain ID" min-width="180" align="center">
                <template slot-scope="{row}">
                    <a @click="showNFTDetail(row)">{{row.state ? (row.state.idOnChain || '') : ''}}</a>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.userId')" min-width="200" align="center">
                <template slot-scope="{row}">
                    <span>{{row.userInfo._id }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.username')" min-width="200" align="center">
                <template slot-scope="{row}">
                    <a @click="showUserDetail(row.userInfo)">{{row.userInfo.username}}</a>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.fromBlindBoxId')" sortable prop="bboxTokenPool.bboxId" min-width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{row.info.nftPool.bboxId || '' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="NFT Pool type" min-width="120" align="center">
                <template slot-scope="{row}">
                    <span>{{convertType(row.nftPoolType) }}</span>
                </template>
            </el-table-column>

            <el-table-column label="NFT Pool Level" min-width="120" align="center">
                <template slot-scope="{row}">
                    <span>{{row.nftPoolName }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.time')" sortable prop="createdAt" min-width="180" align="center">
                <template slot-scope="{row}">
                    <span>{{row.time}}</span>
                </template>
            </el-table-column>

            <el-table-column v-if="isSuperAdmin" :label="$t('admin.transferNFT')" min-width="80" align="center">
                <template slot-scope="{row}">
                    <div v-if="row.disable">disable</div>
                    <el-button v-else type="primary" @click="transferNFT(row)">{{$t('admin.transfer')}}</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!-- 4、分頁模塊 -->
        <pagination :total="total" :page.sync="page" :limit.sync="pageSize" @pagination="_fetchData"
            style="margin-top: 16px;" />


        <el-dialog :title="$t('admin.userDetail')" :visible.sync="isShowUserDetail" append-to-body class="dialog-add" width="800px">
            <div style="display:flex;flex-dirction:row;">
                <div style="width: 400px;">
                    <div style="font-size:16px;font-weight:bold;margin-bottom: 20px;">{{$t('admin.userInfo')}}</div>
                    <div class="user-detail-item">{{$t('admin.userId') + '：'+ selectedUser._id || ''}}</div>
                    <div class="user-detail-item">{{$t('admin.username') + '：'+ selectedUser.username || ''}}</div>
                    <div v-if="!isService" class="user-detail-item">{{$t('admin.phone')+ selectedUser.mobileNum || '' }}</div>
                    <div v-if="!isService" class="user-detail-item">{{$t('base.email')+'：'+ (selectedUser && selectedUser.emails ? (selectedUser.emails[0].address || '') : '')}}</div>
                    <div class="user-detail-item">{{$t('admin.nickname')+'：'+ (selectedUser.nickname || '')}}</div>
                    <div class="user-detail-item">{{$t('admin.role')+'：'+ (selectedUser.role || '')}}</div>
                    <div class="user-detail-item">{{$t('admin.lastRegisterTime')+'：'+ (selectedUser.lastLoginTime || '')}}</div>
                    <div class="user-detail-item">{{$t('admin.registerType')+'：'+ (selectedUser.registerType || '')}}</div>

                </div>
            </div>
        </el-dialog>

        <el-dialog :title="$t('admin.nftDetail')" :visible.sync="isShowNFTDetail" append-to-body class="dialog-add" width="800px">
            <div style="display:flex;flex-dirction:row;">
                <div style="width: 400px;">
                    <div style="font-size:16px;font-weight:bold;margin-bottom: 20px;">{{$t('admin.nftInfo')}}</div>
                    <div class="user-detail-item">{{'NFT ID：'+ selectedNFT.nftId || ''}}</div>
                    <div class="user-detail-item">
                        {{'Chain ID：'+ (selectedNFT.state ? (selectedNFT.state.idOnChain || '') : '') }}</div>
                    <div class="user-detail-item">
                        {{'Chain int ID：'+ (selectedNFT.state ? (selectedNFT.state.idOnChain2Int || '') : '') }}</div>
                    <div class="user-detail-item">
                        {{$t('admin.fromBlindBoxId') + '：'+ (selectedNFT.info ? (selectedNFT.info.nftPool.bboxId || '') : '')}}</div>
                    <div class="user-detail-item">{{$t('admin.time') + '：'+ selectedNFT.time || ''}}</div>
                </div>
                <div style="width: 400px;">
                    <div style="font-size:16px;font-weight:bold;margin-bottom: 20px;">{{$t('admin.nftPoolInfo')}}</div>
                    <div class="user-detail-item">{{'NFT Pool type：'+ convertType(selectedNFT.nftPoolType)}}</div>
                    <div class="user-detail-item">{{'NFT Pool level：'+ selectedNFT.nftPoolName || ''}}</div>
                    <div class="user-detail-item">
                        {{'Total：'+ (selectedNFT.nftInfo ? (selectedNFT.nftInfo.total || '') : '')}}</div>
                    <div class="user-detail-item">
                        {{'maxId：'+ (selectedNFT.nftInfo ? (selectedNFT.nftInfo.maxId || '') : '')}}</div>
                    <div class="user-detail-item">
                        {{'minId：'+ (selectedNFT.nftInfo ? (selectedNFT.nftInfo.minId || '') : '')}}</div>
                    <div class="user-detail-item">
                        {{'probability：'+
                        (selectedNFT.nftInfo ? (selectedNFT.nftInfo.info ? (selectedNFT.nftInfo.info.probability || '') : '') : '')}}
                    </div>
                    <div class="user-detail-item">
                        {{'hashrate：'+
                        (selectedNFT.nftInfo ? (selectedNFT.nftInfo.info ? (selectedNFT.nftInfo.info.hashrate || '') : '') : '')}}
                    </div>
                    <div class="user-detail-item">
                        {{'idPrefix：'+
                        (selectedNFT.nftInfo ? (selectedNFT.nftInfo.info ? (selectedNFT.nftInfo.info.idPrefix || '') : '') : '')}}
                    </div>


                    <div class="user-detail-item">
                        {{'harvest.foison：'+
                        (selectedNFT.nftInfo ? (selectedNFT.nftInfo.info ? (selectedNFT.nftInfo.info.harvest ? (selectedNFT.nftInfo.info.harvest.foison || '') : '') : ''):'')}}
                    </div>
                    <div class="user-detail-item">
                        {{'harvest.normal：'+
                        (selectedNFT.nftInfo ? (selectedNFT.nftInfo.info ? (selectedNFT.nftInfo.info.harvest ? (selectedNFT.nftInfo.info.harvest.normal || '') : '') : ''):'')}}
                    </div>
                    <div class="user-detail-item">
                        {{'harvest.poor：'+
                        (selectedNFT.nftInfo ? (selectedNFT.nftInfo.info ? (selectedNFT.nftInfo.info.harvest ? (selectedNFT.nftInfo.info.harvest.poor || '') : '') : ''):'')}}
                    </div>

                </div>
            </div>

        </el-dialog>

        <el-dialog :title="$t('admin.transferNFT')" :visible.sync="showTransferNFT" append-to-body class="dialog-add" width="500px">
            <el-form label-width="150px" status-icon>

                <el-form-item :label="$t('admin.transferChainId')">
                    <div>{{selectedNFT.state ? (selectedNFT.state.idOnChain || '') : ''}}</div>
                </el-form-item>

                <el-form-item :label="$t('admin.transferToUser')">
                    <el-input v-model="transferToUser" :placeholder="$t('admin.inputUserIdOrUsername')"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="showTransferNFT = false">{{$t('admin.cancel')}}</el-button>
                    <el-button type="primary" @click="confirmTransferNFT()" :disabled="!(transferToUser.length > 0)">{{$t('admin.confirm')}}
                    </el-button>
                </el-form-item>
            </el-form>
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
        NonFungibleTokenPoolType
    } from '/imports/api/nft/collections.js'
    import {
        Permissions
    } from '/imports/api/account/services'


    export default {
        name: "user-manage",
        components: {
            Pagination,
        },
        data() {
            return {
                dataList: [],
                nftPoolData: {},
                blindBoxes: [],
                isLoading: false,

                keyword: '',
                page: 1,
                pageSize: 10,

                total: 0,

                selectedUser: {},
                isShowUserDetail: false,

                isSuperAdmin: false,
                isService: false,

                selectedBox: '',

                selectedDate: [moment().startOf('day').toDate(), moment().endOf('day').toDate()],

                isSearchBySameToken: false,

                allTypes: Object.keys(NonFungibleTokenPoolType),
                allTypeValueKeys: {},


                selectedTx: {},

                isShowNFTDetail: false,
                selectedNFT: {},

                transferToUser: '',

                showTransferNFT: false,

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

        },
        created() {
            this._checkRoles()
            this._fetchBlindBox()
            this._fetchNFTPool()
        },
        methods: {
            transferNFT(nft) {
                this.selectedNFT = nft
                this.showTransferNFT = true
            },
            confirmTransferNFT() {
                Meteor.call('admin_moveNft', this.selectedNFT._id, this.transferToUser, (err, res) => {
                    if (err) {
                        this.toasterErr(err.error)
                    } else {
                        this.toasterSuccess(this.$t('base.success'))
                        this.showTransferNFT = false
                        this._fetchData()
                        this.transferToUser = ''
                    }
                })
            },
            showUserDetail(user) {
                this.selectedUser = user
                this.isShowUserDetail = true
            },
            showNFTDetail(nft) {
                this.selectedNFT = nft
                this.isShowNFTDetail = true
            },
            convertType(value) {
                if (Object.keys(this.allTypeValueKeys).length == 0) {
                    this.allTypes.forEach(k => {
                        this.allTypeValueKeys[NonFungibleTokenPoolType[k]] = k
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
                        if (role.user._id === Meteor.userId()){
                            if (role.role._id === Permissions.SuperAdmin) {
                                self.isSuperAdmin = true
                            } else if (role.role._id === Permissions.Service) {
                                self.isService = true
                            }
                        }
                    }
                })
            },
            _fetchBlindBox() {

                const self = this;
                Meteor.call("admin_getBlindbox", null, (err, res) => {
                    self.blindBoxes = res
                })
            },
            _fetchNFTPool() {
                const self = this;
                Meteor.call("admin_getNFTPools", null, (err, res) => {
                    const list = res
                    list.forEach(p => {
                        self.nftPoolData[p._id] = p
                    })
                    if (list.length > 0) {
                        this._fetchData()
                    }
                })
            },
            _fetchData() {
                if (Object.keys(this.nftPoolData).length == 0) {
                    this._fetchNFTPool()
                    return
                }

                if (this.isService) {
                    if (!this.keyword || this.keyword.length === 0) {
                        this.dataList = []
                        this.total = 0
                        return
                    }
                }


                let startTime = this.selectedDate && this.selectedDate.length == 2 ? this.selectedDate[0] : ''
                let endTime = this.selectedDate && this.selectedDate.length == 2 ? this.selectedDate[1] : ''

                const params = {
                    box: this.selectedBox,
                    startTime: startTime,
                    endTime: endTime,
                    offset: (this.page - 1) * this.pageSize,
                    limit: this.pageSize,
                    search: this.keyword,
                }
                const self = this;
                this.isLoading = true

                Meteor.call("admin_getNFTItems", params, (err, res) => {
                    self.isLoading = false;
                    if (err) {

                    } else {
                        let index = 0;
                        self.dataList = res.list[0] ? res.list.map(d => {
                            index = index + 1;
                            d.index = index;
                            d.time = d.createdAt ? dateFormat(d.createdAt, 'yyyy-MM-dd hh:mm:ss') : ''
                            if (d.info.totalNftPool) {
                                const nftPoolId = d.info.totalNftPool._id
                                const nftInfo = this.nftPoolData[nftPoolId]
                                d.nftInfo = nftInfo
                                d.nftPoolType = nftInfo.info.type
                                d.nftPoolName = nftInfo.info.name
                            }
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
