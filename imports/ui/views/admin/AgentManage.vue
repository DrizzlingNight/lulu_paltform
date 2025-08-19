<template>
    <!-- 推薦列表 -->
    <div>
        <!-- 1、標題模塊 -->
        <div class="title-group">
            <div class="main-title">{{$t('admin.agentManage')}}</div>
        </div>

        <!-- 2、篩選模塊 -->
        <div style="display:flex;align-items:center;">
            <el-input v-model="keyword" style="width: 200px;" :placeholder="$t('admin.searchUser')" @keyup.enter.native="resetPageAndFetchData()" />

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

        <!-- 3、表格模塊 -->
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
                    <a @click="searchLowAgent(row.username)">{{row.username}}</a>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.referral')" min-width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{row.referral}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.registerTime')" sortable min-width="180" prop="time" align="center">
                <template slot-scope="{row}">
                    <span>{{row.time}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.totalCasting', {var : 'BNB'})" sortable min-width="80" prop="userStatistical.mintCount" align="center">
                <template slot-scope="{row}">
                    <span>{{row.userStatistical != null ? (row.userStatistical.mintCount || '') : ''}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.castingConsume', {var : 'BNB'})" sortable prop="userStatistical.mintConsumeAmount" min-width="100"
                align="center">
                <template slot-scope="{row}">
                    <span>{{row.userStatistical != null ? (row.userStatistical.mintConsumeAmount || '') : ''}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.recharge', {var : 'BNB'})" sortable prop="myDeposit" min-width="80" align="center">
                <template slot-scope="{row}">
                    <span>{{row.myDeposit }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.inviteCount')" sortable prop="referralStatistical.subordinatesCount" min-width="90"
                align="center">
                <template slot-scope="{row}">
                    <span>{{row.referralStatistical != null ? (row.referralStatistical.subordinatesCount || '') : ''}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.referralTotalCasting', { var : 'BNB'})" sortable prop="referralStatistical.mintCount" min-width="105"
                align="center">
                <template slot-scope="{row}">
                    <span>{{row.referralStatistical != null ? (row.referralStatistical.mintCount || '') : ''}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.referralCastingConsume', { var : 'BNB'})" sortable prop="referralStatistical.mintConsumeAmount" min-width="100"
                align="center">
                <template slot-scope="{row}">
                    <span>{{row.referralStatistical != null ? (row.referralStatistical.mintConsumeAmount || '') : ''}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.referralTotalRecharge', {var : 'BNB'})" sortable prop="subDeposit" min-width="80" align="center">
                <template slot-scope="{row}">
                    <span>{{row.subDeposit}}</span>
                </template>
            </el-table-column>
        </el-table>

        <!-- 4、分頁模塊 -->
        <pagination :total="total" :page.sync="page" :limit.sync="pageSize" @pagination="_fetchData"
            style="margin-top: 16px;" />

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
                lowerKey: '',
                page: 1,
                pageSize: 20,

                navMenus: ['All'],

                total: 0,


            }
        },
        computed: {
            ...mapGetters(["user"]),
            tokenList() {
                return this.$store.state.user.tokens
            }
        },
        created() {
            this._fetchData()
        },
        methods: {

            // statistics mint or disposit amount, only BNB for now
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
                            amount += Number(item.amount)
                        }
                    })
                    return amount
                }
                return ''
            },
            
            search() {
                this.navMenus = ['All']
                this.page = 1
                if (this.keyword.length > 0) {
                    this._fetchUser()
                } else {
                    this._fetchData()
                }
            },
            clickMenu(menu) {
                if (menu === 'All') {
                    this.lowerKey = ''
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
                this.lowerKey = last
                this._fetchData()
            },
            searchLowAgent(key) {
                this.navMenus.push(key)
                this.lowerKey = key
                this.page = 1
                this._fetchData()
            },
            _fetchUser() {
                
                const params = {
                    search: this.keyword,
                    offset: (this.page - 1) * this.pageSize,
                    limit: this.pageSize,
                    isFromAgent: true,
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
                            const myDepositAmounts = d.userStatistical != null ? d.userStatistical
                                .depositAmount : []
                            d.myDeposit = this.statAmount(myDepositAmounts)

                            const subDepositAmounts = d.referralStatistical != null ? (d
                                .referralStatistical.depositAmount || []) : []
                            d.subDeposit = this.statAmount(subDepositAmounts)
                            return d;
                        }) : [];
                        self.total = res.count;
                    }
                });
            },

            _fetchData() {
                const params = {
                    search: this.lowerKey,
                    offset: (this.page - 1) * this.pageSize,
                    limit: this.pageSize
                }
                const self = this;
                this.isLoading = true
                Meteor.call("admin_getReferralList", params, (err, res) => {
                    self.isLoading = false;
                    if (err) {

                    } else {
                        let index = 0;
                        self.dataList = res.list[0] ? res.list.map(d => {
                            index = index + 1;
                            d.index = index;
                            d.time = d.createdAt ? dateFormat(d.createdAt, 'yyyy-MM-dd hh:mm:ss') : ''
                            const myDepositAmounts = d.userStatistical != null ? d.userStatistical
                                .depositAmount : []
                            d.myDeposit = this.statAmount(myDepositAmounts)

                            const subDepositAmounts = d.referralStatistical != null ? (d
                                .referralStatistical.depositAmount || []) : []
                            d.subDeposit = this.statAmount(subDepositAmounts)
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
</style>