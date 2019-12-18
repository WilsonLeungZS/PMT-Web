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
                <template slot="header" >
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
        <el-row>
          <el-col :span="24" class="content-task-col">
              <div class="datePicker">
                <el-button size="small" round  icon="el-icon-arrow-left" @click="ChangePeriod(-1)"></el-button>
                <el-date-picker v-model="timesheetMemo" type="month" size="small" format="yyyy-MM" :clearable="false"
                  class="assin-month-picker" @change="changeMemoMonth"></el-date-picker>
                <el-button size="small" round @click="ChangePeriod(1)"><i class="el-icon-arrow-right el-icon--right" ></i></el-button>
              </div>
                <div class="cards" v-for="(assignToTask,index) in assignToTasks" :key="index" >
                    <el-col :span="span_card">    
                    <el-card  class="box-card" @click.native="addToAssign(assignToTask)">
                      <div slot="header" class="clearfix">
                        <span class="title">{{assignToTask.taskName}}</span>
                      </div>
                      <div class="text item">
                        <el-row>
                          <el-col class="title" :span="8">Date</el-col>
                          <el-col class="content"  :span="16">{{assignToTask.date}}</el-col>
                        </el-row>
                        <el-row >
                          <el-col class="title"  :span="8">Progress</el-col>
                          <el-col class="content" :span="16"><el-progress :percentage="assignToTask.progress"></el-progress></el-col>
                        </el-row>                        
                        <el-row >
                          <el-col class="title"  :span="8">Description</el-col>
                          <el-col class="content" :title="assignToTask.Description" :span="16"><div class="overflow">{{assignToTask.Description}}</div></el-col> 
                        </el-row >
                      </div>
                    </el-card>  
                    </el-col>
                  </div>
                  
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
      span_card:4,
      isActive: true,
      timesheetData: [],
      memoTimesheetDate:[],
      timesheetHeaders: [],
      timesheetMonth: '',
      timesheetMemo: '',
      sumHoursArray: [],
      worklogFormVisible: false,
      taskList: [],
      showDeleteBtn: false,
      form: {
        worklog_taskid: 0,
        worklog_task: '',
        worklog_date: '',
        worklog_effort: 0,
        worklog_remark: '',
        worklog_progress: 0
      },
      assignToTasks:[],
      headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor
    }
  },
  filters: {
      ellipsis (value) {
        if(!value){
          return '';
        }
        if(value.length >32) {
          return value.slice(0,32) + "...";
        }
        return value;
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
    changeMemoMonth(iDate){
      console.log('Change MemoMonth: '+iDate)
      this.resetMemoTimeSheet(iDate)
    },
    changeMTMonth (iDate) {
      console.log('Change month: ' + iDate)
      this.resetTimesheet(iDate)
    },
    ChangePeriod (value){
      console.log(value)
      console.log("clicked ChangePeriod")
      var month = Number(this.$data.timesheetMemo.slice(5,7))
      var year = Number(this.$data.timesheetMemo.slice(0,4))
      if(value == -1){
        if(month == 1){
          year--
          month = 12
        }else{
          month -- 
        }
      }else if(value == 1){
        if(month == 12){
          year ++
          month = 1
        }else{
          month++
        }
      }
      year = String(year)
      month = String(month)
      this.$data.timesheetMemo = year + '-' + month ;
      var PeriodDate = this.$data.timesheetMemo + '-01 00:00:00'
      var dateConvert = new Date(Date.parse(PeriodDate))
      this.resetMemoTimeSheet(dateConvert)
    },
    async resetMemoTimeSheet(iDateVal){
      this.$data.memoTimesheetDate = []
      console.log(iDateVal)
      var mtYear = iDateVal.getFullYear()
      var mtMonth = iDateVal.getMonth() + 1
      console.log(mtYear + " " +mtMonth)
      if(mtMonth < 10){
        mtMonth = '0' + mtMonth
      }else{
        mtMonth = ''+ mtMonth
      }
      var mtDay = iDateVal.getDay()
      /*var days = 31
      var isLeap = false
      if(mtYear % 4 ===0 && mtYear % 100 !=0 || mtYear % 400 ===0){
        isLeap = true
      }
      if(mtMonth === '04' || mtMonth === '06' || mtMonth === '09' || mtMonth === '11'){
        days = 30
      }else if(mtMonth ==='02' && isLeap === false){
        days = 28
      }else if(mtMonth ==='02' && isLeap === true){
        days = 29
      }*/
      var mtUpdatedAt = mtYear+'-'+mtMonth;
      var mtEndUpdated 
      if(mtMonth<12){
        mtMonth = Number(mtMonth)
        mtMonth++
      }else if(mtMonth == 12){
        mtYear = Number(mtYear)
        mtMonth = Number(mtMonth)
        mtYear++ 
        mtMonth = 1
      }
      mtEndUpdated =  mtYear+'-'+mtMonth;
      console.log('mtEndUpdated :'+mtEndUpdated)
      console.log('mtUpdatedAt :'+mtUpdatedAt)
      var AssignUserId = this.$store.getters.getUserId
      console.log('Assign To: ' + AssignUserId)
      const res = await http.post('/tasks/getTaskByAssignUserId', {
        wUserId: AssignUserId,
        wmtUpdatedAt: mtUpdatedAt,
        wmtEndUpdated:mtEndUpdated
      })
      console.log(res.data)
      if(res.data.status === 0){
        this.$data.assignToTasks = res.data.data;
        console.log(this.$data.assignToTasks)
      }else{
        this.$data.assignToTasks = [];
      }
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
      if (mtMonth === '02' || mtMonth === '04' || mtMonth === '06' || mtMonth === '09' || mtMonth === '11') {
        days = 30
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
      this.$data.timesheetMemo = reqMonth
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
      console.log('editTimesheetByDate')
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
      console.log('editTimesheetByTask')
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
      var reqWorklogDay = arr[2].slice(0,2)
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
      console.log(res.data)
      if (res.data.status === 0) {
        var firstDate = this.$data.timesheetMonth + '-01 00:00:00'
        var dateConvert = new Date(Date.parse(firstDate))
        this.resetTimesheet(dateConvert)
        this.$data.worklogFormVisible = false
      } else {
        this.showWarnMessage('Warning', 'Fail to add/update worklog!')
      }
      this.$router.go(0)
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
      // console.log('Date: ' + reqWorklogMonth + '|' + reqWorklogDay)
      const res = await http.post('/worklogs/removeWorklog', {
        wUserId: reqUserId,
        wTaskId: reqTaskId,
        wWorklogMonth: reqWorklogMonth,
        wWorklogDay: reqWorklogDay
      })
      if (res.data.status === 0) {
        var firstDate = this.$data.timesheetMonth + '-01 00:00:00'
        var dateConvert = new Date(Date.parse(firstDate))
        this.resetTimesheet(dateConvert)
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
    },
    async addToAssign (assignToTask) {
      console.log('click')
      var currentDate = new Date()
      console.log(currentDate)
      this.$data.worklogFormVisible = true
      console.log(assignToTask)
      this.$data.form.worklog_taskid = assignToTask.taskId
      this.$data.form.worklog_task = assignToTask.taskName
      this.$data.form.worklog_date = currentDate
      this.$data.form.worklog_effort = 0
      this.$data.form.worklog_remark = ''
      // var reqWorklogMonth = assignToTask.date.slice(0,7)
      // var reqWorklogDay = assignToTask.date.slice(8,10)
      // const res = await http.post('/worklogs/getWorklogForWeb', {
      //   wUserId: this.$store.getters.getUserId,
      //   wTaskId: assignToTask.taskId,
      //   wWorklogMonth: reqWorklogMonth,
      //   wWorklogDay: reqWorklogDay
      // })
      // console.log(res)

    },
    // $(window).resize(function(){ 
    // var Height = $(window).height();
    // var Width = $(window).width();
    // console.log('Height'+Height);
    // console.log('Width'+VWidth);
    // })
  },
  created () {
    console.log('Created My Timesheet')
    var firstDate = this.getCurrentMonthFirst()
    this.resetTimesheet(firstDate)
    this.resetMemoTimeSheet(firstDate)
    var winWidth = document.body.clientWidth || document.documentElement.clientWidth;
  
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
  border-top: 1px solid rgb(168, 168, 168) ;
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
/**assin功能 */

.overflow{
      overflow: hidden;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
.assin-month-picker{
  height:40px;
  padding-left: 5px;
  padding-right: 5px;
  line-height: 46px;
  font-size: 16px;
  margin: 10px 5px;
  width: auto;
}
  .text {
    font-size: 14px;
    font-family: "Helvetica Neue";
    text-align: left;
  }
  .title{
    word-wrap: break-word;
    font-weight: bold;
  }

  .item {
    margin-bottom: 10px;
  }
  .content{
    float: left;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card{
    margin:10px 20px;
    cursor: pointer;
    background-color: #d9e1eb;
  }
  .box-card:hover {
    transform: scale(1.1);
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
