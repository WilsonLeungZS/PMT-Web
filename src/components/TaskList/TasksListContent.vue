<!-- 
Module: TasksListContent
Description: Task Path + Task data table list
Remark:
-->
<template>
  <el-card class="tl-content" shadow="never">
    <!-- Task List Header -->
    <div v-if="showTaskPath" slot="header" class="clearfix tl-content-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(taskPath, index) in taskPathArray" :key="index" class="tl-content-header-task-path">
          <el-button @click="backToPreviousTask(index)" type="text">[{{taskPath.taskShortName}}] {{taskPath.taskFullName}}</el-button>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="showSelectTimeGroup">
          <el-select v-model="selectTimeGroup" multiple filterable default-first-option size="mini">
            <el-option label=" " value="0"></el-option>
          </el-select> 
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- Task List Table -->
    <div class="tl-content-body">
      <el-card v-for="(taskslist, index) in taskslistArray" :key="index" class="box-card" shadow="hover">
        <div v-if="taskslist.parentTaskShow" slot="header" class="clearfix">
          <el-row>
            <el-col :xs="18" :sm="20" :lg="22" class="tl-content-body-header justify-content-center">
              <span>{{taskslist.parentTask.taskDescription}}</span>
              <el-divider direction="vertical"></el-divider>
              <span class="tl-content-body-header-info">
                Estimation: <span class="tl-content-body-header-info-text">{{taskslist.parentTask.taskEstimation}}</span>
                <el-divider direction="vertical"></el-divider>
                Actual Est: <span class="tl-content-body-header-info-text">{{taskslist.parentTask.taskEstimation}}</span>
                <el-divider direction="vertical"></el-divider>
                Effort: <span class="tl-content-body-header-info-text">{{taskslist.parentTask.taskEffort}}</span>
              </span>
              <el-divider direction="vertical"></el-divider>
              <span><i class="el-icon-s-custom"></i> {{taskslist.parentTask.taskLeadingBy}} (Leader)</span>
            </el-col>
            <el-col :xs="6" :sm="4" :lg="2" class="tl-content-body-header justify-content-flex-end">
              <el-button-group style="margin-right: 5px">
                <el-button type="success" size="mini" icon="el-icon-plus"></el-button>
                <el-button type="info" size="mini" icon="el-icon-refresh"></el-button>
              </el-button-group>
            </el-col>
          </el-row>
        </div>
        <div>
          <!-- Task List -->
          <el-row>
            <el-col :span="24">
              <el-table @row-click="goToNextTask" :data="taskslist.taskslistData" empty-text="No Data" size="medium" :row-style="showPointer" :row-class-name="hideSubTaskExpand" class="tl-content-body-table" :header-cell-style="{'background-color': headerColor, color:'white'}">
                <el-table-column v-if="false" prop="taskId" label="Id"></el-table-column>
                <!-- Level 4 sub task list-->
                <el-table-column v-if="showState.showTaskExpand" type="expand" fixed="left">
                  <template slot-scope="props">
                    <el-row>
                      <el-col :span="23" :offset="1">
                        <el-table :data="props.row.subtaskslistData" :show-header="false" size="small" style="width: 100%;">
                          <el-table-column v-if="false" prop="subtaskId" label="Id"></el-table-column>
                          <el-table-column width="150px" align="left" prop="subtaskName" label="Name" show-overflow-tooltip key="1">
                            <template slot-scope="scope">
                              <el-button @click.stop="clickEditTask(scope.row.subtaskId, null, scope.row.subtaskLevel)" type="text">{{scope.row.subtaskName}}</el-button>
                            </template>
                          </el-table-column>
                          <el-table-column min-width="200px" align="left" prop="subtaskDescription" label="Description" show-overflow-tooltip key="2"></el-table-column>
                          <el-table-column width="100px" align="center" prop="subtaskStatus" label="Status" show-overflow-tooltip key="3">
                            <template slot-scope="scope">
                              <el-tag effect="dark" type="warning" size="mini" v-if="scope.row.subtaskStatus == 'Drafting'">{{scope.row.subtaskStatus}}</el-tag>
                              <el-tag effect="dark" type="primary" size="mini" v-if="scope.row.subtaskStatus == 'Planning'">{{scope.row.subtaskStatus}}</el-tag>
                              <el-tag effect="dark" type="success" size="mini" v-if="scope.row.subtaskStatus == 'Running'" >{{scope.row.subtaskStatus}}</el-tag>
                              <el-tag effect="dark" type="info"    size="mini" v-if="scope.row.subtaskStatus == 'Done'"    >{{scope.row.subtaskStatus}}</el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column width="100px" align="center" prop="subtaskEffort" label="Effort" show-overflow-tooltip key="4"></el-table-column>
                          <el-table-column width="50px"  align="center" prop="subtaskEst" label="Est" show-overflow-tooltip key="5"></el-table-column>
                          <el-table-column width="110px" align="center" prop="subtaskAssignee" label="Assignee" show-overflow-tooltip key="6"></el-table-column>
                          <el-table-column width="110px" align="center" fixed="right">
                            <template slot-scope="scope">
                              <el-button-group>
                                <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
                              </el-button-group>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <!-- End level 4 sub task list-->
                <el-table-column v-if="showState.showTaskParent" width="110px" align="left" prop="taskParent" label="Parent Id" show-overflow-tooltip key="1">
                  <template slot-scope="scope">
                    <el-button @click.stop="clickEditTask(null, scope.row.taskParent, Number(scope.row.taskLevel)-1)" type="text">{{scope.row.taskParent}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column v-if="showState.showTaskName" width="150px" align="left" prop="taskName" label="Name" show-overflow-tooltip key="2">
                  <template slot-scope="scope">
                    <el-button @click.stop="clickEditTask(scope.row.taskId, null, scope.row.taskLevel)" type="text">{{scope.row.taskName}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column v-if="showState.showTaskOppName" min-width="200px" align="left" prop="taskOppName" label="Opportunity Name" show-overflow-tooltip key="3"></el-table-column>
                <el-table-column v-if="showState.showTaskTargetStart" width="120px" align="center" prop="taskTargetStart" label="Target Start" show-overflow-tooltip key="4"></el-table-column>
                <el-table-column v-if="showState.showTaskCustomer" width="120px"  align="center" prop="taskCustomer" label="Customer" show-overflow-tooltip key="5"></el-table-column>
                <el-table-column v-if="showState.showTaskTypeOfWork" width="220px" align="center" prop="taskTypeOfWork" label="Type Of Work" show-overflow-tooltip key="6"></el-table-column>
                <el-table-column v-if="showState.showTaskTeamSizing" width="150px" align="center" prop="taskTeamSizing" label="TeamSizing" show-overflow-tooltip key="7"></el-table-column>
                <el-table-column v-if="showState.showTaskDescription" min-width="200px" align="left" prop="taskDescription" label="Description" show-overflow-tooltip key="8"></el-table-column>
                <el-table-column v-if="showState.showTaskScope" width="230px" align="center" prop="taskScope" label="Scope(Baseline)" show-overflow-tooltip key="9"></el-table-column>
                <el-table-column v-if="showState.showTaskTimeGroup" width="130px" align="center" prop="taskTimeGroup" label="Time Group" show-overflow-tooltip key="10">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.taskTimeGroup" size="mini" style="width: 100%">
                      <el-option label="" value=""></el-option>
                      <el-option label="Dec 15 ~ 31" value="1"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column v-if="showState.showTaskRefTask" width="100px" align="center" prop="taskRefTask" label="Ref Task" show-overflow-tooltip key="11">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini">{{scope.row.taskRefTask}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column v-if="showState.showTaskStatus" width="100px" align="center" prop="taskStatus" label="Status" show-overflow-tooltip key="12">
                   <template slot-scope="scope">
                    <el-tag effect="dark" type="warning" size="mini" v-if="scope.row.taskStatus == 'Drafting'">{{scope.row.taskStatus}}</el-tag>
                    <el-tag effect="dark" type="primary" size="mini" v-if="scope.row.taskStatus == 'Planning'">{{scope.row.taskStatus}}</el-tag>
                    <el-tag effect="dark" type="success" size="mini" v-if="scope.row.taskStatus == 'Running'" >{{scope.row.taskStatus}}</el-tag>
                    <el-tag effect="dark" type="info"    size="mini" v-if="scope.row.taskStatus == 'Done'"    >{{scope.row.taskStatus}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column v-if="showState.showTaskEffort" width="100px"  align="center" prop="taskEffort" label="Effort" show-overflow-tooltip key="13"></el-table-column>
                <el-table-column v-if="showState.showTaskEstimation" width="100px" align="center" prop="taskEstimation" label="Estimation" show-overflow-tooltip key="14"></el-table-column>
                <el-table-column v-if="showState.showTaskEst" width="50px"  align="center" prop="taskEst" label="Est" show-overflow-tooltip key="15"></el-table-column>
                <el-table-column v-if="showState.showTaskLeadingBy" width="150px" align="center" prop="taskLeadingBy" label="Leading By" show-overflow-tooltip key="16"></el-table-column>
                <el-table-column v-if="showState.showTaskAssignee" width="110px" align="center" prop="taskAssignee" label="Assignee" show-overflow-tooltip key="17"></el-table-column>
                <el-table-column v-if="showState.showTaskSkills" width="180px" align="center" prop="taskSkills" label="Related Skills" show-overflow-tooltip key="18"></el-table-column>
                <el-table-column width="110px" align="right" fixed="right">
                  <template slot-scope="scope">
                    <el-button-group>
                      <el-button v-if="showState.showAddBtn" type="success" size="mini" icon="el-icon-plus"></el-button>
                      <el-button v-if="showState.showRemoveBtn" type="danger" size="mini" icon="el-icon-delete"></el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <!-- End Task List -->
          <!-- List Pagination -->
          <el-row>
            <el-col :span="24" class="tl-content-body-pagination">
              <el-pagination 
                :total="taskslist.listTotalSize" 
                :page-size="taskslist.listCurrentSize" 
                :current-page="taskslist.listCurrentPage"
                @size-change="changeTaskListSize" 
                @current-change="changeTaskListPage"
                :page-sizes="[20, 50, 100, 200]"
                layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </el-col>
          </el-row>
          <!-- End List Pagination -->
        </div>
      </el-card>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
  import http from '../../utils/http'
  import utils from '../../utils/utils'
  import lv1TestData from '../../../test/testdata/lv1TasksListTestData.json'
  import lv2TestData from '../../../test/testdata/lv2TasksListTestData.json'
  import lv3TestData from '../../../test/testdata/lv3TasksListTestData.json'
  import exTestData from '../../../test/testdata/externalTasksListTestData.json'
  export default {
    name: 'TasksListContent',
    data() {
      return {
        btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
        btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
        headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
        // Task Path Value
        showTaskPath: false,
        taskPathArray: [],
        taskPathLatestTask: null,
        selectTimeGroup: '',
        showSelectTimeGroup: false,
        //Task List Table Value
        showState: {
          showTaskExpand: true,
          showTaskParent: true,
          showTaskName: true,
          showTaskOppName: true,
          showTaskTargetStart: true,
          showTaskCustomer: true,
          showTaskTypeOfWork: true,
          showTaskTeamSizing: true,
          showTaskDescription: true,
          showTaskScope: true,
          showTaskTimeGroup: true,
          showTaskRefTask: true,
          showTaskStatus: true,
          showTaskEffort: true,
          showTaskEstimation: true,
          showTaskEst: true,
          showTaskLeadingBy: true,
          showTaskAssignee: true,
          showTaskSkills: true,
          showAddBtn: true,
          showRemoveBtn: true
        },
        taskslistArray: []
      }
    },
    props: {
      'filter': String
    },
    watch: {
      taskPathArray: {
        handler (taskPathArray, oldTaskPathArray) {
          if (taskPathArray.length > 0) {
            this.$data.showTaskPath = true
            // Get latestTask as parent task to get sub tasks list
            var latestTask = taskPathArray[taskPathArray.length - 1]
            var nextTaskListParent = latestTask.taskShortName
            var nextTaskListLevel = Number(latestTask.taskLevel) + 1 + ''
            this.$data.taskPathLatestTask = nextTaskListParent
            var taskFilter = {
              taskLevel: nextTaskListLevel
            }
            this.getTaskListData(nextTaskListParent, taskFilter, 1, 20)
          } else {
            // When taskPathArray has no task, return level 1 task list
            this.$data.showTaskPath = false
            this.$data.taskPathLatestTask = null
            var taskFilter = {
              taskLevel: '1'
            }
            this.getTaskListData(null, taskFilter, 1, 20)
          }
        },
        immediate: true,
        deep: true
      },
      filter: {
        handler (val, oldVal) {
          // console.log('New Filter ',val, 'Old Filter',oldVal)
          if(val == '' || val == null || val == undefined) {
            return
          }
          var taskFilter = JSON.parse(val)
          var taskParent = this.$data.taskPathLatestTask
          this.getTaskListData(taskParent, taskFilter, 1, 20)
        },
        immediate: true
      } 
    },
    mounted() {
      console.log('Object ->', this.filter)
    },
    created () {
    },
    methods: {
      // Style method
      hideSubTaskExpand ({row, rowIndex}) {
        if(row != null && row.subtaskslistData != null && row.subtaskslistData.length === 0){
          return 'row-expand-cover'    
        }
      },
      showPointer ({row, rowIndex}) {
        if(row != null && (row.taskLevel == 1 || row.taskLevel == 2)){
          let pointerObj = {
            cursor: 'pointer'
          }
          return pointerObj     
        }
      },
      // Functional Methods
      // --------> Task List <----------
      getTaskListShowState (iFilterLevel) {
        for(let key in this.$data.showState) {
          this.$data.showState[key] = false
        }
        var returnShowState = {}
        if (iFilterLevel == '1') {
          returnShowState = {
            showTaskExpand: false,
            showTaskParent: false,
            showTaskName: true,
            showTaskOppName: true,
            showTaskTargetStart: true,
            showTaskCustomer: true,
            showTaskTypeOfWork: true,
            showTaskTeamSizing: true,
            showTaskDescription: false,
            showTaskScope: false,
            showTaskTimeGroup: false,
            showTaskRefTask: false,
            showTaskStatus: false,
            showTaskEffort: false,
            showTaskEstimation: false,
            showTaskEst: false,
            showTaskLeadingBy: true,
            showTaskAssignee: false,
            showTaskSkills: false,
            showAddBtn: false,
            showRemoveBtn: true
          }
        }
        if (iFilterLevel == '2') {
          returnShowState = {
            showTaskExpand: false,
            showTaskParent: true,
            showTaskName: true,
            showTaskOppName: false,
            showTaskTargetStart: false,
            showTaskCustomer: false,
            showTaskTypeOfWork: false,
            showTaskTeamSizing: false,
            showTaskDescription: true,
            showTaskScope: true,
            showTaskTimeGroup: false,
            showTaskRefTask: false,
            showTaskStatus: false,
            showTaskEffort: true,
            showTaskEstimation: true,
            showTaskEst: false,
            showTaskLeadingBy: true,
            showTaskAssignee: false,
            showTaskSkills: true,
            showAddBtn: true,
            showRemoveBtn: true
          }
        }
        if (iFilterLevel == '3') {
          returnShowState = {
            showTaskExpand: true,
            showTaskParent: false,
            showTaskName: true,
            showTaskOppName: false,
            showTaskTargetStart: false,
            showTaskCustomer: false,
            showTaskTypeOfWork: false,
            showTaskTeamSizing: false,
            showTaskDescription: true,
            showTaskScope: false,
            showTaskTimeGroup: true,
            showTaskRefTask: true,
            showTaskStatus: true,
            showTaskEffort: true,
            showTaskEstimation: false,
            showTaskEst: true,
            showTaskLeadingBy: false,
            showTaskAssignee: true,
            showTaskSkills: false,
            showAddBtn: true,
            showRemoveBtn: true
          }
        }
        if (iFilterLevel == 'EX') {
          returnShowState = {
            showTaskExpand: false,
            showTaskParent: false,
            showTaskName: true,
            showTaskOppName: false,
            showTaskTargetStart: false,
            showTaskCustomer: false,
            showTaskTypeOfWork: false,
            showTaskTeamSizing: false,
            showTaskDescription: true,
            showTaskScope: false,
            showTaskTimeGroup: false,
            showTaskRefTask: false,
            showTaskStatus: true,
            showTaskEffort: false,
            showTaskEstimation: false,
            showTaskEst: false,
            showTaskLeadingBy: false,
            showTaskAssignee: false,
            showTaskSkills: false,
            showAddBtn: false,
            showRemoveBtn: false
          }
        }
        return returnShowState
      },
      goToNextTask (row, column, event) {
        var nextTaskLevel = row.taskLevel
        var nextTaskId = row.taskId
        // Post request to get task
        var nextTaskName = row.taskName
        var nextTaskDescription = row.taskDescription
        // 1. Click Level 1 task, update task path: level 1
        if (nextTaskLevel == 1) {
          // HTTP request: post taskId to get the task 
          // nextTaskPath = return task 
          var nextTaskPath = {
            taskId: 1, 
            taskShortName: 'MTL19.1', 
            taskFullName: 'MTL - IO Guangzhou Services (System, Wintel, Network, DBA) - {2019-Jun to 2023-Dec}', 
            taskLevel: 1
          }
          this.$data.taskPathArray = []
          this.$data.taskPathArray.push(nextTaskPath)
          this.$data.showSelectTimeGroup = false
        }
        // 2. Click Level 2 task
        else if (nextTaskLevel == 2) {
          if (this.$data.taskPathArray != null && this.$data.taskPathArray.length == 1) {
            // 2-1. Click Level 2 task, and current has Level 1 task, update task path as: level 1 > level 2(get)
            var nextTaskPath = {
              taskId: 15, 
              taskShortName: 'MTL19.1-1', 
              taskFullName: 'MTL Infra Support - Problem Management', 
              taskLevel: 2
            }
            this.$data.taskPathArray.push(nextTaskPath)
          } else {
            // 2-2. Click Level 2 task, and current has no Level 1 task, update task path as: level 1(get) > level 2(get)
            this.$data.taskPathArray = []
            var nextTaskPathLv1 = {
              taskId: 1, 
              taskShortName: 'MTL19.1', 
              taskFullName: 'MTL - IO Guangzhou Services (System, Wintel, Network, DBA) - {2019-Jun to 2023-Dec}', 
              taskLevel: 1
            }
            this.$data.taskPathArray.push(nextTaskPathLv1)
            var nextTaskPathLv2 = {
              taskId: 15, 
              taskShortName: 'MTL19.1-1', 
              taskFullName: 'MTL Infra Support - Problem Management', 
              taskLevel: 2
            }
            this.$data.taskPathArray.push(nextTaskPathLv2)
          }
          this.$data.showSelectTimeGroup = true
        }
        // 3. Click other level(level 3 or external) task
        else {
          return
        }
      },
      backToPreviousTask (index) {
        console.log(index)
        this.$data.taskPathArray.splice(index, this.$data.taskPathArray.length - index)
        if (this.$data.taskPathArray.length == 0) {
          this.$data.showTaskPath = false
        }
      },
      // --------> Task List Pagination <----------
      changeTaskListSize (val) {
        console.log(`Each page ${val} records`);
      },
      changeTaskListPage (val) {
        console.log(`Current Page: ${val}`);
      },
      // --------> Return task list <----------
      getTaskListData (iTaskParent, iTaskFilter, iPage, iSize) {
        console.log('Start to get task list data: ', iTaskParent, iTaskFilter, iPage, iSize)
        // Clear list data
        this.$data.taskslistArray = []
        // Get data by filter for page and size
        var filterTaskLevel = iTaskFilter.taskLevel
        this.$data.showState = this.getTaskListShowState(filterTaskLevel)
        if (filterTaskLevel == '1') {
          this.$data.taskslistArray = lv1TestData
        }
        if (filterTaskLevel == '2') {
          this.$data.taskslistArray = lv2TestData
        }
        if (filterTaskLevel == '3') {
          this.$data.taskslistArray = lv3TestData
        }
        if (filterTaskLevel == 'EX') {
          this.$data.taskslistArray = exTestData
        }
      },
      clickEditTask (iTaskId, iTaskName, iTaskLevel) {
        var taskId = iTaskId
        var taskName = iTaskName
        var taskLevel = iTaskLevel + ''
        this.$emit('editTask', taskId, taskName, taskLevel)
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
/* -- End Common Style -- */
.el-card {
  border: 1px solid #ffffff;
}
.tl-content-body .el-card {
  border: 1px solid #C0C4CC;
  margin-top: 10px;
}
.tl-content {
  height: auto;
  width: 100%;
}
.tl-content-header {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tl-content-header-task-path {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tl-content-header-task-path .el-button{
  font-size: 16px;
  padding: 0;
}
.tl-content-body-header {
  display: flex; 
  align-items: center;
}
.tl-content-body-header-info {
  border: 1px solid #bdbdbd; 
  border-radius: 4px; 
  padding: 3px 15px;
}
.tl-content-body-header-info-text {
  text-decoration: underline;
  font-weight: bold;
}
.tl-content-body-pagination {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>

<style>
.tl-content .el-card__header {
  padding: 12px;
  border-bottom: 1px solid #DCDFE6;
}
.tl-content-body .el-card__header {
  padding: 10px;
  border-bottom: 1px solid #EBEEF5;
}
.tl-content .el-card__body {
  padding: 5px;
}
.tl-content-header .el-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tl-content-header-task-path .el-breadcrumb__separator {
  font-size: 14px;
  color: #000000;
}
.tl-content-body .el-table th {
  padding: 8px 0;
}
.tl-content-body .el-table td {
  padding: 10px 0;
}
.tl-content-body .el-button {
  padding-top: 5px;
  padding-bottom: 5px;
}
.row-expand-cover .el-table__expand-icon {
  visibility: hidden;
}
</style>