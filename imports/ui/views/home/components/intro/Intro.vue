<template>
  <div class="intro-wrapper">
		<!-- 背景 -->
		<v-img width="100%" height="100%" src="/static/ui/home/intro/bg.png" class="bg"></v-img>
    <div class="intro-content d-flex">
			<!-- intro 左側區塊文字群 -->
			<div class="text-group-wrapper d-flex flex-column">
				<!-- logo -->
				<v-img src="/static/ui/home/intro/logo.png" contain class="logo mb-8"></v-img>
				<!-- title -->
				<h1 class="section-title text-center text-md-start mb-4 mb-sm-12">{{ $t('home.intro.sectionTitle') }}</h1>
				<!-- description -->
				<h2 class="section-description">
					{{ $t('home.intro.sectionDescription1') }}<br/>
					{{ $t('home.intro.sectionDescription2') }}
				</h2>
				<!-- 體驗按鈕 -->
				<v-btn @click="demoOnclick()" class="demo-btn">{{ $t('home.intro.demoBtn') }}</v-btn>
			</div>
			<!-- intro 右側區塊 影片 + 標籤 -->
			<div class="video-group-wrapper d-flex flex-column">
				<!-- YT 影片框 -->
				<div class="video-outer-wrapper mb-6">
					<v-img src="/static/ui/home/intro/video_title.png" contain class="video-title"></v-img>
					<!-- 可觸發開啟的影片封面 -->
					<v-dialog
						v-model="isVideoDialogOpen"
						width="auto"
					>
						<template v-slot:activator="{ on, attrs }">
							<div @click="isVideoDialogOpen = true" v-bind="attrs" v-on="on" class="video-inner-wrapper">
								<v-img width="100%" height="100%" :src="coverImg"></v-img>
								<v-img src="/static/ui/home/intro/play_btn.svg" contain class="play-btn"></v-img>
							</div>
						</template>
						<!-- 彈窗卡片 -->
						<VideoDialogCard v-if="isVideoDialogOpen" @closeVideoDialog="isVideoDialogOpen = false"/>
					</v-dialog>
				</div>
				<!-- 影片下方標籤群 -->
				<div class="tags-wrapper d-flex flex-column">
					<div class="tags-top d-flex">
						<div class="tag">{{ $t('home.intro.tag1') }}</div>
						<div class="tag">{{ $t('home.intro.tag2') }}</div>
					</div>
					<div class="tags-bottom d-flex">
						<div class="tag">{{ $t('home.intro.tag3') }}</div>
						<div class="tag">{{ $t('home.intro.tag4') }}</div>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>


<script>
import { Game } from './../../../../../api/games/collections'

import VideoDialogCard from './components/videoDialogCard/VideoDialogCard.vue'

export default {
  name: 'Intro',
	components: {
		VideoDialogCard
	},
	data: () => ({
		isVideoDialogOpen: false,
	}),
	computed: {
		coverImg() {
			let locale = this.$i18n.locale
			locale = locale === 'kr-KR' ? 'en-EN' : locale
			return '/static/ui/home/intro/video_cover_' + locale + '.png'
		}
	},
	methods: {
		demoOnclick() {
			// 如果遊戲不開放就會跳提示
			if (!this.games[0] || this.games[0]._id !== 'market') {
					// TODO
			this.toasterComingSoon()
			return
					// console.log('market !ready')
			}
			this.$router.push({ name: 'game' })
		},
	},
	meteor: {
    $subscribe: {
      games: []
    },
    games() {
      const games = Game.find({}).fetch()
      return games
    }
  }
}
</script>

<style lang="scss" scoped>

@import '/imports/ui/scss/mixin';

