<template>
  <div class="error-content">
    <img style="width: auto; height: 100px" src="../assets/error.png" /><br/>
    <img style="width: auto; height: 50px" src="../assets/error-login.png"/>
    <router-link to="/" style="margin-top: 20px">Login PMT-WEB</router-link>
  </div>
</template>

<script>
export default {
  name: 'Error',
  data () {
    return {
    }
  }
}
</script>

<style scoped>
.error-content {
  height: auto;
  width: 100%;
  position: absolute;
  top: 30%;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
