<template>
  <div>
    <img style="width: 100%;height:100%;" :src="imgPath || firstFrame">
  </div>
</template>

<script>
  export default {
    name: 'AnimatedImage',
    props: {
      imgPaths: {
        type: Array,
        default: () => []
      },
      duration: {
        type: Number,
        default: 2000
      },
      type: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        imgPath: null,
        isPlaying: false,
        isPreloading: false,
        playIndex: 0,
        playCount: 1, // 播放次数，默认1次
        playedCount: 0, // 已经播放了多少次

        timer: null
      }
    },
    methods: {
      play(count) {
        if (!this.isPlaying) {
          this.playCount = count
          this.isPlaying = true
          const len = this.imgPaths.length - this.playIndex
          this._play(this.playIndex, len)
        }
      },
      stop() {
        this.playedCount = 0
        this.isPlaying = false
        this.playIndex = 0;
        if (this.timer != null) {
          clearInterval(this.timer)
        }
      },
      _preload(imgPaths, index, failed) {
        const idx = index || 0
        const f = failed || 0
        this.isPreloading = true
        return new Promise((resolve, reject) => {
          var image = new Image()
          if (idx < imgPaths.length) {
            image.src = imgPaths[idx]
            image.onload = (e) => {
              if (idx === (imgPaths.length - 1)) {
                self.isPreloading = false
                resolve('success')
              } else {
                resolve(this._preload(imgPaths, idx + 1, f))
              }
            }
            image.onerror = (e) => {
              if (f === 3) { // 失败3次就直接中断
                self.isPreloading = false
                reject()
              }
              resolve(this._preload(imgPaths, idx, f + 1))
            }
          } else {
            reject()
          }
        })
      },
      _play(i, len) {
        const self = this
        const total = this.imgPaths.length

        this.timer = setInterval(() => {
          self.playIndex = i
          self.imgPath = this.imgPaths[i]
          ++i
          if (i === total - 1) {
            ++this.playedCount
            i = 0
            self.playIndex = 0

            if (this.playedCount === this.playCount && this.playCount !== 0) {
              self.isPlaying = false
              self.playIndex = 0
              clearInterval(self.timer)
              this._complete()
            }
            // self.imgPath = this.imgPaths[0];
          }
        }, this.duration / total)
      },
      _complete() {
        this.$emit('complete')
      },
      _preloadComplete() {
        this.$emit('preloadComplete', this.type)
      }
    },
    computed: {
      firstFrame() {
        return this.imgPaths.length > 0 ? this.imgPaths[0] : ''
      }
    },
    watch: {
      'imgPaths': {
        handler(newVal, oldVal) {
          if (newVal.length > 0 && newVal !== oldVal) {
            if (!this.isPreloading) {
              this._preload(newVal).then(e => {
                this._preloadComplete()
              }).catch(err => {
                console.log('preload err:', err)
              })
            }
          }
        },
        deep: true,
        immediate: true,
      }
    }
  }
</script>

<style>

</style>