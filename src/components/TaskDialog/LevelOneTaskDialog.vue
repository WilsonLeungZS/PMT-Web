<!-- 
Module: LevelOneTaskDialog
Description: display task details for level 1 task (base information/status tracing/sub tasks list)
Remark:
-->
<template>
  <el-dialog :before-close="closeTask" :visible.sync="levelOneTaskDialogVisible" :title="levelOneTaskDialogTitle" :width="dialogWidth" top="5%" :close-on-click-modal="false" class="level-one-task-dialog">
    <el-form :model="levelOneTask" :rules="levelOneTaskFormRules" ref="form" label-width="145px" label-position="left" class="level-one-task-dialog-form">
      <el-tabs v-model="activeTab" ref="levelOneTaskDialogTabs" type="card">
        <!-- Basic Information Tab -->
        <el-tab-pane label="Basic Information" name="tab_basic_info">
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="!showState.showNameInput" label="Name">
                <span style="width: 100%; color: black; font-weight: bold; font-size: 17px" >{{levelOneTask.taskName}}</span>
              </el-form-item>
              <el-form-item v-show="showState.showNameInput" label="Name" prop="taskName">
                <el-input :disabled="disabledState.disabledNameInput" v-model="levelOneTask.taskName" style="width: 100%" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showType" label="Task Type" prop="taskTypeId">
                <el-select :disabled="disabledState.disabledType" v-model="levelOneTask.taskTypeId" style="width: 100%">
                  <el-option label=" " value=""></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-show="showState.showOppName" label="Opportunity Name" prop="taskOppName">
            <el-input :disabled="disabledState.disabledOppName" v-model="levelOneTask.taskOppName" class="highlight-text-format" style="width: 100%" ></el-input>
          </el-form-item>
          <el-form-item v-show="showState.showBusinessValue" label="BusinessValue">
            <el-input :disabled="disabledState.disabledBusinessValue" v-model="levelOneTask.taskBusinessValue" type="textarea" :rows="4" style="width: 100%" ></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showCustomer" label="Customer" prop="taskCustomer">
                <el-input :disabled="disabledState.disabledCustomer" v-model="levelOneTask.taskCustomer"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showFacingClient" label="Facing Client">
                <el-input :disabled="disabledState.disabledFacingClient" v-model="levelOneTask.taskFacingClient"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showTypeOfWork" label="Type Of Work">
                <el-input :disabled="disabledState.disabledTypeOfWork" v-model="levelOneTask.taskTypeOfWork"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showChanceOfWinning" label="Chance of Winning">
                <el-input :disabled="disabledState.disabledChanceOfWinning" v-model="levelOneTask.taskChanceOfWinning"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showPaintPoints" label="Paint Points">
                <el-input :disabled="disabledState.disabledPaintPoints" v-model="levelOneTask.taskPaintPoints"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showConstraint" label="Constraint">
                <el-input :disabled="disabledState.disabledConstraint" v-model="levelOneTask.taskConstraint"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showSOWConfirmation" label="SOW Confirmation">
                <el-date-picker :disabled="disabledState.disabledSOWConfirmation" v-model="levelOneTask.taskSOWConfirmation" type="date" placeholder="Select Date..." value-format="yyyy-MM-dd" style="width: 100%" ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showTeamSizing" label="Team Sizing">
                <el-input :disabled="disabledState.disabledTeamSizing" v-model="levelOneTask.taskTeamSizing"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showSkillsAndSpec" label="Skills / Specialization">
                <el-input :disabled="disabledState.disabledSkillsAndSpec" v-model="levelOneTask.taskSkillsAndSpec"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showOppsToProject" label="Opps > Project">
                <el-input :disabled="disabledState.disabledOppsToProject" v-model="levelOneTask.taskOppsToProject"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showCreator" label="Created By">
                <span>{{levelOneTask.taskCreator}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- Status Tracing Tab -->
        <el-tab-pane label="Status Tracing" name="tab_status_tracing">
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showStatus" label="Status">
                <el-select :disabled="disabledState.disabledStatus" v-model="levelOneTask.taskStatus" style="width: 100%">
                  <el-option label="Drafting" value="Drafting"></el-option>
                  <el-option label="Planning" value="Planning"></el-option>
                  <el-option label="Running" value="Running"></el-option>
                  <el-option label="Done" value="Done"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item label="Issue Date">
                <el-date-picker disabled v-model="levelOneTask.taskIssueDate" type="datetime" placeholder="Select Date..." value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showTargetStart" label="Target Start">
                <el-date-picker :disabled="disabledState.disabledTargetStart" v-model="levelOneTask.taskTargetStart" type="month" placeholder="Select Month..." value-format="yyyy-MM" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showTargetEnd" label="Target End">
                <el-date-picker :disabled="disabledState.disabledTargetEnd" v-model="levelOneTask.taskTargetEnd" type="month" placeholder="Select Month..." value-format="yyyy-MM" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showRespLeader" label="Responsible Leader">
                <el-select :disabled="disabledState.disabledRespLeader" v-model="levelOneTask.taskRespLeader" filterable style="width: 100%">
                  <el-option label="1" value="1">
                    <span style="font-size: 14px; float: left ; margin-right: 20px">zhongshu.liang</span>
                    <span style="font-size: 14px; float: right; color: #8492a6; ">Level - 10</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- Sub Tasks Tab -->
        <el-tab-pane label="Sub Tasks List" name="tab_subtasks_list">
          <el-row>
            <el-col :span="24">
              <el-button @click="clickCreateSubtask()" icon="el-icon-plus" size="medium" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white', 'width': '100%'}">Create Sub Task</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-card class="box-card task-form-tab-subtasks-content" :body-style="{padding: '0px'}" shadow="never">
                  <el-table @row-click="clickEditTask" :data="levelOneTaskSubtasksList" :row-style="showPointer" size="small" height="500" style="width: 100%">
                    <el-table-column v-if="false" prop="subtaskId" label="Id" fixed="left"></el-table-column>
                    <el-table-column width="120" align="left" prop="subtaskName" label="Task Name" sortable key="1"></el-table-column>
                    <el-table-column min-width="280" align="left" prop="subtaskDescription" label="Description" key="2"></el-table-column>
                    <el-table-column width="120" align="center" prop="subtaskStatus" label="Status" sortable key="3">
                      <template slot-scope="scope">
                        <el-tag effect="dark" type="warning" size="mini" v-if="scope.row.subtaskStatus == 'Drafting'">{{scope.row.subtaskStatus}}</el-tag>
                        <el-tag effect="dark" type="primary" size="mini" v-if="scope.row.subtaskStatus == 'Planning'">{{scope.row.subtaskStatus}}</el-tag>
                        <el-tag effect="dark" type="success" size="mini" v-if="scope.row.subtaskStatus == 'Running'" >{{scope.row.subtaskStatus}}</el-tag>
                        <el-tag effect="dark" type="info"    size="mini" v-if="scope.row.subtaskStatus == 'Done'"    >{{scope.row.subtaskStatus}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column width="120" align="center" prop="subtaskLeader" label="Leading By" sortable key="4"></el-table-column>
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
    name: 'LevelOneTaskDialog',
    data() {
      return {
        btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
        btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
        headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
        dialogWidth: '70%',
        activeTab: 'tab_basic_info',
        levelOneTaskDialogTitle: '1 - Business Opportunity',
        levelOneTaskDialogVisible: false,
        disabledSaveBtn: false,
        levelOneTaskFormRules: {
          taskName:     [{required: true, message: 'Not allow empty', trigger: 'blur'}],
          taskTypeId:   [{required: true, message: 'Not allow empty', trigger: 'change'}],
          taskOppName:  [{required: true, message: 'Not allow empty', trigger: 'blur'}],
          taskCustomer: [{required: true, message: 'Not allow empty', trigger: 'blur'}]
        },
        disabledState: {
          disabledNameInput: false,
          disabledType: false,
          disabledOppName: false,
          disabledBusinessValue: false,
          disabledCustomer: false,
          disabledFacingClient: false,
          disabledTypeOfWork: false,
          disabledChanceOfWinning: false,
          disabledPaintPoints: false,
          disabledConstraint: false,
          disabledSOWConfirmation: false,
          disabledTeamSizing: false,
          disabledSkillsAndSpec: false,
          disabledOppsToProject: false,
          disabledStatus: false,
          disabledTargetStart: false,
          disabledTargetEnd: false,
          disabledRespLeader: false
        },
        showState: {
          showNameInput: true,
          showType: true,
          showOppName: true,
          showBusinessValue: true,
          showCustomer: true,
          showFacingClient: true,
          showTypeOfWork: true,
          showChanceOfWinning: true,
          showPaintPoints: true,
          showConstraint: true,
          showSOWConfirmation: true,
          showTeamSizing: true,
          showSkillsAndSpec: true,
          showOppsToProject: true,
          showCreator: true,
          showStatus: true,
          showTargetStart: true,
          showTargetEnd: true,
          showRespLeader: true
        },
        levelOneTask: {
          taskId: 0,
          taskLevel: 1,
          taskEffort: 0,
          taskEstimation: 0,
          taskName: '',
          taskTypeId: 1,
          taskOppName: '',
          taskBusinessValue: '',
          taskCustomer: '',
          taskFacingClient: '',
          taskTypeOfWork: '',
          taskChanceOfWinning: '',
          taskPaintPoints: '',
          taskConstraint: '',
          taskSOWConfirmation: '',
          taskTeamSizing: '',
          taskSkillsAndSpec: '',
          taskOppsToProject: '',
          taskCreator: '',
          taskStatus: 'Drafting',
          taskIssueDate: '',
          taskTargetStart: '',
          taskTargetEnd: '',
          taskRespLeader: ''
        },
        levelOneTaskSubtasksList: [
          {subtaskId: 1, subtaskName: 'MTL19.1-1', subtaskDescription: 'MTL AO TOS - Application Development', subtaskStatus: 'Drafting', subtaskLeader: 'Leo.Li'},
          {subtaskId: 2, subtaskName: 'MTL19.1-2', subtaskDescription: 'MTL AO TOS - Application Development', subtaskStatus: 'Planning', subtaskLeader: 'Leo.Li'},
          {subtaskId: 3, subtaskName: 'MTL19.1-3', subtaskDescription: 'MTL AO TOS - Application Development', subtaskStatus: 'Running', subtaskLeader: 'Leo.Li'},
          {subtaskId: 3, subtaskName: 'MTL19.1-4', subtaskDescription: 'MTL AO TOS - Application Development', subtaskStatus: 'Done', subtaskLeader: 'Leo.Li'}
        ]
      }
    },
    props: {
      'action': Object
    },
    watch: {
      action: {
         handler (val, oldVal) {
          console.log('Level 1 dialog action: ', val)
          if(val == '' || val == null || val == undefined) {
            return
          }
          var actionObj = val
          if (actionObj.action == 'Create') {
            this.createTask()
          }
          if (actionObj.action == 'Edit') {
            this.editTask()
          }
        },
        immediate: true,
        deep: true
      }
    },
    created () {
      this.initTaskForm('1 - Business Opportunity', 'tab_basic_info')
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
        this.$data.levelOneTaskDialogTitle = iTitle
        this.$data.activeTab = iActiveTab
        var date = new Date()
        // this.$data.levelOneTaskSubtasksList = []
        this.$data.levelOneTask = {
          taskId: 0,
          taskLevel: 1,
          taskEffort: 0,
          taskEstimation: 0,
          taskName: '',
          taskTypeId: 1,
          taskOppName: '',
          taskBusinessValue: '',
          taskCustomer: '',
          taskFacingClient: '',
          taskTypeOfWork: '',
          taskChanceOfWinning: '',
          taskPaintPoints: '',
          taskConstraint: '',
          taskSOWConfirmation: '',
          taskTeamSizing: '',
          taskSkillsAndSpec: '',
          taskOppsToProject: '',
          taskCreator: '',
          taskStatus: 'Drafting',
          taskIssueDate: date,
          taskTargetStart: '',
          taskTargetEnd: '',
          taskRespLeader: ''
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
        console.log('Create level 1 task')
        this.initTaskForm('1 - New Business Opportunity', 'tab_basic_info')
        this.$data.levelOneTaskDialogVisible = true
      },
      editTask () {
        console.log('Edit level 1 task')
        this.initTaskForm('1 - Business Opportunity', 'tab_basic_info')
        this.$data.levelOneTaskDialogVisible = true
      },
      closeTask (done) {
        console.log('Close level 1 task')
        this.initTaskForm('1 - Business Opportunity', 'tab_basic_info')
        this.$data.levelOneTaskDialogVisible = false
        this.$emit('closeTask', '1')
        done()
      },
      saveTask () {
        console.log('Save level 1 task')
        this.$data.disabledSaveBtn = true
      },
      // Sub task operation
      clickCreateSubtask() {
        var subtaskLevel = '2'
        var subtaskParent = this.$data.levelOneTask.taskName
        this.$emit('createSubtask', subtaskLevel, subtaskParent)
      },
      clickEditTask (row, column, event) {
        var taskId = row.subtaskId
        var taskName = row.subtaskName
        var taskLevel = '2'
        this.$emit('editSubtask', taskId, taskName, taskLevel)
      },
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

.level-one-task-dialog {
  min-width: 600px;
}
.level-one-task-dialog .el-dialog__body {
  padding: 10px 20px;
}
.level-one-task-dialog-form {
  text-align: left;
}
.level-one-task-dialog-form .el-form-item {
  margin-bottom: 10px;
}
.task-form-tab-subtasks-content {
  margin-top: 10px;
}
</style>

<style>
.highlight-text-format .el-input__inner{
  font-family: "Microsoft" !important;
  font-size: 20px !important;
  font-weight: bold !important;
}
.level-one-task-dialog .el-dialog__body {
  padding: 10px 20px;
}
.level-one-task-dialog-form .el-table th {
  padding: 3px 0;
  color: #616161;
}
.level-one-task-dialog-form .el-form-item__error {
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