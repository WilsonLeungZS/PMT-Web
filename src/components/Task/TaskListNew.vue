<template>
  <div class="tl-body">
    <el-container>
      <el-main>
<!------- 1. Header -->
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-tickets content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
          </el-col>
        </el-row>
<!------- 1. End of Header -->
<!------- 2. Search Bar -->
        <el-row class="tl-bar">
          <el-col :span="9">
            <div class="tl-bar-item">
              <el-input placeholder="Search task..." v-model="searchVal" class="tl-bar-item-input" clearable @keyup.enter.native="searchTask">
                <el-button slot="append" icon="el-icon-search" @click="searchTask"></el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tl-bar-item">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="New Task" placement="top-start">
                  <el-button @click="createNewTask(formFilter.filterTaskLevel)" :style="{'background-color': btnColor, 'color': 'white'}" icon="el-icon-plus" size="small" class="tl-bar-item-btn"></el-button>
                </el-tooltip>
              </el-button-group>
            </div>
          </el-col>
        </el-row>
<!------- 2. End of Search Bar -->
<!------- 3. Filter Criteria -->
        <el-row>
          <el-col :span="24">
            <el-form :inline="true" :model="formFilter" class="tl-form-filter" size="small" label-width="85px" label-position="left">
              <el-form-item label="Task Level">
                <el-radio-group v-model="formFilter.filterTaskLevel" @change="formFilter.filterShowRefPool = false; filterTask()" size="small">
                  <el-radio-button label="1"></el-radio-button>
                  <el-radio-button label="2"></el-radio-button>
                  <el-radio-button label="3"></el-radio-button>
                  <el-radio-button label="4"></el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Assign To">
                <el-select v-model="formFilter.filterAssignTo" size="small" style="width:100%">
                  <el-option label="" value=""></el-option>
                  <el-option v-for="(activeUser, index) in activeUserListForAll" :key="index" :label="activeUser.user_eid" :value="activeUser.user_id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Status">
                <el-select v-model="formFilter.filterStatus" size="small" style="width:auto">
                  <el-option label="" value=""></el-option>
                  <el-option label="Drafting" value="Drafting"></el-option>
                  <el-option label="Planning" value="Planning"></el-option>
                  <el-option label="Running" value="Running"></el-option>
                  <el-option label="Done" value="Done"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Issue Date">
                <el-date-picker v-model="formFilter.filterIssueDateRange" type="daterange"
                  start-placeholder="Start Date" end-placeholder="End Date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="small" style="width:auto">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="formFilter.filterShowRefPool" v-if="formFilter.filterTaskLevel == 3">Show Reference Pool</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="filterTask">Filter</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-divider></el-divider>
