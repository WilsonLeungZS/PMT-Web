<!-- 
Module: LevelTwoTaskDialog
Description: display task details for level 2 task (base information/status tracing/sub tasks list/regular tasks list)
Remark:
-->
<template>
  <el-dialog :before-close="closeTask" :visible.sync="levelTwoTaskDialogVisible" :title="levelTwoTaskDialogTitle" :width="dialogWidth" top="5%" :close-on-click-modal="false" class="level-two-task-dialog">
    <el-form :model="levelTwoTask" :rules="levelTwoTaskFormRules" ref="form" label-width="140px" label-position="left" class="level-two-task-dialog-form">
      <el-tabs v-model="activeTab" ref="levelTwoTaskDialogTabs" type="card">
        <!-- Basic Information Tab -->
        <el-tab-pane label="Basic Information" name="tab_basic_info">
          <el-row>
            <el-col :span="24">
              <el-form-item v-show="showState.showParent" label="Parent Task" prop="taskParentName">
                <el-col :span="12" :lg="6">
                  <el-autocomplete :disabled="disabledState.disabledParent" v-model="levelTwoTask.taskParentName" placeholder="Search Parent Task..." popper-class="task-autocomplete" :trigger-on-focus="false"  :clearable="true" style="width: 100%" :debounce=0>
                    <template slot-scope="{ item }">
                      <div class="level-two-task-dialog-form-list-name">{{ item.value }}</div>
                      <span class="level-two-task-dialog-form-list-desc">{{ item.description }}</span>
                    </template>
                  </el-autocomplete>
                </el-col>
                <el-col :span="24" :lg="{span: 17, offset: 1}">
                  <el-tooltip :content="levelTwoTask.taskParentDesc" class="item" effect="dark" placement="top-start">
                    <div v-show="showState" class="level-two-task-dialog-form-desc">{{levelTwoTask.taskParentDesc}}</div>
                  </el-tooltip>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="!showState.showNameInput" label="Name">
                <span style="width: 100%; color: black; font-weight: bold; font-size: 17px" >{{levelTwoTask.taskName}}</span>
              </el-form-item>
              <el-form-item v-show="showState.showNameInput" label="Name" prop="taskName">
                <el-input :disabled="disabledState.disabledNameInput" v-model="levelTwoTask.taskName" style="width: 100%" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showType" label="Task Type" prop="taskTypeId">
                <el-select :disabled="disabledState.disabledType" v-model="levelTwoTask.taskTypeId" style="width: 100%">
                  <el-option label=" " value=""></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showRelatedSkills" label="Related Skills">
                <el-select :disabled="disabledState.disabledRelatedSkills" v-model="levelTwoTask.taskRelatedSkills" multiple filterable style="width: 100%">
                  <el-option label="1222" value="1"></el-option>
                </el-select>  
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
               <el-form-item v-show="showState.showTimeGroupType" label="Time Group Type">
                <el-radio-group :disabled="disabledState.disabledTimeGroupType" v-model="levelTwoTask.taskTimeGroupType" style="width: 100%">
                  <el-radio label="Sprintly">Sprintly</el-radio>
                  <el-radio label="Weekly">Weekly</el-radio>
                  <el-radio label="Monthly">Monthly</el-radio>
                  <el-radio label="Others">Others</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-show="showState.showScope" label="Scope(Baseline)">
            <el-input :disabled="disabledState.disabledScope" v-model="levelTwoTask.taskScope" style="width: 100%" ></el-input>
          </el-form-item>
          <el-form-item v-show="showState.showDescription" label="Description" prop="taskDescription">
            <el-input :disabled="disabledState.disabledDescription" v-model="levelTwoTask.taskDescription" class="highlight-text-format" style="width: 100%" ></el-input>
          </el-form-item>
          <el-form-item v-show="showState.showDetail" label="Detail">
            <el-input :disabled="disabledState.disabledDetail" v-model="levelTwoTask.taskDetail" class="highlight-text-format" type="textarea" :rows="6" style="width: 100%" ></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showCreator" label="Created By">
                <span>{{levelTwoTask.taskCreator}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- Status Tracing Tab -->
        <el-tab-pane label="Status Tracing" name="tab_status_tracing">
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showStatus" label="Status">
                <el-select :disabled="disabledState.disabledStatus" v-model="levelTwoTask.taskStatus" style="width: 100%">
                  <el-option label="Drafting" value="Drafting"></el-option>
                  <el-option label="Planning" value="Planning"></el-option>
                  <el-option label="Running" value="Running"></el-option>
                  <el-option label="Done" value="Done"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item label="Issue Date">
                <el-date-picker disabled v-model="levelTwoTask.taskIssueDate" type="datetime" placeholder="Select Date..." value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showTargetComplete" label="Target Complete">
                <el-date-picker :disabled="disabledState.disabledTargetComplete" v-model="levelTwoTask.taskTargetComplete" type="date" placeholder="Select Date..." value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showActualComplete" label="Actual Complete">
                <el-date-picker :disabled="disabledState.disabledActualComplete" v-model="levelTwoTask.taskActualComplete" type="date" placeholder="Select Date..." value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showRespLeader" label="Responsible Leader">
                <el-select :disabled="disabledState.disabledRespLeader" v-model="levelTwoTask.taskRespLeader" filterable style="width: 100%">
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
                <el-input v-model="levelTwoTask.taskEffort" disabled>
                  <template slot="append" style="font-size:16px; width:100%">hrs</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item v-show="showState.showEstimation" label="Estimation">
                <el-input :disabled="disabledState.disabledEstimation" v-model="levelTwoTask.taskEstimation">
                  <template slot="append" style="font-size:16px; width:100%">hrs</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item v-show="showState.showSubtasksEst" label="Sub Tasks Est">
                <el-input v-model="levelTwoTask.taskSubtasksEst" disabled>
                  <template slot="append" style="font-size:16px; width:100%">hrs</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- Sub Tasks Tab -->
        <el-tab-pane label="Sub Tasks List" name="tab_subtasks_list">
          <el-row>
            <el-col :span="24">
              <el-button icon="el-icon-plus" size="medium" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white', 'width': '100%'}">Create Sub Task</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-card class="box-card task-form-tab-subtasks-content" :body-style="{padding: '0px'}" shadow="never">
                  <el-table :data="levelTwoTaskSubtasksList" :row-style="showPointer" size="small" height="500" style="width: 100%">
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
        <!-- Regular Tasks Tab -->
        <el-tab-pane label="Regular Tasks List" name="tab_regulartasks_list">
          <el-row>
            <el-col :span="24">
              <el-button icon="el-icon-plus" size="medium" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white', 'width': '100%'}">Create Regular Task</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-card class="box-card task-form-tab-regulartasks-content" :body-style="{padding: '0px'}" shadow="never">
                  <el-table :data="levelTwoTaskRegulartasksList" :row-style="showPointer" size="small" height="500" style="width: 100%">
                    <el-table-column v-if="false" prop="regulartaskId" label="Id" fixed="left"></el-table-column>
                    <el-table-column width="120" align="left" prop="regulartaskName" label="Task Name" sortable key="1"></el-table-column>
                    <el-table-column min-width="280" align="left" prop="regulartaskDescription" label="Description" key="2"></el-table-column>
                    <el-table-column width="120" align="center" prop="regulartaskStatus" label="Status" sortable key="3">
                      <template slot-scope="scope">
                        <el-tag effect="dark" type="warning" size="mini" v-if="scope.row.regulartaskStatus == 'Drafting'">{{scope.row.regulartaskStatus}}</el-tag>
                        <el-tag effect="dark" type="primary" size="mini" v-if="scope.row.regulartaskStatus == 'Planning'">{{scope.row.regulartaskStatus}}</el-tag>
                        <el-tag effect="dark" type="success" size="mini" v-if="scope.row.regulartaskStatus == 'Running'" >{{scope.row.regulartaskStatus}}</el-tag>
                        <el-tag effect="dark" type="info"    size="mini" v-if="scope.row.regulartaskStatus == 'Done'"    >{{scope.row.regulartaskStatus}}</el-tag>
                      </template>
                    </el-table-column>
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
    name: 'levelTwoTaskDialog',
    data() {
      return {
        btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
        btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
        headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
        dialogWidth: '70%',
        activeTab: 'tab_basic_info',
        levelTwoTaskDialogTitle: '2 - Business Implementation',
        levelTwoTaskDialogVisible: false,
        disabledSaveBtn: false,
        levelTwoTaskFormRules: {
          taskParentName:  [{required: true, message: 'Not allow empty', trigger: 'blur'}],
          taskName:        [{required: true, message: 'Not allow empty', trigger: 'blur'}],
          taskTypeId:      [{required: true, message: 'Not allow empty', trigger: 'change'}],
          taskDescription: [{required: true, message: 'Not allow empty', trigger: 'blur'}]
        },
        disabledState: {
          disabledParent: false,
          disabledNameInput: false,
          disabledType: false,
          disabledRelatedSkills: false,
          disabledTimeGroupType: false,
          disabledScope: false,
          disabledDescription: false,
          disabledDetail: false,
          disabledStatus: false,
          disabledTargetComplete: false,
          disabledActualComplete: false,
          disabledRespLeader: false,
          disabledEstimation: false
        },
        showState: {
          showParent: true,
          showNameInput: true,
          showType: true,
          showRelatedSkills: true,
          showTimeGroupType: true,
          showScope: true,
          showDescription: true,
          showDetail: true,
          showCreator: true,
          showStatus: true,
          showTargetComplete: true,
          showActualComplete: true,
          showRespLeader: true,
          showEffort: true,
          showEstimation: true,
          showSubtasksEst: true
        },
        levelTwoTask: {
          taskId: 0,
          taskLevel: 2,
          taskParentName: '',
          taskParentDesc: 'Testing of task parent task description',
          taskName: '',
          taskTypeId: 1,
          taskRelatedSkills: [],
          taskTimeGroupType: 'Sprintly',
          taskScope: '',
          taskDescription: '',
          taskDetail: '',
          taskCreator: '',
          taskStatus: 'Drafting',
          taskIssueDate: '',
          taskTargetComplete: '',
          taskActualComplete: '',
          taskRespLeader: '',
          taskEffort: 0,
          taskEstimation: 0,
          taskSubtasksEst: 0
        },
        levelTwoTaskSubtasksList: [
          {subtaskId: 1, subtaskName: 'MTL19.1-1', subtaskDescription: 'MTL AO TOS - Application Development', subtaskStatus: 'Drafting', subtaskAssignee: 'Leo.Li'},
          {subtaskId: 2, subtaskName: 'MTL19.1-2', subtaskDescription: 'MTL AO TOS - Application Development', subtaskStatus: 'Planning', subtaskAssignee: 'Leo.Li'},
          {subtaskId: 3, subtaskName: 'MTL19.1-3', subtaskDescription: 'MTL AO TOS - Application Development', subtaskStatus: 'Running', subtaskAssignee: 'Leo.Li'},
          {subtaskId: 3, subtaskName: 'MTL19.1-4', subtaskDescription: 'MTL AO TOS - Application Development', subtaskStatus: 'Done', subtaskAssignee: 'Leo.Li'}
        ],
        levelTwoTaskRegulartasksList: [
          {regulartaskId: 1, regulartaskName: 'MTL19.1-1', regulartaskDescription: 'MTL AO TOS - Application Development', regulartaskStatus: 'Drafting'},
          {regulartaskId: 2, regulartaskName: 'MTL19.1-2', regulartaskDescription: 'MTL AO TOS - Application Development', regulartaskStatus: 'Planning'},
          {regulartaskId: 3, regulartaskName: 'MTL19.1-3', regulartaskDescription: 'MTL AO TOS - Application Development', regulartaskStatus: 'Running'},
          {regulartaskId: 3, regulartaskName: 'MTL19.1-4', regulartaskDescription: 'MTL AO TOS - Application Development', regulartaskStatus: 'Done'}
        ]
      }
    },
    props: {
      'action': Object
    },
    watch: {
      action: {
         handler (val, oldVal) {
          console.log('Level 2 dialog action: ', val)
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
      this.initTaskForm('2 - Business Implementation', 'tab_basic_info')
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
        this.$data.levelTwoTaskDialogTitle = iTitle
        this.$data.activeTab = iActiveTab
        var date = new Date()
        this.$data.levelTwoTaskSubtasksList = []
        this.$data.levelTwoTaskRegulartasksList = []
        this.$data.levelTwoTask = {
          taskId: 0,
          taskLevel: 2,
          taskParentName: '',
          taskParentDesc: 'Testing of task parent task description',
          taskName: '',
          taskTypeId: 1,
          taskRelatedSkills: [],
          taskTimeGroupType: 'Sprintly',
          taskScope: '',
          taskDescription: '',
          taskDetail: '',
          taskCreator: '',
          taskStatus: 'Drafting',
          taskIssueDate: '',
          taskTargetComplete: '',
          taskActualComplete: '',
          taskRespLeader: '',
          taskEffort: 0,
          taskEstimation: 0,
          taskSubtasksEst: 0
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
        console.log('Create level 2 task')
        this.initTaskForm('2 - New Business Implementation', 'tab_basic_info')
        this.$data.levelTwoTaskDialogVisible = true
      },
      editTask () {
        console.log('Edit level 2 task')
        this.initTaskForm('2 - Business Implementation', 'tab_basic_info')
        this.$data.levelTwoTaskDialogVisible = true
      },
      closeTask (done) {
        console.log('Close level 2 task')
        this.initTaskForm('2 - Business Implementation', 'tab_basic_info')
        this.$data.levelTwoTaskDialogVisible = false
        this.$emit('closeTask', '2')
        done()
      },
      saveTask () {
        console.log('Save level 2 task')
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

.level-two-task-dialog {
  min-width: 600px;
}
.level-two-task-dialog .el-dialog__body {
  padding: 10px 20px;
}
.level-two-task-dialog-form {
  text-align: left;
}
.level-two-task-dialog-form .el-form-item {
  margin-bottom: 10px;
}
.task-form-tab-subtasks-content {
  margin-top: 10px;
}
.task-form-tab-regulartasks-content {
  margin-top: 10px;
}
.level-two-task-dialog-form-list-name {
  font-size: 16px;
  color: #57606f;
  text-overflow: ellipsis;
  overflow: hidden;
}
.level-two-task-dialog-form-list-desc {
  font-size: 14px;
  color: #bdc3c7;
}
.level-two-task-dialog-form-desc {
  font-size: 17px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.level-two-task-dialog .el-dialog__body {
  padding: 10px 20px;
}
.level-two-task-dialog-form .el-table th {
  padding: 3px 0;
  color: #616161;
}
.level-two-task-dialog-form .el-form-item__error {
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