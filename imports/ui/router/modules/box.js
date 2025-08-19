const box = [
  
  // 盲盒頁
  {
    path: "/mystery_boxes",
    name: "mystery_boxes",
    component: () => import("/imports/ui/views/boxes/MySteryBoxes"),
  },
  // 盲盒詳細頁
  {
    path: "/mystery_boxes/rare-mint/:id",
    name: "rare-mint",
    component: () => import("/imports/ui/views/boxes/mint/RareMint"),
  }

]

export default box
