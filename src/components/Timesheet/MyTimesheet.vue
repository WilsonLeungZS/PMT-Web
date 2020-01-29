<template>
  <div class="mt-body">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-date content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
            <el-divider direction="vertical"></el-divider>
            <div class="content-title-item " @click="switchToPT">
              <i class="el-icon-data-analysis content-title-item-icon"></i>
              <span class="content-title-item-header">{{header2}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="content-main-col">
            <el-table :data="timesheetData" fit empty-text="No worklog" class="mt-table" show-summary :summary-method="getSummaries" :header-cell-style="{'background-color': headerColor}"
              :row-class-name="mtTableRowStyle" :cell-class-name="mtTableCellStyle"
              :header-row-class-name="mtTableHeaderRowStyle" :header-cell-class-name="mtTableHeaderCellStyle" >
              <el-table-column prop="task_id" label="Id" v-if="false"></el-table-column>
              <el-table-column prop="task" align="left" :show-overflow-tooltip="true" min-width="260">
                <template slot="header" slot-scope="scope">
                   <el-date-picker v-model="timesheetMonth" type="month" size="small" format="yyyy-MM" :clearable="false"
                    class="mt-table-month-picker" @change="changeMTMonth"></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column v-for="(timesheetHeader, index) in timesheetHeaders" :key="index" :prop="timesheetHeader.prop" :label="timesheetHeader.label"
                align="center" min-width="40" :class-name="changeCol(timesheetHeader.is_weekday)">
                <template slot="header" slot-scope="scope">
                  <span @click="editTimesheetByDate(scope)" style="font-size:16px; text-decoration:underline; cursor:pointer;">{{scope.column.label}}</span>
                </template>
                <template slot-scope="scope">
                  <el-button style="font-size:16px" type="text" @click="editTimesheetByTask(scope)">{{scope.row[scope.column.property] || '--'}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog title="Edit Worklog" :visible.sync="worklogFormVisible" width="35%" :close-on-click-modal="false">
      <el-form :model="form" label-width="70px" class="mt-worklog-form">
        <el-form-item label="Task" >
          <el-autocomplete style="width:100%" :trigger-on-focus="false" popper-class="task-autocomplete" :clearable="true"
            v-model="form.worklog_task" :fetch-suggestions="queryTaskAsync" @select="handleTaskSelect" @clear="clearTask">
          <template slot-scope="{ item }">
            <div class="form_list_task_name">{{ item.value }}</div>
            <span class="form_list_task_desc">{{ item.description }}</span>
          </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="Date">
          <el-date-picker v-model="form.worklog_date" type="date" @change="changeWorklogDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="Effort" >
          <el-col :span="5">
            <el-input v-model="form.worklog_effort" @keyup.native="number"></el-input>
          </el-col>
          <el-col :span="5">
            <span style="text-align:center; font-size:16px; margin-left:10px">Hrs</span>
          </el-col>
        </el-form-item>
        <el-form-item label="Remark" >
          <el-input type="textarea" :rows="6" v-model="form.worklog_remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="worklogFormVisible = false">Cancel</el-button>
        <el-button style="color: red;font-weight: bold" v-if="showDeleteBtn" @click="deleteWorklog">Delete</el-button>
        <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" @click="submitWorklog">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
export default {
  name: 'MyTimesheet',
  data () {
    return {
      header1: 'My Timesheet',
      header2: 'Project Timesheet',
      isActive: true,
      timesheetData: [],
      timesheetHeaders: [],
      timesheetMonth: '',
      sumHoursArray: [],
      worklogFormVisible: false,
      taskList: [],
      showDeleteBtn: false,
      form: {
        worklog_taskid: 0,
        worklog_task: '',
        worklog_date: '',
        worklog_effort: 0,
        worklog_remark: ''
      },
      headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor
    }
  },
  methods: {
    switchToPT () {
      this.$data.isActive = false
      this.$router.push({path: 'ProjectTimesheet'})
    },
    mtTableCellStyle ({row, column, rowIndex, columnIndex}) {
      return 'mt-table-cell'
    },
    mtTableRowStyle ({row, rowIndex}) {
      return 'mt-table-row'
    },
    mtTableHeaderCellStyle ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        return 'mt-table-header-cell-weekday'
      } else {
        var isWeekday = this.$data.timesheetHeaders[columnIndex - 1].is_weekday
        if (isWeekday) {
          return 'mt-table-header-cell-weekday'
        } else {
          return 'mt-table-header-cell'
        }
      }
    },
    mtTableHeaderRowStyle ({row, rowIndex}) {
      return 'mt-table-header-row'
    },
    changeCol (isWeekday) {
      if (!isWeekday) {
        return 'mt-table-col-weekday'
      } else {
        return 'mt-table-col-nonweekday'
      }
    },
    changeMTMonth (iDate) {
      console.log('Change month: ' + iDate)
      this.resetTimesheet(iDate)
    },
    async resetTimesheet (iDateVal) {
      this.$data.timesheetData = []
      var mtYear = iDateVal.getFullYear()
      var mtMonth = iDateVal.getMonth() + 1
      if (mtMonth < 10) {
        mtMonth = '0' + mtMonth
      } else {
        mtMonth = '' + mtMonth
      }
      var mtDay = iDateVal.getDay()
      var resetArray = []
      var days = 31
      if (mtMonth === '04' || mtMonth === '06' || mtMonth === '09' || mtMonth === '11') {
        days = 30
      }
      if (mtMonth === '02') {
        var leapYear = Number(mtYear) % 4
        if (leapYear === 0) {
          days = 29
        } else {
          days = 28
        }
      }
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
        if (mtDay === 6 || mtDay === 0) {
          resetJson.is_weekday = false
        } else {
          resetJson.is_weekday = true
        }
        resetArray.push(resetJson)
        mtDay++
        if (mtDay === 7) {
          mtDay = 0
        }
      }
      this.$data.timesheetHeaders = resetArray
      var reqMonth = mtYear + '-' + mtMonth
      this.$data.timesheetMonth = reqMonth
      var reqUserId = this.$store.getters.getUserId
      const res = await http.post('/worklogs/getWorklogByUserAndMonthForWeb', {
        wUserId: reqUserId,
        wWorklogMonth: reqMonth
      })
      if (res.data.status === 0) {
        this.$data.timesheetData = res.data.data
        console.log(res.data.data)
      }
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
        } else {
          sums[index] = '0'
        }
      })
      this.$data.sumHoursArray = sums
      return sums
    },
    // Edit worklog when click the date
    editTimesheetByDate (scope) {
      this.$data.worklogFormVisible = true
      this.$data.showDeleteBtn = false
      this.$data.form.worklog_taskid = 0
      this.$data.form.worklog_task = ''
      this.$data.form.worklog_effort = 0
      this.$data.form.worklog_remark = ''
      this.$data.form.worklog_date = this.$data.timesheetMonth + '-' + scope.column.label
    },
    // Edit worklog when click the day
    async editTimesheetByTask (scope) {
      console.log(scope)
      this.$data.worklogFormVisible = true
      this.$data.showDeleteBtn = false
      this.$data.form.worklog_taskid = 0
      this.$data.form.worklog_task = ''
      this.$data.form.worklog_effort = 0
      this.$data.form.worklog_remark = ''
      this.$data.form.worklog_date = this.$data.timesheetMonth + '-' + scope.column.label
      var reqUserId = this.$store.getters.getUserId
      var reqTaskId = scope.row.task_id
      var reqWorklogMonth = this.$data.timesheetMonth
      var reqWorklogDay = scope.column.label
      const res = await http.post('/worklogs/getWorklogForWeb', {
        wUserId: reqUserId,
        wTaskId: reqTaskId,
        wWorklogMonth: reqWorklogMonth,
        wWorklogDay: reqWorklogDay
      })
      if (res.data.status === 0) {
        this.$data.form.worklog_taskid = res.data.data[0].worklog_task_id
        this.$data.form.worklog_task = res.data.data[0].worklog_task_name
        this.$data.form.worklog_effort = res.data.data[0].worklog_effort
        if (res.data.data[0].worklog_effort > 0) {
          this.$data.showDeleteBtn = true
        }
        this.$data.form.worklog_remark = res.data.data[0].worklog_remark
      } else {
        this.$data.form.worklog_taskid = scope.row.task_id
        this.$data.form.worklog_task = scope.row.task
        this.$data.form.worklog_effort = 0
        this.$data.form.worklog_remark = ''
      }
    },
    clearTask () {
      this.$data.form.worklog_taskid = 0
      this.$data.form.worklog_task = ''
    },
    showWarnMessage (iTitle, iMsg) {
      this.$notify.error({
        title: iTitle,
        message: iMsg,
        duration: 2000,
        showClose: false
      })
    },
    number () {
      var formEffort = this.$data.form.worklog_effort
      if (formEffort > 0) {
        formEffort = Number(formEffort)
      } else {
        formEffort = formEffort.replace(/[^\d]/g, '')
        formEffort = formEffort.replace('.', '')
        this.$data.form.worklog_effort = formEffort
      }
    },
    async queryTaskAsync (queryString, cb) {
      console.log('Query String: ' + queryString)
      var returnArr = []
      const res = await http.post('/tasks/getTaskByName', {
        tTaskName: queryString
      })
      if (res.data.status === 0) {
        var queryResult = res.data.data
        for (var i = 0; i < queryResult.length; i++) {
          var returnJson = {}
          returnJson.value = queryResult[i].task_name
          returnJson.description = queryResult[i].task_desc
          returnJson.id = queryResult[i].task_id
          returnArr.push(returnJson)
        }
      }
      cb(returnArr)
    },
    handleTaskSelect (item) {
      this.$data.form.worklog_taskid = item.id
      this.$data.form.worklog_task = item.value
    },
    async submitWorklog () {
      var reqUserId = this.$store.getters.getUserId
      var reqTaskId = this.$data.form.worklog_taskid
      var reqRemark = this.form.worklog_remark
      var reqWorklogEffort = Number(this.$data.form.worklog_effort)
      var reqWorklogDate = this.$data.form.worklog_date
      console.log('Date: ' + reqWorklogDate)
      console.log('Date Type: ' + typeof (reqWorklogDate))
      if (reqTaskId === 0 || this.$data.form.task_name === '') {
        this.showWarnMessage('Warning', 'Task could not empty!')
        return
      }
      if (reqWorklogDate === '' || reqWorklogDate === null) {
        this.showWarnMessage('Warning', 'Invalid date!')
        return
      }
      var arr = []
      arr = reqWorklogDate.split('-')
      var reqWorklogMonth = arr[0] + '-' + arr[1]
      var reqWorklogDay = arr[2]
      if (reqWorklogEffort <= 0 || reqWorklogEffort > 24) {
        this.showWarnMessage('Warning', 'Invalid effort!')
        return
      }
      console.log('Date: ' + reqWorklogMonth + '|' + reqWorklogDay)
      const res = await http.post('/worklogs/addOrUpdateWorklog', {
        wUserId: reqUserId,
        wTaskId: reqTaskId,
        wWorklogMonth: reqWorklogMonth,
        wWorklogDay: reqWorklogDay,
        wEffort: reqWorklogEffort,
        wRemark: reqRemark
      })
      if (res.data.status === 0) {
        var firstDate = this.$data.timesheetMonth + '-01 00:00:00'
        var dateConvert = new Date(Date.parse(firstDate))
        let _this = this
        setTimeout(function () {
          _this.resetTimesheet(dateConvert)
        }, 500)
        this.$data.worklogFormVisible = false
      } else {
        this.showWarnMessage('Warning', 'Fail to add/update worklog!')
      }
    },
    async deleteWorklog () {
      var reqUserId = this.$store.getters.getUserId
      var reqTaskId = this.$data.form.worklog_taskid
      var reqWorklogDate = this.$data.form.worklog_date
      if (reqTaskId === 0 || this.$data.form.task_name === '') {
        this.showWarnMessage('Warning', 'Task could not empty!')
        return
      }
      if (reqWorklogDate === '' || reqWorklogDate === null) {
        this.showWarnMessage('Warning', 'Invalid date!')
        return
      }
      var arr = []
      arr = reqWorklogDate.split('-')
      var reqWorklogMonth = arr[0] + '-' + arr[1]
      var reqWorklogDay = arr[2]
      const res = await http.post('/worklogs/removeWorklog', {
        wUserId: reqUserId,
        wTaskId: reqTaskId,
        wWorklogMonth: reqWorklogMonth,
        wWorklogDay: reqWorklogDay
      })
      if (res.data.status === 0) {
        var firstDate = this.$data.timesheetMonth + '-01 00:00:00'
        var dateConvert = new Date(Date.parse(firstDate))
        let _this = this
        setTimeout(function () {
          _this.resetTimesheet(dateConvert)
        }, 500)
        this.$data.worklogFormVisible = false
      } else {
        this.showWarnMessage('Warning', 'Fail to delete worklog!')
      }
    },
    changeWorklogDate () {
      var changeDate = this.$data.form.worklog_date
      var changeDateYear = changeDate.getFullYear()
      var changeDateMonth = changeDate.getMonth() + 1
      var changeDateDay = changeDate.getDate()
      if (changeDateMonth < 10) {
        changeDateMonth = '0' + changeDateMonth
      } else {
        changeDateMonth = '' + changeDateMonth
      }
      if (changeDateDay < 10) {
        changeDateDay = '0' + changeDateDay
      } else {
        changeDateDay = '' + changeDateDay
      }
      this.$data.form.worklog_date = changeDateYear + '-' + changeDateMonth + '-' + changeDateDay
    }
  },
  created () {
    console.log('Created My Timesheet')
    var firstDate = this.getCurrentMonthFirst()
    this.resetTimesheet(firstDate)
  }
}
</script>

