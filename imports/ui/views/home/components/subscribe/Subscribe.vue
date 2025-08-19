<template>
  <div class="subscribe-wrapper">
    <div class="subscribe-content d-flex flex-column align-center">
      <h1 class="subscribe-title mb-4">{{ $t('home.subscribe.subscribeSlogan') }}</h1>
      <h2 class="subscribe-description text-center">{{ $t('home.subscribe.subscribeDescription') }}</h2>
      <!-- 訂閱輸入欄 -->
      <form @submit.prevent="subscribeOnclick" class="subscribe-input-wrapper">
        <input required v-model="email" type="text" :placeholder="$t('home.subscribe.inputPlaceholder')" class="subscribe-input rounded-pill" />
        <v-btn type="submit" class="subscribe-btn rounded-pill">{{ $t('home.subscribe.subscribe') }}</v-btn>
      </form>
    </div>
  </div>
</template>

<script>
// import SimpleSchema from "simpl-schema"

export default {
  name: 'Subscribe',
  data() {
    return {
      email: ''
    }
  },
  methods: {
    subscribeOnclick() {
      // 判斷是否為空值 -> 判斷是否為email -> request -> 是否成功 -> 清空欄位
      // const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/

      if (!this.email.trim()) { // 是否為空
        this.toasterWarning(this.$t('home.subscribe.emailEmptyAlertText'))
        this.email= ''
        return
      }

      if (this.email.indexOf("@") === -1) { // 格式是否錯誤
        this.toasterWarning(this.$t('home.subscribe.emailInvalidAlertText'))
        return
      }

      // 發送請求
      Meteor.call('subscription', this.email, (err, res) => {
        if (err) { // 訂閱失敗
          console.error('bindPhone err', err)
          this.toasterErr(Number(err.reason) || err.reason)
        } else { // 訂閱成功
          console.log(res)
          this.toasterSuccess(this.$t('home.subscribe.subscribeSucceed'))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../../../assets/css/utils/variables.scss';
@import '/imports/ui/scss/mixin';

.subscribe-wrapper {
  position: relative;
  width: 100%;
  padding: 0px 216px;

  .subscribe-content {
    position: relative;
    margin: 0 auto;
    margin-top: 144px;
    margin-bottom: 144px;
    width: 100%;
    max-width: 1200px;
    padding: 48px;
    padding-top: 48px;
    padding-bottom: 88px;
    background-image: url('/static/ui/home/subscribe/content_bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 35px;
    overflow: hidden;

    // 訂閱標題
    .subscribe-title {
      font-size: 48px;
      font-weight: 600;
    }

    // 訂閱小標
    .subscribe-description {
      font-size: 24px;
      margin-bottom: 96px;
    }

    // 訂閱輸入欄
    .subscribe-input-wrapper {
      position: relative;
      width: 100%;
      max-width: 846px;
      height: 90px;

      .subscribe-input {
        width: 100%;
        height: 100%;
        background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%);
        padding-left: 52px;
        font-size: 32px;
        color: #ffffff;

        &::placeholder {
          color: rgba(255, 255, 255, 0.49);
        }
      }

      .subscribe-btn {
        position: absolute;
        width: 188px;
        height: 72px;
        top: 50%;
        right: 10px;
        transform: translate(0%, -50%);
        background: #F7CD0A;

        /deep/ .v-btn__content {
          font-size: 32px;
          text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        }
      }
    }
  }
}

@media screen and (max-width: 1264px) {
  .subscribe-wrapper {
    padding: 0px 160px;

    .subscribe-content {
      padding: 48px;
      margin-top: 100px;
      margin-bottom: 100px;
      border-radius: 10px;

      .subscribe-title {
        font-size: 36px;
        margin-bottom: 12px !important;
      }

      .subscribe-description {
        font-size: 16px;
        margin-bottom: 40px;
      }

      .subscribe-input-wrapper {
        height: 60px;

        .subscribe-input {
          font-size: 20px;
          padding-left: 40px;
        }

        .subscribe-btn {
          right: 8px;
          width: 120px;
          height: 48px;

          /deep/ .v-btn__content {
            font-size: 20px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .subscribe-wrapper {
    padding: 0px 120px;

    .subscribe-content {
      padding: 24px;
      margin-top: 28px;
      margin-bottom: 28px;
      border-radius: 10px;

      .subscribe-title {
        font-size: 18px;
        margin-bottom: 12px !important;
      }

      .subscribe-description {
        font-size: 12px;
        margin-bottom: 16px;
      }

      .subscribe-input-wrapper {
        height: 40px;

        .subscribe-input {
          font-size: 12px;
          padding-left: 16px;
        }

        .subscribe-btn {
          right: 4px;
          width: 80px;
          height: 32px;

          /deep/ .v-btn__content {
            font-size: 12px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .subscribe-wrapper {
    padding: 0px 10px;

    .subscribe-content {
      padding: 12px;
      margin-top: 28px;
      margin-bottom: 28px;
      border-radius: 10px;

      .subscribe-title {
        font-size: 18px;
        margin-bottom: 12px !important;
      }

      .subscribe-description {
        font-size: 12px;
        margin-bottom: 16px;
      }

      .subscribe-input-wrapper {
        height: 40px;

        .subscribe-input {
          font-size: 12px;
          padding-left: 16px;
        }

        .subscribe-btn {
          right: 4px;
          width: 80px;
          height: 32px;

          /deep/ .v-btn__content {
            font-size: 12px;
          }
        }
      }
    }
  }
}

</style>
