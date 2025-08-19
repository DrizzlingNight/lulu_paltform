import BaseLayout from '/imports/ui/views/layouts/TheBaseLayout'
import TheAdminLayout from '/imports/ui/views/layouts/TheAdminLayout'

import my from './my.js'
import home from './home'
import invitation from './invitation.js'
import box from './box.js'
import notFound from './notFound.js'
import game from './game.js'
import pledge from './pledge.js'
import mine from './mine.js'

// import { settings } from "/imports/settings"

const base = [
    ...game,
    {
        path: '/',
        component: BaseLayout, // 隻有topbar和主體內容
        children: [
            {
                path: '',
                redirect: '/home', // 根路徑跳轉首頁
            },
            ...home,
            ...invitation,
            ...my,
            ...box,
            ...pledge,
            ...mine,
            ...notFound,
        ],
    },
];
export default base
