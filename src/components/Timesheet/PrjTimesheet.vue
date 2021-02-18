<template>
  <div class="pt-body">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div class="content-title-item" @click="switchToMT">
              <i class="el-icon-date content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
            <el-divider direction="vertical"></el-divider>
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-data-analysis content-title-item-icon"></i>
              <span class="content-title-item-header">{{header2}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row> <!-- Select Sprint and People -->
          <el-col :span="24" class="content-main-col" style="margin-bottom:0 !important">
            <el-card class="box-card" shadow="hover">
              <el-row>
                <el-col :span="1" :lg="6">&nbsp;</el-col>
                <el-col :span="11" :lg="6">
                  <span><i class="el-icon-data-line"></i> Sprint</span>
                  <el-select @change="getPeopleListBySprint" v-model="sprintSelect" style="width: 72%;margin-left: 5px;">
                    <el-option label=" " value=""></el-option>
                    <el-option v-for="(sprint, index) in sprintsList" :key="index" :label="sprint.sprintName" :value="sprint.sprintId">
                      <span style="float: left; margin-right:20px">{{sprint.sprintName}}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">{{sprint.sprintLeader}}</span>
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="11" :lg="6">
                  <span><i class="el-icon-user"></i> People</span>
                  <el-select @change="getTimesheet" :disabled="disabledPeopleList" v-model="peopleSelect" style="width: 72%;margin-left: 5px;" filterable clearable>
                    <el-option label=" " value=""></el-option>
                    <el-option v-for="(people, index) in peopleList" :key="index" :label="people.sprintUserName" :value="people.sprintUserId">
                      <span style="float: left; margin-right:20px">{{people.sprintUserName}} ({{people.sprintUserNickname}})</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{people.sprintUserLevel}}</span>
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="content-main-col">
            <timesheet v-if="showTimesheet" :timesheetObj="timesheetObj"></timesheet>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
import Timesheet from './TimesheetPlugins/Timesheet'
export default {
  name: 'PrjTimesheet',
  components: {
    Timesheet
  },
  data () {
    return {
      header1: 'My Timesheet',
      header2: 'Project Timesheet',
      isActive: true,
      headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      sprintSelect: null,
      sprintsList: [],
      peopleSelect: null,
      peopleList: [],
      disabledPeopleList: true,
      showTimesheet: false,
      timesheetObj: {
        timesheetUserId: 0,
        timesheetStartDate: null,
        timesheetEndDate: null
      }
    }
  },
  watch: {
    sprintSelect: {
      handler (val, oldVal) {
        var sprintSelect = val
        if (sprintSelect != null && sprintSelect != '') {
          this.$data.disabledPeopleList = false
        } else {
          this.$data.disabledPeopleList = true
        }
      },
      immediate: true,
      deep: true
    },
    peopleSelect: {
      handler (val, oldVal) {
        var peopleSelect = val
        if (peopleSelect != null && peopleSelect != '') {
          this.$data.showTimesheet = true
        } else {
          this.$data.showTimesheet = false
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    switchToMT () {
      this.$data.isActive = false
      this.$router.push({path: 'MyTimesheet'})
    },
    async getActiveSprintsList () {
      var res = await http.get('/sprints/getActiveSprintsList')
      if (res != null && res.data.status == 0) {
        this.$data.sprintsList = res.data.data
      } else {
        this.$data.sprintsList = []
      }
    },
    async getPeopleListBySprint () {
      this.$data.peopleSelect = null
      this.$data.peopleList = []
      var requestSprintId = this.$data.sprintSelect
      var res = await http.get('/sprints/getSprintUsersById', {
        reqSprintId: requestSprintId
      })
      if (res != null && res.data.status == 0) {
        this.$data.peopleList = res.data.data.sprintUsers
      }
    },
    async getTimesheet () {
      var sprintIndex = this.getIndexOfValueInArr(this.$data.sprintsList, 'sprintId', this.$data.sprintSelect)
      var timesheetStartTime = null
      var timesheetEndTime = null
      if (sprintIndex != -1) {
        timesheetStartTime = this.$data.sprintsList[sprintIndex].sprintStartTime
        timesheetEndTime = this.$data.sprintsList[sprintIndex].sprintEndTime
      }
      if (timesheetStartTime != null && timesheetEndTime != null) {
        this.$data.timesheetObj = {
          type: 'PrjTimesheet',
          timesheetUserId: this.$data.peopleSelect,
          timesheetStartDate: timesheetStartTime,
          timesheetEndDate: timesheetEndTime,
          date: new Date()
        }
      }
    },
    // Common Method
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
    }
  },
  created () {
    this.getActiveSprintsList()
  }
}
</script>

<style scoped>
.pt-body {
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
/* Main style*/
.content-main-col {
  margin-top: 10px;
  margin-bottom: 30px;
}
/*Common Style*/
.bg-color {
  background-color: #eccc68;
}
.active {
  color: #ff6348;
  border-bottom: 1px solid #ff6348;
  cursor: default;
}
</style>
<style>
</style>
