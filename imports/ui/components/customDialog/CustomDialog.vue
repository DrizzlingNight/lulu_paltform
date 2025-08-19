<template>
  <div>
    <v-dialog v-model="show" persistent :width="width">
      <v-card class="CustomDialog">
        <v-card-title class="">
          <p class="text">{{ title }}</p>
          <v-spacer></v-spacer>
          <img
            :src="'/static/ui/assets/img/cross-white.png'"
            @click="$emit('closeDialog')"
          />
        </v-card-title>

        <div class="content-wrapper">
          <v-card-text>
            <slot name="content"></slot>
          </v-card-text>
        </div>

        <v-card-actions>
          <div class="btn-wrapper d-flex flex-column">
            <v-btn
              :disabled="disabled"
              :loading="loading"
              color="primary"
              @click="$emit('confirm')"
            >
              {{ $t("base.confirm") }}
            </v-btn>
            <slot name="afterBtnText"></slot>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "CustomDialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "500px",
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.CustomDialog {
  background: linear-gradient(136deg, #06261f 0%, #08322d 100%);
  border-radius: 8px;
  border: 1px solid #00ffca;
  box-shadow: 0px 5px 8px 1px rgba(0, 37, 19, 0.5);

  .v-card__title {
    border-bottom: 1px solid #2d4742;
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

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .v-card__text {
      // padding: 0px 40px;
      max-width: 362px;
    }

  }

  

  .v-card__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 40px 32px 40px;
    // padding-bottom: 32px;


    .btn-wrapper {
      max-width: 100%;
      position: relative;

      .v-btn {
        max-width: 100%;
        width: 362px;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .CustomDialog {
    .v-card__title {
      .text {
        font-size: 16px !important;
      }
    }

    .v-card__text {
      padding: 0px 28px !important;

      /deep/ .v-label {
        font-size: 12px !important;
      }
    }

    .v-card__actions {
      padding: 0px 28px 16px 28px;
      .btn-wrapper {
        .v-btn {
          
        }
      }
    }
  }
}
</style>
