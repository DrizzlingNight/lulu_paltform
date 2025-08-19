<template>
  <v-menu
      max-width="94"
      class="StatusMenu"
      slot="prepend-inner"
      offset-y
    >
    <template v-slot:activator="{ on, attrs }">
      <v-btn 
        plain
        text
        color="white"
        class="status-select"
        v-bind="attrs"
        v-on="on"
      >
        <div class="status">
          <p>{{ status ? statusMap[status].text : $t('my.history.allType') }}</p>  
        </div>
        <img 
          v-if="attrs['aria-expanded'] === 'true'"
          class="menu-up"
          src="/static/ui/components/menu-up.png"
        />
        <img
          v-else
          class="menu-down"
          src="/static/ui/components/menu-down.png"
        />
      </v-btn>
    </template>
    <v-list class="list" width="120px">
      <v-list-item
          v-for="(item, index) in statusList"
          :key="index"
          class="listItem"
          @click="selectStatus(item)"
      >
        <div :class="{active: item.status === status}" class="status">
          <p>{{ item.text }}</p>
        </div>  
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>

export default {
  name: 'StatusMenu',
  props: {
    status: {
      require: true,
      default: '',
    },
  },
  data() {
    return {
      statusMap: {
        1: {
          text: this.$t('base.inprogress'),
          class: 'inprogress',
        },
        2: {
          text: this.$t('base.success'),
          class: 'success',
        },
        3: {
          text: this.$t('base.failed'),
          class: 'failed',
        },
        4: {
          text: this.$t('base.inprogress'),
          class: 'inprogress',
        },
        5: {
          text: this.$t('base.failed'),
          class: 'failed',
        },
      },
      statusList: [
        {
          status: 2,
          text: this.$t('base.success'),
        },
        {
          status: 1,
          text: this.$t('base.inprogress'),
        },
        {
          status: 3,
          text: this.$t('base.failed'),
        },
      ]
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    selectStatus(item) {
      if (item.status === this.status) {
        this.$emit('update:status', '')
        this.$emit('selectStatus', null)
      } else {
        this.$emit('update:status', item.status)
        this.$emit('selectStatus', item.status)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.status-select {
  background: transparent;
  height: 38px;
  width: 120px;
  padding: 8px 17px 8px 21px;
  justify-content: space-between;
  border: 1px solid #44675F;
  border-radius: 4px;

  .text {
    font-size: 18px;
    height: 18px;
    line-height: 18px;
  }

  .v-btn__content {
    .status {
      display: flex;
      flex-direction: row;
      align-items: center;

      p {
        font-size: 16px;
        color: #48937D;
        margin-bottom: 0px;
      }
    }
  }
  
  .menu-up,
  .menu-down {
    max-width: 12px;
    max-height: 8px;
    margin-left: 7px;
  }
}

.list {
  background: #00322E;
  min-width: 120px;

  .listItem {
    padding: 0px;
    margin-left: 10px;
    margin-right: 11px;
    min-height: 46px;
    min-width: 120px;
    
    .status {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 5px;

      p {
        font-size: 16px;
        color: #48937D;
        margin-bottom: 0px;
        min-width: 100px;
      }
    }

    .active {
      p {
        font-weight: bold;
        color: #00FFCA;
      }
    }

    &:hover {
      color: #00322E;
    }

    /deep/ .v-ripple__container {
      background: inherit;
      color: #00322E;
    }
  }

  /deep/ .theme--light.v-list-item:focus:before {
    opacity: 0;
  }
}
</style>