<template>
  <div class="tl-body">
    <el-container>
      <el-main>
<!------- 1. Header -->
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-tickets content-title-item-icon"></i>
              <span class="content-title-item-header">{{selectedLv1TaskName}} {{selectedLv1TaskDesc}}</span>
            </div>
          </el-col>
        </el-row>
<!------- 1. End of Header -->
<!------- 2. Task/Group Info Bar -->
        <el-row class="tl-bar">
          <el-col :span="10">
            <div class="tl-bar-item">
              <el-form :inline="true" :model="formFilter" class="tl-form-filter" size="small" label-width="85px" label-position="left">
                <el-form-item label="Assign To">
                  <el-select v-model="formFilter.filterAssignTo" filterable size="small" style="width:100%">
                    <el-option label="" value=""></el-option>
                    <el-option
                      v-for="(activeUser, index) in activeUserListForAll"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
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
                <el-form-item>
                  <el-button type="primary" size="mini" @click="filterTask">Filter</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="tl-bar-item" style="font-size: 20px">Group:</div>
          </el-col>
          <el-col :span="12">
            <div class="tl-bar-item">
              <el-button @click="openTaskGroupDrawer" style="width:auto;font-size:22px" type="text">{{currentTaskGroup}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-divider></el-divider>
<!------- 2. End of Task/Group Info Bar -->
<!------- 3. Task List -->
        <el-row class="tp-main">
          <el-col :span="24">
            <el-collapse v-model="activeTabArray" @change="handleTabChange" v-loading="lv2TaskListLoading">
              <el-collapse-item :name="index" v-for="(task, index) in lv2TaskList" :key="index" @click.native="openTaskTab(task.task_name, index, 1, 20)" class="tp-main-task-list">
                <template slot="title">
                  <div class="tp-main-title">
                    <el-row>
                      <el-col :span="2" class="tp-main-content-item">
                        <el-button @click.stop="openTaskById(task.task_id)" type="text" size="small" style="font-size:16px">{{task.task_name}}</el-button>
                      </el-col>
                      <el-col :span="1" class="tp-main-content-item">{{task.task_status}}</el-col>
                      <el-tooltip class="item" effect="dark" :content="task.task_desc" placement="top-start">
                        <el-col :span="8" class="tp-main-content-item">{{task.task_desc}}</el-col>
                      </el-tooltip>
                      <el-col :span="2" class="tp-main-content-item">Effort: {{task.task_effort}}</el-col>
                      <el-col :span="2" class="tp-main-content-item">Est: {{task.task_estimation}}</el-col>
                      <el-col :span="3" class="tp-main-content-item">Sub-Tasks Est: {{task.task_subtasks_estimation}}</el-col>
                      <el-col :span="4" class="tp-main-content-item">Responsible: {{task.task_responsible_leader}}</el-col>
                      <el-col :span="1" class="tp-main-content-item"><el-button @click.stop="createTaskInPlanMode(3, task)" type="success" size="mini" icon="el-icon-plus"></el-button></el-col>
                      <el-col :span="1" class="tp-main-content-item"><el-button @click.stop="refreshLv2Task(task.task_id, task.task_name, index)" type="info" size="mini" icon="el-icon-refresh"></el-button></el-col>
                    </el-row>
                  </div>
                </template>
                <div class="tp-main-content" @click.stop="preventParentEventTrigger">
                  <el-row>
                    <el-col :span="24">
                      <el-table v-loading="task.task_plan_tasks_loading" :data="task.task_plan_tasks_list" :row-class-name="getSubTaskRowClassName" size="small" class="tp-main-table tp-table-border" fit empty-text="No Data">
                        <el-table-column type="expand">
                          <template slot-scope="props">
                            <el-row>
                              <el-col :span="23" :offset="1">
                                <el-table :data="props.row.task_sub_tasks" size="small" style="width: 100%;" class="sub-task-table tl-plan-task-sub-task-table">
                                  <el-table-column label="Id" prop="sub_task_id" v-if="false" key="1"></el-table-column>
                                  <el-table-column label="Number" prop="sub_task_name" align="left" width="150" key="2">
                                    <template slot-scope="scope">
                                      <el-button @click.stop="openTaskById(scope.row.sub_task_id)" type="text" class="sub-tasks-name-btn" size="small">{{scope.row.sub_task_name}}</el-button>
                                    </template>
                                  </el-table-column>
                                  <el-table-column label="Status" prop="sub_task_status" align="center" width="100"></el-table-column>
                                  <el-table-column label="Description" prop="sub_task_desc" align="left" show-overflow-tooltip></el-table-column>
                                  <el-table-column label="Effort" prop="sub_task_effort" align="center" width="100px"></el-table-column>
                                  <el-table-column label="Est" prop="sub_task_estimation" align="center" width="100px"></el-table-column>
                                  <el-table-column label="Sub-Tasks Est" prop="sub_task_none_estimation" align="center" width="130px"></el-table-column>
                                  <el-table-column label="Assignee" prop="sub_task_assignee" align="center" width="180px"></el-table-column>
                                  <el-table-column fixed="right" align="center" width="110">
                                    <template slot-scope="scope">
                                      <el-button @click.stop="removeTask(scope.row.sub_task_id, scope.row.sub_task_name, scope.row)" :style="{'border': 'none', 'color': 'white'}" type="danger" size="mini" icon="el-icon-delete"></el-button>
                                    </template>
                                  </el-table-column>
                                </el-table>
                              </el-col>
                            </el-row>
                          </template>
                        </el-table-column>
                        <el-table-column prop="task_id" label="Id" v-if="false" key="1"></el-table-column>
                        <el-table-column prop="task_name" label="Number" width="150px" key="2">
                          <template slot-scope="scope">
                            <el-button type="text" @click.stop="openTaskById(scope.row.task_id)">{{scope.row.task_name}}</el-button>
                          </template>
                        </el-table-column>
                        <el-table-column prop="task_status" label="Status" align="center" width="120px" key="4"></el-table-column>
                        <el-table-column prop="TiTle" label="Description" show-overflow-tooltip align="left" min-width="250px" key="3"></el-table-column>
                        <el-table-column prop="task_reference" label="Ref Pool" width="150px" key="5">
                          <template slot-scope="scope">
                            <el-button type="text" @click.stop="openTaskByName(scope.row.task_reference)">{{scope.row.task_reference}}</el-button>
                          </template>
                        </el-table-column>
                        <el-table-column prop="task_group" label="Time Group" align="center" min-width="180px" key="6">
                          <template slot-scope="scope">
                            <el-select @change="((val)=>{changeTaskGroup(val, scope.row.task_id, task.task_name, index)})" v-model="scope.row.task_group_id" style="width: 100%" size="small">
                              <el-option label=" " value="0"></el-option>
                              <el-option v-for="(group, index) in taskGroups" :key="index" :label="group.group_name" :value="group.group_id"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="task_effort" label="Effort" align="center" width="100px" key="7"></el-table-column>
                        <el-table-column prop="task_estimation" label="Est" align="center" width="100px" key="8"></el-table-column>
                        <el-table-column prop="task_subtasks_estimation" label="Sub-Tasks Est" align="center" width="130px" key="9"></el-table-column>
                        <el-table-column prop="task_assignee" label="Assignee" align="center" width="180px" key="10"></el-table-column>
                        <el-table-column fixed="right" label="Edit" align="center" width="120">
                          <template slot-scope="scope">
                            <el-button @click.stop="createTaskInPlanMode(4, scope.row)" :style="{'border': 'none', 'color': 'white'}" type="success" size="small" icon="el-icon-plus"></el-button>
                            <el-button @click.stop="removeTask(scope.row.task_id, scope.row.task_name, scope.row)" :style="{'border': 'none', 'color': 'white'}" type="danger" size="small" icon="el-icon-delete"></el-button>
                            </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                  <div @click.stop="preventParentEventTrigger">
                    <el-row class="tl-pagination">
                      <el-col :span="24" class="tl-pagination-col">
                        <el-pagination
                          background
                          @size-change="((size)=>{handleSizeChange(size, task.task_name, index)})"
                          @current-change="((page)=>{handleCurrentChange(page, task.task_name, index)})"
                          :current-page="task.task_page_number"
                          :page-sizes="[20, 50, 100, 500]"
                          :page-size="task.task_page_size"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="task.task_total_size">
                        </el-pagination>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
<!------- 3. End of Task List -->
      </el-main>
    </el-container>
<!------- 4. Task Group Drawer -->
    <el-drawer title="Task Group" :visible.sync="groupDrawerVisible" :direction="groupDrawerDirection" size="20%">
      <div class="tl-task-group">
        <el-divider></el-divider>
        <el-row :gutter="10" style="margin-bottom: 15px;">
          <el-col :span="8">
            <el-button @click.stop="createNewTaskGroup" type="primary" size="small" style="width: 100%">Add New Group</el-button>
          </el-col>
          <el-col :span="8">
            <el-button @click.stop="selectTaskByUnassign" type="warning" size="small" style="width: 100%">Show Unassign</el-button>
          </el-col>
          <el-col :span="8">
            <el-button @click.stop="selectTaskByAllTaskGroup" type="info" size="small" style="width: 100%">Show All</el-button>
          </el-col>
        </el-row>
        <el-card @click.native="selectTaskByTaskGroupId(taskGroup)" class="box-card tl-task-group-card" shadow="hover" v-for="(taskGroup, index) in taskGroups" :key="index">
          <div slot="header" class="clearfix">
            <el-row :gutter="20">
              <el-col :span="22">
                <div @click.stop="editTaskGroup(taskGroup.group_id)" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;text-decoration:underline;color:#409EFF;cursor:pointer">{{taskGroup.group_name}}</div>
              </el-col>
              <!--<el-col :span="2">
                <el-button @click.stop="selectTaskByNewTaskGroup(taskGroup)" style="float:right; padding:3px 0;" type="text">Plan Task</el-button>
              </el-col>-->
            </el-row>
          </div>
          <span style="font-size: 13px;color: #909399; margin-top: 5px;">Range: &nbsp;{{taskGroup.group_start_time}} ~ {{taskGroup.group_end_time}}</span>
          <span style="font-size: 13px;color: #909399; margin-top: 5px;">Level 3 - [{{taskGroup.group_lv3_task_count}}]</span>
          <span style="font-size: 13px;color: #909399; margin-top: 5px;">Level 4 - [{{taskGroup.group_lv4_task_count}}]</span>
        </el-card>
      </div>
    </el-drawer>
<!------- 4. End Task Group Drawer -->
<!------- 5. Task Group Dialog -->
    <el-dialog title="Time Group" :visible.sync="groupDialogVisible" width="35%" :close-on-click-modal="false" top="15%">
      <el-form :model="taskGroupForm" label-width="100px" class="tl-edit-form">
        <el-form-item label="Group Name" >
          <el-input v-model="taskGroupForm.formGroupName" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="Time Range">
          <el-date-picker v-model="taskGroupForm.formGroupTimeRange" type="daterange"
            start-placeholder="Start Date" end-placeholder="End Date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:100%">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupDialogVisible = false">Cancel</el-button>
        <el-button :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" @click="submitTaskGroup">Submit</el-button>
      </div>
    </el-dialog>
<!------- 5. End Task Group Dialog -->
<!------- 6. Level 2 Task Details Dialog -->
    <el-dialog :before-close="closeLv2TaskDialog" :title="taskLv2DialogTitle" :visible.sync="taskLv2DialogVisible" width="55%" style="min-width: 500px;" :close-on-click-modal="false" class="tl-taskform">
      <el-form ref="form" :model="taskLv2Form" label-width="140px" label-position="left" class="tl-edit-form" :rules="taskLv2FormRules">
        <el-tabs v-model="activeTabForLv2" type="card" ref="taskLv2Tabs" @tab-click="((tab, event)=>{changeTab(tab, event, 'taskLv2Form', 'activeTabForLv2')})">
          <el-tab-pane label="Basic Information" name="tab_basic_info">
            <el-row>
              <el-col :span="24">
                <el-form-item label="Parent Task" prop="task_parent_name">
                  <el-col :span="6">
                    <el-autocomplete :disabled="lv2TaskItemRule.disableParentNameInput" placeholder="Search Parent Task..." :trigger-on-focus="false" popper-class="task-autocomplete" :clearable="true" style="width: 100%" :debounce=0
                      v-model="taskLv2Form.task_parent_name" :fetch-suggestions="queryTaskAsyncForParentTask" @select="((item)=>{handleSelectForParentTask(item, 'taskLv2Form')})" @clear="clearSelectForParentTask('taskLv2Form')">
                      <template slot-scope="{ item }">
                        <div class="form_list_task_name">{{ item.value }}</div>
                        <span class="form_list_task_desc">{{ item.description }}</span>
                      </template>
                    </el-autocomplete>
                  </el-col>
                  <el-col :span="18">
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
                  <el-select :disabled="lv2TaskItemRule.disableTaskType" v-model="taskLv2Form.task_type_id" style="width: 100%">
                    <el-option v-for="(tasktype, index) in taskTypeArrayForLv2Task" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Scope(Baseline)">
                <el-input v-model="taskLv2Form.task_scope" style="width: 100%"></el-input>
            </el-form-item>
            <el-form-item label="Description" prop="task_desc">
              <el-input class="span-format-text" type="textarea" v-model="taskLv2Form.task_desc" :rows="4"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- End first tab -->
         <el-tab-pane label="Status Tracing" name="tab_status_tracing">
            <el-row>
              <el-col :span="12">
                <el-form-item label="Status">
                  <el-select v-model="taskLv2Form.task_status" style="width: 100%">
                    <el-option v-for="(status, index) in statusArray" :key="index" :label="status.status_name" :value="status.status_name"></el-option>
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
                <el-form-item label="Target Complete">
                  <el-date-picker v-model="taskLv2Form.task_target_complete" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Actual Complete">
                  <el-date-picker v-model="taskLv2Form.task_actual_complete" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Responsible Leader">
                  <el-select v-model="taskLv2Form.task_responsible_leader" filterable style="width: 100%">
                    <el-option
                      v-for="(activeUser, index) in activeUserListForOthRespLeader"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1" v-if="false">
                <el-form-item label="Assignee">
                  <el-select v-model="taskLv2Form.task_assignee" filterable style="width: 100%">
                    <el-option
                      v-for="(activeUser, index) in activeUserListForAll"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
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
                    <el-input :disabled="lv2TaskItemRule.disableTaskEst" v-model="taskLv2Form.task_estimation" type="number"></el-input>
                  </el-col>
                  <el-col :span="3">
                    <span class="span-format">hrs</span>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Sub-Tasks Est" v-if="lv2TaskItemRule.showSubTaskEst">
                  <el-col :span="21">
                    <el-input v-model="taskLv2Form.task_subtasks_estimation" disabled></el-input>
                  </el-col>
                  <el-col :span="3">
                    <span class="span-format">hrs</span>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Progress" v-if="lv2TaskItemRule.showProgress">
              <el-progress class="tl-edit-form-progress" :text-inside="true" :stroke-width="24" :percentage="Number(taskLv2Form.task_progress_nosymbol)" :status="taskLv2FormProgressStatus"></el-progress>
            </el-form-item>
          </el-tab-pane>
          <!-- Second Tab -->
          <el-tab-pane label="Sub-Tasks List" name="tab_subtasks_list">
            <el-row>
              <el-col :span="24">
                <el-button @click="createNewSubTask(3, 'taskLv2Form')" size="medium" style="width:100%" icon="el-icon-plus">Create Sub-Task</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-card class="box-card tl-box-card-subtask" :body-style="{padding: '0px'}" style="margin-top:4px" shadow="never">
                  <el-table :data="taskLv2FormSubTasks" fit max-height="500" class="sub-task-table">
                    <el-table-column prop="task_id" v-if="false"></el-table-column>
                    <el-table-column show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-row style="cursor: pointer;" :gutter="10" @click.native="openTaskById(scope.row.task_id)">
                          <el-col :span="24" class="single-line">
                            <span style="font-weight:bold">{{scope.row.task_name}}</span>
                            <span style="margin-left:10px"> {{scope.row.task_desc}}</span>
                          </el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                    <el-table-column prop="task_status" align="left" width="100">
                      <template slot-scope="scope">
                        <el-tag type="info" style="font-weight:bold" v-if="scope.row.task_status == 'Done'">{{scope.row.task_status}}</el-tag>
                        <el-tag type="success" style="font-weight:bold" v-if="scope.row.task_status != 'Done'">{{scope.row.task_status}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="task_assignee" align="left" width="160"></el-table-column>
                    <el-table-column show-overflow-tooltip fixed="right" align="center" width="30">
                      <template slot-scope="scope">
                        <el-row style="cursor: pointer;" @click.native="openTaskById(scope.row.task_id)">
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
        <el-button @click="saveLv2Task" :disabled="taskLv2SaveBtnDisabled" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="medium">Save</el-button>
      </span>
    </el-dialog>
<!------- 6. End Level 2 Task Details Dialog -->
<!------- 7. Level 3 Task Details Dialog -->
    <el-dialog :before-close="closeLv3TaskDialog" :title="taskLv3DialogTitle" :visible.sync="taskLv3DialogVisible" width="55%" style="min-width: 500px;" :close-on-click-modal="false" class="tl-taskform">
      <el-form ref="form" :model="taskLv3Form" label-width="140px" label-position="left" class="tl-edit-form" :rules="taskLv3FormRules">
        <el-tabs v-model="activeTabForLv3" type="card" ref="taskLv3Tabs" @tab-click="((tab, event)=>{changeTab(tab, event, 'taskLv3Form', 'activeTabForLv3')})">
          <el-tab-pane label="Basic Information" name="tab_basic_info">
            <el-row>
              <el-col :span="24">
                <el-form-item label="Parent Task" prop="task_parent_name">
                  <el-col :span="6">
                    <el-autocomplete :disabled="lv3TaskItemRule.disableParentNameInput" placeholder="Search Parent Task..." :trigger-on-focus="false" popper-class="task-autocomplete" :clearable="true" style="width: 100%" :debounce=0
                      v-model="taskLv3Form.task_parent_name" :fetch-suggestions="queryTaskAsyncForParentTask" @select="((item)=>{handleSelectForParentTask(item, 'taskLv3Form')})" @clear="clearSelectForParentTask('taskLv3Form')">
                      <template slot-scope="{ item }">
                        <div class="form_list_task_name">{{ item.value }}</div>
                        <span class="form_list_task_desc">{{ item.description }}</span>
                      </template>
                    </el-autocomplete>
                  </el-col>
                  <el-col :span="18">
                    <el-tooltip class="item" effect="dark" :content="taskLv3Form.task_parent_desc" placement="top-start">
                      <div class="tl-edit-form-div-desc">{{taskLv3Form.task_parent_desc}}</div>
                    </el-tooltip>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Number">
                  <span>{{taskLv3Form.task_name}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Task Type" prop="task_type_id">
                  <el-select disabled v-model="taskLv3Form.task_type_id" style="width: 100%">
                    <el-option v-for="(tasktype, index) in taskTypeArrayForLv2Task" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Type Tag" prop="task_TypeTag">
                  <el-select v-model="taskLv3Form.task_TypeTag" >
                    <el-option
                      v-for="item in typeTagOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>                  
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1" >
                <el-form-item label="Deliverable Tag">
                  <el-select
                    v-model="taskLv3Form.task_deliverableTag"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    style="width: 100%"
                    >
                    <el-option
                      v-for="item in DeliverOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>            
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Ref Pool" v-if="lv3TaskItemRule.showRefPoolInput">
              <el-col :span="6">
                <el-autocomplete placeholder="Search Reference Pool..." :trigger-on-focus="false" popper-class="task-autocomplete" :clearable="true" style="width: 100%" :debounce=0
                  v-model="taskLv3Form.task_reference" :value-key="taskLv3Form.task_reference" :fetch-suggestions="queryTaskAsyncForRefPool" @select="((item)=>{handleSelectForRefPool(item, 'taskLv3Form')})" @clear="clearSelectForRefPool('taskLv3Form')">
                  <template slot-scope="{ item }">
                    <div class="form_list_task_name">{{ item.value }}</div>
                    <span class="form_list_task_desc">{{ item.description }}</span>
                  </template>
                </el-autocomplete>
              </el-col>
              <el-col :span="18">
                <el-tooltip class="item" effect="dark" :content="taskLv3Form.task_reference_desc" placement="top-start">
                  <div class="tl-edit-form-div-desc">{{taskLv3Form.task_reference_desc}}</div>
                </el-tooltip>
              </el-col>
            </el-form-item>
            <el-row>
              <el-col :span="24">
                <el-form-item label="Time Group" v-if="lv3TaskItemRule.showTaskGroup">
                  <el-select v-model="taskLv3Form.task_group_id" @change="selectLv3TaskGroup" style="width: 100%" placeholder="Select Task Group...">
                    <el-option label="" value=""></el-option>
                    <el-option v-for="(taskgroup, index) in taskGroups" :key="index" :label="taskgroup.group_name" :value="taskgroup.group_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Title" prop="task_desc">
              <el-input class="span-format-text" type="text" v-model="taskLv3Form.task_desc" :rows="4"></el-input>
            </el-form-item>            
            <el-form-item label="Description" prop="task_detail">
              <el-input class="span-format-text" type="textarea" v-model="taskLv3Form.task_detail" :rows="4"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- End first tab -->
         <el-tab-pane label="Status Tracing" name="tab_status_tracing">
            <el-row>
              <el-col :span="12">
                <el-form-item label="Status">
                  <el-select :disabled="lv3TaskItemRule.disableStatus" v-model="taskLv3Form.task_status" style="width: 100%">
                    <el-option v-for="(status, index) in statusArray" :key="index" :label="status.status_name" :value="status.status_name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
               <el-col :span="11" :offset="1">
                <el-form-item label="Issue Date">
                  <el-col :span="24">
                    <el-date-picker v-model="taskLv3Form.task_issue_date" type="datetime" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Target Complete">
                  <el-date-picker v-model="taskLv3Form.task_target_complete" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Actual Complete">
                  <el-date-picker v-model="taskLv3Form.task_actual_complete" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Responsible Leader" v-if="lv3TaskItemRule.showRespLeader">
                  <el-select v-model="taskLv3Form.task_responsible_leader" style="width: 100%" disabled>
                    <el-option
                      v-for="(activeUser, index) in activeUserListForOthRespLeader"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1" v-if="lv3TaskItemRule.showRespLeader">
                <el-form-item label="Assignee">
                  <el-select :disabled="lv3TaskItemRule.disableAssignee" filterable v-model="taskLv3Form.task_assignee" style="width: 100%">
                    <el-option
                      v-for="(activeUser, index) in activeUserListForAll"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="!lv3TaskItemRule.showRespLeader">
                <el-form-item label="Assignee">
                  <el-select :disabled="lv3TaskItemRule.disableAssignee" filterable v-model="taskLv3Form.task_assignee" style="width: 100%">
                    <el-option
                      v-for="(activeUser, index) in activeUserListForAll"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Effort">
                  <el-col :span="21">
                    <el-input v-model="taskLv3Form.task_effort" disabled></el-input>
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
                    <el-input :disabled="lv3TaskItemRule.disableTaskEst" v-model="taskLv3Form.task_estimation" type="number"></el-input>
                  </el-col>
                  <el-col :span="3">
                    <span class="span-format">hrs</span>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Sub-Tasks Est" v-if="lv3TaskItemRule.showSubTaskEst">
                  <el-col :span="21">
                    <el-input v-model="taskLv3Form.task_subtasks_estimation" disabled></el-input>
                  </el-col>
                  <el-col :span="3">
                    <span class="span-format">hrs</span>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Progress" v-if="lv3TaskItemRule.showProgress">
              <el-progress class="tl-edit-form-progress" :text-inside="true" :stroke-width="24" :percentage="Number(taskLv3Form.task_progress_nosymbol)" :status="taskLv3FormProgressStatus"></el-progress>
            </el-form-item>
          </el-tab-pane>
          <!-- Second Tab -->
          <el-tab-pane label="Sub-Tasks List" name="tab_subtasks_list">
            <el-row>
              <el-col :span="24">
                <el-button @click="createNewSubTask(4, 'taskLv3Form')" size="medium" style="width:100%" icon="el-icon-plus">Create Sub-Task</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-card class="box-card tl-box-card-subtask" :body-style="{padding: '0px'}" style="margin-top:4px" shadow="never">
                  <el-table :data="taskLv3FormSubTasks" fit max-height="500" class="sub-task-table">
                    <el-table-column prop="task_id" v-if="false"></el-table-column>
                    <el-table-column show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-row style="cursor: pointer;" :gutter="10" @click.native="openTaskById(scope.row.task_id)">
                          <el-col :span="24" class="single-line">
                            <span style="font-weight:bold">{{scope.row.task_name}}</span>
                            <span style="margin-left:10px"> {{scope.row.task_desc}}</span>
                          </el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                    <el-table-column prop="task_status" align="left" width="100">
                      <template slot-scope="scope">
                        <el-tag type="info" style="font-weight:bold" v-if="scope.row.task_status == 'Done'">{{scope.row.task_status}}</el-tag>
                        <el-tag type="success" style="font-weight:bold" v-if="scope.row.task_status != 'Done'">{{scope.row.task_status}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="task_assignee" align="left" width="160"></el-table-column>
                    <el-table-column show-overflow-tooltip fixed="right" align="center" width="30">
                      <template slot-scope="scope">
                        <el-row style="cursor: pointer;" @click.native="openTaskById(scope.row.task_id)">
                          <el-col :span="1"><i class="el-icon-arrow-right"></i></el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Worklogs List" name="tab_worklog_histories">
            <el-card class="box-card tl-history-box-card">
              <el-timeline>
                <el-timeline-item v-for="(history, index) in taskLv3FormHistories" :key="index" :timestamp="history.timestamp"
                  icon="el-icon-star-on" size="large" placement="top" type="primary" class="tl-history">
                  {{history.content}}
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="taskLv3WorklogShow" @click="addWorklog('taskLv3Form')" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" size="medium">Log Work Done</el-button>
        <el-button :disabled="taskLv3SaveBtnDisabled" @click="saveLv3Task" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="medium">Save</el-button>
      </span>
    </el-dialog>
<!------- 7. End Level 3 Task Details Dialog -->
<!------- 8. Level 4 Task Details Dialog -->
    <el-dialog :before-close="closeLv4TaskDialog" :title="taskLv4DialogTitle" :visible.sync="taskLv4DialogVisible" width="55%" style="min-width: 500px;" :close-on-click-modal="false" class="tl-taskform">
      <el-form ref="form" :model="taskLv4Form" label-width="140px" label-position="left" class="tl-edit-form" :rules="taskLv4FormRules">
        <el-tabs v-model="activeTabForLv4" type="card" ref="taskLv4Tabs" @tab-click="((tab, event)=>{changeTab(tab, event, 'taskLv4Form', 'activeTabForLv4')})">
          <el-tab-pane label="Basic Information" name="tab_basic_info">
            <el-row>
              <el-col :span="24">
                <el-form-item label="Parent Task" prop="task_parent_name">
                  <el-col :span="6">
                    <el-autocomplete :disabled="lv4TaskItemRule.disableParentNameInput" placeholder="Search Parent Task..." :trigger-on-focus="false" popper-class="task-autocomplete" :clearable="true" style="width: 100%" :debounce=0
                      v-model="taskLv4Form.task_parent_name" :fetch-suggestions="queryTaskAsyncForParentTask" @select="((item)=>{handleSelectForParentTask(item, 'taskLv4Form')})" @clear="clearSelectForParentTask('taskLv4Form')">
                      <template slot-scope="{ item }">
                        <div class="form_list_task_name">{{ item.value }}</div>
                        <span class="form_list_task_desc">{{ item.description }}</span>
                      </template>
                    </el-autocomplete>
                  </el-col>
                  <el-col :span="18">
                    <el-tooltip class="item" effect="dark" :content="taskLv4Form.task_parent_desc" placement="top-start">
                      <div class="tl-edit-form-div-desc">{{taskLv4Form.task_parent_desc}}</div>
                    </el-tooltip>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Number">
                  <span>{{taskLv4Form.task_name}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Task Type" prop="task_type_id">
                  <el-select disabled v-model="taskLv4Form.task_type_id" style="width: 100%">
                    <el-option v-for="(tasktype, index) in taskTypeArrayForLv2Task" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Type Tag" prop="task_TypeTag">
                  <el-select v-model="taskLv4Form.task_TypeTag" >
                    <el-option
                      v-for="item in typeTagOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>                  
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1" >
                <el-form-item label="Deliverable Tag">
                  <el-select
                    v-model="taskLv4Form.task_deliverableTag"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    style="width: 100%"
                    >
                    <el-option
                      v-for="item in DeliverOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>            
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Ref Pool" v-if="taskLv4Form.task_reference != null && taskLv4Form.task_reference != ''">
              <el-col :span="6">
                <span>{{taskLv4Form.task_reference}}</span>
              </el-col>
              <el-col :span="18">
                <el-tooltip class="item" effect="dark" :content="taskLv4Form.task_reference_desc" placement="top-start">
                  <div class="tl-edit-form-div-desc">{{taskLv4Form.task_reference_desc}}</div>
                </el-tooltip>
              </el-col>
            </el-form-item>
            <el-row>
              <el-col :span="24">
                <el-form-item label="Time Group">
                  <el-select disabled v-model="taskLv4Form.task_group_id" style="width: 100%" placeholder="Select Task Group...">
                    <el-option label="" value=""></el-option>
                    <el-option v-for="(taskgroup, index) in taskGroups" :key="index" :label="taskgroup.group_name" :value="taskgroup.group_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Title" prop="task_desc">
              <el-input class="span-format-text" type="text" v-model="taskLv4Form.task_desc" :rows="4"></el-input>
            </el-form-item>            
            <el-form-item label="Description" prop="task_detail">
              <el-input class="span-format-text" type="textarea" v-model="taskLv4Form.task_detail" :rows="4"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- End first tab -->
         <el-tab-pane label="Status Tracing" name="tab_status_tracing">
            <el-row>
              <el-col :span="12">
                <el-form-item label="Status">
                  <el-select :disabled="lv4TaskItemRule.disableStatus" v-model="taskLv4Form.task_status" style="width: 100%">
                    <el-option v-for="(status, index) in statusArray" :key="index" :label="status.status_name" :value="status.status_name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
               <el-col :span="11" :offset="1">
                <el-form-item label="Issue Date">
                  <el-col :span="24">
                    <el-date-picker v-model="taskLv4Form.task_issue_date" type="datetime" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Target Complete">
                  <el-date-picker v-model="taskLv4Form.task_target_complete" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Actual Complete">
                  <el-date-picker v-model="taskLv4Form.task_actual_complete" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Responsible Leader">
                  <el-select v-model="taskLv4Form.task_responsible_leader" style="width: 100%" disabled>
                    <el-option
                      v-for="(activeUser, index) in activeUserListForOthRespLeader"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="Assignee">
                  <el-select :disabled="lv4TaskItemRule.disableAssignee" filterable v-model="taskLv4Form.task_assignee" style="width: 100%">
                    <el-option
                      v-for="(activeUser, index) in activeUserListForAll"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left;">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Effort">
                  <el-col :span="21">
                    <el-input v-model="taskLv4Form.task_effort" disabled></el-input>
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
                    <el-input :disabled="lv4TaskItemRule.disableTaskEst" v-model="taskLv4Form.task_estimation" type="number"></el-input>
                  </el-col>
                  <el-col :span="3">
                    <span class="span-format">hrs</span>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Progress" v-if="lv4TaskItemRule.showProgress">
              <el-progress class="tl-edit-form-progress" :text-inside="true" :stroke-width="24" :percentage="Number(taskLv4Form.task_progress_nosymbol)" :status="taskLv4FormProgressStatus"></el-progress>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Worklogs List" name="tab_worklog_histories">
            <el-card class="box-card tl-history-box-card">
              <el-timeline>
                <el-timeline-item v-for="(history, index) in taskLv4FormHistories" :key="index" :timestamp="history.timestamp"
                  icon="el-icon-star-on" size="large" placement="top" type="primary" class="tl-history">
                  {{history.content}}
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="taskLv4WorklogShow" @click="addWorklog('taskLv4Form')" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" size="medium">Log Work Done</el-button>
        <el-button :disabled="taskLv4SaveBtnDisabled" @click="saveLv4Task" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="medium">Save</el-button>
      </span>
    </el-dialog>
<!------- 8. End Level 4 Task Details Dialog -->
<!------- 9. Record Worklog Dialog -->
    <el-dialog title="Record Worklog" :visible.sync="worklogDialogVisible" width="35%" :close-on-click-modal="false">
      <el-form :model="worklogForm" label-width="70px" class="tl-worklog-form">
        <el-form-item label="Task" >
          <span style="font-size: 17px">{{worklogForm.worklog_task}}</span>
        </el-form-item>
        <el-form-item label="Date">
          <el-date-picker v-model="worklogForm.worklog_date" type="date" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="Effort" >
          <el-col :span="5">
            <el-input v-model="worklogForm.worklog_effort" type="number"></el-input>
          </el-col>
          <el-col :span="5">
            <span style="text-align:center; font-size:16px; margin-left:10px">Hrs</span>
          </el-col>
        </el-form-item>
        <el-form-item label="Remark" >
          <el-input type="textarea" :rows="6" v-model="worklogForm.worklog_remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="worklogDialogVisible = false">Cancel</el-button>
        <el-button @click="submitWorklog" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}">Submit</el-button>
      </div>
    </el-dialog>
<!------- 9. End Record Worklog Dialog -->
<!------- 10. Remove Task Dialog -->
    <el-dialog title="Remove Task" :visible.sync="removeTaskDialogVisible" width="25%" top="15%">
      <div class="tl-remove-task">
        <span>Confirm to remove task {{removeTaskName}}?</span>
        <el-card class="box-card" shadow="never" style="margin-top:10px;font-size: 15px;color:#909399">
          {{removeTaskDesc}}
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" size="small" @click="closeRemoveTask()">Cancel</el-button>
        <el-button type="danger" size="small" @click="confirmRemoveTask()">Confirm</el-button>
      </span>
    </el-dialog>
<!------- 10. End Remove Task Dialog -->
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
export default {
  name: 'TaskListNew',
  data () {
    return {
        typeTagOptions:[{
          value: 'One-Off Task',
          label: 'One-Off Task'
        },{
          value: 'Regular Task',
          label: 'Regular Task'          
        },{
          value: 'Issue',
          label: 'Issue'          
        },{
          value: 'Problem',
          label: 'Problem'          
        }],
        DeliverOptions: [{
          value: 'Document',
          label: 'Document'
        }, {
          value: 'Program',
          label: 'Program'
        }, {
          value: 'Ready to UAT',
          label: 'Ready to UAT'
        },{
          value: 'Ready to PROD',
          label: 'Ready to PROD'
        },{
          value: 'Clarify',
          label: 'Clarify'
        }],
      // Header/Theme Value
      header1: 'Task Plan',
      isActive: true,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
      // Tab Item Value
      lv2TaskList: [],
      lv2TaskListLoading: false,
      // Task Group Value
      groupDrawerVisible: false,
      groupDrawerDirection: 'ltr',
      activeTabArray: [],
      taskGroups: [],
      taskGroupArray: [],
      currentTaskGroupFlag: 0,
      currentTaskGroupId: 0,
      currentTaskGroup: 'All Time Group',
      selectedLv1TaskId: null,
      selectedLv1TaskName: (this.$store.getters.getPlanTaskName !== null && this.$store.getters.getPlanTaskName !== '') ? this.$store.getters.getPlanTaskName : this.$route.query.planTaskName,
      selectedLv1TaskDesc: (this.$store.getters.getPlanTaskDesc !== null && this.$store.getters.getPlanTaskDesc !== '') ? this.$store.getters.getPlanTaskDesc : this.$route.query.planTaskDesc,
      groupDialogVisible: false,
      taskGroupForm: {
        formGroupId: 0,
        formGroupName: null,
        formGroupTimeRange: null,
        formGroupRelatedTask: null
      },
      // Task List Value
      searchVal: '',
      formFilter: {
        filterTaskLevel: 3,
        filterAssignTo: '',
        filterStatus: ''
      },
      currentPage: 1,
      pageSize: 20,
      tasksTotalSize: 0,
      taskslistData: [],
      taskslistLoading: false,
      // Level 2 Task Dialog Value
      taskLv2DialogVisible: false,
      taskLv2DialogTitle: '2 - Business Implementation',
      activeTabForLv2: 'tab_basic_info',
      taskLv2Form: {},
      taskLv2FormProgressStatus: 'success',
      taskLv2FormSubTasks: [],
      taskLv2SaveBtnDisabled: false,
      // Level 3 Task Dialog Value
      taskLv3DialogVisible: false,
      taskLv3DialogTitle: '3 - Executive Task',
      activeTabForLv3: 'tab_basic_info',
      taskLv3Form: {},
      taskLv3FormProgressStatus: 'success',
      taskLv3FormSubTasks: [],
      taskLv3FormHistories: [],
      taskLv3WorklogShow: true,
      taskLv3SaveBtnDisabled: false,
      // Level 4 Task Dialog Value
      taskLv4DialogVisible: false,
      taskLv4DialogTitle: '4 - Workable Task',
      activeTabForLv4: 'tab_basic_info',
      taskLv4Form: {},
      taskLv4FormProgressStatus: 'success',
      taskLv4FormHistories: [],
      taskLv4WorklogShow: true,
      taskLv4SaveBtnDisabled: false,
      // Rules
      taskListRule: {
        showColForLv1: false,
        showColForLv2: false,
        showColForLv3: false,
        showColForPool: false
      },
      lv2TaskItemRule: {
        disableParentNameInput: true,
        disableTaskType: false,
        disableTaskEst: false,
        showProgress: true,
        showSubTaskEst: true
      },
      taskLv2FormRules: {
        task_parent_name: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_type_id: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_desc: [{required: true, message: 'Could not be empty', trigger: 'blur'}]
      },
      lv3TaskItemRule: {
        disableParentNameInput: true,
        disableTaskEst: false,
        disableDesc: false,
        disableAssignee: false,
        disableStatus: false,
        showProgress: true,
        showRefPoolInput: true,
        showRespLeader: true,
        showSubTaskEst: true,
        showTaskGroup: true
      },
      taskLv3FormRules: {
        task_parent_name: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_type_id: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_desc: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_TypeTag: [{required: true, message: 'Could not be empty', trigger: 'blur'}]
      },
      lv4TaskItemRule: {
        disableParentNameInput: true,
        disableTaskEst: false,
        showProgress: true
      },
      taskLv4FormRules: {
        task_parent_name: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_type_id: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_desc: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_TypeTag: [{required: true, message: 'Could not be empty', trigger: 'blur'}]
      },
      // Worklog Dialog Value
      worklogDialogVisible: false,
      worklogForm: {
        worklog_task: '',
        worklog_task_id: 0,
        worklog_date: '',
        worklog_effort: 0,
        worklog_remark: ''
      },
      // Remove Dialog Value
      removeTaskDialogVisible: false,
      removeTaskId: null,
      removeTaskName: '',
      removeTaskDesc: '',
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
      userRole: this.$store.getters.getUserRole,
      // Status Value
      statusCollection: [
        {'status_name': 'Drafting', 'status_sequence': 1, 'status_disable_est': false, 'status_allow_worklog': false},
        {'status_name': 'Planning', 'status_sequence': 2, 'status_disable_est': false, 'status_allow_worklog': false},
        {'status_name': 'Running', 'status_sequence': 3, 'status_disable_est': true, 'status_allow_worklog': true},
        {'status_name': 'Done', 'status_sequence': 4, 'status_disable_est': true, 'status_allow_worklog': true}
      ],
      statusArray: []
    }
  },
  methods: {
    // Task Group Function
    openTaskGroupDrawer () {
      this.getTaskGroup(0, this.$data.selectedLv1TaskName)
      this.$data.groupDrawerVisible = true
    },
    handleTabChange (iActiveTabArray) {
      this.$data.activeTabArray = iActiveTabArray
    },
    async openTaskTab (iTaskName, Index, iPage, iSize) {
      console.log('Request Task: ' + iTaskName + ', Index: ' + Index)
      var needGetTask = this.$data.activeTabArray.indexOf(Index)
      console.log('Need to get task[' + needGetTask + ']')
      if (needGetTask !== -1) {
        this.$data.pageSize = iSize
        this.$data.currentPage = iPage
        this.$data.lv2TaskList[Index].task_plan_tasks_loading = true
        var reqTaskGroupFlag = this.$data.currentTaskGroupFlag
        var reqTaskGroupId = this.$data.currentTaskGroupId
        var sizeCriteria = {
          reqParentTaskName: iTaskName,
          reqTaskGroupId: reqTaskGroupId,
          reqTaskGroupFlag: reqTaskGroupFlag,
          reqFilterAssignee: this.$data.formFilter.filterAssignTo,
          reqFilterStatus: this.$data.formFilter.filterStatus
        }
        var listCriteria = {
          reqPage: iPage,
          reqSize: iSize,
          reqParentTaskName: iTaskName,
          reqTaskGroupId: reqTaskGroupId,
          reqTaskGroupFlag: reqTaskGroupFlag,
          reqFilterAssignee: this.$data.formFilter.filterAssignTo,
          reqFilterStatus: this.$data.formFilter.filterStatus
        }
        const res = await http.post('/tasks/getPlanTaskSizeByParentTask', sizeCriteria)
        if (res.data.status === 0) {
          this.$data.lv2TaskList[Index].task_total_size = res.data.data.task_list_total_size
          this.$data.lv2TaskList[Index].task_page_number = iPage
          this.$data.lv2TaskList[Index].task_page_size = iSize
          const res1 = await http.post('/tasks/getPlanTaskListByParentTask', listCriteria)
          if (res1.data.status === 0) {
            this.$data.lv2TaskList[Index].task_plan_tasks_list = []
            this.$data.lv2TaskList[Index].task_plan_tasks_list = res1.data.data
          } else {
            this.$data.lv2TaskList[Index].task_plan_tasks_list = []
          }
        }
        this.$data.lv2TaskList[Index].task_plan_tasks_loading = false
      } else {
        this.$data.lv2TaskList[Index].task_plan_tasks_list = []
      }
    },
    handleSizeChange (iSize, iTaskName, Index) {
      this.$data.currentPage = 1
      this.$data.lv2TaskList[Index].task_page_size = iSize
      this.openTaskTab(iTaskName, Index, 1, iSize)
    },
    handleCurrentChange (iPage, iTaskName, Index) {
      var pageSize = this.$data.lv2TaskList[Index].task_page_size
      this.$data.lv2TaskList[Index].task_page_number = iPage
      this.openTaskTab(iTaskName, Index, iPage, pageSize)
    },
    createTaskInPlanMode (iSubTaskLevel, iTaskObj) {
      console.log(iTaskObj)
      if (Number(iSubTaskLevel) === 3) {
        this.$data.taskLv3Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatus('Drafting')
        // Set data default value
        this.$data.taskLv3Form.task_status = 'Drafting'
        this.$data.taskLv3Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv3Form.task_level = 3
        this.$data.taskLv3Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        this.$data.taskLv3Form.task_progress_nosymbol = 0
        // Set parent data of sub task
        this.$data.taskLv3Form.task_parent_name = iTaskObj.task_name
        this.$data.taskLv3Form.task_parent_desc = iTaskObj.task_desc
        this.$data.taskLv3Form.task_type_id = iTaskObj.task_type_id
        this.$data.taskLv3Form.task_responsible_leader = iTaskObj.task_responsible_leader_id
        if (this.$data.currentTaskGroupId > 0) {
          this.$data.taskLv3Form.task_group_id = this.$data.currentTaskGroupId
        } else {
          this.$data.taskLv3Form.task_group_id = null
        }
        // Show or hide column
        this.ruleControlLv3TaskItem('Create', false)
        this.$data.taskLv3DialogVisible = true
      }
      if (Number(iSubTaskLevel) === 4) {
        this.$data.taskLv4Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatus('Drafting')
        // Set data default value
        this.$data.taskLv4Form.task_status = 'Drafting'
        this.$data.taskLv4Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv4Form.task_level = 4
        this.$data.taskLv4Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        this.$data.taskLv4Form.task_progress_nosymbol = 0
        // Set parent data of sub task
        this.$data.taskLv4Form.task_parent_name = iTaskObj.task_name
        this.$data.taskLv4Form.task_parent_desc = iTaskObj.task_desc
        this.$data.taskLv4Form.task_type_id = iTaskObj.task_type_id
        this.$data.taskLv4Form.task_responsible_leader = iTaskObj.task_responsible_leader_id
        this.$data.taskLv4Form.task_group_id = iTaskObj.task_group_id
        this.$data.taskLv4Form.task_reference = iTaskObj.task_reference
        this.$data.taskLv4Form.task_reference_desc = iTaskObj.task_reference_desc
        // Show or hide column
        this.ruleControlLv4TaskItem('Create', false)
        this.$data.taskLv4DialogVisible = true
      }
    },
    resetTaskGroupForm () {
      this.$data.taskGroupForm.formGroupId = 0
      this.$data.taskGroupForm.formGroupName = ''
      this.$data.taskGroupForm.formGroupTimeRange = null
      this.$data.taskGroupForm.formGroupRelatedTask = null
    },
    selectTaskByTaskGroupId (iTaskGroup) {
      console.log('Selected Group')
      var taskGroupId = iTaskGroup.group_id
      var taskGroupName = iTaskGroup.group_name
      var taskGroupTimeStart = iTaskGroup.group_start_time
      var taskGroupTimeEnd = iTaskGroup.group_end_time
      this.$data.currentTaskGroupFlag = 0
      this.$data.currentTaskGroupId = taskGroupId
      this.$data.currentTaskGroup = taskGroupName + ' ' + taskGroupTimeStart + ' ~ ' + taskGroupTimeEnd
      this.$data.groupDrawerVisible = false
      this.getTaskList()
    },
    selectTaskByAllTaskGroup () {
      console.log('All Group')
      this.$data.currentTaskGroupFlag = 0
      this.$data.currentTaskGroupId = 0
      this.$data.currentTaskGroup = 'All Time Group'
      this.$data.groupDrawerVisible = false
      this.getTaskList()
    },
    selectTaskByUnassign () {
      console.log('Unassign Group')
      this.$data.currentTaskGroupFlag = 0
      this.$data.currentTaskGroupId = -1
      this.$data.currentTaskGroup = 'Unassign Task'
      this.$data.groupDrawerVisible = false
      this.getTaskList()
    },
    selectTaskByNewTaskGroup (iTaskGroup) {
      console.log('New Group')
      var taskGroupId = iTaskGroup.group_id
      var taskGroupName = iTaskGroup.group_name
      var taskGroupTimeStart = iTaskGroup.group_start_time
      var taskGroupTimeEnd = iTaskGroup.group_end_time
      this.$data.currentTaskGroupFlag = 1
      this.$data.currentTaskGroupId = taskGroupId
      this.$data.currentTaskGroup = '(Plan) ' + taskGroupName + ' ' + taskGroupTimeStart + ' ~ ' + taskGroupTimeEnd
      this.$data.groupDrawerVisible = false
      this.getTaskList()
    },
    async editTaskGroup (iGroupId) {
      this.resetTaskGroupForm()
      this.$data.taskGroupForm.formGroupRelatedTask = this.$data.selectedLv1TaskName
      await this.getTaskGroup(iGroupId, this.$data.taskGroupForm.formGroupRelatedTask)
      this.$data.groupDialogVisible = true
    },
    createNewTaskGroup () {
      this.resetTaskGroupForm()
      this.$data.taskGroupForm.formGroupRelatedTask = this.$data.selectedLv1TaskName
      this.$data.groupDialogVisible = true
    },
    async submitTaskGroup () {
      var tGroupId = this.$data.taskGroupForm.formGroupId
      var tGroupName = this.$data.taskGroupForm.formGroupName
      var tGroupTimeRange = this.$data.taskGroupForm.formGroupTimeRange
      var tGroupRelatedTask = this.$data.taskGroupForm.formGroupRelatedTask
      if (tGroupName === '' || tGroupName === null) {
        this.$message.error('Task Group Could not be empty!')
        return
      }
      if (tGroupTimeRange === null) {
        this.$message.error('Task Group Time Range Invalid!')
        return
      }
      var tGroupStartTime = tGroupTimeRange[0]
      var tGroupEndTime = tGroupTimeRange[1]
      this.$data.disabledGroupSubmit = true
      const res = await http.post('/tasks/addOrUpdateTaskGroup', {
        tGroupId: tGroupId,
        tGroupName: tGroupName,
        tGroupStartTime: tGroupStartTime,
        tGroupEndTime: tGroupEndTime,
        tGroupRelatedTask: tGroupRelatedTask
      })
      if (res.data.status === 0) {
        this.$message({message: 'Task group created/updated successfully!', type: 'success'})
        this.getTaskGroup(0, tGroupRelatedTask)
        this.$data.groupDialogVisible = false
      } else {
        this.$message.error('Task group created/updated fail!')
      }
    },
    async changeTaskGroup (iNewGroupId, iTaskId, iParentTaskName, iParentTaskIndex) {
      var reqTaskGroupId = iNewGroupId
      var reqTaskId = iTaskId
      const res = await http.post('/tasks/updateTaskGroupForPlanTask', {
        reqTaskId: reqTaskId,
        reqTaskGroupId: reqTaskGroupId
      })
      if (res.data.status === 0) {
        this.$message({message: 'Task\' time group updated successfully!', type: 'success'})
        this.openTaskTab(iParentTaskName, iParentTaskIndex, 1, 20)
      } else {
        this.$message.error('Task\' time group updated fail!')
      }
    },
    // 1. Task List Function (Filter Critera/Search Task/Get Task List)
    filterTask () {
      this.getTaskList()
    },
    async getTaskList () {
      console.log('Start to get level 2 task list')
      this.$data.lv2TaskListLoading = true
      this.$data.activeTabArray = []
      var reqParentTaskName = this.$data.selectedLv1TaskName
      var reqTaskGroupId = this.$data.currentTaskGroupId
      var reqTaskGroupFlag = this.$data.currentTaskGroupFlag
      const res = await http.post('/tasks/getLevel2TaskByParentTask', {
        reqParentTaskName: reqParentTaskName,
        reqTaskGroupId: reqTaskGroupId,
        reqTaskGroupFlag: reqTaskGroupFlag
      })
      console.log(res.data)
      if (res.data.status === 0) {
        this.$data.lv2TaskList = []
        this.$data.lv2TaskList = res.data.data
      } else {
        this.$data.lv2TaskList = []
      }
      this.$data.lv2TaskListLoading = false
    },
    async refreshLv2Task (iTaskId, iTaskName, iTaskIndex) {
      console.log('Start to refresh level 2 task')
      this.openTaskTab(iTaskName, iTaskIndex, 1, 20)
      var reqTaskGroupId = this.$data.currentTaskGroupId
      var reqTaskGroupFlag = this.$data.currentTaskGroupFlag
      const res = await http.post('/tasks/refreshLevel2TaskSubEstimation', {
        reqTaskId: iTaskId,
        reqTaskGroupId: reqTaskGroupId,
        reqTaskGroupFlag: reqTaskGroupFlag
      })
      if (res.data.status === 0) {
        this.$data.lv2TaskList[iTaskIndex].task_subtasks_estimation = 0
        this.$data.lv2TaskList[iTaskIndex].task_subtasks_estimation = res.data.data.task_subtasks_estimation
      }
    },
    // 2. Task info
    openTaskById (iTaskId) {
      console.log('Click')
      var reqTaskId = iTaskId
      var url = '/tasks/getTaskById'
      var criteria = {
        reqTaskId: reqTaskId
      }
      this.getTask(url, criteria)
    },
    openTaskByName (iTaskName) {
      var reqTaskName = iTaskName
      var url = '/tasks/getTaskByName'
      var criteria = {
        reqTaskName: reqTaskName
      }
      this.getTask(url, criteria)
    },
    async getTask (iUrl, iCriteria) {
      const res = await http.post(iUrl, iCriteria)
      if (res.data.status === 0) {
        var rtnTask = res.data.data
        if (rtnTask.task_level === 2) {
          // Clear existing data
          this.getActiveUserList()
          this.getTaskStatus(rtnTask.task_status)
          if (rtnTask.task_parent_type !== null) {
            this.getTaskType(rtnTask.task_parent_type)
          } else {
            this.getTaskType(null)
          }
          this.$data.taskLv2Form = {}
          this.$data.taskLv2Form = res.data.data
          if (Number(res.data.data.task_progress_nosymbol) < 100) {
            this.$data.taskLv2FormProgressStatus = 'success'
          } else {
            this.$data.taskLv2FormProgressStatus = 'exception'
          }
          this.getSubTaskList(rtnTask.task_name, 'taskLv2FormSubTasks', 2)
          this.ruleControlLv2TaskItem('Edit', null)
          this.$data.taskLv2DialogVisible = true
        }
        if (rtnTask.task_level === 3) {
          // Clear existing data
          this.getActiveUserList()
          this.getTaskStatus(rtnTask.task_status)
          this.getTaskType(null)
          this.$data.taskLv3Form = {}
          this.$data.taskLv3Form = res.data.data
          if(this.$data.taskLv3Form.task_deliverableTag!=null){
            this.$data.taskLv3Form.task_deliverableTag = this.$data.taskLv3Form.task_deliverableTag.split(",")            
          }
          if (Number(res.data.data.task_progress_nosymbol) < 100) {
            this.$data.taskLv3FormProgressStatus = 'success'
          } else {
            this.$data.taskLv3FormProgressStatus = 'exception'
          }
          this.ruleControlLv3TaskItem('Edit', null)
          this.getSubTaskList(rtnTask.task_name, 'taskLv3FormSubTasks', 3)
          this.getTaskWorklogHistory(rtnTask.task_id, 'taskLv3FormHistories')
          this.$data.taskLv3DialogVisible = true
        }
        if (rtnTask.task_level === 4) {
          // Clear existing data
          this.getActiveUserList()
          this.getTaskStatus(rtnTask.task_status)
          this.getTaskType(null)
          this.$data.taskLv4Form = {}
          this.$data.taskLv4Form = res.data.data
          if(this.$data.taskLv4Form.task_deliverableTag!=null){
            this.$data.taskLv4Form.task_deliverableTag = this.$data.taskLv4Form.task_deliverableTag.split(",")            
          }
          if (Number(res.data.data.task_progress_nosymbol) < 100) {
            this.$data.taskLv4FormProgressStatus = 'success'
          } else {
            this.$data.taskLv4FormProgressStatus = 'exception'
          }
          this.ruleControlLv4TaskItem('Edit', null)
          this.getTaskWorklogHistory(rtnTask.task_id, 'taskLv4FormHistories')
          this.$data.taskLv4DialogVisible = true
        }
      }
    },
    async getSubTaskList (iTaskName, iSubTaskListItem, iLevel) {
      const res = await http.post('/tasks/getSubTaskByTaskName', {
        reqTaskName: iTaskName
      })
      if (res.data.status === 0) {
        this[iSubTaskListItem] = []
        this[iSubTaskListItem] = res.data.data
        // console.log('Sub Task: ' + JSON.stringify(res.data.data))
      } else {
        this[iSubTaskListItem] = []
      }
      if (this[iSubTaskListItem].length > 0) {
        if (iLevel === 3) {
          console.log('Sub task > 0')
          this.$data.taskLv3WorklogShow = false
          this.$data.lv3TaskItemRule.disableTaskEst = true
        }
      }
    },
    async getTaskWorklogHistory (iTaskId, iTaskHistory) {
      const res = await http.post('/worklogs/getWorklogHistoryByTaskId', {
        wTaskId: iTaskId
      })
      if (res.data.status === 0) {
        this[iTaskHistory] = []
        this[iTaskHistory] = res.data.data
      } else {
        this[iTaskHistory] = []
      }
    },
    async createNewSubTask (iSubTaskLevel, iParentObj) {
      console.log('Create new sub task: ' + iSubTaskLevel)
      if (Number(iSubTaskLevel) === 3) {
        this.$data.taskLv3Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatus('Drafting')
        // Set data default value
        this.$data.taskLv3Form.task_status = 'Drafting'
        this.$data.taskLv3Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv3Form.task_level = 3
        this.$data.taskLv3Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        this.$data.taskLv3Form.task_progress_nosymbol = 0
        // Set parent data of sub task
        this.$data.taskLv3Form.task_parent_name = this[iParentObj].task_name
        this.$data.taskLv3Form.task_parent_desc = this[iParentObj].task_desc
        this.$data.taskLv3Form.task_type_id = this[iParentObj].task_type_id
        this.$data.taskLv3Form.task_responsible_leader = this[iParentObj].task_responsible_leader
        // Show or hide column
        this.ruleControlLv3TaskItem('Create', false)
        this.$data.taskLv3DialogVisible = true
      }
      if (Number(iSubTaskLevel) === 4) {
        this.$data.taskLv4Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatus('Drafting')
        // Set data default value
        this.$data.taskLv4Form.task_status = 'Drafting'
        this.$data.taskLv4Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv4Form.task_level = 4
        this.$data.taskLv4Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        this.$data.taskLv4Form.task_progress_nosymbol = 0
        // Set parent data of sub task
        this.$data.taskLv4Form.task_parent_name = this[iParentObj].task_name
        this.$data.taskLv4Form.task_parent_desc = this[iParentObj].task_desc
        this.$data.taskLv4Form.task_type_id = this[iParentObj].task_type_id
        this.$data.taskLv4Form.task_responsible_leader = this[iParentObj].task_responsible_leader
        this.$data.taskLv4Form.task_group_id = this[iParentObj].task_group_id
        this.$data.taskLv4Form.task_reference = this[iParentObj].task_reference
        this.$data.taskLv4Form.task_reference_desc = this[iParentObj].task_reference_desc
        // Show or hide column
        this.ruleControlLv4TaskItem('Create', false)
        this.$data.taskLv4DialogVisible = true
      }
    },
    // 4. Level 2 task dialog
    async saveLv2Task () {
      var reqTask = this.$data.taskLv2Form
      if (reqTask != null) {
        if (this.isFieldEmpty(reqTask.task_parent_name, 'Task parent name could not be empty!') ||
            this.isFieldEmpty(reqTask.task_type_id, 'Task type could not be empty!') ||
            this.isFieldEmpty(reqTask.task_desc, 'Description could not be empty!')) {
          return
        }
        if (reqTask.task_status === 'Running' || reqTask.task_status === 'Done') {
          if (this.isFieldEmpty(reqTask.task_target_complete, 'Target complete date could not be empty!')) {
            return
          }
          if (this.isFieldEmpty(reqTask.task_responsible_leader, 'Responsible leader could not be empty!')) {
            return
          }
        }
        this.$data.taskLv2SaveBtnDisabled = true
        const res = await http.post('/tasks/saveTask', {
          reqTask: JSON.stringify(reqTask)
        })
        if (res.data.status === 0) {
          this.$message({message: 'Task created successfully!', type: 'success'})
        } else {
          this.$message({message: 'Task updated successfully!', type: 'success'})
        }
        this.$data.taskLv2SaveBtnDisabled = false
        this.openTaskById(res.data.data.Id)
        this.getTaskList()
      }
    },
    ruleControlLv2TaskItem (iAction, iNeedInputParent) {
      if (iAction === 'Edit') {
        // Set Dialog Default Value
        this.$data.taskLv2DialogTitle = '2 - Business Implementation'
        this.$data.activeTabForLv2 = 'tab_basic_info'
        this.$data.lv2TaskItemRule.disableParentNameInput = true
        this.$data.lv2TaskItemRule.disableTaskType = true
        var statusIndex = this.getIndexOfValueInArr(this.$data.statusCollection, 'status_name', this.$data.taskLv2Form.task_status)
        this.$data.lv2TaskItemRule.disableTaskEst = this.$data.statusCollection[statusIndex]['status_disable_est']
        this.$data.lv2TaskItemRule.showProgress = true
        this.$data.lv2TaskItemRule.showSubTaskEst = true
        this.$nextTick(() => {
          this.$refs.taskLv2Tabs.$children[0].$refs.tabs[2].style.display = '' // Show "Sub Tasks List" Tab
        })
      }
      if (iAction === 'Create') {
        // Set Dialog Default Value
        this.$data.taskLv2DialogTitle = '2 - New Business Implementation'
        this.$data.activeTabForLv2 = 'tab_basic_info'
        if (iNeedInputParent) {
          this.$data.lv2TaskItemRule.disableParentNameInput = false
        } else {
          this.$data.lv2TaskItemRule.disableParentNameInput = true
        }
        this.$data.lv2TaskItemRule.disableTaskType = false
        this.$data.lv2TaskItemRule.disableTaskEst = false
        this.$data.lv2TaskItemRule.showProgress = false
        this.$data.lv2TaskItemRule.showSubTaskEst = false
        this.$nextTick(() => {
          this.$refs.taskLv2Tabs.$children[0].$refs.tabs[2].style.display = 'none' // Hide "Sub Tasks List" Tab
        })
      }
    },
    closeLv2TaskDialog (done) {
      console.log('Close lv 2 dialog')
      this.$data.taskLv2DialogVisible = false
      this.$data.taskLv2Form = {}
      this.$data.taskLv2Form.task_progress_nosymbol = 0
      this.$data.taskLv2FormSubTasks = []
      this.$data.taskLv2DialogTitle = '2 - Business Implementation'
      this.$data.activeTabForLv2 = 'tab_basic_info'
      done()
    },
    // 5. Level 3 task dialog
    async saveLv3Task () {
      var reqTask = this.$data.taskLv3Form
      if(this.$data.taskLv3Form.task_deliverableTag!=null&&typeof(this.$data.taskLv3Form.task_deliverableTag)==='object'){
          reqTask.task_deliverableTag = reqTask.task_deliverableTag.toString();             
      }
      if(reqTask.task_deliverableTag!=null&&typeof(reqTask.task_deliverableTag)==='string'){
        this.$data.taskLv3Form.task_deliverableTag = this.$data.taskLv3Form.task_deliverableTag.split(',')
      }
      if (reqTask != null) {
        if (this.isFieldEmpty(reqTask.task_parent_name, 'Task parent name could not be empty!') ||
            this.isFieldEmpty(reqTask.task_type_id, 'Task type could not be empty!') ||
            this.isFieldEmpty(reqTask.task_desc, 'Description could not be empty!')||
            this.isFieldEmpty(reqTask.task_TypeTag, 'Type Tag could not be empty!')) {
          return
        }
        if (Number(reqTask.task_estimation) > 18) {
          this.$message.error('Task estimation could not be over 18 hours. If more effort required, please consider breaking down the task further!')
          return
        }
        if (reqTask.task_status === 'Running' || reqTask.task_status === 'Done') {
          if (this.isFieldEmpty(reqTask.task_target_complete, 'Target complete date could not be empty!')) {
            return
          }
          if (this.isFieldEmpty(reqTask.task_assignee, 'Assignee could not be empty!')) {
            return
          }
        }
        this.$data.taskLv3SaveBtnDisabled = true
        if(this.$data.taskLv3Form.task_deliverableTag!=null&&typeof(this.$data.taskLv3Form.task_deliverableTag)==='object'){
            reqTask.task_deliverableTag = reqTask.task_deliverableTag.toString();             
        }
        const res = await http.post('/tasks/saveTask', {
          reqTask: JSON.stringify(reqTask)
        })
        if (res.data.status === 0) {
          this.$message({message: 'Task created successfully!', type: 'success'})
        } else {
          this.$message({message: 'Task updated successfully!', type: 'success'})
        }
        this.$data.taskLv3SaveBtnDisabled = false
        this.openTaskById(res.data.data.Id)
        // this.getTaskList()
      }
    },
    ruleControlLv3TaskItem (iAction, iNeedInputParent) {
      if (iAction === 'Edit') {
        // Set Dialog Default Value
        this.$data.taskLv3DialogTitle = '3 - Executive Task'
        this.$data.activeTabForLv3 = 'tab_basic_info'
        this.$data.lv3TaskItemRule.showProgress = true
        this.$nextTick(() => {
          this.$refs.taskLv3Tabs.$children[0].$refs.tabs[2].style.display = '' // Show "Sub Tasks List" Tab
          this.$refs.taskLv3Tabs.$children[0].$refs.tabs[3].style.display = '' // Show worklog history tab
        })
        this.$data.lv3TaskItemRule.disableParentNameInput = true
        this.$data.lv3TaskItemRule.showProgress = true
        // Default value
        this.$data.taskLv3WorklogShow = true
        this.$data.lv3TaskItemRule.disableTaskEst = false
        // Validate External Task(Pool Task/Auto Assign Task)
        if (!this.$data.taskLv3Form.task_creator.startsWith('PMT')) {
          this.$data.lv3TaskItemRule.disableTaskEst = true
          this.$data.lv3TaskItemRule.disableDesc = true
          this.$data.lv3TaskItemRule.disableAssignee = true
          this.$data.lv3TaskItemRule.disableStatus = true
          this.$data.lv3TaskItemRule.showRefPoolInput = false
          if (this.$data.taskLv3Form.task_type === 'Pool') {
            console.log('Pool Task')
            this.$data.taskLv3WorklogShow = false
            this.$data.lv3TaskItemRule.showRespLeader = false
            this.$data.lv3TaskItemRule.showSubTaskEst = false
            this.$data.lv3TaskItemRule.showTaskGroup = false
            this.$nextTick(() => {
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[2].style.display = 'none' // For ref pool, hide "Sub Tasks List" Tab
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[3].style.display = 'none' // For ref pool, hide "Worklog History" tab
            })
          } else {
            console.log('Not Pool Task')
            this.$data.taskLv3WorklogShow = true
            this.$data.lv3TaskItemRule.showRespLeader = true
            this.$data.lv3TaskItemRule.showSubTaskEst = true
            this.$data.lv3TaskItemRule.showTaskGroup = true
          }
        } else {
          console.log('PMT Task')
          this.$data.lv3TaskItemRule.disableTaskEst = false
          this.$data.lv3TaskItemRule.disableDesc = false
          this.$data.lv3TaskItemRule.disableAssignee = false
          this.$data.lv3TaskItemRule.disableStatus = false
          this.$data.lv3TaskItemRule.showRefPoolInput = true
          this.$data.lv3TaskItemRule.showRespLeader = true
          this.$data.lv3TaskItemRule.showSubTaskEst = true
          this.$data.lv3TaskItemRule.showTaskGroup = true
          this.$data.taskLv3WorklogShow = true
        }
        // Common Rule for estimation and worklog button
        var statusIndex = this.getIndexOfValueInArr(this.$data.statusCollection, 'status_name', this.$data.taskLv3Form.task_status)
        // Common Rule 1
        this.$data.lv3TaskItemRule.disableTaskEst = this.$data.statusCollection[statusIndex]['status_disable_est']
        // Common Rule 2
        this.$data.taskLv3WorklogShow = this.$data.statusCollection[statusIndex]['status_allow_worklog']
      }
      if (iAction === 'Create') {
        // Set Dialog Default Value
        this.$data.taskLv3DialogTitle = '3 - New Executive Task'
        this.$data.activeTabForLv3 = 'tab_basic_info'
        this.$nextTick(() => {
          this.$refs.taskLv3Tabs.$children[0].$refs.tabs[2].style.display = 'none' // Hide "Sub Tasks List" Tab
          this.$refs.taskLv3Tabs.$children[0].$refs.tabs[3].style.display = 'none' // Hide worklog history tab
        })
        if (iNeedInputParent) {
          this.$data.lv3TaskItemRule.disableParentNameInput = false
        } else {
          this.$data.lv3TaskItemRule.disableParentNameInput = true
        }
        this.$data.lv3TaskItemRule.disableTaskEst = false
        this.$data.lv3TaskItemRule.disableDesc = false
        this.$data.lv3TaskItemRule.disableAssignee = false
        this.$data.lv3TaskItemRule.disableStatus = false
        this.$data.lv3TaskItemRule.showRefPoolInput = true
        this.$data.lv3TaskItemRule.showRespLeader = true
        this.$data.lv3TaskItemRule.showSubTaskEst = false
        this.$data.lv3TaskItemRule.showProgress = false
        this.$data.lv3TaskItemRule.showTaskGroup = true
        this.$data.taskLv3WorklogShow = false
      }
    },
    closeLv3TaskDialog (done) {
      console.log('Close lv 3 dialog')
      this.$data.taskLv3DialogVisible = false
      this.$data.taskLv3Form = {}
      this.$data.taskLv3Form.task_progress_nosymbol = 0
      this.$data.taskLv3FormSubTasks = []
      this.$data.taskLv3FormHistories = []
      this.$data.taskLv3DialogTitle = '3 - Executive Task'
      this.$data.activeTabForLv3 = 'tab_basic_info'
      done()
    },
    selectLv3TaskGroup (val) {
      this.$data.taskLv3Form.task_group_id = val
      this.$forceUpdate()
    },
    // 6. Level 4 task dialog
    async saveLv4Task () {
      var reqTask = this.$data.taskLv4Form
      if(this.$data.taskLv4Form.task_deliverableTag!=null&&typeof(this.$data.taskLv4Form.task_deliverableTag)==='object'){
          reqTask.task_deliverableTag = reqTask.task_deliverableTag.toString();             
      }
      if(reqTask.task_deliverableTag!=null&&typeof(reqTask.task_deliverableTag)==='string'){
        this.$data.taskLv4Form.task_deliverableTag = this.$data.taskLv4Form.task_deliverableTag.split(',')
      }    
      if (reqTask != null) {
        if (this.isFieldEmpty(reqTask.task_parent_name, 'Task parent name could not be empty!') ||
            this.isFieldEmpty(reqTask.task_type_id, 'Task type could not be empty!') ||
            this.isFieldEmpty(reqTask.task_desc, 'Description could not be empty!')||
            this.isFieldEmpty(reqTask.task_TypeTag, 'Type Tag could not be empty!')) {
          return
        }
        if (Number(reqTask.task_estimation) > 18) {
          this.$message.error('Task estimation could not be over 18 hours. If more effort required, please consider breaking down the task further!')
          return
        }
        if (reqTask.task_status === 'Running' || reqTask.task_status === 'Done') {
          if (this.isFieldEmpty(reqTask.task_target_complete, 'Target complete date could not be empty!')) {
            return
          }
          if (this.isFieldEmpty(reqTask.task_assignee, 'Assignee could not be empty!')) {
            return
          }
        }
        this.$data.taskLv4SaveBtnDisabled = true
        if(this.$data.taskLv4Form.task_deliverableTag!=null&&typeof(this.$data.taskLv4Form.task_deliverableTag)==='object'){
            reqTask.task_deliverableTag = reqTask.task_deliverableTag.toString();             
        }
        const res = await http.post('/tasks/saveTask', {
          reqTask: JSON.stringify(reqTask)
        })
        if (res.data.status === 0) {
          this.$message({message: 'Task created successfully!', type: 'success'})
        } else {
          this.$message({message: 'Task updated successfully!', type: 'success'})
        }
        this.$data.taskLv4SaveBtnDisabled = false
        this.openTaskById(res.data.data.Id)
        // this.getTaskList()
      }
    },
    ruleControlLv4TaskItem (iAction, iNeedInputParent) {
      if (iAction === 'Edit') {
        // Set Dialog Default Value
        this.$data.taskLv4DialogTitle = '4 - Workable Task'
        this.$data.activeTabForLv4 = 'tab_basic_info'
        this.$nextTick(() => {
          this.$refs.taskLv4Tabs.$children[0].$refs.tabs[2].style.display = '' // Show worklog history tab
        })
        this.$data.lv4TaskItemRule.disableParentNameInput = true
        this.$data.lv4TaskItemRule.showProgress = true
        this.$data.taskLv4WorklogShow = true
        // Common Rule for estimation and worklog button
        var statusIndex = this.getIndexOfValueInArr(this.$data.statusCollection, 'status_name', this.$data.taskLv4Form.task_status)
        // Common Rule 1
        this.$data.lv4TaskItemRule.disableTaskEst = this.$data.statusCollection[statusIndex]['status_disable_est']
        // Common Rule 2
        this.$data.taskLv4WorklogShow = this.$data.statusCollection[statusIndex]['status_allow_worklog']
      }
      if (iAction === 'Create') {
        // Set Dialog Default Value
        this.$data.taskLv4DialogTitle = '4 - New Workable Task'
        this.$data.activeTabForLv4 = 'tab_basic_info'
        this.$nextTick(() => {
          this.$refs.taskLv4Tabs.$children[0].$refs.tabs[2].style.display = 'none' // Hide worklog history tab
        })
        if (iNeedInputParent) {
          this.$data.lv4TaskItemRule.disableParentNameInput = false
        } else {
          this.$data.lv4TaskItemRule.disableParentNameInput = true
        }
        this.$data.lv4TaskItemRule.disableTaskEst = false
        this.$data.lv4TaskItemRule.showProgress = false
        this.$data.taskLv4WorklogShow = false
      }
    },
    closeLv4TaskDialog (done) {
      console.log('Close lv 4 dialog')
      this.$data.taskLv4DialogVisible = false
      this.$data.taskLv4Form = {}
      this.$data.taskLv4Form.task_progress_nosymbol = 0
      this.$data.taskLv4FormHistories = []
      this.$data.taskLv4DialogTitle = '4 - Workable Task'
      this.$data.activeTabForLv4 = 'tab_basic_info'
      done()
    },
    // Change tabs
    changeTab (tab, event, iObj, iActiveTab) {
      var taskLevel = Number(this[iObj].task_level)
      if (tab.name === 'tab_subtasks_list') {
        var subTaskForm = ''
        if (taskLevel === 1) {
          subTaskForm = 'taskLv1FormSubTasks'
        }
        if (taskLevel === 2) {
          subTaskForm = 'taskLv2FormSubTasks'
        }
        if (taskLevel === 3) {
          subTaskForm = 'taskLv3FormSubTasks'
        }
        if (taskLevel === 4) {
          subTaskForm = 'taskLv4FormSubTasks'
        }
        console.log(this[iObj].task_name)
        console.log(subTaskForm)
        console.log(taskLevel)
        this.getSubTaskList(this[iObj].task_name, subTaskForm, taskLevel)
        this[iActiveTab] = 'tab_subtasks_list'
      }
      if (tab.name === 'tab_worklog_histories') {
        var historiesForm = ''
        if (taskLevel === 3) {
          historiesForm = 'taskLv3FormHistories'
        }
        if (taskLevel === 4) {
          historiesForm = 'taskLv4FormHistories'
        }
        this.getTaskWorklogHistory(this[iObj].task_id, historiesForm)
        this[iActiveTab] = 'tab_worklog_histories'
      }
    },
    // Worklog Dialog
    addWorklog (iObj) {
      this.$data.worklogForm.worklog_task_id = this[iObj].task_id
      this.$data.worklogForm.worklog_task = this[iObj].task_name
      var currentDate = this.dateToString(new Date())
      var currentDateArr = currentDate.split(' ')
      this.$data.worklogForm.worklog_date = currentDateArr[0]
      this.$data.worklogForm.worklog_effort = 0
      this.$data.worklogForm.worklog_remark = ''
      this.$data.worklogDialogVisible = true
    },
    async submitWorklog () {
      var reqUserId = this.$store.getters.getUserId
      var reqTaskId = this.$data.worklogForm.worklog_task_id
      var reqRemark = this.$data.worklogForm.worklog_remark
      var reqWorklogEffort = Number(this.$data.worklogForm.worklog_effort)
      var reqWorklogDate = this.$data.worklogForm.worklog_date
      if (reqTaskId === 0) {
        this.$message.error('Invalid Task!')
        return
      }
      if (reqWorklogDate === '' || reqWorklogDate === null) {
        this.$message.error('Invalid Date!')
        return
      }
      var arr = []
      arr = reqWorklogDate.split('-')
      var reqWorklogMonth = arr[0] + '-' + arr[1]
      var reqWorklogDay = arr[2]
      if (reqWorklogEffort <= 0 || reqWorklogEffort > 24) {
        this.$message.error('Invalid Effort (Worklog effort could not less than 0 or over 24 hrs)!')
        return
      }
      if (!this.checkEffortIsValid(reqWorklogEffort)) {
        this.$message.error('Invalid Effort!')
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
        this.$data.worklogDialogVisible = false
        this.$message({message: 'Add worklog successfully!', type: 'success'})
      } else {
        this.$message.error('Failed to add worklog!')
      }
    },
    // Remove Task Dialog
    removeTask (iTaskId, iTaskName, iObj) {
      this.$data.removeTaskId = iTaskId
      this.$data.removeTaskName = iTaskName
      if (iObj.task_level === 1) {
        this.$data.removeTaskDesc = iObj.task_top_opp_name
      } else {
        this.$data.removeTaskDesc = iObj.task_desc != null ? iObj.task_desc : iObj.sub_task_desc
      }
      this.$data.removeTaskDialogVisible = true
    },
    closeRemoveTask () {
      this.$data.removeTaskId = null
      this.$data.removeTaskName = ''
      this.$data.removeTaskDesc = ''
      this.$data.removeTaskDialogVisible = false
    },
    async confirmRemoveTask () {
      var taskId = this.$data.removeTaskId
      var taskName = this.$data.removeTaskName
      var tUpdatedDate = this.getDay(-3)
      const res = await http.post('/tasks/removeTaskIfNoSubTaskAndWorklog', {
        tTaskId: taskId,
        tTaskName: taskName,
        tUpdateDate: tUpdatedDate
      })
      if (res.data.status === 0) {
        this.$message({
          message: 'Task remove successfully!',
          type: 'success'
        })
        this.closeRemoveTask()
      } else {
        this.$message.error(res.data.message)
      }
    },
    getDay (day) {
      var today = new Date()
      var targetDayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(targetDayMilliseconds)
      return this.dateToString(today)
    },
    // Common Function
    async getActiveUserList () {
      const res = await http.get('/users/getUserList', {
        IsActive: 1
      })
      if (res.data.status === 0) {
        const res1 = await http.get('/users/getUserListOrderByLevelDesc', {
          IsActive: 1
        })
        if (res1.data.status === 0) {
          this.$data.activeUserListForAll = []
          this.$data.activeUserListForAll = res1.data.data
        }
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
        this.$data.taskTypeArrayForLv2Task = []
        this.$data.taskTypeArrayForAll = res.data.data
        this.$data.taskTypeArrayForLv2Task = res.data.data
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
    getTaskStatus (iStatus) {
      var statusCollection = this.$data.statusCollection
      var index = this.getIndexOfValueInArr(statusCollection, 'status_name', iStatus)
      if (index !== -1) {
        this.$data.statusArray = []
        for (var i = index; i < statusCollection.length; i++) {
          this.$data.statusArray.push(statusCollection[i])
        }
      }
    },
    async getTaskGroup (iGroupId, iGroupRelatedTask) {
      const res = await http.get('/tasks/getTaskGroup', {
        tGroupId: iGroupId,
        tGroupRelatedTask: iGroupRelatedTask
      })
      if (res.data.status === 0) {
        if (iGroupId === 0) {
          this.$data.taskGroups = []
          this.$data.taskGroupArray = []
          var taskGroupArr = res.data.data
          this.$data.taskGroups = taskGroupArr
          var resResult = []
          for (var i = 0; i < taskGroupArr.length; i++) {
            var resJson = {}
            resJson.group_long_name = taskGroupArr[i].group_name + ' ' + taskGroupArr[i].group_start_time + ' ~ ' + taskGroupArr[i].group_end_time
            resJson.group_id = taskGroupArr[i].group_id
            resResult.push(resJson)
          }
          this.$data.taskGroupArray = resResult
        } else {
          this.$data.taskGroupForm.formGroupId = res.data.data[0].group_id
          this.$data.taskGroupForm.formGroupName = res.data.data[0].group_name
          this.$data.taskGroupForm.formGroupTimeRange = [res.data.data[0].group_start_time, res.data.data[0].group_end_time]
        }
      }
    },
    // Auto return parent task list
    async queryTaskAsyncForParentTask (queryString, cb) {
      console.log('Parent Task Query String: ' + queryString)
      var returnArr = []
      var reqTaskLevel = Number(this.$data.formFilter.filterTaskLevel) - 1
      const res = await http.post('/tasks/getTaskByNameForParentTask', {
        reqTaskKeyword: queryString,
        reqTaskLevel: reqTaskLevel
      })
      if (res.data.status === 0) {
        var queryResult = res.data.data
        for (var i = 0; i < queryResult.length; i++) {
          var returnJson = {}
          returnJson.value = queryResult[i].task_name
          returnJson.description = queryResult[i].task_desc
          returnJson.type_name = queryResult[i].task_type
          returnJson.type_id = queryResult[i].task_type_id
          returnJson.id = queryResult[i].task_id
          returnJson.responsible_leader = queryResult[i].task_responsible_leader
          returnArr.push(returnJson)
        }
      }
      cb(returnArr)
    },
    handleSelectForParentTask (item, iObj) {
      this[iObj].task_parent_name = item.value
      this[iObj].task_parent_desc = item.description
      if (this[iObj].task_level === 2) {
        this.getTaskType(item.type_name)
      }
      if (this[iObj].task_level === 3 || this[iObj].task_level === 4) {
        this.getTaskType(null)
        this[iObj].task_type_id = item.type_id
        this[iObj].task_responsible_leader = item.responsible_leader
      }
    },
    clearSelectForParentTask (iObj) {
      this[iObj].task_parent_name = null
      this[iObj].task_parent_desc = null
      this[iObj].task_type_id = null
      this.$data.taskTypeArrayForLv2Task = []
    },
    // Auto return parent task list
    async queryTaskAsyncForRefPool (queryString, cb) {
      console.log('Ref Pool Query String: ' + queryString)
      var returnArr = []
      const res = await http.post('/tasks/getTaskByNameForRefPool', {
        reqTaskKeyword: queryString
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
    handleSelectForRefPool (item, iObj) {
      console.log(item)
      console.log(iObj)
      var taskName = item.value
      var taskDesc = item.description
      console.log(taskName)
      console.log(taskDesc)
      this[iObj].task_reference = taskName
      this[iObj].task_reference_desc = taskDesc
    },
    clearSelectForRefPool (iObj) {
      this[iObj].task_reference = null
      this[iObj].task_reference_desc = null
    },
    isFieldEmpty (iField, iMsg) {
      if (iField === undefined || iField === null || iField === '') {
        this.$message.error(iMsg)
        return true
      } else {
        return false
      }
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
    getIndexOfValueInArr (iArray, iKey, iValue) {
      for (var i = 0; i < iArray.length; i++) {
        var item = iArray[i]
        if (iKey !== null) {
          if (item[iKey] === iValue) {
            return i
          }
        }
        if (iKey === null) {
          if (item === iValue) {
            return i
          }
        }
      }
      return -1
    },
    preventParentEventTrigger () {
      console.log('Stop')
    },
    checkEffortIsValid (iEffort) {
      var effort = Number(iEffort)
      if (effort % 0.5 === 0) {
        return true
      } else {
        return false
      }
    },
    getSubTaskRowClassName ({row, rowIndex}) {
      if (row.task_sub_tasks.length === 0) {
        return 'row-expand-cover'
      }
    }
  },
  created () {
    this.getTaskList()
    this.getTaskGroup(0, this.$data.selectedLv1TaskName)
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
  margin-top: 20px;
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
.tp-main {
  height: auto;
  width: 100%;
  margin-top: 10px;
}
.tp-main-table {
  width:100%;
  height: auto;
}
.tp-main-title {
  width: 100%;
  height: auto;
}
.tp-main-content {
  width: 100%;
  height: auto;
}
.tp-main-content-item {
  text-align: left;
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  height: auto;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
}
.tl-task-group-card {
  height: auto;
  margin-bottom: 10px;
  border: 2px solid #E4E7ED;
}
.tl-remove-task {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 17px;
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
  height: auto;
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]{
  -moz-appearance: textfield;
}
.el-collapse {
  min-height: 200px;
}
.tp-main .el-collapse-item__header {
  background-color: #F0FFFF !important;
}
.row-expand-cover .el-table__expand-icon {
  visibility:hidden;
}
</style>
