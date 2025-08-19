<template>
    <!-- 推薦列表 -->
    <div>
        <!-- 1、標題模塊 -->
        <div class="title-group">
            <div class="main-title">{{$t('admin.articleTitle')}}</div>
        </div>

        <!-- 2、篩選模塊 -->
        <div style="display:flex;align-items:center;">
            <el-input v-model="keyword" :placeholder="$t('admin.articleSearch')" style="width: 200px;"
                @keyup.enter.native="_fetchData()" />

            <el-button type="primary" @click="search()" style="height:34px;margin-left:10px;">{{$t('admin.search')}}</el-button>

        </div>

        <div v-if="isSearchBySameToken && dataList.length > 0" class="stat-info">
            {{$t('admin.totalCurrentBalance') + totalCurrent + ' ' + $t('admin.balanceChange') + totalChanged}}
        </div>

        <el-table :data="dataList" style="width:100%;margin-top: 20px;" border fit highlight-current-row
            v-loading="isLoading">

            <el-table-column label="No." sortable prop="index" min-width="50" align="center">
                <template slot-scope="{row}">
                    <span>{{row.index}}</span>
                </template>
            </el-table-column>

            <el-table-column label="type" min-width="180" align="center">
                <template slot-scope="{row}">
                    <span>{{row.articleInfo[0].type || ''}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.user')" min-width="180" align="center">
                <template slot-scope="{row}">
                    <a @click="showUserDetail(row.userInfo[0])">{{row.userInfo && row.userInfo.length > 0 ? (row.userInfo[0].username || '') : ''}}</a>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.referral')" min-width="180" align="center">
                <template slot-scope="{row}">
                    <span>{{row.userInfo && row.userInfo.length > 0 ? (row.userInfo[0].referral || '') : ''}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.name')" min-width="180" align="center">
                <template slot-scope="{row}">
                    <span>{{(row.articleInfo[0].name['zh-TW'] || '') + ' ' + (row.articleInfo[0].name['en-EN'] || '')}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.amount')" min-width="180" align="center">
                <template slot-scope="{row}">
                    <span>{{row.number || ''}}</span>
                </template>
            </el-table-column>

            <el-table-column v-if="isSuperAdmin" :label="$t('admin.addArticle')" min-width="80" align="center">
                <template slot-scope="{row}">
                    <div v-if="row.disable">disable</div>
                    <el-button v-else type="primary" @click="addArticle(row)">{{$t('admin.addArticle')}}</el-button>

                </template>
            </el-table-column>

            <el-table-column v-if="isAdminOrProxy || isService" :label="$t('admin.transferArticle')" min-width="80" align="center">
                <template slot-scope="{row}">
                    <div v-if="row.disable || !(canTransfer(row.userInfo && row.userInfo[0]._id))">disable</div>
                    <el-button v-else type="primary" @click="transferArticle(row)">{{$t('admin.transfer')}}</el-button>

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
                    <div class="user-detail-item">{{$t('admin.role') + '：'+ selectedUser.role || ''}}</div>
                    <div class="user-detail-item">{{$t('admin.registerType') + '：'+ selectedUser.registerType || ''}}</div>

                </div>
            </div>
        </el-dialog>


        <!-- 转移道具 -->
        <el-dialog :title="$t('admin.transferArticle')" :visible.sync="isShowTransferArticle" append-to-body class="dialog-add" width="500px">
            <el-form label-width="150px" status-icon>

                <el-form-item :label="$t('admin.articleName')">
                    <div>{{selectedArticle.articleInfo ? 
                        ((selectedArticle.articleInfo[0].name['zh-TW'] || '') + ' ' + (selectedArticle.articleInfo[0].name['en-EN'] || '')) : '' }}</div>
                </el-form-item>


                <el-form-item :label="$t('admin.transferToUser')">
                    <el-input v-model="transferToUser" :placeholder="$t('admin.inputUserIdOrUsername')"></el-input>
                </el-form-item>

                <el-form-item :label="$t('admin.amount')">
                    <el-input v-model="transferAmount" :placeholder="$t('admin.inputTransferAmount')"></el-input>
                    <div>{{$t('admin.totalAmount') + ':'+ (selectedArticle.number || 0)}}</div>
                </el-form-item>

                <el-form-item>
                    <el-button @click="isShowTransferArticle = false">{{$t('admin.cancel')}}</el-button>
                    <el-button type="primary" @click="confirmTransferArticle()"
                        :disabled="!(transferToUser.length > 0 && transferAmount > 0)">{{$t('admin.confirm')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 添加道具 -->
        <el-dialog :title="$t('admin.addArticle')" :visible.sync="isShowAddArticle" append-to-body class="dialog-add" width="500px">
            <el-form label-width="150px" status-icon>

                <el-form-item :label="$t('admin.addUser')">
                    <el-input v-model="addToUser" :placeholder="$t('admin.inputUserIdOrUsername')"></el-input>
                </el-form-item>

                <el-form-item :label="$t('admin.addArticleId')">
                    <!-- <el-input v-model="addArticleId" placeholder="請輸入Article ID"></el-input> -->
                    <el-autocomplete v-model="addArticleId" :fetch-suggestions="_fetchAllArticles" @select="handleSelect">
                        <template slot-scope="{ item }">
                            <div>{{ item.name['zh-TW'] + ' ' + item._id }}</div>
                        </template>
                    </el-autocomplete>
                </el-form-item>

                <el-form-item :label="$t('admin.operateType')">
                    <el-select v-model="editType" :placeholder="$t('admin.selectOperation')">
                        <el-option v-for="item in [$t('admin.add'), $t('admin.remove')]" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('admin.amount')">
                    <el-input v-model="addAmount" :placeholder="$t('admin.inputAmount')"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="isShowAddArticle = false">{{$t('admin.cancel')}}</el-button>
                    <el-button type="primary" @click="confirmAddArticle()"
                        :disabled="!(addToUser.length > 0 && addAmount > 0)">{{$t('admin.confirm')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>

</template>

<script>
    import moment from "moment/moment";
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
                isAdminOrProxy: false,
                isService: false,

                selectedBox: '',

                selectedDate: [moment().startOf('day').toDate(), moment().endOf('day').toDate()],

                isSearchBySameToken: false,

                allTypes: Object.keys(NonFungibleTokenPoolType),
                allTypeValueKeys: {},


                selectedTx: {},

                isShowNFTDetail: false,
                selectedArticle: {},

                transferToUser: '',
                transferAmount: '',
                isShowTransferArticle: false,


                editType: '',
                addToUser: '',
                addArticleId: '',
                isShowAddArticle: false,
                addAmount: '',


                role: '',

                allArticles: [],
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
            // this._fetchAllArticles()
        },
        methods: {
            canTransfer(userId) {
                return (this.isAdminOrProxy || this.isService) && userId === Meteor.userId()
            },
            _fetchAllArticles(keyword, cb) {
                Meteor.call('admin_getAllArticles', (err, res) => {
                    this.allArticles = res
                    cb(this.allArticles)
                });
            },
            handleSelect(item) {
                this.addArticleId = item._id.toString()
            },
            transferArticle(article) {
                this.selectedArticle = article
                this.isShowTransferArticle = true
            },
            confirmTransferArticle() {

                
                const params = {
                    articleObjectId: this.selectedArticle._id,
                    articleId: this.selectedArticle.articleId,
                    toUser: this.transferToUser,
                    number: this.transferAmount,
                }

                Meteor.call('admin_transferArticle', params, (err, res) => {
                    if (err) {
                        this.toasterErr(err.error)
                    } else {
                        if (res.code == 0) {
                            this.toasterSuccess(this.$t('base.success'))
                            this.isShowTransferArticle = false
                            this._fetchData()
                            this.transferToUser = ''
                            this.transferAmount = ''
                        }
                    }
                })
            },
            addArticle(article) {
                this.selectedArticle = article
                this.addToUser = article.user
                this.addArticleId = article.articleId.toString()
                this.isShowAddArticle = true
            },
            confirmAddArticle() {

                const params = {
                    user: this.addToUser,
                    articleId: this.addArticleId,
                    number: parseInt(this.addAmount),
                }

                Meteor.call(this.editType === "添加" ? 'admin_addArticle' : 'admin_removeArticle', params, (err, res) => {
                    if (err) {
                        this.toasterErr(err.error)
                    } else {
                        // if (res.code == 0) {
                            this.toasterSuccess(this.$t('base.success'))
                            this.isShowAddArticle = false
                            this._fetchData()
                            this.transferToUser = ''
                            this.addAmount = ''
                        // }
                    }
                })

            },
            showUserDetail(user) {
                this.selectedUser = user
                this.isShowUserDetail = true
            },
            showNFTDetail(nft) {
                this.selectedArticle = nft
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
                        if (role.user._id === Meteor.userId()) {
                            if ((role.role._id === Permissions.SuperAdmin)) {
                                self.isSuperAdmin = true
                            } else if (role.role._id === Permissions.Admin ||
                            role.role._id === Permissions.Proxy) {
                                self.isAdminOrProxy = true
                            } else if (role.role._id === Permissions.Service) {
                                self.isService = true
                            }
                            this.role = role.role._id
                        }
                    }
                    this._fetchData()
                })
            },
            _fetchData() {

                const params = {
                    offset: (this.page - 1) * this.pageSize,
                    limit: this.pageSize,
                    search: this.keyword,
                    role: this.role,
                }
                const self = this;
                this.isLoading = true

                Meteor.call("admin_fetchArticleList", params, (err, res) => {
                    self.isLoading = false;
                    if (err) {

                    } else {
                        let index = 0;
                        self.dataList = res.data[0] ? res.data.map(d => {
                            index = index + 1;
                            d.index = index;
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

    .my-autocomplete {
        li {
            line-height: normal;
            padding: 7px;

            .name {
            text-overflow: ellipsis;
            overflow: hidden;
            }
            .addr {
            font-size: 12px;
            color: #b4b4b4;
            }

            .highlighted .addr {
            color: #ddd;
            }
        }
    
}
</style>
