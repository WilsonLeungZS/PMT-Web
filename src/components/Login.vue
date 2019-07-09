<template>
  <div class="login-content">
    <el-form ref="form" :model="form" label-width="80px" size="medium" @submit.native.prevent>
      <el-form-item label="EID">
        <el-input v-model="inputUserEid" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item>
        <span class="login-content-errormsg" v-show="showErrorMsg">{{errorMsg}}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onLogin" style="width: 250px">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      inputUserEid: '',
      errorMsg: '',
      showErrorMsg: false
    }
  },
  methods: {
    onLogin () {
      this.$data.showErrorMsg = false
      var reqUserEid = this.$data.inputUserEid
      if (reqUserEid === '') {
        this.$data.errorMsg = 'EID could not be empty!'
        this.$data.showErrorMsg = true
        return
      }
      console.log('Login! User Eid: ' + this.$data.inputUserEid)
      this.$router.push({path: '/Timesheet' + '/MyTimesheet'})
    }
  }
}
</script>

<style>
.login-content {
  height: auto;
  width: 100%;
  position: absolute;
  top: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
.login-content .el-form-item__label {
  font-size: 25px;
  padding-right: 20px;
}
.login-content-errormsg {
  font-size: 20px;
  color:red;
}
</style>
