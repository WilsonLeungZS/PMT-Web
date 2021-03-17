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
        <el-row> <!-- Select Sprint -->
          <el-col :span="24" class="content-main-col" style="margin-bottom:0 !important">
            <el-card class="box-card" shadow="hover">
              <el-row>
                <el-col :span="10" :lg="10">
                  <span><i class="el-icon-data-line"></i> Sprint</span>
                  <el-select @change="getDailyScrum" v-model="sprintSelect" style="width: 80%; margin-left: 5px;">
                    <el-option label="No Select" value=""></el-option>
                    <el-option-group v-for="(sprintGroup, index) in sprintsList" :key="index" :label="sprintGroup.Label">
                      <el-option v-for="(sprint, index) in sprintGroup.Options" :key="index" :label="'【' + sprintGroup.Label + '】' +sprint.sprintName" :value="sprint.sprintId">
                        <span style="float: left; margin-right:20px">{{sprint.sprintName}}</span>
                        <span style="float: right; color: #8492a6; font-size: 12px">{{sprint.sprintLeader}}</span>
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-col>
                <el-col :span="14" :lg="14">
                  <sprint-progress v-if="showProgress" :sprintObj="sprintObj"></sprint-progress>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row v-if="showContent" class="prj-timesheet-content" :gutter="5">
          <el-col :span="15">
            <el-card class="box-card" shadow="never">
              <el-row>
                <el-col :span="24" class="content-main-col">
                  <timesheet v-if="showTimesheet" :timesheetObj="timesheetObj"></timesheet>
                </el-col>
              </el-row>
              <el-row v-if="showTaskTable">
                <el-col :span="24" class="content-main-col" style="padding: 0 5px;">
                  <el-divider content-position="center"><b>Selected Sprint Tasks</b></el-divider>
                  <task-table :taskTableObj="taskTableObj"></task-table>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="9">
            <el-card class="box-card" shadow="never">
              <el-row>
                <el-col :span="24">
                  <el-table @row-click="clickPeopleToGetTimesheet" v-loading="peopleListLoading" :data="peopleList" :row-class-name="highlightLeaderRow" :row-style="{'cursor': 'pointer'}" width="100%" max-height="680px" highlight-current-row class="prj-timesheet-content-table">
                    <el-table-column v-if="false" prop="sprintId" label="SprintId" align="center"></el-table-column>
                    <el-table-column v-if="false" prop="sprintUserId" label="UserId" align="center"></el-table-column>
                    <el-table-column prop="sprintUserFullName" label="Name" align="left" min-width="240" fixed="left">
                      <template slot="header" slot-scope="scope">
                        <span><i class="el-icon-date"></i> Date</span>
                        <el-select @change="getDailyScrum" v-model="dateSelect" placeholder="Select Date..." style="margin-left: 10px; width: 70%;" size="small">
                          <el-option v-for="(date, index) in dateRange" :key="index" :label="date" :value="date"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="sprintUserLevel" label="Level" align="center" width="80"></el-table-column>
                    <el-table-column prop="sprintUserCapacity" label="Capacity" align="center" width="80"></el-table-column>
                    <el-table-column prop="sprintDailyScrumUserCompletion" label="Completion" align="center" width="135">
                      <template slot-scope="scope">
                        <div @click.stop="stopClick">
                          <el-checkbox v-if="scope.row.sprintDailyScrumUserCompletion"  :disabled="userRole != 'Admin'? true: false" v-model="scope.row.sprintDailyScrumUserCompletion" label="Completed" border size="mini" style="padding:4px 6px" class="prj-timesheet-content-table-checkbox-checked"></el-checkbox>
                          <el-checkbox v-if="!scope.row.sprintDailyScrumUserCompletion" :disabled="userRole != 'Admin'? true: false" v-model="scope.row.sprintDailyScrumUserCompletion" label="Incomplete" border size="mini" style="padding:4px 6px" class="prj-timesheet-content-table-checkbox-not-check"></el-checkbox>
                          </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sprintDailyScrumUserAttendance" label="Attendance" align="center" width="140">
                      <template slot-scope="scope">
                        <div @click.stop="stopClick">
                          <el-dropdown v-if="scope.row.sprintDailyScrumUserAttendance == 'Attend' || scope.row.sprintDailyScrumUserAttendance == 'Attend (Late)'" @command="changeAttendance" trigger="click">
                            <el-button type="success" size="mini">{{scope.row.sprintDailyScrumUserAttendance}}</el-button>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item v-for="(attendanceOption, index) in attendanceOptions" :key="index" :command="beforeHandleCommand(attendanceOption.Value ,scope.row)">{{attendanceOption.Label}}</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                          <el-dropdown v-if="scope.row.sprintDailyScrumUserAttendance == 'Leave' || scope.row.sprintDailyScrumUserAttendance == 'Optional'" @command="changeAttendance" trigger="click">
                            <el-button type="info" size="mini">{{scope.row.sprintDailyScrumUserAttendance}}</el-button>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item v-for="(attendanceOption, index) in attendanceOptions" :key="index" :command="beforeHandleCommand(attendanceOption.Value ,scope.row)">{{attendanceOption.Label}}</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                          <el-dropdown v-if="scope.row.sprintDailyScrumUserAttendance == 'Absent'" @command="changeAttendance" trigger="click">
                            <el-button type="danger" size="mini">{{scope.row.sprintDailyScrumUserAttendance}}</el-button>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item v-for="(attendanceOption, index) in attendanceOptions" :key="index" :command="beforeHandleCommand(attendanceOption.Value ,scope.row)">{{attendanceOption.Label}}</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
                <el-col :span="24">
                  <el-button v-if="userRole == 'Admin' && peopleList != null && peopleList.length > 0" @click="saveDailyScrum" type="primary" size="small" style="width: 100%; margin-top: 10px">Save</el-button>
                </el-col>
              </el-row>
            </el-card>
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
import TaskTable from '../Task/TaskPlugins/TaskTable'
import SprintProgress from '../Sprint/SprintPlugins/SprintProgress'
export default {
  name: 'PrjTimesheet',
  components: {
    Timesheet,
    TaskTable,
    SprintProgress
  },
  data () {
    return {
      header1: 'My Timesheet',
      header2: 'Project Timesheet',
      isActive: true,
      headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      userRole: this.$store.getters.getUserRole,
      sprintSelect: null,
      sprintsList: [],
      peopleSelect: null,
      peopleList: [],
      peopleListLoading: false,
      showContent: false,
      showTimesheet: false,
      showTaskTable: false,
      showProgress: false,
      timesheetObj: {
        timesheetUserId: 0,
        timesheetStartDate: null,
        timesheetEndDate: null
      },
      taskTableObj: {
        taskTableUserId: null,
        taskTableDate: null
      },
      dateRange: [],
      dateSelect: null,
      attendanceOptions: [
        {Label: 'Attend', Value: 'Attend'},
        {Label: 'Attend (Late)', Value: 'Attend (Late)'},
        {Label: 'Leave', Value: 'Leave'},
        {Label: 'Optional', Value: 'Optional'},
        {Label: 'Absent', Value: 'Absent'},
      ],
      sprintObj: null
    }
  },
  watch: {
    sprintSelect: {
      handler (val, oldVal) {
        var sprintSelect = val
        if (sprintSelect != null && sprintSelect != '') {
          this.$data.showContent = true
          this.$data.showTimesheet = true
          this.$data.showProgress = true
        } else {
          this.$data.showContent = false
          this.$data.showTimesheet = false
          this.$data.showProgress = false
        }
      },
      immediate: true,
      deep: true
    },
    peopleSelect: {
      handler (val, oldVal) {
        var peopleSelect = val
        if (peopleSelect != null && peopleSelect != '') {
          this.$data.showTaskTable = true
        } else {
          this.$data.showTaskTable = false
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
        this.$data.sprintsList = this.sortListBySprintTimeGroup(res.data.data)
      } else {
        this.$data.sprintsList = []
      }
      // this.$data.dateSelect = this.formatDate(new Date(), 'yyyy-MM-dd')
    },
    clickPeopleToGetTimesheet (row, column, event) {
      this.$data.peopleSelect = row.sprintUserId
      this.getTimesheet()
    },
    async getTimesheet () {
      var sprintList = this.$data.sprintsList
      var sprintIndex = -1
      var targetSprintList = []
      if (sprintList != null && sprintList.length > 0) {
        for (var i=0; i<sprintList.length; i++) {
          sprintIndex = this.getIndexOfValueInArr(sprintList[i].Options, 'sprintId', this.$data.sprintSelect)
          if (sprintIndex != -1) {
            targetSprintList = sprintList[i].Options
            break;
          }
        }
      }
      var timesheetStartTime = null
      var timesheetEndTime = null
      if (sprintIndex != -1) {
        timesheetStartTime = targetSprintList[sprintIndex].sprintStartTime
        timesheetEndTime = targetSprintList[sprintIndex].sprintEndTime
      }
      if (timesheetStartTime != null && timesheetEndTime != null) {
        this.$data.timesheetObj = {
          type: 'PrjTimesheet',
          timesheetUserId: this.$data.peopleSelect,
          timesheetStartDate: timesheetStartTime,
          timesheetEndDate: timesheetEndTime,
          date: new Date()
        }
        if (this.$data.peopleSelect != null) {
          this.getTaskTable(this.$data.peopleSelect, timesheetStartTime)
        }
      } else {
        this.$message({message: 'Invalid Sprint!', type: 'error'})
      }
    },
    getTaskTable (iUserId, iDate) {
      this.$data.taskTableObj = {
        taskTableSource: 'PrjTimesheet',
        taskTableUserId: iUserId,
        taskTableDate: iDate,
        date: new Date().getTime()
      }
    },
    // People list Method
    highlightLeaderRow ({row, rowIndex}) {
      if (rowIndex === 0) {
        return 'highlight-leader-row'
      }
      if (row != null && row.sprintDailyScrumUserAttendance == 'Optional') {
        return 'optional-user-row'
      }
      return ''
    },
    getDailyScrum () {
      var sprintList = this.$data.sprintsList
      var sprintIndex = -1
      var targetSprintList = []
      var sprintStartTime = null
      var sprintEndTime = null
      if (sprintList != null && sprintList.length > 0) {
        for (var i=0; i<sprintList.length; i++) {
          sprintIndex = this.getIndexOfValueInArr(sprintList[i].Options, 'sprintId', this.$data.sprintSelect)
          if (sprintIndex != -1) {
            targetSprintList = sprintList[i].Options
            break;
          }
        }
      }
      if (sprintIndex != -1) {
        sprintStartTime = targetSprintList[sprintIndex].sprintStartTime
        sprintEndTime = targetSprintList[sprintIndex].sprintEndTime
      }
      this.getSprintDateRange(sprintStartTime, sprintEndTime)
      // Show sprint progress
      this.$data.sprintObj = {
        sprintId: this.$data.sprintSelect,
        sprintStartTime: sprintStartTime,
        sprintEndTime: sprintEndTime,
        date: new Date()
      }
    },
    async getSprintDateRange (iStartDate, iEndDate) {
      this.$data.dateRange = []
      var sprintStartDate = iStartDate
      var sprintEndDate = iEndDate
      if (sprintStartDate != null && sprintEndDate != null) {
        var res = await http.get('https://ipo.gzatcc.com/api/others/workdays', {
          start_date: sprintStartDate,
          end_date: sprintEndDate,
        })
        if (res != null && res.data != null != null) {
          this.$data.dateRange = res.data.workday_list
        }
      }
      if (this.$data.dateSelect == null || this.$data.dateSelect == '') {
        this.$data.dateSelect = iStartDate
        var curDay = this.formatDate(new Date(), 'yyyy-MM-dd')
        if (this.$data.dateRange != null && this.$data.dateRange.length > 0) {
          if (this.$data.dateRange.indexOf(curDay) != -1) {
            this.$data.dateSelect = curDay
          }
        }
      }
      if (this.$data.dateSelect < iStartDate || this.$data.dateSelect > iEndDate) {
        this.$data.dateSelect = iStartDate
      }
      this.getPeopleListBySprint()
    },
    async getPeopleListBySprint () {
      this.$data.peopleListLoading = true
      this.$data.peopleSelect = null
      this.$data.timesheetObj = {
        type: 'PrjTimesheet',
        timesheetUserId: 0,
        timesheetStartDate: null,
        timesheetEndDate: null,
        date: new Date()
      }
      this.$data.peopleList = []
      var requestSprintId = this.$data.sprintSelect
      var requestDate = this.$data.dateSelect
      var res = await http.get('/sprints/getSprintUsersById', {
        reqSprintId: requestSprintId,
        reqScrumDate: requestDate
      })
      if (res != null && res.data.status == 0) {
        this.$data.peopleList = res.data.data.sprintUsers
      }
      this.$data.peopleListLoading = false
    },
    changeAttendance (command) {
      console.log('changeAttendance --> ', command)
      var rowRecord = command.row
      var attendanceStatus = command.command
      rowRecord.sprintDailyScrumUserAttendance = attendanceStatus
    },
    beforeHandleCommand(item, row){
      return {
        'command': item,
        'row': row
      }
    },
    async saveDailyScrum () {
      var scrumList = this.$data.peopleList
      var dateSelect = this.$data.dateSelect
      if (dateSelect == '' || dateSelect == null || dateSelect == undefined) {
        this.$message.error('Invalid Date!');
        return
      }
      if (scrumList == '' || scrumList == null || scrumList == undefined) {
        this.$message.error('Invalid List!');
        return
      }
      var sprintSelect = this.$data.sprintSelect
      var res = await http.post('/sprints/updateDailyScrum', {
        reqSprintId: sprintSelect,
        reqScrumDate: dateSelect,
        reqScrumList: JSON.stringify(scrumList)
      })
      if (res.data != null && res.data.status == 0) {
        this.$message({
          message: 'Save Daily Scrum Successfully!',
          type: 'success'
        });
        this.getDailyScrum()
      }
    },
    // Common Method
    sortListBySprintTimeGroup (iSprintList) {
      var result = []
      if (iSprintList != null && iSprintList.length > 0) {
        for (var i=0; i<iSprintList.length; i++) {
          var timeGroup = iSprintList[i].sprintTimeGroup
          var index = this.getIndexOfValueInArr(result, 'Label', timeGroup)
          if (index == -1) {
            result.push({
              Label: timeGroup,
              Options: [iSprintList[i]]
            })
          } else {
            result[index].Options.push(iSprintList[i])
          }
        }
      }
      return result
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
    },
    stopClick () {
      return
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
  width: 100%;
}
.prj-timesheet-content {
 margin: 10px 0;
}
.prj-timesheet-content>>>.el-card__body {
  padding: 5px;
}
.prj-timesheet-content>>>.el-table td {
  padding: 8px 0;
}
.prj-timesheet-content>>>.el-table th {
  padding: 5px 0;
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
.el-table .highlight-leader-row {
  background: #fff9c4;
}
.el-table .optional-user-row {
  background: #eeeeee;
}
.prj-timesheet-content-table-checkbox-checked .el-checkbox__input.is-disabled+span.el-checkbox__label {
  color: #409EFF;
}
.prj-timesheet-content-table-checkbox-not-check .el-checkbox__input.is-disabled+span.el-checkbox__label {
  color: #606266;
}
.prj-timesheet-content-table .el-table .cell, .el-table th div .el-table .cell, .el-table th div {
  padding-right: 0;
  overflow: unset;
}
</style>
