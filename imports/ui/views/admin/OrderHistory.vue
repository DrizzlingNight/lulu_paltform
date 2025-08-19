<template>
    <!-- 推薦列表 -->
    <div>
        <!-- 1、標題模塊 -->
        <div class="title-group">
            <div class="main-title">{{$t('admin.orderHistory')}}</div>
        </div>

        <!-- 2、篩選模塊 -->
        <div style="display:flex;align-items:center;">
            <el-input v-model="keyword" :placeholder="$t('admin.searchPublisherOrReceiver')" style="width: 200px;"
                @keyup.enter.native="_fetchData()" />

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

            <el-table-column :label="$t('my.taskCenter.publisher')" min-width="200" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.publisherInfo ? (row.publisherInfo.length > 0 ? (row.publisherInfo[0].username || '') : '') : ''}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('my.taskCenter.receiver')" min-width="200" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.receiverInfo ? (row.receiverInfo.length > 0 ? (row.receiverInfo[0].username || '') : '') : ''}}</span>
                </template>
            </el-table-column>



            <el-table-column :label="$t('admin.type')" min-width="120" align="center">
                <template slot-scope="{row}">
                    <div>{{row.ruleId || ''}}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.status')" min-width="120" align="center">
                <template slot-scope="{row}">
                    <div>{{setupStatus(row.status)}}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('home.ranking.reward')" min-width="120" align="center">
                <template slot-scope="{row}">
                    <div v-for="reward in row.rewards" :key="reward.token">
                        <div>{{ reward.token + '：' + reward.amount}}</div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('admin.mode')" min-width="150" align="center">
                <template slot-scope="{row}">
                    <div>{{setupMode(row.params ? (row.params.mode || '') : '')}}</div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('my.taskCenter.timeLimit')" min-width="120" align="center">
                <template slot-scope="{row}">
                    <div>{{converHour2day(row.params ? (row.params.timeLimit || '') : '')}}</div>
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

                selectedDate: [moment().startOf('day').toDate(), moment().endOf('day').toDate()],


                role: '',
                isProxy: false,
                isService: false,

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

        },
        created() {
            this._checkRoles()
        },
        methods: {
            fixNum(num) {
                return num ? money_filter(num, 2) : ''
            },
            setupStatus(status) {
                return this.$t('my.taskCenter.status.' + status)
            },
            setupMode(mode) {
                if (!mode || mode.length === 0) return ''
                return mode === 0 ? this.$t('my.taskCenter.borrowLand') :  this.$t('my.taskCenter.workingMode')
            },
            converHour2day(hour) {
                if (!hour || hour.length === 0) return ''
                return hour < 24 ? (hour + 'h') : ((hour / 24) + ' day')
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
                    
                    startTime: startTime,
                    endTime: endTime,
                    offset: (this.page - 1) * this.pageSize,
                    limit: this.pageSize,
                    search: this.keyword,
                    role: this.role,
                }
                const self = this;
                this.isLoading = true

                Meteor.call("admin_getOrderHistory", params, (err, res) => {
                    self.isLoading = false;
                    if (err) {

                    } else {
                        let index = 0;
                        self.dataList = res.list.map(d => {
                            index = index + 1;
                            d.index = index;
                            d.time = d.createdAt ? dateFormat(d.createdAt, 'yyyy-MM-dd hh:mm:ss') : ''
                            return d;
                        })
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

    }

    .stat-info {
        background: #ffffff;
        // height: 45px;
        margin-top: 20px;
        // width: auto;
        padding: 10px;
    }

</style>