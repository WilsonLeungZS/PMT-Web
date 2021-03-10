<template>
  <div>
    <el-table :data="timesheetData" empty-text="No worklog" :summary-method="getSummaries" class="timesheet-content"
        :header-cell-style="{'background-color': headerColor}"
        :header-row-class-name="timesheetHeaderRowStyle" 
        :header-cell-class-name="timesheetHeaderCellStyle"
        :row-class-name="timesheetRowStyle" 
        :cell-class-name="timesheetCellStyle"
        show-summary fit>
      <el-table-column prop="taskId" label="Id" v-if="false"></el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" min-width="200px">
        <template slot="header" slot-scope="scope">
          <el-date-picker :disabled="disabledEditableFunction" @change="selectTimesheetDateRange" v-model="timesheetSelectDateArray" type="daterange" range-separator="-" start-placeholder="Start" end-placeholder="End" value-format="yyyy-MM-dd" size="mini" style="width: 100%; max-width: 250px"></el-date-picker>
        </template>
        <template slot-scope="scope">
          <span>{{scope.row.taskName}} - {{scope.row.taskTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(timesheetHeader, index) in timesheetHeaders" :key="index" :prop="timesheetHeader.prop" :label="timesheetHeader.label" align="center" width="48" :class-name="changeCol(timesheetHeader.isWeekday, timesheetHeader.isToday)">
        <template slot="header" slot-scope="scope">
          <span v-if="!disabledEditableFunction" @click="editWorklogByDate(scope.column)" style="font-size:16px; text-decoration:underline; cursor:pointer;">{{scope.column.label}}</span>
          <span v-if="disabledEditableFunction" style="font-size:16px;">{{scope.column.label}}</span>
        </template>
        <template slot-scope="scope">
          <el-button :disabled="disabledEditableFunction" v-if="scope.row[scope.column.property] != undefined? true: false" @click="editWorklog(scope.row, scope.column)" type="text" style="font-size: 12px">{{scope.row[scope.column.property]}}</el-button>
          <el-button :disabled="disabledEditableFunction" v-if="scope.row[scope.column.property] != undefined? false: true" @click="editWorklogByTask(scope.row, scope.column)" type="text" style="font-size: 12px">{{'-'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <worklog-dialog @refreshTimesheet="refreshTimesheet" :action="worklogAction"></worklog-dialog>
  </div>
</template>

<script>
import http from '../../../utils/http'
import utils from '../../../utils/utils'
import WorklogDialog from '../TimesheetPlugins/WorklogDialog'
export default {
  name: 'Timesheet',
  components: {
    WorklogDialog
  },
  props: {
    'timesheetObj': Object
  },
  watch: {
    timesheetObj: {
        handler (val, oldVal) {
        console.log('PMT timesheet obj: ', val)
        if(val == '' || val == null || val == undefined) {
          return
        }
        var timesheetObj = val
        if (timesheetObj.timesheetUserId == 0 || timesheetObj.timesheetUserId == null) {
          this.$data.timesheetData = []
          this.$data.timesheetHeaders = []
          this.$data.timesheetSelectDateArray = []
          return
        }
        if (timesheetObj.type == 'MyTimesheet') {
          this.$data.disabledEditableFunction = false
        } else {
          this.$data.disabledEditableFunction = true
        }
        this.generateTimesheet(timesheetObj.timesheetUserId, timesheetObj.timesheetStartDate, timesheetObj.timesheetEndDate)
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      // userId: this.$store.getters.getUserId,
      timesheetData: [],
      timesheetHeaders: [],
      timesheetSelectDateArray: [],
      sumHoursArray: [],
      worklogAction: null,
      disabledEditableFunction: false
    }
  },
  methods: {
    // Timesheet Style Method
    timesheetHeaderRowStyle ({row, rowIndex}) {
      return 'timesheet-header-row'
    },
    timesheetHeaderCellStyle ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        return 'timesheet-header-cell-weekday'
      } else {
        var isWeekday = this.$data.timesheetHeaders[columnIndex - 1].isWeekday
        var isToday = this.$data.timesheetHeaders[columnIndex - 1].isToday
        if (isToday) {
          return 'timesheet-header-cell-today'
        } 
        if (isWeekday) {
          return 'timesheet-header-cell-weekday'
        }
        else {
          return 'timesheet-header-cell'
        }
      }
    },
    timesheetCellStyle ({row, column, rowIndex, columnIndex}) {
      return 'timesheet-cell'
    },
    timesheetRowStyle ({row, rowIndex}) {
      return 'timesheet-row'
    },
    changeCol (isWeekday, isToday) {
      if (isToday) {
        return 'timesheet-col-today'
      }
      if (isWeekday) {
        return 'timesheet-col-weekday'
      } 
      else {
        return 'timesheet-col-nonweekday'
      }
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
    // End Timesheet Style Method
    selectTimesheetDateRange () {
      var timesheetDateRange = this.$data.timesheetSelectDateArray
      if (timesheetDateRange != null) {
        var startDate = timesheetDateRange[0]
        var endDate = timesheetDateRange[1]
        this.generateTimesheet(this.$store.getters.getUserId, startDate, endDate)
      } else {
        this.$emit('getCurrentMonthTimesheet')
      }
    },
    async generateTimesheet (iUserId, iStartDate, iEndDate) {
      console.log('Timesheet -> ', iUserId, iStartDate, iEndDate)
      if (iStartDate > iEndDate) {
        var temp = iStartDate
        iStartDate = iEndDate
        iEndDate = temp
      }
      this.$data.timesheetSelectDateArray = []
      this.$data.timesheetSelectDateArray.push(iStartDate)
      this.$data.timesheetSelectDateArray.push(iEndDate)
      // Get start date information
      var start = new Date(iStartDate)
      var startYear = start.getFullYear()
      var startMonth = start.getMonth() + 1
      var startDate = start.getDate()
      var startLastDate= new Date(startYear, startMonth, 0).getDate()
      // console.log('Start -> ', startYear, startMonth, startDate, startLastDate)
      // Get end date information
      var end = new Date(iEndDate)
      var endYear = end.getFullYear()
      var endMonth = end.getMonth() + 1
      var endDate = end.getDate()
      var endFirstDate= 1
      // console.log('End -> ', endYear, endMonth, endDate, endFirstDate)
      if (startYear != endYear) {
        this.$message.error('Cannot select over 1 year!')
        return
      }
      if (startYear == endYear && (endMonth - startMonth) > 1) {
        this.$message.error('Cannot select over 2 month!')
        return
      }
      var arr = []
      var monthArr = []
      if (startMonth != endMonth) {
        for(let a=startDate; a<=startLastDate; a++) {
          arr.push(startYear + '-' + startMonth.toString().padStart(2, '0') + '-' + a.toString().padStart(2, '0'))
        }
        monthArr.push(startYear + '-' + startMonth.toString().padStart(2, '0'))
        for(let b=1; b<=endDate; b++) {
          arr.push(endYear + '-' + endMonth.toString().padStart(2, '0') + '-' + b.toString().padStart(2, '0'))
        }
        monthArr.push(endYear + '-' + endMonth.toString().padStart(2, '0'))
      } else {
        for(let a=startDate; a<=endDate; a++) {
          arr.push(startYear + '-' + startMonth.toString().padStart(2, '0') + '-' + a.toString().padStart(2, '0'))
        }
        monthArr.push(startYear + '-' + startMonth.toString().padStart(2, '0'))
      }
      var weekday = new Date(iStartDate).getDay()
      this.$data.timesheetHeaders = []
      var timesheetHeadersArray = []
      for (var i = 0; i < arr.length; i++) {
        var timesheetJson = {}
        timesheetJson.label = arr[i].split('-')[2]
        timesheetJson.prop = 'day' + arr[i]
        if (weekday === 6 || weekday === 0) {
          timesheetJson.isWeekday = false
        } else {
          timesheetJson.isWeekday = true
        }
        var curDate = this.formatDate(new Date(), 'yyyy-MM-dd')
        if (curDate == arr[i]) {
          timesheetJson.isToday = true
        } else {
          timesheetJson.isToday = false
        }
        timesheetHeadersArray.push(timesheetJson)
        weekday++
        if (weekday === 7) {
          weekday = 0
        }
      }
      // console.log(timesheetHeadersArray)
      this.$data.timesheetHeaders = timesheetHeadersArray
      this.$data.timesheetData = []
      const res = await http.post('/worklogs/getWorklogForTimesheet', {
        reqUserId: iUserId,
        reqMonth: monthArr.toString()
      })
      if (res.data.status === 0) {
        var timesheetArray = res.data.data
        for (var i=0; i<timesheetArray.length; i++) {
          var timesheet = timesheetArray[i]
          var flag = false
          for(var key in timesheet){
            if (key.startsWith('day')) {
              var timesheetDate = key.replace('day', '')
              if (timesheetDate >= iStartDate && timesheetDate <= iEndDate) {
                flag = true
              }
            }
          }
          if (!flag) {
            timesheetArray.splice(i, 1)
          }
        }
        this.$data.timesheetData = timesheetArray
      }
    },
    editWorklogByDate (column) {
      console.log('Edit worklog by date')
      var worklogDate = column.property.replace('day', '')
      this.$data.worklogAction = {
        action: 'EDIT-WORKLOG-BY-DATE',
        worklogDate: worklogDate,
        userId: this.timesheetObj.timesheetUserId,
        date: new Date()
      }
    },
    editWorklogByTask (row, column) {
      console.log('Edit worklog by task')
      var worklogDate = column.property.replace('day', '')
      this.$data.worklogAction = {
        action: 'EDIT-WORKLOG-BY-TASK',
        taskId: row.taskId,
        taskName: row.taskName,
        taskTitle: row.taskTitle,
        worklogDate: worklogDate,
        userId: this.timesheetObj.timesheetUserId,
        date: new Date()
      }
    },
    editWorklog (row, column) {
      console.log('Edit worklog')
      var worklogDate = column.property.replace('day', '')
      this.$data.worklogAction = {
        action: 'EDIT-WORKLOG',
        taskId: row.taskId,
        worklogDate: worklogDate,
        userId: this.timesheetObj.timesheetUserId,
        date: new Date()
      }
    },
    refreshTimesheet () {
      this.selectTimesheetDateRange()
      this.$emit('refresh')
    },
    // Daily Scrum
    // Common Method
    debug(row, column) {
      console.log('ROW: ', row)
      console.log('COL', column)
      console.log('Debug, ', row[column.property])
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
    }
  },
  created () {
  }
}
</script>

<style scoped>
.timesheet-content {
  width: 100%;
  height: auto;
  padding: 0;
}
.timesheet-content>>>.timesheet-header-row {
  height: 40px;
}
.timesheet-content>>>.timesheet-header-cell {
  font-size: 13px;
  border-top: 1px solid #f1f2f6;
  padding: 0 !important;
  color: #2f3542;
}
.timesheet-content>>>.timesheet-header-cell-weekday {
  font-size: 13px;
  border-top: 1px solid #f1f2f6;
  padding: 0 !important;
  color: white;
}
.timesheet-content>>>.timesheet-header-cell-today {
  font-size: 13px;
  border-top: 1px solid #f1f2f6;
  padding: 0 !important;
  color: #fff59d;
}
.timesheet-content>>>.timesheet-row {
  height: 40px;
}
.timesheet-content>>>.timesheet-cell {
  font-size: 13px;
  padding: 0 !important;
  border: 1px solid #f1f2f6;
}
</style>
<style>
.timesheet-col-today {
  background-color: #fff59d;
}
.timesheet-col-weekday {
  background-color: white;
}
.timesheet-col-nonweekday {
  background-color: #ced6e0;
}
.timesheet-content .el-table__footer-wrapper tbody td {
  color: #747d8c !important;
  border: 1px solid #f1f2f6;
  padding: 10px 0;
  font-weight: bold;
}
/* Timesheet Date Picker Style */
.timesheet-content .el-table th>.cell {
  padding: 5px 2px;
}
.timesheet-content .el-range-editor.el-input__inner {
  padding: 3px 0 3px 3px;
}
.timesheet-content .el-range-editor--small .el-range-input {
  font-size: 12px;
}
</style>
