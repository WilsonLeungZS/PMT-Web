<template>
  <div class="main-body">
    <el-container>
      <el-header>
        <el-row class="main-el-row" :style="{'background': mainColor}">
          <el-col :span="1" :class="this.$store.getters.getIsShowMainBar == false?'hide-view':''">
            <div class="main-grid-content">
              <el-dropdown @command="handleMenuCommand">
                <el-button :style="{'background-color': btnColor}" class="main-menu-btn" icon="el-icon-menu" size="small"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-date" command="timesheet" class="main-menu-dropdown-text">Timesheet</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-tickets" command="task" class="main-menu-dropdown-text">Task</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-edit-outline" command="management" class="main-menu-dropdown-text">Management</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-paperclip" command="others" class="main-menu-dropdown-text" v-if="false">Others</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
          <el-col :span="5" :class="this.$store.getters.getIsShowMainBar == false?'hide-view':''">
            <div class="main-grid-content" style="justify-content: flex-start;">
              <el-tooltip class="item" effect="dark" content="Timesheet" placement="bottom">
                <el-button icon="el-icon-date" circle @click="handleMenuCommand('timesheet')"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="Task List" placement="bottom">
                <el-button icon="el-icon-tickets" circle @click="handleMenuCommand('task')"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="Global Time Group" placement="bottom">
                <el-button icon="el-icon-time" circle @click="handleMenuCommand('timegroup')"></el-button>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="main-grid-content">
              <span class="main-logo">{{logo}}</span>
            </div>
          </el-col>
          <el-col :span="6" :class="this.$store.getters.getIsShowMainBar == false?'hide-view':''">
            <div class="main-grid-content" style="justify-content:flex-end;">
              <!-- <el-dropdown trigger="click">
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
              </el-dropdown> -->
              <el-dropdown trigger="click" style="padding: 0" @command="handleCommand">
                <el-popover style="width:auto" placement="top-start" trigger="hover" @show="getEmailGroupsAndSkillType">
                  <el-row class="info-text">
                    <el-col :span="7">Team:</el-col>
                    <el-col class="nameInfo" :span="17">{{userInfo.user_team}}</el-col>
                  </el-row>
                  <el-row class="info-text">
                    <el-col :span="7">Skill:</el-col>
                    <el-col :span="17">
                      <div v-for="(item,i) in userInfo.user_skill_type" :key="i" :value="item" class="nameInfo" >{{item}}</div>
                    </el-col>
                  </el-row>
                  <el-row class="info-text">
                    <el-col :span="24">My Email Groups:</el-col>
                  </el-row>
                  <el-row class="info-text">
                    <el-col :span="24">
                      <div v-for="(item,i) in userInfo.user_email_groups" :key="i" :value="item" class="nameInfo" >{{item}}</div>
                    </el-col>
                  </el-row>
                  <el-button slot="reference" :style="{'background-color': btnColor}" size="small" icon="el-icon-user-solid" class="main-user-info-btn" round>{{this.$store.getters.getUserEid}}</el-button>    
                </el-popover>
                <el-dropdown-menu slot="dropdown" class="main-user-info-panel">
                  <el-dropdown-item command="theme">
                    <div class="main-user-info-panel-item"><span>Theme</span><div class="main-user-info-panel-colorbox" :style="{'background': mainColor}"></div></div>
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
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
    <el-dialog title="Theme Style" :visible.sync="centerDialogVisible" width="360px" center>
      <el-table ref="themeTable" :data="themeData" highlight-current-row @current-change="selectTheme"
      style="width: 100%">
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
<!------- 5. Task Group Drawer -->
    <el-drawer title="Task Group" :visible.sync="groupDrawerVisible" :direction="groupDrawerDirection" size="20%">
      <div class="tl-task-group">
        <el-divider></el-divider>
        <el-row :gutter="15" style="margin-bottom: 15px;">
          <el-col :span="16" :offset="4">
            <el-button @click.stop="createNewTaskGroup" type="primary" size="small" style="width: 100%">Add New Group</el-button>
          </el-col>
        </el-row>
        <el-card :loading="taskGroupLoading" @click.native="editTaskGroup(taskGroup.group_id)" class="box-card tl-task-group-card" shadow="hover" v-for="(taskGroup, index) in taskGroups" :key="index">
          <div slot="header" class="clearfix">
            <el-row :gutter="20">
              <el-col :span="22">
                <div @click.stop="editTaskGroup(taskGroup.group_id)" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;text-decoration:underline;color:#409EFF;cursor:pointer">{{taskGroup.group_name}}</div>
              </el-col>
            </el-row>
          </div>
          <span class="card-Test">Range: &nbsp;{{taskGroup.group_start_time}} ~ {{taskGroup.group_end_time}}</span>
          <div class="card-Count">
            <div class="card-Test">Level 3 Task Count: </div>
            <el-divider class="el-divider--horizontal1"></el-divider>
            <el-row>
              <el-col :span="12" class="card-Test" >Drafting : {{taskGroup.Count.draftingC}}</el-col> 
              <el-col :span="12" class="card-Test" >Planning : {{taskGroup.Count.planningC}}</el-col> 
            </el-row>
            <el-row>
              <el-col :span="12" class="card-Test" >Running : {{taskGroup.Count.runningC}}</el-col>
              <el-col :span="12" class="card-Test" >Done : {{taskGroup.Count.doneC}}</el-col>             
            </el-row>
          </div>
        </el-card>
      </div>
    </el-drawer>
