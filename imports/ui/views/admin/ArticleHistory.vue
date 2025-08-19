<template>
    <!-- 推薦列表 -->
    <div>
        <!-- 1、標題模塊 -->
        <div class="title-group">
            <div class="main-title">{{$t('admin.articleHistory')}}</div>
        </div>

        <!-- 2、篩選模塊 -->
        <div style="display:flex;align-items:center;">
            <el-input v-model="keyword" :placeholder="$t('admin.searchUser')" style="width: 200px;"
                @keyup.enter.native="_fetchData()" />

            <el-select style="margin-left:15px;width: 120px;" clearable v-model="selectedType" :placeholder="$t('admin.typeFilter')">
                <el-option v-for="(type, idx) in convertedAllTypes()" :key="type" :label="type" :value="idx">
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

            <el-table-column :label="$t('admin.userId')" min-width="200" align="center">
                <template slot-scope="{row}">
                    <span>{{row.userInfo[0]._id }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.username')" min-width="200" align="center">
                <template slot-scope="{row}">
                    <a @click="showUserDetail(row.userInfo[0])">{{row.userInfo[0].username}}</a>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.article')" min-width="200" align="center">
                <template slot-scope="{row}">
                    <!-- <div>{{row.userData ? (row.userData.idOnChain || '') : ''}}</div> -->
                    <a @click="showArticleDetail(row.articleInfo[0])">{{showArticle(row)}}</a>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.type')" min-width="100" align="center">
                <template slot-scope="{row}">
                    <div>{{ convertType(row.type) }}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.change')" min-width="80" align="center">
                <template slot-scope="{row}">
                    <div>{{row.number || ''}}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.balance')" min-width="80" align="center">
                <template slot-scope="{row}">
                    <div>{{row.current || ''}}</div>
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


        <el-dialog :title="$t('admin.userDetail')" :visible.sync="isShowUserDetail" append-to-body class="dialog-add" width="400px">
            <div style="display:flex;flex-dirction:row;">
                <div style="width: 400px;">
                    <div style="font-size:16px;font-weight:bold;margin-bottom: 20px;">{{$t('admin.userInfo')}}</div>
                    <div class="user-detail-item">{{$t('admin.userId') + '：'+ selectedUser._id || ''}}</div>
                    <div class="user-detail-item">{{$t('admin.username') + '：'+ selectedUser.username || ''}}</div>
                    <div v-if="!isService" class="user-detail-item">{{$t('admin.phone')+ selectedUser.mobileNum || '' }}</div>
                    <div v-if="!isService" class="user-detail-item">{{$t('base.email')+'：'+ (selectedUser && selectedUser.emails ? (selectedUser.emails[0].address || '') : '')}}</div>
                    <div class="user-detail-item">{{$t('admin.nickname')+'：'+ (selectedUser && selectedUser.profile ? selectedUser.profile.nickname || '' : '')}}</div>
                </div>
            </div>
        </el-dialog>

        <el-dialog :title="$t('admin.articleDetail')" :visible.sync="isshowArticleDetail" append-to-body class="dialog-add" width="400px">
            <div style="display:flex;flex-dirction:row;">
                <div style="width: 400px;">
                    <div style="font-size:16px;font-weight:bold;margin-bottom: 20px;">{{$t('admin.articleInfo')}}</div>
                    <div class="user-detail-item">{{'article ID：'+ (selectedArticle ? (selectedArticle._id || '') : '')}}</div>
                    <div class="user-detail-item">
                        {{$t('admin.type') + '：'+ (selectedArticle ? (selectedArticle.type || '') : '') }}</div>
                    <div class="user-detail-item">
                        {{$t('admin.name') + '：'+ (selectedArticle && selectedArticle.name ? ((selectedArticle.name['zh-TW'] || '') + ' ' + (selectedArticle.name['en-EN'] || '')) : '') }}</div>
                    <div class="user-detail-item">
                        {{selectedArticle && selectedArticle.des ? (selectedArticle.des['zh-TW'] || '') : ''}}</div>
                    <div class="user-detail-item">
                        {{selectedArticle && selectedArticle.des ? (selectedArticle.des['en-EN'] || '') : ''}}</div>
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
    import i18n from '/imports/ui/lang'

    export default {
        name: "user-manage",
        components: {
            Pagination,
        },
        data() {
            return {
                dataList: [],
                articlePoolData: {},
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

                selectedType: null,

                selectedDate: [moment().startOf('day').toDate(), moment().endOf('day').toDate()],

                isSearchBySameToken: false,

                allTypeValueKeys: {},


                selectedTx: {},

                isshowArticleDetail: false,
                selectedArticle: {},

                transferToUser: '',

                showTransferarticle: false,

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
        mounted () {
            // this._fetchData()
            this._checkRoles()
        },
        methods: {
            showUserDetail(user) {
                this.selectedUser = user
                this.isShowUserDetail = true
            },
            showArticleDetail(article) {
                this.selectedArticle = article
                this.isshowArticleDetail = true
            },
            search() {
                this.page = 1
                this._fetchData()
            },
            convertType(type) {
                if (type === 0) {
                    return this.$t('admin.systemChange')
                } else if (type === 1) {
                    return this.$t('admin.synthesisCost')
                } else if (type === 2) {
                    return this.$t('admin.generate')
                } else if (type === 3) {
                    return this.$t('admin.plant')
                } else if (type === 4) {
                    return this.$t('admin.taskReturn')
                } else if (type === 5) {
                    return this.$t('admin.transfer')
                } else if (type === 6) {
                    return '任务奖励'
                }
                return ''
            },
            convertedAllTypes() {
                let types = []
                for (let i = 0;i < 7;++i) {
                    types.push(this.convertType(i))
                }
                return types
            },
            showArticle(data) {
                if (data.articleInfo && data.articleInfo[0]) {
                    const articleInfo = data.articleInfo[0]
                    if (i18n.locale === 'zh-TW') {
                        return (articleInfo.name['zh-TW'] || articleInfo.name['en-EN'])
                    } else {
                        return articleInfo.name['en-EN']
                    }
                }
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
                    startTime: startTime,
                    endTime: endTime,
                    offset: (this.page - 1) * this.pageSize,
                    limit: this.pageSize,
                    search: this.keyword,
                }
                if (this.selectedType) {
                    params.type = this.selectedType
                }
                const self = this;
                this.isLoading = true

                Meteor.call("admin_getArticleHistory", params, (err, res) => {
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
