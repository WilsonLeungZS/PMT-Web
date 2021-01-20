<template>
  <div class="sv-body">
    <el-container>
      <el-main>
        <!-- Header -->
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-data-line content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
          </el-col>
        </el-row>
        <!-- Content -->
        <el-row class="sv-content">
          <el-col :span="planListLength" :lg="planListLengthlg">
            <el-tabs @tab-click="changeTab" v-model="tabActive" :tab-position="tabPosition" class="sv-content-plan-list">
              <el-tab-pane name="tab_people_resource">
                <span slot="label"><i class="el-icon-user-solid"></i> People Res</span>
                <people-plan-list></people-plan-list>
              </el-tab-pane>
              <el-tab-pane name="tab_task_backlog">
                <span slot="label"><i class="el-icon-s-order"></i> Task List</span>
                <task-plan-list @createRefTask="createRefTask" @editTask="editTask"></task-plan-list>
              </el-tab-pane>
              <el-tab-pane name="tab_hide">
                <span slot="label" style="color: #bdbdbd"><i class="el-icon-arrow-left"></i> Hide</span>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="sprintLength" :lg="sprintLengthlg" class="sv-content-sprint-card">
            <el-card class="box-card">
              <!-- Card Header -->
              <div slot="header" class="clearfix sprint-card-header">
                 <!-- Sprint Info -->
                <el-divider content-position="left">Sprint (Range: <b>{{sprintStartTime}} ~ {{sprintEndTime}}</b> / Working days: <b>{{sprintWorkingDays}}</b>)</el-divider>
                <el-row>
                  <el-col :span="16" :lg="14" class="sprint-card-header-col">
                    <span><i class="el-icon-data-line"></i> Sprint</span>
                    <el-select v-model="sprintSelect" size="small" style="width: 72%;">
                      <el-option v-for="(sprint, index) in sprintsList" :key="index" :label="sprint.sprintName" :value="sprint.sprintId">
                        <span style="float: left; margin-right:20px">{{sprint.sprintName}}</span>
                        <span style="float: right; color: #8492a6; font-size: 12px">{{sprint.sprintLeader}}</span>
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="8" :lg="8" class="sprint-card-header-col">
                    <span><i class="el-icon-s-flag"></i> Leader: <b>{{sprintLeader}}</b></span>
                  </el-col>
                  <el-col :span="4" :lg="2" class="sprint-card-header-col">
                    <el-tag v-if="sprintStatus == 'Active'? true: false" type="primary" style="width: 100%; text-align: center"><b>{{sprintStatus}}</b></el-tag>
                    <el-tag v-if="sprintStatus == 'Running'? true: false" type="success" style="width: 100%; text-align: center"><b>{{sprintStatus}}</b></el-tag>
                  </el-col>
                  <el-col :span="20" :lg="24" class="sprint-card-header-col">
                    <el-scrollbar style="height: 100%">
                      <span><i class="el-icon-collection"></i> Baseline: <span style="width: 100%; border-bottom: 2px solid #bdbdbd">{{sprintBaseline}}</span></span>
                    </el-scrollbar>
                  </el-col>
                </el-row>
                <!-- Sprint KPI -->
                <el-row>
                  <el-col :span="12" :lg="6" class="sprint-card-header-col sprint-card-header-col-center" style="border-radius: 4px 0 0 4px; border-right: none">
                    <span>Effort: <b>{{sprintEffort}}</b> mhrs</span>
                  </el-col>
                  <el-col :span="12" :lg="7" class="sprint-card-header-col sprint-card-header-col-center">
                    <span>Estimation: <b>{{sprintEstimation}}</b> mhrs</span>
                  </el-col>
                  <el-col :span="20" :lg="8" class="sprint-card-header-col sprint-card-header-col-center">
                    <span>Capacity: <b>{{sprintActualCapacity}} / {{sprintBaseCapacity}}</b> mhrs</span>
                  </el-col>
                  <el-col :span="4" :lg="3" class="sprint-card-header-col sprint-card-header-col-center" style="border-radius: 0 4px 4px 0; border-left: none">
                    <el-badge :value="sprintPeopleCount" :max="99" class="item">
                      <el-button @click="showPlannedPeopleRes" size="small" type="info" icon="el-icon-user-solid"></el-button>
                    </el-badge>
                  </el-col>
                </el-row>
              </div>
              <!-- Card Content -->
              <div class="sprint-card-content">
                <el-card v-for="(sprintTask, index) in sprintTasksList" :key="index" class="box-card" style="margin-bottom: 2px;">
                  <el-collapse>
                    <el-collapse-item :disabled="!sprintTask.sprintTaskHasSubtask" :class="{'sprint-card-content-task-hide-icon': !sprintTask.sprintTaskHasSubtask}">
                      <!-- Sprint Task Header -->
                      <template slot="title">
                        <el-row class="sprint-card-content-task" align="middle">
                          <el-col :span="5" :lg="3">
                            <el-button @click.stop="editTask(sprintTask.sprintTaskId, sprintTask.sprintTaskCategory)" type="text">{{sprintTask.sprintTaskName}}</el-button>
                          </el-col>
                          <el-col :span="19" :lg="11">
                            <span>{{sprintTask.sprintTaskTitle}}</span>
                          </el-col>
                          <el-col :span="5" :lg="2">
                            <el-tag effect="dark" type="warning" size="mini" v-if="sprintTask.sprintTaskStatus == 'Drafting'">{{sprintTask.sprintTaskStatus}}</el-tag>
                            <el-tag effect="dark" type="primary" size="mini" v-if="sprintTask.sprintTaskStatus == 'Planning'">{{sprintTask.sprintTaskStatus}}</el-tag>
                            <el-tag effect="dark" type="success" size="mini" v-if="sprintTask.sprintTaskStatus == 'Running'" >{{sprintTask.sprintTaskStatus}}</el-tag>
                            <el-tag effect="dark" type="info"    size="mini" v-if="sprintTask.sprintTaskStatus == 'Done'"    >{{sprintTask.sprintTaskStatus}}</el-tag>
                          </el-col>
                          <el-col :span="15" :lg="6">
                            <span class="sprint-card-content-task-info">
                              <span>{{sprintTask.sprintTaskEffort}}</span>
                              <el-divider direction="vertical"></el-divider>
                              <span>{{sprintTask.sprintTaskEstimation}}</span>
                              <el-divider direction="vertical"></el-divider>
                              <span v-if="!planListHide">{{sprintTask.sprintTaskAssignee}}</span>
                              <el-select v-if="planListHide" v-model="sprintTask.sprintTaskAssigneeId" placeholder="Select Assignee..." size="mini" style="width: 75%;">
                                <el-option label="" value=""></el-option>
                                <el-option v-for="(assignee, index) in assigneeList" :key="index" :label="assignee.userNickname" :value="assignee.userId"></el-option>
                              </el-select>
                            </span>
                          </el-col>
                          <el-col :span="4" :lg="2" class="sprint-card-content-task-btn" style="justify-content: flex-end;">
                            <el-button @click="createSubTask(sprintTask)" size="mini" type="success" icon="el-icon-plus"></el-button>
                            <el-button size="mini" type="danger" icon="el-icon-delete" style="margin-left: 3px;"></el-button>
                          </el-col>
                        </el-row>
                      </template>
                      <!-- Sprint Task Sub Task List -->
                      <div class="sprint-card-content-sub-task">
                        <el-divider content-position="left">Sub-Tasks List</el-divider>
                        <el-table :data="sprintTask.sprintTaskSubtasksList" max-height="300px" size="mini" style="width: 100%;">
                          <el-table-column v-if="false" prop="sprintSubtaskId" label="Id"></el-table-column>
                          <el-table-column width="150px" align="left" prop="sprintSubtaskName" label="Name" show-overflow-tooltip key="1">
                            <template slot-scope="scope">
                              <el-button @click.stop="editTask(scope.row.sprintSubtaskId, scope.row.sprintSubtaskCategory)" type="text">{{scope.row.sprintSubtaskName}}</el-button>
                            </template>
                          </el-table-column>
                          <el-table-column min-width="200px" align="left" prop="sprintSubtaskTitle" label="Title" show-overflow-tooltip key="2"></el-table-column>
                          <el-table-column width="80px" align="center" prop="sprintSubtaskStatus" label="Status" show-overflow-tooltip key="3">
                            <template slot-scope="scope">
                              <el-tag effect="dark" type="warning" size="mini" v-if="scope.row.sprintSubtaskStatus == 'Drafting'">{{scope.row.sprintSubtaskStatus}}</el-tag>
                              <el-tag effect="dark" type="primary" size="mini" v-if="scope.row.sprintSubtaskStatus == 'Planning'">{{scope.row.sprintSubtaskStatus}}</el-tag>
                              <el-tag effect="dark" type="success" size="mini" v-if="scope.row.sprintSubtaskStatus == 'Running'" >{{scope.row.sprintSubtaskStatus}}</el-tag>
                              <el-tag effect="dark" type="info"    size="mini" v-if="scope.row.sprintSubtaskStatus == 'Done'"    >{{scope.row.sprintSubtaskStatus}}</el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column width="60px" align="center" prop="sprintSubtaskEffort" label="Effort" show-overflow-tooltip key="4"></el-table-column>
                          <el-table-column width="60px"  align="center" prop="sprintSubtaskEstimation" label="Est" show-overflow-tooltip key="5"></el-table-column>
                          <el-table-column v-if="!planListHide" width="80px" align="center" prop="sprintSubtaskAssignee" label="Assignee" show-overflow-tooltip key="6"></el-table-column>
                          <el-table-column v-if="planListHide" width="180px" align="center" prop="sprintSubtaskAssignee" label="Assignee" show-overflow-tooltip key="6">
                            <template slot-scope="scope">
                              <el-select v-if="planListHide" v-model="scope.row.sprintSubtaskAssigneeId" placeholder="Select Assignee..." size="mini" style="width: 100%;">
                                <el-option label="" value=""></el-option>
                                <el-option v-for="(assignee, index) in assigneeList" :key="index" :label="assignee.userNickname" :value="assignee.userId"></el-option>
                              </el-select>
                            </template>
                          </el-table-column>
                          <el-table-column width="70px" align="right" fixed="right" class="sprint-card-content-task-btn">>
                            <template slot-scope="scope">
                              <el-button-group>
                                <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
                              </el-button-group>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                      <!-- End Sprint Task Sub Task List -->
                    </el-collapse-item>
                  </el-collapse>
                </el-card>
              </div>
               <!-- End Card Content -->
            </el-card>
          </el-col>
        </el-row>
      </el-main>
      <el-drawer title="Sprint Planned People Resources" size="30%" :direction="direction" :visible.sync="peopleResVisible" class="sprint-plan-people-res-drawer">
        <el-row>
          <el-col :offset="2" :span="20">
            <el-button icon="el-icon-check" type="primary" size="small" style="width: 100%; margin-bottom: 15px">Save Adjustment</el-button>
          </el-col>
          <el-col :span="24">
            <el-table :data="plannedPeopleList" :summary-method="getSummaries" show-summary width="100%">
              <el-table-column prop="userName" label="Name" align="center"></el-table-column>
              <el-table-column prop="userPlannedCapacity" label="Planned Capacity" align="center" width="180">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.userPlannedCapacity" :step="scope.row.userWorkingHrs" step-strictly :min="0" :max="scope.row.userMaxCapacity" controls-position="right" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column align="right" fixed="right" width="80">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="Remove from Sprint" placement="top">
                    <el-button type="danger" icon="el-icon-d-arrow-left" size="mini"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-drawer>
    </el-container>
    <pmt-task-dialog :action="pmtTaskDialogAction"></pmt-task-dialog>
    <external-task-dialog :action="externalTaskDialogAction"></external-task-dialog>
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
import PeoplePlanList from './SprintPlugins/PeoplePlanList'
import TaskPlanList from './SprintPlugins/TaskPlanList'
import PmtTaskDialog from '../TaskDialog/PMTTaskDialog'
import ExternalTaskDialog from '../TaskDialog/ExternalTaskDialog'
export default {
  name: 'SprintView',
  components: {
    PeoplePlanList,
    TaskPlanList,
    PmtTaskDialog,
    ExternalTaskDialog
  },
  data () {
    return {
      header1: 'Sprint View',
      isActive: true,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
      tabPosition: 'left',
      tabActive: 'tab_people_resource',
      // Value to validate if the plan list hide and item length
      planListHide: false,
      planListLength: 11,
      planListLengthlg: 11,
      // Sprint Value
      sprintsList: [
        {sprintId: 1, sprintName: 'TOS 2021 JAN 1~15', sprintLeader: 'Leo.Li'},
        {sprintId: 2, sprintName: 'BSS 2021 JAN 1~15', sprintLeader: 'Charline.Feng'}
      ],
      sprintSelect: '',
      sprintStartTime: '2021-01-01',
      sprintEndTime: '2021-01-15',
      sprintLeader: 'Charline.Feng',
      sprintWorkingDays: 10,
      sprintPeopleCount: 101,
      sprintBaseline: '<=62 Inc/month; Resolve <=4 hrs;<=62 Inc/month; ',
      sprintEffort: 200,
      sprintEstimation: 200,
      sprintBaseCapacity: 500,
      sprintActualCapacity: 200,
      sprintStatus: 'Active',
      // Sprint Task Value
      sprintTasksList: [
        {sprintTaskId: 1, sprintTaskCategory: 'PMT', sprintTaskName: 'CGM210001-12', sprintTaskTitle: 'It is not required Document Reference when rectify OB', sprintTaskStatus: 'Drafting', sprintTaskEffort: 12, sprintTaskEstimation: 32, sprintTaskAssignee: 'Wilson.Liang', sprintTaskAssigneeId: 1, sprintTaskHasSubtask: false, sprintTaskSubtasksList: []},
        {sprintTaskId: 1, sprintTaskCategory: 'PMT', sprintTaskName: 'CGM210001-12', sprintTaskTitle: 'It is not required Document Reference when rectify OB', sprintTaskStatus: 'Drafting', sprintTaskEffort: 12, sprintTaskEstimation: 32, sprintTaskAssignee: 'Wilson.Liang', sprintTaskAssigneeId: 1, sprintTaskHasSubtask: false, sprintTaskSubtasksList: []},
        {sprintTaskId: 1, sprintTaskCategory: 'PMT', sprintTaskName: 'CGM210001-12', sprintTaskTitle: 'It is not required Document Reference when rectify OB', sprintTaskStatus: 'Drafting', sprintTaskEffort: 12, sprintTaskEstimation: 32, sprintTaskAssignee: 'Wilson.Liang', sprintTaskAssigneeId: 1, sprintTaskHasSubtask: false, sprintTaskSubtasksList: []},
        {sprintTaskId: 1, sprintTaskCategory: 'PMT', sprintTaskName: 'CGM210001-12', sprintTaskTitle: 'It is not required Document Reference when rectify OB', sprintTaskStatus: 'Drafting', sprintTaskEffort: 12, sprintTaskEstimation: 32, sprintTaskAssignee: 'Wilson.Liang', sprintTaskAssigneeId: 1, sprintTaskHasSubtask: true, sprintTaskSubtasksList: [
          {sprintSubtaskId: 1, sprintSubtaskCategory: 'PMT', sprintSubtaskName: 'CGM210001-12-1', sprintSubtaskTitle: 'SIT Testing of EDI', sprintSubtaskStatus: 'Running', sprintSubtaskEffort: 50, sprintSubtaskEstimation: 80, sprintSubtaskAssignee: 'Vicky.Zeng', sprintSubtaskAssigneeId: 2},
          {sprintSubtaskId: 1, sprintSubtaskCategory: 'PMT', sprintSubtaskName: 'CGM210001-12-1', sprintSubtaskTitle: 'SIT Testing of EDI', sprintSubtaskStatus: 'Running', sprintSubtaskEffort: 5, sprintSubtaskEstimation: 8, sprintSubtaskAssignee: 'Vicky.Zeng', sprintSubtaskAssigneeId: 2},
          {sprintSubtaskId: 1, sprintSubtaskCategory: 'PMT', sprintSubtaskName: 'CGM210001-12-1', sprintSubtaskTitle: 'SIT Testing of EDI', sprintSubtaskStatus: 'Running', sprintSubtaskEffort: 5, sprintSubtaskEstimation: 8, sprintSubtaskAssignee: 'Vicky.Zeng', sprintSubtaskAssigneeId: 2}
        ]}
      ],
      assigneeList: [
        {userId: 1, userNickname: 'Wilson.Liang', userLevel: 10},
        {userId: 2, userNickname: 'Leo.Li', userLevel: 8}
      ],
      // Sprint Planned Drawer Value
      direction: 'rtl',
      peopleResVisible: false,
      plannedPeopleList: [
        {userName: 'zhongshu.liang', userPlannedCapacity: 45, userWorkingHrs: 9, userMaxCapacity: 90},
        {userName: 'zhongshu.liang', userPlannedCapacity: 90, userWorkingHrs: 9, userMaxCapacity: 90},
        {userName: 'zhongshu.liang', userPlannedCapacity: 90, userWorkingHrs: 9, userMaxCapacity: 90},
        {userName: 'zhongshu.liang', userPlannedCapacity: 72, userWorkingHrs: 8, userMaxCapacity: 80},
        {userName: 'zhongshu.liang', userPlannedCapacity: 63, userWorkingHrs: 9, userMaxCapacity: 90}
      ],
      // Task Dialog handling value
      pmtTaskDialogAction: null,
      externalTaskDialogAction: null
    }
  },
  computed: {
    sprintLength: function () {
      return 24 - this.planListLength
    },
    sprintLengthlg: function () {
      return 24 - this.planListLengthlg
    }
  },
  watch: {
    planListHide: {
      handler (newVal, oldVal) {
        if(newVal) {
          // plan list hide
          this.$data.planListLengthlg = 2
          this.$data.planListLength = 3
        } else {
          // plan list show
          this.$data.planListLengthlg = 11
          this.$data.planListLength = 11
        }
      },
      immediate: true
    }
        
  },
  methods: {
    changeTab (tab, event) {
      if (tab.name == 'tab_hide') {
        this.$data.planListHide = true
      } else {
        this.$data.planListHide = false
      }
    },
    // Task Dialog Method
    createTask () {
      var date = new Date()
      console.log(date)
    },
    createRefTask (iRefTaskName, iRefTaskTitle) {
      console.log('Create Reference Task ', iRefTaskName, iRefTaskTitle)
    },
    createSubTask (iTask) {
      this.$data.pmtTaskDialogAction = {
        action: 'CREATE-SUB',
        taskParentTaskName: iTask.sprintTaskName,
        taskParentTaskTitle: iTask.sprintTaskTitle,
        //taskType: iTask.sprintTaskType
        //taskTypeTag: iTask.sprintTaskTypeTag
        //taskReferenceTask: iTask.sprintTaskReferenceTask
        taskType: 'Development',
        taskTypeTag: 'One-Off Task',
        taskReferenceTask: 'CGM210001',
        taskSprintId: this.$data.sprintSelect,
        taskLeader: this.$data.sprintLeader,
        datetime: new Date()
      }
    },
    editTask (iTaskId, iTaskCategory) {
      console.log('Edit Task ', iTaskId, iTaskCategory)
      if (iTaskCategory == 'PMT') {
        this.$data.pmtTaskDialogAction = {
          action: 'EDIT',
          taskId: iTaskId,
          datetime: new Date()
        }
      }
      if (iTaskCategory == 'EXTERNAL') {
        this.$data.externalTaskDialogAction = {
          action: 'EDIT',
          taskId: iTaskId,
          datetime: new Date()
        }
      }
      
    },
    // Sprint Drawer Method
    showPlannedPeopleRes () {
      this.$data.peopleResVisible = true
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Sum';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' mhrs';
        } else {
          sums[index] = '';
        }
      });
      return sums;
    }
  },
  created () {
  }
}
</script>

