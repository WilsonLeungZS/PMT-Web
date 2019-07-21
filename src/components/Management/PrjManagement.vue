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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <div class="pm-content">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span class="pm-content-header">
                    Users List
                    <el-tooltip class="item" effect="dark" content="Add New User" placement="top">
                      <el-button type="primary" icon="el-icon-plus" size="mini" circle
                        class="pm-content-header-btn" @click="addUser"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Expoet Users List" placement="top">
                      <el-button type="success" icon="el-icon-download" size="mini" circle class="pm-content-header-btn"></el-button>
                    </el-tooltip>
                  </span>
                </div>
                <el-table :data="userData" style="width:100%;height:auto" fit>
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-row :gutter="15">
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Name</span>
                        </el-col>
                        <el-col :span="10" class="pm-table-expand-item">
                          <el-input v-model="props.row.user_name" size="small" style="width: 100%"></el-input>
                        </el-col>
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Email</span>
                        </el-col>
                        <el-col :span="10" class="pm-table-expand-item">
                          <el-input v-model="props.row.user_email" size="small" style="width: 100%"></el-input>
                        </el-col>
                      </el-row>
                      <el-row :gutter="15" style="margin-top: 10px">
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Team</span>
                        </el-col>
                        <el-col :span="10" class="pm-table-expand-item">
                          <el-select v-model="props.row.user_team" size="small" style="width: 100%">
                            <el-option label="TOS" value="TOS"></el-option>
                            <el-option label="Billing" value="Billing"></el-option>
                            <el-option label="BSS" value="BSS"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Role</span>
                        </el-col>
                        <el-col :span="10" class="pm-table-expand-item">
                          <el-select v-model="props.row.user_role" size="small" style="width: 100%">
                            <el-option label="Admin" value="Admin"></el-option>
                            <el-option label="General" value="General"></el-option>
                          </el-select>
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
                          <el-button type="primary" size="small"
                            style="width:100%" @click="saveUser(props)">Save</el-button>
                          <el-button type="info" size="small"
                            style="width:100%" @click="cancelUser(props)">Cancel</el-button>
                        </el-col>
                      </el-row>
                    </template>
                  </el-table-column>
                  <el-table-column label="Id" prop="user_id" v-if="false"></el-table-column>
                  <el-table-column label="Name" prop="user_name" min-width="120" show-overflow-tooltip></el-table-column>
                  <el-table-column label="Email" prop="user_email" min-width="210" show-overflow-tooltip></el-table-column>
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
          <el-col :span="10">
            <div class="pm-content">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span class="pm-content-header">
                    Team List
                    <el-tooltip class="item" effect="dark" content="Add New Team" placement="top">
                      <el-button type="primary" icon="el-icon-plus" size="mini" circle
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
                        <el-col :span="20" class="pm-table-expand-item">
                          <el-input v-model="props.row.team_name" size="small" style="width: 100%"></el-input>
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
                          <el-button type="primary" size="small"
                            style="width:100%" @click="saveTeam(props)">Save</el-button>
                          <el-button type="info" size="small"
                            style="width:100%" @click="cancelTeam(props)">Cancel</el-button>
                        </el-col>
                      </el-row>
                    </template>
                  </el-table-column>
                  <el-table-column label="Id" prop="team_id" v-if="false"></el-table-column>
                  <el-table-column label="Name" prop="team_name" min-width="70" show-overflow-tooltip></el-table-column>
                  <el-table-column label="Description" prop="team_desc" min-width="150" show-overflow-tooltip></el-table-column>
                  <el-table-column label="Mapping" prop="team_mapping" min-width="100" show-overflow-tooltip></el-table-column>
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
          <el-col :span="10">
            <div class="pm-content">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span class="pm-content-header">
                    Task Type List
                    <el-tooltip class="item" effect="dark" content="Add New Task Type" placement="top">
                      <el-button type="primary" icon="el-icon-plus" size="mini" circle
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
                          <el-input v-model="props.row.tasktype_name" size="small" style="width: 100%"></el-input>
                        </el-col>
                      </el-row>
                      <el-row :gutter="15" style="margin-top:10px">
                        <el-col :span="4" class="pm-table-expand-label">
                          <span>Category</span>
                        </el-col>
                        <el-col :span="20" class="pm-table-expand-item">
                          <el-select v-model="props.row.tasktype_category" size="small" style="width: 100%">
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
                          <el-input v-model="props.row.tasktype_value" size="small" style="width: 100%"></el-input>
                        </el-col>
                        <el-col :span="10" class="pm-table-expand-item">
                          <el-button type="primary" size="small"
                            style="width:100%" @click="saveTasktype(props)">Save</el-button>
                          <el-button type="info" size="small"
                            style="width:100%" @click="cancelTasktype(props)">Cancel</el-button>
                        </el-col>
                      </el-row>
                    </template>
                  </el-table-column>
                  <el-table-column label="Id" prop="tasktype_id" v-if="false"></el-table-column>
                  <el-table-column label="Name" prop="tasktype_name" min-width="150" show-overflow-tooltip></el-table-column>
                  <el-table-column label="Category" prop="tasktype_category" min-width="70"></el-table-column>
                  <el-table-column label="Value" prop="tasktype_value" align="center" min-width="50"></el-table-column>
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
export default {
  name: 'Projecpmanagement',
  data () {
    return {
      header1: 'Project Management',
      isActive: true,
      userData: [
        {user_id: 1, user_name: 'zhongshu.liang', user_email: 'zhongshu.liang@accenture.com', user_team: 'TOS', user_role: 'Admin', user_isactive: true},
        {user_id: 2, user_name: 'chaofeng.jia', user_email: 'chaofeng.jia@accenture.com', user_team: 'Billing', user_role: 'General', user_isactive: true},
        {user_id: 3, user_name: 'xu.xu', user_email: 'xu.xu@accenture.com', user_team: 'Billing', user_role: 'General', user_isactive: false},
        {user_id: 4, user_name: 'zefeng.wu', user_email: 'zefeng.wu@accenture.com', user_team: 'TOS', user_role: 'General', user_isactive: true},
        {user_id: 5, user_name: 'yixin.li', user_email: 'yixin.li@accenture.com', user_team: 'TOS', user_role: 'General', user_isactive: true},
        {user_id: 6, user_name: 'zhongshu.liang', user_email: 'zhongshu.liang@accenture.com', user_team: 'TOS', user_role: 'Admin', user_isactive: true},
        {user_id: 7, user_name: 'chaofeng.jia', user_email: 'chaofeng.jia@accenture.com', user_team: 'Billing', user_role: 'General', user_isactive: true},
        {user_id: 8, user_name: 'xu.xu', user_email: 'xu.xu@accenture.com', user_team: 'Billing', user_role: 'General', user_isactive: false},
        {user_id: 9, user_name: 'zefeng.wu', user_email: 'zefeng.wu@accenture.com', user_team: 'TOS', user_role: 'General', user_isactive: true},
        {user_id: 10, user_name: 'yixin.li', user_email: 'yixin.li@accenture.com', user_team: 'TOS', user_role: 'General', user_isactive: true}
      ],
      userResetData: [],
      teamData: [
        {team_id: 1, team_name: 'TOS', team_desc: 'Terminal Operation System Support Team', team_mapping: 'ACN-APP-TOS,TOS', team_isactive: true},
        {team_id: 2, team_name: 'Billing', team_desc: 'Terminal Billing Support Team', team_mapping: 'ACN-APP-BILLING,BILLING', team_isactive: true},
        {team_id: 3, team_name: 'TOS', team_desc: 'Back Office Support Team', team_mapping: 'ACN-APP-BSS,BSS', team_isactive: true},
        {team_id: 4, team_name: 'EDI', team_desc: 'EDI Team', team_mapping: 'ACN-APP-EDI,EDI', team_isactive: true},
        {team_id: 4, team_name: 'Operation', team_desc: 'Operation Support Team', team_mapping: 'Operation', team_isactive: false}
      ],
      teamResetData: [],
      activeFilter: [
        {text: 'Active', value: true},
        {text: 'Inactive', value: false}
      ],
      roleFilter: [
        {text: 'Admin', value: 'Admin'},
        {text: 'General', value: 'General'}
      ],
      teamFilter: [
        {text: 'TOS', value: 'TOS'},
        {text: 'Billing', value: 'Billing'},
        {text: 'BSS', value: 'BSS'}
      ],
      tasktypeData: [
        {tasktype_id: 1, tasktype_name: 'Change', tasktype_category: 'AD', tasktype_value: 0},
        {tasktype_id: 2, tasktype_name: 'Sponsor Task', tasktype_category: 'Others', tasktype_value: 0},
        {tasktype_id: 3, tasktype_name: 'Incident', tasktype_category: 'AM', tasktype_value: 4},
        {tasktype_id: 4, tasktype_name: 'ITSR', tasktype_category: 'AM', tasktype_value: 8},
        {tasktype_id: 5, tasktype_name: 'Problem', tasktype_category: 'AM', tasktype_value: 24},
        {tasktype_id: 6, tasktype_name: 'Service Request', tasktype_category: 'AM', tasktype_value: 8},
        {tasktype_id: 7, tasktype_name: 'Leave', tasktype_category: 'Leave', tasktype_value: 0},
        {tasktype_id: 8, tasktype_name: 'App Admin', tasktype_category: 'AD', tasktype_value: 16}
      ],
      tasktypeResetData: []
    }
  },
  methods: {
    activefilterHandler (value, row, column) {
      return row['user_isactive'] === value
    },
    rolefilterHandler (value, row, column) {
      return row['user_role'] === value
    },
    teamfilterHandler (value, row, column) {
      return row['user_team'] === value
    },
    saveUser (props) {
      console.log(props)
    },
    cancelUser (props) {
      var index = props.$index
      if (props.row.user_id > 0) {
        props.row.user_name = this.$data.userResetData[index].user_name
        props.row.user_email = this.$data.userResetData[index].user_email
        props.row.user_team = this.$data.userResetData[index].user_team
        props.row.user_role = this.$data.userResetData[index].user_role
        props.row.user_isactive = this.$data.userResetData[index].user_isactive
      } else {
        this.$data.userData.splice(index, 1)
      }
    },
    addUser () {
      var user = {
        user_id: -1,
        user_name: 'N/A',
        user_email: 'N/A',
        user_team: 'TOS',
        user_role: 'General',
        user_isactive: false
      }
      this.$data.userData.unshift(user)
    },
    saveTeam (props) {
      console.log(props)
    },
    cancelTeam (props) {
      var index = props.$index
      if (props.row.team_id > 0) {
        props.row.team_name = this.$data.teamResetData[index].team_name
        props.row.team_desc = this.$data.teamResetData[index].team_desc
        props.row.team_mapping = this.$data.teamResetData[index].team_mapping
        props.row.team_isactive = this.$data.teamResetData[index].team_isactive
      } else {
        this.$data.teamData.splice(index, 1)
      }
    },
    addTeam () {
      var team = {
        user_id: -1,
        team_name: 'N/A',
        team_desc: 'N/A',
        team_mapping: '',
        team_isactive: false
      }
      this.$data.teamData.unshift(team)
    },
    saveTasktype (props) {
      console.log(props)
    },
    cancelTasktype (props) {
      var index = props.$index
      if (props.row.tasktype_id > 0) {
        props.row.tasktype_name = this.$data.tasktypeResetData[index].tasktype_name
        props.row.tasktype_category = this.$data.tasktypeResetData[index].tasktype_category
        props.row.tasktype_value = this.$data.tasktypeResetData[index].tasktype_value
      } else {
        this.$data.tasktypeData.splice(index, 1)
      }
    },
    addTasktype () {
      var tasktype = {
        tasktype_id: -1,
        tasktype_name: 'N/A',
        tasktype_category: 'AD',
        tasktype_value: 0
      }
      this.$data.tasktypeData.unshift(tasktype)
    }
  },
  created () {
    console.log('Created')
    var jsonString1 = JSON.stringify(this.$data.userData)
    this.$data.userResetData = JSON.parse(jsonString1)
    var jsonString2 = JSON.stringify(this.$data.teamData)
    this.$data.teamResetData = JSON.parse(jsonString2)
    var jsonString3 = JSON.stringify(this.$data.tasktypeData)
    this.$data.tasktypeResetData = JSON.parse(jsonString3)
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
</style>
