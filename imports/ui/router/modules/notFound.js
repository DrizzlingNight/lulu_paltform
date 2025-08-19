// 404 找不到頁面

const notFound = [
  // 404 not found
  {
    path: '*',
    name: 'not-found',
    component: () => import('/imports/ui/views/notFound/NotFound')
  }
]

export default notFound