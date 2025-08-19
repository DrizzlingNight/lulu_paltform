<template>
  <div class="not-found-wrapper d-flex justify-center align-center">
    <div class="not-found-content">
      <DefaultPage :statusCode="4" />
    </div>
  </div>
</template>

<script>
import DefaultPage from './../../components/defaultPage/DefaultPage.vue'

export default {
  name: 'NotFound',
  components: {
    DefaultPage
  }
}
</script>

<style lang="scss" scoped>

.not-found-wrapper {
  width: 100%;
  height: 100%;
}

</style>