<template>
  <v-menu
      class="TypeMenu"
      slot="prepend-inner"
      offset-y
    >
    <template v-slot:activator="{ on, attrs }">
      <v-btn 
        plain
        text
        color="white"
        class="type-select"
        v-bind="attrs"
        v-on="on"
      >
        <div class="type">
          <p>{{ $t('my.balanceRecord.type') }}</p>  
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
    <v-list class="list" min-width="144" max-height="400">
      <v-list-item class="listItem first" @click="clear">
        <div class="clear">
          <p>{{ $t('my.balanceRecord.clear') }}</p>
        </div>
      </v-list-item>
      <v-list-item
          v-for="(item, index) in typeList"
          :key="index"
          class="listItem"
      >
        <div class="type">
          <v-checkbox color="#F7CD0A" v-model="checkBox[index]" @change="selectType(item)" />
          <p>{{ item.text }}</p>
        </div>  
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { removeItem } from '/imports/utils/customMethod'

export default {
  name: 'TypeMenu',
  props: {
    typeList: {
      require: true,
      default: function() { return [] },
    },
    typeMap: {
      require: true,
      default: function() { return {} },
    },
    type: {
      require: true,
      default: function() { return [] },
    },
  },
  data() {
    return {
      checkBox: [],
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    clear() {
      const length = this.checkBox.length
      for (let i = 0; i <= length-1; i++) {
        this.checkBox[i] = false
      }
      this.$forceUpdate()
      this.$emit('update:type', [])
      this.$emit('selectType')
    },
    selectType(item) {
      let typeList = [...this.type]

      if (typeList.includes(item.type)) {
        typeList = removeItem(typeList, item.type)
      } else {
        typeList.push(item.type)
      }

      this.$emit('update:type', typeList)
      this.$emit('selectType')
    }
  }
}
</script>

<style lang="scss" scoped>

.type-select {
  background: transparent;
  height: 38px;
  width: 110px;
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
    .type {
      display: flex;
      flex-direction: row;
      align-items: center;

      p {
        font-size: 16px;
        color: #ffffff;
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

  .listItem {
    background: #00322E;
    padding: 0px;
    padding-left: 10px;
    padding-right: 11px;
    height: 56px;
    
    .clear,
    .type {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 15px;
      color: #ffffff;

      p {
        font-size: 16px;
        color: #ffffff;
        margin-bottom: 0px;
      }
    }
  }

  .first {
    cursor: pointer;
    position: relative;
    border-bottom: 1px solid #2D4742;
    height: 45px;
    margin: 0px;
  
    .clear {
      position: absolute;
      left: 35%;
    }
  }
  
}
</style>