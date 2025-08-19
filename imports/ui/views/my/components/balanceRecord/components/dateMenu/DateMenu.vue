<template>
  <v-menu
      v-model="show"
      :close-on-content-click="false"
      max-width="290"
      class="DateMenu"
      slot="prepend-inner"
      offset-y
    >
    <template v-slot:activator="{ on, attrs }">
      <v-btn 
        plain
        text
        color="white"
        class="date-select"
        v-bind="attrs"
        v-on="on"
      >
        <div class="date">
          <p>{{ dateShow[0] }}</p>
          <p>{{ betweenLabel }}</p>
          <p>{{ dateShow[1] }}</p>
        </div>
        <img 
          class="date-icon"
          src="/static/ui/assets/img/date.png"
        />
      </v-btn>
    </template>
    <v-date-picker
      v-model="dateShow"
      range
      no-title
      scrollable
      :min="minDate"
    >
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        @click="close"
      >
        Cancel
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="selectDate"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>

export default {
  name: 'DateMenu',
  props: {
    dates: {
      require: true,
      default: function() { return [] },
    },
    betweenLabel: {
      require: false,
      default: '-',
    },
    // 用于限制最早日期，格式 'yyyy-MM-dd'
    minDate: ''
  },
  data() {
    return {
      show: false,
      dateShow: []
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    close() {
      this.dateShow = [...this.dates]
      this.show = false
    },
    selectDate() {
      // 如果沒有選擇endDate就讓它為startDate+1天
      if (!this.dateShow[1]) {
        const startDate = new Date(this.dateShow[0]).getTime()
        const endDate = new Date(Number(startDate) + (60 * 60 * 24 * 1000))
        this.dateShow[1] = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate() < 10 ? `0${endDate.getDate()}` : endDate.getDate()}`
      }

      // 如果時間選擇顛倒過來就讓它反過來
      if (this.dateShow[1]) {
        const startDate = new Date(this.dateShow[0]).getTime()
        const endDate = new Date(this.dateShow[1]).getTime()

        if (startDate > endDate) {
          const tempDate = [...this.dateShow]
          this.dateShow[0] = tempDate[1]
          this.dateShow[1] = tempDate[0]
        }
      }

      const list = [...this.dateShow]
      
      this.$emit('update:dates', list)
      this.$emit('selectDate')
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>

.date-select {
  background: transparent;
  height: 38px;
  width: 329px;
  padding: 8px 17px 8px 21px;
  justify-content: space-between;
  border: 1px solid #44675F;
  border-radius: 4px;

  .text {
    color: #ffffff;
    font-size: 18px;
    height: 18px;
    line-height: 18px;
  }

  .v-btn__content {
    .date {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding-right: 31px;

      p {
        font-size: 16px;
        color: #ffffff;
        margin-bottom: 0px;
      }
    }
  }
  
  .date-icon {
    max-width: 22px;
    max-height: 22px;
    margin-left: 7px;
  }
}

@media screen and (max-width: 960px) {
  .date-select {
    width: 260px;
    height: 30px !important;

    .text {
      font-size: 11px;
      height: 20px;
      line-height: 20px;
    }

    .v-btn__content {
      .date {
        p {
          font-size: 11px;
        }
      }
    }

    .date-icon {
      max-width: 16px;
      max-height: 16px;
    }
  }
}
</style>