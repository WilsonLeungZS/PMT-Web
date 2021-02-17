<template>
<div class="sm-content">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="sm-content-header">
        <span>Sprints List</span>
        <el-button @click="createSprint" class="sm-content-header-btn" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" icon="el-icon-plus" size="mini">Create New Sprint</el-button>
      </span>
    </div>
    <el-table v-loading="sprintLoading" :data="sprintData" fit>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row :gutter="15">
            <el-col :span="4" :lg="2" class="sm-table-expand-label">
              <span>Name</span>
            </el-col>
            <el-col :span="8" :lg="6" class="sm-table-expand-item">
              <el-input v-model="props.row.sprintName" size="small" style="width: 100%"></el-input>
            </el-col>
            <el-col :span="4" :lg="2" class="sm-table-expand-label">
              <span>Start Time</span>
            </el-col>
            <el-col :span="8" :lg="3" class="sm-table-expand-item">
              <el-date-picker @change="changeSprintTime(props)" v-model="props.row.sprintStartTime" size="small" type="date" value-format="yyyy-MM-dd" placeholder="Select Date..." style="width: 100%" clearable></el-date-picker>
            </el-col>
            <el-col :span="4" :lg="2" class="sm-table-expand-label">
              <span>End Time</span>
            </el-col>
            <el-col :span="8" :lg="3" class="sm-table-expand-item">
              <el-date-picker @change="changeSprintTime(props)" v-model="props.row.sprintEndTime" size="small" type="date" value-format="yyyy-MM-dd" placeholder="Select Date..." style="width: 100%" clearable></el-date-picker>
            </el-col>
            <el-col :span="4" :lg="2" class="sm-table-expand-label">
              <span>Leader</span>
            </el-col>
            <el-col :span="8" :lg="4" class="sm-table-expand-item">
              <el-select v-model="props.row.sprintLeaderId" size="small" style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option v-for="(leader, index) in leadersList" :key="index" :label="leader.userName" :value="leader.userId">
                  <span style="float: left; margin-right:20px">{{ leader.userName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ leader.userLevel }}</span>
                </el-option>
              </el-select>
            </el-col>                    
          </el-row>
          <el-divider></el-divider>
          <el-row :gutter="15">
            <el-col :span="4" :lg="2" class="sm-table-expand-label">
              <span>Baseline</span>
            </el-col>
            <el-col :span="20" :lg="13" class="sm-table-expand-item">
              <el-input v-model="props.row.sprintBaseline" size="small" style="width: 100%"></el-input>
            </el-col>
            <el-col :span="4" :lg="2" class="sm-table-expand-label">
              <span>Working Days</span>
            </el-col>
            <el-col :span="8" :lg="2" class="sm-table-expand-item">
              <span><b style="text-decoration:underline">{{props.row.sprintWorkingDays}}</b> days</span> 
            </el-col> 
            <el-col :span="4" :lg="2" class="sm-table-expand-label">
              <span>Base Capacity</span>
            </el-col>
            <el-col :span="8" :lg="3" class="sm-table-expand-item">
              <el-input v-model="props.row.sprintBaseCapacity" size="small" style="width: 100%">
                <template slot="append">hrs</template>
              </el-input>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row :gutter="15">
            <el-col :span="4" :lg="2" class="sm-table-expand-label">
              <span>Required Skills</span>
            </el-col>
            <el-col :span="20" :lg="13" class="sm-table-expand-item">
              <el-select v-model="props.row.sprintRequiredSkills" size="small" style="width: 100%" multiple>
                <el-option-group v-for="(skillGroup, index) in skillsList" :key="index" :label="skillGroup.Label">
                  <el-option v-for="(skill, index) in skillGroup.Options" :key="index" :label="skill.skillName" :value="skill.skillId">
                    <span style="float: left;">{{ skill.skillName }}</span>
                    <span style="float: left; margin-left:10px; color: #8492a6; font-size: 12px">{{ skill.skillDesc }}</span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-col>
            <el-col :span="8" :lg="2" class="sm-table-expand-item">
              <el-button type="danger" size="small" style="width:100%" >Obsolete</el-button>
            </el-col>
            <el-col :span="8" :lg="3" class="sm-table-expand-item">
              <el-button @click="cancelSprint(props)" type="info" size="small" style="width:100%" >Cancel</el-button>
            </el-col>
            <el-col :span="8" :lg="4" class="sm-table-expand-item">
              <el-button @click="saveSprint(props)" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="small" style="width:100%">Save</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="Id" prop="sprintId" v-if="false" :key="1"></el-table-column>
      <el-table-column label="Name" prop="sprintName" align="left" width="250" :key="2"></el-table-column>
      <el-table-column label="Start Time" prop="sprintStartTime" align="center" width="120" :key="3"></el-table-column>
      <el-table-column label="End Time" prop="sprintEndTime" align="center" width="120" :key="4"></el-table-column>
      <el-table-column label="Working Days" prop="sprintWorkingDays" align="center" width="150" :key="5"></el-table-column>
      <el-table-column label="Base Capacity" prop="sprintBaseCapacity" align="center" width="150" :key="6"></el-table-column>
      <el-table-column label="Baseline" prop="sprintBaseline" align="center" min-width="200" show-overflow-tooltip :key="7"></el-table-column>
      <el-table-column label="Leader" prop="sprintLeader" align="center" width="150" sortable :key="8"></el-table-column>
      <el-table-column label="Status" prop="sprintStatus" align="center" width="100" :key="9">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sprintStatus === 'Active'" size="small" type="primary" effect="dark">{{scope.row.sprintStatus}}</el-tag>
          <el-tag v-if="scope.row.sprintStatus === 'Running'" size="small" type="success" effect="dark">{{scope.row.sprintStatus}}</el-tag>
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
  name: 'SprintsList',
  data () {
    return {
      skillsList: [],
      leadersList: [],
      sprintLoading: false,
      sprintData: [],
      sprintResetData: [],
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2
    }
  },
  methods: {
    // Skill & User List Handling
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
    async getActiveLeadersList () {
      this.$data.leadersList = []
      const res = await http.get('/users/getActiveUsersListByLevelLimit', {reqUserLevelLimit: 10})
      if (res.data.status === 0) {
        this.$data.leadersList = res.data.data
      } else {
        this.$data.leadersList = []
      }
    },
    async changeSprintTime (props) {
      var sprint = props.row
      // Validate sprint start time should bigger than end time
      if (sprint.sprintStartTime != null && sprint.sprintEndTime != null) {
        if (sprint.sprintStartTime > sprint.sprintEndTime) {
          sprint.sprintStartTime = sprint.sprintEndTime
          sprint.sprintEndTime = null
          this.showMessage('Sprint start time could not later than end time!', 'error')
          return
        }
      }
      // Get Working Days
      if (sprint.sprintStartTime != null && sprint.sprintEndTime != null) {
        var res = await http.get('https://sitipo.gzatc.mtl/api/others/workdays', {
          start_date: sprint.sprintStartTime,
          end_date: sprint.sprintEndTime,
        })
        var workingDays = 0
        if (res != null && res.data != null) {
          workingDays = Number(res.data.workday_count)
        }
        sprint.sprintWorkingDays = workingDays
      } 
      if (sprint.sprintStartTime == null && sprint.sprintEndTime == null) {
        sprint.sprintWorkingDays = 0
      }
    },
    // Sprint Management
    async getSprintsList () {
      this.$data.sprintLoading = true
      this.$data.sprintData = []
      const res = await http.get('/sprints/getActiveSprintsList')
      if (res.data.status === 0) {
        var sprintsList = res.data.data
        this.$data.sprintData = sprintsList
        // Copy the value the reset array for cancel purpose
        var sprintsListStr = JSON.stringify(sprintsList)
        this.$data.sprintResetData = JSON.parse(sprintsListStr)
      } else {
        this.$data.sprintData = []
        this.$data.sprintResetData = []
      }
      this.$data.sprintLoading = false
    },
    createSprint () {
      var sprint = {
        sprintId: 0,
        sprintName: '',
        sprintStartTime : null,
        sprintEndTime : null,
        sprintBaseline: '',
        sprintWorkingDays: 0,
        sprintBaseCapacity: '',
        sprintRequiredSkills: [],
        sprintStatus: 'Active',
        sprintLeaderId: null
      }
      this.$data.sprintData.unshift(sprint)
    },
    async saveSprint (props) {
      var sprint = props.row
      if(this.isEmptyField(sprint.sprintName, 'Name') || this.isEmptyField(sprint.sprintStartTime, 'Start Time') || this.isEmptyField(sprint.sprintEndTime, 'End Time')) return
      if (sprint.sprintRequiredSkills.length > 0) {
        for (var i=0; i<sprint.sprintRequiredSkills.length; i++) {
          sprint.sprintRequiredSkills[i] = '#' + sprint.sprintRequiredSkills[i] + '#'
        }
      }
      const res = await http.post('/sprints/updateSprint', {
        reqSprintName: sprint.sprintName,
        reqSprintStartTime : sprint.sprintStartTime,
        reqSprintEndTime: sprint.sprintEndTime,
        reqSprintBaseline: sprint.sprintBaseline,
        reqSprintWorkingDays: sprint.sprintWorkingDays,
        reqSprintBaseCapacity: sprint.sprintBaseCapacity,
        reqSprintRequiredSkills: sprint.sprintRequiredSkills.toString(),
        reqSprintStatus: sprint.sprintStatus,
        reqSprintLeaderId: sprint.sprintLeaderId
      })
      if (res.data.status === 0) {
        this.getAllSkillsList()
        this.getActiveLeadersList()
        this.getSprintsList()
        this.showMessage('Add/Update sprint successfully!', 'success')
      } else {
        this.$message.error('Add/Update sprint Failed!')
      }
    },
    cancelSprint (props) {
      var index = props.$index
      if (props.row.userId > 0) {
        props.row.sprintName = this.$data.userResetData[index].sprintName
        props.row.sprintStartTime = this.$data.userResetData[index].sprintStartTime
        props.row.sprintEndTime = this.$data.userResetData[index].sprintEndTime
        props.row.sprintBaseline = this.$data.userResetData[index].sprintBaseline
        props.row.sprintWorkingDays = this.$data.userResetData[index].sprintWorkingDays
        props.row.sprintBaseCapacity = this.$data.userResetData[index].sprintBaseCapacity
        props.row.sprintRequiredSkills = this.$data.userResetData[index].sprintRequiredSkills
        props.row.sprintStatus = this.$data.userResetData[index].sprintStatus
        props.row.sprintLeaderId = this.$data.userResetData[index].sprintLeaderId
      } else {
        this.$data.sprintData.splice(index, 1)
      }
    },
    obsoleteSprint (props) {
      var sprint = props.row
      var sprintId = sprint.sprintId
      // No task under this sprint, will delete it
      // If all task done, will update sprint status to obsolete
      // If exist task not done, return
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
    this.getAllSkillsList()
    this.getActiveLeadersList()
    this.getSprintsList()
  }
}
</script>

<style scoped>
/* Content Style */
.sm-content {
  width: auto;
  height: auto;
  padding: 20px 5px 0px 5px;
  text-align: left;
}
.sm-content-header {
  font-size: 24px;
  margin-left: 10px;
  color: #747d8c;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}
.sm-content-header-btn {
  font-size: 14px;
  margin-left: 30px;
}
.sm-table-expand-label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 32px;
  line-height: 32px;
  font-size: 15px;
  color: #99a9bf;
  margin-bottom: 10px;
}
.sm-table-expand-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 32px;
  line-height: 32px;
  margin-bottom: 10px;
}
.sm-content>>>.el-divider {
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
.el-card__body {
  padding: 5px 10px;
}
.el-table td, .el-table th {
  padding: 8px 0;
}
.sm-content .el-divider--horizontal {
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
