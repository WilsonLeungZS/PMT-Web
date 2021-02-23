<template>
  <div style="border: 1px solid black; width: 100%; height: 500px">

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'TasksList',
    data() {
      return {
        
      }
    },
    props: {
      'taskTableAction': Object
    },
    watch: {
      taskTableAction: {
         handler (val, oldVal) {
          console.log('Task table action: ', val)
          if(val == '' || val == null || val == undefined) {
            return
          }
          var taskTableActionObj = val
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      
    }
  }
</script>

<style scoped>
</style>