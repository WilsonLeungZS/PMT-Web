<template>
  <div class="main-body">
    <el-container>
      <el-header>
        <el-row class="main-el-row">
          <el-col :span="1" :class="this.$store.getters.getIsShowMainBar == false?'hide-view':''">
            <div class="main-grid-content">
              <el-dropdown @command="handleMenuCommand">
                <el-button class="main-menu-btn" type="primary" icon="el-icon-menu" size="small"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="timesheet" class="main-menu-dropdown-text">Timesheet</el-dropdown-item>
                  <el-dropdown-item command="task" class="main-menu-dropdown-text">Task</el-dropdown-item>
                  <el-dropdown-item command="management" class="main-menu-dropdown-text">Management</el-dropdown-item>
                  <el-dropdown-item command="others" class="main-menu-dropdown-text">Others</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
          <el-col :span="10" :offset="6">
            <div class="main-grid-content">
              <span class="main-logo">{{logo}}</span>
            </div>
          </el-col>
          <el-col :span="6" :offset="1" :class="this.$store.getters.getIsShowMainBar == false?'hide-view':''">
            <div class="main-grid-content" style="justify-content:flex-end;">
              <el-dropdown trigger="click">
                <el-badge :value="msgValue" :max="10" class="main-user-msg">
                  <el-button type="warning" size="small" icon="el-icon-message-solid" circle></el-button>
                </el-badge>
                <el-dropdown-menu slot="dropdown" class="main-user-msg-panel">
                  <el-dropdown-item>
                    <div class="main-user-msg-panel-i border-bottom-line">You have {{msgValue}} messages !</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-for="msg in msgList" :key="msg.id">
                    <div class="main-user-msg-panel-item border-bottom-line">
                      <div class="msg-icon"><i class="el-icon-message"></i></div>
                      <div class="msg-content"><span class="msg-content-text">{{msg.msg}}</span></div>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div class="main-user-msg-panel-i"><b>Show All</b></div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown trigger="click" style="padding: 0" @command="handleLogoutCommand">
                <el-button type="primary" size="small" icon="el-icon-user-solid" class="main-user-info-btn" round>{{this.$store.getters.getUserEid}}</el-button>
                <el-dropdown-menu slot="dropdown" class="main-user-info-panel">
                  <el-dropdown-item command="logout">
                    <div class="main-user-info-panel-item"><b>Logout</b></div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
/* eslint-disable */
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
export default {
  name: 'Main',
  data () {
    return {
      logo: 'Project Management Timesheet',
      msgValue: 3,
      msgList: [{'id': 1, 'msg': 'You have not complete the timesheet from 2019-07-09.'},
        {'id': 2, 'msg': 'TOS Team still need 42 hours to complete the target.'},
        {'id': 3, 'msg': 'Change CGM190061 is over charged.'}]
    }
  },
  methods: {
    handleLogoutCommand(command) {
      this.$store.dispatch('setHideMainBar')
      this.$router.push({path: '/Login'})
    },
    handleMenuCommand(command) {
      if (command === 'timesheet') {
        this.$router.push({path: '/Timesheet'})
      }
      else if (command === 'task') {
        this.$router.push({path: '/Task'})
      }
      else if (command === 'management') {
        this.$router.push({path: '/Management'})
      }
      else if (command === 'others') {
        this.$router.push({path: '/Others'})
      }
    }
  }
}
</script>

<style scoped>
.main-body {
  width: 100%;
  height:auto;
}
.el-header {
  background-color: white;
  text-align: center;
  padding: 0;
  height: 50px;
}
.el-main {
  padding: 0;
}
.main-el-row {
  background-color: #409EFF;
  width: 100%;
  height: 50px;
}
.main-grid-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width:100%;
  height: 50px;
}
.main-menu-btn {
  margin-left: 5px;
  height:40px;
  text-align: center;
  font-size: 20px;
}
.main-menu-dropdown-text {
  font-size: 18px;
}
/* main logo style */
.main-logo {
  font-size: 25px;
  color: white;
  font-family: Microsoft YaHei;
}
/* main user info style */
.main-user-info-btn {
  margin-right: 10px;
  width:auto;
  font-size: 15px;
}
.main-user-msg {
  margin-top: 5px;
  margin-right: 23px;
  font-size: 10px;
}
.main-user-info-panel {
  width: 120px;
  padding-top: 0;
  padding-bottom: 0;
}
.main-user-info-panel-item {
  width:100%;
  height:auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main-user-info-panel-logout {
  width: 120px;
}
.main-user-msg-panel {
  width: 300px;
  padding: 0;
}
.main-user-msg-panel .el-dropdown-menu__item {
  padding: 0;
}
.main-user-msg-panel-item {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.msg-icon {
  height: 50px;
  width:50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  color: #ffa502;
}
.msg-content {
  height: 50px;
  width: 250px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.msg-content-text {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.main-user-msg-panel-i {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
/*Common Style*/
.border-bottom-line {
  border-bottom: 1px solid #dfe4ea;
}
.hide-view {
  visibility: hidden;
}
</style>
