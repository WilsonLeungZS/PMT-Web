<template>
<div>
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
  <div class="footer-content">
    <el-row >
      <el-col :span="24">
        <a target="_blank" href="http://beian.miit.gov.cn/">粤ICP备20049027</a>
      </el-col>
    </el-row>
  </div>
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
      var reqUserName = this.$data.inputUserEid
      if (reqUserName === '') {
        this.$data.errorMsg = 'EID could not be empty!'
        this.$data.showErrorMsg = true
        return
      }
      const res = await http.get('/users/login', {
        reqUserName: reqUserName
      })
      console.log(res.data)
      // if (res.data.status === 0 && res.data.user != null && res.data.user.IsActive) {
      if (res.data.status === 0 && res.data.user != null && res.data.user.Role.indexOf('Guests') == -1) {
        var userId = res.data.user.Id
        var userName = res.data.user.Name
        localStorage.setItem('Flag', 'isLogin')
        this.$store.dispatch('setNewUserId', userId)
        localStorage.setItem('UserEid', userName)
        this.$store.dispatch('setNewUserEid', userName)
        this.$store.dispatch('setShowMainBar')
        this.$router.replace({path: '/Timesheet' + '/MyTimesheet'})
      } else {
        this.$data.errorMsg = 'Cannot find EID [' + userId + ']!'
        this.$data.showErrorMsg = true
      }
    }
  },
  async created () {
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
.footer-content {
  height: auto;
  width: 100%;
  position: absolute;
  bottom: 1%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: #666;
}
.footer-content a{
  color: #666;
  text-decoration: none;
}
.footer-content a:hover {
  color: #ba2636;
  text-decoration: underline;
}
</style>
