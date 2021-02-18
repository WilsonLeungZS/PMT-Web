<!-- 
Module: SprintView
Description: Provide sprint view
Remark:
1. Change el-col-lg min width from 1200px to 1540px in "..\node_modules\_element-ui@2.13.2@element-ui\lib\theme-chalk\index.css"
-->
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
                <span slot="label"><i class="el-icon-user-solid sv-content-tab-icon"></i> <span v-if="planListHide">People Res</span></span>
                <people-plan-list :sprint="sprintObj" @refreshSprint="refreshSprint"></people-plan-list>
              </el-tab-pane>
              <el-tab-pane name="tab_task_backlog">
                <span slot="label"><i class="el-icon-s-order sv-content-tab-icon"></i> <span v-if="planListHide">Tasks List</span></span>
                <task-plan-list :sprint="sprintObj" @createTask="createTask" @createRefTask="createRefTask" @editTask="editTask"></task-plan-list>
              </el-tab-pane>
              <el-tab-pane name="tab_hide">
                <span slot="label" style="color: #bdbdbd"><i class="el-icon-arrow-left sv-content-tab-icon"></i> <span v-if="planListHide">Hide</span></span>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="sprintLength" :lg="sprintLengthlg" class="sv-content-sprint-card">
            <!-- Show for not select sprint -->
            <el-card v-if="sprintSelect == ''? true: false" class="box-card">
              <div slot="header" class="clearfix sprint-card-header">
                <el-divider content-position="left">Sprint (Please select sprint first)</el-divider>
                <el-row>
                  <el-col :span="16" :lg="14" class="sprint-card-header-col">
                    <span><i class="el-icon-data-line"></i> Sprint</span>
                    <el-select @change="changeSprint" v-model="sprintSelect" size="small" style="width: 72%;">
                      <el-option label=" " value=""></el-option>
                      <el-option v-for="(sprint, index) in sprintsList" :key="index" :label="sprint.sprintName" :value="sprint.sprintId">
                        <span style="float: left; margin-right:20px">{{sprint.sprintName}}</span>
                        <span style="float: right; color: #8492a6; font-size: 12px">{{sprint.sprintLeader}}</span>
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </div>
              <el-row>
                <el-col :span="24" style="margin: 10px 0">
                  <b>No Task</b>
                </el-col>
              </el-row>
            </el-card>
            <!-- Show for selected sprint -->
            <el-card v-if="sprintSelect != ''? true: false" class="box-card">
              <!-- Card Header -->
              <div slot="header" class="clearfix sprint-card-header">
                 <!-- Sprint Info -->
                <el-divider content-position="left">Sprint (Range: <b>{{sprintStartTime}} ~ {{sprintEndTime}}</b> / Working days: <b>{{sprintWorkingDays}}</b>)</el-divider>
                <el-row>
                  <el-col :span="24" :lg="12" class="sprint-card-header-col">
                    <span><i class="el-icon-data-line"></i> Sprint</span>
                    <el-select @change="changeSprint" v-model="sprintSelect" size="small" style="width: 72%;">
                      <el-option label=" " value=""></el-option>
                      <el-option v-for="(sprint, index) in sprintsList" :key="index" :label="sprint.sprintName" :value="sprint.sprintId">
                        <span style="float: left; margin-right:20px">{{sprint.sprintName}}</span>
                        <span style="float: right; color: #8492a6; font-size: 12px">{{sprint.sprintLeader}}</span>
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12" :lg="7" class="sprint-card-header-col">
                    <span><i class="el-icon-guide"></i> Leader: <b>{{sprintLeader}}</b></span>
                  </el-col>
                  <el-col :span="12" :lg="5" class="sprint-card-header-col">
                    <span v-if="sprintStatus == 'Active'? true: false">
                      <i class="el-icon-table-lamp"></i> Status: <b style="color: #409EFF">{{sprintStatus}}</b>
                      <el-popconfirm @confirm="changeSprintStatus" title="Change Sprint status to 'Running'？" >
                        <el-button slot="reference" type="success" size="mini" icon="el-icon-d-arrow-right"></el-button>
                      </el-popconfirm>
                    </span>
                    <span v-if="sprintStatus == 'Running'? true: false"><i class="el-icon-table-lamp"></i> Status: <b style="color: #67C23A">{{sprintStatus}}</b></span>
                  </el-col>
                  <el-col :span="24" :lg="12" class="sprint-card-header-col">
                    <el-scrollbar style="height: 100%; margin-right: 20px">
                      <span><i class="el-icon-collection"></i> Baseline: <b>{{sprintBaseline}}</b></span>
                    </el-scrollbar>
                  </el-col>
                  <el-col :span="24" :lg="12" class="sprint-card-header-col">
                    <el-scrollbar style="height: 100%">
                      <span><i class="el-icon-notebook-1"></i> Required Skills: <b>{{sprintRequiredSkillsStr}}</b></span>
                    </el-scrollbar>
                  </el-col>
                </el-row>
                <!-- Sprint KPI -->
                <el-row>
                  <el-col :span="12" :lg="6" class="sprint-card-header-col sprint-card-header-col-center" style="border-radius: 4px 0 0 4px; border-right: none">
                    <span>Effort: <b>{{sprintEffort}}</b> mhrs</span>
                  </el-col>
                  <el-col :span="12" :lg="7" class="sprint-card-header-col sprint-card-header-col-center">
                    <span v-if="tabTaskActive == 'tab_planned_tasks'? true: false">Estimation: <b>{{sprintEstimation}}</b> mhrs</span>
                    <span v-if="tabTaskActive == 'tab_unplan_tasks'? true: false">Buffer: <b>{{sprintBuffer}}</b> mhrs</span>
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
              <el-tabs @tab-click="changeTaskTab" v-model="tabTaskActive" class="sprint-card-tabs">
                <!-- Planned Task -->
                <el-tab-pane label="Planned Tasks" style="padding: 10px 5px" name="tab_planned_tasks">
                  <div v-loading="sprintTasksListLoading" class="sprint-card-content">
                    <el-row v-if="sprintTasksList.length == 0? true: false">
                      <el-col :span="24" style="margin: 10px 0">
                        <b>No Task</b>
                      </el-col>
                    </el-row>
                    <el-card @click.native="getSprintSubtasks(index)" v-for="(sprintTask, index) in sprintTasksList" :key="index" class="box-card" style="margin-bottom: 2px;" shadow="hover">
                      <el-collapse v-model="plannedTaskActiveArray">
                        <el-collapse-item :disabled="sprintTask.taskHasSubtask == 'N'? true: false" :class="{'sprint-card-content-task-hide-icon': sprintTask.taskHasSubtask == 'N'? true: false}" :name="index">
                          <!-- Sprint Task Header -->
                          <template slot="title">
                            <el-row class="sprint-card-content-task" align="middle">
                              <el-col :span="5" :lg="3">
                                <el-button @click.stop="editTask(sprintTask.taskId, sprintTask.taskCategory)" type="text">{{sprintTask.taskName}}</el-button>
                              </el-col>
                              <el-col :span="19" :lg="11">
                                <el-tooltip class="item" effect="dark" :content="sprintTask.taskTitle" placement="top-start">
                                  <span>{{sprintTask.taskTitle}}</span>
                                </el-tooltip>
                              </el-col>
                              <el-col :span="5" :lg="2">
                                <el-tag effect="dark" type="warning" size="mini" v-if="sprintTask.taskStatus == 'Drafting'">{{sprintTask.taskStatus}}</el-tag>
                                <el-tag effect="dark" type="primary" size="mini" v-if="sprintTask.taskStatus == 'Planning'">{{sprintTask.taskStatus}}</el-tag>
                                <el-tag effect="dark" type="success" size="mini" v-if="sprintTask.taskStatus == 'Running'" >{{sprintTask.taskStatus}}</el-tag>
                                <el-tag effect="dark" type="info"    size="mini" v-if="sprintTask.taskStatus == 'Done'"    >{{sprintTask.taskStatus}}</el-tag>
                              </el-col>
                              <el-col :span="15" :lg="6">
                                <span class="sprint-card-content-task-info">
                                  <span>{{sprintTask.taskEffort}}</span>
                                  <el-divider direction="vertical"></el-divider>
                                  <span>{{sprintTask.taskEstimation}}</span>
                                  <el-divider direction="vertical"></el-divider>
                                  <span v-if="!planListHide">{{sprintTask.taskAssignee}}</span>
                                  <el-select v-if="planListHide" @visible-change="getAssigneeListByTasks($event, sprintTask, null)" @change="changeTaskAssignee(sprintTask.taskId, sprintTask.taskAssigneeId)" v-model="sprintTask.taskAssigneeId" placeholder="Select Assignee..." size="mini" style="width: 75%;" filterable>
                                    <el-option label="" value=""></el-option>
                                    <el-option v-for="(assignee, index) in assigneeList" :key="index" :label="assignee.userFullName" :value="assignee.userId">
                                      <span style="float: left; margin-right:20px">{{ assignee.userFullName }}</span>
                                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ assignee.userLevel }}</span>
                                    </el-option>
                                  </el-select>
                                </span>
                              </el-col>
                              <el-col :span="4" :lg="2" class="sprint-card-content-task-btn" style="justify-content: flex-end;">
                                <el-button @click.stop="createSubTask(sprintTask)" size="mini" type="success" icon="el-icon-plus"></el-button>
                                <el-button v-show="sprintTask.taskHasSubtask == 'N'? true: false" @click.stop="removeTask(null, sprintTask.taskId, null, sprintTask.taskName, sprintTask.taskTitle)" size="mini" type="danger" icon="el-icon-delete" style="margin-left: 3px;"></el-button>
                              </el-col>
                            </el-row>
                          </template>
                          <!-- Sprint Task Sub Task List -->
                          <div class="sprint-card-content-sub-task">
                            <el-divider content-position="left">Sub-Tasks List</el-divider>
                            <el-table v-loading="sprintTask.sprintTaskSubtasksListLoading" :data="sprintTask.sprintTaskSubtasksList" max-height="300px" size="mini" style="width: 100%;">
                              <el-table-column v-if="false" prop="subtaskId" label="Id"></el-table-column>
                              <el-table-column v-if="false" prop="subtaskParentTaskName" label="Parent Task"></el-table-column>
                              <el-table-column width="150px" align="left" prop="subtaskName" label="Name" show-overflow-tooltip key="1">
                                <template slot-scope="scope">
                                  <el-button @click.stop="editTask(scope.row.subtaskId, scope.row.subtaskCategory)" type="text">{{scope.row.subtaskName}}</el-button>
                                </template>
                              </el-table-column>
                              <el-table-column min-width="200px" align="left" prop="subtaskTitle" label="Title" show-overflow-tooltip key="2"></el-table-column>
                              <el-table-column width="80px" align="center" prop="subtaskStatus" label="Status" show-overflow-tooltip key="3">
                                <template slot-scope="scope">
                                  <el-tag effect="dark" type="warning" size="mini" v-if="scope.row.subtaskStatus == 'Drafting'">{{scope.row.subtaskStatus}}</el-tag>
                                  <el-tag effect="dark" type="primary" size="mini" v-if="scope.row.subtaskStatus == 'Planning'">{{scope.row.subtaskStatus}}</el-tag>
                                  <el-tag effect="dark" type="success" size="mini" v-if="scope.row.subtaskStatus == 'Running'" >{{scope.row.subtaskStatus}}</el-tag>
                                  <el-tag effect="dark" type="info"    size="mini" v-if="scope.row.subtaskStatus == 'Done'"    >{{scope.row.subtaskStatus}}</el-tag>
                                </template>
                              </el-table-column>
                              <el-table-column width="60px" align="center" prop="subtaskEffort" label="Effort" show-overflow-tooltip key="4"></el-table-column>
                              <el-table-column width="60px"  align="center" prop="subtaskEstimation" label="Est" show-overflow-tooltip key="5"></el-table-column>
                              <el-table-column v-if="!planListHide" width="130px" align="center" prop="subtaskAssignee" label="Assignee" show-overflow-tooltip key="6"></el-table-column>
                              <el-table-column v-if="planListHide" width="220px" align="center" prop="subtaskAssigneeId" label="Assignee" show-overflow-tooltip key="6">
                                <template slot-scope="scope">
                                  <el-select v-if="planListHide" @visible-change="getAssigneeListByTasks($event, null, scope.row)" @change="changeTaskAssignee(scope.row.subtaskId, scope.row.subtaskAssigneeId)" v-model="scope.row.subtaskAssigneeId" placeholder="Select Assignee..." size="mini" style="width: 100%;" filterable>
                                    <el-option label="" value=""></el-option>
                                    <el-option v-for="(assignee, index) in assigneeList" :key="index" :label="assignee.userFullName" :value="assignee.userId">
                                      <span style="float: left; margin-right:20px">{{ assignee.userFullName }}</span>
                                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ assignee.userLevel }}</span>
                                    </el-option>
                                  </el-select>
                                </template>
                              </el-table-column>
                              <el-table-column width="70px" align="right" fixed="right" class="sprint-card-content-task-btn">>
                                <template slot-scope="scope">
                                  <el-button-group>
                                    <el-button @click.stop="removeTask(index, scope.row.subtaskId, scope.row.subtaskParentTaskName, scope.row.subtaskName, scope.row.subtaskTitle)"  type="danger" size="mini" icon="el-icon-delete"></el-button>
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
                </el-tab-pane>
                <!-- Unplan Task -->
                <el-tab-pane label="Unplan Tasks" style="padding: 10px 5px" name="tab_unplan_tasks">
                  <div v-loading="sprintUnplanTasksListLoading" class="sprint-card-content">
                    <el-row v-if="sprintUnplanTasksList.length == 0? true: false">
                      <el-col :span="24" style="margin: 10px 0">
                        <b>No Task</b>
                      </el-col>
                    </el-row>
                    <el-card @click.native="getSprintSubtasksForUnplan(index)" v-for="(sprintTask, index) in sprintUnplanTasksList" :key="index" class="box-card" style="margin-bottom: 2px;" shadow="hover">
                      <el-collapse v-model="unplanTaskActiveArray">
                        <el-collapse-item :disabled="sprintTask.taskHasSubtask == 'N'? true: false" :class="{'sprint-card-content-task-hide-icon': sprintTask.taskHasSubtask == 'N'? true: false}" :name="index">
                          <!-- Sprint Task Header -->
                          <template slot="title">
                            <el-row class="sprint-card-content-task" align="middle">
                              <el-col :span="5" :lg="3">
                                <el-button @click.stop="editTask(sprintTask.taskId, sprintTask.taskCategory)" type="text">{{sprintTask.taskName}}</el-button>
                              </el-col>
                              <el-col :span="19" :lg="11">
                                <el-tooltip class="item" effect="dark" :content="sprintTask.taskTitle" placement="top-start">
                                  <span>{{sprintTask.taskTitle}}</span>
                                </el-tooltip>
                              </el-col>
                              <el-col :span="5" :lg="2">
                                <el-tag effect="dark" type="warning" size="mini" v-if="sprintTask.taskStatus == 'Drafting'">{{sprintTask.taskStatus}}</el-tag>
                                <el-tag effect="dark" type="primary" size="mini" v-if="sprintTask.taskStatus == 'Planning'">{{sprintTask.taskStatus}}</el-tag>
                                <el-tag effect="dark" type="success" size="mini" v-if="sprintTask.taskStatus == 'Running'" >{{sprintTask.taskStatus}}</el-tag>
                                <el-tag effect="dark" type="info"    size="mini" v-if="sprintTask.taskStatus == 'Done'"    >{{sprintTask.taskStatus}}</el-tag>
                              </el-col>
                              <el-col :span="15" :lg="6">
                                <span class="sprint-card-content-task-info">
                                  <span>{{sprintTask.taskEffort}}</span>
                                  <el-divider direction="vertical"></el-divider>
                                  <span>{{sprintTask.taskEstimation}}</span>
                                  <el-divider direction="vertical"></el-divider>
                                  <span v-if="!planListHide">{{sprintTask.taskAssignee}}</span>
                                  <el-select v-if="planListHide" @visible-change="getAssigneeListByTasks($event, sprintTask, null)" @change="changeTaskAssignee(sprintTask.taskId, sprintTask.taskAssigneeId)" v-model="sprintTask.taskAssigneeId" placeholder="Select Assignee..." size="mini" style="width: 75%;" filterable>
                                    <el-option label="" value=""></el-option>
                                    <el-option v-for="(assignee, index) in assigneeList" :key="index" :label="assignee.userFullName" :value="assignee.userId">
                                      <span style="float: left; margin-right:20px">{{ assignee.userFullName }}</span>
                                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ assignee.userLevel }}</span>
                                    </el-option>
                                  </el-select>
                                </span>
                              </el-col>
                              <el-col :span="4" :lg="2" class="sprint-card-content-task-btn" style="justify-content: flex-end;">
                                <el-button @click.stop="createSubTask(sprintTask)" size="mini" type="success" icon="el-icon-plus"></el-button>
                                <el-button v-show="sprintTask.taskHasSubtask == 'N'? true: false" @click.stop="removeTask(null, sprintTask.taskId, null, sprintTask.taskName, sprintTask.taskTitle)" size="mini" type="danger" icon="el-icon-delete" style="margin-left: 3px;"></el-button>
                              </el-col>
                            </el-row>
                          </template>
                          <!-- Sprint Task Sub Task List -->
                          <div class="sprint-card-content-sub-task">
                            <el-divider content-position="left">Sub-Tasks List</el-divider>
                            <el-table v-loading="sprintTask.sprintTaskSubtasksListLoading" :data="sprintTask.sprintTaskSubtasksList" max-height="300px" size="mini" style="width: 100%;">
                              <el-table-column v-if="false" prop="subtaskId" label="Id"></el-table-column>
                              <el-table-column v-if="false" prop="subtaskParentTaskName" label="Parent Task"></el-table-column>
                              <el-table-column width="150px" align="left" prop="subtaskName" label="Name" show-overflow-tooltip key="1">
                                <template slot-scope="scope">
                                  <el-button @click.stop="editTask(scope.row.subtaskId, scope.row.subtaskCategory)" type="text">{{scope.row.subtaskName}}</el-button>
                                </template>
                              </el-table-column>
                              <el-table-column min-width="200px" align="left" prop="subtaskTitle" label="Title" show-overflow-tooltip key="2"></el-table-column>
                              <el-table-column width="80px" align="center" prop="subtaskStatus" label="Status" show-overflow-tooltip key="3">
                                <template slot-scope="scope">
                                  <el-tag effect="dark" type="warning" size="mini" v-if="scope.row.subtaskStatus == 'Drafting'">{{scope.row.subtaskStatus}}</el-tag>
                                  <el-tag effect="dark" type="primary" size="mini" v-if="scope.row.subtaskStatus == 'Planning'">{{scope.row.subtaskStatus}}</el-tag>
                                  <el-tag effect="dark" type="success" size="mini" v-if="scope.row.subtaskStatus == 'Running'" >{{scope.row.subtaskStatus}}</el-tag>
                                  <el-tag effect="dark" type="info"    size="mini" v-if="scope.row.subtaskStatus == 'Done'"    >{{scope.row.subtaskStatus}}</el-tag>
                                </template>
                              </el-table-column>
                              <el-table-column width="60px" align="center" prop="subtaskEffort" label="Effort" show-overflow-tooltip key="4"></el-table-column>
                              <el-table-column width="60px"  align="center" prop="subtaskEstimation" label="Est" show-overflow-tooltip key="5"></el-table-column>
                              <el-table-column v-if="!planListHide" width="130px" align="center" prop="subtaskAssignee" label="Assignee" show-overflow-tooltip key="6"></el-table-column>
                              <el-table-column v-if="planListHide" width="220px" align="center" prop="subtaskAssigneeId" label="Assignee" show-overflow-tooltip key="6">
                                <template slot-scope="scope">
                                  <el-select v-if="planListHide" @visible-change="getAssigneeListByTasks($event, null, scope.row)" @change="changeTaskAssignee(scope.row.subtaskId, scope.row.subtaskAssigneeId)" v-model="scope.row.subtaskAssigneeId" placeholder="Select Assignee..." size="mini" style="width: 100%;" filterable>
                                    <el-option label="" value=""></el-option>
                                    <el-option v-for="(assignee, index) in assigneeList" :key="index" :label="assignee.userFullName" :value="assignee.userId">
                                      <span style="float: left; margin-right:20px">{{ assignee.userFullName }}</span>
                                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ assignee.userLevel }}</span>
                                    </el-option>
                                  </el-select>
                                </template>
                              </el-table-column>
                              <el-table-column width="70px" align="right" fixed="right" class="sprint-card-content-task-btn">>
                                <template slot-scope="scope">
                                  <el-button-group>
                                    <el-button @click.stop="removeTask(index, scope.row.subtaskId, scope.row.subtaskParentTaskName, scope.row.subtaskName, scope.row.subtaskTitle)"  type="danger" size="mini" icon="el-icon-delete"></el-button>
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
                </el-tab-pane>
              </el-tabs>
              <!-- End Card Content -->
            </el-card>
          </el-col>
        </el-row>
      </el-main>
      <el-drawer title="Sprint Capacity" size="25%" :direction="direction" :visible.sync="peopleResVisible" class="sprint-plan-people-res-drawer">
        <el-row>
          <!--<el-col :offset="2" :span="20">
            <el-button icon="el-icon-check" type="primary" size="small" style="width: 100%; margin-bottom: 15px">Save Adjustment</el-button>
          </el-col>-->
          <el-col :span="24">
            <el-table v-loading="sprintCapacityLoading" :data="plannedPeopleList" :summary-method="getSummaries" show-summary width="100%">
              <el-table-column v-if="false" prop="sprintId" label="SprintId" align="center"></el-table-column>
              <el-table-column v-if="false" prop="sprintUserId" label="UserId" align="center"></el-table-column>
              <el-table-column prop="sprintUserName" label="Name" align="center"></el-table-column>
              <!--<el-table-column prop="sprintUserCapacity" label="Planned Capacity" align="center" width="180">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.sprintUserCapacity" :step="scope.row.sprintUserWorkingHrs" step-strictly :min="0" :max="scope.row.sprintUserMaxCapacity" controls-position="right" size="mini"></el-input-number>
                </template>
              </el-table-column>-->
              <el-table-column prop="sprintUserCapacity" label="Planned Capacity" align="center" width="180">
              </el-table-column>
              <el-table-column align="right" fixed="right" width="80">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="Remove from Sprint" placement="top">
                    <el-button :disabled="sprintStatus == 'Running'? true: false" @click="removeUserFromSprint(scope.row)" type="danger" icon="el-icon-d-arrow-left" size="mini"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-drawer>
    </el-container>
    <pmt-task-dialog @refreshSprint="refreshSprint" :action="pmtTaskDialogAction"></pmt-task-dialog>
    <external-task-dialog :action="externalTaskDialogAction"></external-task-dialog>
    <el-dialog title="Remove Task" :visible.sync="removeTaskDialogVisible" width="25%" top="15%">
      <div class="tl-remove-task">
        <span>Confirm to remove task {{removeTaskName}}?</span>
        <el-card class="box-card" shadow="never" style="margin-top:10px;font-size: 15px;color:#909399">
          {{removeTaskTitle}}
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" size="small" @click="closeRemoveTask()">Cancel</el-button>
        <el-button type="danger" size="small" @click="confirmRemoveTask()">Confirm</el-button>
      </span>
    </el-dialog>
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
      tabActive: 'tab_hide',
      tabTaskActive: 'tab_planned_tasks',
      plannedTaskActiveArray: [],
      unplanTaskActiveArray: [],
      // Value to validate if the plan list hide and item length
      planListHide: false,
      planListLength: 11,
      planListLengthlg: 11,
      // Sprint Value
      sprintsList: [],
      sprintSelect: '',
      sprintName: '',
      sprintStartTime: '',
      sprintEndTime: '',
      sprintWorkingDays: 0,
      sprintLeader: '',
      sprintLeaderId: null,
      sprintStatus: 'Active',
      sprintBaseline: '',
      sprintRequiredSkillsStr: '',
      sprintEffort: 0,
      sprintEstimation: 0,
      sprintBuffer: 0,
      sprintActualCapacity: 0,
      sprintBaseCapacity: 0,
      sprintPeopleCount: 0,
      sprintRequiredSkills: [],
      sprintObj: {},
      // Sprint Task Value
      sprintTasksList: [],
      sprintUnplanTasksList: [],
      assigneeList: [],
      // Sprint Planned Drawer Value
      direction: 'rtl',
      peopleResVisible: false,
      plannedPeopleList: [],
      // Task Dialog handling value
      pmtTaskDialogAction: null,
      externalTaskDialogAction: null,
      // Remove Task value
      removeTaskDialogVisible: false,
      sprintSubtaskRowIndex: '',
      removeTaskId: null,
      removeTaskParentTaskname: '',
      removeTaskName: '',
      removeTaskTitle: '',
      // Loading
      sprintTasksListLoading: false,
      sprintUnplanTasksListLoading: false,
      sprintCapacityLoading: false
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
          this.$data.planListLength = 2
        } else {
          // plan list show
          this.$data.planListLengthlg = 11
          this.$data.planListLength = 11
        }
      },
      immediate: true
    },
    sprintEstimation: {
      handler (newVal, oldVal) {
        if(newVal) {
          this.$data.sprintBuffer = this.$data.sprintActualCapacity - this.$data.sprintEstimation
        }
      },
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
    // Sprint Method
    initSprintInfo () {
      this.$data.sprintName = ''
      this.$data.sprintStartTime = ''
      this.$data.sprintEndTime = ''
      this.$data.sprintWorkingDays = 0
      this.$data.sprintLeader = ''
      this.$data.sprintLeaderId = null
      this.$data.sprintStatus = 'Active'
      this.$data.sprintBaseline = ''
      this.$data.sprintRequiredSkillsStr = ''
      this.$data.sprintBaseCapacity = 0
      this.$data.sprintRequiredSkills = []
      this.$data.sprintObj = {}
    },
    initSprintTask () {
      this.$data.sprintEffort = 0
      this.$data.sprintEstimation = 0
      this.$data.sprintBuffer = 0
      this.$data.sprintTasksList = []
    },
    initSprintUser () {
      this.$data.sprintActualCapacity = 0
      this.$data.sprintPeopleCount = 0
      this.$data.plannedPeopleList = []
    },
    async getActiveSprintsList () {
      var res = await http.get('/sprints/getActiveSprintsList')
      if (res != null && res.data.status == 0) {
        this.$data.sprintsList = res.data.data
      } else {
        this.$data.sprintsList = []
      }
    },
    changeSprint () {
      this.$data.plannedTaskActiveArray = []
      this.$data.unplanTaskActiveArray = []
      this.getSprintInfo()
    },
    async changeSprintStatus () {
      var reqSprintStatus = 'Running'
      var reqSprintId = this.$data.sprintSelect
      var reqSprintCapacity = this.$data.sprintBaseCapacity
      var res = await http.post('/sprints/updateSprintStatus', {
        reqSprintId: reqSprintId,
        reqSprintStatus: reqSprintStatus,
        reqSprintCapacity: reqSprintCapacity
      })
      if (res != null && res.data.status == 0) {
        this.refreshSprint()
      }
    },
    async getSprintInfo () {
      this.initSprintInfo()
      var requestSprintId = this.$data.sprintSelect
      var res = await http.get('/sprints/getSprintById', {
        reqSprintId: requestSprintId
      })
      if (res != null && res.data.status == 0) {
        var sprint = res.data.data
        this.$data.sprintName = sprint.sprintName
        this.$data.sprintStartTime = sprint.sprintStartTime
        this.$data.sprintEndTime = sprint.sprintEndTime
        this.$data.sprintWorkingDays = sprint.sprintWorkingDays
        this.$data.sprintLeader = sprint.sprintLeader
        this.$data.sprintLeaderId = sprint.sprintLeaderId
        this.$data.sprintStatus = sprint.sprintStatus
        this.$data.sprintBaseline = sprint.sprintBaseline
        this.$data.sprintRequiredSkillsStr = sprint.sprintRequiredSkillsStr
        this.$data.sprintBaseCapacity = sprint.sprintBaseCapacity
        this.$data.sprintRequiredSkills = sprint.sprintRequiredSkills
        this.$data.sprintObj = {
          sprintId: sprint.sprintId,
          sprintRequiredSkills: sprint.sprintRequiredSkills,
          sprintWorkingDays: sprint.sprintWorkingDays,
          sprintStartTime: sprint.sprintStartTime,
          sprintEndTime: sprint.sprintEndTime,
          sprintStatus: sprint.sprintStatus,
          datetime: new Date()
        }
        if (this.$data.tabTaskActive == 'tab_planned_tasks') {
          this.getSprintPlannedTasks()
        }
        if (this.$data.tabTaskActive == 'tab_unplan_tasks') {
          this.getSprintUnplanTasks()
        }
        this.getSprintUsers()
        this.getAssigneeList()
      }
    },
    async getSprintPlannedTasks () {
      console.log('Start to get sprint tasks - planned')
      this.$data.sprintTasksListLoading = true
      this.initSprintTask()
      var requestSprintId = this.$data.sprintSelect
      var res = await http.get('/sprints/getSprintTasksById', {
        reqSprintId: requestSprintId,
        reqSprintIndicator: 'PLANNED'
      })
      if (res != null && res.data.status == 0) {
        var sprintTasksData = res.data.data
        this.$data.sprintEffort = sprintTasksData.sprintEffortSum[0].EffortSum
        this.$data.sprintEstimation = sprintTasksData.sprintEstimationSum[0].EstimationSum
        this.$data.sprintTasksList = sprintTasksData.sprintTasks
      } else {
        this.$data.sprintEffort = 0
        this.$data.sprintEstimation = 0
        this.$data.sprintBuffer = 0
        this.$data.sprintTasksList = []
      }
      this.$forceUpdate()
      this.$data.sprintTasksListLoading = false
      console.log('Active array planned task -> ', this.$data.plannedTaskActiveArray)
      if (this.$data.plannedTaskActiveArray != null && this.$data.plannedTaskActiveArray.length > 0) {
        let plannedTaskActiveArray = this.$data.plannedTaskActiveArray
        for (var i=0; i<plannedTaskActiveArray.length; i++ ) {
          this.getSprintSubtasks(plannedTaskActiveArray[i])
        }
      }
    },
    async getSprintUnplanTasks () {
      console.log('Start to get sprint tasks - unplan')
      this.$data.sprintUnplanTasksListLoading = true
      this.initSprintTask()
      var requestSprintId = this.$data.sprintSelect
      var res = await http.get('/sprints/getSprintTasksById', {
        reqSprintId: requestSprintId,
        reqSprintIndicator: 'UNPLAN'
      })
      if (res != null && res.data.status == 0) {
        var sprintTasksData = res.data.data
        this.$data.sprintEffort = sprintTasksData.sprintEffortSum[0].EffortSum
        this.$data.sprintEstimation = sprintTasksData.sprintEstimationSum[0].EstimationSum
        this.$data.sprintUnplanTasksList = sprintTasksData.sprintTasks
      } else {
        this.$data.sprintEffort = 0
        this.$data.sprintEstimation = 0
        this.$data.sprintBuffer = 0
        this.$data.sprintUnplanTasksList = []
      }
      this.$forceUpdate()
      this.$data.sprintUnplanTasksListLoading = false
      console.log('Active tabs array -> ', this.$data.unplanTaskActiveArray)
      if (this.$data.unplanTaskActiveArray != null && this.$data.unplanTaskActiveArray.length > 0) {
        let unplanTaskActiveArray = this.$data.unplanTaskActiveArray
        for (var i=0; i<unplanTaskActiveArray.length; i++ ) {
          this.getSprintSubtasksForUnplan(unplanTaskActiveArray[i])
        }
      }
    },
    async getSprintUsers () {
      this.$data.sprintCapacityLoading = true
      this.initSprintUser()
      var requestSprintId = this.$data.sprintSelect
      var res = await http.get('/sprints/getSprintUsersById', {
        reqSprintId: requestSprintId
      })
      if (res != null && res.data.status == 0) {
        var sprintUsersData = res.data.data
        console.log(sprintUsersData)
        this.$data.sprintActualCapacity = sprintUsersData.sprintUsersCapacitySum[0].CapacitySum
        this.$data.sprintPeopleCount = sprintUsersData.sprintUsers.length
        this.$data.plannedPeopleList = sprintUsersData.sprintUsers
      }
      this.$data.sprintCapacityLoading = false
    },
    async getSprintSubtasks (index) {
      console.log('Get sub task list for row -> ', index)
      var plannedTaskActiveArray = this.$data.plannedTaskActiveArray
      this.$data.sprintTasksList[index].sprintTaskSubtasksList = []
      if (plannedTaskActiveArray.indexOf(index) > -1) {
        this.$data.sprintTasksList[index].sprintTaskSubtasksListLoading = true
        var task = this.$data.sprintTasksList[index]
        var res = await http.get('/tasks/getSubtasksListByName', {
          reqTaskName: task.taskName
        })
        if (res != null && res.data.status == 0) {
          this.$data.sprintTasksList[index].sprintTaskSubtasksList = res.data.data
          this.$forceUpdate()
        }
        this.$data.sprintTasksList[index].sprintTaskSubtasksListLoading = false
      }
    },
    async getSprintSubtasksForUnplan (index) {
      console.log('Get sub task list for row -> ', index)
      var unplanTaskActiveArray = this.$data.unplanTaskActiveArray
      this.$data.sprintUnplanTasksList[index].sprintTaskSubtasksList = []
      if (unplanTaskActiveArray.indexOf(index) > -1) {
        this.$data.sprintUnplanTasksList[index].sprintTaskSubtasksListLoading = true
        var task = this.$data.sprintUnplanTasksList[index]
        var res = await http.get('/tasks/getSubtasksListByName', {
          reqTaskName: task.taskName
        })
        if (res != null && res.data.status == 0) {
          this.$data.sprintUnplanTasksList[index].sprintTaskSubtasksList = res.data.data
          this.$forceUpdate()
        }
        this.$data.sprintUnplanTasksList[index].sprintTaskSubtasksListLoading = false
      }
    },
    refreshSprint () {
      this.getSprintInfo()
    },
    // Task Tab Method
    changeTaskTab (tab, event) {
      if (tab.name == 'tab_planned_tasks') {
        console.log('Tab planned tasks')
        this.getSprintPlannedTasks()
      } 
      if (tab.name == 'tab_unplan_tasks') {
        console.log('Tab unplan tasks')
        this.getSprintUnplanTasks()
      }
    },
    // Task Dialog Method
    createTask () {
      console.log('Create PMT Task ')
      this.$data.pmtTaskDialogAction = {
        action: 'CREATE-NEW',
        sprintStatus: this.$data.sprintStatus,
        datetime: new Date()
      }
    },
    createRefTask (iTaskObj) {
      console.log('Create Reference Task ', iTaskObj)
      this.$data.pmtTaskDialogAction = {
        action: 'CREATE-REF',
        sprintStatus: this.$data.sprintStatus,
        taskTypeTag: iTaskObj.taskTypeTag,
        taskReferenceTask: iTaskObj.taskName,
        taskReferenceTaskTitle: iTaskObj.taskTitle,
        taskCustomer: iTaskObj.taskCustomer,
        taskRequiredSkills: iTaskObj.taskRequiredSkills,
        taskSprintId: this.$data.sprintSelect,
        taskRespLeader: this.$data.sprintLeader,
        taskRespLeaderId: this.$data.sprintLeaderId,
        datetime: new Date()
      }
    },
    createSubTask (iTask) {
      console.log('Create sub task ', iTask)
      this.$data.pmtTaskDialogAction = {
        action: 'CREATE-SUB',
        sprintStatus: this.$data.sprintStatus,
        taskParentTaskName: iTask.taskName,
        taskParentTaskTitle: iTask.taskTitle,
        taskType: iTask.taskType,
        taskTypeTag: iTask.taskTypeTag,
        taskCustomer: iTask.taskCustomer,
        taskRequiredSkills: iTask.taskRequiredSkills,
        taskReferenceTask: iTask.taskReferenceTask,
        taskSprintId: this.$data.sprintSelect,
        taskRespLeader: this.$data.sprintLeader,
        taskRespLeaderId: this.$data.sprintLeaderId,
        taskSprintIndicator: iTask.taskSprintIndicator,
        datetime: new Date()
      }
    },
    editTask (iTaskId, iTaskCategory) {
      console.log('Edit Task ', iTaskId, iTaskCategory)
      if (iTaskCategory.startsWith('PMT')) {
        this.$data.pmtTaskDialogAction = {
          action: 'EDIT',
          taskId: iTaskId,
          sprintStatus: this.sprintStatus,
          datetime: new Date()
        }
      }
      if (iTaskCategory.startsWith('EXTERNAL')) {
        this.$data.externalTaskDialogAction = {
          action: 'EDIT',
          taskId: iTaskId,
          datetime: new Date()
        }
      }
    },
    // Remove Dialog Method
    removeTask (index, iTaskId, iTaskParentTaskName, iTaskName, iTaskTitle) {
      console.log('Remove row ', index, ' task')
      this.$data.sprintSubtaskRowIndex = index
      console.log('Remove row index ', this.$data.sprintSubtaskRowIndex)
      this.$data.removeTaskId = iTaskId
      this.$data.removeTaskParentTaskname = iTaskParentTaskName
      this.$data.removeTaskName = iTaskName
      this.$data.removeTaskTitle = iTaskTitle
      this.$data.removeTaskDialogVisible = true
    },
    closeRemoveTask () {
      this.$data.removeTaskId = null
      this.$data.removeTaskParentTaskname = ''
      this.$data.removeTaskName = ''
      this.$data.removeTaskTitle = ''
      this.$data.removeTaskDialogVisible = false
    },
    async confirmRemoveTask () {
      var reqTaskId = this.$data.removeTaskId
      var reqTaskParentTaskName = this.$data.removeTaskParentTaskname
      const res = await http.post('/tasks/removeTask', {
        reqTaskId: reqTaskId,
        reqTaskParentTaskName: reqTaskParentTaskName
      })
      if (res.data.status === 0) {
        this.$message({
          message: 'Task remove successfully!',
          type: 'success'
        })
        this.refreshSprint()
      } else {
        this.$message.error(res.data.message)
      }
      this.closeRemoveTask()
    },
    // Assignee should match task's skills
    async changeTaskAssignee (iTaskId, iTaskAssigneeId) {
      console.log('Change task ', iTaskId, ' Assignee -> ', iTaskAssigneeId)
      var res = await http.post('/tasks/updateTaskAssignee', {
        reqTaskId: iTaskId,
        reqTaskAssigneeId: iTaskAssigneeId
      })
      if (res != null && res.data.status == 0) {
        this.$message({message: 'Task assignee updated successfully!', type: 'success'})
        this.refreshSprint()
      } else {
        this.$message({message: 'Task assignee updated fail!', type: 'error'})
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
    },
    async removeUserFromSprint (iObj) {
      var reqSprintId = iObj.sprintId
      var reqUserId = iObj.sprintUserId
      const res = await http.post('/sprints/removeUserFromSprint', {
        reqSprintId: reqSprintId,
        reqUserId: reqUserId
      })
      if (res.data != null && res.data.status == 0) {
        this.refreshSprint()
      }
    },
    // Common Method
    async getAssigneeList () {
      this.$data.assigneeList = []
      const res = await http.get('/users/getActiveUsersListByLevelLimit', {reqUserLevelLimit: 13})
      if (res.data.status === 0) {
        this.$data.assigneeList = res.data.data
      } else {
        this.$data.assigneeList = []
      }
    },
    getAssigneeListByTasks (iFlag, iTask, iSubtask) {
      console.log(iFlag, iTask, iSubtask)
      if (iFlag) {
        var taskRequiredSkillsArray = iTask != null? iTask.taskRequiredSkills: iSubtask.subtaskRequiredSkills
        var assigneeList = this.$data.assigneeList
        for(var i=0; i<assigneeList.length; i++) {
          var userSkillsArray = assigneeList[i].userSkills
          var existSameSkills = taskRequiredSkillsArray.some(item => userSkillsArray.includes(item))
          if (!existSameSkills) {
            assigneeList.splice(i, 1)
            i--
          }
        }
      } else {
        this.getAssigneeList()
      }
    }
  },
  created () {
    this.$data.planListHide = true
    this.getActiveSprintsList()
    this.initSprintInfo()
    this.initSprintTask()
    this.initSprintUser()
    this.getAssigneeList()
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
.sv-content>>>.el-tabs--left .el-tabs__item.is-left {
  text-align: left;
}
.sv-content>>>.el-tabs__item .sv-content-tab-icon{
  font-size: 18px;
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
.sprint-card-tabs>>>.el-tabs__nav {
  width: 100%;
}
.sprint-card-tabs>>>.el-tabs__item {
  width: 50%;
  font-size: 18px;
  font-weight: bold;
}
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