<!------- 3. End of Filter Criteria -->
<!------- 4. Task List -->
        <el-row class="tl-main">
          <el-col :span="24">
            <el-table v-loading="taskslistLoading" :data="taskslistData" class="tl-main-table" fit empty-text="No Data">
              <el-table-column prop="task_id" label="Id" v-if="false" key="1"></el-table-column>
              <el-table-column prop="task_parent_name" label="Parent Task" width="150px" v-if="!taskListRule.showColForLv1" key="2">
                <template slot-scope="scope">
                   <el-button type="text">{{scope.row.task_parent_name}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="task_name" label="Number" width="150px" key="3">
                <template slot-scope="scope">
                   <el-button type="text" @click="openTaskById(scope.row.task_id)">{{scope.row.task_name}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="task_top_opp_name" label="Opportunity Name" show-overflow-tooltip align="left" min-width="250px" v-if="taskListRule.showColForLv1" key="4"></el-table-column>
              <el-table-column prop="task_top_customer" label="Customer" show-overflow-tooltip align="center" min-width="150px" v-if="taskListRule.showColForLv1" key="5"></el-table-column>
              <el-table-column prop="task_top_type_of_work" label="Type Of Work" show-overflow-tooltip align="center" width="180px" v-if="taskListRule.showColForLv1" key="6"></el-table-column>
              <el-table-column prop="task_top_team_sizing" label="Team Sizing" show-overflow-tooltip align="center" width="180px" v-if="taskListRule.showColForLv1" key="7"></el-table-column>
              <el-table-column prop="task_top_resp_leader" label="Proposed Leading By" show-overflow-tooltip align="center" width="180px" v-if="taskListRule.showColForLv1" key="8"></el-table-column>
              <el-table-column prop="task_top_target_start" label="Target Start Time" show-overflow-tooltip align="center" width="150px" v-if="taskListRule.showColForLv1" key="9"></el-table-column>
              <el-table-column prop="task_desc" label="Description" show-overflow-tooltip align="left" min-width="250px" v-if="!taskListRule.showColForLv1" key="11"></el-table-column>
              <el-table-column prop="task_status" label="Status" align="center" width="235px" v-if="!taskListRule.showColForLv1" key="12"></el-table-column>
              <el-table-column prop="task_scope" label="Scope(Baseline)" show-overflow-tooltip align="left" width="150px" v-if="taskListRule.showColForLv2" key="13"></el-table-column>
              <el-table-column prop="task_reference" label="Ref Pool" width="150px" v-if="taskListRule.showColForLv3&&taskListRule.showColRef" key="14">
                <template slot-scope="scope">
                   <el-button type="text">{{scope.row.task_reference}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="task_effort" label="Effort(hrs)" width="125px" v-if="!taskListRule.showColForLv1" key="15"></el-table-column>
              <el-table-column prop="task_estimation" label="Estimation(hrs)" align="center" width="135px" v-if="!taskListRule.showColForLv1" key="16"></el-table-column>
              <el-table-column prop="task_assignee" label="Executor/Assignee" align="center" width="180px" v-if="!taskListRule.showColForLv1" key="17"></el-table-column>
              <el-table-column prop="task_issue_date" label="Issue Date" align="center" width="180px" v-if="!taskListRule.showColForLv1" key="18"></el-table-column>
              <el-table-column prop="task_target_complete" label="Target Completion Date" align="center" width="190px" v-if="!taskListRule.showColForLv1" key="19"></el-table-column>
              <el-table-column fixed="right" label="Edit" align="center" width="120">
                <template slot-scope="scope">
                  <el-button @click="openTaskById(scope.row.task_id)" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" size="small" icon="el-icon-edit"></el-button>
                  <el-button :style="{'border': 'none', 'color': 'white'}" type="danger" size="small" icon="el-icon-delete"></el-button>
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
              :page-sizes="[20, 50, 100, 500]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tasksTotalSize">
            </el-pagination>
          </el-col>
        </el-row>
<!------- 4. End of Task List -->
      </el-main>
    </el-container>
<!------- 5. Level 1 Task Details Dialog -->
    <el-dialog :before-close="closeLv1TaskDialog" :title="taskLv1DialogTitle" :visible.sync="taskLv1DialogVisible" width="55%" style="min-width: 600px;" :close-on-click-modal="false" class="tl-taskform abow_dialog">
      <el-form ref="form" :model="taskLv1Form" label-width="143px" label-position="left" class="tl-edit-form" :rules="taskLv1FormRules">
        <el-tabs v-model="activeTabForLv1" type="card" ref="taskLv1Tabs">
          <el-tab-pane label="Basic Information" name="tab_first">
            <el-row>
              <el-col :span="12">
                <el-form-item label="Number" prop="task_name">
                  <span v-if="!lv1TaskItemRule.showTaskNameInput">{{taskLv1Form.task_name}}</span>
                  <el-input v-if="lv1TaskItemRule.showTaskNameInput" v-model="taskLv1Form.task_name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Task Type" prop="task_type_id">
                  <el-select :disabled="lv1TaskItemRule.disableTaskType" v-model="taskLv1Form.task_type_id" style="width: 100%">
                    <el-option v-for="(tasktype, index) in taskTypeArrayForLv1Task" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Opportunity Name" prop="task_top_opp_name">
              <el-input class="span-format-text" v-model="taskLv1Form.task_top_opp_name"></el-input>
            </el-form-item>
            <el-form-item label="BusinessValue">
              <el-input type="textarea" v-model="taskLv1Form.task_top_business_value" :rows="4"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Customer" prop="task_top_customer">
                  <el-input v-model="taskLv1Form.task_top_customer"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Facing Client">
                  <el-input v-model="taskLv1Form.task_top_facing_client"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Type Of Work">
                  <el-input v-model="taskLv1Form.task_top_type_of_work"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Chance of Winning">
                  <el-input v-model="taskLv1Form.task_top_chance_winning"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Paint Points">
                  <el-input v-model="taskLv1Form.task_top_paint_points"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Constraint">
                  <el-input v-model="taskLv1Form.task_top_constraint"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="SOW Confirmation">
                  <el-date-picker v-model="taskLv1Form.task_top_sow_confirmation" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Team Sizing">
                  <el-input v-model="taskLv1Form.task_top_team_sizing"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Skills / Specialization">
                  <el-input v-model="taskLv1Form.task_top_skill"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Opps > Project">
                  <el-input v-model="taskLv1Form.task_top_opps_project"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- End of basic information -->
          <el-tab-pane label="Status Tracing" name="tab_second">
            <el-row>
              <el-col :span="12">
                <el-form-item label="Status">
                  <el-select v-model="taskLv1Form.task_status" style="width: 100%">
                    <el-option label="Drafting" value="Drafting"></el-option>
                    <el-option label="Planning" value="Planning"></el-option>
                    <el-option label="Running" value="Running"></el-option>
                    <el-option label="Done" value="Done"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
               <el-col :span="11" :offset="1">
                <el-form-item label="Issue Date">
                  <el-col :span="24">
                    <el-date-picker v-model="taskLv1Form.task_issue_date" type="datetime" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Target Start">
                  <el-date-picker v-model="taskLv1Form.task_top_target_start" type="month" style="width: 100%" placeholder="Select Month..." value-format="yyyy-MM"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Target End">
                  <el-date-picker v-model="taskLv1Form.task_top_target_end" type="month" style="width: 100%" placeholder="Select Month..." value-format="yyyy-MM"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Responsible Leader">
                  <el-select v-model="taskLv1Form.task_responsible_leader" style="width: 100%">
                    <el-option v-for="(activeUser, index) in activeUserListForLv1RespLeader" :key="index" :label="activeUser.user_eid" :value="activeUser.user_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- End of status tracing -->
          <el-tab-pane label="Sub-Tasks List" name="tab_third">
            <el-row>
              <el-col :span="24">
                <el-button type="primary" size="medium" style="width:100%" icon="el-icon-plus">Create Sub-Task</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-card class="box-card tl-box-card-subtask" :body-style="{padding: '0px'}" style="margin-top:4px" shadow="never">
                  <el-table :data="taskLv1FormSubTasks" fit max-height="500" class="sub-task-table">
                    <el-table-column prop="task_id" v-if="false"></el-table-column>
                    <el-table-column show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-row style="cursor: pointer;" :gutter="10">
                          <el-col :span="23" class="single-line">
                            <span style="font-weight:bold">{{scope.row.task_name}}</span>
                            <span style="margin-left:5px"> {{scope.row.task_desc}}</span>
                          </el-col>
                          <el-col :span="1"><i class="el-icon-arrow-right"></i></el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- End of sub task list -->
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveLv1Task" :disabled="taskLv1SaveBtnDisabled" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="medium">Save</el-button>
      </span>
    </el-dialog>
<!------- 5. End of Level 1 Task Details Dialog -->
<!------- 6. Level 2 Task Details Dialog -->
    <el-dialog :title="taskLv2DialogTitle" :visible.sync="taskLv2DialogVisible" width="55%" style="min-width: 500px;" :close-on-click-modal="false" class="tl-taskform">
      <el-form ref="form" :model="taskLv2Form" label-width="137px" label-position="left" class="tl-edit-form">
        <el-tabs v-model="activeTabForLv2" type="card" ref="formTabs">
          <el-tab-pane label="Basic Information" name="tab_first">
            <el-row>
              <el-col :span="24">
                <el-form-item label="Parent Task">
                  <el-col :span="5">
                    <el-autocomplete placeholder="Search Parent Task..." :trigger-on-focus="false" popper-class="task-autocomplete" :clearable="true" style="width: 100%"
                      v-model="taskLv2Form.task_parent_name" :fetch-suggestions="queryTaskAsyncForReference" @select="handleTaskSelect" @clear="clearTaskSelect">
                      <template slot-scope="{ item }">
                        <div class="form_list_task_name">{{ item.value }}</div>
                        <span class="form_list_task_desc">{{ item.description }}</span>
                      </template>
                    </el-autocomplete>
                  </el-col>
                  <el-col :span="19">
                    <el-tooltip class="item" effect="dark" :content="taskLv2Form.task_parent_desc" placement="top-start">
                      <div class="tl-edit-form-div-desc">{{taskLv2Form.task_parent_desc}}</div>
                    </el-tooltip>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Number">
                  <span>{{taskLv2Form.task_name}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Task Type" prop="task_type_id">
                  <el-select v-model="taskLv2Form.task_type_id" style="width: 100%">
                    <el-option v-for="(tasktype, index) in taskTypeArrayForLv2Task" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Scope(Baseline)">
                <el-input v-model="taskLv2Form.task_scope" style="width: 100%"></el-input>
            </el-form-item>
            <el-form-item label="Description">
              <el-input class="span-format-text" type="textarea" v-model="taskLv2Form.task_desc" :rows="4"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- End first tab -->
         <el-tab-pane label="Status Tracing" name="tab_second">
            <el-row>
              <el-col :span="12">
                <el-form-item label="Status">
                  <el-select v-model="taskLv2Form.task_status" style="width: 100%">
                    <el-option label="Drafting" value="Drafting"></el-option>
                    <el-option label="Planning" value="Planning"></el-option>
                    <el-option label="Running" value="Running"></el-option>
                    <el-option label="Done" value="Done"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
               <el-col :span="11" :offset="1">
                <el-form-item label="Issue Date">
                  <el-col :span="24">
                    <el-date-picker v-model="taskLv2Form.task_issue_date" type="datetime" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Target Start">
                  <el-date-picker v-model="taskLv2Form.task_top_target_start" type="month" style="width: 100%" placeholder="Select Month..." value-format="yyyy-MM"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Target End">
                  <el-date-picker v-model="taskLv2Form.task_top_target_end" type="month" style="width: 100%" placeholder="Select Month..." value-format="yyyy-MM"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Responsible Leader">
                  <el-select v-model="taskLv2Form.task_responsible_leader" style="width: 100%">
                    <el-option v-for="(activeUser, index) in activeUserListForOthRespLeader" :key="index" :label="activeUser.user_eid" :value="activeUser.user_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Assignee">
                  <el-select v-model="taskLv2Form.task_assignee" style="width: 100%">
                    <el-option v-for="(activeUser, index) in activeUserListForAll" :key="index" :label="activeUser.user_eid" :value="activeUser.user_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Effort">
                  <el-col :span="21">
                    <el-input v-model="taskLv2Form.task_effort" disabled></el-input>
                  </el-col>
                  <el-col :span="3">
                    <span class="span-format">hrs</span>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Estimation">
                  <el-col :span="21">
                    <el-input @keyup.native="numberEst" v-model="taskLv2Form.task_estimation"></el-input>
                  </el-col>
                  <el-col :span="3">
                    <span class="span-format">hrs</span>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Sub-Tasks Est">
                  <el-col :span="21">
                    <el-input v-model="taskLv2Form.task_subtasks_estimation" disabled></el-input>
                  </el-col>
                  <el-col :span="3">
                    <span class="span-format">hrs</span>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Progress">
              <el-progress class="tl-edit-form-progress" :text-inside="true" :stroke-width="24" :percentage="taskLv2Form.task_progress_nosymbol" :status="taskLv2FormProgressStatus"></el-progress>
            </el-form-item>
          </el-tab-pane>
          <!-- Second Tab -->
          <el-tab-pane label="Sub-Tasks List" name="tab_third">
            <el-row>
              <el-col :span="24">
                <el-button type="primary" size="medium" style="width:100%" icon="el-icon-plus">Create Sub-Task</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-card class="box-card tl-box-card-subtask" :body-style="{padding: '0px'}" style="margin-top:4px" shadow="never">
                  <el-table :data="taskLv2FormSubTasks" fit max-height="500" class="sub-task-table">
                    <el-table-column prop="task_id" v-if="false"></el-table-column>
                    <el-table-column show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-row style="cursor: pointer;" :gutter="10">
                          <el-col :span="23" class="single-line">
                            <span style="font-weight:bold">{{scope.row.task_name}}</span>
                            <span style="margin-left:5px"> {{scope.row.task_desc}}</span>
                          </el-col>
                          <el-col :span="1"><i class="el-icon-arrow-right"></i></el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Worklogs List" name="form_third">
            <el-card class="box-card tl-history-box-card">
              <el-timeline>
                <el-timeline-item v-for="(history, index) in taskLv2FormHistories" :key="index" :timestamp="history.timestamp"
                  icon="el-icon-star-on" size="large" placement="top" type="primary" class="tl-history">
                  {{history.content}}
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" size="medium">Log Work Done</el-button>
        <el-button :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="medium">Save</el-button>
      </span>
    </el-dialog>
<!------- 6. End Level 2 Task Details Dialog -->
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
export default {
  name: 'TaskListNew',
  data () {
    return {
      // Header/Theme Value
      header1: 'Task List New',
      isActive: true,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
      // Task List Value
      searchVal: '',
      formFilter: {
        filterTaskLevel: 1,
        filterAssignTo: '',
        filterStatus: '',
        filterIssueDateRange: [],
        filterShowRefPool: false
      },
      currentPage: 1,
      pageSize: 20,
      tasksTotalSize: 0,
      taskslistData: [],
      taskslistLoading: false,
      // Level 1 Task Dialog Value
      taskLv1DialogVisible: false,
      taskLv1DialogTitle: '1 - Business Opportunity',
      activeTabForLv1: 'tab_first',
      taskLv1Form: {},
      taskLv1FormSubTasks: [],
      taskLv1SaveBtnDisabled: false,
      // Level 2 Task Dialog Value
      taskLv2DialogVisible: true,
      taskLv2DialogTitle: '1 - Business Opportunity',
      activeTabForLv2: 'tab_first',
      taskLv2Form: {},
      taskLv2FormProgressStatus: 'success',
      taskLv2FormSubTasks: [],
      taskLv2FormHistories: [],
      taskLv2SaveBtnDisabled: false,
      // Rules
      taskListRule: {
        showColForLv1: false,
        showColForLv2: false,
        showColForLv3: false,
        showColForPool: false
      },
      lv1TaskItemRule: {
        showTaskNameInput: true,
        disableTaskType: false
      },
      taskLv1FormRules: {
        task_name: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_type_id: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_top_opp_name: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_top_customer: [{required: true, message: 'Could not be empty', trigger: 'blur'}]
      },
      // Common Value
      // User List
      activeUserListForAll: [],
      activeUserListForOthRespLeader: [],
      activeUserListForLv1RespLeader: [],
      // Type List
      taskTypeArrayForAll: [],
      taskTypeArrayForLv1Task: [],
      taskTypeArrayForLv2Task: [],
      // User Verification Value
      userLevel: this.$store.getters.getUserLevel,
      userEmployeeNumber: this.$store.getters.getUserEmployeeNumber,
      userRole: this.$store.getters.getUserRole
    }
  },
  methods: {
    // 1. Task List Function (Filter Critera/Search Task/Get Task List)
    filterTask () {
      this.getTaskList(1, 20)
    },
    async searchTask () {
      this.getTaskList(1, 20)
    },
    async getTaskList (iPage, iSize) {
      this.$data.taskslistLoading = true
      this.$data.taskslistData = []
      this.$data.pageSize = iSize
      this.$data.currentPage = iPage
      var reqTaskLevel = Number(this.$data.formFilter.filterTaskLevel)
      this.ruleShowListColumn(reqTaskLevel)
      var sizeCriteria = {
        reqTaskLevel: reqTaskLevel,
        reqTaskKeyword: this.$data.searchVal,
        reqFilterAssignee: this.$data.formFilter.filterAssignTo,
        reqFilterStatus: this.$data.formFilter.filterStatus,
        reqFilterIssueDateStart: this.$data.formFilter.filterIssueDateRange !== null ? this.$data.formFilter.filterIssueDateRange[0] : null,
        reqFilterIssueDateEnd: this.$data.formFilter.filterIssueDateRange !== null ? this.$data.formFilter.filterIssueDateRange[1] : null,
        reqFilterShowRefPool: this.$data.formFilter.filterShowRefPool
      }
      var listCriteria = {
        reqPage: iPage,
        reqSize: iSize,
        reqTaskLevel: reqTaskLevel,
        reqTaskKeyword: this.$data.searchVal,
        reqFilterAssignee: this.$data.formFilter.filterAssignTo,
        reqFilterStatus: this.$data.formFilter.filterStatus,
        reqFilterIssueDateStart: this.$data.formFilter.filterIssueDateRange !== null ? this.$data.formFilter.filterIssueDateRange[0] : null,
        reqFilterIssueDateEnd: this.$data.formFilter.filterIssueDateRange !== null ? this.$data.formFilter.filterIssueDateRange[1] : null,
        reqFilterShowRefPool: this.$data.formFilter.filterShowRefPool
      }
      const res1 = await http.get('/tasksNew/getTaskListTotalSize', sizeCriteria)
      if (res1.data.status === 0) {
        this.$data.tasksTotalSize = res1.data.data.task_list_total_size
        const res2 = await http.get('/tasksNew/getTaskList', listCriteria)
        if (res2.data.status === 0) {
          this.$data.taskslistData = res2.data.data
        } else {
          this.$data.taskslistData = []
        }
      } else {
        this.$data.tasksTotalSize = 0
      }
      this.$data.taskslistLoading = false
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
    ruleShowListColumn (iTaskLevel) {
      if (iTaskLevel === 1) {
        this.$data.taskListRule.showColForLv1 = true
        this.$data.taskListRule.showColForLv2 = false
        this.$data.taskListRule.showColForLv3 = false
        this.$data.taskListRule.showColRef = false
      } else if (iTaskLevel === 2) {
        this.$data.taskListRule.showColForLv1 = false
        this.$data.taskListRule.showColForLv2 = true
        this.$data.taskListRule.showColForLv3 = false
        this.$data.taskListRule.showColRef = false
      } else if (iTaskLevel === 3) {
        this.$data.taskListRule.showColForLv1 = false
        this.$data.taskListRule.showColForLv2 = false
        this.$data.taskListRule.showColForLv3 = true
        if (this.$data.formFilter.filterShowRefPool) {
          this.$data.taskListRule.showColRef = false
        } else {
          this.$data.taskListRule.showColRef = true
        }
      } else {
        this.$data.taskListRule.showColForLv1 = false
        this.$data.taskListRule.showColForLv2 = false
        this.$data.taskListRule.showColForLv3 = false
        this.$data.taskListRule.showColRef = false
      }
    },
    // 2. Task info
    async openTaskById (iTaskId) {
      var reqTaskId = iTaskId
      const res = await http.post('/tasksNew/getTaskById', {
        reqTaskId: reqTaskId
      })
      if (res.data.status === 0) {
        var rtnTask = res.data.data
        if (rtnTask.task_level === 1) {
          // Clear existing data
          this.getActiveUserList()
          this.getTaskType(null)
          this.$data.taskLv1Form = {}
          // Set Dialog Default Value
          this.$data.taskLv1DialogTitle = '1 - Business Opportunity'
          this.$data.activeTabForLv1 = 'tab_first'
          this.ruleControlLv1TaskItem('Edit')
          // Load return data
          this.$data.taskLv1Form = res.data.data
          this.getSubTaskList(rtnTask.task_name, 'taskLv1FormSubTasks')
          this.$data.taskLv1DialogVisible = true
        }
      }
    },
    async getSubTaskList (iTaskName, iSubTaskListItem) {
      const res = await http.post('/tasksNew/getSubTaskByTaskName', {
        reqTaskName: iTaskName
      })
      if (res.data.status === 0) {
        this[iSubTaskListItem] = []
        this[iSubTaskListItem] = res.data.data
      } else {
        this[iSubTaskListItem] = []
      }
    },
    async createNewTask (iTaskLevel) {
      console.log('Create new task: ' + iTaskLevel)
      if (Number(iTaskLevel) === 1) {
        this.$data.taskLv1Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskType(null)
        this.$data.taskLv1DialogTitle = '1 - New Business Opportunity'
        this.$data.activeTabForLv1 = 'tab_first'
        // Set data default value
        this.$data.taskLv1Form.task_parent_name = 'N/A'
        this.$data.taskLv1Form.task_status = 'Drafting'
        this.$data.taskLv1Form.task_issue_date = new Date()
        this.$data.taskLv1Form.task_level = 1
        this.$data.taskLv1Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        // Show or hide column
        this.ruleControlLv1TaskItem('Create')
        this.$data.taskLv1DialogVisible = true
      }
    },
    // 3. Level 1 task dialog
    async saveLv1Task () {
      if (this.$data.userLevel > 8 && this.$data.userRole !== 'Admin') {
        this.$message.error('No right to create Level 1 task!')
        return
      }
      var reqTask = this.$data.taskLv1Form
      if (reqTask != null) {
        if (reqTask.task_name === undefined || reqTask.task_name === null || reqTask.task_name === '') {
          this.$message.error('Task number could not be empty!')
          return
        }
        console.log(reqTask.task_type_id)
        if (reqTask.task_type_id === undefined || reqTask.task_type_id === null || reqTask.task_type_id === '') {
          this.$message.error('Task type could not be empty!')
          return
        }
        if (reqTask.task_top_opp_name === undefined || reqTask.task_top_opp_name === null || reqTask.task_top_opp_name === '') {
          this.$message.error('Opportunity Name could not be empty!')
          return
        }
        if (reqTask.task_top_customer === undefined || reqTask.task_top_customer === null || reqTask.task_top_customer === '') {
          this.$message.error('Customer could not be empty!')
          return
        }
        if (reqTask.task_top_target_start !== undefined && reqTask.task_top_target_end !== undefined) {
          if (reqTask.task_top_target_end < reqTask.task_top_target_start) {
            this.$message.error('Target end month could not smaller than target start month!')
            return
          }
        }
        this.$data.taskLv1SaveBtnDisabled = true
        const res = await http.post('/tasksNew/saveTask', {
          reqTask: JSON.stringify(reqTask)
        })
        if (res.data.status === 0) {
          this.$message({message: 'Task created successfully!', type: 'success'})
        } else {
          this.$message({message: 'Task updated successfully!', type: 'success'})
        }
        this.$data.taskLv1SaveBtnDisabled = false
        this.openTaskById(res.data.data.Id)
      }
    },
    ruleControlLv1TaskItem (iAction) {
      if (iAction === 'Edit') {
        this.$data.lv1TaskItemRule.showTaskNameInput = false
        this.$data.lv1TaskItemRule.disableTaskType = true
        this.$nextTick(() => {
          this.$refs.taskLv1Tabs.$children[0].$refs.tabs[2].style.display = ''
        })
      }
      if (iAction === 'Create') {
        this.$data.lv1TaskItemRule.showTaskNameInput = true
        this.$data.lv1TaskItemRule.disableTaskType = false
        this.$nextTick(() => {
          if (this.$refs.taskLv1Tabs !== undefined) {
            this.$refs.taskLv1Tabs.$children[0].$refs.tabs[2].style.display = 'none'
          }
        })
      }
    },
    closeLv1TaskDialog (done) {
      console.log('Close lv 1 dialog')
      this.$data.taskLv1DialogVisible = false
      this.$data.taskLv1Form = {}
      this.$data.iSubTaskListItem = []
      this.$data.taskLv1DialogTitle = '1 - Business Opportunity'
      this.$data.activeTabForLv1 = 'tab_first'
      this.getTaskList(1, 20)
      done()
    },
    // Common Function
    async getActiveUserList () {
      const res = await http.get('/users/getUserList', {
        IsActive: 1
      })
      if (res.data.status === 0) {
        this.$data.activeUserListForAll = []
        this.$data.activeUserListForAll = res.data.data
        var userList = res.data.data
        this.$data.activeUserListForOthRespLeader = []
        for (var i = 0; i < userList.length; i++) {
          if (userList[i].user_level > 0 && userList[i].user_level <= 10) {
            this.$data.activeUserListForOthRespLeader.push(userList[i])
          }
        }
        this.$data.activeUserListForLv1RespLeader = []
        for (var a = 0; a < userList.length; a++) {
          if (userList[a].user_level > 0 && userList[a].user_level <= 9) {
            this.$data.activeUserListForLv1RespLeader.push(userList[a])
          }
        }
      }
    },
    async getTaskType (iParentType) {
      const res = await http.get('/tasks/getAllTaskType')
      if (res.data.status === 0) {
        this.$data.taskTypeArrayForAll = []
        this.$data.taskTypeArrayForAll = res.data.data
        var taskTypeList = res.data.data
        this.$data.taskTypeArrayForLv1Task = []
        for (var i = 0; i < taskTypeList.length; i++) {
          if (taskTypeList[i].type_prefix !== '' && taskTypeList[i].type_prefix !== null) {
            if (taskTypeList[i].type_parent === '' || taskTypeList[i].type_parent === null) {
              this.$data.taskTypeArrayForLv1Task.push(taskTypeList[i])
            }
          }
        } // End of generate Lv 1 task type
        if (iParentType !== null) {
          this.$data.taskTypeArrayForLv2Task = []
          for (var a = 0; a < taskTypeList.length; a++) {
            if (taskTypeList[a].type_prefix !== '' && taskTypeList[a].type_prefix !== null) {
              if (taskTypeList[a].type_parent !== '' && taskTypeList[a].type_parent !== null) {
                if (taskTypeList[a].type_parent === iParentType) {
                  this.$data.taskTypeArrayForLv2Task.push(taskTypeList[a])
                }
              }
            }
          }
        }
      }
    },
    async queryTaskAsyncForReference (queryString, cb) {
      console.log('Query String: ' + queryString)
    },
    handleTaskSelect (item) {
      console.log(item.value)
    },
    clearTaskSelect () {
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
    }
  },
  created () {
    this.$data.pageSize = 20
    this.$data.currentPage = 1
    this.getTaskList(1, 20)
    this.getActiveUserList()
    this.getTaskType(null)
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
  border: 1px solid white;
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
.tl-edit-form-div {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.tl-edit-form-div-desc {
  font-size: 15px;
  margin-left: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.tl-form-filter {
  padding-left: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/* Task Group Style */
.tl-task-group {
  height:50%;
  display: flex;
  flex-direction: column;
}
.tl-task-group-card {
  height: auto;
  margin-bottom: 10px;
  border: 2px solid #E4E7ED;
}
.tl-task-group-card-body {
  height: auto;
  display: flex;
  flex-direction: row;
}
.tl-remove-task {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 17px;
}
.tl-plan-task-container {
  width: 100%;
  height: auto;
}
.tl-plan-task-header {
  width: 100%;
  height: auto;
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
::-webkit-input-placeholder { /* WebKit browsers */
  color: red;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: red;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: red;
}
:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: red;
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
.span-format-text .el-textarea__inner{
 font-family: "Microsoft" !important;
 font-size: 20px !important;
 font-weight: bold !important;
}
.span-format-text .el-input__inner{
 font-family: "Microsoft" !important;
 font-size: 20px !important;
 font-weight: bold !important;
}
.el-popover__title{
  text-align: center;
}
.tl-form-filter .el-form-item {
  margin-right: 20px;
  margin-top: 15px;
  margin-bottom: 10px;
}
.el-drawer.ltr {
  overflow-x: hidden;
  overflow-y: auto;
}
.el-drawer__header {
  margin-bottom: 0px;
}
.tl-task-group-card .el-card__header {
  padding: 10px;
}
.tl-task-group-card .el-card__body {
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
}
.tl-task-group-container {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}
.el-form-item__error {
  display: none;
}
.validate-input .el-input__inner::-webkit-input-placeholder {
  font-weight: normal;
  font-size: 13px;
  color: red;
}
.validate-input .el-textarea__inner::-webkit-input-placeholder {
  font-weight: normal;
  font-size: 13px;
  color: red;
}
.el-table__expanded-cell {
  padding: 10px 10px !important;
}
.tl-plan-task-header .el-card__body {
  padding: 10px 10px;
}
</style>