<style scoped>
/* Header Style */
.active {
  color: #ff6348;
  border-bottom: 1px solid #ff6348;
  cursor: default;
}
.sv-body {
  width: 100%;
  height: auto;
}
.el-main {
  color: #333;
  text-align: center;
  height: auto;
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
  margin-left: 5px;
  height:20px;
  width: auto;
  font-size: 20px;
}

/* Content Style */
.sv-content {
  border: 1px solid #DCDFE6;
  padding: 10px 0px;
  margin-top: 10px;
}
.sv-content-plan-list {
  width: 100%; 
  height: 100%; 
}
.sv-content-sprint-card {
  padding: 0px 5px;
}
.sv-content-sprint-card>>>.el-card__body {
 padding: 5px;
}
/* Header Style */
.sprint-card-header {
  text-align: left;
}
.sprint-card-header .el-divider--horizontal {
  margin: 10px 0px 15px 0px;
}
.sprint-card-header .el-divider--horizontal .el-divider__text{
  font-size: 15px;
}
.sprint-card-header span {
  margin-right: 10px;
}
.sprint-card-header-col {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 5px 0px;
  height: 40px;
  white-space: nowrap;
}
.sprint-card-header-col .el-tag {
  text-decoration: underline;
  font-size: 18px;
  padding: 0 7px;
  cursor: pointer;
}
.sprint-card-header-col .el-button {
  font-size: 18px;
  padding: 3px 8px;
}
.sprint-card-header-col .el-scrollbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.sprint-card-header-col .running-status-btn {
  margin-left: 10px;
}
.sprint-card-header-col-center {
  justify-content: center;
  border: 1px solid #bdbdbd;
}
/* Content Style */
.sprint-card-content {
  width: 100%;
  height: auto;
}
.sprint-card-content>>>.el-collapse {
  border: none;
}
.sprint-card-content>>>.el-collapse-item__header {
  height: auto;
  border: none;
}
.sprint-card-content-task {
  height: auto;
  width: 100%;
}
.sprint-card-content-task .el-col {
  height: 35px;
  padding: 0 3px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.sprint-card-content-task-info {
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  width: 100%;
  height: 30px;
  padding-left: 15px;
  margin-right: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.sprint-card-content-task-info>>>.el-input--mini .el-input__inner {
  height: 25px;
  line-height: 25px;
  border: none;
}
.sprint-card-content>>> .el-button--mini {
  font-size: 18px;
  padding: 2px 5px;
}
.sprint-card-content-sub-task .el-divider--horizontal {
  margin: 10px 0px;
}
.sprint-card-content>>>.el-table--mini td {
  padding: 2px 0;
}
.sprint-card-content>>> .el-table--mini th {
  padding: 2px 0;
}
.sprint-card-content-task-hide-icon>>>.el-collapse-item__arrow {
  visibility: hidden;
}

/* Drawer Style */
/deep/ :focus {
	outline: 0;
}
.sprint-plan-people-res-drawer>>>.el-drawer__header {
  font-size: 20px;
}
.sprint-plan-people-res-drawer>>>.el-table td {
  padding: 5px 0;
}
.sprint-plan-people-res-drawer>>>.el-table th {
  padding: 5px 0;
}
</style>
<style>
.sv-body .el-tabs--border-card>.el-tabs__content {
  padding: 0;
}
.sv-content .el-card__header {
  padding: 10px 10px;
  font-size: 18px;
  color: #616161;
  border-bottom: 1px solid #bdbdbd;
}
.sv-content .el-card {
  border: 1px solid #bdbdbd;
}
.sv-content .el-collapse-item.is-disabled .el-collapse-item__header {
  color: #303133;
  cursor: default;
}
</style>
