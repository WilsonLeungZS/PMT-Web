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
            <el-card class="box-card pt-title" shadow="hover">
              <el-row :gutter="20">
                <el-col :span="11" class="pt-title-item">
                  <el-select v-model="teamSelect" placeholder="Select">
                    <el-option v-for="team in teams" :key="team.team_name" :label="team.team_label" :value="team.team_name"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="11" class="pt-title-item">
                  <el-date-picker v-model="monthSelect" type="month" placeholder="Select"
                    @change="changePtMonth"></el-date-picker>
                </el-col>
                <el-col :span="2" class="pt-title-item">
                  <el-button type="success" icon="el-icon-arrow-right" circle></el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="content-main-col"
            v-for="(timesheet, tIndex) in timesheetDatas" :key="tIndex" >
            <el-table :data="timesheet.timesheetData" fit empty-text="No worklog" class="pt-table" show-summary :summary-method="getSummaries"
              :row-class-name="ptTableRowStyle" :cell-class-name="ptTableCellStyle"
              :header-row-class-name="ptTableHeaderRowStyle" :header-cell-class-name="ptTableHeaderCellStyle" >
              <el-table-column prop="task_id" label="Id" v-if="false"></el-table-column>
              <el-table-column prop="task" align="left" :show-overflow-tooltip="true" min-width="260">
                <template slot="header" slot-scope="scope">
                  <div class="pt-table-user">
                    <span><b>Timesheet</b> for </span>
                    <el-tag style="margin-left: 10px; color: #2980b9">{{timesheet.user}}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-for="(timesheetHeader, index) in timesheetHeaders" :key="index" :prop="timesheetHeader.prop" :label="timesheetHeader.label"
                align="center" min-width="40" :class-name="changeCol(timesheetHeader.is_weekday)">
                <template slot="header" slot-scope="scope">
                  <span style="font-size:16px; cursor:default;">{{scope.column.label}}</span>
                </template>
                <template slot-scope="scope">
                  <span>{{scope.row[scope.column.property] || '--'}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'PrjTimesheet',
  data () {
    return {
      header1: 'My Timesheet',
      header2: 'Project Timesheet',
      isActive: true,
      teamSelect: '',
      teams: [{team_name: 'TOS', team_label: 'TOS'}, {team_name: 'Billing', team_label: 'Billing'}, {team_name: 'BSS', team_label: 'BSS'}],
      monthSelect: '',
      timesheetHeaders: [],
      timesheetMonth: '',
      sumHoursArray: [],
      timesheetDatas: [{team: 'TOS',
        user: 'zhongshu.liang',
        month: '2019-07',
        timesheetData: [
          {task_id: 1, task: 'CGM190071 - ERO report help to generated for ', day01: '1', day02: '8'},
          {task_id: 2, task: 'INC890012', day01: '0'},
          {task_id: 1, task: 'CGM190071 - ERO report help to generated for ', day01: '1', day02: '8'},
          {task_id: 2, task: 'INC890012', day01: '0'},
          {task_id: 1, task: 'CGM190071 - ERO report help to generated for ', day01: '1', day02: '8'},
          {task_id: 2, task: 'INC890012', day01: '4'}
        ]}, {
        team: 'TOS',
        user: 'zefeng.wu',
        month: '2019-07',
        timesheetData: [
          {task_id: 1, task: 'CGM190071 - ERO report help to generated for ', day01: '1', day02: '8'},
          {task_id: 2, task: 'INC890012', day01: '1'},
          {task_id: 1, task: 'CGM190071 - ERO report help to generated for ', day01: '1', day02: '8'}
        ]}, {
        team: 'TOS',
        user: 'zefeng.wu',
        month: '2019-07',
        timesheetData: [
          {task_id: 1, task: 'CGM190071 - ERO report help to generated for ', day01: '1', day02: '8'},
          {task_id: 2, task: 'INC890012', day01: '1'},
          {task_id: 1, task: 'CGM190071 - ERO report help to generated for ', day01: '1', day02: '8'}
        ]}, {
        team: 'TOS',
        user: 'Jason.junxin.he',
        month: '2019-07',
        timesheetData: [
          {task_id: 1, task: 'CGM190071 - ERO report help to generated for ', day01: '1', day02: '8'},
          {task_id: 2, task: 'INC890012', day01: '1'},
          {task_id: 1, task: 'CGM190071 - ERO report help to generated for ', day01: '1', day02: '8'}
        ]}
      ]
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
        var isWeekday = this.$data.timesheetHeaders[columnIndex - 1].is_weekday
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
    changeCol (isWeekday) {
      if (!isWeekday) {
        return 'pt-table-col-weekday'
      } else {
        return 'pt-table-col-nonweekday'
      }
    },
    changePtMonth (iDate) {
      this.resetTimesheet(iDate)
    },
    resetTimesheet (iDateVal) {
      var ptYear = iDateVal.getFullYear()
      var ptMonth = iDateVal.getMonth() + 1
      if (ptMonth < 10) {
        ptMonth = '0' + ptMonth
      } else {
        ptMonth = '' + ptMonth
      }
      var ptDay = iDateVal.getDay()
      var resetArray = []
      var days = 31
      if (ptMonth === '02' || ptMonth === '04' || ptMonth === '06' || ptMonth === '09' || ptMonth === '11') {
        days = 30
      }
      console.log('Month[' + ptMonth + '] days: ' + days)
      console.log('Week: ' + ptDay)
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
        resetArray.push(resetJson)
        ptDay++
        if (ptDay === 7) {
          ptDay = 0
        }
      }
      this.$data.timesheetHeaders = resetArray
      this.$data.monthSelect = ptYear + '-' + ptMonth
    },
    getCurrentMonthFirst () {
      var date = new Date()
      date.setDate(1)
      var month = parseInt(date.getMonth() + 1)
      console.log('Month: ' + month)
      var day = date.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      var firstDate = new Date(date.getFullYear(), month - 1, day)
      return firstDate
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
          /* if (sums[index] < 10) {
            sums[index] = '0' + sums[index]
          } */
        } else {
          sums[index] = '0'
        }
      })
      this.$data.sumHoursArray = sums
      console.log(sums)
      return sums
    }
  },
  created () {
    console.log('Created Project Timesheet')
    var firstDate = this.getCurrentMonthFirst()
    this.resetTimesheet(firstDate)
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
.pt-title {
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pt-title-item {
  width: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 18px;
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
  background-color: #2980b9 !important;
  color: white;
}
.pt-table-header-cell {
  font-size: 13px;
  border-top: 1px solid #f1f2f6;
  padding: 0 !important;
  background-color: #2980b9 !important;
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
</style>
