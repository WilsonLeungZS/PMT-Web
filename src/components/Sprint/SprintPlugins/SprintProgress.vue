<!-- 
Module: SprintProgress
Description: display sprint progress
Remark:
-->
<template>
  <el-card class="box-card sprint-progress-card" shadow="never">
    <el-row>
      <el-col :span="12">

      </el-col>
    </el-row>
  </el-card>
</template>

<script type="text/ecmascript-6">
  import http from '../../../utils/http'
  import utils from '../../../utils/utils'
  export default {
    name: 'ExternalTaskDialog',
    data() {
      return {
        
      }
    },
    props: {
      'action': Object
    },
    watch: {
      action: {
         handler (val, oldVal) {
          console.log('Sprint progress: ', val)
          if(val == '' || val == null || val == undefined) {
            return
          }
          var actionObj = val
        },
        immediate: true,
        deep: true
      }
    },
    created () {
    },
    mounted () {
    },
    updated () {
    },
    methods: {
      
    }
  }
</script>

<style scoped>
.sprint-progress-card {
  border-color: #bdbdbd;
}
</style>

<style>
</style>