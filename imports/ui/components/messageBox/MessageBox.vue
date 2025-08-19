<template>
  <div class="snackbar-box">
    <v-snackbar
      v-model="status"
      top
      :timeout="timeout"
      multi-line
      min-width="324"
      min-height="68"
      :color="type"
      rounded="rounded"
    >
      <div class="snackbar-content-frame">
        <v-img
          width="24"
          height="24"
          contain
          :src="`/static/ui/components/${type}.svg`"
          class="icon-close"
        />
        <div class="message">{{ message }}</div>
      </div>
      <div class="bottom-line"></div>
      <template v-slot:action="{ attrs }">
        <v-btn color="#fff" text v-bind="attrs" @click="status = false">
          <v-img
            width="18"
            height="18"
            contain
            src="/static/ui/components/close.svg"
            class="icon-close"
          />
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "success",
    },
    message: {
      type: String,
      default: "",
    },
    timeout: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      status: false,
    };
  },
  watch: {
    show: {
      immediate: true,
      handler(val) {
        if (val) {
          this.status = val;
        }
      },
    },
    status: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.status = false;
          this.$emit("closed");
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.snackbar-box {
  position: relative;
}

/deep/ .v-snack__wrapper.rounded {
  border-radius: 8px !important;
}

/deep/ .v-snack__wrapper.success {
  background: #13aa6d !important;
}

/deep/ .v-snack__wrapper.error {
  background: #cf2c46 !important;
}

.snackbar-content-frame {
  // width: 100%;
  display: inline-flex;
  text-align: left;
  justify-content: left;

  .icon-close {
    margin-right: 20px;
  }

  .message {
    width: 100%;

    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: -0.376471px;

    color: #ffffff;
  }
}

.bottom-line {
  position: absolute;
  width: 252px;
  height: 8px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0px 0px 0px 100px;
  left: 0px;
  bottom: 0px;
}
</style>
