<template>
  <div class="invite-wrapper">
    <div class="invite-content rounded-pill">
      <v-img contain src="/static/ui/home/invite/medal.png" class="medal"></v-img>
      <span class="slogan">{{ $t('home.invite.mainSlogan') }}</span>
      <v-btn @click="inviteOnclick" class="invite-btn rounded-circle" :class="$i18n.locale">{{ $t('home.invite.inviteFriends') }}</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Invite',
  methods: {
    inviteOnclick() {
      this.$router.push({ name: 'invitation' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../../../assets/css/utils/variables.scss';


.invite-wrapper {
  position: relative;
  width: 100%;
  padding: 0px 140px;

  .invite-content {
    margin: 168px auto;
    position: relative;
    width: 100%;
    max-width: 1200px;
    height: 340px;
    background: linear-gradient(136.3deg, #06261F 2.34%, #08322D 98.54%);
    overflow: hidden;

    // 獎章圖
    .medal {
      width: 40%;
      height: auto;
      position: absolute;
      top: 40%;
      transform: translate(-10%, -40%);
    }

    // 中間文字
    .slogan {
      position: absolute;
      width: 36%;
      max-width: 450px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 36px;
    }

    // 邀請按鈕
    .invite-btn {
      background: linear-gradient(268.14deg, #FFD12F 14.27%, #FF8E00 91.59%);
      position: absolute;
      width: 236px;
      height: 236px;
      top: 50%;
      right: 44px;
      transform: translate(0%, -50%);

      
      /deep/ .v-btn__content {
        font-size: 36px;
        font-weight: 600;
        max-width: 220px;
        white-space: pre-wrap;
        text-align: center;
      }
    }
  }
}

@media screen and (max-width: 1264px) {
  .invite-wrapper {
    padding: 0px 160px;
    
    .invite-content {
      margin: 120px auto 120px;
      height: 200px;

      .slogan {
        font-size: 24px;
      }

      .invite-btn {
        width: 172px;
        height: 172px;
        right: 12px;

        /deep/ .v-btn__content {
          font-size: 24px;
          max-width: 152px;
        }
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .invite-wrapper {
    padding: 0px 120px;
    
    .invite-content {
      margin: 50px auto 80px;
      height: 100px;

      // 獎章圖
      .medal {
        width: 36%;
        height: auto;
        position: absolute;
        top: 40%;
        transform: translate(-5%, -40%);
      }

      .slogan {
        font-size: 14px;
      }

      .invite-btn {
        width: 84px;
        height: 84px;
        right: 8px;

        /deep/ .v-btn__content {
          font-size: 14px;
          max-width: 84px;
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .invite-wrapper {
    padding: 0px 8px;
    
    .invite-content {
      margin: 20px auto 40px;
      height: 80px;

      .slogan {
        font-size: 12px;
        min-width: 148px;
      }

      .invite-btn {
        width: 64px;
        min-width: 64px;
        height: 64px;
        right: 8px;

        /deep/ .v-btn__content {
          font-size: 12px !important;
          max-width: 64px;
        }
      }
    }
  }
}

</style>