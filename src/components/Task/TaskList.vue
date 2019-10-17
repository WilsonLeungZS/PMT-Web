<template>
  <div class="tl-body">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-tickets content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="tl-bar">
          <el-col :span="14">
            <div class="tl-bar-item">
              <el-input placeholder="Search task..." v-model="inputTaskVal" class="tl-bar-item-input" clearable @keyup.enter.native="searchTask">
                <el-select v-model="selectTaskType" slot="prepend" placeholder="Select" class="tl-bar-item-input-select" @change="changeSearchTaskType">
                  <el-option label="All Types" value="0"></el-option>
                  <el-option v-for="(tasktype, index) in taskTypeArray" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="searchTask"></el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="tl-bar-item">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="New Task" placement="top-start">
                  <el-button type="primary" icon="el-icon-plus" size="small" class="tl-bar-item-btn" @click="addNewTask"></el-button>
                </el-tooltip>
                <!--<el-tooltip class="item" effect="dark" content="Export Tasks" placement="top-start">
                  <el-button type="success" icon="el-icon-download" size="small" class="tl-bar-item-btn"></el-button>
                </el-tooltip>-->
              </el-button-group>
            </div>
          </el-col>
          <el-col :span="1"><div class="tl-bar-item"></div></el-col>
        </el-row>
        <el-row class="tl-main">
          <el-col :span="24">
            <el-table v-loading="loading" :data="tasklistData" class="tl-main-table" fit empty-text="No Data">
              <el-table-column prop="task_id" label="Id" v-if="false"></el-table-column>
              <el-table-column prop="task_name" label="Number" width="150px" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="task_type" label="Type" width="150px" :show-overflow-tooltip="true" :sortable="showSortable"></el-table-column>
              <el-table-column prop="task_desc" label="Description"  :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="task_status" label="Status" width="180px" align="center" :show-overflow-tooltip="true" :sortable="showSortable"></el-table-column>
              <el-table-column prop="task_effort" label="Effort(hrs)" width="123px" align="center" :sortable="showSortable"></el-table-column>
              <el-table-column prop="task_estimation" label="Estimation(hrs)" width="132px" align="center"></el-table-column>
              <el-table-column prop="task_created" label="Created Time" align="center" width="150px" :show-overflow-tooltip="true" :sortable="showSortable"></el-table-column>
              <el-table-column fixed="right" label="Edit" width="100" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="editTask(scope.row)" icon="el-icon-edit">Edit</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row class="tl-pagination" v-show="showPagination">
          <el-col :span="24" class="tl-pagination-col">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[20, 50, 100, 500]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalSize">
            </el-pagination>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog :title="taskDialogTitle" :visible.sync="editTaskVisible" width="50%" style="min-width: 500px;" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="120px" class="tl-edit-form" >
        <el-form-item label="Number" v-show="showForNewTask">
          <el-input v-model="form.formNumber" :disabled="disabledNumber"></el-input>
        </el-form-item>
        <el-form-item label="Number" v-show="showForExistingTask">
          <span style="font-size: 17px">{{form.formNumber}}</span>
        </el-form-item>
        <el-form-item label="Parent">
          <el-button type="text" style="font-size: 15px;text-decoration: underline">{{form.formParent}}</el-button>
        </el-form-item>
        <el-form-item label="Type">
          <el-select v-model="form.formType" :disabled="taskDisabledStaus">
            <el-option v-for="(tasktype, index) in taskTypeArray" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Description">
          <el-input type="textarea" v-model="form.formDesc" :rows="4" :disabled="taskDisabledStaus"></el-input>
        </el-form-item>
        <el-form-item label="Status" v-show="showForNewTask">
          <el-select v-model="form.formStatus">
            <el-option label="Open" value="Open"></el-option>
            <el-option label="In Progress" value="In Progress"></el-option>
            <el-option label="Pending" value="Pending"></el-option>
            <el-option label="Paused" value="Paused"></el-option>
            <el-option label="Completed" value="Completed"></el-option>
            <el-option label="Closed" value="Closed"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Status" v-show="showForExistingTask">
          <el-input v-model="form.formStatus" disabled></el-input>
        </el-form-item>
        <el-form-item label="Effort">
          <el-col :span="10">
            <el-col :span="19">
              <el-input v-model="form.formEffort" disabled></el-input>
            </el-col>
            <el-col :span="5" style="text-align: center; font-size: 16px;">
              <span>hrs</span>
            </el-col>
          </el-col>
          <el-col :span="14">
            <el-form-item label="Estimation">
              <el-col :span="19">
                <el-input v-model="form.formEstimation" :disabled="taskDisabledStaus"></el-input>
              </el-col>
              <el-col :span="5" style="text-align: center; font-size: 16px;">
                <span>hrs</span>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="Progress">
          <el-progress class="tl-edit-form-progress" :text-inside="true" :stroke-width="24" :percentage="form.formPercentage" status="success"></el-progress>
        </el-form-item>
        <el-form-item label="Assign Team">
          <el-select v-model="form.formAssignTeam" :disabled="taskDisabledStaus">
            <el-option v-for="(assignteam, index) in taskAssignTeamArray" :key="index" :label="assignteam.team_name" :value="assignteam.team_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Sub Tasks" v-if="form.formSubTasks.length > 0" v-show="showForExistingTask">
          <el-card class="box-card" :body-style="{padding: '0px'}" style="margin-top:4px" shadow="never">
            <el-table :data="form.formSubTasks" fit :show-header="false">
              <el-table-column prop="task_id" v-if="false"></el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-row style="cursor: pointer;"  @click.native="editTask(scope.row)">
                    <el-col :span="23"><span>{{scope.row.task_number}}</span></el-col>
                    <el-col :span="1"><i class="el-icon-arrow-right"></i></el-col>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-form-item>
        <el-form-item label="Worklog History" v-show="showForHistory">
          <el-button icon="el-icon-more" size="small" type="text" @click="showWorklogHistory" style="font-size: 18px"></el-button>
        </el-form-item>
      </el-form>
      <el-card class="box-card tl-history-box-card" v-show="showHistory">
        <el-timeline>
          <el-timeline-item v-for="(history, index) in histories" :key="index" :timestamp="history.timestamp"
            icon="el-icon-star-on" size="large" placement="top" type="primary" class="tl-history">
            {{history.content}}
          </el-timeline-item>
        </el-timeline>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="editTaskVisible = false">Cancel</el-button>
        <el-button type="success" size="medium" @click="logWorkDone" v-show="showLogWorkDoneBtn">Log Work Done</el-button>
        <el-button type="primary" size="medium" @click="submitTask" v-show="showForNewTask">Submit</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Add Worklog" :visible.sync="worklogFormVisible" width="35%" :close-on-click-modal="false">
      <el-form :model="wlForm" label-width="70px" class="tl-worklog-form">
        <el-form-item label="Task" >
          <span style="font-size: 17px">{{wlForm.worklog_task}}</span>
        </el-form-item>
        <el-form-item label="Date">
          <el-date-picker v-model="wlForm.worklog_date" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="Effort" >
          <el-col :span="5">
            <el-input v-model="wlForm.worklog_effort" @keyup.native="number"></el-input>
          </el-col>
          <el-col :span="5">
            <span style="text-align:center; font-size:16px; margin-left:10px">Hrs</span>
          </el-col>
        </el-form-item>
        <el-form-item label="Remark" >
          <el-input type="textarea" :rows="6" v-model="wlForm.worklog_remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="worklogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitWorklog">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from '../../utils/http'
