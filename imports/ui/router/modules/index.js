import base from './base.js'
import admin from './admin.js'

const routes = [
	...admin, // 管理者頁面
	...base, // 客戶頁面
]

export default routes
