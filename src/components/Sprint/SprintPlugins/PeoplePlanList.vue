<template>
  <div class="sv-content-people-plan-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>People Resource</span>
      </div>
      <div class="people-plan-list-table">
        <el-table :data="userPlanList" width="100%" size="small">
          <el-table-column v-if="false" prop="userId" label="Id"></el-table-column>
          <el-table-column prop="userFullName" label="Name" align="left" width="150"></el-table-column>
          <el-table-column prop="userSkillsStr" label="Skills" align="left" min-width="190" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userLevel" label="Level" align="center" width="60"></el-table-column>
          <el-table-column prop="userWorkingHrs" label="WHrs" align="center" width="60"></el-table-column>
          <el-table-column prop="userCapacity" label="Capacity" align="center" width="100">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.userCapacity" :step="scope.row.userWorkingHrs" step-strictly :min="0" :max="scope.row.userMaxCapacity" controls-position="right" size="mini"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="right" width="50">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="Assigen to Sprint" placement="top">
                <el-button @click="assignUserToSprint(scope.row)" type="primary" icon="el-icon-d-arrow-right"></el-button>
              </el-tooltip>
            </template>
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
      sprintObj: null
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
    async getUserListBySkills (iSprintObj) {
      this.$data.userPlanList = []
      if (iSprintObj.sprintRequiredSkills != null && iSprintObj.sprintRequiredSkills != '') {
        var skillsArray = iSprintObj.sprintRequiredSkills.toString()
        console.log('Skills Array: ', skillsArray)
        var res = await http.post('/users/getActiveUsersListBySkill', {
          reqSkillsArray: skillsArray
        })
        if (res != null && res.data.status == 0) {
          var userList = res.data.data
          var sprintWorkingDays = Number(iSprintObj.sprintWorkingDays)
          for (var j=0; j<userList.length; j++) {
            var capacity = Number(userList[j].userWorkingHrs) * sprintWorkingDays
            userList[j].userCapacity = capacity
            userList[j].userMaxCapacity = capacity
          }
          this.$data.userPlanList = userList
        }
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
      }
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