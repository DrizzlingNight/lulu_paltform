<template>
  <div>
    <v-dialog
      v-model="show"
      persistent
      width="500"
    >
      <v-card  class="ModifyPasswordDialog">
        <v-card-title class="">
          <p class="text">{{ $t('my.accountSetting.modifyPassword') }}</p>
          <v-spacer></v-spacer>
          <img :src="'/static/ui/assets/img/cross-white.png'" @click="$emit('closeDialog')">
        </v-card-title>

        <v-card-text>
          <div class="old-password">
            <p>{{ $t('my.accountSetting.oldPassword') }}</p>
            <v-text-field
              label=""
              :placeholder="$t('my.accountSetting.placeholder_oldPassword')"
            >
            </v-text-field>
          </div>
          <div class="new-password">
            <p>{{ $t('my.accountSetting.newPassword') }}</p>
            <v-text-field
              label=""
              :placeholder="$t('my.accountSetting.placeholder_newPassword')"
            >
            </v-text-field>
          </div>
          <div class="confirm-password">
            <p>{{ $t('my.accountSetting.confirmPassword') }}</p>
            <v-text-field
              label=""
              :placeholder="$t('my.accountSetting.placeholder_confirmPassword')"
            >
            </v-text-field>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="primary"
            @click="$emit('confirm')"
          >
            {{ $t('base.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: 'ModifyPasswordDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  created() {
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .ModifyPasswordDialog {
    background: linear-gradient(136deg, #06261F 0%, #08322D 100%);
    border-radius: 8px;
    border: 1px solid #00FFCA;
    box-shadow: 0px 5px 8px 1px rgba(0, 37, 19, 0.5);
  
    .v-card__title {
      border-bottom: 1px solid #2D4742;
      padding: 26px 37px 18px 42px;

      .text {
        color: #ffffff;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 0px;
      }

      img {
        cursor: pointer;
      }
    }

    .v-card__text {
      padding: 0px 37px 0px 42px;

      .old-password,
      .new-password,
      .confirm-password {
        display: flex;
        flex-basis: row;
        align-items: center;
        justify-content: space-between;
        width: 362px;
        max-width: 362px;

        p {
          width: 100px;
          color: #FFFFFF;
          font-size: 16px;
        }

        .v-text-field {
          flex-grow: 0.5;
          
          // input {
          //   color: #44675F;
          // }
        }
      }
    }

    .v-card__actions {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 31px;

      .v-btn {
        width: 362px;
      }
    }
  }


</style>