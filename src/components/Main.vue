<template>
  <div class="main-body">
    <el-container>
      <el-header>
        <el-row class="main-el-row">
          <el-col :span="1">
            <div class="main-grid-content">
              <el-dropdown>
                <el-button class="main-menu-btn" type="primary" icon="el-icon-menu" size="small"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item class="main-menu-dropdown-text">Timesheet</el-dropdown-item>
                  <el-dropdown-item class="main-menu-dropdown-text">Task</el-dropdown-item>
                  <el-dropdown-item class="main-menu-dropdown-text">Management</el-dropdown-item>
                  <el-dropdown-item class="main-menu-dropdown-text">Others</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
          <el-col :span="10" offset="6">
            <div class="main-grid-content">
              <span class="main-logo">{{logo}}</span>
            </div>
          </el-col>
          <el-col :span="6" offset="1">
            <div class="main-grid-content" style="justify-content:flex-end;">
              <el-badge :value="msgValue" :max="10" class="main-user-msg">
                <el-button type="warning" size="small" icon="el-icon-message-solid" circle></el-button>
              </el-badge>
              <el-dropdown trigger="click">
                <el-button type="primary" size="small" icon="el-icon-user-solid" class="main-user-info-btn" round>{{loginUser}}</el-button>
                <el-dropdown-menu slot="dropdown" class="main-user-info-panel">
                  <el-dropdown-item>
                    zhongshu.liang
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>Main</el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Main',
  data () {
    return {
      logo: 'Project Management Timesheet',
      loginUser: 'zhongshu.liang',
      msgValue: 50
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
  background-color: #F2F6FC;
  color: #333;
  text-align: center;
  line-height: 500px;
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
  width: 200px;
}
</style>
