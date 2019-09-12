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
              <el-row :gutter="10" type="flex" justify="flex-start">
                <el-col :span="3">
                  <el-date-picker v-model="monthSelect" type="month" placeholder="Select" style="width:100%"
                  @change="changePtMonth"></el-date-picker>
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
                    <el-button type="success" icon="el-icon-search" circle></el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="1">
                  <el-tooltip effect="dark" content="Export Report" placement="top">
                    <el-button type="primary" icon="el-icon-download" circle></el-button>
                  </el-tooltip>
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
                <el-button style="float: right; padding: 3px 0" type="text">Refresh</el-button>
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
                  <el-form-item label="Assign Team">
                     <el-col :span="24" class="pt-task-box-content-item">
                      <span>{{taskForm.taskAssignTeam}}</span>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="Effort">
                     <el-col :span="24" class="pt-task-box-content-item">
                      <span>{{taskForm.taskEffort}} / {{taskForm.taskEstimation}} hrs</span>
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
                    <el-button size="small" type="primary" icon="el-icon-edit">Move Effort To Next Month</el-button>
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
export default {
  name: 'Charts',
  data () {
    return {
      header1: 'Project Management',
      header2: 'Timesheet Management',
      isActive: true,
      monthSelect: '',
      taskSelect: '',
      taskWorklogList: [
        {worklog_id: 1, worklog_user: 'zhongshu.liang', worklog_date: '2019-09-10', worklog_effort: 10, worklog_change_effort: 10},
        {worklog_id: 2, worklog_user: 'zhongshu.liang', worklog_date: '2019-09-10', worklog_effort: 10, worklog_change_effort: 10},
        {worklog_id: 3, worklog_user: 'zhongshu.liang', worklog_date: '2019-09-10', worklog_effort: 10, worklog_change_effort: 10},
        {worklog_id: 4, worklog_user: 'zhongshu.liang', worklog_date: '2019-09-10', worklog_effort: 10, worklog_change_effort: 10},
        {worklog_id: 5, worklog_user: 'zhongshu.liang', worklog_date: '2019-09-10', worklog_effort: 10, worklog_change_effort: 10}
      ],
      labelPosition: 'left',
      taskForm: {
        taskId: 0,
        taskName: 'CGM190012',
        taskDescription: 'Task for ACN-App-BSS team to create SAP role for new staff Steve Sze, the role same with Much Yeung (Staff no. 9028)',
        taskStatus: 'Awaiting Internal Action',
        taskType: 'Change',
        taskEffort: 10,
        taskEstimation: 100,
        taskAssignTeam: 'BSS',
        taskCurrentEffort: 20
      }
    }
  },
  methods: {
    switchToPM () {
      this.$data.isActive = false
      this.$router.push({path: 'PrjManagement'})
    },
    changePtMonth (iDate) {
      this.$data.monthSelect = iDate
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
      this.$data.taskForm.taskId = item.id
      this.$data.taskSelect = item.value
    },
    clearTask () {
      this.$data.taskIdSelect = 0
      this.$data.taskSelect = ''
    }
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
