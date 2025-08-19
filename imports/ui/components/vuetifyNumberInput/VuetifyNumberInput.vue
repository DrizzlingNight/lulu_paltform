<template>
  <v-text-field
      v-model="cmpValue"
      v-bind:label="label"
      v-bind:placeholder="placeholder"
      v-bind:readonly="readonly"
      v-bind:disabled="disabled"
      v-bind:outlined="outlined"
      v-bind:dense="dense"
      v-bind:hide-details="hideDetails"
      v-bind:error="error"
      v-bind:rules="rules"
      v-bind:clearable="clearable"
      v-bind:backgroundColor="backgroundColor"
      v-bind:prefix="options.prefix"
      v-bind:suffix="options.suffix"
      v-bind:height="height"
      v-on:change="change"
      color="btnColor"
      solo
      class="mt-0 pt-0"
      required
  ></v-text-field>
</template>

<script>
export default {
  model: {prop: "value", event: "input"},
  props: {
    value: {
      // type: String,
      type: [String, Number],
      default: "0",
    },
    label: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: undefined,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: [Boolean, String],
      default: false,
    },
    rules: {
      type: [Array, String],
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: "white",
    },
    valueWhenIsEmpty: {
      type: String,
      default: "", // "0" or "" or null
    },
    options: {
      type: Object,
      default: function () {
        return {
          locale: "zh-TW",
          prefix: "",
          suffix: "",
          length: 11,
          fixed: 4,
          precision:4,
        };
      },
    },
  },
  data: () => ({}),
  /*
   v-model="cmpValue": Dessa forma, ao digitar, o valor Ã© atualizado automaticamente no componente pai.
   O valor digitado entra pelo newValue do Set e Ã© emitido para o componente pai.
   the-vue-mask nao funciona corretamente ao incluir valores existentes no componente pai.
  */
  computed: {
    // cmpValue() {
    //   return this.value !== null && this.value !== ""
    //       ? this.humanFormat(this.value.toString())
    //       : this.valueWhenIsEmpty;
    // },
    cmpValue: {
      get: function () {
        // console.log("get value",this.value)
        // console.log("getRes",this.value !== null && this.value !== ""
        //     ? this.humanFormat(this.value.toString())
        //     : this.valueWhenIsEmpty)
        return this.value !== null && this.value !== ""
            ? this.humanFormat(this.value.toString())
            : this.valueWhenIsEmpty;
      },
      set: function () {
        // console.log("set value",this.value)
        // console.log("set newvalue",newValue)
        //this.$emit("input", newValue);
        //this.$emit("input", this.machineFormat(newValue));
      },
    },
  },
  methods: {
    humanFormat: function (number) {
      if (isNaN(number)) {
        number = "";
      } else {
        // number = Number(number).toLocaleString(this.options.locale, {maximumFractionDigits: 2, minimumFractionDigits: 2, style: 'currency', currency: 'BRL'});
        number = Number(number).toLocaleString(this.options.locale, {
          maximumFractionDigits: this.options.fixed,
          minimumFractionDigits: 0,
        });
      }
      return number;
    },
    machineFormat(number) {
      if (number) {
        number = this.cleanNumber(number);
        // number =
        //     number.substring(
        //         0,
        //         number.length - parseInt(this.options.precision)
        //     ) +
        //     "." +
        //     number.substring(
        //         number.length - parseInt(this.options.precision),
        //         number.length
        //     );
        if (isNaN(number)) {
          number = this.valueWhenIsEmpty;
        }
      } else {
        number = this.valueWhenIsEmpty;
      }
      number = Number(number).toFixed(this.options.fixed)
      return number;
    },
    keyPress($event) {
      let key = $event.key ? $event.key : "a";
      if (!/[0-9.]/.test(key)) {
        $event.preventDefault();
      }
      if (this.overFixed()) {
        $event.preventDefault();
      }
    },
    change($event) {
      // console.log("event",$event)
      this.$emit("input", this.machineFormat($event));
      return
    },
    cleanNumber: function (value) {
      let result = "";
      if (value) {
        let flag = false;
        let pointFlag = false;
        let arrayValue = value.toString().split("");
        for (var i = 0; i < arrayValue.length; i++) {
          if (this.isInteger(arrayValue[i])) {
            if (!flag) {
              if (arrayValue[i] !== "0") {
                result = result + arrayValue[i];
                flag = true;
              }
            } else {
              result = result + arrayValue[i];
            }
          }else if (arrayValue[i] === "." && !pointFlag){
            result = result + arrayValue[i];
            pointFlag = true
            flag = true
          }
        }
      }
      return result;
    },
    isInteger(value) {
      let result = false;
      if (Number.isInteger(parseInt(value))) {
        result = true;
      }
      return result;
    },

    //超过小数位数
    overFixed() {
      if(this.cleanNumber(this.value).split(".")[1].length >= this.options.fixed)
        return false
      else return true
      // return Number(this.cleanNumber(this.value).length) >=
      //     Number(this.options.length);
    },
  },
};
</script>
<style scoped>
</style>