<style scoped>
.mt-body {
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
/* Main Style */
.content-main-col {
  margin-top: 20px;
}
.mt-table-month-picker {
  height:40px;
  padding-left: 5px;
  padding-right: 5px;
  line-height: 46px;
  font-size: 16px;
  margin: 0 5px;
  width: auto;
}
.form_list_task_name {
  font-size: 16px;
  color: #57606f;
  text-overflow: ellipsis;
  overflow: hidden;
}
.form_list_task_desc {
  font-size: 14px;
  color: #bdc3c7;
}
.content-task-col {
  margin-top:40px;
  height:400px;
  width: 100%;
  border: 1px solid black
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
.mt-table {
  width: 100%;
}
.mt-table-header-row {
  height: 40px;
}
.mt-table-header-cell-weekday {
  font-size: 13px;
  border-top: 1px solid #f1f2f6;
  padding: 0 !important;
  color: white;
}
.mt-table-header-cell {
  font-size: 13px;
  border-top: 1px solid #f1f2f6;
  padding: 0 !important;
  color: #2f3542;
}
.mt-table-row {
  height: 40px;
}
.mt-table-cell {
  font-size: 13px;
  padding: 0 !important;
  border: 1px solid #f1f2f6;
}
.mt-table-col-weekday {
  background-color: #ced6e0;
}
.mt-table-col-nonweekday {
  background-color: white;
}
.mt-worklog-form {
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
.el-autocomplete-suggestion li {
  line-height: 28px;
}
</style>
