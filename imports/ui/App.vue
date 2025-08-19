<template>
  <div>
    <v-app>
      <router-view />
    </v-app>
    <recharge-dialog></recharge-dialog>
  </div>
</template>
<script>
import { Token } from "../api/tokens/collections";
import { UserBalance } from "../api/account/collections";
import RechargeDialog from "./views/recharge/rechargeDialog";
import {
  BlindBox,
  BlindBoxRecord,
  BlindBoxTokenPool,
} from "../api/blindBox/collections";
import { settings } from "/imports/settings";
import i18n from "./lang";
import metaMask from "../api/walletConnect/metaMask";
import walletConnect from '../api/walletConnect/walletConnect';
import NoticeToast from './components/NoticeToast';

export default {
  components: { RechargeDialog },
  data() {
    return {
      settings,
    };
  },
  created() {
    this.getConfig();
    window.metaMask = metaMask
    window.walletConnect = walletConnect
  },
  mounted(){
    this.getNotice();
  },
  watch: {
    $route(val) {
      if (val.query.referral) {
        let referral = val.query.referral;
        localStorage.setItem("referral", referral);
      }
    },
    // 監聽 store裡面 使用者是否存在
    user(newVal, oldVal) {
      // newVal不存在 === 登出了，那就跳轉回到首頁

      if (newVal) {
        const countryCode = newVal.status && newVal.status.countryCode
        if (!countryCode || countryCode.length === 0) {
          // 如果用户没有ip，就设置浏览器语言
          this.setUserCountryCode()
        }
        let loadGameIfLogin = settings.loadGameIfLogin
        if (loadGameIfLogin && this.$route.name !== "game") {
          let isLoadedGame = localStorage.getItem('isLoadedGame')
          if (!isLoadedGame || isLoadedGame === false || isLoadedGame === 'false') {
            this.$router.push({ name: "game" });
          }
        }
      }

      if (oldVal && !newVal) {
        // 本來就在首頁就不動做
        if (this.$route.name === "home") {
          return;
        }

        this.$router.push({ name: "home" });
      }
    },
  },
  computed: {
    // ...mapGetters(['user'])
  },

  methods: {
    getNotice() {
      Meteor.call("getPublicNotice", (err,res)=>{
        if (res) {
          localStorage.setItem("publicNotice", JSON.stringify(res));

          if (!localStorage.getItem('isShowPublicNotice') || 
              localStorage.getItem('isShowPublicNotice') === false || 
              localStorage.getItem('isShowPublicNotice') === 'false') {
              localStorage.setItem("isShowPublicNotice", true);
              this.$toast.success(NoticeToast, {
                    position: "top-right",
                    timeout: 8000,
                    closeOnClick: false,
                    pauseOnFocusLoss: true,
                    pauseOnHover: true,
                    draggable: true,
                    draggablePercent: 0.6,
                    showCloseButtonOnHover: false,
                    hideProgressBar: true,
                    closeButton: 'button',
                    icon: false,
                    rtl: false
                  });
              }
        }
      })
    },
    getConfig() {
      this.setFavicon();
      this.setSiteTitle();
      this.$store
        .dispatch("user/getConfig")
        .then(() => {})
        .catch(() => {});
    },
    setFavicon() {
      const link = document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      // link.href = `/favicon/${settings.appName}-favicon.ico`
      link.href = `static/ui/favicon/${settings.appName}`;
      document.getElementsByTagName("head")[0].appendChild(link);
    },
    setSiteTitle() {
      const title = settings.appText;
      if (title) {
        document.title = title;
      }
    },
    setUserCountryCode() {
      // 取得瀏覽器語言和支持的語言
      const countryCode = navigator.language || navigator.browserLanguage
      const countryCodeFormat = countryCode.split('-')[0]
      const supportCountryCode = this.$i18n.availableLocales.map(item => {
        return item.split('-')[0]
      })

      // 檢查瀏覽器語言有無支持
      const isLanguageSupported = supportCountryCode.find(item => item === countryCodeFormat)

      Meteor.call("setUserCountry", {
        country: "",
        countryCode: isLanguageSupported ? countryCode : 'en-EN'
      })
    }
  },
  meteor: {
    $subscribe: {
      tokens: [],
      balance: [],
      blindBox: [],
      blindBoxRecord: [],
      bboxTokenPool: [],
    },
    token() {
      let tokens = Token.find({}, { sort: { order: 1 } }).fetch();
      this.$store.commit("user/SET_TOKEN", tokens);
      return tokens;
    },
    balance() {
      let balance = UserBalance.find({}).fetch();
      this.$store.commit("user/SET_BALANCE", balance);
      return balance;
    },
    user() {
      let user = Meteor.user();
      this.$store.commit("user/SET_USER", user);
      return user;
    },
    blindBox() {
      const blindBox = BlindBox.find({}).fetch();
      // console.log("blindBox:", blindBox);
      this.$store.commit("box/SET_INFO", blindBox);
      return blindBox;
    },
    blindBoxRecord() {
      const blindBoxRecord = BlindBoxRecord.find({}).fetch();
      this.$store.commit("box/SET_RECORD", blindBoxRecord);
      // console.log("blindBoxRecord:", blindBoxRecord);
      return blindBoxRecord;
    },
    nftPool() {
      const nftPool = BlindBoxTokenPool.find({}).fetch();
      this.$store.dispatch("box/setNftPool", nftPool);
      return nftPool;
    },
  },
};
</script>

<style scoped></style>
