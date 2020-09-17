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
        <el-row>
          <el-col :span="24" class="content-main-col" style="margin-bottom:0 !important">
            <el-card class="box-card" shadow="hover">
              <el-row :gutter="10" justify="center" align="middle">
                <el-col :offset="7" :span="6">
                  <el-select v-model="userSelect" placeholder="Select" multiple collapse-tags filterable clearable @clear="clearUserList" style="width: 100%; float: right;">
                    <el-option v-for="user in users" :key="user.user_eid" :label="user.user_eid" :value="user.user_id">
                      <span style="float: left; margin-right:20px">{{ user.user_eid }}</span>
                      <span style="float: right; color: #8492a6; margin-right:25px; font-size: 12px">Level - {{ user.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <el-date-picker v-model="monthSelect" type="month" placeholder="Select" @change="changePtMonth" style="width: 100%"></el-date-picker>
                </el-col>
                <el-col :span="1">
                  <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white', 'width': '100%'}" icon="el-icon-arrow-right" @click="showTeamTimesheet"></el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="content-main-col" v-for="(timesheet, tIndex) in timesheetDatas" :key="tIndex" >
            <el-table max-height="408" :data="timesheet.timesheetData" fit empty-text="No worklog" class="pt-table" show-summary :summary-method="getSummaries" :header-cell-style="{'background-color': headerColor}"
              :row-class-name="ptTableRowStyle" :cell-class-name="ptTableCellStyle"
              :header-row-class-name="ptTableHeaderRowStyle" :header-cell-class-name="ptTableHeaderCellStyle" >
              <el-table-column prop="task_id" label="Id" v-if="false"></el-table-column>
              <el-table-column prop="task" align="left" :show-overflow-tooltip="true" min-width="240">
                <template slot="header" slot-scope="scope">
                  <div class="pt-table-user">
                    <el-tag style="margin-right: 10px; color: #2980b9">{{timesheet.user}}</el-tag>
                    <span><b>Timesheet</b></span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-for="(timesheetHeader, index) in timesheetHeaders" :key="index" :prop="timesheetHeader.prop" :label="timesheetHeader.label"
                align="center" min-width="45" :class-name="changeCol(timesheetHeader.is_weekday, timesheetHeader.is_today)">
                <template slot="header" slot-scope="scope">
                  <span style="font-size:16px; cursor:default;">{{scope.column.label}}</span>
                </template>
                <template slot-scope="scope">
                  <span style="font-size: 12px">{{scope.row[scope.column.property] || '--'}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- Only show past 15 days worklogs -->
        <el-row>
          <el-col :span="24" class="content-main-col" v-for="(timesheet, tIndex) in timesheetPastDaysDatas" :key="tIndex" >
            <el-table max-height="408" :data="timesheet.timesheetData" fit empty-text="No worklog" class="pt-table" show-summary :summary-method="getSummaries" :header-cell-style="{'background-color': headerColor}"
              :row-class-name="ptTableRowStyle" :cell-class-name="ptTableCellStyle"
              :header-row-class-name="ptTableHeaderRowStyle" :header-cell-class-name="ptTablePastDaysHeaderCellStyle" >
              <el-table-column prop="task_id" label="Id" v-if="false"></el-table-column>
              <el-table-column prop="task" align="left" :show-overflow-tooltip="true" min-width="260">
                <template slot="header" slot-scope="scope">
                  <div class="pt-table-user">
                    <span><b>Timesheet</b> for </span>
                    <el-tag style="margin-left: 10px; color: #2980b9">{{timesheet.user}}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="task_status" label="Status" align="left" width="100"></el-table-column>
              <el-table-column prop="task_progress" label="Progress" align="left" width="130"></el-table-column>
              <el-table-column prop="task_time_group" label="Time Group" align="left" width="150"></el-table-column>
              <el-table-column v-for="(timesheetHeader, index) in timesheetPastDaysHeaders" :key="index" :prop="timesheetHeader.prop" :label="timesheetHeader.label"
                align="center" min-width="40" :class-name="changeCol(timesheetHeader.is_weekday, timesheetHeader.is_today)">
                <template slot="header" slot-scope="scope">
                  <span style="font-size:16px; cursor:default;">{{scope.column.label}}</span>
                </template>
                <template slot-scope="scope">
                  <span style="font-size:16px">{{scope.row[scope.column.property] || '--'}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- End Only show past 15 days worklogs -->
      </el-main>
    </el-container>
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
export default {
  name: 'PrjTimesheet',
  data () {
    return {
      header1: 'My Timesheet',
      header2: 'Project Timesheet',
      isActive: true,
      userSelect: [],
      users: [],
      monthSelect: '',
      timesheetHeaders: [],
      timesheetMonth: '',
      sumHoursArray: [],
      timesheetDatas: [],
      timesheetPastDaysDatas: [],
      timesheetPastDaysHeaders: [],
      headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor
    }
  },
  methods: {
    switchToMT () {
      this.$data.isActive = false
      this.$router.push({path: 'MyTimesheet'})
    },
    ptTableCellStyle ({row, column, rowIndex, columnIndex}) {
      return 'pt-table-cell'
    },
    ptTableRowStyle ({row, rowIndex}) {
      return 'pt-table-row'
    },
    ptTableHeaderCellStyle ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        return 'pt-table-header-cell-weekday'
      } else {
        var isToday = this.$data.timesheetHeaders[columnIndex - 1].is_today
        if (isToday) {
          return 'pt-table-header-cell-today'
        }
        var isWeekday = this.$data.timesheetHeaders[columnIndex - 1].is_weekday
        if (isWeekday) {
          return 'pt-table-header-cell-weekday'
        } else {
          return 'pt-table-header-cell'
        }
      }
    },
    ptTablePastDaysHeaderCellStyle ({row, column, rowIndex, columnIndex}) {
      var ignoreColList = [0, 1, 2, 3]
      if (ignoreColList.indexOf(columnIndex) != -1) {
        return 'pt-table-header-cell-weekday'
      } else {
        var isToday = this.$data.timesheetPastDaysHeaders[columnIndex - ignoreColList.length].is_today
        if (isToday) {
          return 'pt-table-header-cell-today'
        }
        var isWeekday = this.$data.timesheetPastDaysHeaders[columnIndex - ignoreColList.length].is_weekday
        if (isWeekday) {
          return 'pt-table-header-cell-weekday'
        } else {
          return 'pt-table-header-cell'
        }
      }
    },
    ptTableHeaderRowStyle ({row, rowIndex}) {
      return 'pt-table-header-row'
    },
    changeCol (isWeekday, isToday) {
      if(isToday) {
        return 'pt-table-col-today'
      } else {
        if (!isWeekday) {
          return 'pt-table-col-weekday'
        } else {
          return 'pt-table-col-nonweekday'
        }
      }
    },
    changePtMonth (iDate) {
      this.$data.monthSelect = iDate
    },
    async resetTimesheet (iDateVal, iUserList) {
      console.log('Date: ' + iDateVal)
      console.log('Selected User: ' + iUserList)
      if(iUserList.length == 0){
         this.$message.error('Please select user!')
         return
      }
      this.$data.timesheetDatas = []
      var ptYear = iDateVal.getFullYear()
      var ptMonth = iDateVal.getMonth() + 1
      console.log(ptYear, ptMonth)
      if (ptMonth < 10) {
        ptMonth = '0' + ptMonth
      } else {
        ptMonth = '' + ptMonth
      }
      var ptDay = iDateVal.getDay()
      console.log(ptDay)
      var resetArray = []
      var days = 31
      if (ptMonth === '04' || ptMonth === '06' || ptMonth === '09' || ptMonth === '11') {
        days = 30
      }
      if (ptMonth === '02') {
        var leapYear = Number(ptYear) % 4
        if (leapYear === 0) {
          days = 29
        } else {
          days = 28
        }
      }
      console.log(days)
      // Get today
      var currentDay = new Date().getDate()
      var currentMonth = new Date().getMonth() + 1
      // End get today
      for (var i = 1; i <= days; i++) {
        var resetJson = {}
        var val = ''
        if (i < 10) {
          val = '0' + i
        } else {
          val = '' + i
        }
        resetJson.label = val
        resetJson.prop = 'day' + val
        if (ptDay === 6 || ptDay === 0) {
          resetJson.is_weekday = false
        } else {
          resetJson.is_weekday = true
        }
        // Check which day is today
        if ((Number(currentMonth) === Number(ptMonth)) && (Number(currentDay) === Number(i))) {
          resetJson.is_today = true
        } else {
          resetJson.is_today = false
        }
        // Check which day is before today
        if ((Number(currentMonth) >= Number(ptMonth)) && (Number(currentDay) > Number(i))) {
          resetJson.is_beofre_today = true
        } else {
          resetJson.is_beofre_today = false
        }
        resetArray.push(resetJson)
        ptDay++
        if (ptDay === 7) {
          ptDay = 0
        }
      }
      this.$data.timesheetHeaders = resetArray
      console.log('Header', this.$data.timesheetHeaders)
      var reqMonth = ptYear + '-' + ptMonth
      this.$data.monthSelect = reqMonth
      const res = await http.post('/worklogs/getWorklogByUserListAndMonthForWeb', {
        wUserList: iUserList + '',
        wWorklogMonth: reqMonth
      })
      if (res.data.status === 0) {
        this.$data.timesheetDatas = res.data.data
      } else {
        this.$data.timesheetDatas = [{user: 'Empty', timesheetData: []}]
      }
    },
    async resetTimesheetForPastDays (iUserList) {
      console.log('Selected User: ' + iUserList)
      if(iUserList.length == 0){
        this.$message.error('Please select user!')
        return
      }
      // Get today
      var pastDay = 11
      var date = new Date()
      // Test cross month case - start
      date.setDate(date.getDate() - 10) 
      // Test cross month case - end
      var currentMonth = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0')
      console.log(date, 'Current Month: ' + currentMonth)
      var reqWorklogMonth = []
      var worklogDays = []
      var worklogIsWeekday = []
      // start to loop generate tomorrow, today and last 9 days
      date.setDate(date.getDate() + 1)
      for (let i = 0; i < pastDay; i++) {
        var ptYear = date.getFullYear()
        var ptMonth = date.getMonth() + 1
        var reqMonth = ptYear + '-' + ptMonth.toString().padStart(2, '0')
        if (reqWorklogMonth != null) {
          reqWorklogMonth.push(reqMonth)
        }
        worklogDays.push(date.getDate().toString().padStart(2, '0'))
        if (date.getDay() == 6 || date.getDay() == 0 ){
          worklogIsWeekday.push(false)
        } else {
          worklogIsWeekday.push(true)
        }
        date.setDate(date.getDate() - 1)
      }
      reqWorklogMonth = reqWorklogMonth.reverse()
      console.log('Worklogs month array: ', reqWorklogMonth)
      worklogDays = worklogDays.reverse()
      console.log('Worklogs dates array: ', worklogDays)
      worklogIsWeekday = worklogIsWeekday.reverse()
      console.log('Worklogs dates is weekday: ', worklogIsWeekday)
      this.$data.timesheetPastDaysDatas = []
      var resetArray = []
      // End get today
      for (let i = 0; i < worklogDays.length; i++) {
        var resetJson = {}
        resetJson.label = worklogDays[i]
        resetJson.prop = 'day' + worklogDays[i]
        resetJson.is_weekday = worklogIsWeekday[i]
        if (i == (worklogDays.length - 2)) {
          resetJson.is_today = true
        } else {
          resetJson.is_today = false
        }
        resetArray.push(resetJson)
      }
      this.$data.timesheetPastDaysHeaders = resetArray
      // Start to get each month record (if cross 11 days, only max 2 months)
      var currentMonthDate = []
      var otherMonth = ''
      var otherMonthDate = []
      for(let i = 0; i<reqWorklogMonth.length; i++) {
        if(reqWorklogMonth[i] == currentMonth) {
          currentMonthDate.push(worklogDays[i])
        } else {
          otherMonth = reqWorklogMonth[i]
          otherMonthDate.push(worklogDays[i])
        }
      }
      console.log(currentMonth, currentMonthDate)
      console.log(otherMonth, otherMonthDate)
      this.$data.timesheetPastDaysDatas = [{user: 'Empty', timesheetData: []}]
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Total Hours'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (sums[index] < 8) {
            sums[index] = sums[index] + '-'
          }
          if (sums[index] > 9) {
            sums[index] = sums[index] + '+'
          }
        } else {
          sums[index] = '0'
        }
        if(sums[index] == '0') {
          let isWeekday = this.$data.timesheetHeaders[index - 1].is_weekday
          let isBeforeToday = this.$data.timesheetHeaders[index - 1].is_beofre_today
          if(isWeekday && isBeforeToday) {
            sums[index] = '0-'
          }
        }
      })
      this.$data.sumHoursArray = sums
      return sums
    },
    showTeamTimesheet () {
      var date = new Date(this.$data.monthSelect)
      var userList = this.$data.userSelect
      this.resetTimesheet(date, userList)
      //this.resetTimesheetForPastDays(userList)
    },
    async getActiveUserList () {
      const res1 = await http.get('/users/getUserListOrderByLevelDesc', {
        IsActive: 1
      })
      if (res1.data.status === 0) {
        var userList1 = res1.data.data
        this.$data.users = []
        for (var f = 0; f < userList1.length; f++) {
          if (userList1[f].user_level > 0) {
            if (userList1[f].user_nickname !== null && userList1[f].user_nickname !== '') {
              userList1[f].user_eid = userList1[f].user_eid + ' (' + userList1[f].user_nickname + ')'
            }
            this.$data.users.push(userList1[f])
          }
        }
      }
    },
    clearUserList() {
      this.$data.timesheetDatas = []
    },
    getCurrentMonthFirst () {
      var date = new Date()
      date.setDate(1)
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      var firstDate = new Date(date.getFullYear(), month - 1, day)
      return firstDate
    }
  },
  created () {
    console.log('Created Project Timesheet')
    this.$data.monthSelect = this.getCurrentMonthFirst()
    this.getActiveUserList()
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
.pt-table-user {
  height:40px;
  padding-left: 5px;
  padding-right: 5px;
  line-height: 46px;
  font-size: 16px;
  margin: 0 5px;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
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
.pt-table {
  width: 100%;
}
.pt-table-header-row {
  height: 40px;
}
.pt-table-header-cell-weekday {
  font-size: 13px;
  border-top: 1px solid #f1f2f6;
  padding: 0 !important;
  color: white;
}
.pt-table-header-cell-today {
  font-size: 13px;
  border-top: 1px solid #f1f2f6;
  padding: 0 !important;
  color: #DCE775;
}
.pt-table-header-cell {
  font-size: 13px;
  border-top: 1px solid #f1f2f6;
  padding: 0 !important;
  color: #2f3542;
}
.pt-table-row {
  height: 40px;
}
.pt-table-cell {
  font-size: 13px;
  padding: 0 !important;
  border: 1px solid #f1f2f6;
}
.pt-table-col-weekday {
  background-color: #ced6e0;
}
.pt-table-col-today {
  background-color: #DCE775;
}
.pt-table-col-nonweekday {
  background-color: white;
}
.pt-worklog-form {
  text-align: left;
}
.el-textarea .el-textarea__inner {
  resize: none;
}
.el-form-item {
  margin-bottom: 12px;
}
.el-dialog__body {
  padding: 10px 20px;
}
.el-dialog__footer {
  padding: 10px;
}
.el-table__footer-wrapper tbody td {
  color: #747d8c;
  border: 1px solid #f1f2f6;
  padding: 10px 0;
  font-weight: bold;
}
.pt-table .el-table__footer-wrapper tbody td {
  font-size: 12px;
}
</style>
