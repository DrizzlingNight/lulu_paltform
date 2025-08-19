<template>
    <!-- 推薦列表 -->
    <div>
        <!-- 1、標題模塊 -->
        <div class="title-group">
            <div class="main-title">{{$t('admin.userManage')}}</div>
        </div>

        <!-- 2、篩選模塊 -->
        <div style="display:flex;align-items:center;">
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

            <el-table-column :label="$t('admin.registerTime')" sortable min-width="180" prop="time" align="center">
                <template slot-scope="{row}">
                    <span>{{row.time}}</span>
                </template>
            </el-table-column>

            <el-table-column v-if="!isService" :label="$t('admin.referral')" min-width="150" prop="time" align="center">
                <template slot-scope="{row}">
                    <span>{{row.referral || ''}}</span>
                </template>
            </el-table-column>

            <el-table-column v-if="!isService" :label="$t('admin.role')" sortable min-width="80" prop="role" align="center">
                <template slot-scope="{row}">
                    <span>{{row.role}}</span>
                </template>
            </el-table-column>

            <el-table-column v-if="isSuperAdmin && !isService" :label="$t('admin.editRole')" sortable min-width="80" prop="role" align="center">
                <template slot-scope="{row}">
                    <el-select v-if="!isMe(row._id)" :value="none" :placeholder="$t('admin.pleaseChoose')" @visible-change="showSelect(row._id)"
                        @change="selectRole">
                        <el-option v-for="role in roles" :key="role" :label="role" :value="role"></el-option>
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column v-if="(isSuperAdmin || isAdmin) && !isService" :label="$t('admin.editBalance')" min-width="80" align="center">
                <template slot-scope="{row}">
                    <el-button type="primary" @click="balanceEdit(row)">{{$t('admin.edit')}}</el-button>
                </template>
            </el-table-column>

            <el-table-column v-if="isSuperAdmin" :label="$t('admin.block')" min-width="80" align="center">
              <template slot-scope="{row}">
                <div v-if="row.role !== 'superAdmin'">
                  <el-button type="danger" @click="banUser(row)">
                      <span v-if="row.isDeleted">{{$t('admin.unblock')}}</span>
                      <span v-else>{{$t('admin.block')}}</span>
                  </el-button>
                </div>
              </template>
            </el-table-column>

          <el-table-column v-if="isSuperAdmin || isAdmin || isService" :label="$t('admin.joinedGroup')" min-width="80" align="center">
            <template slot-scope="{row}">
                <el-button :type="row.isJoinedGroup && row.isJoinedGroup === true ? 'info' : 'success'" :disabled="row.isJoinedGroup && row.isJoinedGroup === true" @click="setJoinedGroup(row)">
                  <span>{{$t('admin.joinedGroup')}}</span>
                </el-button>
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

        <el-dialog :title="$t('admin.editBalance')" :visible.sync="showEditBalance" append-to-body class="dialog-add" width="500px">
            <el-form label-width="150px" status-icon>

                <el-form-item :label="$t('admin.operateType')">
                    <el-select v-model="editType" :placeholder="$t('admin.selectOperation')">
                        <el-option v-for="item in [$t('admin.add'), $t('admin.remove')]" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('admin.tokenChangeType')">
                    <el-select v-model="tokenType" :placeholder="$t('admin.selectOperation')">
                        <el-option v-for="type in allTypes" :key="type" :label="type" :value="type"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('admin.amount')">
                    <el-input v-model="editAmount" :placeholder="$t('admin.inputBalance')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('admin.token')">
                    <el-select v-if="isSuperAdmin" v-model="selectedToken" :placeholder="$t('admin.selectToken')">
                        <el-option v-for="token in tokenList" :key="token._id" :label="token.name" :value="token._id">
                        </el-option>
                    </el-select>
                    <!-- admin仅可以添加bnb -->
                    <el-select v-else-if="isAdmin" v-model="selectedToken" :placeholder="$t('admin.selectToken')">
                        <el-option key="BNB" label="BNB" value="BNB">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button @click="showEditBalance = false">{{$t('admin.cancel')}}</el-button>
                    <el-button type="primary" @click="confirmEditBalance()"
                        :disabled="!(editAmount > 0.0 && editType.length > 0 && selectedToken.length > 0)">{{$t('admin.confirm')}}
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

                selectedUser: {},
                showUserDetail: false,

                keyword: '',
                page: 1,
                pageSize: 10,

                total: 0,

                roles: [this.$t('admin.deleteRole')],
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
        created() {
            this._checkRoles()
            this._fetchRoles()
            this._fetchData()
        },
        methods: {
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
                    amount: this.editAmount,
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
                this.editAmount = ''
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
            _fetchRoles() {
                const self = this;
                Meteor.call('admin_getAllRoles', (err, res) => {
                    self.roles = res.map(r => r._id).concat([this.$t('admin.deleteRole')])
                })
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
                Meteor.call("admin_getUsers", params, (err, res) => {
                    self.isLoading = false;
                    if (err) {

                    } else {
                        let index = 0;
                        self.dataList = res.list[0] ? res.list.map(d => {
                            index = index + 1;
                            d.index = index;
                            d.time = d.createdAt ? dateFormat(d.createdAt, 'yyyy-MM-dd hh:mm:ss') : ''
                            d.lastLoginTime = d.status ? (d.status.lastLogin != null ? dateFormat(d.status.lastLogin
                                .date, 'yyyy-MM-dd hh:mm:ss') : '') : ''
                            d.email = d.emails != null && d.emails.length > 0 ? d.emails.map(u => u
                                .address).join(',') : ''
                            d.nickname = d.profile != null ? (d.profile.nickname || '') : ''
                            d.mobileNum = (d.iddCode != null ? '+' + d.iddCode : '') + ' ' + (d
                                .mobile || '')
                            const myDepositAmounts = d.userStatistical != null ? d.userStatistical
                                .depositAmount : []
                            d.myDeposit = this.statAmount(myDepositAmounts)
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