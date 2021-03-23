<template>
  <div class="task-table">
    <el-card class="box-card" shadow="hover">
      <el-table v-loading="taskTableLoading" :data="taskTableData" style="width: 100%" class="task-table-content">
        <el-table-column prop="taskId" label="Id" v-if="false"></el-table-column>
        <el-table-column prop="taskName" label="Name" width="180" show-overflow-tooltip sortable v-if="taskTableObj.taskTableSource != 'MyTimesheet'"></el-table-column>
        <el-table-column v-if="taskTableObj.taskTableSource == 'MyTimesheet'" label="Worklog" align="left" width="80" >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="Add Worklog" placement="top">
              <el-button @click="addWorklog(scope.row)" type="primary" icon="el-icon-document-add" size="small"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="Name" width="180" show-overflow-tooltip sortable v-if="taskTableObj.taskTableSource == 'MyTimesheet'">
          <template slot-scope="scope">
            <el-button @click="editTask(scope.row)" type="text">{{scope.row.taskName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="taskTitle" label="Title" min-width="250" show-overflow-tooltip></el-table-column>
        <el-table-column prop="taskDeliverableTag" label="Target" align="center" width="150" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="taskStatus" label="Status" align="center" width="100" sortable>
          <template slot-scope="scope">
            <el-tag effect="dark" type="warning" size="mini" v-if="scope.row.taskStatus == 'Drafting'">{{scope.row.taskStatus}}</el-tag>
            <el-tag effect="dark" type="primary" size="mini" v-if="scope.row.taskStatus == 'Planning'">{{scope.row.taskStatus}}</el-tag>
            <el-tag effect="dark" type="success" size="mini" v-if="scope.row.taskStatus == 'Running'" >{{scope.row.taskStatus}}</el-tag>
            <el-tag effect="dark" type="info"    size="mini" v-if="scope.row.taskStatus == 'Done'"    >{{scope.row.taskStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="taskEffort" label="Effort" align="center" width="100" sortable></el-table-column>
        <el-table-column prop="taskEstimation" label="Est" align="center" width="70"></el-table-column>
        <el-table-column prop="taskSprintName" label="Sprint" align="center" width="200" show-overflow-tooltip sortable v-if="taskTableObj.taskTableSource != 'PrjTimesheet'"></el-table-column>
        <el-table-column prop="taskIssueDate" label="Issue Date" align="center" width="150" show-overflow-tooltip sortable v-if="taskTableObj.taskTableSource != 'PrjTimesheet'"></el-table-column>
      </el-table>
      <el-pagination v-if="showPage" @current-change="handlePageChange" :current-page.sync="taskTablePage" :total="taskTableTotal" :page-size="taskTableSize" layout="total, prev, pager, next" style="float: right; margin-top: 5px"></el-pagination>
    </el-card>
    <pmt-task-dialog @refresh="refreshTaskTable" :action="pmtTaskDialogAction"></pmt-task-dialog>
    <external-task-dialog></external-task-dialog>
    <worklog-dialog @refreshTimesheet="refreshTaskTable" :action="worklogAction"></worklog-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import http from '../../../utils/http'
  import utils from '../../../utils/utils'
  import PmtTaskDialog from '../../TaskDialog/PMTTaskDialog'
  import ExternalTaskDialog from '../../TaskDialog/ExternalTaskDialog'
  import WorklogDialog from '../../Timesheet/TimesheetPlugins/WorklogDialog'
  export default {
    name: 'TaskTable',
    data() {
      return {
        taskTableData: [],
        taskTablePage: 1,
        taskTableTotal: 0,
        taskTableSize: 50,
        taskTableLoading: false,
        reqUserId: null,
        reqDate: null,
        pmtTaskDialogAction: null,
        worklogAction: null,
        showPage: true
      }
    },
    components: {
      PmtTaskDialog,
      ExternalTaskDialog,
      WorklogDialog
    },
    props: {
      'taskTableObj': Object
    },
    watch: {
      taskTableObj: {
        handler (val, oldVal) {
          console.log('-----------> Task table action: ', val)
          if(val == '' || val == null || val == undefined) {
            return
          }
          this.getTaskList()
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      async getTaskList () {
        this.$data.taskTableLoading = true
        this.$data.taskTableData = []
        this.$data.taskTableTotal = 0
        var taskTableObj = this.taskTableObj
        var reqParam = {
          reqAssigneeId: taskTableObj.taskTableUserId != undefined ? taskTableObj.taskTableUserId: null,
          reqDate: taskTableObj.taskTableDate != undefined ? taskTableObj.taskTableDate: null,
          reqPage: this.$data.taskTablePage,
          reqSize: this.$data.taskTableSize
        }
        const resCount = await http.get('/tasks/getTasksListCount', reqParam)
        if (resCount != null && resCount.data.status == 0) {
          this.$data.taskTableTotal = resCount.data.data
        }
        const resData = await http.get('/tasks/getTasksList', reqParam)
        if (resData != null && resData.data.status == 0) {
          this.$data.taskTableData = resData.data.data
        }
        this.$data.taskTableLoading = false
      },
      editTask (iTask) {
        console.log('Edit Task ', iTask)
        var taskCategory = iTask.taskCategory
        if (taskCategory.startsWith('PMT')) {
          this.$data.pmtTaskDialogAction = {
            action: 'EDIT',
            taskId: iTask.taskId,
            sprintStatus: iTask.taskSprintStatus,
            datetime: new Date()
          }
        }
      },
      addWorklog (iTask) {
        var userId = this.taskTableObj.taskTableUserId
        var taskId = iTask.taskId
        var taskName = iTask.taskName
        var taskTitle = iTask.taskTitle
        this.$data.worklogAction = {
          action: 'EDIT-WORKLOG-BY-TASK',
          taskId: taskId,
          taskName: taskName,
          taskTitle: taskTitle,
          userId: userId,
          date: new Date()
        }
      },
      handlePageChange (iPage) {
        this.$data.showPage = false
        this.$data.taskTablePage = iPage
        this.getTaskList()
        this.$nextTick(() => {
          this.showPage = true
      })
      },
      refreshTaskTable () {
        this.getTaskList()
        this.$emit('refresh')
      }
    }
  }
</script>

<style scoped>
.task-table {
  width: 100%;
  height: auto;
}
.task-table>>>.el-card__body {
 padding: 3px 10px;
}
.task-table>>>.el-table td {
  padding: 8px 0;
}
.task-table>>>.el-table th {
  padding: 5px 0;
}
.task-table-content>>>.el-button {
  padding: 3px 4px;
}
.task-table-content>>>.el-button--primary {
  font-size: 16px;
}
</style>