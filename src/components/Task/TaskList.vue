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
                  <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" icon="el-icon-plus" size="small" class="tl-bar-item-btn" @click="addNewTask"></el-button>
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
              <el-table-column prop="task_name" label="Number" width="150px" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                   <el-button type="text" @click="editTask(scope.row)">{{scope.row.task_name}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="task_type" label="Type" width="150px" :show-overflow-tooltip="true" :sortable="showSortable"></el-table-column>
              <el-table-column prop="task_desc" label="Description"  :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="task_status" label="Status" width="233px" align="center" :show-overflow-tooltip="true" :sortable="showSortable"></el-table-column>
              <el-table-column prop="task_effort" label="Effort(hrs)" width="123px" align="center" :sortable="showSortable"></el-table-column>
              <el-table-column prop="task_estimation" label="Estimation(hrs)" width="132px" align="center"></el-table-column>
              <el-table-column prop="task_created" label="Created Time" align="center" width="150px" :show-overflow-tooltip="true" :sortable="showSortable"></el-table-column>
              <el-table-column fixed="right" label="Edit" width="100" align="center">
                <template slot-scope="scope">
                  <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" size="small" @click="editTask(scope.row)" icon="el-icon-edit">Edit</el-button>
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
    <el-dialog :title="taskDialogTitle" :visible.sync="editTaskVisible" width="50%" style="min-width: 500px;" :close-on-click-modal="false" class="tl-taskform">
      <el-form ref="form" :model="form" label-width="120px" class="tl-edit-form" >
        <el-form-item label="Parent Task">
          <el-button type="text" class="tl-edit-form-parent-task" :disabled="form.formParent != 'N/A'?false:true" @click="editParentTask">{{form.formParent}}</el-button>
        </el-form-item>
        <el-form-item label="Number">
          <el-input v-model="form.formNumber" :disabled="showForExistingTask" v-show="showNumber"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Task Level">
              <span style="font-size: 17px">{{form.formTaskLevel}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Task Level">
              <span style="font-size: 17px">{{form.formTaskLevel}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Type">
          <el-select v-model="form.formType" v-show="showForExistingTask" disabled>
            <el-option v-for="(tasktype, index) in taskTypeArray" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
          </el-select>
          <el-select v-model="form.formType" v-show="showForNewTask">
            <el-option v-for="(tasktype, index) in taskTypeArrayForPMT" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Description">
          <el-input type="textarea" v-model="form.formDesc" :rows="4" :disabled="taskDisabledStaus"></el-input>
        </el-form-item>
        <el-form-item label="Status" v-show="showForPmtTask">
          <el-select v-model="form.formStatus">
            <el-option label="Drafting" value="Drafting"></el-option>
            <el-option label="Planning" value="Planning"></el-option>
            <el-option label="Running" value="Running"></el-option>
            <el-option label="Done" value="Done"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Status" v-show="showForDefaultTask">
           <el-input v-model="form.formStatus" disabled></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Effort">
              <el-col :span="21">
                <el-input v-model="form.formEffort" disabled></el-input>
              </el-col>
              <el-col :span="3">
                <span class="span-format">hrs</span>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Estimation">
              <el-col :span="21">
                <el-input v-model="form.formEstimation" :disabled="taskDisabledStaus"></el-input>
              </el-col>
              <el-col :span="3">
                <span class="span-format">hrs</span>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Progress" v-show="showForExistingTask">
          <el-progress class="tl-edit-form-progress" :text-inside="true" :stroke-width="24" :percentage="form.formPercentage" status="success"></el-progress>
        </el-form-item>
        <el-form-item v-show="showForExistingTask">
          <el-button size="small" icon="el-icon-plus" @click="addNewSubTask" :disabled="disableCreateSubTask">Create Sub Task</el-button>
        </el-form-item>
        <el-form-item label="Sub Tasks" v-if="form.formSubTasks.length > 0" v-show="showForExistingTask">
          <el-card class="box-card tl-box-card-subtask" :body-style="{padding: '0px'}" style="margin-top:4px" shadow="never">
            <el-table :data="form.formSubTasks" fit max-height="300" class="sub-task-table">
              <el-table-column prop="task_id" v-if="false"></el-table-column>
              <el-table-column type="index" :index="modifyIndex" width="40"></el-table-column>
              <el-table-column :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-row style="cursor: pointer;" :gutter="10"  @click.native="editTask(scope.row)">
                    <el-col :span="23" class="single-line">
                      <span style="font-weight: bold">{{scope.row.task_name}}</span>
                      <span style="margin-left:5px"> {{scope.row.task_desc}}</span>
                    </el-col>
                    <el-col :span="1"><i class="el-icon-arrow-right"></i></el-col>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-form-item>
        <el-form-item label="Worklog History" v-show="showForExistingTask">
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
        <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" size="medium" @click="logWorkDone" v-show="showForExistingTask">Log Work Done</el-button>
        <el-button :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="medium" @click="submitTask" v-show="showForPmtTask">Submit</el-button>
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
        <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" @click="submitWorklog">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
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
      showForPmtTask: false,
      showForDefaultTask: true,
      showForNewTask: false,
      showForExistingTask: true,
      showPagination: true,
      showSortable: false,
      showForHistory: true,
      form: {
        formId: 0,
        formParent: '',
        formNumber: '',
        formType: '',
        formDesc: '',
        formStatus: '',
        formEffort: 0,
        formEstimation: 0,
        formPercentage: 0,
        formTaskLevel: 1,
        formAssignTeam: '',
        formSubTasks: []
      },
      taskTypeArray: [],
      taskTypeArrayForPMT: [],
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
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
      showNumber: true,
      disableCreateSubTask: false,
      userLevel: this.$store.getters.getUserLevel,
      userRole: this.$store.getters.getUserRole
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
      this.$data.taskTypeArray = []
      this.$data.taskTypeArrayForPMT = []
      const res = await http.get('/tasks/getAllTaskType')
      if (res.data.status === 0) {
        this.$data.taskTypeArray = res.data.data
        var taskTypeList = res.data.data
        for (var i = 0; i < taskTypeList.length; i++) {
          if (taskTypeList[i].type_prefix !== '' && taskTypeList[i].type_prefix !== null) {
            this.$data.taskTypeArrayForPMT.push(taskTypeList[i])
          }
        }
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
      this.resetTaskForm()
      this.getTaskType()
      this.getTeamList()
      var taskId = taskRow.task_id
      this.$data.showForHistory = true
      this.$data.editTaskVisible = true
      const res = await http.post('/tasks/getTaskById', {
        tId: taskId
      })
      if (res.data.status === 0) {
        var taskData = res.data.data[0]
        var taskCreator = taskData.task_creator
        if (taskCreator === 'PMT') {
          this.$data.showForPmtTask = true
          this.$data.showForDefaultTask = false
          this.$data.taskDisabledStaus = false
        } else {
          this.$data.showForPmtTask = false
          this.$data.showForDefaultTask = true
          this.$data.taskDisabledStaus = true
        }
        this.$data.showForNewTask = false
        this.$data.showForExistingTask = true
        this.$data.taskDialogTitle = 'Edit Task - ' + taskData.task_name
        if (Number(taskData.task_level) === 4) {
          this.$data.disableCreateSubTask = true
        }
        this.$data.form.formId = taskData.task_id
        this.$data.form.formNumber = taskData.task_name
        switch (taskData.task_level) {
          case 1: this.$data.form.formTaskLevel = taskData.task_level + ' (Business Opportunity)'
            break
          case 2: this.$data.form.formTaskLevel = taskData.task_level + ' (Business Implementation)'
            break
          case 3: this.$data.form.formTaskLevel = taskData.task_level + ' (Excutive Task)'
            break
          case 4: this.$data.form.formTaskLevel = taskData.task_level + ' (Workable Task)'
            break
          default: this.$data.form.formTaskLevel = taskData.task_level
        }
        this.$data.form.formParent = taskData.task_parenttaskname
        this.$data.form.formType = taskData.task_type_id
        this.$data.form.formDesc = taskData.task_desc
        this.$data.form.formStatus = taskData.task_status
        this.$data.form.formEffort = taskData.task_currenteffort
        this.$data.form.formEstimation = taskData.task_totaleffort
        this.$data.form.formAssignTeam = taskData.task_assign_team_id
        this.$data.form.formPercentage = Number(taskData.task_progress_nosymbol)
        const res1 = await http.post('/tasks/getSubTaskByParentTaskName', {
          tTaskName: taskData.task_name
        })
        if (res1.data.status === 0) {
          this.$data.form.formSubTasks = res1.data.data
        } else {
          this.$data.form.formSubTasks = []
        }
      }
    },
    async editParentTask () {
      var reqParentTask = this.$data.form.formParent
      this.resetTaskForm()
      this.getTaskType()
      this.getTeamList()
      this.$data.showForHistory = true
      this.$data.editTaskVisible = true
      const res = await http.post('/tasks/getTaskByParentTask', {
        tParentTask: reqParentTask
      })
      if (res.data.status === 0) {
        var taskData = res.data.data[0]
        var taskCreator = taskData.task_creator
        if (taskCreator === 'PMT') {
          this.$data.showForPmtTask = true
          this.$data.showForDefaultTask = false
          this.$data.taskDisabledStaus = false
        } else {
          this.$data.showForPmtTask = false
          this.$data.showForDefaultTask = true
          this.$data.taskDisabledStaus = true
        }
        this.$data.showForNewTask = false
        this.$data.showForExistingTask = true
        this.$data.taskDialogTitle = 'Edit Task - ' + taskData.task_name
        this.$data.form.formId = taskData.task_id
        this.$data.form.formNumber = taskData.task_name
        switch (taskData.task_level) {
          case 1: this.$data.form.formTaskLevel = taskData.task_level + ' (Business Opportunity)'
            break
          case 2: this.$data.form.formTaskLevel = taskData.task_level + ' (Business Implementation)'
            break
          case 3: this.$data.form.formTaskLevel = taskData.task_level + ' (Excutive Task)'
            break
          case 4: this.$data.form.formTaskLevel = taskData.task_level + ' (Workable Task)'
            break
          default: this.$data.form.formTaskLevel = taskData.task_level
        }
        this.$data.form.formParent = taskData.task_parenttaskname
        this.$data.form.formType = taskData.task_type_id
        this.$data.form.formDesc = taskData.task_desc
        this.$data.form.formStatus = taskData.task_status
        this.$data.form.formEffort = taskData.task_currenteffort
        this.$data.form.formEstimation = taskData.task_totaleffort
        this.$data.form.formAssignTeam = taskData.task_assign_team_id
        this.$data.form.formPercentage = Number(taskData.task_progress_nosymbol)
        const res1 = await http.post('/tasks/getSubTaskByParentTaskName', {
          tTaskName: taskData.task_name
        })
        if (res1.data.status === 0) {
          this.$data.form.formSubTasks = res1.data.data
        } else {
          this.$data.form.formSubTasks = []
        }
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
      this.$data.form.formTaskLevel = 1
      this.$data.form.formParent = 'N/A'
      this.$data.form.formType = ''
      this.$data.form.formDesc = ''
      this.$data.form.formStatus = 'Drafting'
      this.$data.form.formEffort = 0
      this.$data.form.formEstimation = 0
      this.$data.form.formAssignTeam = ''
      this.$data.form.formPercentage = 0
      this.$data.showHistory = false
      this.$data.showNumber = true
      this.$data.disableCreateSubTask = false
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
      var reqFormParent = this.$data.form.formParent
      console.log(reqFormParent)
      var reqFormName = this.$data.form.formNumber
      var reqFormTaskLevel = this.$data.form.formTaskLevel
      var reqFormTypeId = this.$data.form.formType
      if (reqFormTypeId === null || reqFormTypeId === '') {
        this.showWarnMessage('Warning', 'Please select task type')
        return
      }
      var reqFormDesc = this.$data.form.formDesc
      var reqFormStatus = this.$data.form.formStatus
      if (reqFormStatus === null || reqFormStatus === '') {
        // this.showWarnMessage('Warning', 'Please select task status')
        reqFormStatus = 'Drafting'
      }
      var reqFormEffort = this.$data.form.formEffort
      var reqFormEstimation = this.$data.form.formEstimation
      if (reqFormTaskLevel === 4) {
        if (reqFormEstimation > 18) {
          this.showWarnMessage('Warning', 'Level 4 task elstimation could not over 18 hrs!')
          return
        }
      }
      if (reqFormTaskLevel === 3) {
        if (!this.$data.form.formSubTasks.length > 0) {
          if (reqFormEstimation > 18) {
            this.showWarnMessage('Warning', 'Level 3 (No Sub Task) task elstimation could not over 18 hrs!')
            return
          }
        }
      }
      const res = await http.post('/tasks/addOrUpdateTask', {
        tParent: reqFormParent,
        tName: reqFormName,
        tLevel: reqFormTaskLevel,
        tDescription: reqFormDesc,
        tTaskTypeId: reqFormTypeId,
        tStatus: reqFormStatus,
        tEffort: reqFormEffort,
        tEstimation: reqFormEstimation,
        tAssignTeamId: 1
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
      if (this.$data.userLevel > 8 || this.$data.userRole !== 'Admin') {
        this.showWarnMessage('Warning', 'No right to create Level 1 task!')
        return
      }
      this.$data.taskDialogTitle = 'Add New Task'
      this.$data.taskDisabledStaus = false
      this.resetTaskForm()
      this.getTaskType()
      this.getTeamList()
      this.$data.showForPmtTask = true
      this.$data.showForDefaultTask = false
      this.$data.showForExistingTask = false
      this.$data.showForNewTask = true
      this.$data.editTaskVisible = true
      this.$data.showNumber = true
    },
    addNewSubTask () {
      var taskLevel = this.$data.form.formTaskLevel
      var newTaskLevel = Number(taskLevel) + 1
      if (newTaskLevel === '2') {
        if (this.$data.userLevel > 10 || this.$data.userRole !== 'Admin') {
          this.showWarnMessage('Warning', 'No right to create Level 2 task!')
          return
        }
      }
      this.$data.taskDialogTitle = 'Add New Sub Task'
      this.$data.taskDisabledStaus = false
      var parentTask = this.$data.form.formNumber
      // var taskNumber = this.$data.form.formNumber
      var taskType = this.$data.form.formType
      this.resetTaskForm()
      this.$data.form.formParent = parentTask
      this.$data.form.formTaskLevel = newTaskLevel
      this.$data.form.formType = taskType
      this.getTaskType()
      this.getTeamList()
      this.$data.showForPmtTask = true
      this.$data.showForDefaultTask = false
      this.$data.showForExistingTask = false
      this.$data.showForNewTask = true
      this.$data.showNumber = false
      this.$data.editTaskVisible = true
    },
    async changeSearchTaskType () {
      this.searchTask()
    },
    /* Base on requirement, no need to auto generate task number when select task type
    async changeNewTaskType () {
      const res = await http.post('/tasks/getNewTaskNumberByType', {
        tTaskTypeId: this.$data.form.formType
      })
      if (res.data.status === 0) {
        this.$data.form.formNumber = res.data.data.task_name
      }
    },
    */
    modifyIndex (index) {
      return index + 1 + '.'
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
.tl-edit-form-parent-task {
  font-size: 17px;
  text-decoration: underline;
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
.span-format {
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
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
/* In order to hide table header because "show-header" and "max-height" use together will throw error */
.sub-task-table .el-table__header{
  display:none
}
.tl-taskform .el-dialog__title{
  font-size: 21px;
}
</style>
