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
              <el-input placeholder="Search task..." v-model="inputTaskVal" class="tl-bar-item-input" clearable @keyup.enter.native="searchTask">
                <el-select v-model="selectTaskType" slot="prepend" placeholder="Select" class="tl-bar-item-input-select" @change="changeSearchTaskType">
                  <el-option label="All Types" value="0"></el-option>
                  <el-option v-for="(tasktype, index) in taskTypeArray" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="searchTask"></el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="tl-bar-item">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="New Task" placement="top-start">
                  <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" icon="el-icon-plus" size="small" class="tl-bar-item-btn" @click="addNewTask"></el-button>
                </el-tooltip>
              </el-button-group>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="tl-bar-item">
              <el-tooltip class="item" effect="dark" content="Select task level.." placement="top-start">
                <el-radio-group v-model="requestListTaskLevel" size="medium" @change="getTaskList(1, 20)">
                  <el-radio-button label="Level 1"></el-radio-button>
                  <el-radio-button label="Level 2"></el-radio-button>
                  <el-radio-button label="Level 3"></el-radio-button>
                  <el-radio-button label="Level 4"></el-radio-button>
                </el-radio-group>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row class="tl-main">
          <el-col :span="24">
            <el-table v-loading="loading" :data="tasklistData" class="tl-main-table" fit empty-text="No Data">
              <el-table-column prop="task_id" label="Id" v-if="false" key="1"></el-table-column>
              <el-table-column prop="task_parenttaskname" label="Parent Task" width="150px" v-if="showForOthLevelTask" key="2">
                <template slot-scope="scope">
                   <el-button type="text" @click="editParentTask(scope.row.task_parenttaskname)">{{scope.row.task_parenttaskname}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="task_name" label="Number" width="150px" :show-overflow-tooltip="true" :sortable="showSortable" v-if="showCommonColumn" key="3">
                <template slot-scope="scope">
                   <el-button type="text" @click="editTask(scope.row)">{{scope.row.task_name}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="task_top_opp_name" label="Opportunity Name" align="center" v-if="showForLevel1Task" key="4"></el-table-column>
              <el-table-column prop="task_top_customer" label="Customer" align="center" width="180px" v-if="showForLevel1Task" key="5"></el-table-column>
              <el-table-column prop="task_top_type_of_work" label="Type Of Work" align="center" width="180px" v-if="showForLevel1Task" key="6"></el-table-column>
              <el-table-column prop="task_top_team_sizing" label="Team Sizing" align="center" width="180px"  v-if="showForLevel1Task" key="7"></el-table-column>
              <el-table-column prop="task_top_resp_leader" label="Proposed Leading By" align="center" width="180px" v-if="showForLevel1Task" key="8"></el-table-column>
              <el-table-column prop="task_top_target_start" label="Target Start Time" width="150px" align="center" v-if="showForLevel1Task" key="9"></el-table-column>
              <!--<el-table-column prop="task_type" label="Type" width="150px" :show-overflow-tooltip="true" :sortable="showSortable" v-if="showForOthLevelTask" key="10"></el-table-column>-->
              <el-table-column prop="task_desc" label="Description"  :show-overflow-tooltip="true" v-if="showForOthLevelTask" key="11"></el-table-column>
              <el-table-column prop="task_status" label="Status" width="233px" align="center" :show-overflow-tooltip="true" :sortable="showSortable" v-if="showForOthLevelTask" key="12"></el-table-column>
              <el-table-column prop="task_scope" label="Scope(Baseline)" width="150px" :show-overflow-tooltip="true" v-if="showForLevel2Task" key="13"></el-table-column>
              <el-table-column prop="task_effort" label="Effort(hrs)" width="123px" align="center" :sortable="showSortable" v-if="showForOthLevelTask" key="14"></el-table-column>
              <el-table-column prop="task_estimation" label="Estimation(hrs)" width="132px" align="center" v-if="showForOthLevelTask" key="15"></el-table-column>
              <!--<el-table-column prop="task_created" label="Created Time" align="center" width="150px" :show-overflow-tooltip="true" :sortable="showSortable" v-if="showForOthLevelTask" key="16"></el-table-column>-->
              <el-table-column prop="task_assignee" label="Executor/Assignee" align="center" width="180px" v-if="showForOthLevelTask" key="17"></el-table-column>
              <el-table-column prop="task_issue_date" label="Issue Date" width="180px" align="center" v-if="showForOthLevelTask" key="18"></el-table-column>
              <el-table-column prop="task_target_complete" label="Target Completion Date" width="180px" align="center" v-if="showForOthLevelTask" key="19"></el-table-column>
              <el-table-column fixed="right" label="Edit" width="100" align="center">
                <template slot-scope="scope">
                  <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" size="small" @click="editTask(scope.row)" icon="el-icon-edit">Edit</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row class="tl-pagination" v-show="showPagination">
          <el-col :span="24" class="tl-pagination-col">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[20, 50, 100, 500]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalSize">
            </el-pagination>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog :title="taskDialogTitle" :visible.sync="editTaskVisible" width="55%" style="min-width: 500px;" :close-on-click-modal="false" class="tl-taskform">
      <el-form ref="form" :model="form" label-width="140px" class="tl-edit-form" >
        <el-tabs v-model="activeFormTab" type="card" @tab-click="handleFormClick">
          <el-tab-pane label="Task Details" name="form_first">
            <el-form-item label="Parent Task">
              <el-button type="text" class="tl-edit-form-parent-task" :disabled="form.formParent != 'N/A'?false:true" @click="editParentTask(null)">{{form.formParent}}</el-button>
            </el-form-item>
            <el-form-item label="Number">
              <span style="font-size: 20px;font-weight: bold" v-show="showForExistingTask">{{form.formNumber}}</span>
              <el-input v-model="form.formNumber" v-show="showForNewTask&&showNumberInput"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Task Level">
                  <el-col :span="24">
                    <span style="font-size: 17px">{{form.formTaskLevel}}</span>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Reference">
                  <el-col :span="24">
                    <el-autocomplete placeholder="Input reference task..." :trigger-on-focus="false" popper-class="task-autocomplete" :clearable="true" style="width: 100%"
                      v-model="form.formReference" :fetch-suggestions="queryTaskAsync" @select="handleTaskSelect">
                      <template slot-scope="{ item }">
                        <div class="form_list_task_name">{{ item.value }}</div>
                        <span class="form_list_task_desc">{{ item.description }}</span>
                      </template>
                    </el-autocomplete>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Scope(Baseline)" v-show="showForLevel2Form">
                  <el-col :span="24">
                    <el-input v-model="form.formScope" style="width: 100%"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Description">
              <el-input type="textarea" v-model="form.formDesc" :rows="4" :disabled="taskDisabledStaus"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Type">
                  <el-col :span="24">
                    <el-select v-model="form.formType" v-show="showForExistingTask" disabled style="width: 100%">
                      <el-option v-for="(tasktype, index) in taskTypeArray" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
                    </el-select>
                    <el-select v-model="form.formType" v-show="showForNewTask" style="width: 100%">
                      <el-option v-for="(tasktype, index) in taskTypeArrayForPMT" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Status" v-show="showForPmtTask">
                  <el-select v-model="form.formStatus" style="width: 100%">
                    <el-option label="Drafting" value="Drafting"></el-option>
                    <el-option label="Planning" value="Planning"></el-option>
                    <el-option label="Running" value="Running"></el-option>
                    <el-option label="Done" value="Done"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Status" v-show="showForExternalTask">
                  <el-input v-model="form.formStatus" disabled style="width: 100%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Effort">
                  <el-col :span="21">
                    <el-input v-model="form.formEffort" disabled></el-input>
                  </el-col>
                  <el-col :span="3">
                    <span class="span-format">hrs</span>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-col :span="14">
                  <el-form-item label="Estimation">
                    <el-col :span="14">
                      <el-input v-model="form.formEstimation" :disabled="taskDisabledStaus"></el-input>
                    </el-col>
                    <el-col :span="10">
                      <span class="span-format">hrs</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="(Actual Estimation)">
                    <el-col :span="14">
                      <span class="span-format-center" style="text-decoration: underline;font-size:16px">{{form.formSubEstimation}}</span>
                    </el-col>
                    <el-col :span="10">
                      <span class="span-format-center">hrs</span>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-col>
            </el-row>
            <el-form-item label="Progress" v-show="showForExistingTask">
              <el-progress class="tl-edit-form-progress" :text-inside="true" :stroke-width="24" :percentage="form.formPercentage" status="success"></el-progress>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Issue Date">
                  <el-col :span="24">
                    <el-date-picker v-model="form.formIssueDate" type="datetime" style="width: 100%" placeholder="Select Date..." format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Target Complete">
                  <el-col :span="24">
                    <el-date-picker v-model="form.formTargetComplete" type="datetime" style="width: 100%" placeholder="Select Date..." format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Actual Complete">
                  <el-date-picker v-model="form.formActualComplete" type="datetime" style="width: 100%" placeholder="Select Date..." format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Responsible Leader">
                  <el-select v-model="form.formRespLeader" style="width: 100%" :disabled="disableLeader">
                    <el-option v-for="(activeUser, index) in activeUserList" :key="index" :label="activeUser.user_eid" :value="activeUser.user_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Assignee">
                  <el-select v-model="form.formAssignee" style="width: 100%">
                    <el-option v-for="(activeUser, index) in activeUserList" :key="index" :label="activeUser.user_eid" :value="activeUser.user_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- Second Tab -->
          <el-tab-pane label="Sub-Tasks List" name="form_second" :disabled="disabledTab">
            <el-form-item v-show="showForExistingTask">
              <el-button size="medium" icon="el-icon-plus" @click="addNewSubTask" :disabled="disableCreateSubTask">Create Sub Task</el-button>
            </el-form-item>
            <el-form-item label="Sub Tasks" v-show="form.formSubTasks.length > 0">
              <el-card class="box-card tl-box-card-subtask" :body-style="{padding: '0px'}" style="margin-top:4px" shadow="never">
                <el-table :data="form.formSubTasks" fit max-height="300" class="sub-task-table">
                  <el-table-column prop="task_id" v-if="false"></el-table-column>
                  <el-table-column type="index" :index="modifyIndex" width="60"></el-table-column>
                  <el-table-column :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <el-row style="cursor: pointer;" :gutter="10"  @click.native="editTask(scope.row)">
                        <el-col :span="23" class="single-line">
                          <span style="font-weight: bold">{{scope.row.task_name}}</span>
                          <span style="margin-left:5px"> {{scope.row.task_desc}}</span>
                        </el-col>
                        <el-col :span="1"><i class="el-icon-arrow-right"></i></el-col>
                      </el-row>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Worklogs List" name="form_third" :disabled="disabledTab">
            <el-card class="box-card tl-history-box-card" v-show="showHistory">
              <el-timeline>
                <el-timeline-item v-for="(history, index) in histories" :key="index" :timestamp="history.timestamp"
                  icon="el-icon-star-on" size="large" placement="top" type="primary" class="tl-history">
                  {{history.content}}
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-tab-pane>
        </el-tabs>
        <!--<el-form-item label="Worklog History" v-show="showForExistingTask">
          <el-button icon="el-icon-more" size="small" type="text" @click="showWorklogHistory" style="font-size: 18px"></el-button>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="editTaskVisible = false">Cancel</el-button>
        <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" size="medium" @click="logWorkDone" v-show="showForExistingTask">Log Work Done</el-button>
        <el-button :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="medium" @click="submitTask">Submit</el-button>
      </span>
    </el-dialog>
    <!--------------------------------------------Only for Level 1 Task------------------------------------------------------------------>
    <el-dialog :title="taskDialogTitle" :visible.sync="editTaskVisibleTop" width="55%" style="min-width: 500px;" :close-on-click-modal="false" class="tl-taskform">
      <el-form ref="form" :model="formTop" label-width="150px" class="tl-edit-form" >
        <el-tabs v-model="activeFormTopTab" type="card" @tab-click="handleFormTopClick">
          <el-tab-pane label="Task Details" name="form_first">
            <el-form-item label="Number">
              <span style="font-size: 20px;font-weight: bold" v-show="showForExistingTask">{{formTop.formTopNumber}}</span>
              <el-input v-model="formTop.formTopNumber" v-show="showForNewTask"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Task Level">
                  <el-col :span="24">
                    <span style="font-size: 17px">{{formTop.formTopTaskLevel}}</span>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Opportunity Name">
              <el-input v-model="formTop.formTopOppName"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Customer">
                  <el-input v-model="formTop.formTopCustomer"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Facing Client">
                  <el-input v-model="formTop.formTopFacingClient"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Status">
                  <el-select v-model="formTop.formTopStatus" style="width: 100%">
                    <el-option label="Drafting" value="Drafting"></el-option>
                    <el-option label="Planning" value="Planning"></el-option>
                    <el-option label="Running" value="Running"></el-option>
                    <el-option label="Done" value="Done"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Task Type">
                  <el-select v-model="formTop.formTopType" style="width: 100%">
                    <el-option v-for="(tasktype, index) in taskTypeArray" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="Type Of Work">
                  <el-input v-model="formTop.formTopTypeOfWork"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Chance of Winning">
                  <el-input v-model="formTop.formTopChanceWinning"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="SOW Confirmation">
                  <el-date-picker v-model="formTop.formTopSowConfirmation" type="date" style="width: 100%" placeholder="Select Date..." format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="BusinessValue">
              <el-input type="textarea" v-model="formTop.formTopBusinessValue" :rows="4"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Target Start">
                  <el-date-picker v-model="formTop.formTopTargetStart" type="month" style="width: 100%" placeholder="Select Month..." format="yyyy-MM"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Target End">
                  <el-date-picker v-model="formTop.formTopTargetEnd" type="month" style="width: 100%" placeholder="Select Month..." format="yyyy-MM"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Paint Points">
                  <el-input v-model="formTop.formTopPaintPoints"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Constraint">
                  <el-input v-model="formTop.formTopConstraint"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Responsible Leader">
                  <el-select v-model="formTop.formTopRespLeader" style="width: 100%">
                    <el-option v-for="(activeUser, index) in activeUserList" :key="index" :label="activeUser.user_eid" :value="activeUser.user_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Team Sizing">
                  <el-input v-model="formTop.formTopTeamSizing"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Skills / Specialization">
                  <el-input v-model="formTop.formTopSkill"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Opps > Project">
                  <el-input v-model="formTop.formTopOppsProject"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Sub-Tasks List" name="form_second" :disabled="disabledTab">
            <el-form-item v-show="showForExistingTask">
              <el-button size="medium" icon="el-icon-plus" @click="addNewSubTaskTop" :disabled="disableCreateSubTask">Create Sub Task</el-button>
            </el-form-item>
            <el-form-item label="Sub Tasks" v-show="formTop.formTopSubTasks.length > 0">
              <el-card class="box-card tl-box-card-subtask" :body-style="{padding: '0px'}" style="margin-top:4px" shadow="never">
                <el-table :data="formTop.formTopSubTasks" fit max-height="300" class="sub-task-table">
                  <el-table-column prop="task_id" v-if="false"></el-table-column>
                  <el-table-column type="index" :index="modifyIndex" width="60"></el-table-column>
                  <el-table-column :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <el-row style="cursor: pointer;" :gutter="10"  @click.native="editTask(scope.row)">
                        <el-col :span="23" class="single-line">
                          <span style="font-weight: bold">{{scope.row.task_name}}</span>
                          <span style="margin-left:5px"> {{scope.row.task_desc}}</span>
                        </el-col>
                        <el-col :span="1"><i class="el-icon-arrow-right"></i></el-col>
                      </el-row>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="editTaskVisibleTop = false">Cancel</el-button>
        <el-button :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="medium" @click="submitTaskTop">Submit</el-button>
      </span>
    </el-dialog>
    <!--End of Level 1 Task Form-->
    <el-dialog title="Add Worklog" :visible.sync="worklogFormVisible" width="35%" :close-on-click-modal="false">
      <el-form :model="wlForm" label-width="70px" class="tl-worklog-form">
        <el-form-item label="Task" >
          <span style="font-size: 17px">{{wlForm.worklog_task}}</span>
        </el-form-item>
        <el-form-item label="Date">
          <el-date-picker v-model="wlForm.worklog_date" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="Effort" >
          <el-col :span="5">
            <el-input v-model="wlForm.worklog_effort" @keyup.native="number"></el-input>
          </el-col>
          <el-col :span="5">
            <span style="text-align:center; font-size:16px; margin-left:10px">Hrs</span>
          </el-col>
        </el-form-item>
        <el-form-item label="Remark" >
          <el-input type="textarea" :rows="6" v-model="wlForm.worklog_remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="worklogFormVisible = false">Cancel</el-button>
        <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" @click="submitWorklog">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
export default {
  name: 'TaskList',
  data () {
    return {
      header1: 'Task List',
      isActive: true,
      inputTaskVal: '',
      selectTaskType: '0',
      currentPage: 1,
      pageSize: 20,
      totalSize: 0,
      tasklistData: [],
      loading: false,
      editTaskVisible: false,
      showForPmtTask: false,
      showForExternalTask: true,
      showForNewTask: false,
      showForExistingTask: true,
      showPagination: true,
      showSortable: false,
      showForHistory: true,
      form: {
        formId: 0,
        formParent: '',
        formNumber: '',
        formReference: '',
        formScope: '',
        formType: '',
        formDesc: '',
        formStatus: '',
        formEffort: 0,
        formEstimation: 0,
        formSubEstimation: 0,
        formPercentage: 0,
        formTaskLevel: 1,
        formIssueDate: '',
        formTargetComplete: '',
        formActualComplete: '',
        formRespLeader: null,
        formAssignee: null,
        formSubTasks: []
      },
      taskTypeArray: [],
      taskTypeArrayForPMT: [],
      activeUserList: [],
      showHistory: false,
      histories: [],
      worklogFormVisible: false,
      wlForm: {
        worklog_task: '',
        worklog_task_id: 0,
        worklog_date: '',
        worklog_effort: 0,
        worklog_remark: ''
      },
      taskDialogTitle: 'Edit Task',
      taskDisabledStaus: true,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
      showNumberInput: true,
      disableLeader: false,
      disableCreateSubTask: false,
      userLevel: this.$store.getters.getUserLevel,
      userEmployeeNumber: this.$store.getters.getUserEmployeeNumber,
      userRole: this.$store.getters.getUserRole,
      editTaskVisibleTop: false,
      formTop: {
        formTopNumber: '',
        formTopTaskLevel: 1 + ' (Business Opportunity)',
        formTopOppName: '',
        formTopCustomer: '',
        formTopFacingClient: '',
        formTopStatus: '',
        formTopType: '',
        formTopTypeOfWork: '',
        formTopChanceWinning: '',
        formTopSowConfirmation: '',
        formTopBusinessValue: '',
        formTopTargetStart: '',
        formTopTargetEnd: '',
        formTopPaintPoints: '',
        formTopConstraint: '',
        formTopRespLeader: '',
        formTopTeamSizing: '',
        formTopSkill: '',
        formTopOppsProject: '',
        formTopSubTasks: []
      },
      showForLevel1Task: false,
      showForLevel2Task: false,
      showForOthLevelTask: true,
      showCommonColumn: true,
      requestListTaskLevel: 'Level 1',
      activeFormTab: 'form_first',
      activeFormTopTab: 'form_first',
      disabledTab: false,
      showForLevel2Form: false
    }
  },
  methods: {
    resetTaskForm () {
      // Reset Task Form
      this.$data.form.formId = 0
      this.$data.form.formNumber = null
      this.$data.form.formTaskLevel = 1
      this.$data.form.formParent = 'N/A'
      this.$data.form.formType = null
      this.$data.form.formDesc = null
      this.$data.form.formStatus = 'Drafting'
      this.$data.form.formEffort = 0
      this.$data.form.formEstimation = 0
      this.$data.form.formSubEstimation = 0
      this.$data.form.formPercentage = 0
      this.$data.form.formIssueDate = null
      this.$data.form.formTargetComplete = null
      this.$data.form.formActualComplete = null
      this.$data.form.formRespLeader = null
      this.$data.form.formAssignee = null
      this.$data.form.formSubTasks = []
      // Reset Level 1(Top) Task Form
      this.$data.formTop.formTopNumber = null
      this.$data.formTop.formTopOppName = null
      this.$data.formTop.formTopCustomer = null
      this.$data.formTop.formTopFacingClient = null
      this.$data.formTop.formTopStatus = null
      this.$data.formTop.formTopType = null
      this.$data.formTop.formTopTypeOfWork = null
      this.$data.formTop.formTopChanceWinning = null
      this.$data.formTop.formTopSowConfirmation = null
      this.$data.formTop.formTopBusinessValue = null
      this.$data.formTop.formTopTargetStart = null
      this.$data.formTop.formTopTargetEnd = null
      this.$data.formTop.formTopPaintPoints = null
      this.$data.formTop.formTopConstraint = null
      this.$data.formTop.formTopRespLeader = null
      this.$data.formTop.formTopTeamSizing = null
      this.$data.formTop.formTopSkill = null
      this.$data.formTop.formTopOppsProject = null
      this.$data.formTop.formTopSubTasks = []
      // Reset related item
      this.$data.showHistory = false
      this.$data.showNumberInput = true
      this.$data.disableLeader = false
      this.$data.disableCreateSubTask = false
      this.$data.editTaskVisibleTop = false
      this.$data.editTaskVisible = false
      this.$data.taskDialogTitle = null
      this.$data.showForExistingTask = true
      this.$data.showForNewTask = false
      this.$data.activeFormTab = 'form_first'
      this.$data.activeFormTopTab = 'form_first'
      this.$data.disabledTab = false
      this.$data.showForLevel2Form = false
      // Reset Worklog Form
      this.$data.wlForm.worklog_task_id = 0
      this.$data.wlForm.worklog_task = null
      this.$data.wlForm.worklog_date = this.getCurrentDate()
      this.$data.wlForm.worklog_effort = 0
      this.$data.wlForm.worklog_remark = null
    },
    async getTaskList (iPage, iSize) {
      // console.log('Get task of page: ' + iPage + ', Size: ' + iSize + 'Loading: ' + this.$data.loading)
      this.$data.loading = true
      this.$data.showPagination = true
      this.$data.showSortable = false
      this.$data.showCommonColumn = false
      this.$data.showForLevel1Task = false
      this.$data.showForOthLevelTask = false
      var iTaskLevel = 1
      switch (this.$data.requestListTaskLevel) {
        case 'Level 1': iTaskLevel = 1
          break
        case 'Level 2': iTaskLevel = 2
          break
        case 'Level 3': iTaskLevel = 3
          break
        case 'Level 4': iTaskLevel = 4
          break
        default: iTaskLevel = 1
      }
      if (iTaskLevel === 1) {
        this.$data.showCommonColumn = true
        this.$data.showForLevel1Task = true
        this.$data.showForOthLevelTask = false
      } else {
        if (iTaskLevel === 2) {
          this.$data.showForLevel2Task = true
        } else {
          this.$data.showForLevel2Task = false
        }
        this.$data.showCommonColumn = true
        this.$data.showForLevel1Task = false
        this.$data.showForOthLevelTask = true
      }
      const res = await http.get('/tasks/getTotalTaskSize', {
        reqTaskLevel: iTaskLevel
      })
      if (res.data.status === 0) {
        this.$data.totalSize = res.data.data[0].task_total_size
        const res1 = await http.get('/tasks/getTaskList', {
          reqPage: iPage,
          reqSize: iSize,
          reqTaskLevel: iTaskLevel
        })
        if (res1.data.status === 0) {
          this.$data.tasklistData = res1.data.data
        }
      } else {
        this.$data.totalSize = 0
        this.$data.tasklistData = []
      }
      this.$data.loading = false
    },
    handleSizeChange (val) {
      this.$data.currentPage = 1
      this.$data.pageSize = val
      this.getTaskList(1, val)
    },
    handleCurrentChange (val) {
      var pageSize = this.$data.pageSize
      this.$data.currentPage = val
      this.getTaskList(val, pageSize)
    },
    async editTask (taskRow) {
      this.resetTaskForm()
      this.getTaskType()
      this.getActiveUser()
      var taskId = taskRow.task_id
      this.$data.showForHistory = true
      this.$data.taskDialogTitle = 'Edit Task'
      const res = await http.post('/tasks/getTaskById', {
        tId: taskId
      })
      if (res.data.status === 0) {
        var taskData = res.data.data[0]
        var taskLevel = taskData.task_level
        if (taskLevel === 1) {
          // Show Task for Level 1
          this.$data.showForNewTask = false
          this.$data.showForExistingTask = true
          this.$data.editTaskVisibleTop = true
          this.$data.formTop.formTopNumber = taskData.task_name
          this.$data.formTop.formTopOppName = taskData.task_top_opp_name
          this.$data.formTop.formTopCustomer = taskData.task_top_customer
          this.$data.formTop.formTopFacingClient = taskData.task_top_facing_client
          this.$data.formTop.formTopStatus = taskData.task_status
          this.$data.formTop.formTopType = taskData.task_type_id
          this.$data.formTop.formTopTypeOfWork = taskData.task_top_type_of_work
          this.$data.formTop.formTopChanceWinning = taskData.task_top_chance_winning
          this.$data.formTop.formTopSowConfirmation = (taskData.task_top_sow_confirmation !== null && taskData.task_top_sow_confirmation !== '') ? new Date(taskData.task_top_sow_confirmation) : null
          this.$data.formTop.formTopBusinessValue = taskData.task_top_business_value
          this.$data.formTop.formTopTargetStart = (taskData.task_top_target_start !== null && taskData.task_top_target_start !== '') ? new Date(taskData.task_top_target_start) : null
          this.$data.formTop.formTopTargetEnd = (taskData.task_top_target_end !== null && taskData.task_top_target_end !== '') ? new Date(taskData.task_top_target_end) : null
          this.$data.formTop.formTopPaintPoints = taskData.task_top_paint_points
          this.$data.formTop.formTopConstraint = taskData.task_top_constraint
          this.$data.formTop.formTopRespLeader = taskData.task_responsible_leader
          this.$data.formTop.formTopTeamSizing = taskData.task_top_team_sizing
          this.$data.formTop.formTopSkill = taskData.task_top_skill
          this.$data.formTop.formTopOppsProject = taskData.task_top_opps_project
        } else {
          // Show Task for Level 2 ~ 4
          console.log(taskData.task_level)
          if (taskData.task_level === 2) {
            this.$data.showForLevel2Form = true
          } else {
            this.$data.showForLevel2Form = false
          }
          this.$data.editTaskVisible = true
          var taskCreator = taskData.task_creator
          if (taskCreator.startsWith('PMT')) {
            this.$data.showForPmtTask = true
            this.$data.showForExternalTask = false
            this.$data.taskDisabledStaus = false
          } else {
            if (taskCreator === 'ServiceNow') {
              this.$data.disableLeader = true
            }
            this.$data.showForPmtTask = false
            this.$data.showForExternalTask = true
            this.$data.taskDisabledStaus = true
          }
          this.$data.showForNewTask = false
          this.$data.showForExistingTask = true
          if (Number(taskData.task_level) === 4) {
            this.$data.disableCreateSubTask = true
          }
          this.$data.form.formId = taskData.task_id
          this.$data.form.formNumber = taskData.task_name
          switch (taskData.task_level) {
            case 1: this.$data.form.formTaskLevel = taskData.task_level + ' (Business Opportunity)'
              break
            case 2: this.$data.form.formTaskLevel = taskData.task_level + ' (Business Implementation)'
              break
            case 3: this.$data.form.formTaskLevel = taskData.task_level + ' (Excutive Task)'
              break
            case 4: this.$data.form.formTaskLevel = taskData.task_level + ' (Workable Task)'
              break
            default: this.$data.form.formTaskLevel = taskData.task_level
          }
          this.$data.form.formParent = taskData.task_parenttaskname
          this.$data.form.formType = taskData.task_type_id
          this.$data.form.formDesc = taskData.task_desc
          this.$data.form.formStatus = taskData.task_status
          this.$data.form.formEffort = taskData.task_currenteffort
          this.$data.form.formEstimation = taskData.task_totaleffort
          this.$data.form.formSubEstimation = taskData.task_subtasks_totaleffort
          this.$data.form.formPercentage = Number(taskData.task_progress_nosymbol)
          this.$data.form.formIssueDate = (taskData.task_issue_date !== null && taskData.task_issue_date !== '') ? new Date(taskData.task_issue_date) : null
          this.$data.form.formTargetComplete = (taskData.task_target_complete !== null && taskData.task_target_complete !== '') ? new Date(taskData.task_target_complete) : null
          this.$data.form.formActualComplete = (taskData.task_actual_complete !== null && taskData.task_actual_complete !== '') ? new Date(taskData.task_actual_complete) : null
          this.$data.form.formRespLeader = taskData.task_responsible_leader
          this.$data.form.formAssignee = taskData.task_assignee
          this.$data.form.formReference = taskData.task_reference
          this.$data.form.formScope = taskData.task_scope
        }
      }
    },
    async editParentTask (iParent) {
      var reqParentTask = null
      if (iParent != null && iParent !== '' && iParent !== 'N/A') {
        reqParentTask = iParent
      } else {
        reqParentTask = this.$data.form.formParent
      }
      this.resetTaskForm()
      this.getTaskType()
      this.getActiveUser()
      this.$data.showForHistory = true
      this.$data.taskDialogTitle = 'Edit Task'
      const res = await http.post('/tasks/getTaskByParentTask', {
        tParentTask: reqParentTask
      })
      if (res.data.status === 0) {
        var taskData = res.data.data[0]
        var taskLevel = taskData.task_level
        if (taskLevel === 1) {
          // Show Task for Level 1
          this.$data.showForNewTask = false
          this.$data.showForExistingTask = true
          this.$data.editTaskVisibleTop = true
          this.$data.formTop.formTopNumber = taskData.task_name
          this.$data.formTop.formTopOppName = taskData.task_top_opp_name
          this.$data.formTop.formTopCustomer = taskData.task_top_customer
          this.$data.formTop.formTopFacingClient = taskData.task_top_facing_client
          this.$data.formTop.formTopStatus = taskData.task_status
          this.$data.formTop.formTopType = taskData.task_type_id
          this.$data.formTop.formTopTypeOfWork = taskData.task_top_type_of_work
          this.$data.formTop.formTopChanceWinning = taskData.task_top_chance_winning
          this.$data.formTop.formTopSowConfirmation = (taskData.task_top_sow_confirmation !== null && taskData.task_top_sow_confirmation !== '') ? new Date(taskData.task_top_sow_confirmation) : null
          this.$data.formTop.formTopBusinessValue = taskData.task_top_business_value
          this.$data.formTop.formTopTargetStart = (taskData.task_top_target_start !== null && taskData.task_top_target_start !== '') ? new Date(taskData.task_top_target_start) : null
          this.$data.formTop.formTopTargetEnd = (taskData.task_top_target_end !== null && taskData.task_top_target_end !== '') ? new Date(taskData.task_top_target_end) : null
          this.$data.formTop.formTopPaintPoints = taskData.task_top_paint_points
          this.$data.formTop.formTopConstraint = taskData.task_top_constraint
          this.$data.formTop.formTopRespLeader = taskData.task_responsible_leader
          this.$data.formTop.formTopTeamSizing = taskData.task_top_team_sizing
          this.$data.formTop.formTopSkill = taskData.task_top_skill
          this.$data.formTop.formTopOppsProject = taskData.task_top_opps_project
        } else {
          // Show Task for Level 2 ~ 4
          if (taskData.task_level === 2) {
            this.$data.showForLevel2Form = true
          } else {
            this.$data.showForLevel2Form = false
          }
          this.$data.editTaskVisible = true
          var taskCreator = taskData.task_creator
          if (taskCreator.startsWith('PMT')) {
            this.$data.showForPmtTask = true
            this.$data.showForExternalTask = false
            this.$data.taskDisabledStaus = false
          } else {
            if (taskCreator === 'ServiceNow') {
              this.$data.disableLeader = true
            }
            this.$data.showForPmtTask = false
            this.$data.showForExternalTask = true
            this.$data.taskDisabledStaus = true
          }
          this.$data.showForNewTask = false
          this.$data.showForExistingTask = true
          if (Number(taskData.task_level) === 4) {
            this.$data.disableCreateSubTask = true
          }
          this.$data.form.formId = taskData.task_id
          this.$data.form.formNumber = taskData.task_name
          switch (taskData.task_level) {
            case 1: this.$data.form.formTaskLevel = taskData.task_level + ' (Business Opportunity)'
              break
            case 2: this.$data.form.formTaskLevel = taskData.task_level + ' (Business Implementation)'
              break
            case 3: this.$data.form.formTaskLevel = taskData.task_level + ' (Excutive Task)'
              break
            case 4: this.$data.form.formTaskLevel = taskData.task_level + ' (Workable Task)'
              break
            default: this.$data.form.formTaskLevel = taskData.task_level
          }
          this.$data.form.formParent = taskData.task_parenttaskname
          this.$data.form.formType = taskData.task_type_id
          this.$data.form.formDesc = taskData.task_desc
          this.$data.form.formStatus = taskData.task_status
          this.$data.form.formEffort = taskData.task_currenteffort
          this.$data.form.formEstimation = taskData.task_totaleffort
          this.$data.form.formSubEstimation = taskData.task_subtasks_totaleffort
          this.$data.form.formPercentage = Number(taskData.task_progress_nosymbol)
          this.$data.form.formIssueDate = (taskData.task_issue_date !== null && taskData.task_issue_date !== '') ? new Date(taskData.task_issue_date) : null
          this.$data.form.formTargetComplete = (taskData.task_target_complete !== null && taskData.task_target_complete !== '') ? new Date(taskData.task_target_complete) : null
          this.$data.form.formActualComplete = (taskData.task_actual_complete !== null && taskData.task_actual_complete !== '') ? new Date(taskData.task_actual_complete) : null
          this.$data.form.formRespLeader = taskData.task_responsible_leader
          this.$data.form.formAssignee = taskData.task_assignee
          this.$data.form.formReference = taskData.task_reference
          this.$data.form.formScope = taskData.task_scope
        }
      }
    },
    async handleFormClick (tab, event) {
      if (tab.name === 'form_second') {
        const res1 = await http.post('/tasks/getSubTaskByParentTaskName', {
          tTaskName: this.$data.form.formNumber
        })
        if (res1.data.status === 0) {
          this.$data.form.formSubTasks = res1.data.data
        } else {
          this.$data.form.formSubTasks = []
        }
      }
      if (tab.name === 'form_third') {
        this.showWorklogHistory()
      }
    },
    async handleFormTopClick (tab, event) {
      if (tab.name === 'form_second') {
        const res1 = await http.post('/tasks/getSubTaskByParentTaskName', {
          tTaskName: this.$data.formTop.formTopNumber
        })
        if (res1.data.status === 0) {
          this.$data.formTop.formTopSubTasks = res1.data.data
        } else {
          this.$data.formTop.formTopSubTasks = []
        }
      }
    },
    async showWorklogHistory () {
      this.$data.histories = []
      this.$data.showHistory = !this.$data.showHistory
      var reqTaskId = this.$data.form.formId
      const res = await http.post('/worklogs/getWorklogHistoryByTaskId', {
        wTaskId: reqTaskId
      })
      if (res.data.status === 0) {
        this.$data.histories = res.data.data
      }
    },
    addNewTask () {
      if (this.$data.userLevel > 8 && this.$data.userRole !== 'Admin') {
        this.showWarnMessage('Warning', 'No right to create Level 1 task!')
        return
      }
      this.$data.taskDialogTitle = 'Add New Task'
      this.resetTaskForm()
      this.getTaskType()
      this.getActiveUser()
      this.$data.disabledTab = true
      this.$data.showForExistingTask = false
      this.$data.showForNewTask = true
      this.$data.editTaskVisibleTop = true
    },
    addNewSubTask () {
      var taskLevel = this.$data.form.formTaskLevel
      var newTaskLevel = Number(taskLevel.substring(0, 1)) + 1
      this.$data.taskDialogTitle = 'Add New Sub Task'
      this.$data.taskDisabledStaus = false
      var parentTask = this.$data.form.formNumber
      // var taskNumber = this.$data.form.formNumber
      this.resetTaskForm()
      this.$data.form.formParent = parentTask
      this.$data.form.formTaskLevel = newTaskLevel
      this.getTaskType()
      this.getActiveUser()
      if (newTaskLevel === 2) {
        this.$data.showForLevel2Form = true
      } else {
        this.$data.showForLevel2Form = false
      }
      this.$data.disabledTab = true
      this.$data.showForPmtTask = true
      this.$data.showForExternalTask = false
      this.$data.showForExistingTask = false
      this.$data.showForNewTask = true
      this.$data.showNumberInput = false
      this.$data.editTaskVisible = true
    },
    addNewSubTaskTop () {
      var taskLevel = this.$data.formTop.formTopTaskLevel
      var newTaskLevel = Number(taskLevel.substring(0, 1)) + 1
      if (newTaskLevel === '2') {
        if (this.$data.userLevel > 10 && this.$data.userRole !== 'Admin') {
          this.showWarnMessage('Warning', 'No right to create Level 2 task!')
          return
        }
      }
      this.$data.taskDialogTitle = 'Add New Sub Task'
      this.$data.taskDisabledStaus = false
      var parentTask = this.$data.formTop.formTopNumber
      this.resetTaskForm()
      this.$data.form.formParent = parentTask
      this.$data.form.formTaskLevel = newTaskLevel
      this.getTaskType()
      this.getActiveUser()
      if (newTaskLevel === 2) {
        this.$data.showForLevel2Form = true
      } else {
        this.$data.showForLevel2Form = false
      }
      this.$data.showSecondTab = false
      this.$data.showThirdTab = false
      this.$data.showForPmtTask = true
      this.$data.showForExternalTask = false
      this.$data.showForExistingTask = false
      this.$data.showForNewTask = true
      this.$data.showNumberInput = false
      this.$data.editTaskVisible = true
    },
    async submitTask () {
      var reqFormParent = this.$data.form.formParent
      var reqFormName = this.$data.form.formNumber
      var reqFormTaskLevel = this.$data.form.formTaskLevel + ''
      reqFormTaskLevel = Number(reqFormTaskLevel.substring(0, 1))
      var reqFormTypeId = this.$data.form.formType
      if (reqFormTypeId === null || reqFormTypeId === '') {
        this.showWarnMessage('Warning', 'Please select task type')
        return
      }
      var reqFormDesc = this.$data.form.formDesc
      var reqFormStatus = this.$data.form.formStatus
      if (reqFormStatus === null || reqFormStatus === '') {
        // this.showWarnMessage('Warning', 'Please select task status')
        reqFormStatus = 'Drafting'
      }
      var reqFormEffort = this.$data.form.formEffort
      var reqFormEstimation = this.$data.form.formEstimation
      if (reqFormTaskLevel === 4) {
        if (reqFormEstimation > 18) {
          this.showWarnMessage('Warning', 'Level 4 task elstimation could not over 18 hrs!')
          return
        }
      }
      if (reqFormTaskLevel === 3) {
        if (!this.$data.form.formSubTasks.length > 0) {
          if (reqFormEstimation > 18) {
            this.showWarnMessage('Warning', 'Level 3 (No Sub Task) task elstimation could not over 18 hrs!')
            return
          }
        }
      }
      var reqFormIssueDate = this.dateToString(this.$data.form.formIssueDate)
      /* if (reqFormIssueDate === '' || reqFormIssueDate === null) {
        this.showWarnMessage('Warning', 'Issue date could not be empty!')
        return
      } */
      var reqFormTargetComplete = this.dateToString(this.$data.form.formTargetComplete)
      var reqFormActualComplete = this.dateToString(this.$data.form.formActualComplete)
      if (reqFormTargetComplete < reqFormIssueDate) {
        this.showWarnMessage('Warning', 'Target Complete date could not smaller than issue date!')
        return
      }
      if (reqFormActualComplete < reqFormIssueDate) {
        this.showWarnMessage('Warning', 'Actual Complete date could not smaller than issue date!')
        return
      }
      var reqFormRespLeader = this.$data.form.formRespLeader
      var reqFormAssignee = this.$data.form.formAssignee
      var reqFormReference = this.$data.form.formReference
      var reqFormScope = this.$data.form.formScope
      const res = await http.post('/tasks/addOrUpdateTask', {
        tParent: reqFormParent,
        tName: reqFormName,
        tLevel: reqFormTaskLevel,
        tDescription: reqFormDesc,
        tTaskTypeId: reqFormTypeId,
        tStatus: reqFormStatus,
        tEffort: reqFormEffort,
        tEstimation: reqFormEstimation,
        tIssueDate: reqFormIssueDate,
        tTargetComplete: reqFormTargetComplete,
        tActualComplete: reqFormActualComplete,
        tRespLeader: reqFormRespLeader,
        tAssignee: reqFormAssignee,
        tCreator: 'PMT:' + this.$data.userEmployeeNumber,
        tScope: reqFormScope,
        tReference: reqFormReference
      })
      if (res.data.status === 0) {
        this.$message({
          message: 'Task created successfully!',
          type: 'success'
        })
      } else {
        this.$message({
          message: 'Task updated successfully!',
          type: 'success'
        })
      }
      this.$data.editTaskVisible = false
      this.resetTaskForm()
      this.$data.pageSize = 20
      this.$data.currentPage = 1
      this.getTaskList(1, 20)
    },
    async submitTaskTop () {
      var reqFormTopName = this.$data.formTop.formTopNumber
      var reqFormTopTaskLevel = Number(this.$data.formTop.formTopTaskLevel.substring(0, 1))
      var reqFormTopTypeId = this.$data.formTop.formTopType
      if (reqFormTopTypeId === null || reqFormTopTypeId === '') {
        this.showWarnMessage('Warning', 'Please select task type')
        return
      }
      var reqFormTopStatus = this.$data.formTop.formTopStatus
      if (reqFormTopStatus === null || reqFormTopStatus === '') {
        reqFormTopStatus = 'Drafting'
      }
      var reqFormTopOppName = this.$data.formTop.formTopOppName
      var reqFormTopCustomer = this.$data.formTop.formTopCustomer
      var reqFormTopFacingClient = this.$data.formTop.formTopFacingClient
      var reqFormTopTypeOfWork = this.$data.formTop.formTopTypeOfWork
      var reqFormTopChanceWinning = this.$data.formTop.formTopChanceWinning
      var reqFormTopBusinessValue = this.$data.formTop.formTopBusinessValue
      var reqFormTopPaintPoints = this.$data.formTop.formTopPaintPoints
      var reqFormTopConstraint = this.$data.formTop.formTopConstraint
      var reqFormTopRespLeader = this.$data.formTop.formTopRespLeader
      var reqFormTopTeamSizing = this.$data.formTop.formTopTeamSizing
      var reqFormTopSkill = this.$data.formTop.formTopSkill
      var reqFormTopOppsProject = this.$data.formTop.formTopOppsProject
      var reqFormTopSowConfirmation = this.dateToString(this.$data.formTop.formTopSowConfirmation)
      var reqFormTopTargetStart = this.dateToString(this.$data.formTop.formTopTargetStart)
      var reqFormTopTargetEnd = this.dateToString(this.$data.formTop.formTopTargetEnd)
      if (reqFormTopTargetEnd < reqFormTopTargetStart) {
        this.showWarnMessage('Warning', 'Target end month could not smaller than target start month!')
        return
      }
      const res = await http.post('/tasks/addOrUpdateTaskTop', {
        tTopName: reqFormTopName,
        tTopLevel: reqFormTopTaskLevel,
        tTopTaskTypeId: reqFormTopTypeId,
        tTopStatus: reqFormTopStatus,
        tTopConstraint: reqFormTopConstraint,
        tTopOppName: reqFormTopOppName,
        tTopCustomer: reqFormTopCustomer,
        tTopFacingClient: reqFormTopFacingClient,
        tTopTypeOfWork: reqFormTopTypeOfWork,
        tTopChanceWinning: reqFormTopChanceWinning,
        tTopBusinessValue: reqFormTopBusinessValue,
        tTopSowConfirmation: reqFormTopSowConfirmation,
        tTopTargetStart: reqFormTopTargetStart,
        tTopTargetEnd: reqFormTopTargetEnd,
        tTopPaintPoints: reqFormTopPaintPoints,
        tTopTeamSizing: reqFormTopTeamSizing,
        tTopSkill: reqFormTopSkill,
        tTopOppsProject: reqFormTopOppsProject,
        tTopRespLeader: reqFormTopRespLeader,
        tCreator: 'PMT:' + this.$data.userEmployeeNumber
      })
      if (res.data.status === 0) {
        this.$message({
          message: 'Task created successfully!',
          type: 'success'
        })
      } else {
        this.$message({
          message: 'Task updated successfully!',
          type: 'success'
        })
      }
      this.$data.editTaskVisibleTop = false
      this.resetTaskForm()
      this.$data.pageSize = 20
      this.$data.currentPage = 1
      this.getTaskList(1, 20)
    },
    logWorkDone () {
      this.$data.editTaskVisible = false
      this.$data.worklogFormVisible = true
      this.$data.wlForm.worklog_task_id = this.$data.form.formId
      this.$data.wlForm.worklog_task = this.$data.form.formNumber
      console.log('Current Date: ' + this.getCurrentDate())
      this.$data.wlForm.worklog_date = this.getCurrentDate()
    },
    async submitWorklog () {
      console.log('click')
      var reqUserId = this.$store.getters.getUserId
      var reqTaskId = this.$data.wlForm.worklog_task_id
      var reqRemark = this.$data.wlForm.worklog_remark
      var reqWorklogEffort = Number(this.$data.wlForm.worklog_effort)
      var reqWorklogDate = this.$data.wlForm.worklog_date
      if (reqTaskId === 0) {
        this.showWarnMessage('Warning', 'Task invalid!')
        return
      }
      if (reqWorklogDate === '' || reqWorklogDate === null) {
        this.showWarnMessage('Warning', 'Invalid date!')
        return
      }
      var arr = []
      arr = reqWorklogDate.split('-')
      var reqWorklogMonth = arr[0] + '-' + arr[1]
      var reqWorklogDay = arr[2]
      if (reqWorklogEffort <= 0 || reqWorklogEffort > 24) {
        this.showWarnMessage('Warning', 'Invalid effort!')
        return
      }
      const res = await http.post('/worklogs/addOrUpdateWorklog', {
        wUserId: reqUserId,
        wTaskId: reqTaskId,
        wWorklogMonth: reqWorklogMonth,
        wWorklogDay: reqWorklogDay,
        wEffort: reqWorklogEffort,
        wRemark: reqRemark
      })
      if (res.data.status === 0) {
        this.$data.worklogFormVisible = false
        this.$message({
          message: 'Worklog added successfully!',
          type: 'success'
        })
        this.resetTaskForm()
        this.$data.pageSize = 20
        this.$data.currentPage = 1
        this.getTaskList(1, 20)
      } else {
        this.showWarnMessage('Warning', 'Fail to add worklog!')
      }
    },
    async changeSearchTaskType () {
      this.searchTask()
    },
    async searchTask () {
      var reqTaskTypeId = this.$data.selectTaskType
      var reqTaskKeyword = this.$data.inputTaskVal
      if (reqTaskKeyword === '' && reqTaskTypeId === '0') {
        this.$data.pageSize = 20
        this.$data.currentPage = 1
        this.getTaskList(1, 20)
      } else {
        this.$data.showPagination = false
        this.$data.showSortable = true
        this.$data.loading = true
        this.$data.showCommonColumn = false
        this.$data.showForLevel1Task = false
        this.$data.showForOthLevelTask = false
        var iTaskLevel = 1
        switch (this.$data.requestListTaskLevel) {
          case 'Level 1': iTaskLevel = 1
            break
          case 'Level 2': iTaskLevel = 2
            break
          case 'Level 3': iTaskLevel = 3
            break
          case 'Level 4': iTaskLevel = 4
            break
          default: iTaskLevel = 1
        }
        if (iTaskLevel === 1) {
          this.$data.showCommonColumn = true
          this.$data.showForLevel1Task = true
          this.$data.showForOthLevelTask = false
        } else {
          this.$data.showCommonColumn = true
          this.$data.showForLevel1Task = false
          this.$data.showForOthLevelTask = true
        }
        const res = await http.post('/tasks/getTaskByName', {
          tTaskName: reqTaskKeyword,
          tTaskTypeId: reqTaskTypeId,
          tTaskLevel: iTaskLevel
        })
        if (res.data.status === 0) {
          this.$data.tasklistData = res.data.data
        } else {
          this.$data.tasklistData = []
        }
        this.$data.loading = false
      }
    },
    // Get List Data
    async getTaskType () {
      this.$data.taskTypeArray = []
      this.$data.taskTypeArrayForPMT = []
      const res = await http.get('/tasks/getAllTaskType')
      if (res.data.status === 0) {
        this.$data.taskTypeArray = res.data.data
        var taskTypeList = res.data.data
        for (var i = 0; i < taskTypeList.length; i++) {
          if (taskTypeList[i].type_prefix !== '' && taskTypeList[i].type_prefix !== null) {
            this.$data.taskTypeArrayForPMT.push(taskTypeList[i])
          }
        }
      }
    },
    async getActiveUser () {
      this.$data.activeUserList = []
      const res = await http.get('/users/getUserList', {
        IsActive: 1
      })
      if (res.data.status === 0) {
        this.$data.activeUserList = res.data.data
      }
    },
    async queryTaskAsync (queryString, cb) {
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
      console.log(item.value)
      this.$data.form.formReference = item.value
    },
    // Common Function
    showWarnMessage (iTitle, iMsg) {
      this.$notify.error({
        title: iTitle,
        message: iMsg,
        duration: 3000,
        showClose: false
      })
    },
    number () {
      var formEffort = this.$data.wlForm.worklog_effort
      if (formEffort > 0) {
        formEffort = Number(formEffort)
      } else {
        formEffort = formEffort.replace(/[^\d]/g, '')
        formEffort = formEffort.replace('.', '')
        this.$data.wlForm.worklog_effort = formEffort
      }
    },
    getCurrentDate () {
      var date = new Date()
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      return date.getFullYear() + '-' + month + '-' + day
    },
    dateToString (iDate) {
      if (iDate !== null && iDate !== '' && iDate !== 'Invalid Date') {
        var changeDateYear = iDate.getFullYear()
        var changeDateMonth = this.stringAddZero(iDate.getMonth() + 1)
        var changeDateDay = this.stringAddZero(iDate.getDate())
        var changeDateHours = this.stringAddZero(iDate.getHours())
        var changeDateMinutes = this.stringAddZero(iDate.getMinutes())
        var changeDateSeconds = this.stringAddZero(iDate.getHours())
        return changeDateYear + '-' + changeDateMonth + '-' + changeDateDay + ' ' + changeDateHours + ':' + changeDateMinutes + ':' + changeDateSeconds
      } else {
        return null
      }
    },
    stringAddZero (iValue) {
      if (iValue < 10) {
        return '0' + iValue
      } else {
        return '' + iValue
      }
    },
    /* Base on requirement, no need to auto generate task number when select task type
    async changeNewTaskType () {
      const res = await http.post('/tasks/getNewTaskNumberByType', {
        tTaskTypeId: this.$data.form.formType
      })
      if (res.data.status === 0) {
        this.$data.form.formNumber = res.data.data.task_name
      }
    },
    */
    modifyIndex (index) {
      return index + 1 + '.'
    }
  },
  created () {
    this.$data.pageSize = 20
    this.$data.currentPage = 1
    this.getTaskList(1, 20)
    this.getTaskType()
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
.tl-bar-item-btn {
  font-size: 20px;
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
.tl-edit-form-parent-task {
  font-size: 17px;
  text-decoration: underline;
}
.tl-edit-form-progress {
  height: 100%;
  line-height: 40px;
}
.tl-history {
  text-align:left;
}
.tl-history-box-card {
  height: 200px;
  overflow: auto;
}
.tl-worklog-form {
  text-align: left;
}
.form_list_task_name {
  font-size: 16px;
  color: #57606f;
  text-overflow: ellipsis;
  overflow: hidden;
}
.form_list_task_desc {
  font-size: 14px;
  color: #bdc3c7;
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
.view-hide {
  display: none;
}
.span-format {
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.span-format-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<style>
.el-dialog__body {
  padding: 10px 20px;
}
.el-table td, .el-table th {
  padding: 5px 0;
}
.el-form-item {
  margin-bottom: 11px;
}
.el-dialog__header {
  padding-top: 15px;
}
/* In order to hide table header because "show-header" and "max-height" use together will throw error */
.sub-task-table .el-table__header{
  display:none
}
.tl-taskform .el-dialog__title{
  font-size: 21px;
}
</style>
