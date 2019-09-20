<template>
  <div class="login-content">
    <el-form ref="form" label-width="80px" size="medium" @submit.native.prevent>
      <el-form-item label="EID">
        <el-input v-model="inputUserEid" style="width: 300px" @keyup.enter.native="onLogin"></el-input>
      </el-form-item>
      <el-form-item>
        <span class="login-content-errormsg" v-show="showErrorMsg">{{errorMsg}}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onLogin" style="width: 300px">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import http from '../utils/http'
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
    async onLogin () {
      this.$data.showErrorMsg = false
      var reqUserEid = this.$data.inputUserEid
      if (reqUserEid === '') {
        this.$data.errorMsg = 'EID could not be empty!'
        this.$data.showErrorMsg = true
        return
      }
      const res = await http.get('/users/login', {
        userEid: reqUserEid
      })
      console.log(res.data.status)
      if (res.data.status === 0 && res.data.user != null && res.data.user.IsActive) {
        var resUserEid = res.data.user.Name
        var resUserId = res.data.user.Id
        localStorage.setItem('Flag', 'isLogin')
        localStorage.setItem('UserEid', resUserEid)
        this.$store.dispatch('setNewUserEid', resUserEid)
        this.$store.dispatch('setNewUserId', resUserId)
        this.$store.dispatch('setShowMainBar')
        this.$router.replace({path: '/Timesheet' + '/MyTimesheet'})
      } else {
        this.$data.errorMsg = 'Cannot find EID [' + reqUserEid + ']!'
        this.$data.showErrorMsg = true
      }
    }
  },
  async created () {
    console.log('Created Login')
    this.$store.dispatch('setHideMainBar')
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