export default {
  name: 'TaskList',
  data () {
    return {
      header1: 'Task List',
      isActive: true,
      inputTaskVal: '',
      selectTaskType: '0',
      currentPage: 1,
      pageSize: 20,
      totalSize: 0,
      tasklistData: [],
      loading: false,
      editTaskVisible: false,
      showForNewTask: false,
      showForExistingTask: true,
      showPagination: true,
      showSortable: false,
      showLogWorkDoneBtn: true,
      showForHistory: true,
      form: {
        formId: 0,
        formNumber: '',
        formParent: 'N/A',
        formType: '',
        formDesc: '',
        formStatus: '',
        formEffort: 0,
        formEstimation: 0,
        formPercentage: 0,
        formAssignTeam: '',
        formSubTasks: []
        /* formSubTasks: [
          {task_id: 10, task_number: 'CGM190001 - Analysis'},
          {task_id: 12, task_number: 'CGM190001 - Design'},
          {task_id: 13, task_number: 'CGM190001 - Build'},
          {task_id: 14, task_number: 'CGM190001 - Test'},
          {task_id: 15, task_number: 'CGM190001 - Deploy'}
        ] */
      },
      taskTypeArray: [],
      taskAssignTeamArray: [],
      showHistory: false,
      histories: [],
      worklogFormVisible: false,
      wlForm: {
        worklog_task: '',
        worklog_task_id: 0,
        worklog_date: '',
        worklog_effort: 0,
        worklog_remark: ''
      },
      taskDialogTitle: 'Edit Task',
      taskDisabledStaus: true,
      disabledNumber: false
    }
  },
  methods: {
    async getTaskList (iPage, iSize) {
      // console.log('Get task of page: ' + iPage + ', Size: ' + iSize + 'Loading: ' + this.$data.loading)
      this.$data.loading = true
      this.$data.showPagination = true
      this.$data.showSortable = false
      const res = await http.get('/tasks/getTotalTaskSize')
      if (res.data.status === 0) {
        this.$data.totalSize = res.data.data[0].task_total_size
        const res1 = await http.get('/tasks/getTaskList', {
          reqPage: iPage,
          reqSize: iSize
        })
        if (res1.data.status === 0) {
          this.$data.tasklistData = res1.data.data
        }
      } else {
        this.$data.totalSize = 0
        this.$data.tasklistData = []
      }
      this.$data.loading = false
    },
    async getTaskType () {
      const res = await http.get('/tasks/getAllTaskType')
      if (res.data.status === 0) {
        this.$data.taskTypeArray = res.data.data
      } else {
        this.$data.taskTypeArray = []
      }
    },
    async getTeamList () {
      const res = await http.get('/users/getTeamList')
      if (res.data.status === 0) {
        res.data.data.splice(0, 1)
        this.$data.taskAssignTeamArray = res.data.data
      } else {
        this.$data.taskAssignTeamArray = []
      }
    },
    async editTask (taskRow) {
      this.$data.taskDialogTitle = 'Edit Task'
      this.resetTaskForm()
      this.getTaskType()
      this.getTeamList()
      var taskId = taskRow.task_id
      this.$data.showLogWorkDoneBtn = true
      this.$data.showForHistory = true
      this.$data.editTaskVisible = true
      const res = await http.post('/tasks/getTaskById', {
        tId: taskId
      })
      if (res.data.status === 0) {
        var taskData = res.data.data[0]
        var taskCreator = taskData.task_creator
        if (taskCreator === 'PMT') {
          this.$data.showForNewTask = true
          this.$data.taskDisabledStaus = false
          this.$data.showForExistingTask = false
          this.$data.disabledNumber = true
        } else {
          this.$data.showForNewTask = false
          this.$data.taskDisabledStaus = true
          this.$data.showForExistingTask = true
        }
        this.$data.form.formId = taskData.task_id
        this.$data.form.formNumber = taskData.task_name
        this.$data.form.formParent = taskData.task_parenttaskname
        this.$data.form.formType = taskData.task_type_id
        this.$data.form.formDesc = taskData.task_desc
        this.$data.form.formStatus = taskData.task_status
        this.$data.form.formEffort = taskData.task_currenteffort
        this.$data.form.formEstimation = taskData.task_totaleffort
        this.$data.form.formAssignTeam = taskData.task_assign_team_id
        this.$data.form.formPercentage = Number(taskData.task_progress_nosymbol)
      }
    },
    editSubTask (row, column, event) {
      console.log('Click 11')
    },
    handleSizeChange (val) {
      this.$data.currentPage = 1
      this.$data.pageSize = val
      this.getTaskList(1, val)
    },
    handleCurrentChange (val) {
      var pageSize = this.$data.pageSize
      this.$data.currentPage = val
      this.getTaskList(val, pageSize)
    },
    async showWorklogHistory () {
      this.$data.histories = []
      this.$data.showHistory = !this.$data.showHistory
      var reqTaskId = this.$data.form.formId
      const res = await http.post('/worklogs/getWorklogHistoryByTaskId', {
        wTaskId: reqTaskId
      })
      if (res.data.status === 0) {
        this.$data.histories = res.data.data
      }
    },
    resetTaskForm () {
      this.$data.form.formId = 0
      this.$data.form.formNumber = ''
      this.$data.form.formParent = 'N/A'
      this.$data.form.formType = ''
      this.$data.form.formDesc = ''
      this.$data.form.formStatus = ''
      this.$data.form.formEffort = 0
      this.$data.form.formEstimation = 0
      this.$data.form.formAssignTeam = ''
      this.$data.form.formPercentage = 0
      this.$data.showHistory = false
      this.$data.wlForm.worklog_task_id = 0
      this.$data.wlForm.worklog_task = ''
      this.$data.wlForm.worklog_date = this.getCurrentDate()
      this.$data.wlForm.worklog_effort = 0
      this.$data.wlForm.worklog_remark = ''
    },
    async searchTask () {
      var reqTaskTypeId = this.$data.selectTaskType
      var reqTaskKeyword = this.$data.inputTaskVal
      if (reqTaskKeyword === '' && reqTaskTypeId === '0') {
        this.$data.pageSize = 20
        this.$data.currentPage = 1
        this.getTaskList(1, 20)
      } else {
        this.$data.showPagination = false
        this.$data.showSortable = true
        this.$data.loading = true
        const res = await http.post('/tasks/getTaskByName', {
          tTaskName: reqTaskKeyword,
          tTaskTypeId: reqTaskTypeId
        })
        if (res.data.status === 0) {
          this.$data.tasklistData = res.data.data
        } else {
          this.$data.tasklistData = []
        }
        this.$data.loading = false
      }
    },
    async submitTask () {
      var reqFormName = this.$data.form.formNumber
      if (reqFormName === null || reqFormName === '') {
        this.showWarnMessage('Warning', 'Task number could not be empty')
        return
      }
      var reqFormParent = this.$data.form.formParent
      var reqFormTypeId = this.$data.form.formType
      var reqFormDesc = this.$data.form.formDesc
      var reqFormStatus = this.$data.form.formStatus
      var reqFormEffort = this.$data.form.formEffort
      var reqFormEstimation = this.$data.form.formEstimation
      var reqFormAssignTeamId = this.$data.form.formAssignTeam
      const res = await http.post('/tasks/addOrUpdateTask', {
        tName: reqFormName,
        tParent: reqFormParent,
        tDescription: reqFormDesc,
        tTaskTypeId: reqFormTypeId,
        tStatus: reqFormStatus,
        tEffort: reqFormEffort,
        tEstimation: reqFormEstimation,
        tAssignTeamId: reqFormAssignTeamId
      })
      if (res.data.status === 0) {
        this.$message({
          message: 'Task created successfully!',
          type: 'success'
        })
      } else {
        this.$message({
          message: 'Task updated successfully!',
          type: 'success'
        })
      }
      this.$data.editTaskVisible = false
      this.resetTaskForm()
      this.$data.pageSize = 20
      this.$data.currentPage = 1
      this.getTaskList(1, 20)
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
      var formEffort = this.$data.wlForm.worklog_effort
      if (formEffort > 0) {
        formEffort = Number(formEffort)
      } else {
        formEffort = formEffort.replace(/[^\d]/g, '')
        formEffort = formEffort.replace('.', '')
        this.$data.wlForm.worklog_effort = formEffort
      }
    },
    logWorkDone () {
      this.$data.editTaskVisible = false
      this.$data.worklogFormVisible = true
      this.$data.wlForm.worklog_task_id = this.$data.form.formId
      this.$data.wlForm.worklog_task = this.$data.form.formNumber
      console.log('Current Date: ' + this.getCurrentDate())
      this.$data.wlForm.worklog_date = this.getCurrentDate()
    },
    getCurrentDate () {
      var date = new Date()
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      return date.getFullYear() + '-' + month + '-' + day
    },
    async submitWorklog () {
      console.log('click')
      var reqUserId = this.$store.getters.getUserId
      var reqTaskId = this.$data.wlForm.worklog_task_id
      var reqRemark = this.$data.wlForm.worklog_remark
      var reqWorklogEffort = Number(this.$data.wlForm.worklog_effort)
      var reqWorklogDate = this.$data.wlForm.worklog_date
      if (reqTaskId === 0) {
        this.showWarnMessage('Warning', 'Task invalid!')
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
      const res = await http.post('/worklogs/addOrUpdateWorklog', {
        wUserId: reqUserId,
        wTaskId: reqTaskId,
        wWorklogMonth: reqWorklogMonth,
        wWorklogDay: reqWorklogDay,
        wEffort: reqWorklogEffort,
        wRemark: reqRemark
      })
      if (res.data.status === 0) {
        this.$data.worklogFormVisible = false
        this.$message({
          message: 'Worklog added successfully!',
          type: 'success'
        })
        this.resetTaskForm()
        this.$data.pageSize = 20
        this.$data.currentPage = 1
        this.getTaskList(1, 20)
      } else {
        this.showWarnMessage('Warning', 'Fail to add worklog!')
      }
    },
    addNewTask () {
      this.$data.taskDialogTitle = 'Add New Task'
      this.$data.taskDisabledStaus = false
      this.resetTaskForm()
      this.getTaskType()
      this.getTeamList()
      this.$data.showForExistingTask = false
      this.$data.showForNewTask = true
      this.$data.editTaskVisible = true
      this.$data.disabledNumber = false
    },
    async changeSearchTaskType () {
      console.log('Changed Type: ' + this.$data.selectTaskType)
      this.searchTask()
    }
  },
  created () {
    this.$data.pageSize = 20
    this.$data.currentPage = 1
    this.getTaskList(1, 20)
    this.getTaskType()
  }
}
</script>

<style scoped>
.tl-body {
  width: 100%;
  height: auto;
}
.el-main {
  color: #333;
  text-align: center;
  height:auto;
  padding: 0 5px;
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
/* Task list bar style */
.tl-bar {
  height: 50px;
  margin-top: 10px;
}
.tl-bar-item {
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.tl-bar-item-btn {
  font-size: 20px;
}
.tl-bar-item-input {
  width: 98%;
  background-color: #fff;
  border-radius: 30px;
  color: black;
}
.tl-bar-item-input-select {
  width: 150px;
}
/* Task list main style */
.tl-main {
  height: auto;
  width: 100%;
  margin-top: 10px;
}
.tl-main-table {
  width:100%;
  height: auto;
}
/*Task list pagination style*/
.tl-pagination {
  height: 35px;
  width: 100%;
  margin-top: 10px;
}
.tl-pagination-col {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.tl-edit-form {
  text-align: left;
}
.tl-edit-form-progress {
  height: 100%;
  line-height: 40px;
}
.tl-history {
  text-align:left;
}
.tl-history-box-card {
  height: 200px;
  overflow: auto;
}
.tl-worklog-form {
  text-align: left;
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
.single-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.view-hide {
  display: none;
}
</style>
<style>
.el-dialog__body {
  padding: 10px 20px;
}
.el-table td, .el-table th {
  padding: 5px 0;
}
.el-form-item {
  margin-bottom: 11px;
}
.el-dialog__header {
  padding-top: 15px;
}
</style>
