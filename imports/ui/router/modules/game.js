const game = [
  {
    path: "/game/lulumarket",
    name: "game",
    component: () => import("/imports/ui/views/game/Game.vue"),
    beforeEnter: (to, from, next) => {
      if (to.path[to.path.length - 1] !== '/') {
        next({path: to.path + '/', replace: true});
      } else {
        next();
      }
    }
  },

]

export default game
