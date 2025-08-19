<template>
    <!-- 推薦列表 -->
    <div>
        <!-- 1、標題模塊 -->
        <div class="title-group">
            <div class="main-title">{{'回购审批'}}</div>
        </div>


        <!-- 申请回购 -->
        <div class="d-flex flex-column align-start">
            <el-button type="primary"  @click="isShowSetupInfo = true" class="my-5 ml-1" style="height:34px;">设置联系方式</el-button>
            <div class="d-flex flex-row justify-center align-center">
                <el-button type="primary"  @click="isShowApplyBuyBack = true" class="my-5 ml-1" style="height:34px;">申请回购</el-button>
                <div class="ml-5">{{'可申请回购额度：' + canBuyBackAmount + ' LUCK'}}</div>
            </div>
        </div>

        <!-- 2、篩選模塊 -->
        <div class="mt-5" style="display:flex;align-items:center;">
            <el-input v-model="keyword" :placeholder="$t('admin.searchUser')" style="width: 200px;"
                @keyup.enter.native="_fetchData()" />

            <el-button type="primary" @click="search()" style="height:34px;margin-left:10px;">{{$t('admin.search')}}</el-button>
        </div>

        <el-table :data="dataList" style="width:100%;margin-top: 20px;" border fit highlight-current-row
            v-loading="isLoading">

            <el-table-column label="No." sortable prop="index" min-width="50" align="center">
                <template slot-scope="{row}">
                    <span>{{row.index}}</span>
                </template>
            </el-table-column>

                <!-- _id: String,
    user: String,
    token: String,          //回购币种
    swapToken: String,      //兑换币种
    amount: Decimal,        //申请额度
    swapAmount: Decimal,   //兑换额度
    mineAmount: Decimal,    //挖矿数
    buybackPrice: Decimal,  //回购价格
    buybackRate: Decimal,   //回购比例
    total: Decimal,         //总回购额度
    reason: String,
    time: Date,             //回购周期-开始时间
    status: {
        type: SimpleSchema.Integer,
        allowedValues: Object.values(ProxyBuybackOrderStatus)
    },
    checkUser: String,      //审核人
    createdAt: Date,        //提交时间
    updatedAt: Date         //审核时间 -->

            <el-table-column :label="$t('admin.userId')" min-width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{row.user}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="'兑换币种'" min-width="180" align="center">
                <template slot-scope="{row}">
                    <div class="d-flex flex-row">
                        <div>{{row.token}}</div>
                        <v-icon>swap-horizontal</v-icon>
                        <div>{{row.swapToken}}</div>
                    </div>
                </template>
            </el-table-column>

                        <el-table-column :label="$t('admin.username')" min-width="180" align="center">
                <template slot-scope="{row}">
                    <a @click="showDetail(row)">{{row.username}}</a>
                </template>
            </el-table-column>

        </el-table>

        <!-- 4、分頁模塊 -->
        <pagination :total="total" :page.sync="page" :limit.sync="pageSize" @pagination="_fetchData"
            style="margin-top: 16px;" />


        <el-dialog :title="$t('admin.userDetail')" :visible.sync="showUserDetail" append-to-body class="dialog-add" width="800px">
            <div style="display:flex;flex-dirction:row;">
                <div style="width: 400px;">
                    <div style="font-size:16px;font-weight:bold;margin-bottom: 20px;">{{$t('admin.userInfo')}}</div>
                    <div class="user-detail-item">{{$t('admin.userId') + '：'+ selectedUser._id || ''}}</div>
                    <div class="user-detail-item">{{$t('admin.username') + '：'+ selectedUser.username || ''}}</div>
                    <div v-if="!isService" class="user-detail-item">{{$t('admin.phone')+ selectedUser.mobileNum }}</div>
                    <div v-if="!isService" class="user-detail-item">{{$t('base.email')+'：'+ (selectedUser && selectedUser.emails ? (selectedUser.emails[0].address || '') : '')}}</div>
                    <div class="user-detail-item">{{$t('admin.nickname')+'：'+ selectedUser.nickname}}</div>
                    <div v-if="!isService" class="user-detail-item">{{$t('admin.role')+'：'+ selectedUser.role}}</div>
                    <div class="user-detail-item">{{$t('admin.registerTime')+'：'+ selectedUser.time}}</div>
                    <div class="user-detail-item">{{$t('admin.lastRegisterTime')+'：'+ selectedUser.lastLoginTime}}</div>
                    <div class="user-detail-item">{{$t('admin.registerType')+'：'+ selectedUser.registerType || ''}}</div>

                </div>
                <div style="width: 400px;">
                    <div style="font-size:16px;font-weight:bold;margin-bottom: 20px;">{{$t('admin.balance')}}</div>
                    <div v-for="b in selectedUser.balance" :key="b._id+b.token">
                        <div class="user-detail-item">{{b.token + "：" + b.amount}}</div>
                    </div>
                    <div class="user-detail-item">
                        {{$t('admin.casting') + '：'+ (selectedUser.userStatistical != null ? (selectedUser.userStatistical.mintCount || '') : '')}}
                    </div>
                    <div class="user-detail-item">
                        {{$t('admin.castingCost')+'：'+ (selectedUser.userStatistical != null ? (selectedUser.userStatistical.mintConsumeAmount || '') : '')}}
                    </div>
                    <div class="user-detail-item">
                        {{ $t('recharge.title') + '：'+ selectedUser.myDeposit }}
                    </div>
                </div>
            </div>
        </el-dialog>

        <el-dialog :title="'申请回购'" :visible.sync="isShowApplyBuyBack" append-to-body class="dialog-add" width="500px">
            <el-form label-width="150px" status-icon>

                <el-form-item :label="'可申请回购额度'">
                    <div class="ml-5">{{canBuyBackAmount + ' LUCK'}}</div>
                </el-form-item>

                <el-form-item :label="$t('admin.amount')">
                    <el-input v-model="buyBackAmount" :placeholder="'输入回购额度'"></el-input>
                </el-form-item>


                

                <el-form-item :label="'截止时间'">
                    <div>2022-6-21 00:00:00</div>
                </el-form-item>

                <el-form-item>
                    <el-button @click="isShowApplyBuyBack = false">{{$t('admin.cancel')}}</el-button>
                    <el-button type="primary" @click="applyBuyBack()"
                        :loading="isBuyBackLoading"
                        :disabled="!(buyBackAmount > 0.0)">{{$t('admin.confirm')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


        <el-dialog :title="'设置联系方式'" :visible.sync="isShowSetupInfo" append-to-body class="dialog-add" width="500px">
            <el-form label-width="150px" status-icon>


                <el-form-item :label="'手机号'">
                    <el-input v-model="phone" :placeholder="'输入手机号'"></el-input>
                </el-form-item>

                <el-form-item :label="'Email'">
                    <el-input v-model="email" :placeholder="'输入Email'"></el-input>
                </el-form-item>

                <el-form-item :label="'Telegram'">
                    <el-input v-model="telegram" :placeholder="'输入Telegram号码'"></el-input>
                </el-form-item>

                <el-form-item :label="'LINE'">
                    <el-input v-model="line" :placeholder="'输入LINE号码'"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="isShowSetupInfo = false">{{$t('admin.cancel')}}</el-button>
                    <el-button type="primary" @click="saveInfo()"
                        :loading="isBuyBackLoading">{{'保存'}}
                    </el-button>
                </el-form-item>
            </el-form>
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
        Permissions
    } from '/imports/api/account/services'
    import { TokenChangeType } from '../../../api/tokens/collections'


    export default {
        name: "user-manage",
        components: {
            Pagination,
        },
        data() {
            return {
                dataList: [],
                isLoading: false,
                isBuyBackLoading: false,

                isShowSetupInfo: false,
                isShowApplyBuyBack: false,

                selectedUser: {},
                showUserDetail: false,

                canBuyBackAmount: 0,

                keyword: '',
                page: 1,
                pageSize: 10,

                phone: '',
                email: '',
                telegram: '',
                line: '',

                total: 0,

                roles: [this.$t('admin.deleteRole')],
                selectedRoleUser: '',
                selectedRole: '',

                role: '',
                isSuperAdmin: false,
                isAdmin: false,
                isService: false,

                editType: '',
                buyBackAmount: '',
                selectedToken: '',
                selectedBalanceUser: null,
                showEditBalance: false,
                allTypes: Object.keys(TokenChangeType),
                tokenType: '',

                none: '',

                needRefetch: false,
            }
        },
        computed: {
            ...mapGetters(["user"]),
            tokenList() {
                return this.$store.state.user.tokens
            },

        },
        watch: {
            user(newVal) {
                if (newVal) {
                    this.phone = newVal.contacts.Mobile
                    this.email = newVal.contacts.Email
                    this.telegram = newVal.contacts.Telegram
                    this.line = newVal.contacts.Line
                }
            }  
        },
        created() {
            this._checkRoles()
            this.fetchUserWeekly()
            this._fetchData()
        },
        methods: {
            applyBuyBack() {
                this.isBuyBackLoading = true
                Meteor.call('admin_proxyBuyback', this.buyBackAmount, function(error, success) { 
                    this.isBuyBackLoading = false
                    if (error) { 
                        console.log('error', error); 
                    }
                    if (success) { 
                         console.log('success', success);
                    } 
                });
            },
            saveInfo() {

                const contacts = {
                    Mobile: this.phone,
                    Email: this.email,
                    Telegram: this.telegram,
                    Line: this.line
                }

                const self = this;
                Meteor.call('setAllContacts', contacts, function(error, success) { 
                    if (error) { 
                        console.log('error', error); 
                    }
                    if (success) {
                        self.isShowSetupInfo = false
                        self.toasterSuccess(self.$t('base.success'))
                    } 
                });
            },
            fetchUserWeekly() {
                
                const self = this;
                Meteor.call('admin_getUsersCanBuyAmount', {}, function(error, res) { 
                    if (res.code === 0) {
                        self.canBuyBackAmount = res.data.canBuyBackAmount
                    } 
                });
            },
            isMe(userId) {
                return Meteor.userId() == userId
            },
            showSelect(user) {
                this.selectedRoleUser = user
            },
            selectRole(role) {
                this.setupUserRole(this.selectedRoleUser, role === this.$t('admin.deleteRole') ? '' : role)
            },
            banUser(user) {
              Meteor.call("admin_banUser", user._id, (err, res) => {
                if (err) {
                  this.toasterErr(err.error)
                } else {
                  this.toasterSuccess(this.$t('base.success'))
                  this._fetchData();
                }
              })
            },
            setJoinedGroup(user) {
              Meteor.call("admin_setJoinedGroup", user._id, (err, res) => {
                if (err) {
                  this.toasterErr(err.error)
                } else {
                  this.toasterSuccess(this.$t('base.success'))
                  this._fetchData();
                }
              })
            },
            confirmEditBalance() {

                const params = {
                    userId: this.selectedBalanceUser._id || '',
                    amount: this.buyBackAmount,
                    tokenId: this.selectedToken,
                    type: TokenChangeType[this.tokenType],
                    userData: { operator: { userId: Meteor.userId(), username: Meteor.user().username || ''}}
                }
                const self = this;
                this.showEditBalance = false
                Meteor.call(this.editType === this.$t('admin.add') ? "admin_addBalance" : "admin_removeBalance", params, (err, res) => {
                    if (err) {
                        this.toasterErr(err.error)
                    } else {
                        this.toasterSuccess(this.$t('base.success'))
                    }
                })

            },
            balanceEdit(user) {
                this.editType = ''
                this.selectedToken = ''
                this.buyBackAmount = ''
                this.showEditBalance = true

                this.selectedBalanceUser = user
            },
            setupUserRole(user, role) {
                const params = {
                    user: user,
                    role: role,
                }
                Meteor.call("admin_changeUserRole", params, (err, res) => {
                    this._fetchData()
                })
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
            _fetchData() {
                if ((this.role.length === 0 || this.isService) && (!this.keyword || this.keyword.length === 0)) {
                    this.dataList = []
                    this.total = 0
                    if (this.role.length === 0) {
                        this.needRefetch = true
                    }
                    return
                }
                const params = {
                    search: this.keyword,
                    offset: (this.page - 1) * this.pageSize,
                    limit: this.pageSize,
                    role: this.role
                }
                const self = this;
                this.isLoading = true
                Meteor.call("admin_getProxyBuybackOrders", params, (err, res) => {
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