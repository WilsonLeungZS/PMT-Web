<template>
  <div class="main-body">
    <el-container>
      <el-header>
        <el-row class="main-el-row" :style="{'background': mainColor}" justify="center" align="middle">
          <el-col :span="6" :lg="8" :class="this.$store.getters.getIsShowMainBar == false? 'hide-view': ''">
            <div class="main-grid-content" style="justify-content: flex-start; margin-left: 13px">
              <el-button @click="handleMenuCommand('sprint')" class="main-menu-btn" :class="{'active': active == 1}" icon="el-icon-data-line">Sprints</el-button>
              <el-button @click="handleMenuCommand('timesheet')" class="main-menu-btn" :class="{'active': active == 2}" icon="el-icon-date">Timesheet</el-button>
              <el-button v-if="false" @click="handleMenuCommand('task')" class="main-menu-btn" :class="{'active': active == 3}" icon="el-icon-tickets">Tasks</el-button>
              <el-button @click="handleMenuCommand('management')" class="main-menu-btn" :class="{'active': active == 4}" icon="el-icon-setting">Management</el-button>
              <el-button @click="handleMenuCommand('people')" class="main-menu-btn" :class="{'active': active == 5}" icon="el-icon-user-solid">People</el-button>
              <el-button @click="handleMenuCommand('customer')" class="main-menu-btn" :class="{'active': active == 6}" icon="el-icon-office-building">Customer</el-button>
            </div>
          </el-col>
          <el-col :span="12" :lg="8">
            <div class="main-grid-content">
              <span class="main-logo">{{logo}}</span>
            </div>
          </el-col>
          <el-col :span="6" :lg="8" :class="this.$store.getters.getIsShowMainBar == false? 'hide-view': ''">
            <div class="main-grid-content" style="justify-content:flex-end;">
              <el-dropdown trigger="click" style="padding: 0" @command="handleUserCommand">
                <el-popover class="info-content" placement="left-start" trigger="hover">
                  <el-form class="info-form" ref="form" :model="userInfo" label-position="left" label-width="50px" size="mini">
                    <el-form-item label="Skill:">
                      <el-row class="info-text" v-for="(item, i) in userInfo.userSkills" :key="i" :value="item">
                        <el-col :span="24">
                          <span class="highlight-info">{{item}}</span>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-form>
                  <el-form class="info-form" ref="form" :model="userInfo" label-position="left" label-width="100px" size="mini">
                    <el-form-item label="Email Groups:"></el-form-item>
                    <el-row class="info-text" v-for="(item,i) in userInfo.userEmailGroups" :key="i" :value="item">
                      <el-col :span="24">
                        <span class="highlight-info">{{item}}</span>
                      </el-col>
                    </el-row>
                  </el-form>
                  <el-button slot="reference" :style="{'background-color': btnColor}" icon="el-icon-user-solid" class="main-user-info-btn">{{this.$store.getters.getUserEid}}</el-button>    
                </el-popover>
                <el-dropdown-menu slot="dropdown" class="main-user-info-panel">
                  <el-dropdown-item command="theme">
                    <div class="main-user-info-panel-item">
                      <span>Theme</span>
                      <div class="main-user-info-panel-colorbox" :style="{'background': mainColor}"></div>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item command="logout" divided>
                    <div class="main-user-info-panel-item"><b>Logout</b></div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <!-- Switch Each Page -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    <el-dialog title="Theme Style" :visible.sync="centerDialogVisible" width="360px" center>
      <el-table ref="themeTable" :data="themeData" highlight-current-row @current-change="selectTheme" style="width: 100%">
        <el-table-column property="themeValue" width="20" v-if="false"></el-table-column>
        <el-table-column property="themeName" label="Theme Name" align="center"></el-table-column>
        <el-table-column property="mainColor" label="Color" width="120" align="center">
          <template slot-scope="scope">
            <div class="main-themestyle">
              <div class="main-themestyle-colorbox" :style="{'background': scope.row.mainColor}"></div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" @click="submitTheme">Submit</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
