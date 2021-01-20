<!-- 
Module: PMTTaskDialog
Description: display task details for PMT task (base information/status tracing/sub tasks list/worklog histories)
Remark:
-->
<template>
  <el-dialog :before-close="closeTask" :visible.sync="PMTTaskDialogVisible" :title="PMTTaskDialogTitle" :width="dialogWidth" top="5%" :close-on-click-modal="false" class="pmt-task-dialog">
    <el-form :model="PMTTask" :rules="PMTTaskFormRules" ref="form" label-width="140px" label-position="left" class="pmt-task-dialog-form">
      <el-tabs v-model="activeTab" ref="PMTTaskDialogTabs" type="card">
        <!-- Basic Information Tab -->
        <el-tab-pane label="Basic Information" name="tab_basic_info">
          <el-row>
            <el-col :span="24">
              <el-form-item v-show="showState.showParent" label="Parent Task" prop="taskParentName">
                <el-col :span="12" :lg="6">
                  <el-autocomplete :disabled="disabledState.disabledParent" v-model="PMTTask.taskParentName" popper-class="task-autocomplete" :trigger-on-focus="false"  :clearable="true" style="width: 100%" :debounce=0>
                    <template slot-scope="{ item }">
                      <div class="pmt-task-dialog-form-list-name">{{ item.value }}</div>
                      <span class="pmt-task-dialog-form-list-desc">{{ item.description }}</span>
                    </template>
                  </el-autocomplete>
                </el-col>
                <el-col :span="24" :lg="{span: 17, offset: 1}">
                  <el-tooltip :content="PMTTask.taskParentTitle" class="item" effect="dark" placement="top-start">
                    <div v-show="showState.showParentTitle" class="pmt-task-dialog-form-desc">{{PMTTask.taskParentTitle}}</div>
                  </el-tooltip>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item label="Name">
                <span style="width: 100%; color: black; font-weight: bold; font-size: 17px" >{{PMTTask.taskName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showType" label="Task Type" prop="taskType">
                <el-select :disabled="disabledState.disabledType" v-model="PMTTask.taskType" style="width: 100%">
                  <el-option label=" " value=""></el-option>
                  <el-option label="Development" value="Development"></el-option>
                  <el-option label="Maintenance" value="Maintenance"></el-option>
                  <el-option label="Others" value="Others"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showTypeTag" label="Type Tag" prop="taskTypeTag">
                <el-select :disabled="disabledState.disabledTypeTag" v-model="PMTTask.taskTypeTag" style="width: 100%">
                  <el-option label="One-Off Task" value="One-Off Task"></el-option>
                  <el-option label="Public Task" value="Public Task"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showDeliverableTag" label="Deliverable Tag" prop="taskDeliverableTag">
                <el-select :disabled="disabledState.disabledDeliverableTag" v-model="PMTTask.taskDeliverableTag" style="width: 100%" multiple clearable>
                  <el-option v-for="item in DeliverableOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-show="showState.showSprint" label="Sprint" prop="taskSprintId">
            <el-select :disabled="disabledState.disabledSprint" v-model="PMTTask.taskSprintId" style="width: 100%">
              <el-option label="" value=""></el-option>
              <el-option v-for="item in sprintsList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item v-show="showState.showReferenceTask" label="Ref Task" prop="taskReferenceTask">
                <el-col :span="12" :lg="6">
                  <el-autocomplete :disabled="disabledState.disabledReferenceTask" v-model="PMTTask.taskReferenceTask" popper-class="task-autocomplete" :trigger-on-focus="false"  :clearable="true" style="width: 100%" :debounce=0>
                    <template slot-scope="{ item }">
                      <div class="pmt-task-dialog-form-list-name">{{ item.value }}</div>
                      <span class="pmt-task-dialog-form-list-desc">{{ item.title }}</span>
                    </template>
                  </el-autocomplete>
                </el-col>
                <el-col :span="24" :lg="{span: 17, offset: 1}">
                  <el-tooltip :content="PMTTask.taskReferenceTaskTitle" class="item" effect="dark" placement="top-start">
                    <div v-show="showState.showReferenceTaskTitle" class="pmt-task-dialog-form-desc">{{PMTTask.taskReferenceTaskTitle}}</div>
                  </el-tooltip>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-show="showState.showTitle" label="Title" prop="taskTitle">
            <el-input :disabled="disabledState.disabledTitle" v-model="PMTTask.taskTitle" class="highlight-text-format" style="width: 100%" ></el-input>
          </el-form-item>
          <el-form-item v-show="showState.showDescription" label="Description">
            <el-input :disabled="disabledState.disabledDescription" v-model="PMTTask.taskDescription" class="highlight-text-format" type="textarea" :rows="6" style="width: 100%" ></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showCreator" label="Created By">
                <span>{{PMTTask.taskCreator}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- Status Tracing Tab -->
        <el-tab-pane label="Status Tracing" name="tab_status_tracing">
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showStatus" label="Status">
                <el-select :disabled="disabledState.disabledStatus" v-model="PMTTask.taskStatus" style="width: 100%">
                  <el-option label="Drafting" value="Drafting"></el-option>
                  <el-option label="Planning" value="Planning"></el-option>
                  <el-option label="Running" value="Running"></el-option>
                  <el-option label="Done" value="Done"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item label="Issue Date">
                <el-date-picker disabled v-model="PMTTask.taskIssueDate" type="datetime" placeholder="Select Date..." value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showTargetComplete" label="Target Complete">
                <el-date-picker :disabled="disabledState.disabledTargetComplete" v-model="PMTTask.taskTargetComplete" type="date" placeholder="Select Date..." value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showActualComplete" label="Actual Complete">
                <el-date-picker :disabled="disabledState.disabledActualComplete" v-model="PMTTask.taskActualComplete" type="date" placeholder="Select Date..." value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showRespLeader" label="Responsible Leader">
                <span>{{PMTTask.taskRespLeader}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showAssignee" label="Assign To">
                <el-select :disabled="disabledState.disabledAssignee" v-model="PMTTask.taskAssignee" filterable style="width: 100%">
                  <el-option label="1" value="1">
                    <span style="font-size: 14px; float: left ; margin-right: 20px">zhongshu.liang</span>
                    <span style="font-size: 14px; float: right; color: #8492a6; ">Level - 10</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showEffort" label="Effort">
                <el-input v-model="PMTTask.taskEffort" disabled>
                  <template slot="append" style="font-size:16px; width:100%">hrs</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showEstimation" label="Estimation">
                <el-input :disabled="disabledState.disabledEstimation" v-model="PMTTask.taskEstimation">
                  <template slot="append" style="font-size:16px; width:100%">hrs</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- Sub Tasks Tab -->
        <el-tab-pane label="Sub Tasks" name="tab_subtasks_list">
          <el-row>
            <el-col :span="24">
              <el-button icon="el-icon-plus" size="medium" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white', 'width': '100%'}">Create Sub Task</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-card class="box-card task-form-tab-subtasks-content" :body-style="{padding: '0px'}" shadow="never">
                  <el-table :data="PMTTaskSubtasksList" :row-style="showPointer" size="small" height="500" style="width: 100%">
                    <el-table-column v-if="false" prop="subtaskId" label="Id" fixed="left"></el-table-column>
                    <el-table-column width="120" align="left" prop="subtaskName" label="Task Name" sortable key="1"></el-table-column>
                    <el-table-column min-width="280" align="left" prop="subtaskTitle" label="Title" key="2"></el-table-column>
                    <el-table-column width="120" align="center" prop="subtaskStatus" label="Status" sortable key="3">
                      <template slot-scope="scope">
                        <el-tag effect="dark" type="warning" size="mini" v-if="scope.row.subtaskStatus == 'Drafting'">{{scope.row.subtaskStatus}}</el-tag>
                        <el-tag effect="dark" type="primary" size="mini" v-if="scope.row.subtaskStatus == 'Planning'">{{scope.row.subtaskStatus}}</el-tag>
                        <el-tag effect="dark" type="success" size="mini" v-if="scope.row.subtaskStatus == 'Running'" >{{scope.row.subtaskStatus}}</el-tag>
                        <el-tag effect="dark" type="info"    size="mini" v-if="scope.row.subtaskStatus == 'Done'"    >{{scope.row.subtaskStatus}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column width="120" align="center" prop="subtaskAssignee" label="Assign To" sortable key="4"></el-table-column>
                    <el-table-column width="30" align="center" fixed="right">
                      <template slot-scope="scope">
                        <el-row>
                          <el-col :span="1"><i class="el-icon-arrow-right"></i></el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                  </el-table>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- Worklog Histories Tab -->
        <el-tab-pane label="Worklog Histories" name="tab_worklog_histories">
            <el-card class="box-card pmt-task-dialog-history-tab">
              <el-timeline>
                <el-timeline-item v-for="(history, index) in taskWorklogHistories" :key="index" :timestamp="history.timestamp"
                  icon="el-icon-star-on" size="large" placement="top" type="primary" class="tl-history">
                  {{history.content}}
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-tab-pane>
      </el-tabs>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="disabledSaveBtn" @click="saveTask" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="medium">Save</el-button>
    </span>
  </el-dialog> 
</template>

<script type="text/ecmascript-6">
  import http from '../../utils/http'
  import utils from '../../utils/utils'
  export default {
    name: 'PMTTaskDialog',
    data() {
      return {
        btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
        btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
        headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
        dialogWidth: '70%',
        activeTab: 'tab_basic_info',
        PMTTaskDialogTitle: 'PMT Task Details',
        PMTTaskDialogVisible: false,
        disabledSaveBtn: false,
        PMTTaskFormRules: {
          taskTitle: [{required: true, message: 'Not allow empty', trigger: 'blur'}]
        },
        DeliverableOptions: [
          {value: 'Clarify Requirement', label: 'Clarify Requirement'},
          {value: 'Document Scenarios', label: 'Document Scenarios'}, 
          {value: 'Design Program', label: 'Design Program'},
          {value: 'Ready to UAT', label: 'Ready to UAT'},
          {value: 'UAT In Support', label: 'UAT In Support'},
          {value: 'Ready to PROD', label: 'Ready to PROD'}
        ],
        sprintsList: [],
        taskWorklogHistories: [],
        disabledState: {
          disabledParent: false,
          disabledParentTitle: false,
          disabledNameInput: false,
          disabledType: false,
          disabledTypeTag: false,
          disabledDeliverableTag: false,
          disabledSprint: false,
          disabledReferenceTask: false,
          disabledReferenceTaskTitle: false,
          disabledTitle: false,
          disabledDescription: false,
          disabledStatus: false,
          disabledTargetComplete: false,
          disabledActualComplete: false,
          disabledAssignee: false,
          disabledEstimation: false
        },
        showState: {
          showParent: true,
          showParentTitle: true,
          showNameInput: true,
          showType: true,
          showTypeTag: true,
          showDeliverableTag: true,
          showSprint: true,
          showReferenceTask: true,
          showReferenceTaskTitle: true,
          showTitle: true,
          showDescription: true,
          showCreator: true,
          showStatus: true,
          showTargetComplete: true,
          showActualComplete: true,
          showRespLeader: true,
          showAssignee: true,
          showEffort: true,
          showEstimation: true,
        },
        PMTTask: {
          taskId: 0,
          taskParentName: '',
          taskParentTitle: 'Testing of task parent task description',
          taskName: '',
          taskType: '',
          taskTypeTag: '',
          taskDeliverableTag: [],
          taskSprintId: null,
          taskReferenceTask: '',
          taskReferenceTaskTitle: 'Testing of task reference task description',
          taskTitle: '',
          taskDescription: '',
          taskCreator: '',
          taskStatus: 'Drafting',
          taskIssueDate: '',
          taskTargetComplete: '',
          taskActualComplete: '',
          taskRespLeader: '',
          taskAssignee: '',
          taskEffort: 0,
          taskEstimation: 0,
        },
        PMTTaskSubtasksList: [
          {subtaskId: 1, subtaskName: 'MTL19.1-1', subtaskTitle: 'MTL AO TOS - Application Development', subtaskStatus: 'Drafting', subtaskAssignee: 'Leo.Li'},
          {subtaskId: 2, subtaskName: 'MTL19.1-2', subtaskTitle: 'MTL AO TOS - Application Development', subtaskStatus: 'Planning', subtaskAssignee: 'Leo.Li'},
          {subtaskId: 3, subtaskName: 'MTL19.1-3', subtaskTitle: 'MTL AO TOS - Application Development', subtaskStatus: 'Running', subtaskAssignee: 'Leo.Li'},
          {subtaskId: 3, subtaskName: 'MTL19.1-4', subtaskTitle: 'MTL AO TOS - Application Development', subtaskStatus: 'Done', subtaskAssignee: 'Leo.Li'}
        ]
      }
    },
    props: {
      'action': Object
    },
    watch: {
      action: {
         handler (val, oldVal) {
          console.log('PMT task dialog action: ', val)
          if(val == '' || val == null || val == undefined) {
            return
          }
          var actionObj = val
          if (actionObj.action == 'CREATE-NEW') {
            this.createTask()
          }
          if (actionObj.action == 'CREATE-SUB') {
            this.createSubTask(actionObj)
          }
          if (actionObj.action == 'CREATE-REF') {
            this.createRefTask(actionObj)
          }
          if (actionObj.action == 'EDIT') {
            this.editTask(actionObj.taskId)
          }
        },
        immediate: true,
        deep: true
      }
    },
    created () {
      this.initTaskForm('PMT Task Details', 'tab_basic_info')
    },
    mounted () {
      console.log('Mounted')
    },
    updated () {
      console.log('Updated')
    },
    methods: {
      // Style method
      showPointer ({row, rowIndex}) {
        let pointerObj = {
          cursor: 'pointer'
        }
        return pointerObj
      },
      // Functional Methods
      initTaskForm(iTitle, iActiveTab) {
        this.$data.PMTTaskDialogTitle = iTitle
        this.$data.activeTab = iActiveTab
        this.$data.PMTTaskSubtasksList = []
        this.$data.PMTTask = {
          taskId: 0,
          taskParentName: '',
          taskParentTitle: 'Default',
          taskName: '',
          taskType: '',
          taskTypeTag: '',
          taskDeliverableTag: [],
          taskSprintId: null,
          taskReferenceTask: '',
          taskReferenceTaskTitle: 'Default',
          taskTitle: '',
          taskDescription: '',
          taskCreator: '',
          taskStatus: 'Drafting',
          taskIssueDate: new Date(),
          taskTargetComplete: '',
          taskActualComplete: '',
          taskRespLeader: '',
          taskAssignee: '',
          taskEffort: 0,
          taskEstimation: 0,
        }
        for(let key in this.$data.disabledState) {
          this.$data.disabledState[key] = false
        }
        for(let key in this.$data.showState) {
          this.$data.showState[key] = true
        }
        this.$data.disabledSaveBtn = false
      },
      createTask () {
        console.log('Create PMT task')
        this.initTaskForm('New PMT Task', 'tab_basic_info')
        this.$data.PMTTaskDialogVisible = true
      },
      createSubTask (iObj) {
        console.log('Create PMT Sub task')
        this.initTaskForm('New PMT Task', 'tab_basic_info')
        // Set new Task default value
        this.$data.PMTTask.taskParentName = iObj.taskParentTaskName
        this.$data.PMTTask.taskParentTitle = iObj.taskParentTaskTitle
        this.$data.PMTTask.taskType = iObj.taskType
        this.$data.PMTTask.taskTypeTag = iObj.taskTypeTag
        this.$data.PMTTask.taskReferenceTask = iObj.taskReferenceTask
        this.$data.PMTTask.taskSprintId = iObj.taskSprintId
        this.$data.PMTTask.taskRespLeader = iObj.taskLeader 
        // Set new Task default state
        this.$data.disabledState.disabledParent = true
        this.$data.disabledState.disabledType = true
        this.$data.disabledState.disabledTypeTag = true
        this.$data.disabledState.disabledReferenceTask = true
        this.$data.disabledState.disabledSprint = true
        this.$data.PMTTaskDialogVisible = true
      },
      createRefTask (iObj) {
        console.log('Create PMT Ref task')
        this.initTaskForm('New PMT Task', 'tab_basic_info')
        // Set new Task default value
        this.$data.PMTTask.taskReferenceTask = iObj.taskReferenceTask
        this.$data.PMTTask.taskReferenceTaskTitle = iObj.taskReferenceTaskTitle
        // Set new Task default state
        this.$data.disabledState.disabledReferenceTask = true
        this.$data.PMTTaskDialogVisible = true
      },
      editTask (iTaskId) {
        console.log('Edit PMT task')
        this.initTaskForm('PMT Task Details', 'tab_basic_info')
        // Get task information by id
        this.$data.PMTTaskDialogVisible = true
      },
      closeTask (done) {
        console.log('Close PMT task')
        this.initTaskForm('PMT Task Details', 'tab_basic_info')
        this.$data.PMTTaskDialogVisible = false
        this.$emit('closeTask', '2')
        done()
      },
      saveTask () {
        console.log('Save PMT task')
        this.$data.disabledSaveBtn = true
      }
    }
  }
</script>

<style scoped>
/* Common Style */
.justify-content-center {
  justify-content: center;
}
.justify-content-flex-start {
  justify-content: flex-start;
}
.justify-content-flex-end {
  justify-content: flex-end;
}
.pointer-style {
  cursor: pointer;
}

.pmt-task-dialog {
  min-width: 600px;
}
.pmt-task-dialog .el-dialog__body {
  padding: 10px 20px;
}
.pmt-task-dialog>>>.el-dialog__header {
  text-align: center;
}
.pmt-task-dialog-form {
  text-align: left;
}
.pmt-task-dialog-form .el-form-item {
  margin-bottom: 10px;
}
.task-form-tab-subtasks-content {
  margin-top: 10px;
}
.task-form-tab-regulartasks-content {
  margin-top: 10px;
}
.pmt-task-dialog-form-list-name {
  font-size: 16px;
  color: #57606f;
  text-overflow: ellipsis;
  overflow: hidden;
}
.pmt-task-dialog-form-list-desc {
  font-size: 14px;
  color: #bdc3c7;
}
.pmt-task-dialog-form-desc {
  font-size: 17px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pmt-task-dialog-history-tab {
  height: 200px;
  overflow: auto;
}
</style>

<style>
.highlight-text-format .el-input__inner{
  font-family: "Microsoft" !important;
  font-size: 20px !important;
  font-weight: bold !important;
}
.highlight-text-format .el-textarea__inner{
 font-family: "Microsoft" !important;
 font-size: 20px !important;
 font-weight: bold !important;
}
.pmt-task-dialog .el-dialog__body {
  padding: 10px 20px;
}
.pmt-task-dialog-form .el-table th {
  padding: 3px 0;
  color: #616161;
}
.pmt-task-dialog-form .el-form-item__error {
  top: 28%;
  left: 10px;
}
.el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
  content: '';
  margin-right: 0;
}
.el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:after, .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:after {
  content: '*';
  color: #F56C6C;
  margin-left: 4px;
}
</style>