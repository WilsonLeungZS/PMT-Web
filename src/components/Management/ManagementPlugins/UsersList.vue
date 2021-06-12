<template>
<div class="pm-content">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="pm-content-header">
        <span>Users List</span>
        <el-button @click="createUser" class="pm-content-header-btn" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" icon="el-icon-plus" size="mini">Create New User</el-button>
      </span>
    </div>
    <el-table v-loading="userLoading" :data="userData" fit>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row :gutter="15">
            <el-col :span="4" :lg="2" class="pm-table-expand-label">
              <span>Name</span>
            </el-col>
            <el-col :span="8" :lg="4" class="pm-table-expand-item">
              <el-input v-model="props.row.userName" size="small" style="width: 100%"></el-input>
            </el-col>
            <el-col :span="4" :lg="2" class="pm-table-expand-label">
              <span>Nickname</span>
            </el-col>
            <el-col :span="8" :lg="4" class="pm-table-expand-item">
              <el-input v-model="props.row.userNickname" size="small" style="width: 100%"></el-input>
            </el-col>
            <el-col :span="4" :lg="3" class="pm-table-expand-label">
              <span>Employee Number</span>
            </el-col>
            <el-col :span="8" :lg="4" class="pm-table-expand-item">
              <el-input v-model="props.row.userEmployeeNbr" size="small" style="width: 100%"></el-input>
            </el-col>
            <el-col :span="4" :lg="2" class="pm-table-expand-label">
              <span>Level</span>
            </el-col>
            <el-col :span="8" :lg="3" class="pm-table-expand-item">
              <el-input v-model="props.row.userLevel" size="small" style="width: 100%"></el-input>
            </el-col>                    
          </el-row>
          <el-divider></el-divider>
          <el-row :gutter="15">
            <el-col :span="4" :lg="2" class="pm-table-expand-label">
              <span>Email</span>
            </el-col>
            <el-col :span="20" :lg="10" class="pm-table-expand-item">
              <el-input v-model="props.row.userEmail" size="small" style="width: 100%"></el-input>
            </el-col>
            <el-col :span="4" :lg="3" class="pm-table-expand-label">
              <span>Working Hours</span>
            </el-col>
            <el-col :span="8" :lg="4" class="pm-table-expand-item">
              <el-input v-model="props.row.userWorkingHrs" size="small" style="width: 100%"></el-input>
            </el-col> 
            <el-col :span="4" :lg="2" class="pm-table-expand-label">
              <span>Role</span>
            </el-col>
            <el-col :span="8" :lg="3" class="pm-table-expand-item">
              <el-select v-model="props.row.userRole" size="small" style="width: 100%">
                <el-option label="Admin" value="Admin"></el-option>
                <el-option label="General" value="General"></el-option>
                <el-option label="Special" value="Special"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row :gutter="15">
            <el-col :span="4" :lg="2" class="pm-table-expand-label">
              <span>Skills</span>
            </el-col>
            <el-col :span="20" :lg="10" class="pm-table-expand-item">
              <el-select v-model="props.row.userSkills" size="small" style="width: 100%" multiple>
                <el-option-group v-for="(skillGroup, index) in skillsList" :key="index" :label="skillGroup.Label">
                  <el-option v-for="(skill, index) in skillGroup.Options" :key="index" :label="skill.skillName" :value="skill.skillId">
                    <span style="float: left;">{{ skill.skillName }}</span>
                    <span style="float: left; margin-left:10px; color: #8492a6; font-size: 12px">{{ skill.skillDesc }}</span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-col>
            <el-col :span="4" :lg="3" class="pm-table-expand-label">
              <span>Name Mappings</span>
            </el-col>
            <el-col :span="20" :lg="9" class="pm-table-expand-item">
              <el-input v-model="props.row.userNameMappings" size="small" style="width: 100%"></el-input>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row :gutter="15">
            <el-col :span="4" :lg="2" class="pm-table-expand-label">
              <span>Email Groups</span>
            </el-col>
            <el-col :span="20" :lg="10" class="pm-table-expand-item">
              <el-input v-model="props.row.userEmailGroups" size="small" style="width: 100%"></el-input>
            </el-col>
            <el-col :span="4" :lg="2" class="pm-table-expand-label">
              <span>Active</span>
            </el-col>
            <el-col :span="4" :lg="2" class="pm-table-expand-item">
              <el-switch v-model="props.row.userIsActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-col>                
            <el-col :span="8" :lg="4" class="pm-table-expand-item">
              <el-button @click="cancelUser(props)" type="info" size="small" style="width:100%" >Cancel</el-button>
            </el-col>
            <el-col :span="8" :lg="4" class="pm-table-expand-item">
              <el-button @click="saveUser(props)" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="small" style="width:100%">Save</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="Id" prop="userId" v-if="false" :key="1"></el-table-column>
      <el-table-column label="Name" prop="userName" align="left" width="170" :key="2"></el-table-column>
      <el-table-column label="Nickname" prop="userNickname" align="left" width="170" :key="3"></el-table-column>
      <el-table-column label="Level" prop="userLevel" align="center" width="100" sortable :key="4"></el-table-column>
      <el-table-column label="Working Hours" prop="userWorkingHrs" align="center" width="180" sortable :key="5"></el-table-column>
      <el-table-column label="Skills" prop="userSkillsStr" align="center" min-width="200" show-overflow-tooltip :key="6"></el-table-column>
      <el-table-column label="Role" prop="userRole" align="center" width="100" :filters="roleFilter" :filter-method="rolefilterHandler" :key="7">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.userRole === 'Admin'" size="small" effect="dark">{{scope.row.userRole}}</el-tag>
          <el-tag v-if="scope.row.userRole === 'General'" size="small" type="info" effect="dark">{{scope.row.userRole}}</el-tag>
          <el-tag v-if="scope.row.userRole === 'Special'" size="small" type="success" effect="dark">{{scope.row.userRole}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Active" prop="userIsActive" align="center" width="100" :filters="activeFilter" :filter-method="activefilterHandler" :key="8">
        <template slot-scope="scope">
          <i v-if="scope.row.userIsActive" class="el-icon-success" style="font-size: 25px; color: #2ed573"></i>
          <i v-if="!scope.row.userIsActive" class="el-icon-error" style="font-size: 25px; color: #ff4757"></i>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
import http from '../../../utils/http'
import utils from '../../../utils/utils'
export default {
  name: 'UsersList',
  data () {
    return {
      skillsList: [],
      userLoading: false,
      userData: [],
      userResetData: [],
      activeFilter: [
        {text: 'Active', value: true},
        {text: 'Inactive', value: false}
      ],
      roleFilter: [
        {text: 'Admin', value: 'Admin'},
        {text: 'General', value: 'General'},
        {text: 'Special', value: 'Special'}
      ],
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2
    }
  },
  methods: {
    // Style Method
    activefilterHandler (value, row, column) {
      return row['user_isactive'] === value
    },
    rolefilterHandler (value, row, column) {
      return row['user_role'] === value
    },
    // Functional Method
    // Skill Handling
    async getAllSkillsList () {
      this.$data.skillsList = []
      const res = await http.get('/users/getAllSkillsList')
      if (res.data.status === 0) {
        //this.$data.skillsList = res.data.data
        var skillsList = res.data.data
        var skillsListGroup = []
        if (skillsList != null && skillsList.length > 0) {
          for (var i=0; i<skillsList.length; i++) {
            var group = skillsList[i].skillGroup.substr(1)
            var index = this.getIndexOfValueInArr(skillsListGroup, 'Label', group)
            if (index == -1) {
              skillsListGroup.push({
                Label: group,
                Options: [skillsList[i]]
              })
            } else {
              skillsListGroup[index].Options.push(skillsList[i])
            }
          }
          console.log('Skills Group List: ', skillsListGroup)
        }
        this.$data.skillsList = skillsListGroup
      } else {
        this.$data.skillsList = []
      }
    },
   getIndexOfValueInArr(iArray, iKey, iValue) {
      for(var i=0; i<iArray.length;i++) {
        var item = iArray[i];
        if(iKey != null){
          if(item[iKey] == iValue){
            return i;
          }
        } 
        if(iKey == null){
          if(item == iValue){
            return i;
          }
        }
      }
      return -1;
    },
    // User Management
    async getUserList () {
      this.$data.userLoading = true
      this.$data.userData = []
      const res = await http.get('/users/getAllUsersList')
      if (res.data.status === 0) {
        this.$data.userData = res.data.data
        var jsonString1 = JSON.stringify(this.$data.userData)
        this.$data.userResetData = JSON.parse(jsonString1)
      } else {
        this.$data.userResetData = []
      }
      this.$data.userLoading = false
    },
    createUser () {
      var user = {
        userId: 0,
        userName: '',
        userNickname : '',
        userEmployeeNbr: '',
        userEmail: '',
        userRole: 'General',
        userThemeStyle: 0,
        userNameMappings: '',
        userLevel: 0,
        userEmailGroups: '',
        userSkills: [],
        userWorkingHrs: '0',
        userIsActive: true
      }
      this.$data.userData.unshift(user)
    },
    async saveUser (props) {
      var user = props.row
      if(this.isEmptyField(user.userName, 'Name')) return
      if (user.userSkills.length > 0) {
        for (var i=0; i<user.userSkills.length; i++) {
          user.userSkills[i] = '#' + user.userSkills[i] + '#'
        }
      }
      const res = await http.post('/users/updateUser', {
        reqUserId: user.userId,
        reqUserName: user.userName,
        reqUserNickname : user.userNickname,
        reqUserEmployeeNbr: user.userEmployeeNbr,
        reqUserEmail: user.userEmail,
        reqUserRole: user.userRole,
        reqUserThemeStyle: user.userThemeStyle,
        reqUserNameMappings: user.userNameMappings,
        reqUserLevel: user.userLevel,
        reqUserEmailGroups: user.userEmailGroups,
        reqUserSkills: user.userSkills.toString(),
        reqUserWorkingHrs: user.userWorkingHrs,
        reqUserIsActive: user.userIsActive
      })
      if (res.data.status === 0) {
        this.getUserList()
        this.getAllSkillsList()
        this.showMessage('Add/Update user successfully!', 'success')
      } else {
        this.$message.error('Add/Update user Failed!')
      }
    },
    cancelUser (props) {
      var index = props.$index
      if (props.row.userId > 0) {
        props.row.userName = this.$data.userResetData[index].userName
        props.row.userNickname = this.$data.userResetData[index].userNickname
        props.row.userEmployeeNbr = this.$data.userResetData[index].userEmployeeNbr
        props.row.userEmail = this.$data.userResetData[index].userEmail
        props.row.userRole = this.$data.userResetData[index].userRole
        props.row.userThemeStyle = this.$data.userResetData[index].userThemeStyle
        props.row.userNameMappings = this.$data.userResetData[index].userNameMappings
        props.row.userLevel = this.$data.userResetData[index].userLevel
        props.row.userEmailGroups = this.$data.userResetData[index].userEmailGroups
        props.row.userSkills = this.$data.userResetData[index].userSkills
        props.row.userWorkingHrs = this.$data.userResetData[index].userWorkingHrs
        props.row.userIsActive = this.$data.userResetData[index].userIsActive
      } else {
        this.$data.userData.splice(index, 1)
      }
    },
    // Common method
    isEmptyField (iField, iFieldName) {
      if (iField == null || iField == '') {
        this.showMessage( iFieldName + ' could not be empty!', 'error')
        return true
      }
    },
    showMessage (iMsg, iType) {
      this.$message({
        message: iMsg,
        type: iType
      })
    }
  },
  created () {
    this.getUserList()
    this.getAllSkillsList()
  }
}
</script>

<style scoped>
/* Content Style */
.pm-content {
  width: auto;
  height: auto;
  /* padding: 20px 5px 0px 5px; */
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
  font-size: 14px;
  margin-left: 30px;
}
.pm-table-expand-label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 32px;
  line-height: 32px;
  font-size: 15px;
  color: #99a9bf;
  margin-bottom: 10px;
}
.pm-table-expand-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 32px;
  line-height: 32px;
  margin-bottom: 10px;
}
.pm-content>>>.el-divider {
  background-color: #e0e0e0;
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
.pm-content .el-card__body {
  padding: 5px 10px;
}
.pm-content .el-table td, .el-table th {
  padding: 8px 0;
}
.pm-content .el-divider--horizontal {
  margin: 2px 0 10px 0;
}
/* google、safari */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
