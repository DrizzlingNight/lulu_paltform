<script>
import { mapGetters } from "vuex";

export default {
  filters: {
    fillZero(value) {
      const num = Number(value);
      return num > 9 ? `${num}` : `0${num}`;
    },
  },
  data() {
    return {
      openShow: false,
      loginShow: false,
      errShow: false,
      show: false,
      resType: "",
      msg: "",
      isLoading: [false, false],
      active: false,
      total: 10000,
      quantity: 7000,
      remaining: 300,
      octimer: null,
      startTime: new Date("2021-11-30 20:00:00").getTime(),
      timestamp: 1640315615000,
      timer: {},
      isLogin: false,
      bbid: "",

      imgType: "waiting",
      num: 1,
      counts: {
        waiting: 31,
        open: 20,
      },
      openDatas: [],
      ocTimer: null,
    };
  },
  computed: {
    ...mapGetters(["user", "tokens", "boxInfo", "boxNftPool"]),
    quantityStr() {
      const quantity = "0000" + this.remaining.toString();
      return quantity.slice(-5, quantity.length);
    },
  },
  watch: {
    show: {
      immediate: true,
      handler(newVal, oldVal) {
        if (!newVal && newVal !== oldVal && this.resType === "success") {
          this.resType = "";
          this.openShow = true;
        }
      },
    },
    openShow: {
      immediate: true,
      handler(val) {
        const foo = document.childNodes[1];
        if (val) {
          foo.style.overflow = "hidden";
        } else {
          foo.style.overflow = "hidden scroll";
        }
      },
    },
    user: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        // console.log("user:", newVal)
        if (newVal && newVal !== oldVal) {
          // console.log(newVal)
          this.isLogin = true;
        } else {
          this.isLogin = false;
          // this.isLogin = true;
        }
      },
    },
    boxInfo: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal && JSON.stringify(newVal) !== "{}") {
          const boxId = this.$route.params.id || 2;
          const info = newVal.find(element => element._id == boxId);
          this.startTime = info.startTime.getTime();
          this.active = info.active;
          // this.active = this.startTime <= (new Date()).valueOf();
          // this.active = false;
          // console.log(newVal)

          if (!this.active) {
            this.timer = this.getDt();
            this.countDown();
          }
        }
      },
    },
    boxNftPool: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal && newVal.length > 0) {
          // console.log("boxNftPool")
          let sumTotal = 0;
          let sumNDefined = 0;

          newVal.forEach((element, index) => {
            if (index === 0) {
              // console.log(element);
              this.bbid = element.bboxId;
            }

            sumTotal += element.total;
            sumNDefined += element.nDefined;
          });

          this.total = sumTotal;
          this.remaining = sumNDefined;
        }
      },
    },
    imgType: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal == "waiting" && oldVal == "open" && newVal !== oldVal) {
          setTimeout(() => {
            this.openShow = true;
          }, 1000);
        }
      },
    },
  },
  created() {
    // Meteor.call("test_initBlindBoxData")
  },
  beforeDestroy() {
    this.octimer = this.octimer = null;
  },
  methods: {
    getDt() {
      const dt = parseInt(this.startTime.toString().slice(0, 10));
      const now = parseInt(new Date().getTime().toString().slice(0, 10));

      const time = dt - now;
      const sec = time % 60;
      const min = Math.floor(time / 60) % 60;
      const hour = Math.floor(time / 3600) % 24;
      const day = Math.floor(time / (3600 * 24));

      return { day, hour, min, sec, time };
    },
    countDown() {
      this.octimer = setInterval(() => {
        this.timer = this.getDt();
        this.active = this.startTime <= (new Date()).valueOf();
      }, 1500);
    },
    make(loading, num) {
      if (this.isLogin) {
        this.$set(this.isLoading, loading, true);
        const bbId = this.bbid;
        const number = String(num);

        Meteor.call("openBlindBox", bbId, number, (err, res) => {
          this.$set(this.isLoading, loading, false);
          if (err) {
            if (Number(err.reason) == 20006 || err.reason == 20006) {
              this.errShow = true;
            } else {
              console.error("openBlindBox err", err);
              this.toasterErr(Number(err.reason) || err.reason);
            }
          } else {
            // console.log("bindPhone res", res);
            this.openDatas = res.map((item) => item.info.nftPool.info);
            this.$set(this, "imgType", "open");
            this.toasterSuccess(this.$t("base.success"));

            setTimeout(() => {
              this.$set(this, "imgType", "waiting");
            }, 1500);
          }
        });
      } else {
        this.loginShow = true;
      }

    },
    share() {
      if (this.isLogin) {
        this.$router.push("/invitation");
        pass;
      } else {
        this.toasterErr("10103");
        // this.loginShow = true;
      }
    },
    recharge() {
      this.errShow = false;
      this.$store.commit("ui/SET_IS_SHOW_MONEY_DIALOG", true);
      this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", true);
      this.$store.commit("ui/SET_CODE_TYPE", "BNB");
    },
  },
};
</script>