.intro-wrapper {
	position: relative;
  width: 100%;
  padding: 0px 216px;

  // 聖誕背景圖
  .bg {
    z-index: 0;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
  }

	// intro 內容
  .intro-content {
    position: relative;
    z-index: 1;
    margin: 0 auto;
    padding-top: 180px;
    padding-bottom: 92px;
    width: 100%;
    max-width: 1200px;
		gap: 24px;

		.text-group-wrapper {
			width: 50%;

			.logo {
				max-width: 88px;
				max-height: 52px;
			}

			.section-title {
				font-size: 68px;
			}

			.section-description {
				font-size: 36px;
				margin-bottom: 72px;
			}

			.demo-btn {
				width: 380px;
				height: 60px;
				background: linear-gradient(268.14deg, #FFD12F 14.27%, #FF8E00 91.59%);

				/deep/ .v-btn__content {
					@include common-btn-title;
				}
			}
		}

		.video-group-wrapper {
			// border: 1px solid pink;
			width: 50%;

			.video-outer-wrapper {
				position: relative;
				width: 100%;
				height: 376px;
				border: 2px solid #2D4742;
				border-radius: 20px;
				padding: 20px;

				.video-title {
					position: absolute;
					width: 184px;
					height: auto;
					top: 0px;
					left: 50%;
					transform: translate(-50%, -50%);
				}

				.video-inner-wrapper {
					position: relative;
					width: 100%;
					height: 100%;
					border-radius: 10px;
					overflow: hidden;
					cursor: pointer;

					.play-btn {
						position: absolute;
						width: 10%;
						height: auto;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}
			}

			.tags-wrapper {
				width: 100%;
				gap: 12px;
				flex-wrap: wrap;

				.tags-top,.tags-bottom {
					width: 100%;
					gap: 12px;
					flex-wrap: nowrap;
				}

				.tag {
					background: #00322E;
					width: 50%;
					height: 84px;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 24px;
					font-weight: 600;
					border-radius: 8px;
				}
			}
		}
	}
}

@media screen and (max-width: 1264px) {
	.intro-wrapper {
		padding: 0px 160px;

		// intro 內容
		.intro-content {
			padding-top: 140px;
			padding-bottom: 72px;
			gap: 20px;

			.text-group-wrapper {
				width: 50%;

				.logo {
					max-width: 76px;
					max-height: 42px;
				}

				.section-title {
					font-size: 48px;
				}

				.section-description {
					font-size: 24px;
					margin-bottom: 72px;
				}

				.demo-btn {
					max-width: 380px;
					width: 80%;
					height: 48px;
				}
			}

			.video-group-wrapper {
				// border: 1px solid pink;
				width: 50%;

				.video-outer-wrapper {
					height: 348px;
					border: 1px solid #2D4742;
					border-radius: 20px;
					padding: 16px;

					.video-title {
						width: 140px;
					}

					.video-inner-wrapper {
						border-radius: 10px;
						overflow: hidden;
					}
				}

				.tags-wrapper {
					gap: 10px;

					.tags-top,.tags-bottom {
						gap: 10px;
					}

					.tag {
						height: 60px;
						font-size: 20px;
						border-radius: 8px;
					}
				}
			}
		}
	}
}

@media screen and (max-width: 960px) {
	.intro-wrapper {
		padding: 0px 120px;

		// intro 內容
		.intro-content {
			padding-top: 100px;
			padding-bottom: 60px;
			flex-direction: column-reverse;
			gap: 0px;

			.text-group-wrapper {
				align-items: center;
				width: 100%;

				.logo {
					max-width: 76px;
					max-height: 42px;
				}

				.section-title {
					font-size: 36px;
				}

				.section-description {
					text-align: center;
					font-size: 20px;
					margin-bottom: 48px;
				}

				.demo-btn {
					max-width: 380px;
					width: 80%;
					height: 48px;
				}
			}

			.video-group-wrapper {
				// border: 1px solid pink;
				width: 100%;
				margin-bottom: 64px;

				.video-outer-wrapper {
					height: 348px;
					border: 1px solid #2D4742;
					border-radius: 20px;
					padding: 16px;

					.video-title {
						width: 140px;
					}

					.video-inner-wrapper {
						border-radius: 10px;
						overflow: hidden;
					}
				}

				.tags-wrapper {
					gap: 8px;

					.tags-top,.tags-bottom {
						gap: 8px;
					}

					.tag {
						height: 60px;
						font-size: 14px;
						border-radius: 8px;
					}
				}
			}
		}
	}
}

@media screen and (max-width: 600px) {
	.intro-wrapper {
		padding: 0px 10px;

		// intro 內容
		.intro-content {
			padding-top: 80px;
			padding-bottom: 40px;
			flex-direction: column-reverse;

			.text-group-wrapper {
				align-items: center;
				width: 100%;

				.logo {
					max-width: 76px;
					max-height: 42px;
				}

				.section-title {
					font-size: 36px;
				}

				.section-description {
					text-align: center;
					font-size: 16px;
					margin-bottom: 48px;
				}

				.demo-btn {
					max-width: 380px;
					width: 60%;
					height: 48px;
				}
			}

			.video-group-wrapper {
				// border: 1px solid pink;
				width: 100%;

				.video-outer-wrapper {
					height: 348px;
					border: 1px solid #2D4742;
					border-radius: 20px;
					padding: 16px;

					.video-title {
						width: 140px;
					}

					.video-inner-wrapper {
						border-radius: 10px;
						overflow: hidden;
					}
				}

				.tags-wrapper {
					gap: 8px;

					.tags-top,.tags-bottom {
						gap: 8px;
					}

					.tag {
						height: 44px;
						font-size: 14px;
						border-radius: 8px;
					}
				}
			}
		}
	}
}

</style>
