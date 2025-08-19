import TheAdminLayout from '/imports/ui/views/layouts/TheAdminLayout'

const admin = [
    {
      path: '/admin',
      // name: 'admin',
      component: TheAdminLayout,
      children: [
        {
          path: '/',
          name: 'index',
          component: () => import('/imports/ui/views/admin/Admin.vue'),
          meta: {
            title: '管理後台',
          },
        },
        {
          path: '/admin/agent',
          name: 'agent',
          component: () => import('/imports/ui/views/admin/AgentManage.vue'),
          meta: {
            title: '代理管理',
          },
        },
        {
          path: '/admin/user',
          name: 'user',
          component: () => import('/imports/ui/views/admin/UserManage.vue'),
          meta: {
            title: '用戶管理',
          },
        },{
          path: '/admin/hotupdate',
          name: 'hotupdate',
          component: () => import('/imports/ui/views/admin/Hotupdate.vue'),
          meta: {
            title: '热更管理',
          },
        },{
          path: '/admin/gameManagement',
          name: 'gameManagement',
          component: () => import('/imports/ui/views/admin/GameManagement.vue'),
          meta: {
            title: '游戏管理',
          },
        },{
          path: '/admin/balance',
          name: 'balance',
          component: () => import('/imports/ui/views/admin/BalanceHistory.vue'),
          meta: {
            title: '帐变记录',
          },
        },
        {
          path: '/admin/transaction',
          name: 'transaction',
          component: () => import('/imports/ui/views/admin/TransactionHistory.vue'),
          meta: {
            title: '充提款管理',
          },
        },
        {
          path: '/admin/nft',
          name: 'nft',
          component: () => import('/imports/ui/views/admin/NFTManage.vue'),
          meta: {
            title: 'NFT管理',
          },
        },
        {
          path: '/admin/miningRecord',
          name: 'miningRecord',
          component: () => import('/imports/ui/views/admin/MiningRecord.vue'),
          meta: {
            title: '挖矿记录',
          },
        },
        {
          path: '/admin/article',
          name: 'article',
          component: () => import('/imports/ui/views/admin/ArticleManage.vue'),
          meta: {
            title: '道具管理',
          },
        },

        {
          path: '/admin/nftHistory',
          name: 'nftHistory',
          component: () => import('/imports/ui/views/admin/NFTTransferHistory.vue'),
          meta: {
            title: '土地转让记录',
          },
        },
        {
          path: '/admin/articleHistory',
          name: 'articleHistory',
          component: () => import('/imports/ui/views/admin/ArticleHistory.vue'),
          meta: {
            title: '道具记录',
          },
        },
        {
          path: '/admin/balanceSystemChange',
          name: 'balanceSystemChange',
          component: () => import('/imports/ui/views/admin/BalanceSystemChange.vue'),
          meta: {
            title: '系统帐变',
          },
        },
        {
          path: '/admin/balanceCultivateChange',
          name: 'balanceCultivateChange',
          component: () => import('/imports/ui/views/admin/BalanceCultivateChange.vue'),
          meta: {
            title: '耕种帐变',
          },
        },
        {
          path: '/admin/areaData',
          name: 'areaData',
          component: () => import('/imports/ui/views/admin/AreaData.vue'),
          meta: {
            title: '地区数据',
          },
        },
        {
          path: '/admin/gameHistory',
          name: 'gameHistory',
          component: () => import('/imports/ui/views/admin/GameHistory.vue'),
          meta: {
            title: '游戏记录',
          },
        },
        {
          path: '/admin/orderHistory',
          name: 'orderHistory',
          component: () => import('/imports/ui/views/admin/OrderHistory.vue'),
          meta: {
            title: '委托记录',
          },
        },
        {
          path: '/admin/buyBackAudit',
          name: 'buyBackAudit',
          component: () => import('/imports/ui/views/admin/BuyBackAudit.vue'),
          meta: {
            title: '回购审批',
          },
        },
      ]
    },
  ];
  export default admin

