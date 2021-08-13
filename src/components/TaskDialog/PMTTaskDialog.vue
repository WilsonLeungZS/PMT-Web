<!-- 
Module: PMTTaskDialog
Description: display task details for PMT task (base information/status tracing/sub tasks list/worklog histories)
Remark:
-->
<template>
  <div>
    <el-dialog :before-close="closeTask" :visible.sync="PMTTaskDialogVisible" :title="PMTTaskDialogTitle" :width="dialogWidth" top="5%" :close-on-click-modal="false" class="pmt-task-dialog">
      <el-form :model="PMTTask" :rules="PMTTaskFormRules" ref="form" label-width="140px" label-position="left" class="pmt-task-dialog-form">
        <el-tabs @tab-click="changeTab" v-model="activeTab" ref="PMTTaskDialogTabs" type="card">
          <!-- Basic Information Tab -->
          <el-tab-pane label="Basic Information" name="tab_basic_info">
            <el-row>
              <el-col :span="24">
                <el-form-item v-show="showState.showParent" label="Parent Task" prop="taskParentTaskName">
                  <el-col :span="12" :lg="6">
                    <el-autocomplete disabled v-model="PMTTask.taskParentTaskName" popper-class="task-autocomplete" :trigger-on-focus="false"  :clearable="true" style="width: 100%" :debounce=0>
                      <template slot-scope="{ item }">
                        <div class="pmt-task-dialog-form-list-name">{{ item.value }}</div>
                        <span class="pmt-task-dialog-form-list-desc">{{ item.description }}</span>
                      </template>
                    </el-autocomplete>
                  </el-col>
                  <el-col :span="24" :lg="{span: 17, offset: 1}">
                    <el-tooltip :content="PMTTaskParentTaskTitle" class="item" effect="dark" placement="top-start">
                      <div v-show="showState.showParentTitle" class="pmt-task-dialog-form-desc">{{PMTTaskParentTaskTitle}}</div>
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
                    <el-option label="Development(Change, Problem)" value="Development"></el-option>
                    <el-option label="Maintenance(Incident)" value="Maintenance"></el-option>
                    <el-option label="Others(Service Request, ITSR, Others)" value="Others"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" :lg="11">
                <el-form-item v-show="showState.showTypeTag" label="Type Tag" prop="taskTypeTag">
                  <el-select disabled v-model="PMTTask.taskTypeTag" style="width: 100%">
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
            <el-row>
              <el-col :span="24" :lg="11">
                <el-form-item v-show="showState.showCustomer" label="Customer" prop="taskCustomerId">
                  <el-select :disabled="disabledState.disabledCustomer" v-model="PMTTask.taskCustomerId" style="width: 100%">
                    <el-option v-for="(customer, index) in customersList" :key="index" :label="customer.customerName" :value="customer.customerId"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" :lg="{span: 12, offset: 1}">
                <el-form-item v-show="showState.showRequiredSkills" label="Required Skills" prop="taskRequiredSkills">
                  <el-select :disabled="disabledState.disabledRequiredSkills" v-model="PMTTask.taskRequiredSkills" style="width: 100%" multiple clearable>
                    <el-option-group v-for="(skillGroup, index) in skillsList" :key="index" :label="skillGroup.Label">
                      <el-option v-for="(skill, index) in skillGroup.Options" :key="index" :label="skill.skillName" :value="skill.skillId">
                        <span style="float: left;">{{ skill.skillName }}</span>
                        <span style="float: left; margin-left:10px; color: #8492a6; font-size: 12px">{{ skill.skillDesc }}</span>
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
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
                  <el-col :span="24" :lg="{span: 16, offset: 2}">
                    <span style="font-size: 19px">Ref Task Effort / Estimation: <b>{{PMTTaskReferenceTaskEffort}}</b> / <b>{{PMTTaskReferenceTaskEstimation}}</b> hrs</span>
                  </el-col>
                  <el-col :span="24" :lg="24" style="margin-top: 5px">
                    <el-tooltip :content="PMTTaskReferenceTaskTitle" class="item" effect="dark" placement="top-start">
                      <div v-show="showState.showReferenceTaskTitle" class="pmt-task-dialog-form-desc">{{PMTTaskReferenceTaskTitle}}</div>
                    </el-tooltip>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item v-show="showState.showSprint" label="Sprint">
              <el-select :disabled="disabledState.disabledSprint" v-model="PMTTask.taskSprintId" style="width: 100%" clearable>
                <el-option label=" " value=""></el-option>
                <el-option-group v-for="(sprintGroup, index) in sprintsList" :key="index" :label="sprintGroup.Label">
                  <el-option v-for="(sprint, index) in sprintGroup.Options" :key="index" :label="'【' + sprintGroup.Label + '】 ' + sprint.sprintName" :value="sprint.sprintId">
                    <span style="float: left; margin-right:20px">{{sprint.sprintName}}</span>
                    <span style="float: right; color: #8492a6; font-size: 12px">{{sprint.sprintLeader}}</span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
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
                  <el-select :disabled="disabledState.disabledStatus" v-model="PMTTask.taskStatus" style="width: 100%" @change="taskStatusChange">
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
                  <el-date-picker :disabled="disabledState.disabledEstimation" v-model="PMTTask.taskTargetComplete" type="date" placeholder="Select Date..." value-format="yyyy-MM-dd" style="width: 100%" @change="taskTargetCompleteChange"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24" :lg="{span: 12, offset: 1}">
                <el-form-item v-show="showState.showActualComplete" label="Actual Complete">
                  <el-date-picker :disabled="disabledState.disabledActualComplete" v-model="PMTTask.taskActualComplete" type="date" placeholder="Select Date..." value-format="yyyy-MM-dd" style="width: 100%" @change="taskActualCompleteChange"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" :lg="11">
                <el-form-item v-show="showState.showRespLeader" label="Responsible Leader">
                  <el-select disabled v-model="PMTTask.taskRespLeaderId" style="width: 100%">
                    <el-option label=" " value=""></el-option>
                    <el-option v-for="(user, index) in usersList" :key="index" :label="user.userName" :value="user.userId">
                      <span style="float: left; margin-right:20px">{{ user.userName }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ user.userLevel }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" :lg="{span: 12, offset: 1}">
                <el-form-item v-show="showState.showAssignee" label="Owner To">
                  <el-select :disabled="disabledState.disabledAssignee" v-model="PMTTask.taskAssigneeId" filterable style="width: 100%">
                    <el-option label=" " value=""></el-option>
                    <el-option v-for="(user, index) in usersList" :key="index" :label="user.userFullName" :value="user.userId">
                      <span style="float: left; margin-right:20px">{{ user.userFullName }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ user.userLevel }}</span>
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
                  <div class="input-number-div">
                    <el-input :disabled="disabledState.disabledEstimation" v-model="PMTTask.taskEstimation" @input="estimationIpt" :min="0">
                    </el-input>
                    <div class="input-number-btn">
                      <span class="add" @click="estimationChange('add',PMTTask.taskEstimation)"><i class="el-icon-arrow-up"></i></span>
                      <span class="subtract" @click="estimationChange('subtract',PMTTask.taskEstimation)"><i class="el-icon-arrow-down"></i></span>
                    </div>
                    <span class="div-span">hrs</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- Sub Tasks Tab -->
          <el-tab-pane label="Sub Tasks" name="tab_subtasks_list">
            <!--<el-row>
              <el-col :span="24">
                <el-button icon="el-icon-plus" size="medium" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white', 'width': '100%'}">Create Sub Task</el-button>
              </el-col>
            </el-row>-->
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
                      <el-table-column width="120" align="center" prop="subtaskAssignee" label="Owner To" sortable key="4"></el-table-column>
                      <!--<el-table-column width="30" align="center" fixed="right">
                        <template slot-scope="scope">
                          <el-row>
                            <el-col :span="1"><i class="el-icon-arrow-right"></i></el-col>
                          </el-row>
                        </template>
                      </el-table-column>-->
                    </el-table>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- History of the sprint Tab -->
          <el-tab-pane label="History sprint" name="tab_hubtasks_sprint">
            <el-collapse v-if="hubtasksSprintList.length > 0">
              <el-collapse-item v-for="(item,index) in hubtasksSprintList" :key="index"  :title="`${item[0].sprint.timeline.StartTime} ~ ${item[0].sprint.timeline.EndTime}`" :name="index" >
                <div v-for="(sub,subidx) in item" :key="subidx">
                  {{sub.Title}}
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <!-- Worklog Histories Tab -->
          <el-tab-pane label="Worklog Histories" name="tab_worklog_histories">
              <el-card class="box-card pmt-task-dialog-history-tab">
                <el-timeline>
                  <el-timeline-item v-for="(history, index) in PMTTaskWorklogHistories" :key="index" :timestamp="history.worklogTimestamp"
                    icon="el-icon-star-on" size="large" placement="top" type="primary" class="tl-history">
                    {{history.worklogContent}}
                  </el-timeline-item>
                </el-timeline>
              </el-card>
            </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-show="showAddWorklogBtn" @click="addWorklog" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" size="medium">Add Worklog</el-button>
        <el-button :disabled="disabledSaveBtn" @click="saveTask" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="medium">Save</el-button>
      </span>
    </el-dialog> 
    <!-- Worklog Dialog-->
    <worklog-dialog @refreshTask="refreshTask" :action="worklogAction"></worklog-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import http from '../../utils/http'
  import utils from '../../utils/utils'
  import WorklogDialog from '../Timesheet/TimesheetPlugins/WorklogDialog'
  export default {
    name: 'PMTTaskDialog',
    data() {
      return {
        btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
        btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
        headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
        userName: this.$store.getters.getUserEid,
        userLevel: this.$store.getters.getUserLevel,
        userId: this.$store.getters.getUserId,
        dialogWidth: '70%',
        activeTab: 'tab_basic_info',
        PMTTaskDialogTitle: 'Backlog Details',
        PMTTaskDialogVisible: false,
        showAddWorklogBtn: true,
        disabledSaveBtn: false,
        skillsList: [],
        usersList: [],
        sprintsList: [],
        PMTTaskFormRules: {
          taskTitle: [{required: true, message: 'Not allow empty', trigger: 'blur'}],
          taskCustomerId: [{required: true, message: 'Not allow empty', trigger: 'blur'}],
          taskRequiredSkills: [{required: true, message: 'Not allow empty', trigger: 'change'}]
        },
        DeliverableOptions: [
          {value: 'Clarify Requirement', label: 'Clarify Requirement'},
          {value: 'Document Scenarios', label: 'Document Scenarios'}, 
          {value: 'Design Program', label: 'Design Program'},
          {value: 'Ready to UAT', label: 'Ready to UAT'},
          {value: 'UAT In Support', label: 'UAT In Support'},
          {value: 'Ready to PROD', label: 'Ready to PROD'}
        ],
        disabledState: {
          disabledParent: false,
          disabledParentTitle: false,
          disabledNameInput: false,
          disabledType: false,
          disabledTypeTag: false,
          disabledDeliverableTag: false,
          disabledCustomer: false,
          disabledSprint: false,
          disabledRequiredSkills: false,
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
          showCustomer: true,
          showSprint: true,
          showRequiredSkills: true,
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
          taskId: null,
          taskParentTaskName: '',
          taskName: '',
          taskCategory: '',
          taskType: '',
          taskTypeTag: '',
          taskDeliverableTag: [],
          taskCustomerId: '',
          taskSprintId: null,
          taskRequiredSkills: [], 
          taskReferenceTask: '',
          taskTitle: '',
          taskDescription: '',
          taskCreator: '',
          taskStatus: 'Drafting',
          taskIssueDate: '',
          taskTargetComplete: '',
          taskActualComplete: '',
          taskRespLeaderId: '',
          taskAssigneeId: null,
          taskEffort: 0,
          taskEstimation: 0,
        },
        PMTTaskParentTaskTitle: '',
        PMTTaskReferenceTaskEffort: 0,
        PMTTaskReferenceTaskEstimation: 0,
        PMTTaskReferenceTaskTitle: '',
        PMTTaskSubtasksList: [],
        PMTTaskWorklogHistories: [],
        sprintStatus: '',
        sprintRequiredSkills: '',
        worklogAction: null,
        customersList: [],
        hubtasksSprintList:[]
      }
    },
    components: {
      WorklogDialog
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
          if (actionObj.action == 'CREATE-REF') {
            this.$data.sprintRequiredSkills = actionObj.taskRequiredSkills
            this.createRefTask(actionObj)
          }
          if (actionObj.action == 'CREATE-SUB') {
            this.createSubTask(actionObj)
          }
          if (actionObj.action == 'EDIT') {
            this.$data.sprintStatus = actionObj.sprintStatus
            this.editTask(actionObj.taskId)
          }
        },
        immediate: true,
        deep: true
      }
    },
    created () {
      this.initTaskForm('Backlog Details', 'tab_basic_info')
    },
    mounted () {
    },
    updated () {
    },
    methods: {
      taskActualCompleteChange(val){
        let sprint = null 
        this.sprintsList.forEach(item =>{
          sprint = item.Options.filter(sub =>{
            return sub.sprintId == this.PMTTask.taskSprintId
          })
        })
        let curDate = new Date(val).getTime();
        let startDate  = new Date(sprint[0].sprintStartTime).getTime();
        let endDate = new Date(sprint[0].sprintEndTime).getTime();
        if (curDate < startDate || curDate > endDate) {
           this.PMTTask.taskActualComplete = '';
           this.$message.error('Actual complete should be within sprint timeline for sprint tasks.')
        }
      },
      taskTargetCompleteChange(val){
        if(this.PMTTaskDialogTitle == 'Backlog Details'){
          return;
        }
        let sprint = null 
        this.sprintsList.forEach(item =>{
          sprint = item.Options.filter(sub =>{
            return sub.sprintId == this.PMTTask.taskSprintId
          })
        })
        let curDate = new Date(val).getTime();
        let startDate  = new Date(sprint[0].sprintStartTime).getTime();
        let endDate = new Date(sprint[0].sprintEndTime).getTime();
        if (curDate < startDate || curDate > endDate) {
           this.PMTTask.taskTargetComplete = '';
           this.$message.error('Target complete should be within sprint timeline for sprint tasks .')
        }
      },
      taskStatusChange(val){
        if(val == 'Planning' && !this.PMTTask.taskTargetComplete){
           this.$message.error('We should input target complete time before planning stage.')
           this.PMTTask.taskStatus = 'Drafting'
           return;
        }
        if(val == 'Running' && !this.PMTTask.taskAssigneeId){
           this.$message.error('Tasks owner should be inputted.')
           this.PMTTask.taskStatus = 'Drafting'
           return;
        }
        if(val == 'Running' && !this.PMTTask.taskEstimation){
           this.$message.error('Estimation should be inputted and over 0.')
           this.PMTTask.taskStatus = 'Drafting'
           return;
        }
        let sprint = null 
        this.sprintsList.forEach(item =>{
          sprint = item.Options.filter(sub =>{
            return sub.sprintId == this.PMTTask.taskSprintId
          })
        })
        if(val == 'Running' && !this.PMTTask.taskTargetComplete){
           this.PMTTask.taskTargetComplete = sprint[0].sprintEndTime
        }
        if(val == 'Done' && !this.PMTTask.taskActualComplete){
          this.PMTTask.taskActualComplete = sprint[0].sprintEndTime
        }
      },
      // Style method
      showPointer ({row, rowIndex}) {
        let pointerObj = {
          cursor: 'pointer'
        }
        return pointerObj
      },
      // Tab Methods
      changeTab (tab, event) {
        console.log('Tab ', tab)
        if (tab.name == 'tab_subtasks_list') {
          this.setSubtasksListByName(this.$data.PMTTask.taskName)
        }
        if (tab.name == 'tab_worklog_histories') {
          this.setWorklogHistoriesById(this.$data.PMTTask.taskId)
        }
        if(tab.name == 'tab_hubtasks_sprint'){
          this.getTaskListByReferenceTask(this.PMTTask.taskName.split('-')[0])
        }
      },
      // Functional Methods
      initTaskForm(iTitle, iActiveTab) {
        this.$data.PMTTaskDialogTitle = iTitle
        this.$data.activeTab = iActiveTab
        this.$data.PMTTaskSubtasksList = []
        this.$data.PMTTask = {
          taskId: null,
          taskParentTaskName: '',
          taskName: '',
          taskCategory: '',
          taskType: '',
          taskTypeTag: '',
          taskDeliverableTag: [],
          taskCustomerId: '',
          taskSprintId: null,
          taskRequiredSkills: [],
          taskReferenceTask: '',
          taskTitle: '',
          taskDescription: '',
          taskCreator: '',
          taskStatus: 'Drafting',
          taskIssueDate: this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          taskTargetComplete: '',
          taskActualComplete: '',
          taskRespLeaderId: '',
          taskAssigneeId: null,
          taskEffort: 0,
          taskEstimation: 0,
        }
        this.$data.PMTTaskParentTaskTitle = ''
        this.$data.PMTTaskReferenceTaskEffort = 0,
        this.$data.PMTTaskReferenceTaskEstimation = 0,
        this.$data.PMTTaskReferenceTaskTitle = ''
        for(let key in this.$data.disabledState) {
          this.$data.disabledState[key] = false
        }
        for(let key in this.$data.showState) {
          this.$data.showState[key] = true
        }
        this.$data.showAddWorklogBtn = true
        this.$data.disabledSaveBtn = false
        this.$data.skillsList = []
        this.$data.usersList = []
        this.$data.sprintsList = []
        this.getAllSkillsList()
        this.getActiveSprintsList()
        this.getCustomerList()
      },
      createTask () {
        console.log('Create PMT task')
        this.initTaskForm('New Backlog', 'tab_basic_info')
        // Hide sub tasks and worklog histories tabs
        this.$nextTick(() => {
          this.$refs.PMTTaskDialogTabs.$children[0].$refs.tabs[2].style.display = 'none' // Hide "Sub Tasks List" Tab
          this.$refs.PMTTaskDialogTabs.$children[0].$refs.tabs[3].style.display = 'none' // Hide "Worklog Histories" Tab
        })
        // Set new Backlog default value
        this.$data.PMTTask.taskCategory = 'PMT-TASK'
        this.$data.PMTTask.taskTypeTag = 'One-Off Task'
        this.$data.PMTTask.taskSprintIndicator = null
        // Set new Backlog default state(show)
        this.$data.showState.showParent = false
        this.$data.showState.showParentTitle = false
        this.$data.showState.showDeliverableTag = false
        this.$data.showState.showReferenceTask = false
        this.$data.showState.showReferenceTaskTitle = false
        this.$data.showState.showSprint = false
        this.$data.showState.showCreator = false
        this.$data.showState.showRespLeader = false
        this.$data.showState.showAssignee = false
        this.$data.showAddWorklogBtn = false
        this.$data.PMTTaskDialogVisible = true
      },
      createRefTask (iObj) {
        console.log('Create PMT Ref task ', iObj)
        this.initTaskForm('New Sprint Task', 'tab_basic_info')
        // Set new Backlog default value
        this.$data.PMTTask.taskCategory = 'PMT-TASK-REF'
        this.$data.PMTTask.taskType = iObj.taskType
        this.$data.PMTTask.taskTypeTag = iObj.taskTypeTag
        this.$data.PMTTask.taskSprintId = iObj.taskSprintId
        this.$data.PMTTask.taskCustomerId = iObj.taskCustomerId
        this.$data.PMTTask.taskRequiredSkills = iObj.taskRequiredSkills
        this.$data.PMTTask.taskReferenceTask = iObj.taskReferenceTask
        this.$data.PMTTaskReferenceTaskEffort = iObj.taskReferenceTaskEffort
        this.$data.PMTTaskReferenceTaskEstimation = iObj.taskReferenceTaskEstimation
        this.$data.PMTTaskReferenceTaskTitle = iObj.taskReferenceTaskTitle
        this.$data.PMTTask.taskTitle = iObj.taskReferenceTaskTitle
        this.$data.PMTTask.taskRespLeaderId = iObj.taskRespLeaderId
        if (iObj.taskTypeTag == 'Public Task') {
          this.$data.PMTTask.taskSprintIndicator = 'PUBLIC'
        }
        if (iObj.sprintStatus == 'Active' && iObj.taskTypeTag == 'One-Off Task') {
          this.$data.PMTTask.taskSprintIndicator = 'PLANNED'
        }
        if (iObj.sprintStatus == 'Running' && iObj.taskTypeTag == 'One-Off Task') {
          this.$data.PMTTask.taskSprintIndicator = 'UNPLAN'
        }
        this.getActiveUsersListBySprintId(iObj.taskSprintId)
        // Set new Backlog default state
        this.$data.disabledState.disabledReferenceTask = true
        this.$data.disabledState.disabledSprint = true
        // Set new Backlog default state(show)
        this.$data.showState.showParent = false
        this.$data.showState.showParentTitle = false
        if (iObj.taskTypeTag == 'Public Task') {
          this.$data.showState.showAssignee = false
        }
        // Hide sub tasks and worklog histories tabs
        this.$nextTick(() => {
          this.$refs.PMTTaskDialogTabs.$children[0].$refs.tabs[2].style.display = 'none' // Hide "Sub Tasks List" Tab
          this.$refs.PMTTaskDialogTabs.$children[0].$refs.tabs[3].style.display = 'none' // Hide "Worklog Histories" Tab
        })
        this.$data.showAddWorklogBtn = false
        this.$data.PMTTaskDialogVisible = true
      },
      createSubTask (iObj) {
        console.log('Create PMT Sub task')
        this.initTaskForm('Add Sprint Task Subtask', 'tab_basic_info')
        // Set new Backlog default value
        this.$data.PMTTask.taskCategory = 'PMT-TASK-SUB'
        this.$data.PMTTask.taskParentTaskName = iObj.taskParentTaskName
        this.$data.PMTTaskParentTaskTitle = iObj.taskParentTaskTitle
        this.$data.PMTTask.taskType = iObj.taskType
        this.$data.PMTTask.taskTypeTag = iObj.taskTypeTag
        this.$data.PMTTask.taskCustomerId = iObj.taskCustomerId
        this.$data.PMTTask.taskReferenceTask = iObj.taskReferenceTask
        this.$data.PMTTask.taskSprintId = iObj.taskSprintId
        this.$data.PMTTask.taskRequiredSkills = iObj.taskRequiredSkills
        this.$data.PMTTask.taskRespLeaderId = iObj.taskRespLeaderId
        this.$data.PMTTask.taskSprintIndicator = iObj.taskSprintIndicator
        this.setReferenceTaskTitleByName(iObj.taskReferenceTask)
        this.getActiveUsersListBySprintId(iObj.taskSprintId)
        // Set sub task show state
        if (iObj.taskTypeTag == 'Public Task') {
          this.$data.showState.showAssignee = false
        }
        // Set sub Task disabled state
        this.$data.disabledState.disabledParent = true
        this.$data.disabledState.disabledType = true
        this.$data.disabledState.disabledRequiredSkills = true
        this.$data.disabledState.disabledCustomer = true
        this.$data.disabledState.disabledReferenceTask = true
        this.$data.disabledState.disabledSprint = true
        // Hide sub tasks and worklog histories tabs
        this.$nextTick(() => {
          this.$refs.PMTTaskDialogTabs.$children[0].$refs.tabs[2].style.display = 'none' // Hide "Sub Tasks List" Tab
          this.$refs.PMTTaskDialogTabs.$children[0].$refs.tabs[3].style.display = 'none' // Hide "Worklog Histories" Tab
        })
        this.$data.showAddWorklogBtn = false
        this.$data.PMTTaskDialogVisible = true
      },
      async editTask (iTaskId) {
        console.log('Edit PMT task - ', iTaskId)
        // Get task information by id
        const res = await http.get('/tasks/getTaskById', {
          reqTaskId: iTaskId
        })
        if (res.data != null && res.data.status == 0) {
          this.$data.sprintRequiredSkills = res.data.data.taskRequiredSkills
        }
        this.initTaskForm(this.action.openTitle || 'Backlog Task Details' , 'tab_basic_info')
        if (res.data != null && res.data.status == 0) {
          this.$nextTick(() => {
            this.setParentTaskTitleByName(res.data.data.taskParentTaskName)
            this.setReferenceTaskTitleByName(res.data.data.taskReferenceTask)
            this.$data.PMTTask = res.data.data
          })
        }
        // Validate task category and hide related fields
        var task = res.data.data
        var taskCategory = task.taskCategory
        if (taskCategory == 'PMT-TASK') {
          // Hide field
          this.$data.showState.showParent = false
          this.$data.showState.showParentTitle = false
          this.$data.showState.showDeliverableTag = false
          this.$data.showState.showReferenceTask = false
          this.$data.showState.showReferenceTaskTitle = false
          this.$data.showState.showSprint = false
          this.$data.showState.showRespLeader = false
          this.$data.showState.showAssignee = false
          this.$data.showAddWorklogBtn = false
          // Hide all tabs
          if (this.$refs.PMTTaskDialogTabs != undefined) {
            this.$nextTick(() => {
              this.$refs.PMTTaskDialogTabs.$children[0].$refs.tabs[2].style.display = 'none' // Hide "Sub Tasks List" Tab
              this.$refs.PMTTaskDialogTabs.$children[0].$refs.tabs[3].style.display = 'none' // Hide "Worklog Histories" Tab
            })
          }
        }
        if (taskCategory == 'PMT-TASK-REF') {
          this.$data.showState.showParent = false
          this.$data.showState.showParentTitle = false
          // Set new Backlog default state
          this.$data.disabledState.disabledRequiredSkills = true
          this.$data.disabledState.disabledReferenceTask = true
          if (this.$data.userLevel >8) {
            this.$data.disabledState.disabledSprint = true
          }
          var taskStatus = res.data.data.taskStatus
          if (taskStatus == 'Running' || taskStatus == 'Done') {
            this.$data.showAddWorklogBtn = true
          } else {
            this.$data.showAddWorklogBtn = false
          }
          // Show all tabs
          if (this.$refs.PMTTaskDialogTabs != undefined) {
            this.$nextTick(() => {
              this.$refs.PMTTaskDialogTabs.$children[0].$refs.tabs[2].style.display = '' // Show "Sub Tasks List" Tab
              this.$refs.PMTTaskDialogTabs.$children[0].$refs.tabs[3].style.display = '' // Show "Worklog Histories" Tab
            })
          }
          // Get assignee list by sprint Id
          this.getActiveUsersListBySprintId(res.data.data.taskSprintId)
        }
        if (taskCategory == 'PMT-TASK-SUB') {
          this.$data.disabledState.disabledType = true
          this.$data.disabledState.disabledCustomer = true
          this.$data.disabledState.disabledRequiredSkills = true
          this.$data.disabledState.disabledReferenceTask = true
          this.$data.disabledState.disabledSprint = true
          var taskStatus = res.data.data.taskStatus
          if (taskStatus == 'Running' || taskStatus == 'Done') {
            this.$data.showAddWorklogBtn = true
          } else {
            this.$data.showAddWorklogBtn = false
          }
          // Hide 1 tab and show 1 tabS
          if (this.$refs.PMTTaskDialogTabs != undefined) {
            console.log('Sub Task')
            this.$nextTick(() => {
              this.$refs.PMTTaskDialogTabs.$children[0].$refs.tabs[2].style.display = 'none' // Hide "Sub Tasks List" Tab
              this.$refs.PMTTaskDialogTabs.$children[0].$refs.tabs[3].style.display = '' // Show "Worklog Histories" Tab
            })
          }
          // Get assignee list by sprint Id
          this.getActiveUsersListBySprintId(res.data.data.taskSprintId)
        }
        // Apply for all category task
        if (task.taskStatus == 'Running' || task.taskStatus == 'Done') {
          this.$data.disabledState.disabledEstimation = true
        }
        if (task.taskTypeTag == 'Public Task') {
          this.$data.showState.showAssignee = false
          this.$data.showState.showEstimation = false
          this.$data.showState.showDeliverableTag = false
        }
        this.$data.PMTTaskDialogVisible = true
      },
      closeTask (done) {
        console.log('Close PMT task')
        this.initTaskForm('Backlog Details', 'tab_basic_info')
        this.$data.PMTTaskDialogVisible = false
        done()
      },
      async saveTask () {
        console.log('Save PMT task')
        var reqTask = this.$data.PMTTask
        if(this.disabledState.disabledEstimation && !this.PMTTask.taskTargetComplete){
          let sprint = null 
          this.sprintsList.forEach(item =>{
            sprint = item.Options.filter(sub =>{
              return sub.sprintId == this.PMTTask.taskSprintId
            })
          })
          this.PMTTask.taskTargetComplete = sprint[0].sprintEndTime
        }
        if(reqTask.taskStatus == 'Running' || reqTask.taskStatus == 'Done'){
          if(!reqTask.taskTargetComplete || !reqTask.taskEstimation){
            this.$message.error('To select the Running and Done state, you need to enter Target Complete and Estimate first.')
            return
          }
        }
        if (reqTask.taskTitle == null || reqTask.taskTitle == '') {
          this.$message({message: 'Task title cannnot be empty!', type: 'error'})
          return
        }
        if (reqTask.taskCustomerId == null || reqTask.taskCustomerId == '') {
          this.$message({message: 'Task customer cannnot be empty!', type: 'error'})
          return
        }
        if ((reqTask.taskStatus == 'Running' || reqTask.taskStatus == 'Done') && reqTask.taskEstimation == 0) {
          this.$message({message: 'Task estimation cannnot be 0 when task is running or done!', type: 'error'})
          return
        }
        if (reqTask.taskRequiredSkills.length > 0) {
          for (var i=0; i<reqTask.taskRequiredSkills.length; i++) {
            reqTask.taskRequiredSkills[i] = '#' + reqTask.taskRequiredSkills[i] + '#'
          }
        } else {
          this.$message({message: 'Task required skills cannnot be empty!', type: 'error'})
          return
        }
        this.$data.disabledSaveBtn = true
        const res = await http.post('/tasks/updateTask', {
          reqTaskId: reqTask.taskId,
          reqTaskParentTaskName: reqTask.taskParentTaskName,
          reqTaskName: reqTask.taskName,
          reqTaskCategory: reqTask.taskCategory,
          reqTaskType: reqTask.taskType,
          reqTaskTitle: reqTask.taskTitle,
          reqTaskDescription: reqTask.taskDescription,
          reqTaskReferenceTask: reqTask.taskReferenceTask,
          reqTaskTypeTag: reqTask.taskTypeTag,
          reqTaskDeliverableTag: reqTask.taskDeliverableTag != null? reqTask.taskDeliverableTag.toString(): null,
          reqTaskCreator: (reqTask.taskCreator == null || reqTask.taskCreator == '')? 'PMT:'+this.$data.userName: 'PMT:'+reqTask.taskCreator,
          reqTaskRequiredSkills: reqTask.taskRequiredSkills.toString(),
          reqTaskCustomerId: reqTask.taskCustomerId,
          reqTaskStatus: reqTask.taskStatus,
          reqTaskEstimation: reqTask.taskEstimation,
          reqTaskIssueDate: reqTask.taskIssueDate,
          reqTaskTargetComplete: reqTask.taskTargetComplete,
          reqTaskActualComplete: reqTask.taskActualComplete,
          reqTaskRespLeaderId: reqTask.taskRespLeaderId,
          reqTaskAssigneeId: reqTask.taskAssigneeId,
          reqTaskSprintId: reqTask.taskSprintId,
          reqTaskSprintIndicator: reqTask.taskSprintIndicator
        })
        if (res.data != null && res.data.status == 0) {
          this.$message({message: 'Task created/updated successfully!', type: 'success'})
          var rtnTask = res.data.data
          this.editTask(rtnTask.Id)
        } else {
          this.$message({message: 'Task created/updated failed!', type: 'error'})
        }
        this.$emit('refresh')
        this.$data.disabledSaveBtn = false
      },
      refreshTask (iTaskId) {
        this.editTask(iTaskId)
        this.$emit('refresh')
      },
      addWorklog () {
        var task = this.$data.PMTTask
        var userId = this.$data.userId
        var taskId = task.taskId
        var taskName = task.taskName
        var taskTitle = task.taskTitle
        if (userId != task.taskAssigneeId) {
          this.$message.error('Can not add worklog if the task not assign to you!')
          return
        }
        this.$data.worklogAction = {
          action: 'EDIT-WORKLOG-BY-TASK',
          taskId: taskId,
          taskName: taskName,
          taskTitle: taskTitle,
          userId: userId,
          date: new Date()
        }
      },
      // Data List Method
      async getAllSkillsList () {
        this.$data.skillsList = []
        const res = await http.get('/users/getAllSkillsList')
        if (res.data != null && res.data.status === 0) {
          //this.$data.skillsList = res.data.data
          var skillsList = res.data.data
          var skillsListGroup = []
          if (skillsList != null && skillsList.length > 0) {
            for (var i=0; i<skillsList.length; i++) {
              var group = skillsList[i].skillGroup.substr(1)
              var index = this.getIndexOfValueInArr(skillsListGroup, 'Label', group)
              if (index == -1) {
                skillsListGroup.push({
                  Label: group,
                  Options: [skillsList[i]]
                })
              } else {
                skillsListGroup[index].Options.push(skillsList[i])
              }
            }
            console.log('Skills Group List: ', skillsListGroup)
          }
          this.$data.skillsList = skillsListGroup
        } else {
          this.$data.skillsList = []
        }
      },
      async getActiveUsersListBySprintId (iSprintId) {
        this.$data.usersList = []
        if (iSprintId != null && iSprintId != '') {
          const res = await http.get('/sprints/getSprintUsersById', {reqSprintId: iSprintId})
          if (res.data.status === 0) {
            var sprintUserList = res.data.data.sprintUsers
            if (sprintUserList != null && sprintUserList.length > 0) {
              for (var i=0; i<sprintUserList.length; i++) {
                var userObj = {}
                userObj.userId = sprintUserList[i].sprintUserId
                userObj.userFullName = sprintUserList[i].sprintUserFullName
                userObj.userLevel = sprintUserList[i].sprintUserLevel
                this.$data.usersList.push(userObj)
              }
            }
          }
        } else {
          const res = await http.get('/users/getActiveUsersListByLevelLimit', {reqUserLevelLimit: 13})
          if (res.data.status === 0) {
            this.$data.usersList = res.data.data
          }
        }
      },
      async getActiveSprintsList () {
        this.$data.sprintsList = []
        var reqRequiredSkills = this.$data.sprintRequiredSkills != ''? this.$data.sprintRequiredSkills.toString(): null;
        var res = await http.get('/sprints/getActiveSprintsListBySkills', {
          reqRequiredSkills: reqRequiredSkills
        })
        if (res != null && res.data.status == 0) {
          this.$data.sprintsList = this.sortListBySprintTimeGroup(res.data.data)
        } else {
          this.$data.sprintsList = []
        }
      },
      async getCustomerList () {
        this.$data.customersList = []
        const res = await http.get('/sprints/getAllCustomersList')
        if (res.data.status === 0) {
          this.$data.customersList = res.data.data
        }
      },
      async getTaskListByReferenceTask (referenceTask) {
        const res = await http.get(`/tasks/getTaskListByReferenceTask?referenceTask=${referenceTask}`)
        if (res.data != null && res.data.status === 0) {
          this.hubtasksSprintList = res.data.data
          console.log(this.hubtasksSprintList);
        } else {
          this.$data.hubtasksSprintList = []
        }
      },
      async setParentTaskTitleByName (iTaskName) {
        this.$data.PMTTaskParentTaskTitle = ''
        if (iTaskName != null && iTaskName != '') {
          const res = await http.get('/tasks/getTaskByName', {
            reqTaskName: iTaskName
          })
          if (res.data != null && res.data.status == 0) {
            this.$data.PMTTaskParentTaskTitle = res.data.data.taskTitle
          }
        }
      },
      async setReferenceTaskTitleByName (iTaskName) {
        this.$data.PMTTaskReferenceTaskEffort = 0
        this.$data.PMTTaskReferenceTaskEstimation = 0
        this.$data.PMTTaskReferenceTaskTitle = ''
        if (iTaskName != null && iTaskName != '') {
          const res = await http.get('/tasks/getTaskByName', {
            reqTaskName: iTaskName
          })
          if (res.data != null && res.data.status == 0) {
            this.$data.PMTTaskReferenceTaskTitle = res.data.data.taskTitle
            this.$data.PMTTaskReferenceTaskEffort = res.data.data.taskEffort
        this.$data.PMTTaskReferenceTaskEstimation = res.data.data.taskEstimation
          }
        }
      },
      async setSubtasksListByName (iTaskName) {
        this.$data.PMTTaskSubtasksList = []
        if (iTaskName != null && iTaskName != '') {
          const res = await http.get('/tasks/getSubtasksListByName', {
            reqTaskName: iTaskName
          })
          if (res.data != null && res.data.status == 0) {
            this.$data.PMTTaskSubtasksList = res.data.data
          }
        }
      },
      async setWorklogHistoriesById (iTaskId) {
        this.$data.PMTTaskWorklogHistories = []
        if (iTaskId != null && iTaskId != '') {
          const res = await http.get('/worklogs/getWorklogHistoriesByTaskId', {
            reqTaskId: iTaskId
          })
          if (res.data != null && res.data.status == 0) {
            this.$data.PMTTaskWorklogHistories = res.data.data
          }
        }
      },
      // Common Method
      sortListBySprintTimeGroup (iSprintList) {
        var result = []
        if (iSprintList != null && iSprintList.length > 0) {
          for (var i=0; i<iSprintList.length; i++) {
            var timeGroup = iSprintList[i].sprintTimeGroup
            var index = this.getIndexOfValueInArr(result, 'Label', timeGroup)
            if (index == -1) {
              result.push({
                Label: timeGroup,
                Options: [iSprintList[i]]
              })
            } else {
              result[index].Options.push(iSprintList[i])
            }
          }
        }
        return result
      },
      getIndexOfValueInArr(iArray, iKey, iValue) {
        for(var i=0; i<iArray.length;i++) {
          var item = iArray[i];
          if(iKey != null){
            if(item[iKey] == iValue){
              return i;
            }
          } 
          if(iKey == null){
            if(item == iValue){
              return i;
            }
          }
        }
        return -1;
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
      },     
      estimationChange(type,number){
        if(this.disabledState.disabledEstimation){
          return
        }
        if(0>=number){
          this.PMTTask.taskEstimation=2
          if(type == 'subtract'){
            this.PMTTask.taskEstimation=0
          }
        }else if(2==number){
          this.PMTTask.taskEstimation=6
          if(type == 'subtract'){
            this.PMTTask.taskEstimation=0
          }
        }else if(6>=number){
          this.PMTTask.taskEstimation=12
          if(type == 'subtract'){
            this.PMTTask.taskEstimation=2
          }
        }else if(12>=number){
          this.PMTTask.taskEstimation=20
          if(type == 'subtract'){
            this.PMTTask.taskEstimation=6
          }
        }else if(20>=number){
          this.PMTTask.taskEstimation=40
          if(type == 'subtract'){
            this.PMTTask.taskEstimation=12
          }
        }else if(40>=number){
          this.PMTTask.taskEstimation=40
          if(type == 'subtract'){
            this.PMTTask.taskEstimation=20
          }
          if(this.action.action == 'CREATE-NEW' || this.PMTTaskDialogTitle == 'Backlog Details'){
            this.PMTTask.taskEstimation = Number(this.PMTTask.taskEstimation) + 40
            if(type == 'subtract'){
              this.PMTTask.taskEstimation = Number(this.PMTTask.taskEstimation) - 40
            }
          }
        }else{
          if(this.action.action == 'CREATE-NEW' || this.PMTTaskDialogTitle == 'Backlog Details'){
            if(type == 'subtract'){
              this.PMTTask.taskEstimation = Number(this.PMTTask.taskEstimation) - 40
            }else{
              this.PMTTask.taskEstimation = Number(this.PMTTask.taskEstimation) + 40
            }
          }
        }
      },
      estimationIpt(val){
        if(isNaN(Number(val))){
            this.PMTTask.taskEstimation=0
        }
        if(val > 40){
          if(this.action.action == 'CREATE-NEW' || this.PMTTaskDialogTitle == 'Backlog Details') return
          this.PMTTask.taskEstimation = 40
        }
        if(val < 0){
            this.PMTTask.taskEstimation=0
        }
      }
    },
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
  height: 400px;
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
.input-number-div{
  display: flex;
  width: 100%;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  overflow: hidden;
  box-sizing: border-box;
}
.input-number-div .div-span{
  background-color: #F5F7FA;
  color: #909399;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  border-left: 1px solid #DCDFE6;
  padding: 0 20px;
  white-space: nowrap;
}
.input-number-div .el-input{
  flex: 1;
}
.input-number-div .el-input .el-input__inner{
  border: none;
  text-align: left;
}
.input-number-div .input-number-btn{
    position: relative;
    z-index: 1;
    width: 40px;
    height: auto;
    line-height: 20px;
    text-align: center;
    background: #F5F7FA;
    color: #606266;
    cursor: pointer;
    border-left: 1px solid #DCDFE6;

}

.input-number-div .input-number-btn span{
  position: absolute;
  width: 40px;
  line-height: 20px;
}
.input-number-div .input-number-btn span:active{
  color: #409EFF;
}
.input-number-div .input-number-btn .add{
  top: 0px;
  right: 0px;
  border-bottom: 1px solid #DCDFE6;
}
.input-number-div .input-number-btn .subtract{
  bottom: 0px;
  right: 0px;
}
</style>