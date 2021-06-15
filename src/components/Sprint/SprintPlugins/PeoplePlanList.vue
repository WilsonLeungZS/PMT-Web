<template>
  <div class="sv-content-people-plan-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Resources</span>
      </div>
      <div class="people-plan-list-table">
        <el-table v-loading="userPlanListLoading" :data="userPlanList" @selection-change="handleSelectionChange" width="100%" size="small">
          <el-table-column type="selection" width="30"></el-table-column>
          <el-table-column v-if="false" prop="userId" label="Id"></el-table-column>
          <el-table-column prop="userFullName" label="Name" align="left" width="150" sortable></el-table-column>
          <el-table-column prop="userSkillsStr" label="Skills" align="left" min-width="140" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="userLevel" label="Level" align="center" width="60"></el-table-column>
          <el-table-column prop="userWorkingHrs" label="WHrs" align="center" width="60"></el-table-column>
          <el-table-column prop="userCapacity" label="Capacity" align="center" width="100">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.userCapacity" :step="scope.row.userWorkingHrs" step-strictly :min="0" :max="scope.row.userMaxCapacity" controls-position="right" size="mini"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="right" width="50">
            <template slot="header">
              <el-button :disabled="disabledAddPeopleBtn" @click="userAllToSprint" v-if="checkUser.length > 0" type="primary" icon="el-icon-d-arrow-right"></el-button>
            </template>
            <!-- <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="disabledMessage" placement="top">
                <el-button :disabled="disabledAddPeopleBtn" @click="assignUserT mary" icon="el-icon-d-arrow-right"></el-button>
              </el-tooltip>
            </template> -->
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import http from '../../../utils/http'
import utils from '../../../utils/utils'
export default {
  name: 'PeoplePlanList',
  components: {
  },
  data () {
    return {
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
      userPlanList: [],
      sprintObj: null,
      disabledAddPeopleBtn: false,
      disabledMessage: 'Assigen to Sprint',
      // Loading
      userPlanListLoading: false,
      checkUser: [],
    }
  },
  props: {
      'sprint': Object
    },
  watch: {
    sprint: {
      handler (val, oldVal) {
        var sprintObj = val
        if (sprintObj != null && sprintObj != '') {
          this.getUserListBySkills(sprintObj)
          this.validateSprint(sprintObj)
          this.sprintObj = sprintObj
        } else {
          this.userPlanList = []
          this.sprintObj = null
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    userAllToSprint(){
      this.checkUser.forEach((item)=>{
        this.assignUserToSprint(item)
      })
    },
    handleSelectionChange(val) {
      this.checkUser = val
    },
    validateSprint (iSprintObj) {
      var sprintEndTime = iSprintObj.sprintEndTime
      var sprintStatus = iSprintObj.sprintStatus
      var currentTime = this.formatDate(new Date(), 'yyyy-MM-dd')
      if (currentTime > sprintEndTime) {
        this.$data.disabledMessage = 'Not allow to edit sprint after the sprint end'
        this.$data.disabledAddPeopleBtn = true
      }
      else if (sprintStatus == 'Running') {
        this.$data.disabledMessage = 'Not allow to assign people to sprint when it is running'
        this.$data.disabledAddPeopleBtn = true
      }
      else {
        this.$data.disabledMessage = 'Assigen to Sprint'
        this.$data.disabledAddPeopleBtn = false
      }
    },
    async getUserListBySkills (iSprintObj) {
      this.$data.userPlanList = []
      if (iSprintObj.sprintRequiredSkills != null && iSprintObj.sprintRequiredSkills != '') {
        this.$data.userPlanListLoading = true
        var skillsArray = iSprintObj.sprintRequiredSkills.toString()
        console.log('Skills Array: ', skillsArray)
        var res = await http.post('/users/getActiveUsersListBySkill', {
          reqSkillsArray: skillsArray,
          reqSprintStartTime: iSprintObj.sprintStartTime,
          reqSprintEndTime: iSprintObj.sprintEndTime
        })
        if (res != null && res.data.status == 0) {
          var userList = res.data.data
          // Start to calculate the capacity
          var sprintWorkingDays = Number(iSprintObj.sprintWorkingDays)
          for (var i=0; i<userList.length; i++) {
            var usedCapacity = userList[i].userUsedCapacity
            var capacity = Number(userList[i].userWorkingHrs) * sprintWorkingDays - usedCapacity
            // console.log('User ', userList[i].userName, ' capacity = ', capacity)
            if (capacity == 0) {
              userList.splice(i, 1)
              i = i-1
            } else {
              userList[i].userCapacity = capacity
              userList[i].userMaxCapacity = capacity
            }
          }
          // End of calculate
          this.$data.userPlanList = userList.filter(item => {
            item.userSkillsStrList = item.userSkillsStr.split(',')
            for(let i = 0;i<item.userSkillsStrList.length;i++){
              return this.sprint.sprintRequiredSkillsStr.indexOf(item.userSkillsStrList[i]) != -1
            }
          });
        }
        this.$data.userPlanListLoading = false
      }
    },
    async assignUserToSprint (iUser) {
      var reqUserId = iUser.userId
      var reqUserWorkingHrs = Number(iUser.userWorkingHrs)
      var reqCapacity = iUser.userCapacity
      var sprintObj = this.$data.sprintObj
      if (sprintObj != null) {
        var reqSprintId = sprintObj.sprintId
        var reqSprintWorkingDays = Number(sprintObj.sprintWorkingDays)
        var reqMaxCapacity = reqUserWorkingHrs * reqSprintWorkingDays
        const res = await http.post('/sprints/assignUserToSprint', {
          reqSprintId: reqSprintId,
          reqUserId: reqUserId,
          reqCapacity: reqCapacity,
          reqMaxCapacity: reqMaxCapacity
        })
        if (res.data != null && res.data.status == 0) {
          this.$emit('refreshSprint')
        }
      }
    },
    // Common Method
    formatDate (date, fmt) { 
      var o = { 
        "M+" : date.getMonth()+1,                 
        "d+" : date.getDate(),                     
        "h+" : date.getHours(),                    
        "m+" : date.getMinutes(),                 
        "s+" : date.getSeconds(),                  
        "q+" : Math.floor((date.getMonth()+3)/3),
        "S"  : date.getMilliseconds()            
      }; 
      if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
      }
      for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
          }
      }
      return fmt; 
    }
  },
  created () {
  }
}
</script>

<style scoped>
.sv-content-people-plan-list {
  width: 100%;
  height: auto;
}
.sv-content-people-plan-list>>>.el-card__body {
  padding: 5px;
}
.people-plan-list-table {
  width: 100%;
}
.people-plan-list-table>>>.el-table td {
  padding: 5px 0;
}
.people-plan-list-table>>>.el-table th {
  padding: 5px 0;
}
.people-plan-list-table>>>.el-button {
  padding: 6px 7px;
}
.people-plan-list-table>>>.el-input-number--mini {
  width: 90px;
}
</style>