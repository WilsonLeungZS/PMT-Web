<template>
  <div class="charts-body">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div class="content-title-item" @click="switchToPM">
              <i class="el-icon-user content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
            <el-divider direction="vertical"></el-divider>
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-monitor content-title-item-icon"></i>
              <span class="content-title-item-header">{{header2}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="content-main-col">
            <el-card class="box-card pt-title" shadow="never">
              <el-row :gutter="10" type="flex" justify="flex-start" align="center">
                <el-col :span="3">
                  <el-date-picker v-model="monthSelect" type="month" placeholder="Select" style="width:100%"
                  @change="changePtMonth"></el-date-picker>
                </el-col>
                <el-col :span="2">
                  <el-popover placement="bottom" width="900" trigger="click" v-model="showList">
                    <el-table :data="taskListData">
                      <el-table-column align="center" width="100" property="tl_task" label="Task"></el-table-column>
                      <el-table-column align="center" property="tl_status" label="Status"></el-table-column>
                      <el-table-column align="center" width="110" property="tl_estimation" label="Estimation"></el-table-column>
                      <el-table-column align="center" width="120" property="tl_effort" label="Actual Effort"></el-table-column>
                      <el-table-column align="center" width="120" label="Month Effort">
                        <template slot-scope="scope">
                          <span style="color:#57606f; font-size: 20px; font-weight:bold">{{ scope.row.tl_montheffort }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" width="50">
                        <template slot-scope="scope">
                          <el-button :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="mini" icon="el-icon-arrow-right" circle @click="getTaskWorklogs(scope.row.tl_task)"></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-button slot="reference" @click="showMonthTaskList">Task List</el-button>
                  </el-popover>
                </el-col>
                <el-col :span="7">
                  <el-autocomplete style="width:100%" :trigger-on-focus="false" popper-class="task-autocomplete" :clearable="true"
                    v-model="taskSelect" :fetch-suggestions="queryTaskWorklogAsync" @select="handleTaskSelect" @clear="clearTask">
                    <template slot-scope="{ item }">
                      <div class="list_task_name">{{ item.value }}</div>
                      <span class="list_task_desc">{{ item.description }}</span>
                    </template>
                  </el-autocomplete>
                </el-col>
                <el-col :span="1">
                  <el-tooltip effect="dark" content="Show Worklog" placement="top">
                    <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" icon="el-icon-search" circle @click="getTaskWorklogs(null)"></el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="1">
                  <el-popover placement="bottom" v-model="reportFormVisible">
                    <el-form label-width="60px">
                      <el-form-item label="Range">
                        <el-date-picker
                          v-model="reportRangeValue"
                          type="monthrange"
                          align="right"
                          unlink-panels
                          range-separator="-"
                          start-placeholder="Start Month"
                          end-placeholder="End Month"
                          format="yyyy-MM"
                          value-format="yyyy-MM"
                          :picker-options="pickerOptions">
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item label="Report">
                        <el-radio-group v-model="reportType">
                          <div><el-radio :label="1">Report 1(Only MTL) </el-radio></div>
                          <div><el-radio :label="2">Report 2 </el-radio></div>
                          <div><el-radio :label="3">Report 3（task list) </el-radio></div>
                        </el-radio-group>
                      </el-form-item>
                    </el-form>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="reportFormVisible = false; reportRangeValue = []; reportType = 1">Cancel</el-button>
                      <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" size="mini" @click="extractReport">Extract</el-button>
                    </div>
                    <el-button slot="reference" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" icon="el-icon-download" circle></el-button>
                  </el-popover>
                </el-col>
                <el-col :span="5" :offset="5" class="pt-effort-progress">
                  <span>AD Target: <span style="font-size: 20px;font-weight:bold;margin-left:5px"> {{monthADTotal}} / {{monthADTarget}} </span> hrs</span>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7" style="margin-top:1px; padding: 0 5px 0 5px;">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>{{taskForm.taskName}}</span>
                <el-button style="float: right; padding: 3px 0" type="text" v-show="false">Refresh</el-button>
              </div>
              <div class="pt-task-box">
                <el-form :label-position="labelPosition" label-width="100px" :model="taskForm" size="mini">
                  <el-form-item label="Status">
                    <el-col :span="24" class="pt-task-box-content-item">
                      <span>{{taskForm.taskStatus}}</span>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="Type">
                     <el-col :span="24" class="pt-task-box-content-item">
                      <span>{{taskForm.taskType}}</span>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="Effort">
                     <el-col :span="24" class="pt-task-box-content-item">
                      <span>{{taskForm.taskEffort}} / {{taskForm.taskEstimation}} hrs</span>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="Month Effort">
                     <el-col :span="24" class="pt-task-box-content-item">
                      <span style="color:#57606f; font-size: 20px; font-weight:bold;margin-right:10px">{{taskForm.taskMonthEffort}}</span> hrs
                    </el-col>
                  </el-form-item>
                  <el-form-item label="Description">
                    <el-col :span="24" class="pt-task-box-content-item">
                      <span>{{taskForm.taskDescription}}</span>
                    </el-col>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </el-col><!-- Task Box -->
          <el-col :span="17" style="margin-top:1px; padding: 0 5px 0 5px;">
            <el-card class="box-card" shadow="never">
              <el-table :data="taskWorklogList" style="width: 100%">
                <el-table-column prop="worklog_id" label="Id" v-if="false"></el-table-column>
                <el-table-column prop="worklog_user" sortable label="User" align="center"></el-table-column>
                <el-table-column prop="worklog_date" sortable label="Date" align="center" ></el-table-column>
                <el-table-column prop="worklog_effort" sortable label="Effort" align="center"></el-table-column>
                <el-table-column label="Worklog Management" align="center" width="400">
                  <template slot-scope="scope">
                    <el-input type="number" size="small" v-model="scope.row.worklog_change_effort" class="pt-worklog">
                      <template slot="append">Hours</template>
                    </el-input>
                    <el-button size="small" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" icon="el-icon-edit" style="margin-left:10px" @click="adjustEffort(scope)">Adjust Effort</el-button>
                  </template>
                </el-table-column>
              </el-table>
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
export default {
  name: 'Charts',
  data () {
    return {
      header1: 'Project Management',
      header2: 'Timesheet Management',
      isActive: true,
      monthSelect: '',
      monthValue: '',
      taskSelect: '',
      taskWorklogList: [],
      labelPosition: 'left',
      taskForm: {
        taskId: 0,
        taskName: 'Task Number',
        taskDescription: '',
        taskStatus: '',
        taskType: '',
        taskEffort: 0,
        taskEstimation: 0,
        taskMonthEffort: 0
      },
      taskListData: [],
      showList: false,
      monthADTotal: 0,
      monthADTarget: 0,
      reportFormVisible: false,
      reportRangeValue: '',
      reportType: 1,
      pickerOptions: {
        shortcuts: [{
          text: 'Current Month',
          onClick (picker) {
            picker.$emit('pick', [new Date(), new Date()])
          }
        }, {
          text: 'Last Month',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 1)
            end.setMonth(end.getMonth() - 1)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Current Year (Up to now)',
          onClick (picker) {
            const end = new Date()
            const start = new Date(new Date().getFullYear(), 0)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2
    }
  },
  methods: {
    switchToPM () {
      this.$data.isActive = false
      this.$router.push({path: 'PrjManagement'})
    },
    changePtMonth (iDate) {
      this.$data.monthSelect = iDate
      if (iDate !== '' && iDate !== null) {
        var pmtYear = iDate.getFullYear()
        var pmtMonth = iDate.getMonth() + 1
        if (pmtMonth < 10) {
          pmtMonth = '0' + pmtMonth
        } else {
          pmtMonth = '' + pmtMonth
        }
        this.$data.monthValue = pmtYear + '-' + pmtMonth
        this.getMonthADEffort()
      } else {
        this.$data.monthValue = ''
      }
    },
    async getMonthADEffort () {
      var reqMonth = this.$data.monthValue
      if (reqMonth === '') {
        this.$data.monthADTotal = 0
        this.$data.monthADTarget = 0
      } else {
        const res = await http.post('/worklogs/getMonthAdEffort', {
          wWorklogMonth: reqMonth
        })
        if (res.data.status === 0 && res.data.data != null) {
          this.$data.monthADTotal = res.data.data[0].month_effort
          this.$data.monthADTarget = res.data.data[0].month_target
        } else {
          this.$data.monthADTotal = 0
          this.$data.monthADTarget = 0
        }
      }
    },
    async queryTaskWorklogAsync (queryString, cb) {
      console.log('Query String: ' + queryString)
      var returnArr = []
      const res = await http.post('/tasks/getTaskByName', {
        tTaskName: queryString
      })
      if (res.data.status === 0) {
        var queryResult = res.data.data
        for (var i = 0; i < queryResult.length; i++) {
          if (queryResult[i].task_type !== 'Change' && queryResult[i].task_type !== 'App Admin') {
            continue
          }
          var returnJson = {}
          returnJson.value = queryResult[i].task_name
          returnJson.description = queryResult[i].task_desc
          returnJson.id = queryResult[i].task_id
          returnArr.push(returnJson)
        }
      }
      cb(returnArr)
    },
    async handleTaskSelect (item) {
      this.$data.taskForm.taskId = item.id
      this.$data.taskSelect = item.value
    },
    async showMonthTaskList () {
      var reqMonth = this.$data.monthValue
      if (reqMonth === '') {
        this.$data.taskListData = []
      } else {
        const res = await http.post('/worklogs/getWorklogTaskByMonthForWeb', {
          sWorklogMonth: reqMonth
        })
        if (res.data.status === 0 && res.data.data != null) {
          this.$data.taskListData = res.data.data
        } else {
          this.$data.taskListData = []
        }
      }
    },
    async getTaskWorklogs (iTaskName) {
      this.$data.showList = false
      var reqTask = ''
      if (iTaskName === null) {
        reqTask = this.$data.taskSelect
      } else {
        reqTask = iTaskName
      }
      var reqMonth = this.$data.monthValue
      if (reqMonth === '') {
        this.$data.taskListData = []
        this.$message.error('Month cannot be empty!')
        return
      }
      if (reqTask === '') {
        this.$message.error('Task cannot be empty!')
        return
      }
      this.$data.taskSelect = reqTask
      const res = await http.post('/worklogs/getWorklogByMonthForWeb', {
        sWorklogMonth: reqMonth,
        sWorklogTask: reqTask
      })
      if (res.data.status === 0 && res.data.data != null) {
        var taskArr = res.data.data[0].task
        if (taskArr != null && taskArr.length === 1) {
          this.setTaskInfo(taskArr)
        } else {
          this.$message.error('Invalid Task!')
          return
        }
        var worklogArr = res.data.data[0].worklog
        if (worklogArr != null && worklogArr.length > 0) {
          this.$data.taskWorklogList = worklogArr
        } else {
          this.$data.taskWorklogList = []
        }
      } else {
        this.clearTask()
      }
    },
    setTaskInfo (data) {
      this.$data.taskForm.taskId = data[0].tl_task_id
      this.$data.taskForm.taskName = data[0].tl_task
      this.$data.taskForm.taskStatus = data[0].tl_status
      this.$data.taskForm.taskType = data[0].tl_task_type
      this.$data.taskForm.taskEffort = data[0].tl_effort
      this.$data.taskForm.taskEstimation = data[0].tl_estimation
      this.$data.taskForm.taskDescription = data[0].tl_desc
      this.$data.taskForm.taskMonthEffort = data[0].tl_month_effort
    },
    clearTask () {
      this.$data.taskIdSelect = 0
      this.$data.taskSelect = ''
      this.$data.taskForm.taskId = 0
      this.$data.taskForm.taskName = 'Task Number'
      this.$data.taskForm.taskStatus = ''
      this.$data.taskForm.taskType = ''
      this.$data.taskForm.taskEffort = 0
      this.$data.taskForm.taskEstimation = 0
      this.$data.taskForm.taskDescription = ''
      this.$data.taskForm.taskMonthEffort = 0
      this.$data.taskWorklogList = []
    },
    async adjustEffort (scope) {
      console.log(scope.row)
      var reqWorklogId = scope.row.worklog_id
      var reqWorklogChangeEffort = scope.row.worklog_change_effort
      const res = await http.post('/worklogs/adjustWorklogForWeb', {
        wWorklogId: reqWorklogId,
        wWorklogChangeEffort: Number(reqWorklogChangeEffort)
      })
      console.log(res.data)
      if (res.data.status === 0) {
        this.$message({
          message: 'Worklog adjust done!',
          type: 'success',
          duration: 1000
        })
        this.getTaskWorklogs(this.$data.taskSelect)
        this.getMonthADEffort()
      } else {
        this.$message.error('Fail to adjust worklog!')
      }
    },
    // Export report to excel
    async extractReport () {
      var reportTimeRange = this.$data.reportRangeValue
      var reportType = this.$data.reportType
      if (reportTimeRange != null && reportTimeRange.length > 0) {
        var reportStartMonth = reportTimeRange[0]
        var reportEndMonth = reportTimeRange[1]
      } else if(reportType === 3 ){
      } else {
        this.$message.error('Please select month!')
        return
      }
      var url = '/worklogs/extractReport1ForWeb'
      var reportTitle = 'PMT Report1 ' + reportStartMonth + '-' + reportEndMonth
      if (reportType === 2) {
        url = '/worklogs/extractReport2ForWeb'
        reportTitle = 'PMT Report2 ' + reportStartMonth + '-' + reportEndMonth
      }
      var reportHeader = []
      var reportValue = []
      if(reportType === 1){
      reportHeader = ['Name', 'Month','Date', 'Task Number','Ref Pool', 'Task Title', 'Worklog Description', 'Man-hours', 'Man-days', 'Business Project', 'AD Task Category']
      reportValue = ['report_username', 'report_month','report_date',  'report_task','report_ref', 'report_taskdesc', 'report_worklogremark', 'report_manhours', 'report_mandays', 'report_bizproject', 'report_taskcategory']        
      }else if(reportType === 2){
      reportHeader = ['Name','Date', 'Task Number','Ref Pool' ,'Task Title','Worklog Description', 'Man-hours', 'Estimation', 'Issue date', 'Target Complete date','Actual Complete date','Business Project','Task Category','L1 Task_Number','L2 Task_Number']
      reportValue = ['report_username', 'report_date',  'report_task','report_ref' ,'report_taskdesc', 'report_worklogremark', 'report_manhours', 'report_Estimation', 'report_issuedate', 'report_targetCom','report_actCom','report_bizproject','report_taskcategory','report_l1TaskNumber','report_l2TaskNumber']   
      }
      var res = {}
      if(reportType ===1 || reportType ===2 ){
        res = await http.post(url, {
          wReportStartMonth: reportStartMonth,
          wReportEndMonth: reportEndMonth
        })        
      }else{
        console.log("click report3")
        url = '/tasks/extractReport3ForWeb'
        reportTitle = 'PMT Report3 ' + reportStartMonth + '-' + reportEndMonth
        res = await http.post(url, {
        wUserId:this.$store.getters.getUserId
      })
      var resp
      var assi
      if(res.data.data!=null && res.data.data.length>0){
        for(var i = 0 ; i<res.data.data.length ;i++){
          var respId = res.data.data[i].report_resp
          if(respId != null){
             resp = await http.post('/users/getUserLevelById', {
              userId: respId
            })
            res.data.data[i].report_resp = resp.data.data.Name
            res.data.data[i].report_resplevel=resp.data.data.Level
                      
          }
          assi = await http.post('/users/getUserLevelById', {
            userId: this.$store.getters.getUserId
          })
          res.data.data[i].report_assignee=assi.data.data.Name  
          res.data.data[i].report_assigneelevel=assi.data.data.Level            
       }
      }
      reportHeader = ['Task Level','Task Number', 'Project/Customer','Status','Task Title','Ref Pool' ,'Responsible Lead','Level of Lead', 'Task asignee', 'Level of Assignee', 'Issue date']
      reportValue = ['report_tasklevel', 'report_tasknumber','report_customer', 'report_status','report_des' , 'report_refpool','report_resp','report_resplevel', 'report_assignee', 'report_assigneelevel','report_issue', ]  
      var arr = res.data.data
      for(var i = 0 ; i<res.data.data.length;i++){
        if(res.data.data[i].report_parentTask!=null){
        const gettaskbyname = await http.post('/tasks/getreport3bytaskname',{
            taskName:res.data.data[i].report_parentTask
        })        
        arr = arr.concat(gettaskbyname.data.data)
        }
      }
      res.data.data = this.deteleObject(arr)
      console.log(res.data.data)
      }
      if (res.data.status === 0) {
        this.$message({
          message: 'Start to extract report...',
          type: 'success',
          duration: 3000
        })
        if (res.data.data != null && res.data.data.length > 0) {
          utils.exportExcel(reportTitle, reportHeader, reportValue, res.data.data)
        } else {
          this.$message.error('No worklog to extract!')
        }
      } else if (res.data.status === 1) {
        this.$message.error('No worklog to extract!')
      } else {
        this.$message.error('Error to extract!')
      }
      this.$data.reportFormVisible = false
      this.$data.reportRangeValue = []
      this.$data.reportType = 1
     },
     //Remove duplicate elements
     deteleObject(obj) {
      var uniques = [];
      var stringify = {};
      for (var i = 0; i < obj.length; i++) {
          var keys = Object.keys(obj[i]);
          // keys.sort(function(a, b) {
          //     return (Number(a) - Number(b));
          // });
          var str = '';
          for (var j = 0; j < keys.length; j++) {
              str += JSON.stringify(keys[j]);
              str += JSON.stringify(obj[i][keys[j]]);
          }
          if (!stringify.hasOwnProperty(str)) {
              uniques.push(obj[i]);
              stringify[str] = true;
          }
      }
      uniques = uniques;
      return uniques;
      },
  },
  created () {
    console.log('Start')
  }

}
</script>

<style scoped>
.charts-body {
  width: 100%;
  height: auto;
}
.el-main {
  color: #333;
  text-align: center;
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
  padding: 5px;
}
.pt-title {
  width: 100%;
  height: auto;
}
.list_task_name {
  font-size: 16px;
  color: #57606f;
  text-overflow: ellipsis;
  overflow: hidden;
}
.list_task_desc {
  font-size: 14px;
  color: #bdc3c7;
}
.pt-worklog {
  width: 160px;
}
.pt-task-box {
  margin-top: 10px;
}
.pt-task-box-content-item {
  width: auto;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
}
.pt-effort-progress {
  display: flex;
  justify-content: center;
  align-items: center;
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
.item {
  margin: 4px;
}
</style>
<style>
.el-card__body {
  padding: 5px;
}
.el-divider {
  background-color: #57606f;
}
.el-table th {
  padding: 5px 0;
  font-size: 15px;
}
/* google、safari */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button{
  -webkit-appearance: none !important;
  margin: 0;
}
/* Firefox */
input[type="number"]{
  -moz-appearance: textfield;
}
</style>