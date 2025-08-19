<template>
	<div id="game-page" class="game-page">
		<canvas id="GameCanvas" oncontextmenu="event.preventDefault()" tabindex="0"></canvas>
		<div id="splash" class="cocos-loader" :class="{ rotated : isRotated }">
			<div class="progress-bar stripes">
				<span style="width: 0%"></span>
			</div>
		</div>
		<login-dialog :show="showLogin" @close="showLogin=false"></login-dialog>
	</div>
</template>

<script>
	import isRotated from '../mixin/isRotated'
	import {
		mapGetters
	} from 'vuex'
	import logging from '../../../../api/logging'
	import LoginDialog from '../../../../ui/views/layouts/topbar/login/loginDialog.vue'
  import i18n from "../../../lang";

	const logger = logging.getLogger(module.id)

	export default {
		name: 'cocosGame',
		mixins: [isRotated],
		components: {
			LoginDialog
		},
		computed: {
			...mapGetters(['user']),
		},
		data() {
			return {
				code: '',
				showLogin: false,
			}
		},
		mounted() {
			// document.getElementById(
			// 	'splash'
			// ).style = `background-image: url(/static/img/${this.game.loading_img || this.game._id}_loading.jpg);`
			window.cc = undefined
			this.resize()
			this.loadIndex(() => {
				window.startLoad(() => {
					// register game call web methods
					cc.game.on('GameInit', this.gameInit)
					cc.game.on('LuLuWebBack', this.goBack)
					cc.game.on('LuLuWebRecharge', this.goRecharge)
					cc.game.on('depositEvent', this.depositEvent)
					cc.game.on('StartLogin', this.startLogin)
					cc.game.on('goBuyBlindBox', this.goBuyBlindBox)
					this.focus()
				})
			})
			window.addEventListener('resize', this.computeFrameSize)
		},
		watch: {
			user(newValue, oldValue) {
				if (!oldValue && newValue) {
					this.showLogin = false
					if (cc) {
						this.sendLoginToken()
					}
				}


			}
		},
		methods: {
			focus() {
				setTimeout(() => {
					const dom = document.getElementById('GameCanvas')
					if (dom === null) {
						f()
					} else {
						dom.focus() // focus避免抖動
					}
				}, 100)
			},

			computeFrameSize() {
			  // location.reload()
				setTimeout(() => {
					let dom = document.getElementsByClassName('topbar')
          cc.view.setFrameSize(window.innerWidth, window.innerHeight)
          // let width = window.innerWidth
					// let height = window.innerHeight
					// if (dom.length) {
					// 	dom = dom[0]
					// 	height = height - dom.clientHeight
					// }
					// let new_width = 0
					// let new_height = 0
					// if (width / height > 16 / 9) {
					// 	new_width = height * 16 / 9
					// 	new_height = height
					// } else {
					// 	new_width = width
					// 	new_height = width * 9 / 16
					// }
          //
					// if (height / width >= 9 / 16 && width < 960) {
					// 	new_width = width
					// 	new_height = height
					// }
          //
					// cc.view.setFrameSize(new_width, new_height)
					// setTimeout(() => {
					// 	let dom = document.getElementById('game-page')
					// 	let width = window.innerWidth
					// 	dom.style = "margin-left:" + (
					// 		(width - new_width) / 2
					// 	) + 'px'
					// }, 300)
				}, 300)
			},
			resize() {
				const u = navigator.userAgent
				const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
				const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
				if (isAndroid || isiOS) {
					this.$nextTick(() => {
						document.querySelector('.game-page').style.height =
							window.innerHeight + 'px'
						document.querySelector('.game-page').style.width =
							window.innerWidth + 'px'
					})
					window.addEventListener('resize', () => {
						_.throttle(this.needRotate)
						document.querySelector('.game-page').style.height =
							window.innerHeight + 'px'
						document.querySelector('.game-page').style.width =
							window.innerWidth + 'px'
					})
				}
			},
			needRotate() {
				//判斷是否需要旋轉
				document.body.style.width = ''
				document.body.style.height = ''
			},
			loadIndex(onLoaded) {
				const setting = document.createElement('script');
				setting.async = true;
				setting.charset = 'utf-8';
				setting.src = `index.game`;

				const engineLoaded = (res) => {
					document.body.removeChild(setting)
					setting.removeEventListener('load', engineLoaded, false)
					if (onLoaded) onLoaded()
				}
				setting.addEventListener('load', engineLoaded, false)
				document.body.appendChild(setting)
			},

			// game call web methods

			gameInit() {
				logger.info(`cocos game init`)
				this.needRotate()
				this.sendLang()
				this.sendLoginToken()
			},
			goBack() {
				logger.info(`game call web: goBack`)
				this.$router.push('/home')
			},
			goRecharge(token) {
				logger.info(`game call web: goRecharge`)

				this.$store.commit("ui/SET_IS_SHOW_MONEY_DIALOG", true);
				this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", true);
				this.$store.commit("ui/SET_CODE_TYPE", token || 'BNB');

			},
			goBuyBlindBox() {
				logger.info('web call game:goBuyBlindBox')
				let routeUrl = this.$router.resolve({path: "/mystery_boxes"})
				window.open(routeUrl.href)
			},
			depositEvent() {
				logger.info(`game call web: depositEvent`)
			},
			startLogin() {
				logger.info(`game call web: startLogin`)
				this.showLogin = true
			},

			// web call game methods
			sendLoginToken() {
				if (cc) {
					logger.info('web call game:SetLoginToken')
					cc.game.emit('SetLoginToken', Accounts._storedLoginToken())
				} else {
					logger.error(`sendLoginToken Invalid CC.`)
				}
			},
			sendLang() {
				if (cc) {
					logger.info(`web call game:SetLanguage ${i18n.locale}`)
					cc.game.emit('SetLanguage', i18n.locale)
				} else {
					logger.error(`sendLang Invalid CC.`)
				}
			},


			quit() {
				if (cc) {
					cc.game.off('GameInit')
					cc.game.off('depositEvent')
					cc.game.off('StartLogin')
					cc.game.off('SetToken')
					cc.game.off('goBuyBlindBox')

					cc.audioEngine.stopAll()
					cc.game.end()
					cc.director.end()
					// window.cc = undefined;
				}
			}

		},


		beforeDestroy() {
			// console.log("beforeDestroy");
			this.quit()
		},
	}
</script>

<style scoped>
	.cocos-loader {
		background-image: url(/static/img/loading.jpg);
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		/*width: 300px;*/
		/*height: 258px;*/
		width: 100%;
		height: 100%;
		position: absolute;
		/*left: 50%;*/
		/*top: 50%;*/
		/*transform: translate(-50%, -50%);*/
		/*-webkit-transform: translate(-50%, -50%);*/
		/*//@include phone {*/
		/*width: 150px;*/
		/*height: 130px;*/
		/*}*/
	}
</style>

<style scoped lang="scss">
	@import '/imports/ui/scss/index';

	.cocos-loader {
		background-color: black; //$body-bg;

		&.rotated {
			transform: rotateZ(90deg) translateY(-100vw);
			width: 100vh;
			height: 100vw;
			transform-origin: left top;
		}
	}

	.game-page {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;

		#GameCanvas,
		canvas {
			outline: none;
		}

		.wrapper {
			width: 100%;
			height: 100%;
			flex-grow: 1;
			overflow: hidden;
		}
	}
</style>