import http from '../utils/http'
import utils from '../utils/utils'
export default {
  name: 'Main',
  data () {
    var vm = this
    return {
      logo: 'Project Management Timesheet',
      centerDialogVisible: false,
      themeData: utils.themeStyle,
      currentRow: null,
      mainColor: utils.themeStyle[this.$store.getters.getThemeStyle].mainColor,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      userInfo:{
        userSkills: [],
        userEmailGroups: []
      },
      active:null
    }
  },
  methods: {
    handleMenuCommand (command) {
      if (command === 'timesheet') {
        this.$router.push({name: 'MyTimesheet'})
        this.active = 2
      }
      else if (command === 'task') {
        this.$router.push({name: 'TaskList'})
        this.active = 3
      }
      else if (command === 'management') {
        this.$router.push({name: 'SptManagement'})
        this.active = 4
      }
      else if (command === 'others') {
        this.$router.push({name: 'Charts'})
      }
      else if (command === 'sprint') {
        this.$router.push({name: 'SprintView'})
        this.active = 1
      }else if (command === 'people') {
        this.$router.push({name: 'People'})
        this.active = 5
      }else if (command === 'customer') {
        this.$router.push({name: 'CtmManagement'})
        this.active = 6
      }
    },
    setCurrent (row) {
      console.log(this.$refs)
      this.$nextTick(() => {
        this.$refs.themeTable.setCurrentRow(row);
      })
    },
    selectTheme (val) {
      this.$data.currentRow = Number(val.themeValue)
    },
    async submitTheme() {
      const res = await http.get('/users/setUserThemeStyle', {
        userEid: this.$store.getters.getUserEid,
        uThemeStyle: this.$data.currentRow
      })
      if (res.data.status === 0) {
        this.$data.centerDialogVisible = false
        var resUserThemeStyle = Number(res.data.data.ThemeStyle)
        this.$store.dispatch('setNewThemeStyle', resUserThemeStyle)
        this.$router.go(0)
      }
    },
    handleUserCommand (command) {
      if (command === 'logout') {
        localStorage.setItem('Flag', '')
        localStorage.setItem('UserEid', '')
        this.$store.dispatch('setNewUserEid', '')
        this.$store.dispatch('setNewUserId', '')
        this.$store.dispatch('setNewUserLevel', '')
        this.$store.dispatch('setNewThemeStyle', 0)
        this.$store.dispatch('setHideMainBar')
        this.$router.push({path: '/Login'})
      }
      else if (command === 'theme') {
        this.$data.centerDialogVisible = true
        var index = Number(utils.themeStyle[this.$store.getters.getThemeStyle].themeValue)
        this.setCurrent(this.$data.themeData[index])
      }
    },
    async getEmailGroupsAndSkills () {
      const res = await http.post('/users/getUserByName', {
        reqUserName: this.$store.getters.getUserEid,
      })
      console.log(res.data)
      if(res.data.status === 0){
        var user = res.data.data
        this.$data.userInfo.userSkills = user.userSkillsStr.indexOf(',') == -1 ? [user.userSkillsStr]: user.userSkillsStr.split(',')
        this.$data.userInfo.userEmailGroups = user.userEmailGroups.indexOf(',') == -1 ? [user.userEmailGroups]: user.userEmailGroups.split(',')
      }
    }
  },
  mounted () {
    this.active = {
      'SprintView':1,
      'MyTimesheet':2,
      'SptManagement':4,
      'People':5,
    }[this.$route.name]
    this.getEmailGroupsAndSkills()    
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
  width: 100%;
  height: 50px;
}
.main-grid-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
}
.main-menu-btn {
  font-size: 18px;
  padding: 5px 10px;
  width: 40px;
  max-width: 40px;
  transition: max-width 1s;
}
.main-menu-btn>>>span {
  display: none
}
.main-menu-btn:hover {
  width: auto;
  max-width: 151px;
}
.main-menu-btn:hover>>>span {
  display: inline;
}
.active{
  width: auto;
  max-width: 151px;
  overflow: hidden;
}
.active>>>span {
  display: inline;
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
  font-size: 18px;
  padding: 8px 15px;
  color: white;
  border: none;
}
.main-user-info-panel {
  width: 150px;
  padding-top: 6px;
  padding-bottom: 0;
}
.main-user-info-panel-item {
  width:100%;
  height:auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main-user-info-panel-colorbox {
  margin-left: 7px;
  width: 20px;
  height: 20px;
  border: 2px solid #bdc3c7;
  border-radius: 6px;
}
.main-themestyle {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main-themestyle-colorbox {
  width: 30px;
  height: 30px;
  border: 2px solid #bdc3c7;
  border-radius: 6px;
}
.main-user-info-panel-logout {
  width: 120px;
}
/*Common Style*/
.border-bottom-line {
  border-bottom: 1px solid #dfe4ea;
}
.hide-view {
  visibility: hidden;
}
.info-panel {
  height: auto;
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.info-content {
  height: auto;
  width: auto;
}
.info-content-body {
  height: auto;
  width: auto;
}
.info-text {
  width: auto;
}
.highlight-info {
  text-decoration: underline ;
}
</style>
