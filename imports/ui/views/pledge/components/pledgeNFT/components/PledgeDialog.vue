<template>
  <div>
    <v-dialog v-model="show" persistent width="500px">
      <v-card class="PledgeDialog">
        <v-card-title class="">
          <p class="text">{{ $t("pledge.pledgeNFT.edit") }}</p>
          <v-spacer></v-spacer>
          <img
            :src="'/static/ui/assets/img/cross-white.png'"
            @click="$emit('closeDialog')"
          />
        </v-card-title>

        <v-card-text>
          <div class="content">
            <p>{{ $t("pledge.pledgeNFT.content") }}</p>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            :loading="loadingRedeem"
            color="primary"
            class="mr-5"
            @click="$emit('redeem')"
          >
            {{ $t("pledge.pledgeNFT.redeem") }}
          </v-btn>

          <v-btn
            :loading="loadingChange"
            color="primary"
            @click="$emit('change')"
          >
            {{ $t("pledge.pledgeNFT.change") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "PledgeDialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    loadingRedeem: {
      type: Boolean,
      default: false,
    },
    loadingChange: {
      type: Boolean,
      default: false,
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
.PledgeDialog {
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

  .v-card__text {
    padding: 0px 37px 0px 42px;
  }

  .v-card__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 31px;

    .v-btn {
      width: 160px;
    }
  }

  .content {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 69px;
    margin-bottom: 72px;

    p {
      color: #ffffff;
      font-size: 18px;
    }
  }
}

@media screen and (max-width: 600px) {
  .PledgeDialog {
    .v-card__title {
      padding: 14px 37px 14px 20px;

      .text {
        font-size: 18px;
      }
    }

    .v-card__text {
      padding: 0px 15px 0px 18px;
    }

    .v-card__actions {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 20px;

      .v-btn {
        width: 96px;
      }
    }

    .content {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 33px;
      margin-bottom: 26px;

      p {
        color: #ffffff;
        font-size: 18px;
      }
    }
  }
}
</style>