<!------- 5. End Task Group Drawer -->
<!------- 6. Task Group Dialog -->
    <el-dialog title="Time Group" :visible.sync="groupDialogVisible" width="35%" :close-on-click-modal="false" top="15%">
      <el-form :model="taskGroupForm" label-width="100px" class="tl-edit-form">
        <el-form-item label="Group Name" >
          <el-input v-model="taskGroupForm.formGroupName" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="Time Range">
          <el-date-picker v-model="taskGroupForm.formGroupTimeRange" type="daterange"
            start-placeholder="Start Date" end-placeholder="End Date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:100%">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupDialogVisible = false">Cancel</el-button>
        <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" @click="submitTaskGroup">Submit</el-button>
      </div>
    </el-dialog>
<!------- 6. End Task Group Dialog -->
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
    return {
      logo: 'Project Management Timesheet',
      msgValue: 3,
      centerDialogVisible: false,
      msgList: [{'id': 1, 'msg': 'You have not complete the timesheet from 2019-07-09.'},
        {'id': 2, 'msg': 'TOS Team still need 42 hours to complete the target.'},
        {'id': 3, 'msg': 'Change CGM190061 is over charged.'}],
      themeData: utils.themeStyle,
      currentRow: null,
      mainColor: utils.themeStyle[this.$store.getters.getThemeStyle].mainColor,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      userInfo:{
        user_email_groups: '',
        user_skill_type: '',
        user_team: ''
      },
      // Task Group Value
      groupDrawerVisible: false,
      groupDrawerDirection: 'ltr',
      activeTabArray: [],
      taskGroups: [],
      currentTaskGroupFlag: 0,
      currentTaskGroupId: 0,
      currentTaskGroup: 'All Time Group',
      selectedLv1TaskId: null,
      selectedLv1TaskName: (this.$store.getters.getPlanTaskName !== null && this.$store.getters.getPlanTaskName !== '') ? this.$store.getters.getPlanTaskName : this.$route.query.planTaskName,
      selectedLv1TaskDesc: (this.$store.getters.getPlanTaskDesc !== null && this.$store.getters.getPlanTaskDesc !== '') ? this.$store.getters.getPlanTaskDesc : this.$route.query.planTaskDesc,
      groupDialogVisible: false,
      taskGroupForm: {
        formGroupId: 0,
        formGroupName: null,
        formGroupTimeRange: null,
        formGroupRelatedTask: null
      },
      taskGroupLoading: false
    }
  },
  methods: {
    setCurrent (row) {
      console.log(this.$refs)
      this.$nextTick(() => {
        this.$refs.themeTable.setCurrentRow(row);
      })
    },
    selectTheme (val) {
      this.$data.currentRow = Number(val.themeValue)
    },
    async getEmailGroupsAndSkillType () {
      const res = await http.get('/users/getEmailGroupsAndSkillType', {
        userEid: this.$store.getters.getUserEid,
      })
      if(res.data.status === 0){
        this.$data.userInfo.user_team = res.data.data.user_team
        this.$data.userInfo.user_email_groups = res.data.data.user_email_groups
        this.$data.userInfo.user_skill_type = res.data.data.user_skill_type
      }
    } ,
    async submitTheme() {
      const res = await http.get('/users/setUserThemeStyle', {
        userEid: this.$store.getters.getUserEid,
        uThemeStyle: this.$data.currentRow
      })
      console.log(res)
      if (res.data.status === 0) {
        this.$data.centerDialogVisible = false
        var resUserThemeStyle = Number(res.data.data.ThemeStyle)
        this.$store.dispatch('setNewThemeStyle', resUserThemeStyle)
        this.$router.go(0)
      }
    },
    handleCommand (command) {
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
    handleMenuCommand (command) {
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
      else if (command === 'timegroup') {
        this.openTaskGroupDrawer()
      }
    },
    openTaskGroupDrawer () {
      this.getTaskGroup(0, false)
      console.log('Start to get time group')
      this.$data.groupDrawerVisible = true
    },
    selectTaskByTaskGroupId (iTaskGroup) {
      console.log('Selected Group')
      var taskGroupId = iTaskGroup.group_id
      var taskGroupName = iTaskGroup.group_name
      var taskGroupTimeStart = iTaskGroup.group_start_time
      var taskGroupTimeEnd = iTaskGroup.group_end_time
      this.$data.currentTaskGroupFlag = 0
      this.$data.currentTaskGroupId = taskGroupId
      this.$data.currentTaskGroup = taskGroupName + ' ' + taskGroupTimeStart + ' ~ ' + taskGroupTimeEnd
      this.$data.groupDrawerVisible = false
      this.getTaskList()
    },
    selectTaskByAllTaskGroup () {
      console.log('All Group')
      this.$data.currentTaskGroupFlag = 0
      this.$data.currentTaskGroupId = 0
      this.$data.currentTaskGroup = 'All Time Group'
      this.$data.groupDrawerVisible = false
      this.getTaskList()
    },
    resetTaskGroupForm () {
      this.$data.taskGroupForm.formGroupId = 0
      this.$data.taskGroupForm.formGroupName = ''
      this.$data.taskGroupForm.formGroupTimeRange = null
      this.$data.taskGroupForm.formGroupRelatedTask = null
    },
    async editTaskGroup (iGroupId) {
      console.log(iGroupId)
      this.resetTaskGroupForm()
      this.$data.taskGroupForm.formGroupRelatedTask = this.$data.selectedLv1TaskName
      await this.getTaskGroup(iGroupId, false)
      this.$data.groupDialogVisible = true
    },
    createNewTaskGroup () {
      this.resetTaskGroupForm()
      this.$data.taskGroupForm.formGroupRelatedTask = this.$data.selectedLv1TaskName
      this.$data.groupDialogVisible = true
    },
    selectTaskByUnassign () {
      console.log('Unassign Group')
      this.$data.currentTaskGroupFlag = 0
      this.$data.currentTaskGroupId = -1
      this.$data.currentTaskGroup = 'Unassign Task'
      this.$data.groupDrawerVisible = false
      this.getTaskList()
    },
    async getTaskGroup (iGroupId, isShowCurrent) {
      this.$data.taskGroups = []
      this.$data.taskGroupLoading = true 
      const res = await http.get('/tasks/getTaskGroup', {
        tGroupId: iGroupId,
        isShowCurrent : isShowCurrent
      })
      if (res.data.status === 0) {
        console.log(res.data)
        if (iGroupId === 0) {
          for(var i = 0 ; i < res.data.data .length  ; i++){
           const res1 = await http.get('/tasks/countByTaskGroup', {
              reqTaskGroupId: res.data.data [i].group_id,
            })
            res.data.data[i].Count = res1.data.data
          } 
          var taskGroupArr = res.data.data 
          this.$data.taskGroups = taskGroupArr 
          console.log(this.$data.taskGroups)             
          var resResult = []
          for (var i = 0; i < taskGroupArr.length; i++) {
            var resJson = {}
            resJson.group_long_name = taskGroupArr[i].group_name + ' ' + taskGroupArr[i].group_start_time + ' ~ ' + taskGroupArr[i].group_end_time
            resJson.group_id = taskGroupArr[i].group_id
            resResult.push(resJson)
          }
        } else {
          this.$data.taskGroupForm.formGroupId = res.data.data[0].group_id
          this.$data.taskGroupForm.formGroupName = res.data.data[0].group_name
          this.$data.taskGroupForm.formGroupTimeRange = [res.data.data[0].group_start_time, res.data.data[0].group_end_time]
        }
      }
      this.$data.taskGroupLoading = false
    },
    async submitTaskGroup () {
      var tGroupId = this.$data.taskGroupForm.formGroupId
      var tGroupName = this.$data.taskGroupForm.formGroupName
      var tGroupTimeRange = this.$data.taskGroupForm.formGroupTimeRange
      var tGroupRelatedTask = this.$data.taskGroupForm.formGroupRelatedTask
      if (tGroupName === '' || tGroupName === null) {
        this.$message.error('Task Group Could not be empty!')
        return
      }
      if (tGroupTimeRange === null) {
        this.$message.error('Task Group Time Range Invalid!')
        return
      }
      var tGroupStartTime = tGroupTimeRange[0]
      var tGroupEndTime = tGroupTimeRange[1]
      this.$data.disabledGroupSubmit = true
      const res = await http.post('/tasks/addOrUpdateTaskGroup', {
        tGroupId: tGroupId,
        tGroupName: tGroupName,
        tGroupStartTime: tGroupStartTime,
        tGroupEndTime: tGroupEndTime,
        tGroupRelatedTask: tGroupRelatedTask
      })
      if (res.data.status === 0) {
        this.$message({message: 'Task group created/updated successfully!', type: 'success'})
        this.getTaskGroup(0, tGroupRelatedTask)
        this.$data.groupDialogVisible = false
      } else {
        this.$message.error('Task group created/updated fail!')
      }
    },
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
  width:100%;
  height: 50px;
}
.main-menu-btn {
  margin-left: 5px;
  height:40px;
  text-align: center;
  font-size: 20px;
  color: white;
  border: none;
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
  color: white;
  border: none;
}
.main-user-msg {
  margin-top: 5px;
  margin-right: 23px;
  font-size: 10px;
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
.info-panel {
  height: auto;
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.info-text {
  margin: 5px;
}
.nameInfo {
  text-decoration: underline ;
}

/* Task Group Style */
.tl-task-group {
  height: auto;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
}
.tl-task-group-card {
  height: auto;
  margin-bottom: 10px;
  border: 2px solid #E4E7ED;
}
.tl-remove-task {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 17px;
}

.card-Test {
  font-size: 13px;
  color: #909399; 
  margin-top: 5px;
}

.card-blog {
  margin: 35px;
  text-align: center;
}

.card-Count {
  border:1px solid #d2d5db;
  width: 100%;
  border-radius: 5px;
}

.el-divider--horizontal1{
  margin-bottom: 5px;
}
</style>
<style>
.el-drawer__header span:focus {
  outline: 0!important;
}
.el-drawer__header {
  margin-bottom: 0px;
  font-size: 23px;
}
</style>
