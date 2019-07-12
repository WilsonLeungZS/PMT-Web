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
              <el-input placeholder="Search task..." v-model="inputTaskVal" class="tl-bar-item-input" clearable>
                <el-select v-model="selectTaskType" slot="prepend" placeholder="Select" class="tl-bar-item-input-select">
                  <el-option label="All" value="0"></el-option>
                  <el-option label="Change" value="1"></el-option>
                  <el-option label="Incident" value="2"></el-option>
                  <el-option label="ITSR" value="3"></el-option>
                  <el-option label="Service Request" value="4"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="tl-bar-item">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="New Task" placement="top-start">
                  <el-button type="success" icon="el-icon-plus"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Import Task" placement="top-start">
                  <el-button type="primary" icon="el-icon-upload2"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Export Task" placement="top-start">
                  <el-button type="warning" icon="el-icon-download"></el-button>
                </el-tooltip>
              </el-button-group>
            </div>
          </el-col>
          <el-col :span="1"><div class="tl-bar-item"></div></el-col>
        </el-row>
        <el-row class="tl-main">
          <el-col :span="24">
            <el-table :data="tasklistData" class="tl-main-table" fit>
              <el-table-column prop="task_id" label="Id" v-if="false"></el-table-column>
              <el-table-column prop="task_number" label="Number" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="task_type" label="Type" ></el-table-column>
              <el-table-column prop="task_desc" label="Description" width="400px" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="task_status" label="Status"></el-table-column>
              <el-table-column prop="task_effort" label="Effort" width="80px" align="center"></el-table-column>
              <el-table-column prop="task_estimation" label="Estimation" width="100px" align="center"></el-table-column>
              <el-table-column prop="task_assign_team" label="Assign team" align="center"></el-table-column>
              <el-table-column fixed="right" label="Edit" width="100" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="editTask(scope.row)">Edit</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row class="tl-pagination">
          <el-col :span="24" class="tl-pagination-col">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="3000">
            </el-pagination>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog title="Edit Task" :visible.sync="editTaskVisible" width="50%">
      <el-form ref="form" :model="form" label-width="120px" class="tl-edit-form" >
        <el-form-item label="Number" v-show="showNewTask">
          <el-input v-model="form.formNumber"></el-input>
        </el-form-item>
        <el-form-item label="Number" v-show="showExistingTask">
          <span style="font-size: 17px">{{form.formNumber}}</span>
        </el-form-item>
        <el-form-item label="Type">
          <el-select v-model="form.formType">
            <el-option label="Change" value="1"></el-option>
            <el-option label="Incident" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Description">
          <el-input type="textarea" v-model="form.formDesc" :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="Status" v-show="showNewTask">
          <el-select v-model="form.formStatus">
            <el-option label="Open" value="1"></el-option>
            <el-option label="In Progress" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Status" v-show="showExistingTask">
          <el-input v-model="form.formStatus" disabled></el-input>
        </el-form-item>
        <el-form-item label="Effort">
          <el-col :span="10">
            <el-col :span="19">
              <el-input v-model="form.formEffort"></el-input>
            </el-col>
            <el-col :span="5" style="text-align: center; font-size: 16px;">
              <span>hrs</span>
            </el-col>
          </el-col>
          <el-col :span="14">
            <el-form-item label="Estimation">
              <el-col :span="19">
                <el-input v-model="form.formEstimation"></el-input>
              </el-col>
              <el-col :span="5" style="text-align: center; font-size: 16px;">
                <span>hrs</span>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="Progress" >
          <el-progress class="tl-edit-form-progress" :text-inside="true" :stroke-width="24" :percentage="74" status="success"></el-progress>
        </el-form-item>
        <el-form-item label="Assign Team">
          <el-select v-model="form.formAssignTeam">
            <el-option label="TOS" value="1"></el-option>
            <el-option label="Billing" value="2"></el-option>
            <el-option label="BSS" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Worklog History">
          <el-button icon="el-icon-more" size="small" type="text" @click="showWorklogHistory" style="font-size: 18px"></el-button>
        </el-form-item>
      </el-form>
      <el-card class="box-card">
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp">
            {{activity.content}}
          </el-timeline-item>
        </el-timeline>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="editTaskVisible = false">Cancel</el-button>
        <el-button type="primary" size="medium" @click="editTaskVisible = false">Submit</el-button>
        <el-button type="success" size="medium" @click="editTaskVisible = false">Log Work Done</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TaskList',
  data () {
    return {
      header1: 'Task List',
      isActive: true,
      inputTaskVal: '',
      selectTaskType: '',
      currentPage: 1,
      tasklistData: [
        {task_id: 1, task_number: 'CGM190001', task_type: 'Change', task_desc: 'eRO urgent change to add flex field to CNE', task_status: 'Prod Released', task_effort: 4, task_estimation: 10, task_assign_team: 'TOS'},
        {task_id: 2, task_number: 'INC19050632', task_type: 'Incident', task_desc: 'Missing Equipment Movement - MTL (HSU)', task_status: 'Open', task_effort: 4, task_estimation: 4, task_assign_team: 'Billing'},
        {task_id: 3, task_number: 'INCTASK15486235', task_type: 'Change', task_desc: 'eRO urgent change to add flex field to CNE', task_status: 'Prod Released', task_effort: 4, task_estimation: 10, task_assign_team: 'TOS'},
        {task_id: 4, task_number: 'INC19050632', task_type: 'Service Request', task_desc: 'eRO urgent change to add flex field to CNE', task_status: 'Prod Released', task_effort: 4, task_estimation: 10, task_assign_team: 'TOS'},
        {task_id: 5, task_number: 'CGM190001', task_type: 'Change', task_desc: 'TESTETSTTTTTTTTT eRO urgent change to add flex field to CNE', task_status: 'Prod Released', task_effort: 4, task_estimation: 10, task_assign_team: 'TOS'},
        {task_id: 6, task_number: 'CGM190001', task_type: 'Change', task_desc: 'eRO urgent change to add flex field to CNE', task_status: 'Prod Released', task_effort: 4, task_estimation: 10, task_assign_team: 'BSS'},
        {task_id: 7, task_number: 'CGM190001', task_type: 'Change', task_desc: 'eRO urgent change to add flex field to CNE', task_status: 'Prod Released', task_effort: 4, task_estimation: 10, task_assign_team: 'TOS'}
      ],
      editTaskVisible: false,
      showNewTask: false,
      showExistingTask: true,
      form: {
        formNumber: 'CGM190001',
        formType: 'Incident',
        formDesc: 'eRO urgent change to add flex field to CNEeRO urgent change to add flex field to CNEeRO urgent change to add flex field to CNEeRO urgent change to add flex field to CNEeRO urgent change to add flex field to CNE',
        formStatus: 'SIT Completed',
        formEffort: 10,
        formEstimation: 80,
        formAssignTeam: ''
      },
      showHistory: false,
      activities: [
        {content: '活动按期开始', timestamp: '2018-04-15'},
        {content: '通过审核', timestamp: '2018-04-13'},
        {content: '创建成功', timestamp: '2018-04-11'}
      ]
    }
  },
  methods: {
    editTask (taskRow) {
      var taskId = taskRow.task_id
      this.$data.editTaskVisible = true
      console.log(taskId)
    },
    handleSizeChange (val) {
      console.log(`Each Page ${val} records`)
    },
    handleCurrentChange (val) {
      console.log(`Current Page: ${val}`)
    },
    showWorklogHistory () {
      console.log('Click')
      this.$data.showHistory = true
    }
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
</style>
