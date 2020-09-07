<template>
  <div id="app">
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  margin-top: 0px;
}
::-webkit-scrollbar {
  width: 3px;
  height: 1px;
}
::-webkit-scrollbar-thumb { 
  border-radius: 5px;
  background-color: #606266;
}
::-webkit-scrollbar-track { 
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #ededed;
  border-radius: 5px;
}
</style>
