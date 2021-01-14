<template>
  <div class="sv-content">
    
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
export default {
  name: 'TaskPlanList',
  components: {
  },
  data () {
    return {
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2
    }
  },
  methods: {
  },
  created () {
  }
}
</script>

<style scoped>
.sv-content {
  width: 100%;
  height: auto;
}
</style>
