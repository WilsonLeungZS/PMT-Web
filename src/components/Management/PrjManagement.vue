<template>
  <div class="pm-body">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-user content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
            <el-divider direction="vertical"></el-divider>
            <div class="content-title-item " @click="switchToTM">
              <i class="el-icon-monitor content-title-item-icon"></i>
              <span class="content-title-item-header">{{header2}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="pm-content">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span class="pm-content-header">
                    Teams List
                    <el-tooltip class="item" effect="dark" content="Add New Team" placement="top">
                      <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" icon="el-icon-plus" size="mini" circle
                        class="pm-content-header-btn" @click="addTeam"></el-button>
                    </el-tooltip>
                  </span>
                </div>
                <el-table :data="teamData" style="width:100%;height:auto" fit>
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-row :gutter="15">
                        <el-col :span="4" class="pm-table-expand-label">
                          <span>Name</span>
                        </el-col>
                        <el-col :span="8" class="pm-table-expand-item">
                          <el-input v-model="props.row.team_name" size="small" style="width: 100%"></el-input>
                        </el-col>
                        <el-col :span="4" class="pm-table-expand-label">
                          <span>Project</span>
                        </el-col>
                        <el-col :span="8" class="pm-table-expand-item">
                          <el-input v-model="props.row.team_project" size="small" style="width: 100%"></el-input>
                        </el-col>
                      </el-row>
                      <el-row :gutter="15" style="margin-top:10px">
                        <el-col :span="4" class="pm-table-expand-label">
                          <span>Description</span>
                        </el-col>
                        <el-col :span="20" class="pm-table-expand-item">
                          <el-input v-model="props.row.team_desc" size="small" style="width: 100%"></el-input>
                        </el-col>
                      </el-row>
                      <el-row :gutter="15" style="margin-top:10px">
                        <el-col :span="4" class="pm-table-expand-label">
                          <span>Mapping</span>
                        </el-col>
                        <el-col :span="20" class="pm-table-expand-item">
                          <el-input v-model="props.row.team_mapping" size="small" style="width: 100%"></el-input>
                        </el-col>
                      </el-row>
                      <el-row :gutter="15" style="margin-top:10px">
                        <el-col :span="4" class="pm-table-expand-label">
                          <span>Active</span>
                        </el-col>
                        <el-col :span="9" class="pm-table-expand-item">
                          <el-switch v-model="props.row.team_isactive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                        </el-col>
                        <el-col :span="11" class="pm-table-expand-item">
                          <el-button :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="small"
                            style="width:100%" @click="saveTeam(props)">Save</el-button>
                          <el-button type="info" size="small"
                            style="width:100%" @click="cancelTeam(props)">Cancel</el-button>
                        </el-col>
                      </el-row>
                    </template>
                  </el-table-column>
                  <el-table-column label="Id" prop="team_id" v-if="false"></el-table-column>
                  <el-table-column label="Name" prop="team_name" min-width="50" show-overflow-tooltip></el-table-column>
                  <el-table-column label="Project" prop="team_project" min-width="50" show-overflow-tooltip></el-table-column>
                  <el-table-column label="Description" prop="team_desc" show-overflow-tooltip></el-table-column>
                  <el-table-column label="Mapping" prop="team_mapping" show-overflow-tooltip></el-table-column>
                  <el-table-column label="Active" align="center"
                      :filters="activeFilter"
                      :filter-method="activefilterHandler">
                    <template slot-scope="scope">
                      <i v-if="scope.row.team_isactive" class="el-icon-success"
                        style="font-size: 25px; color: #2ed573"></i>
                      <i v-if="!scope.row.team_isactive" class="el-icon-error"
                        style="font-size: 25px; color: #ff4757"></i>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>
          </el-col><!-- Team list -->
          <el-col :span="24">
            <div class="pm-content">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span class="pm-content-header">
                    Users List
                    <el-tooltip class="item" effect="dark" content="Add New User" placement="top">
                      <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" icon="el-icon-plus" size="mini" circle
                        class="pm-content-header-btn" @click="addUser"></el-button>
                    </el-tooltip>
                    <!-- <el-tooltip class="item" effect="dark" content="Expoet Users List" placement="top">
                      <el-button type="success" icon="el-icon-download" size="mini" circle class="pm-content-header-btn"></el-button>
                    </el-tooltip> -->
                  </span>
                </div>
                <el-table :data="userData" style="width:100%;height:auto" fit>
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-row :gutter="15">
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Name</span>
                        </el-col>
                        <el-col :span="6" class="pm-table-expand-item">
                          <el-input v-model="props.row.user_eid" size="small" style="width: 100%"></el-input>
                        </el-col>
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Employee Number</span>
                        </el-col>
                        <el-col :span="6" class="pm-table-expand-item">
                          <el-input v-model="props.row.user_employee_number" size="small" style="width: 100%"></el-input>
                        </el-col>
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Email</span>
                        </el-col>
                        <el-col :span="6" class="pm-table-expand-item">
                          <el-input v-model="props.row.user_email" size="small" style="width: 100%"></el-input>
                        </el-col>
                      </el-row>
                      <el-row :gutter="15" style="margin-top: 10px">
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Level</span>
                        </el-col>
                        <el-col :span="6" class="pm-table-expand-item">
                          <el-input v-model="props.row.user_level" size="small" style="width: 100%"></el-input>
                        </el-col>
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Team</span>
                        </el-col>
                        <el-col :span="6" class="pm-table-expand-item">
                          <el-select v-model="props.row.user_team" size="small" style="width: 100%">
                            <el-option v-for="(team, index) in teamFilter" :key="index" :label="team.text" :value="team.value"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Role</span>
                        </el-col>
                        <el-col :span="6" class="pm-table-expand-item">
                          <el-select v-model="props.row.user_role" size="small" style="width: 100%">
                            <el-option label="Admin" value="Admin"></el-option>
                            <el-option label="General" value="General"></el-option>
                            <el-option label="Special" value="Special"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                      <el-row :gutter="15" style="margin-top: 10px">
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Mapping</span>
                        </el-col>
                        <el-col :span="22" class="pm-table-expand-item">
                          <el-input v-model="props.row.user_namemapping" size="small" style="width: 100%"></el-input>
                        </el-col>
                      </el-row>
                      <el-row :gutter="15" style="margin-top: 10px">
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Active</span>
                        </el-col>
                        <el-col :span="12" class="pm-table-expand-item">
                          <el-switch v-model="props.row.user_isactive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                        </el-col>
                        <el-col :span="10" class="pm-table-expand-item">
                          <el-button :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="small"
                            style="width:100%" @click="saveUser(props)">Save</el-button>
                          <el-button type="info" size="small"
                            style="width:100%" @click="cancelUser(props)">Cancel</el-button>
                        </el-col>
                      </el-row>
                    </template>
                  </el-table-column>
                  <el-table-column label="Id" prop="user_id" v-if="false"></el-table-column>
                  <el-table-column label="Name" prop="user_eid" min-width="120" show-overflow-tooltip></el-table-column>
                  <el-table-column label="Employee Number" prop="user_employee_number" min-width="120"></el-table-column>
                  <el-table-column label="Email" prop="user_email" min-width="210" show-overflow-tooltip></el-table-column>
                  <el-table-column label="Level" prop="user_level" min-width="30" show-overflow-tooltip></el-table-column>
                  <el-table-column label="Team" prop="user_team" align="center" min-width="70"
                      :filters="teamFilter"
                      :filter-method="teamfilterHandler">
                  </el-table-column>
                  <el-table-column label="Role" align="center"
                      :filters="roleFilter"
                      :filter-method="rolefilterHandler">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.user_role === 'Admin'" size="small" effect="dark">{{scope.row.user_role}}</el-tag>
                      <el-tag v-if="scope.row.user_role === 'General'" size="small" type="info" effect="dark">{{scope.row.user_role}}</el-tag>
                      <el-tag v-if="scope.row.user_role === 'Special'" size="small" type="success" effect="dark">{{scope.row.user_role}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="Active" align="center"
                      :filters="activeFilter"
                      :filter-method="activefilterHandler">
                    <template slot-scope="scope">
                      <i v-if="scope.row.user_isactive" class="el-icon-success"
                        style="font-size: 25px; color: #2ed573"></i>
                      <i v-if="!scope.row.user_isactive" class="el-icon-error"
                        style="font-size: 25px; color: #ff4757"></i>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>
          </el-col><!-- User list -->
          <el-col :span="9">
            <div class="pm-content">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span class="pm-content-header">
                    Task Types List
                    <el-tooltip class="item" effect="dark" content="Add New Task Type" placement="top">
                      <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" icon="el-icon-plus" size="mini" circle
                        class="pm-content-header-btn" @click="addTasktype"></el-button>
                    </el-tooltip>
                  </span>
                </div>
                <el-table :data="tasktypeData" style="width:100%;height:auto" fit>
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-row :gutter="15">
                        <el-col :span="4" class="pm-table-expand-label">
                          <span>Name</span>
                        </el-col>
                        <el-col :span="20" class="pm-table-expand-item">
                          <el-input v-model="props.row.type_name" size="small" style="width: 100%"></el-input>
                        </el-col>
                      </el-row>
                      <el-row :gutter="15" style="margin-top:10px">
                        <el-col :span="4" class="pm-table-expand-label">
                          <span>Prefix</span>
                        </el-col>
                        <el-col :span="8" class="pm-table-expand-item">
                          <el-input v-model="props.row.type_prefix" size="small" style="width: 100%"></el-input>
                        </el-col>
                        <el-col :span="4" class="pm-table-expand-label">
                          <span>Category</span>
                        </el-col>
                        <el-col :span="8" class="pm-table-expand-item">
                          <el-select v-model="props.row.type_category" size="small" style="width: 100%">
                            <el-option label="AD" value="AD"></el-option>
                            <el-option label="AM" value="AM"></el-option>
                            <el-option label="Others" value="Others"></el-option>
                            <el-option label="Leave" value="Leave"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                      <el-row :gutter="15" style="margin-top:10px">
                        <el-col :span="4" class="pm-table-expand-label">
                          <span>Value</span>
                        </el-col>
                        <el-col :span="10" class="pm-table-expand-item">
                          <el-input type="number" v-model="props.row.type_value" size="small" style="width: 100%"></el-input>
                        </el-col>
                        <el-col :span="10" class="pm-table-expand-item">
                          <el-button :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="small"
                            style="width:100%" @click="saveTasktype(props)">Save</el-button>
                          <el-button type="info" size="small"
                            style="width:100%" @click="cancelTasktype(props)">Cancel</el-button>
                        </el-col>
                      </el-row>
                    </template>
                  </el-table-column>
                  <el-table-column label="Id" prop="type_id" v-if="false"></el-table-column>
                  <el-table-column label="Name" prop="type_name" show-overflow-tooltip></el-table-column>
                  <el-table-column label="Prefix" prop="type_prefix" align="center" min-width="45" ></el-table-column>
                  <el-table-column label="Category" prop="type_category" align="center" min-width="55"></el-table-column>
                  <el-table-column label="Value" prop="type_value" align="center" min-width="35"></el-table-column>
                </el-table>
              </el-card>
            </div>
          </el-col><!-- Task Type list -->
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
export default {
  name: 'Projecpmanagement',
  data () {
    return {
      header1: 'Project Management',
      header2: 'Timesheet Management',
      isActive: true,
      userData: [],
      userResetData: [],
      teamData: [],
      teamResetData: [],
      activeFilter: [
        {text: 'Active', value: true},
        {text: 'Inactive', value: false}
      ],
      roleFilter: [
        {text: 'Admin', value: 'Admin'},
        {text: 'General', value: 'General'},
        {text: 'Special', value: 'Special'}
      ],
      teamFilter: [],
      tasktypeData: [],
      tasktypeResetData: [],
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2
    }
  },
  methods: {
    switchToTM () {
      this.$data.isActive = false
      this.$router.push({path: 'PmtManagement'})
    },
    async getUserList () {
      this.$data.userData = []
      const res = await http.get('/users/getUserList', {IsActive: 0})
      if (res.data.status === 0) {
        this.$data.userData = res.data.data
        var jsonString1 = JSON.stringify(this.$data.userData)
        this.$data.userResetData = JSON.parse(jsonString1)
      } else {
        this.$data.userResetData = []
      }
    },
    async getTeamList () {
      this.$data.teamFilter = []
      this.$data.teamData = []
      const res = await http.get('/users/getTeamList', {IsActive: 0})
      if (res.data.status === 0) {
        res.data.data.splice(0, 1)
        var teamList = res.data.data
        this.$data.teamData = teamList
        var jsonString2 = JSON.stringify(this.$data.teamData)
        this.$data.teamResetData = JSON.parse(jsonString2)
        for (var i = 0; i < teamList.length; i++) {
          if (teamList[i].team_isactive) {
            var teamJson = {}
            teamJson.text = teamList[i].team_name
            teamJson.value = teamList[i].team_name
            this.$data.teamFilter.push(teamJson)
          } else {
            continue
          }
        }
      } else {
        this.$data.teamResetData = []
      }
    },
    async getTaskTypeList () {
      this.$data.tasktypeData = []
      const res = await http.get('/tasks/getAllTaskType')
      if (res.data.status === 0) {
        this.$data.tasktypeData = res.data.data
        var jsonString3 = JSON.stringify(this.$data.tasktypeData)
        this.$data.tasktypeResetData = JSON.parse(jsonString3)
      } else {
        this.$data.tasktypeResetData = []
      }
    },
    activefilterHandler (value, row, column) {
      return row['user_isactive'] === value
    },
    rolefilterHandler (value, row, column) {
      return row['user_role'] === value
    },
    teamfilterHandler (value, row, column) {
      return row['user_team'] === value
    },
    async saveUser (props) {
      var user = props.row
      if (user.user_eid === 'N/A' || user.user_eid === '') {
        this.$message.error('Add/Update user Failed!')
        return
      }
      const res = await http.post('/users/addOrUpdateUser', {
        reqUserId: user.user_id,
        reqUserEid: user.user_eid,
        reqUserEmployeeNumber: user.user_employee_number,
        userEmail: user.user_email,
        reqUserLevel: user.user_level,
        reqUserTeam: user.user_team,
        reqUserRole: user.user_role,
        reqUserNameMapping: user.user_namemapping,
        reqUserIsActive: user.user_isactive
      })
      if (res.data.status === 0) {
        let _this = this
        setTimeout(function () {
          _this.getUserList()
          _this.showMessage('Add/Update user successfully!', 'success')
        }, 1000)
      } else {
        this.$message.error('Add/Update user Failed!')
      }
    },
    cancelUser (props) {
      var index = props.$index
      if (props.row.user_id > 0) {
        props.row.user_eid = this.$data.userResetData[index].user_eid
        props.row.user_employee_number = this.$data.userResetData[index].user_employee_number
        props.row.user_email = this.$data.userResetData[index].user_email
        props.row.user_level = this.$data.userResetData[index].user_level
        props.row.user_team = this.$data.userResetData[index].user_team
        props.row.user_role = this.$data.userResetData[index].user_role
        props.row.user_namemapping = this.$data.userResetData[index].user_namemapping
        props.row.user_isactive = this.$data.userResetData[index].user_isactive
      } else {
        this.$data.userData.splice(index, 1)
      }
    },
    addUser () {
      var user = {
        user_id: 0,
        user_eid: 'N/A',
        user_employee_number: '',
        user_email: 'N/A',
        user_level: '-1',
        user_team: 'TOS',
        user_role: 'General',
        user_namemapping: '',
        user_isactive: false
      }
      this.$data.userData.unshift(user)
    },
    async saveTeam (props) {
      var team = props.row
      if (team.team_name === 'N/A' || team.team_name === '') {
        this.$message.error('Add/Update team Failed!')
        return
      }
      if (team.team_project === 'N/A' || team.team_project === '') {
        this.$message.error('Add/Update team Failed!')
        return
      }
      const res = await http.post('/users/addOrUpdateTeam', {
        reqTeamId: team.team_id,
        reqTeamName: team.team_name,
        reqTeamProject: team.team_project,
        reqTeamDesc: team.team_desc,
        reqTeamMapping: team.team_mapping,
        reqTeamIsActive: team.team_isactive
      })
      if (res.data.status === 0) {
        let _this = this
        setTimeout(function () {
          _this.getTeamList()
          _this.showMessage('Add/Update team successfully!', 'success')
        }, 1000)
      } else {
        this.$message.error('Add/Update team Failed!')
      }
    },
    cancelTeam (props) {
      var index = props.$index
      if (props.row.team_id > 0) {
        props.row.team_name = this.$data.teamResetData[index].team_name
        props.row.team_project = this.$data.teamResetData[index].team_project
        props.row.team_desc = this.$data.teamResetData[index].team_desc
        props.row.team_mapping = this.$data.teamResetData[index].team_mapping
        props.row.team_isactive = this.$data.teamResetData[index].team_isactive
      } else {
        this.$data.teamData.splice(index, 1)
      }
    },
    addTeam () {
      var team = {
        team_id: 0,
        team_name: 'N/A',
        team_project: 'N/A',
        team_desc: 'N/A',
        team_mapping: '',
        team_isactive: false
      }
      this.$data.teamData.unshift(team)
    },
    async saveTasktype (props) {
      var tasktype = props.row
      if (tasktype.type_name === 'N/A' || tasktype.type_name === '') {
        this.$message.error('Add/Update task type Failed!')
        return
      }
      const res = await http.post('/tasks/addTaskType', {
        taskTypeId: tasktype.type_id,
        taskTypeName: tasktype.type_name,
        taskTypePrefix: tasktype.type_prefix,
        taskTypeCategory: tasktype.type_category,
        taskTypeValue: tasktype.type_value !== '' ? tasktype.type_value : 0
      })
      if (res.data.status === 0) {
        let _this = this
        setTimeout(function () {
          _this.getTaskTypeList()
          _this.showMessage('Add/Update task type successfully!', 'success')
        }, 1000)
      } else {
        this.$message.error('Add/Update task type Failed!')
      }
    },
    cancelTasktype (props) {
      var index = props.$index
      if (props.row.type_id > 0) {
        props.row.type_name = this.$data.tasktypeResetData[index].type_name
        props.row.type_prefix = this.$data.tasktypeResetData[index].type_prefix
        props.row.type_category = this.$data.tasktypeResetData[index].type_category
        props.row.type_value = this.$data.tasktypeResetData[index].type_value
      } else {
        this.$data.tasktypeData.splice(index, 1)
      }
    },
    addTasktype () {
      var tasktype = {
        type_id: 0,
        type_name: 'N/A',
        type_prefix: '',
        type_category: 'AD',
        type_value: 0
      }
      this.$data.tasktypeData.unshift(tasktype)
    },
    showMessage (iCon, iType) {
      this.$message({
        message: iCon,
        type: iType
      })
    }
  },
  created () {
    console.log('Created')
    this.getUserList()
    this.getTeamList()
    this.getTaskTypeList()
  }
}
</script>

<style scoped>
.pm-body {
  width: 100%;
  height: auto;
}
.el-main {
  color: #333;
  text-align: center;
  height: auto;
  padding: 0;
}
.content-title-col {
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content-title-item {
  height: 30px;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  cursor: pointer;
}
.content-title-item-icon {
  height:20px;
  width: 20px;
  font-size: 20px;
}
.content-title-item-header {
  margin-left:5px;
  height:20px;
  width: auto;
  font-size: 20px;
}
/* Content Style */
.pm-content {
  width: auto;
  height: auto;
  padding: 20px 5px 0px 5px;
  text-align: left;
}
.pm-content-header {
  font-size: 24px;
  margin-left: 10px;
  color: #747d8c;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}
.pm-content-header-btn {
  margin-left: 20px;
}
.pm-table-expand-label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 32px;
  line-height: 32px;
  font-size: 15px;
  color: #99a9bf;
}
.pm-table-expand-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 32px;
  line-height: 32px;
}
/*Common Style*/
.bg-color {
  background-color: #7bed9f;
}
.active {
  color: #ff6348;
  border-bottom: 1px solid #ff6348;
  cursor: default;
}
</style>
<style>
.el-card__body {
  padding: 5px 10px;
}
.el-table td, .el-table th {
  padding: 8px 0;
}
/* google、safari */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button{
  -webkit-appearance: none !important;
  margin: 0;
}
/* Firefox */
input[type="number"]{
  -moz-appearance: textfield;
}
</style>
