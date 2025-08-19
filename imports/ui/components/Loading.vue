<template>
  <v-overlay :value="loading">
    <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: "Loading.vue",
  props: {
    loading:{
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

</style>
