const my = [
    {
        path: '/my',
        name: 'my',
        component: () => import('/imports/ui/views/my'),
        children: [
            {
                path: 'accountInfo',
                name: 'accountInfo',
                component: () => import('/imports/ui/views/my/components/accountInfo/AccountInfo'),
                meta: {
                    title: '個人信息',
                },
            },
            {
                path: 'accountSetting',
                name: 'accountSetting',
                component: () => import('/imports/ui/views/my/components/accountSetting/AccountSetting'),
                meta: {
                    title: '帳戶設置',
                },
            },
            {
                path: 'assets',
                name: 'assets',
                component: () => import('/imports/ui/views/my/components/assets/Assets'),
                meta: {
                    title: '我的資產',
                },
            },
            {
                path: 'history',
                name: 'history',
                component: () => import('/imports/ui/views/my/components/history/History'),
                meta: {
                    title: '歷史紀錄',
                },
            },
            {
                path: 'balanceRecord',
                name: 'balanceRecord',
                component: () => import('/imports/ui/views/my/components/balanceRecord/BalanceRecord'),
                meta: {
                    title: '賬變紀錄',
                },
            },
            {
                path: 'land',
                name: 'land',
                component: () => import('/imports/ui/views/my/components/land/Land'),
                meta: {
                    title: '我的土地',
                },
            },
            {
                path: 'task',
                name: 'task',
                component: () => import('/imports/ui/views/my/components/task/Task'),
                meta: {
                    title: '任務中心',
                },
            },
            {
                path: 'buyHistory',
                name: 'buyHistory',
                component: () => import('/imports/ui/views/my/components/buyHistory/BuyHistory'),
                meta: {
                    title: '購買紀錄',
                },
            },
            {
                path: 'landDeposit',
                name: 'landDeposit',
                component: () => import('/imports/ui/views/my/components/landDeposit/LandDeposit'),
                meta: {
                    title: '土地轉入'
                }
            },
            {
                path: 'landWithdraw',
                name: 'landWithdraw',
                component: () => import('/imports/ui/views/my/components/landWithdraw/LandWithdraw'),
                meta: {
                    title: '土地轉出'
                }
            },
            {
                path: 'storehouse',
                name: 'storehouse',
                component: () => import('/imports/ui/views/my/components/storeHouse/Storehouse'),
                meta: {
                    title: '我的倉庫',
                },
            },
        ]
    },
];
export default my
