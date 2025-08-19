<template>
  <v-card class="card list" style="overflow-y: auto">
    <div style="max-height: 80vh">
      <v-img class="close" src="/static/ui/topbar/close.png" @click="close" width="16" height="19"
             style="cursor: pointer"></v-img>
      <v-container class="container" style="padding-top: 38px;padding-left: 39px;padding-right: 39px">
        <v-row no-gutters class="white--text">
          <v-col cols="12" style="font-size: 24px;height:24px;line-height: 24px" class="text-center">
            {{ $t(isRecharge ? "recharge.title" : "recharge.withdraw") }}
          </v-col>
          <v-col class="col-9" style="margin-top: 23px">
            <div style="height: 12px;line-height: 12px;font-size: 12px">{{ $t("recharge.balance") }}</div>
            <div
                style="font-size: 20px;line-height: 20px;font-weight: 300;margin-top: 5px;color: #F7CD0A;font-weight: 600">
              {{ showBalance }}
              {{ code }}
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="2" style="margin-top: 23px;" class="d-flex justify-end">
            <currency-type @changeToken="changeToken"></currency-type>
          </v-col>
          <v-col cols="12" class="fontColor2--text text"
                 style="margin-top: 13px;font-size: 12px;line-height: 16px;">
            {{ $t(isRecharge ? "recharge.text" : "recharge.withdrawText") }}
          </v-col>
          <v-col cols="12">
            <v-btn-toggle
                v-model="btnIndex"
                background-color="transparent"
                mandatory
                class="btnToggle"
                style="height: 46px;margin-top: 20px;margin-bottom: -2px;width:100%;"
            >
              <v-btn class="btnType" v-for="(item, index) in serviceType" :key="index" height="46px" width="118px"
                     style="border-radius: 8px" @click="serviceBtn(item)">
                {{ item.type }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="12" style="margin-top: 23px" v-if="isRecharge">
            <div class="mx-auto"
                 style="width: 147px;height: 147px;background: rgba(7, 24, 22, 0.5);padding: 10px;border-radius: 8px">
              <vue-qr :text="QRcodeUrl" :margin="2" :size="128"></vue-qr>
            </div>
          </v-col>
          <v-col cols="12" style="margin-top: 24px" v-else>
            <div style="height: 12px;line-height: 12px;font-size: 14px">{{ $t("recharge.withdrawMoney") }}</div>
            <VuetifyNumberInput
                class="inputMoney mt-3"
                v-model="withdrawMoney"
                v-bind:options="MoneyVNIOption"
                :label="$t('recharge.withdrawTotalLabel')"
                height="66px"
                style="font-size: 20px"
                backgroundColor="#07181680"
                hide-details
            >
            </VuetifyNumberInput>
            <div class="float-right" style="margin-top: -48px;margin-right: 15px">
              <v-btn
                  @click="totalBtn"
                  class="px-0 btn"
                  style="max-width: 84px;max-height: 34px;min-width: 84px;font-weight: 600;font-size: 14px;line-height: 34px;height: 34px;border-radius: 8px"
              >
                {{ $t("recharge.withdrawTotal") }}
              </v-btn>
            </div>
          </v-col>
          <v-col v-if="!isRecharge" class="d-flex justify-space-between mt-3" cols="12"
                 style="font-size: 12px;line-height: 16px;height: 16px">
            <div style="font-size: 12px;line-height: 16px;height: 16px;color: #44675F;">{{
                $t("topbar.inputMoney")
              }}{{ minWithdraw }}-{{ maxWithdraw }} {{ code }}
            </div>
            <div>{{ $t("recharge.fee") }} {{ fee }} {{ code }}</div>
          </v-col>
          <v-col cols="12" class="rechargeAddress" style="margin-top: 14px;margin-bottom: 48px" v-if="isRecharge">
            <div style="height: 12px;line-height: 12px;font-size: 14px">
              {{ code }} {{ $t("recharge.rechargeAddress") }}
            </div>
            <div
                style="font-size: 14px;margin-top: 12px;background-color: rgba(7, 24, 22, 0.5);color: white;min-height: 44px;border-radius: 6px"
            >
              <span
                  style="display: inline-block;width: 100%;margin-top:10px;margin-bottom:10px;padding-left: 24px;padding-right: 36px;font-size: 14px">{{
                  QRcodeUrl
                }}</span>
            </div>
            <div class="float-right mr-4" style="height: 20px;line-height: 20px;margin-top: -33px">
              <v-btn
                  class="px-0"
                  style="max-width: 20px;max-height: 20px;min-width: 20px;background: transparent !important;"
                  :loading="getdeAddressDeposit"
                  text
                  color="#F7CD0A"
                  v-clipboard:copy="QRcodeUrl"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError">
                <v-img
                    max-width="20"
                    max-height="20"
                    src="/static/ui/recharge/copy.png"
                ></v-img>
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" style="margin-top: 28px;" v-else>
            <div style="height: 12px;line-height: 12px;font-size: 14px">
              {{ $t("recharge.withdrawAddress") }}
            </div>
            <v-text-field
                v-model="withdrawAddress"
                style="font-size: 14px;margin-top: 12px"
                height="44px"
                background-color="#07181680"
                :label="$t('recharge.withdrawAddressLabel')"
                hide-details
                @blur="addressRules"
                solo
            >
            </v-text-field>
          </v-col>
          <v-col v-if="!isRecharge" cols="12" class="fontColor3--text mt-3 withdrawError" style="font-size: 14px">
            {{ $t("recharge.withdrawError") }}
          </v-col>
          <v-col v-if="!isRecharge" cols="12" style="max-width: 380px;margin-top: 60px;margin-bottom: 40px"
                 class="mx-auto withdraw">
            <v-btn class="btn" block @click="goWithdraw" :disabled="isBtn" style="border-radius: 8px"> {{
                $t("recharge.withdraw")
              }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import CurrencyType from "./currencyType"
import VueQr from 'vue-qr'
import web3 from "web3";
import VuetifyNumberInput from "/imports/ui/components/vuetifyNumberInput/VuetifyNumberInput"
import i18n from "../../lang";
import * as _ from "lodash";
import {numFormat} from "../../../utils/math"

import {Decimal} from "meteor/mongo-decimal";

export default {
  name: "recharge",
  components: {
    CurrencyType,
    VueQr,
    VuetifyNumberInput
  },
  data: () => ({
    withdrawMoney: '',
    withdrawAddress: '',
    fee: 6,
    valid: false,
    // showBalance: '',
    code: '', //选择币种
    btnIndex: 0,
    QRcodeUrl: '',
    getdeAddressDeposit: false,
    chain: '', //链
    token: {},
    serviceType: [],
    MoneyVNIOption: {
      locale: i18n.locale,
      length: 12,
      fixed: 4,
    }
  }),
  created() {
    this.code = this.codeType
  },
  computed: {
    ...mapGetters(["isShowRechargeDialog", "tokens", "balance", "codeType"]),
    isRecharge: {
      get() {
        return this.isShowRechargeDialog;
      },
      set(val) {
        this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", val);
      },
    },
    totalPrice() {
      return this.showBalance.replace(/\,/g, "") - Number(this.fee)
    },
    //提现最小
    minWithdraw() {
      return this.token.minWithdraw
    },
    //提现最大
    maxWithdraw() {
      return this.token.maxWithdraw
    },
    //提现按钮是否可以点击
    isBtn() {
      if (this.withdrawMoney === "" || this.withdrawAddress === "") {
        return true
      } else if (this.chain.search("BEP20") === -1) {
        return false
      } else if (!web3.utils.isAddress(this.withdrawAddress)) {
        return true
      } else if (Number(this.withdrawMoney) > Number(this.maxWithdraw) || Number(this.withdrawMoney) < Number(this.minWithdraw) || Number(this.withdrawMoney) > Number(this.totalPrice)) {
        return true
      } else {
        return false
      }
    },
    showBalance() {
      let length = this.balance.length
      for (let i = 0; i < length; i++) {
        if (this.balance[i].token === this.code) {
          return numFormat(this.balance[i].amount.toFixed(4))
        } else {
          // return '0.00'
        }
      }
      return '0.00'
    }
  },
  watch: {
    //切换币种
    code() {
      this.getToken()
      // this.getBalance()
      this.chain = this.token.serviceType[0].type
      if (this.isRecharge) {
        this.getRechargeAddress()
      } else {
        this.withdrawalFee()
      }
    },
    withdrawMoney(val) {
      let value = numFormat(val).replace(/\,/g, '')
      if (Number(value) <= Number(this.maxWithdraw) && Number(value) >= Number(this.minWithdraw) && Number(value) <= Number(this.totalPrice)) {
        return true
      } else {
        if (this.withdrawMoney == this.minWithdraw) {
          this.withdrawMoney = this.minWithdraw + ''
        } else {
          this.$nextTick(() => {
            this.withdrawMoney = this.minWithdraw + ''
            this.toasterErr(12000)
          })
        }
      }
    },
  },
  methods: {
    //获取余额
    // getBalance() {
    //   let length = this.balance.length
    //   for (let i = 0; i < length; i++) {
    //     if (this.balance[i].token === this.code) {
    //       this.showBalance = numFormat(this.balance[i].amount)
    //       break
    //     } else {
    //       this.showBalance = '0.00'
    //     }
    //   }
    // },
    //提现地址判断
    addressRules() {
      if (this.withdrawAddress === '') {
        this.toasterErr(12001)
        return
      }
      if (this.chain.search("BEP20") === -1) {
        return true
      }
      if (!web3.utils.isAddress(this.withdrawAddress)) {
        this.toasterErr(12001)
      } else return true
    },
    //获取充值地址
    getRechargeAddress() {
      this.getdeAddressDeposit = true
      let lengthTokens = Meteor.user().tokens.length
      for (let i = 0; i < lengthTokens; i++) {
        if (Meteor.user().tokens[i].id === this.code && Meteor.user().tokens[i].address) {
          let lengthCodes = Meteor.user().tokens[i].address.length
          for (let o = 0; o < lengthCodes; o++) {
            if (Meteor.user().tokens[i].address[o].type === this.chain) {
              this.QRcodeUrl = Meteor.user().tokens[i].address[o].address
              this.getdeAddressDeposit = false
              break
            } else {
              this.QRcodeUrl = ""
            }
          }
          break
        } else {
          this.QRcodeUrl = ""
        }
      }
      if (this.QRcodeUrl === "") {
        Meteor.call("addTokenAddress", (err, res) => {
          if (err) {
            this.toasterErr(Number(err.reason) || err.reason)
          } else {
            setTimeout(() => {
              _.find(Meteor.user().tokens, (o) => {
                if (o.id === this.code) {
                  _.find(o.address, (m) => {
                    if (m.type === this.chain) {
                      this.QRcodeUrl = m.address
                      this.getdeAddressDeposit = false
                    }
                  })
                }
              })
            }, 3500)
          }
        })
      }
    },
    //提现
    goWithdraw() {
      Meteor.call("withdraw", this.code, this.withdrawAddress, this.withdrawMoney, "", this.chain, (err, res) => {
        if (err) {
          this.toasterErr(Number(err.reason) || err.reason)
        } else {
          this.toasterSuccess(this.$t("topbar.depositSuccess"))
          this.withdrawMoney = this.minWithdraw
          this.withdrawAddress = ""
          // location.reload()
        }
      })
    },
    //提现手续费
    withdrawalFee() {
      if (this.token.serviceType) {
        for (let i = 0; i < this.token.serviceType.length; i++) {
          if (this.token.serviceType[i].type === this.chain) {
            this.fee = this.token.serviceType[i].withdrawalFee
            break
          } else this.fee = this.token.withdrawalFee
        }
      } else {
        this.fee = this.token.withdrawalFee
      }
    },
    //更换code
    changeToken(val) {
      this.code = val
    },
    //切换链
    serviceBtn(item) {
      if (this.isRecharge) {
        this.chain = item.type
        this.getRechargeAddress()
      } else {
        this.chain = item.type
        this.fee = item.withdrawalFee
        this.withdrawAddress = ""
      }
    },
    //关闭
    close() {
      this.$emit("close")
    },
    //得到token
    getToken() {
      let length = this.tokens.length
      for (let i = 0; i < length; i++) {
        if (this.tokens[i]._id === this.code) {
          this.token = this.tokens[i]
          if (this.tokens[i].serviceType) {
            this.serviceType = this.tokens[i].serviceType
          } else {
            this.serviceType = this.tokens[i].defaultServiceType
          }
          break;
        } else {
          this.token = {}
          this.serviceType = []
          this.QRcodeUrl = ''

        }
      }
    },
    //全部
    totalBtn() {
      let price = Decimal.sub(this.showBalance.replace(/\,/g, ""), this.fee)
      this.withdrawMoney = price.toString()
    },
    onCopy() {
      this.toasterSuccess(this.$t("invitation.copySucceed"))
    },
    onError() {
    },
  }
}
</script>

<style scoped lang="scss">

@import '/imports/ui/scss/theme';


>>> .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
  padding: 0 24px !important;
}

.close {
  position: absolute !important;
  right: 20px;
  top: 18px;
}

.card {
  background: $commonBackground2;
  border-radius: 8px !important;
  border: $commonBorder !important;
  box-shadow: $commonBoxShadow !important;
}

.inputMoney >>> .v-label {
  font-size: 20px !important;
}


.v-btn--is-elevated {
  border-radius: 6px !important;
  background: $btnDisableColor !important;
  color: black !important;
}

.v-btn--active {
  background: $btnColor !important;
  border-radius: 6px !important;
  border: $commonBorder !important;
  color: #fff !important;
}

.v-btn--active >>> .v-btn__content {
  color: white !important;
}

.btn {
  background: $btnColor !important;
  height: 46px !important;
  color: #ffffff !important;
}

.btn.v-btn--disabled {
  border-radius: 8px !important;
  background: #C3C3C3 !important;
  color: black !important;
}

.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background: linear-gradient(142.1deg, #727272 -41.15%, #CACACA 94.16%) !important;
  height: 46px !important;
  font-weight: 400;
  color: #FFFFFF !important;
  font-size: 18px;
}

.list::-webkit-scrollbar {
  display: none !important;
}

.btnType {
  margin-right: 16px;
}

.btnType:last-child {
  margin-right: 0px !important;


}

>>> .v-textarea.v-text-field--enclosed textarea {
  color: white !important;
  line-height: 44px !important;
  padding-right: 18px !important;
}

@media screen and (max-width: 600px) {
  .container {
    padding-left: 18px !important;
    padding-right: 18px !important;
    padding-top: 17px !important;
  }

  .btnType {
    width: 80px !important;
    height: 36px !important;
    border-radius: 6px !important;
    margin-right: 13px;
  }

  .btnType:last-child {
    margin-right: 0px !important;
  }

  .btnToggle {
    height: 36px !important;
    margin-top: 9px !important;
  }

  .text {
    margin-top: 6px !important;
  }

  .rechargeAddress {
    margin-bottom: 9px !important;
  }

  .withdraw {
    margin-top: 22px !important;
    margin-bottom: 7px !important;
  }

  .withdrawError {
    margin-top: 7px !important;
  }
}
</style>