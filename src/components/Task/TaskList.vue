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
          <el-col :span="10">
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
          <el-col :span="10">
            <div class="tl-bar-item">
              <span style="margin-right:10px">Task Level</span>
              <el-radio-group v-model="formFilter.filterTaskLevel" @change="formFilter.filterShowRefPool = false; formFilter.filterAssignTo = null; filterTask()" >
                <el-radio-button label="1"></el-radio-button>
                <el-radio-button label="2"></el-radio-button>
                <el-radio-button label="3"></el-radio-button>
                <el-radio-button label="EX"></el-radio-button>
              </el-radio-group>              
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tl-bar-item">
              <el-popover
                placement="bottom"
                title="Filter"
                width="300"
                trigger="click">
                  <el-row style="margin: 5px;">
                    <el-col :span="8">Status</el-col>
                    <el-col class="nameInfo" :span="16">
                      <el-select v-model="formFilter.filterStatus" size="small" style="width:auto">
                        <el-option label="" value=""></el-option>
                        <el-option label="Drafting" value="Drafting"></el-option>
                        <el-option label="Planning" value="Planning"></el-option>
                        <el-option label="Running" value="Running"></el-option>
                        <el-option label="Done" value="Done"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row style="margin: 5px;">
                    <el-col :span="8">Leading By</el-col>
                    <el-col :span="16">
                      <el-select v-model="formFilter.filterLeadingBy" filterable size="small" style="width:100%">
                        <el-option label="" value=""></el-option>
                        <el-option
                            v-for="(activeUser, index) in activeUserListForLv1RespLeader"
                            :key="index"
                            :label="activeUser.user_eid"
                            :value="activeUser.user_id">
                            <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                            <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                          </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row  style="margin: 5px;">
                    <el-col :span="8">Assignee To</el-col>
                    <el-col :span="16">
                      <el-select v-model="formFilter.filterAssignTo" filterable size="small" style="width:100%">
                        <el-option label="" value=""></el-option>
                        <el-option
                            v-for="(activeUser, index) in activeUserListForOthRespLeader"
                            :key="index"
                            :label="activeUser.user_eid"
                            :value="activeUser.user_id">
                            <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                            <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                          </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row style="margin: 5px;">
                    <el-col :span="8">Assignee To</el-col>
                    <el-col :span="16">
                      <el-select v-model="formFilter.filterAssignTo" filterable size="small" style="width:100%">
                        <el-option label="" value=""></el-option>
                        <el-option
                            v-for="(activeUser, index) in activeUserListForAll"
                            :key="index"
                            :label="activeUser.user_eid"
                            :value="activeUser.user_id">
                            <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                            <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                          </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-divider></el-divider>
                  <el-row style="margin: 5px;">
                    <el-col :span="8">Opportunity</el-col>
                    <el-col :span="16">
                      <el-select v-model="formFilter.filterLeadingBy" filterable size="small" style="width:100%">
                        <el-option label="" value=""></el-option>
                        <el-option
                            v-for="(activeUser, index) in activeUserListForLv1RespLeader"
                            :key="index"
                            :label="activeUser.user_eid"
                            :value="activeUser.user_id">
                            <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                            <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                          </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row style="margin: 5px;">
                    <el-col :span="8">Skill</el-col>
                    <el-col :span="16">
                      <el-select v-model="formFilter.filterLeadingBy" filterable size="small" style="width:100%">
                        <el-option label="" value=""></el-option>
                        <el-option
                            v-for="(activeUser, index) in activeUserListForLv1RespLeader"
                            :key="index"
                            :label="activeUser.user_eid"
                            :value="activeUser.user_id">
                            <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                            <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                          </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row style="margin: 5px;">
                    <el-col :span="8">Time Group</el-col>
                    <el-col :span="16">
                      <!-- <el-select v-model="formFilter.filterLeadingBy" filterable size="small" style="width:100%">
                        <el-select @change="((val)=>{changeTaskGroup(val, scope.row.task_id, task.task_name, index)})" v-model="formFilter.filterTimeGroup" style="width: 100%" size="small">
                          <el-option label=" " value="0"></el-option>
                          <el-option v-for="(group, index) in taskGroups" :key="index" :label="group.group_name" :value="group.group_id"></el-option>
                        </el-select>
                      </el-select> -->
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-button type="primary" size="mini" @click="filterTask">Confirm</el-button>
                    </el-col>
                    <el-col :span="12">
                      <el-button type="primary" size="mini" @click="filterTask">Clear All</el-button>
                    </el-col>
                  </el-row>
                <el-button slot="reference" type="warning" icon="el-icon-edit-outline"></el-button>
              </el-popover>
            </div>
          </el-col>
        </el-row>
<!------- 2. End of Search Bar -->
<!------- 3. Filter Criteria -->
        <!-- <el-row>
          <el-col :span="24">
            <el-form :inline="true" :model="formFilter" class="tl-form-filter" size="small" label-width="85px" label-position="Top">
              <el-form-item label="Task Level">
                <el-radio-group v-model="formFilter.filterTaskLevel" @change="formFilter.filterShowRefPool = false; formFilter.filterAssignTo = null; filterTask()" size="small">
                  <el-radio-button label="1"></el-radio-button>
                  <el-radio-button label="2"></el-radio-button>
                  <el-radio-button label="3"></el-radio-button>
                  <el-radio-button label="4"></el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Assign To" v-if="taskListRule.showColForLv1">
                <el-select v-model="formFilter.filterAssignTo" filterable size="small" style="width:100%">
                  <el-option label="" value=""></el-option>
                  <el-option
                      v-for="(activeUser, index) in activeUserListForLv1RespLeader"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Assign To" v-if="taskListRule.showColForLv2">
                <el-select v-model="formFilter.filterAssignTo" filterable size="small" style="width:100%">
                  <el-option label="" value=""></el-option>
                  <el-option
                      v-for="(activeUser, index) in activeUserListForOthRespLeader"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Assign To" v-if="!taskListRule.showColForLv1&&!taskListRule.showColForLv2">
                <el-select v-model="formFilter.filterAssignTo" filterable size="small" style="width:100%">
                  <el-option label="" value=""></el-option>
                  <el-option
                      v-for="(activeUser, index) in activeUserListForAll"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
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
              <el-form-item label="Issue Date">
                <el-date-picker v-model="formFilter.filterIssueDateRange" type="daterange"
                  start-placeholder="Start Date" end-placeholder="End Date" value-format="yyyy-MM-dd" size="small" style="width:auto">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="formFilter.filterShowRefPool" v-if="formFilter.filterTaskLevel == 3">External System Tasks(Ref Pool)</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="filterTask">Filter</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row> -->
<!------- 3. End of Filter Criteria -->
<!---------->
        <el-row v-if="showTaskPath">
            <el-col :span="24">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item >{{lv1TaskPath}}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="!showForLv1AndLv2" >{{lv2TaskPath}}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="!showForLv1AndLv2">
                  <el-select @change="((val)=>{changeTaskGroup()})" v-model="currentTaskGroupId" style="width: 100%" size="small">
                    <el-option label=" " value="0"></el-option>
                    <el-option v-for="(group, index) in taskGroups" :key="index" :label="group.group_name" :value="group.group_id"></el-option>
                  </el-select>
                </el-breadcrumb-item>
              </el-breadcrumb>                  
            </el-col>
        </el-row>
        <el-divider></el-divider>        
<!----------->
<!------- 4. Task List -->
        <el-row class="tl-main" v-if="showForLv1AndLv2">
          <el-col :span="24">
            <el-table v-loading="taskslistLoading" :data="taskslistData" @row-click="onRowClick" :row-class-name="getSubTaskRowClassName" class="tl-main-table" fit empty-text="No Data">
              <el-table-column prop="task_id" label="Id" v-if="false" key="1"></el-table-column>
              <el-table-column  prop="task_parent_name" label="Parent Task" width="150px" v-if="!taskListRule.showColForLv1" key="2">
                <template slot-scope="scope">
                   <el-button type="text" @click="openTaskByName(scope.row.task_parent_name)">{{scope.row.task_parent_name}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="task_name" label="Number" width="170px" key="3">
                <template slot-scope="scope">
                   <el-button type="text" @click="openTaskById(scope.row.task_name,scope.row.task_level)">{{scope.row.task_name}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="task_top_opp_name" label="Opportunity Name" show-overflow-tooltip align="left" min-width="230px" v-if="taskListRule.showColForLv1" key="4"></el-table-column>
              <el-table-column prop="task_desc" label="Title" show-overflow-tooltip align="left" min-width="230px" v-if="!taskListRule.showColForLv1" key="5"></el-table-column>
              <el-table-column prop="task_status" label="Status" align="center" width="130px" key="6"></el-table-column>
              <el-table-column prop="task_top_customer" label="Customer" show-overflow-tooltip align="center" min-width="100px" v-if="taskListRule.showColForLv1" key="7"></el-table-column>
              <el-table-column prop="task_top_team_sizing" label="Team Sizing" show-overflow-tooltip align="center" width="280px" v-if="taskListRule.showColForLv1" key="8"></el-table-column>
              <!--<el-table-column prop="task_top_resp_leader" label="Leading By" show-overflow-tooltip align="center" width="120px" v-if="taskListRule.showColForLv1" key="9"></el-table-column>-->
              <el-table-column prop="task_top_target_start" label="Target Start" show-overflow-tooltip align="center" width="150px" v-if="taskListRule.showColForLv1" key="10"></el-table-column>
              <el-table-column prop="task_scope" label="Scope(Baseline)" show-overflow-tooltip align="left" width="150px" v-if="taskListRule.showColForLv2" key="11"></el-table-column>
              <el-table-column prop="task_reference" label="Ref Pool" width="110px" v-if="taskListRule.showColForLv3&&taskListRule.showColRef" key="12">
                <template slot-scope="scope">
                   <el-button type="text" @click="openTaskByName(scope.row.task_reference)">{{scope.row.task_reference}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="task_effort" label="Effort" align="center" width="125px" v-if="!taskListRule.showColForLv1" key="13"></el-table-column>
              <el-table-column prop="task_estimation" label="Estimation" align="center" width="135px" v-if="!taskListRule.showColForLv1" key="14"></el-table-column>
              <el-table-column prop="task_top_resp_leader" label="Leading By" show-overflow-tooltip align="center" width="180px" key="15"></el-table-column>
              <el-table-column prop="task_assignee" label="Assignee" align="center" width="180px" v-if="!taskListRule.showColForLv1&&!taskListRule.showColForLv2" key="16"></el-table-column>
              <!-- <el-table-column prop="task_issue_date" label="Issue Date" align="center" width="180px" v-if="!taskListRule.showColForLv1" key="17"></el-table-column> -->
              <el-table-column prop="task_target_complete" label="Target Completion" align="center" width="180px" v-if="!taskListRule.showColForLv1" key="18"></el-table-column>
              <el-table-column fixed="right" label="Edit" align="center" width="120px">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.task_level===3" @click="openTaskById(scope.row.task_id)" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" size="small" icon="el-icon-plus"></el-button>
                  <el-button @click="removeTask(scope.row.task_id, scope.row.task_name, scope.row)" :style="{'border': 'none', 'color': 'white'}" type="danger" size="small" icon="el-icon-delete"></el-button>
                  </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row class="tl-pagination" v-if="showForLv1AndLv2">
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
      <el-row class="tp-main" v-if="!showForLv1AndLv2">
        <el-col :span="24">          
          <div v-for="(task,index) in lv2TaskList" :key="index" :name="index">
            <el-table ref="multipleTable" :highlight-current-row='true' v-loading="taskslistLoading" :data="task" @row-click="onRowClick" :row-class-name="getSubTaskRowClassName" :row-key="rowKey" :expand-row-keys="expandRowArray" size="small" class="tp-main-table tp-table-border" fit empty-text="No Data">
              <el-table-column type="expand">
               <template slot-scope="props">
                  <el-row>
                    <el-col :span="23" :offset="1">
                      <el-table :data="props.row.task_sub_tasks" size="small" style="width: 100%;" class="sub-task-table tl-plan-task-sub-task-table">
                        <el-table-column label="Id" prop="sub_task_id" v-if="false" key="1"></el-table-column>
                        <el-table-column label="Number" prop="sub_task_name" align="left" width="150" key="2">
                          <template slot-scope="scope">
                            <el-button @click.stop="refreshTaskId = task.task_id; refreshTaskName = task.task_name;  refreshTaskIndex = index; openTaskById(scope.row.sub_task_id)" type="text" class="sub-tasks-name-btn" size="small">{{scope.row.sub_task_name}}</el-button>
                          </template>
                        </el-table-column>
                        <el-table-column label="Description" prop="sub_task_desc" align="left" show-overflow-tooltip></el-table-column>   
                        <el-table-column label="Status" prop="sub_task_status" align="center" width="100"></el-table-column>
                        <el-table-column label="Effort" prop="sub_task_effort" align="center" width="100px"></el-table-column>
                        <el-table-column label="Est" prop="sub_task_estimation" align="center" width="100px"></el-table-column>
                        <el-table-column label="Sub-Tasks Est" prop="sub_task_none_estimation" align="center" width="130px"></el-table-column>
                        <el-table-column label="Leading By/Assignee" prop="sub_task_assignee" align="center" width="180px"></el-table-column>
                        <el-table-column fixed="right" align="center" width="110">
                          <template slot-scope="scope">
                            <el-button @click.stop="refreshTaskId = task.task_id; refreshTaskName = task.task_name;  refreshTaskIndex = index; removeTask(scope.row.sub_task_id, scope.row.sub_task_name, scope.row)" :style="{'border': 'none', 'color': 'white'}" type="danger" size="mini" icon="el-icon-delete"></el-button>
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
                  <el-button type="text" @click.stop="refreshTaskId = task.task_id; refreshTaskName = task.task_name;  refreshTaskIndex = index; openTaskById(scope.row.task_id)">{{scope.row.task_name}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="task_desc" label="Title" show-overflow-tooltip align="left" min-width="250px" key="3"></el-table-column>
              <el-table-column prop="task_group" label="Time Group" align="center" min-width="180px" key="6">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.task_group_id!=null"  @change="((val)=>{changeTaskGroup(val, scope.row.task_id, task.task_name, index)})" v-model="scope.row.task_group_id" style="width: 100%" size="small">
                    <el-option label=" " value="0"></el-option>
                    <el-option v-for="(group, index) in taskGroups" :key="index" :label="group.group_name" :value="group.group_id"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="task_reference" label="Ref Pool" width="150px" key="5">
                <template slot-scope="scope">
                  <el-button type="text" @click.stop="openTaskByName(scope.row.task_reference)">{{scope.row.task_reference}}</el-button>
                </template>
              </el-table-column>                            
              <el-table-column prop="task_status" label="Status" align="center" width="120px" key="4"></el-table-column>
              <el-table-column prop="task_effort" label="Effort" align="center" width="100px" key="7"></el-table-column>
              <el-table-column prop="task_estimation" label="Est" align="center" width="100px" key="8"></el-table-column>
              <el-table-column prop="task_subtasks_estimation" label="Sub-Tasks Est" align="center" width="130px" key="9"></el-table-column>
              <el-table-column prop="task_assignee" label="Leading By/Assignee" align="center" width="180px" key="10"></el-table-column>
              <el-table-column fixed="right" label="Edit" align="center" width="120">
                <template slot-scope="scope">
                  <el-button @click.stop="refreshTaskId = task.task_id; refreshTaskName = task.task_name;  refreshTaskIndex = index; createTaskInPlanMode(4, scope.row)" :style="{'border': 'none', 'color': 'white'}" type="success" size="small" icon="el-icon-plus"></el-button>
                  <el-button @click.stop="refreshTaskId = task.task_id; refreshTaskName = task.task_name;  refreshTaskIndex = index; removeTask(scope.row.task_id, scope.row.task_name, scope.row)" :style="{'border': 'none', 'color': 'white'}" type="danger" size="small" icon="el-icon-delete"></el-button>
                  </template>
              </el-table-column>
            </el-table> 
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
          </el-col>
        </el-row>
      </el-main>
    </el-container>
<!------- 5. Level 1 Task Details Dialog -->
    <el-dialog :before-close="closeLv1TaskDialog" :title="taskLv1DialogTitle" :visible.sync="taskLv1DialogVisible" width="70%" style="min-width: 600px;" :close-on-click-modal="false" class="tl-taskform abow_dialog">
      <el-form ref="form" :model="taskLv1Form" label-width="145px" label-position="left" class="tl-edit-form" :rules="taskLv1FormRules">
        <el-tabs v-model="activeTabForLv1" type="card" ref="taskLv1Tabs" @tab-click="((tab, event)=>{changeTab(tab, event, 'taskLv1Form', 'activeTabForLv1')})">
          <el-tab-pane label="Basic Information" name="tab_basic_info">
            <el-row>
              <el-col :span="11">
                <el-form-item label="Number" prop="task_name">
                  <span v-if="!lv1TaskItemRule.showTaskNameInput">{{taskLv1Form.task_name}}</span>
                  <el-input v-if="lv1TaskItemRule.showTaskNameInput" v-model="taskLv1Form.task_name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
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
              <el-col :span="11">
                <el-form-item label="Customer" prop="task_top_customer">
                  <el-input v-model="taskLv1Form.task_top_customer"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-form-item label="Facing Client">
                  <el-input v-model="taskLv1Form.task_top_facing_client"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Type Of Work">
                  <el-input v-model="taskLv1Form.task_top_type_of_work"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-form-item label="Chance of Winning">
                  <el-input v-model="taskLv1Form.task_top_chance_winning"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Paint Points">
                  <el-input v-model="taskLv1Form.task_top_paint_points"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-form-item label="Constraint">
                  <el-input v-model="taskLv1Form.task_top_constraint"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="SOW Confirmation">
                  <el-date-picker v-model="taskLv1Form.task_top_sow_confirmation" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-form-item label="Team Sizing">
                  <el-input v-model="taskLv1Form.task_top_team_sizing"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Skills / Specialization">
                  <el-input v-model="taskLv1Form.task_top_skill"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-form-item label="Opps > Project">
                  <el-input v-model="taskLv1Form.task_top_opps_project"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="lv1TaskItemRule.showCreator">
              <el-col :span="11">
                <el-form-item label="Created By">
                  <span>{{taskLv1Form.task_creator_name}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- End of basic information -->
          <el-tab-pane label="Status Tracing" name="tab_status_tracing">
            <el-row>
              <el-col :span="11">
                <el-form-item label="Status">
                  <el-select v-model="taskLv1Form.task_status" style="width: 100%">
                    <el-option v-for="(status, index) in statusArray" :key="index" :label="status.status_name" :value="status.status_name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
               <el-col :span="12" :offset="1">
                <el-form-item label="Issue Date">
                  <el-col :span="24">
                    <el-date-picker v-model="taskLv1Form.task_issue_date" type="datetime" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Target Start">
                  <el-date-picker v-model="taskLv1Form.task_top_target_start" type="month" style="width: 100%" placeholder="Select Month..." value-format="yyyy-MM"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-form-item label="Target End">
                  <el-date-picker v-model="taskLv1Form.task_top_target_end" type="month" style="width: 100%" placeholder="Select Month..." value-format="yyyy-MM"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Responsible Leader">
                  <el-select v-model="taskLv1Form.task_responsible_leader" filterable style="width: 100%">
                    <el-option
                      v-for="(activeUser, index) in activeUserListForLv1RespLeader"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- End of status tracing -->
          <el-tab-pane label="Sub-Tasks List" name="tab_subtasks_list">
            <el-row>
              <el-col :span="24">
                <el-button @click="createNewSubTask(2, 'taskLv1Form')" size="medium" style="width:100%" icon="el-icon-plus">Create Sub-Task</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-card class="box-card tl-box-card-subtask" :body-style="{padding: '0px'}" style="margin-top:4px" shadow="never">
                  <el-table v-loading="tasksSubTaskLoading" :data="taskLv1FormSubTasks" fit max-height="500" class="sub-task-table">
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
                    <el-table-column prop="task_responsible_leader" align="left" width="160"></el-table-column>
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
          <!-- End of sub task list -->
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveLv1Task" :disabled="taskLv1SaveBtnDisabled" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="medium">Save</el-button>
      </span>
    </el-dialog>
<!------- 5. End of Level 1 Task Details Dialog -->
<!------- 6. Level 2 Task Details Dialog -->
    <el-dialog :before-close="closeLv2TaskDialog" :title="taskLv2DialogTitle" :visible.sync="taskLv2DialogVisible" width="70%" style="min-width: 500px;" :close-on-click-modal="false" class="tl-taskform">
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
              <el-col :span="11">
                <el-form-item label="Number">
                  <span>{{taskLv2Form.task_name}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
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
            <el-form-item label="Title" prop="task_desc">
              <el-input class="span-format-text" type="text" v-model="taskLv2Form.task_desc"></el-input>
            </el-form-item>            
            <el-form-item label="Description" prop="task_detail">
              <el-input class="span-format-text" type="textarea" v-model="taskLv2Form.task_detail" :rows="4"></el-input>
            </el-form-item>
            <el-row v-if="lv2TaskItemRule.showCreator">
              <el-col :span="11">
                <el-form-item label="Created By">
                  <span>{{taskLv2Form.task_creator_name}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- End first tab -->
         <el-tab-pane label="Status Tracing" name="tab_status_tracing">
            <el-row>
              <el-col :span="11">
                <el-form-item label="Status">
                  <el-select v-model="taskLv2Form.task_status" style="width: 100%">
                    <el-option v-for="(status, index) in statusArray" :key="index" :label="status.status_name" :value="status.status_name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
               <el-col :span="12" :offset="1">
                <el-form-item label="Issue Date">
                  <el-col :span="24">
                    <el-date-picker v-model="taskLv2Form.task_issue_date" type="datetime" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Target Complete">
                  <el-date-picker v-model="taskLv2Form.task_target_complete" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-form-item label="Actual Complete">
                  <el-date-picker v-model="taskLv2Form.task_actual_complete" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Responsible Leader">
                  <el-select v-model="taskLv2Form.task_responsible_leader" filterable style="width: 100%">
                    <el-option
                      v-for="(activeUser, index) in activeUserListForOthRespLeader"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1" v-if="false">
                <el-form-item label="Assignee">
                  <el-select v-model="taskLv2Form.task_assignee" filterable style="width: 100%">
                    <el-option
                      v-for="(activeUser, index) in activeUserListForAll"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
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
              <el-col :span="11">
                <el-form-item label="Estimation">
                  <el-col :span="21">
                    <el-input :disabled="lv2TaskItemRule.disableTaskEst" v-model="taskLv2Form.task_estimation" type="number"></el-input>
                  </el-col>
                  <el-col :span="3">
                    <span class="span-format">hrs</span>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
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
            <!--<el-form-item label="Progress" v-if="lv2TaskItemRule.showProgress">
              <el-progress class="tl-edit-form-progress" :text-inside="true" :stroke-width="24" :percentage="Number(taskLv2Form.task_progress_nosymbol)" :status="taskLv2FormProgressStatus"></el-progress>
            </el-form-item>-->
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
                  <el-table v-loading="tasksSubTaskLoading" :data="taskLv2FormSubTasks" fit max-height="500" class="sub-task-table">
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
          <!-- Regular Task List -->
          <el-tab-pane label="Regular Tasks List" name="tab_regular_list">
            <el-row>
              <el-col :span="24">
                <el-button @click="createRegularTask(3, 'taskLv2Form')" size="medium" style="width:100%" icon="el-icon-plus">Create Regular Task</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-card class="box-card tl-box-card-subtask" :body-style="{padding: '0px'}" style="margin-top:4px" shadow="never">
                  <el-table v-loading="tasksSubTaskLoading" :data="taskLv2FormRegularTasks" fit max-height="500" class="sub-task-table">
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
    <el-dialog :before-close="closeLv3TaskDialog" :title="taskLv3DialogTitle" :visible.sync="taskLv3DialogVisible" width="70%" style="min-width: 500px;" :close-on-click-modal="false" class="tl-taskform">
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
              <el-col :span="11">
                <el-form-item label="Number">
                  <span>{{taskLv3Form.task_name}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-form-item label="Task Type" prop="task_type_id">
                  <el-select disabled v-model="taskLv3Form.task_type_id" style="width: 100%">
                    <el-option v-for="(tasktype, index) in taskTypeArrayForLv2Task" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" v-if="lv3TaskItemRule.showTypeTag">
                <el-form-item label="Type Tag" prop="task_TypeTag">
                  <el-select @change="TypeTagChange" v-model="taskLv3Form.task_TypeTag" style="width: 100%">
                    <el-option
                      v-for="item in typeTagOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>                  
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1" v-if="lv3TaskItemRule.showDeliverableTag">
                <el-form-item label="Deliverable Tag">
                  <el-select  v-model="taskLv3Form.task_deliverableTag" multiple filterable allow-create default-first-option style="width: 100%">
                    <el-option v-for="item in DeliverOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
            <el-form-item label="Title" prop="task_desc">
              <el-input class="span-format-text" type="text" v-model="taskLv3Form.task_desc" :disabled="lv3TaskItemRule.disableDesc"></el-input>
            </el-form-item>            
            <el-form-item label="Description" prop="task_detail">
              <el-input class="span-format-text" type="textarea" v-model="taskLv3Form.task_detail" :rows="4" :disabled="lv3TaskItemRule.disableDesc"></el-input>
            </el-form-item>
            <el-row v-if="lv3TaskItemRule.showCreator">
              <el-col :span="11">
                <el-form-item label="Created By">
                  <span>{{taskLv3Form.task_creator_name}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- End first tab -->
         <el-tab-pane label="Status Tracing" name="tab_status_tracing">
            <el-row>
              <el-col :span="11">
                <el-form-item label="Status">
                  <el-select :disabled="lv3TaskItemRule.disableStatus" v-model="taskLv3Form.task_status" style="width: 100%">
                    <el-option v-for="(status, index) in statusArray" :key="index" :label="status.status_name" :value="status.status_name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
               <el-col :span="12" :offset="1">
                <el-form-item label="Issue Date">
                  <el-col :span="24">
                    <el-date-picker v-model="taskLv3Form.task_issue_date" type="datetime" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Target Complete">
                  <el-date-picker v-model="taskLv3Form.task_target_complete" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-form-item label="Actual Complete">
                  <el-date-picker v-model="taskLv3Form.task_actual_complete" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Responsible Leader" v-if="lv3TaskItemRule.showRespLeader">
                  <el-select v-model="taskLv3Form.task_responsible_leader" style="width: 100%" disabled>
                    <el-option
                      v-for="(activeUser, index) in activeUserListForOthRespLeader"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1" v-if="lv3TaskItemRule.showRespLeader&&lv3TaskItemRule.showDeliverableTag">
                <el-form-item label="Assignee">
                  <el-select :disabled="lv3TaskItemRule.disableAssignee" filterable v-model="taskLv3Form.task_assignee" style="width: 100%">
                    <el-option
                      v-for="(activeUser, index) in activeUserListForAll"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="!lv3TaskItemRule.showRespLeader&&lv3TaskItemRule.showDeliverableTag">
                <el-form-item label="Assignee">
                  <el-select  filterable v-model="taskLv3Form.task_assignee" style="width: 100%">
                    <el-option
                      v-for="(activeUser, index) in activeUserListForAll"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
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
              <el-col :span="11">
                <el-form-item label="Estimation">
                  <el-col :span="21">
                    <el-input :disabled="lv3TaskItemRule.disableTaskEst" v-model="taskLv3Form.task_estimation" type="number"></el-input>
                  </el-col>
                  <el-col :span="3">
                    <span class="span-format">hrs</span>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
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
          <el-tab-pane v-if="taskLv3Form.task_TypeTag!='Regular Task'&&lv3TaskItemRule.showSubTaskList" label="Sub-Tasks List" name="tab_subtasks_list">
            <el-row>
              <el-col :span="24">
                <el-button @click="createNewSubTask(4, 'taskLv3Form')" size="medium" style="width:100%" icon="el-icon-plus">Create Sub-Task</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-card class="box-card tl-box-card-subtask" :body-style="{padding: '0px'}" style="margin-top:4px" shadow="never">
                  <el-table v-loading="tasksSubTaskLoading" :data="taskLv3FormSubTasks" fit max-height="500" class="sub-task-table">
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
          <!-- Appointment Recurrence -->
          <el-tab-pane v-if="taskLv3Form.task_TypeTag==='Regular Task'" label="Recurrence" name="tab_Recurrence">
            <el-divider content-position="left">Recurrence pattern</el-divider>
              <el-row>
                <el-col style="width:20%;" :span="6" prop="task_RegularTaskTime" >
                    <div style="display:flex;justify-content:center;align-items:center"><el-radio-group @change="changePattern" v-model="RegularTaskTimeOps" >
                      <el-radio style="padding:10px 0" :label="1">Daily</el-radio><br>
                      <el-radio style="padding:10px 0" :label="2">Weekly</el-radio><br>
                      <el-radio style="padding:10px 0" :label="3">Monthly</el-radio><br>
                    </el-radio-group></div>
                </el-col>
                <el-col :span="1"><div style="float:left;width: 1px;height: 110px; background: #DCDFE6;"></div></el-col>
                <el-col :span="17" prop="task_scheduletime">
                  <div>
                    <el-radio-group @change="changeDaily" v-model="DailyOps" v-if="RegularTaskTimeOps===1" >
                      <el-radio  :label="1">Every Weekday</el-radio>
                      <el-radio  :label="2">Every <el-input :disabled="isDailyInputDisable" style="width:50px" maxlength="2"  v-model="Scheduletime.ScheduletimeDay" ></el-input> days</el-radio>
                    </el-radio-group>                      
                    <div  v-if="RegularTaskTimeOps===2">
                      Recur every <el-input style="width:50px;height:25px" maxlength="2"  v-model="Scheduletime.ScheduletimeWeek" ></el-input> week(s) on:
                        <el-select style="width:23%;height:25px" v-model="week" placeholder="Monday">
                          <el-option
                            v-for="item in weeks"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </div>
                    <div  v-if="RegularTaskTimeOps===3">
                      <el-radio-group  @change="changeMonthly" v-model="MonthlyOps" >
                        <el-radio style="padding-bottom:20px" :label="1">Day <el-input @input="changeInput()" :disabled="ScheduletimeMonth1Disable" style="width:50px;height:25px" maxlength="2"  v-model="Scheduletime.ScheduletimeDay" ></el-input> of every <el-input :disabled="ScheduletimeMonth1Disable" style="width:50px;height:25px" maxlength="2"  v-model="Scheduletime.ScheduletimeMonth1" ></el-input> month(s)</el-radio><br>
                        <el-radio  :label="2">The                         
                          <el-select :disabled="ScheduletimeMonth2Disable" v-model="num" style="width:17%;height:20px" placeholder="Frist"><el-option v-for="item in nums" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select> 
                          of <el-select :disabled="ScheduletimeMonth2Disable" v-model="week" style="width:23%;height:25px" placeholder="Monday"><el-option v-for="item in weeks" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
                          every <el-input :disabled="ScheduletimeMonth2Disable" style="width:50px;height:25px" maxlength="2"  v-model="Scheduletime.ScheduletimeMonth2" ></el-input> month(s)</el-radio>
                      </el-radio-group>     
                    </div>                    
                  </div>
                </el-col>             
              </el-row>
              <el-divider content-position="left">Range of recurrence</el-divider>
              <el-row>
                <el-col :span="16" >
                  <el-date-picker prop="task_startTime" v-model="taskLv3Form.rangeRecurrence" type="daterange"
                    start-placeholder="Start Date" end-placeholder="End Date" value-format="yyyy-MM-dd"  style="width:auto">
                  </el-date-picker>
                </el-col>
              </el-row>                    
          </el-tab-pane>
          <!-- Regular Task List -->
          <el-tab-pane v-if="taskLv3Form.task_TypeTag==='Regular Task'&&lv3TaskItemRule.showRegularTaskList" label="Sub-Tasks List" name="tab_regular_list">
            <el-row>
              <el-col :span="24">
                <el-button @click="createRegularTask(4, 'taskLv3Form')" size="medium" style="width:100%" icon="el-icon-plus">Create Sub-Task</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-card class="box-card tl-box-card-subtask" :body-style="{padding: '0px'}" style="margin-top:4px" shadow="never">
                  <el-table v-loading="tasksSubTaskLoading" :data="taskLv3FormRegularTasks" fit max-height="500" class="sub-task-table">
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
          <el-tab-pane v-if="!taskLv3Form.task_TypeTag==='Regular Task'" label="Worklogs List" name="tab_worklog_histories">
            <el-card class="box-card tl-history-box-card">
              <el-timeline v-loading="tasksWorklogHistoriesLoading">
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
        <el-button :disabled="taskLv3WorklogDisabled" v-if="taskLv3WorklogShow" @click="addWorklog('taskLv3Form')" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" size="medium">Log Work Done</el-button>
        <el-button :disabled="taskLv3SaveBtnDisabled" @click="saveLv3Task" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="medium">Save</el-button>
      </span>
    </el-dialog>
<!------- 7. End Level 3 Task Details Dialog -->
<!------- 8. Level 4 Task Details Dialog -->
    <el-dialog :before-close="closeLv4TaskDialog" :title="taskLv4DialogTitle" :visible.sync="taskLv4DialogVisible" width="70%" style="min-width: 500px;" :close-on-click-modal="false" class="tl-taskform">
      <el-form ref="form" :model="taskLv4Form" label-width="140px" label-position="left" class="tl-edit-form" :rules="taskLv4FormRules">
        <el-tabs v-model="activeTabForLv4" type="card" ref="taskLv4Tabs" @tab-click="((tab, event)=>{changeTab(tab, event, 'taskLv4Form', 'activeTabForLv4')})">
          <el-tab-pane label="Basic Information" name="tab_basic_info">
            <el-row>
              <el-col :span="24">
                <el-form-item label="Parent Task" prop="task_parent_name">
                  <el-col :span="6">
                    <el-autocomplete :disabled="lv4TaskItemRule.disableParentNameInput" placeholder="Search Parent Task..." :trigger-on-focus="false" popper-class="task-autocomplete" :clearable="true" style="width: 100%" :debounce=0
                      @input="changeParentName('taskLv4Form')" v-model="taskLv4Form.task_parent_name" :fetch-suggestions="queryTaskAsyncForParentTask" @select="((item)=>{handleSelectForParentTask(item, 'taskLv4Form')})" @clear="clearSelectForParentTask('taskLv4Form')">
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
              <el-col :span="11">
                <el-form-item label="Number">
                  <span>{{taskLv4Form.task_name}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-form-item label="Task Type" prop="task_type_id">
                  <el-select disabled v-model="taskLv4Form.task_type_id" style="width: 100%">
                    <el-option v-for="(tasktype, index) in taskTypeArrayForLv2Task" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Type Tag" prop="task_TypeTag">
                  <span>{{taskLv4Form.task_TypeTag}}</span>                
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1"  v-if="lv3TaskItemRule.showDeliverableTag" >
                <el-form-item label="Deliverable Tag">
                  <el-select  v-model="taskLv4Form.task_deliverableTag" multiple filterable allow-create default-first-option style="width: 100%">
                    <el-option v-for="item in DeliverOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
            <el-form-item label="Title" prop="task_desc">
              <el-input class="span-format-text" type="text" v-model="taskLv4Form.task_desc"></el-input>
            </el-form-item>            
            <el-form-item label="Description" prop="task_detail">
              <el-input class="span-format-text" type="textarea" v-model="taskLv4Form.task_detail" :rows="4"></el-input>
            </el-form-item>
            <el-row v-if="lv4TaskItemRule.showCreator">
              <el-col :span="11">
                <el-form-item label="Created By">
                  <span>{{taskLv4Form.task_creator_name}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- End first tab -->
         <el-tab-pane label="Status Tracing" name="tab_status_tracing">
            <el-row>
              <el-col :span="11">
                <el-form-item label="Status">
                  <el-select :disabled="lv4TaskItemRule.disableStatus" v-model="taskLv4Form.task_status" style="width: 100%">
                    <el-option v-for="(status, index) in statusArray" :key="index" :label="status.status_name" :value="status.status_name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
               <el-col :span="12" :offset="1">
                <el-form-item label="Issue Date">
                  <el-col :span="24">
                    <el-date-picker v-model="taskLv4Form.task_issue_date" type="datetime" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Target Complete">
                  <el-date-picker v-model="taskLv4Form.task_target_complete" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-form-item label="Actual Complete">
                  <el-date-picker v-model="taskLv4Form.task_actual_complete" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Responsible Leader">
                  <el-select v-model="taskLv4Form.task_responsible_leader" style="width: 100%" disabled>
                    <el-option
                      v-for="(activeUser, index) in activeUserListForOthRespLeader"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1" v-if="lv4TaskItemRule.showDeliverableTag">
                <el-form-item label="Assignee">
                  <el-select filterable v-model="taskLv4Form.task_assignee" style="width: 100%">
                    <el-option
                      v-for="(activeUser, index) in activeUserListForAll"
                      :key="index"
                      :label="activeUser.user_eid"
                      :value="activeUser.user_id">
                      <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
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
              <el-col :span="11">
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
          <el-tab-pane v-if="!taskLv4Form.task_TypeTag==='Regular Task'" label="Worklogs List" name="tab_worklog_histories">
            <el-card class="box-card tl-history-box-card">
              <el-timeline v-loading="tasksWorklogHistoriesLoading">
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
        <el-button :disabled="taskLv4WorklogDisabled" v-if="taskLv4WorklogShow" @click="addWorklog('taskLv4Form')" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" size="medium">Log Work Done</el-button>
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
  name: 'TaskList',
  data () {
    return {
      typeTagOptions:[
        {value: 'Public Task', label: 'Public Task'},
        {value: 'One-Off Task', label: 'One-Off Task'},
        {value: 'Regular Task', label: 'Regular Task'}
      ],
      DeliverOptions: [
        {value: 'Clarify Requirement', label: 'Clarify Requirement'},
        {value: 'Document Scenarios', label: 'Document Scenarios'}, 
        {value: 'Design Program', label: 'Design Program'},
        {value: 'Ready to UAT', label: 'Ready to UAT'},
        {value: 'UAT In Support', label: 'UAT In Support'},
        {value: 'Ready to PROD', label: 'Ready to PROD'}
      ],
      // Header/Theme Value
      header1: 'Task List',
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
      tasksSubTaskLoading: false,
      tasksWorklogHistoriesLoading: false,
      // Level 1 Task Dialog Value
      taskLv1DialogVisible: false,
      taskLv1DialogTitle: '1 - Business Opportunity',
      activeTabForLv1: 'tab_basic_info',
      taskLv1Form: {},
      taskLv1FormSubTasks: [],
      taskLv1SaveBtnDisabled: false,
      // Level 2 Task Dialog Value
      taskLv2DialogVisible: false,
      taskLv2DialogTitle: '2 - Business Implementation',
      activeTabForLv2: 'tab_basic_info',
      taskLv2Form: {},
      taskLv2FormProgressStatus: 'success',
      taskLv2FormSubTasks: [],
      taskLv2FormRegularTasks: [],
      taskLv2FormRegularTasks: [],
      taskLv2SaveBtnDisabled: false,
      // Level 3 Task Dialog Value
      taskLv3DialogVisible: false,
      taskLv3DialogTitle: '3 - Executive Task',
      activeTabForLv3: 'tab_basic_info',
      taskLv3Form: {},
      taskLv3FormProgressStatus: 'success',
      taskLv3FormSubTasks: [],
      taskLv3FormRegularTasks: [],
      taskLv3FormHistories: [],
      taskLv3WorklogShow: true,
      taskLv3WorklogDisabled: false,
      taskLv3SaveBtnDisabled: false,
      // Level 4 Task Dialog Value
      taskLv4DialogVisible: false,
      taskLv4DialogTitle: '4 - Workable Task',
      activeTabForLv4: 'tab_basic_info',
      taskLv4Form: {},
      taskLv4FormProgressStatus: 'success',
      taskLv4WorklogDisabled : false,
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
      lv1TaskItemRule: {
        showTaskNameInput: true,
        disableTaskType: false,
        showCreator: true
      },
      taskLv1FormRules: {
        task_name: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_type_id: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_top_opp_name: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_top_customer: [{required: true, message: 'Could not be empty', trigger: 'blur'}]
      },
      lv2TaskItemRule: {
        disableParentNameInput: true,
        disableTaskType: false,
        disableTaskEst: false,
        showProgress: true,
        showSubTaskEst: true,
        showCreator: true
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
        disableStatus: false,
        showProgress: true,
        showRefPoolInput: true,
        showRespLeader: true,
        showSubTaskEst: true,
        showTypeTag: true,
        showDeliverableTag: true,
        showCreator: true,
        showRegularTaskList: false,
        showSubTaskList : false
      },
      taskLv3FormRules: {
        task_parent_name: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_type_id: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_desc: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_TypeTag: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_RegularTaskTime: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_scheduletime: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_startTime: [{required: true, message: 'Could not be empty', trigger: 'blur'}]
      },
      lv4TaskItemRule: {
        disableParentNameInput: true,
        disableTaskEst: false,
        showProgress: true,
        showCreator: true,
        showDeliverableTag:true
      },
      taskLv4FormRules: {
        task_parent_name: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_type_id: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_desc: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_TypeTag: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_RegularTaskTime: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_scheduletime: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_startTime: [{required: true, message: 'Could not be empty', trigger: 'blur'}]
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
        {'status_name': 'Drafting', 'status_sequence': 1, 'status_disable_est': false, 'status_allow_worklog': false, 'status_disable_change_parent': false},
        {'status_name': 'Planning', 'status_sequence': 2, 'status_disable_est': false, 'status_allow_worklog': false, 'status_disable_change_parent': false},
        {'status_name': 'Running', 'status_sequence': 3, 'status_disable_est': true, 'status_allow_worklog': true, 'status_disable_change_parent': true},
        {'status_name': 'Done', 'status_sequence': 4, 'status_disable_est': true, 'status_allow_worklog': true, 'status_disable_change_parent': true}
      ],
      statusArray: [],
      //Regular Task
      RegularTaskTimeVisible: false,
      RegularTaskTimeOps: '',
      DailyOps: '',
      MonthlyOps: '',
      isDailyInputDisable: false,
      ScheduletimeMonth1Disable: false,
      ScheduletimeMonth2Disable: false,
      Scheduletime:{
        ScheduletimeDay:'',
        ScheduletimeWeek:'',
        ScheduletimeMonth1:'',   
        ScheduletimeMonth2:'',       
      },
      weeks:[
        {value: 'Monday',lable: 'Monday'},
        {value: 'Thuesday',lable: 'Thuesday'},
        {value: 'Wednessday',lable: 'Wednessday'},
        {value: 'Thursday',lable: 'Thursday'},
        {value: 'Friday',lable: 'Friday'},
        {value: 'Saturday',lable: 'Saturday'},
        {value: 'Sunday',lable: 'Sunday'}
      ],
      week:'',
      num:'',
      nums:[
        {value: 'First',lable: 'First'},
        {value: 'Second',lable: 'Second'},
        {value: 'Third',lable: 'Third'},
        {value: 'Fourth',lable: 'Fourth'}
      ],
      lv2TaskListLoading: false,   
      activeTabArray: [],
      taskLv2List : [],
      expandRowArray: [],
      //Path 
      showTaskPath : false,
      lv1TaskPath : '',
      lv2TaskPath : '',
      // Tab Item Value
      lv2TaskList: [],
      lv2TaskListLoading: false,
      showForLv1AndLv2 : true,
      selection : {},
      currentTaskGroupId : '',
      taskGroups : [],
      multipleTable:[],
    }
  },
  methods: {
    getSubTaskRowClassName ({row, rowIndex}) {
      if (this.tasksTotalSize.length === 0) {
        return 'row-expand-cover'
      }
      row.index = rowIndex;
    },
    onRowClick (row, event, column) {
        if(row!=null){
          this.$data.selection = row
          console.log(this.$data.selection)
        }
    },
    rowKey (row) {
      return row.task_id
    },
    changeInput () {
      this.$forceUpdate()
    },
    // 1. Task List Function (Filter Critera/Search Task/Get Task List)
    filterTask () {
      this.$data.taskGroupArray = []
      if(Number(this.$data.formFilter.filterTaskLevel) === 1 ||Number(this.$data.formFilter.filterTaskLevel)===2){
        this.getTaskList(1, 20)
      }else{
        this.$data.showForLv1AndLv2 = false
        //this.getLevel3TaskListByCurrentTimegroup()
        this.getTaskGroup(0,true)
        //this.getTaskList(1, 20)

      }
    },
    getNowFormatDate() {//获取当月时间 yyyy-MM-dd
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = '0' + month;
        }
        if (strDate >= 1 && strDate <= 9) {
            strDate = '0' + strDate ;
        }
        var currentdate = year + '-' + month + '-' + strDate 
        return currentdate;
    },
    async searchTask () {
      this.getTaskList(1, 20)
    },
    changeDaily () {
      if(this.$data.DailyOps === 1){
        this.$data.isDailyInputDisable = true
      }else{
          this.$data.isDailyInputDisable = false              
      }
    },
    changePattern () {      
      if(this.$data.RegularTaskTimeOps === 1){
        this.$data.taskLv3Form.task_RegularTaskTime = "Daily"
      }else if(this.$data.RegularTaskTimeOps === 2){
        this.$data.taskLv3Form.task_RegularTaskTime = "Weekly"
      }else{
        this.$data.taskLv3Form.task_RegularTaskTime = "Monthly"
      }   
    },
    preventParentEventTrigger () {
      console.log('Stop')
    },
    changeMonthly () {
      console.log("~~~~")
      this.$data.Scheduletime = {}
      this.$data.num = ''      
      this.$data.week = ''
      if(this.$data.MonthlyOps === 1){
        this.$data.ScheduletimeMonth1Disable = false 
        this.$data.ScheduletimeMonth2Disable = true 
      }else{
        this.$data.ScheduletimeMonth1Disable = true 
        this.$data.ScheduletimeMonth2Disable = false              
      }
    },
    async getTaskList (iPage, iSize) {
      this.$data.taskslistLoading = true
      this.$data.taskslistData = []
      this.$data.pageSize = iSize
      this.$data.currentPage = iPage
      var reqTaskLevel = Number(this.$data.formFilter.filterTaskLevel)
      var reqCurrentTimeGroup = []
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
        reqFilterShowRefPool: this.$data.formFilter.filterShowRefPool,
        reqCurrentTimeGroup : this.$data.taskGroupArray
      }      
      if(reqTaskLevel === 1 || reqTaskLevel ===2){
        this.$data.showForLv1AndLv2 = true
        const res1 = await http.get('/tasks/getTaskListTotalSize', sizeCriteria)
        if (res1.data.status === 0) {
          this.$data.tasksTotalSize = res1.data.data.task_list_total_size
          const res2 = await http.get('/tasks/getTaskList', listCriteria)
          if (res2.data.status === 0) {
            this.$data.taskslistData = res2.data.data
          } else {
            this.$data.taskslistData = []
          }
        } else {
          this.$data.tasksTotalSize = 0
        }
        console.log(this.$data.taskslistData)
      }else{
        console.log("~~~")
        this.$data.showForLv1AndLv2 = false
        const res1 = await http.get('/tasks/getTaskListTotalSize', sizeCriteria)
        if (res1.data.status === 0) {
          this.$data.tasksTotalSize = res1.data.data.task_list_total_size
          const res2 = await http.get('/tasks/getLv3TaskList', listCriteria)
          if (res2.data.status === 0) {
            this.$data.taskslistData = res2.data.data
          } else {
            this.$data.taskslistData = []
          }
        } else {
          this.$data.tasksTotalSize = 0
        }
        console.log(this.$data.taskslistData)
        this.$data.lv2TaskList = this.$data.taskslistData
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
        this.$data.taskListRule.showColForLv1 = true
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
    async getTaskGroup (iGroupId,isShowCurrent) {
      var today = this.getNowFormatDate()
      console.log(today)
      console.log(iGroupId,isShowCurrent)
      const res = await http.get('/tasks/getTaskGroup', {
        tGroupId: iGroupId,
        //tGroupRelatedTask: iGroupRelatedTask,
        tToday : today,
        isShowCurrent : isShowCurrent
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
        //console.log(this.$data.taskGroupArray)
        this.getTaskList(1, 20)
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
    // 2. Task info
    openTaskById (iTaskId,iTaskLevel) {
      console.log('Click~')
      console.log(iTaskId,iTaskLevel)
      this.$data.showTaskPath = false
      if(Number(this.$data.formFilter.filterTaskLevel) === 1){
        this.$data.showTaskPath = true
          if(iTaskLevel===1){
            this.$data.lv1TaskPath = iTaskId
            this.getLevel2TaskListByParentTask(iTaskId)
            this.$data.showForLv1AndLv2 = true
          }else if(iTaskLevel===2){
            this.$data.lv2TaskPath = iTaskId
            this.ruleShowListColumn(3)
            this.$data.showForLv1AndLv2 = false  
            this.openTaskTab(iTaskId, 1, 20)
         }  
        }else{
          console.log("~~~")
          var url = '/tasks/getTaskByName'
          var criteria = {
            reqTaskName: iTaskId
          }
          console.log(url,criteria)
          this.getTask(url, criteria)
      }  
    },
    async openTaskTab (iTaskName, iPage, iSize) {
      this.$data.lv2TaskList = []
      var resArr = []
      const res2 = await http.post('/tasks/getTaskByName',{
        reqTaskName : iTaskName
      })
      this.$data.pageSize = iSize
      this.$data.currentPage = iPage
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
          res2.data.data.task_page_number = iPage
          res2.data.data.task_page_size = iSize   
          const res1 = await http.post('/tasks/getPlanTaskListByParentTask', listCriteria)
          console.log(res1.data.data)
          if (res1.data.status === 0) {
            res1.data.data.splice(0,0,res2.data.data)
            res2.data.data = []
            res2.data.data = res1.data.data
            res2.data.data.task_total_size = res.data.data.task_list_total_size
          } else {
            res2.data.data = []
          }                      
      }
      this.$data.lv2TaskList.push(res2.data.data)
    },
    async getLevel2TaskListByParentTask (iTaskId) {
      console.log('Start to get level 2 task list')
      this.$data.lv2TaskListLoading = true
      this.$data.activeTabArray = []
      var reqParentTaskName = iTaskId
      var reqTaskGroupId = this.$data.currentTaskGroupId
      var reqTaskGroupFlag = this.$data.currentTaskGroupFlag
      this.ruleShowListColumn(2)
      const res = await http.post('/tasks/getLevel2TaskListByParentTask', {
        reqParentTaskName: reqParentTaskName,
        reqTaskGroupId: reqTaskGroupId,
        reqTaskGroupFlag: reqTaskGroupFlag
      })
      console.log(res.data)
      if (res.data.status === 0) {
        this.$data.taskslistData = []
        this.$data.tasksTotalSize = res.data.data.length
        this.$data.taskslistData = res.data.data
      } else {
        this.$data.taskslistData = []
      }
      this.$data.lv2TaskListLoading = false
    },
    openTaskByName (iTaskName) {
      console.log('openTaskByName')
      var reqTaskName = iTaskName
      if (reqTaskName === 'N/A') {
        return
      }
      var url = '/tasks/getTaskByName'
      var criteria = {
        reqTaskName: reqTaskName
      }
      this.getTask(url, criteria)
    },
    TypeTagChange () {
      if(this.$data.taskLv3Form.task_TypeTag === 'Regular Task' || this.$data.taskLv4Form.task_TypeTag === 'Regular Task' ){
        this.$data.lv3TaskItemRule.showDeliverableTag = false
        this.$data.lv4TaskItemRule.showDeliverableTag = false
        this.$data.RegularTaskTimeVisible = true
        if(this.$data.taskLv3Form.task_status === 'Running' || this.$data.taskLv3Form.task_status === 'Done'){
          // this.$data.taskLv3WorklogDisabled = true
          this.$data.taskLv3WorklogShow = false
        }else if(this.$data.taskLv4Form.task_status === 'Running' || this.$data.taskLv4Form.task_status === 'Done'){
          // this.$data.taskLv4WorklogDisabled = true
          this.$data.taskLv4WorklogShow = false
        }else if(this.$data.taskLv3Form.task_status === 'Drafting' || this.$data.taskLv4Form.task_status === 'Drafting'){
          this.$data.taskLv3Form.task_status = 'Planning'
          this.$data.taskLv4Form.task_status = 'Planning'
        }
      }else{
        this.$data.lv3TaskItemRule.showDeliverableTag = true
        this.$data.lv4TaskItemRule.showDeliverableTag = true
        this.$data.taskLv3WorklogShow = true
        this.$data.taskLv4WorklogShow = true
        this.$data.RegularTaskTimeVisible = false  
      }
    },
     async getTask (iUrl, iCriteria) {
      const res = await http.post(iUrl, iCriteria)
      console.log(res)
      if (res.data.status === 0) {
        var rtnTask = res.data.data
        if (rtnTask.task_level === 1) {
          this.getActiveUserList()
          this.getTaskType(null)
          this.getTaskStatus(rtnTask.task_status)
          this.$data.taskLv1Form = {}
          this.$data.taskLv1Form = res.data.data
          // Load return data
          this.getSubTaskList(rtnTask.task_name, 'taskLv1FormSubTasks', 1)
          this.ruleControlLv1TaskItem('Edit')
          this.$data.taskLv1DialogVisible = true
        }
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
          this.getRegularTaskList(rtnTask.task_name, 'taskLv2FormRegularTasks', 2)
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
          this.TypeTagChange()
          if(this.$data.taskLv3Form.task_deliverableTag!=null){
            this.$data.taskLv3Form.task_deliverableTag = this.$data.taskLv3Form.task_deliverableTag.split(",")            
          }
          if (Number(res.data.data.task_progress_nosymbol) < 100) {
            this.$data.taskLv3FormProgressStatus = 'success'
          } else {
            this.$data.taskLv3FormProgressStatus = 'exception'
          }
          this.$data.lv3TaskItemRule.showSubTaskList = true
          if(res.data.data.task_TypeTag === 'Regular Task'){
            this.$data.lv3TaskItemRule.showRegularTaskList = true
            this.$data.taskLv3WorklogShow = false
            const res1 = await http.post('/schedules/getSchedulesByTaskName',{
              reqTaskName : rtnTask.task_name
            })
            console.log(res1)
            if(res1.data.status === 0 ){
              this.$data.taskLv3Form.rangeRecurrence = []
              this.$data.taskLv3Form.rangeRecurrence.push(res1.data.data.task_startTime)
              this.$data.taskLv3Form.rangeRecurrence.push(res1.data.data.task_endTime)
              this.$data.taskLv3Form.task_RegularTaskTime = res1.data.data.task_RegularTaskTime
              this.changePattern()
              var schedule = res1.data.data.task_scheduletime
              if(res1.data.data.task_RegularTaskTime === 'Daily'){
                this.$data.RegularTaskTimeOps = 1
                if(schedule === 'Every Weekday'){
                  this.$data.DailyOps = 1
                  this.$data.isDailyInputDisable = true
                }else{
                  this.$data.DailyOps = 2
                  var index = schedule.split(' ')     
                  this.$data.Scheduletime.ScheduletimeDay = index[1]
                }
              }else if(res1.data.data.task_RegularTaskTime === 'Weekly'){
                this.$data.RegularTaskTimeOps = 2
                var index = schedule.split(' ')         
                this.$data.Scheduletime.ScheduletimeWeek = index[2]
                var index=schedule.lastIndexOf("\:");
                this.$data.week = schedule.substring(index+1,schedule.length)
              }else{
                this.$data.RegularTaskTimeOps = 3
                if(schedule.substring(0,3) === 'Day'){
                  this.$data.MonthlyOps =1
                  var index = schedule.split(' ')                 
                  this.$data.Scheduletime.ScheduletimeDay = index[1]
                  this.$data.Scheduletime.ScheduletimeMonth1 = index[4]
                  this.$data.ScheduletimeMonth1Disable = false 
                  this.$data.ScheduletimeMonth2Disable = true 
                }else{
                  this.$data.MonthlyOps = 2 
                  var index = schedule.split(' ')
                  this.$data.num = index[1]
                  this.$data.week = index[2]
                  this.$data.Scheduletime.ScheduletimeMonth2 = index[5]
                  this.$data.ScheduletimeMonth1Disable = true 
                  this.$data.ScheduletimeMonth2Disable = false   
                }
              }
              this.$data.taskLv3Form.task_scheduletime = res1.data.data.task_scheduletime
              this.$data.taskLv3Form.task_startTime = res1.data.data.task_startTime
              this.$data.taskLv3Form.task_endTime = res1.data.data.task_endTime
              this.getRegularTaskList(rtnTask.task_name,'taskLv3FormRegularTasks', 3)              
            }else{
              this.$data.Scheduletime = {}
              this.$data.RegularTaskTimeOps = ''
              this.$data.week = ''
              this.$data.num = ''
              this.$data.DailyOps = ''
              this.$data.RegularTaskTimeOps = ''
            }      
          }else{
            this.getSubTaskList(rtnTask.task_name, 'taskLv3FormSubTasks', 3)  
            this.getTaskWorklogHistory(rtnTask.task_id, 'taskLv3FormHistories')
          }
          this.ruleControlLv3TaskItem('Edit', null)
          this.$data.taskLv3DialogVisible = true
        }
        if (rtnTask.task_level === 4) {
          // Clear existing data
          this.getActiveUserList()
          this.getTaskStatus(this.$data.taskLv3Form.task_status)
          this.getTaskType(null)
          this.$data.taskLv4Form = {}
          this.changeParentName('taskLv4Form')
          this.$data.taskLv4Form = res.data.data
          this.TypeTagChange()
          if(this.$data.taskLv4Form.task_deliverableTag!=null){
            this.$data.taskLv4Form.task_deliverableTag = this.$data.taskLv4Form.task_deliverableTag.split(",")            
          }
          if (Number(res.data.data.task_progress_nosymbol) < 100) {
            this.$data.taskLv4FormProgressStatus = 'success'
          } else {
            this.$data.taskLv4FormProgressStatus = 'exception'
          }
          if(res.data.data.task_TypeTag === 'Regular Task'){
            this.$data.taskLv4Form.task_status = this.$data.taskLv3Form.task_status
            const res1 = await http.post('/schedules/getSchedulesByTaskName',{
              reqTaskName : rtnTask.task_name
            })
            console.log(res1)
            if(res1.data.status === 0){
              this.$data.taskLv4Form.task_RegularTaskTime = res1.data.data.task_RegularTaskTime
              if(this.$data.taskLv4Form.task_RegularTaskTime === 'Daily'){
                if(res1.data.data.task_scheduletime === 'Every Weekday'){
                  this.$data.DailyOps = 1
                }else{
                  this.$data.DailyOps = 2          
                }
              }else{
                this.$data.Scheduletime = res1.data.data.task_scheduletime.substring(6,8)    
              }
              this.$data.taskLv4Form.task_scheduletime = res1.data.data.task_scheduletime
              this.$data.taskLv4Form.task_startTime = res1.data.data.task_startTime  
              this.$data.taskLv4Form.task_endTime = res1.data.data.task_endTime             
            }  
            this.getTaskWorklogHistory(rtnTask.task_id, 'taskLv4FormHistories')
          }
          this.ruleControlLv4TaskItem('Edit', null)
          this.$data.taskLv4DialogVisible = true
        }
      }
     },
    async getSubTaskList (iTaskName, iSubTaskListItem, iLevel) {
      this.$data.tasksSubTaskLoading = true
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
      this.$data.tasksSubTaskLoading = false
    },
    async getRegularTaskList (iTaskName, iSubTaskListItem, iLevel) {
      this.$data.tasksSubTaskLoading = true
      const res = await http.post('/tasks/getRegularTaskByTaskName', {
        reqTaskName: iTaskName
      })
      if (res.data.status === 0) {
        this[iSubTaskListItem] = []
        this[iSubTaskListItem] = res.data.data
      } else {
        this[iSubTaskListItem] = []
      }
      if (this[iSubTaskListItem].length > 0) {
        if (iLevel === 3) {
          console.log('Sub task > 0')
          for(var i = 0 ; i < this[iSubTaskListItem].length ; i++){
            this[iSubTaskListItem][i].task_status = this.$data.taskLv3Form.task_status
          }
          this.$data.taskLv3WorklogShow = false
          this.$data.lv3TaskItemRule.disableTaskEst = true
        }
      }
      this.$data.tasksSubTaskLoading = false
    },
    async getTaskWorklogHistory (iTaskId, iTaskHistory) {
      this.$data.tasksWorklogHistoriesLoading = true
      const res = await http.post('/worklogs/getWorklogHistoryByTaskId', {
        wTaskId: iTaskId
      })
      if (res.data.status === 0) {
        this[iTaskHistory] = []
        this[iTaskHistory] = res.data.data
      } else {
        this[iTaskHistory] = []
      }
      this.$data.tasksWorklogHistoriesLoading = false
    },
    async changeParentName (iObj) {
      console.log('changeParentName')
      console.log(this[iObj].task_parent_name)
      const res  = await http.post('/tasks/getTaskByName',{
        reqTaskName : this[iObj].task_parent_name
      })
      console.log(res)
      if(res.data.status ===0 && res.data.data != null ){
        this[iObj].task_TypeTag = res.data.data.task_TypeTag
      }
      if(this[iObj].task_TypeTag === 'Regular Task' ){
        this.$data.lv3TaskItemRule.showDeliverableTag = false
        this.$data.lv4TaskItemRule.showDeliverableTag = false
        this.$data.RegularTaskTimeVisible = true
        const res1 = await http.post('/schedules/getSchedulesByTaskName',{
           reqTaskName :res.data.data.task_name
        })
        console.log(res1.data.data)
        if(res1.data.status === 0){
          this.$data.taskLv4Form.task_scheduletime = res1.data.data.task_scheduletime
          this.$data.taskLv4Form.task_startTime = res1.data.data.task_startTime    
          this.$data.taskLv4Form.task_endTime = res1.data.data.task_endTime             
          this.$data.taskLv4Form.task_RegularTaskTime = res1.data.data.task_RegularTaskTime
          if(this.$data.taskLv4Form.task_RegularTaskTime === 'Daily'){
            if(res1.data.data.task_scheduletime === 'Every Weekday'){
              this.$data.DailyOps = 1
            }else{
              this.$data.DailyOps = 2          
            }
          }else{
            this.$data.Scheduletime = res1.data.data.task_scheduletime.substring(6,8)    
          }     
        }       
        if(this[iObj].task_status === 'Running' || this[iObj].task_status === 'Done'){
          this.$data.taskLv4WorklogDisabled = true
          this.$data.taskLv3WorklogDisabled = true
        }
      }
    },
    async createNewTask (iTaskLevel) {
      console.log('Create new task: ' + iTaskLevel)
      if (Number(iTaskLevel) === 1) {
        if (this.$data.userLevel > 8 && this.$data.userRole !== 'Admin') {
          this.$message.error('No right to create Level 1 task!')
          return
        }
        this.$data.taskLv1Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskType(null)
        this.getTaskStatus('Drafting')
        // Set data default value
        this.$data.taskLv1Form.task_parent_name = 'N/A'
        this.$data.taskLv1Form.task_status = 'Drafting'
        this.$data.taskLv1Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv1Form.task_level = 1
        this.$data.taskLv1Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        // Show or hide column
        this.ruleControlLv1TaskItem('Create')
        this.$data.taskLv1DialogVisible = true
      }
      // Create lv 2 task by top button
      if (Number(iTaskLevel) === 2) {
        if (this.$data.userLevel > 10 && this.$data.userRole !== 'Admin') {
          this.$message.error('No right to create Level 2 task!')
          return
        }
        this.$data.taskLv2Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatus('Drafting')
        this.$data.taskTypeArrayForLv2Task = []
        // Set data default value
        this.$data.taskLv2Form.task_status = 'Drafting'
        this.$data.taskLv2Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv2Form.task_level = 2
        this.$data.taskLv2Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        this.$data.taskLv2Form.task_progress_nosymbol = 0
        // Show or hide column
        this.ruleControlLv2TaskItem('Create', true)
        this.$data.taskLv2DialogVisible = true
      }
      if (Number(iTaskLevel) === 3) {
        this.$data.taskLv3Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatus('Drafting')
        this.$data.lv3TaskItemRule.showDeliverableTag = true
        this.$data.taskTypeArrayForLv2Task = []
        this.$data.RegularTaskTimeVisible = false
        // Set data default value
        this.$data.taskLv3Form.task_status = 'Drafting'
        this.$data.taskLv3Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv3Form.task_level = 3
        this.$data.taskLv3Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        this.$data.taskLv3Form.task_progress_nosymbol = 0
        // Show or hide column
        this.ruleControlLv3TaskItem('Create', true)
        this.$data.taskLv3DialogVisible = true
      }
      if (Number(iTaskLevel) === 4) {
        this.$data.taskLv4Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatus('Drafting')
        this.changeParentName('taskLv4Form')
        this.$data.lv4TaskItemRule.showDeliverableTag = true
        this.$data.taskTypeArrayForLv2Task = []
        this.$data.RegularTaskTimeVisible = false
        // Set data default value
        this.$data.taskLv4Form.task_status = 'Drafting'
        this.$data.taskLv4Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv4Form.task_level = 4
        this.$data.taskLv4Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        this.$data.taskLv4Form.task_progress_nosymbol = 0
        // Show or hide column

        this.ruleControlLv4TaskItem('Create', true)
        this.$data.taskLv4DialogVisible = true
      }
    },
    async createNewSubTask (iSubTaskLevel, iParentObj) {
      console.log('Create new sub task: ' + iSubTaskLevel)
      if (Number(iSubTaskLevel) === 2) {
        if (this.$data.userLevel > 10 && this.$data.userRole !== 'Admin') {
          this.$message.error('No right to create Level 2 task!')
          return
        }
        this.$data.taskLv2Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatus('Drafting')
        this.getTaskType(this[iParentObj].task_type)
        // Set data default value
        this.$data.taskLv2Form.task_status = 'Drafting'
        this.$data.taskLv2Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv2Form.task_level = 2
        this.$data.taskLv2Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        this.$data.taskLv2Form.task_progress_nosymbol = 0
        // Set parent data of sub task
        this.$data.taskLv2Form.task_parent_name = this[iParentObj].task_name
        this.$data.taskLv2Form.task_parent_desc = this[iParentObj].task_top_opp_name
        // Show or hide column
        this.ruleControlLv2TaskItem('Create', false)
        this.$data.taskLv2DialogVisible = true
      }
      if (Number(iSubTaskLevel) === 3) {
        this.$data.taskLv3Form = {}
        // Set dialog value
        this.$data.lv3TaskItemRule.showDeliverableTag = true
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
        console.log('Number(iSubTaskLevel) === 4')
        this.$data.taskLv4Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatus('Planning')
        console.log(this[iParentObj].task_name)
        // Set data default value
        const res  = await http.post('/tasks/getTaskByName',{
          reqTaskName : this[iParentObj].task_name
        })
        if(res.data.status ===0 && res.data.data != null ){
          this.$data.taskLv4Form.task_TypeTag = res.data.data.task_TypeTag
        }
        this.$data.taskLv4Form.task_status = res.data.data.task_status
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
    async createRegularTask (iSubTaskLevel, iParentObj) {
      console.log('Create regular task' )
      if (Number(iSubTaskLevel) === 3) {
        this.$data.taskLv3Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatus('Planning')
        // Set data default value
        this.$data.taskLv3Form.task_status = 'Planning'
        this.$data.taskLv3Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv3Form.task_level = 3
        // this.$data.MonthlyOps = ''
        // this.$data.Scheduletime = {}
        // this.$data.week = ''
        // this.$data.num =''
        this.$data.taskLv3Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        this.$data.taskLv3Form.task_progress_nosymbol = 0
        this.$data.taskLv3Form.task_TypeTag = 'Regular Task'
        this.$data.lv3TaskItemRule.showDeliverableTag = false
        this.$data.RegularTaskTimeVisible = true
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
        console.log(this[iParentObj])
        console.log("Number(iSubTaskLevel) === 4")
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatus(this[iParentObj].task_status)
        // Set data default value
        this.$data.taskLv4Form.task_status = this[iParentObj].task_status
        this.$data.taskLv4Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv4Form.task_level = 4
        // this.$data.DailyOps = ''
        // this.$data.MonthlyOps = ''
        // this.$data.Scheduletime = {}
        // this.$data.week = ''
        // this.$data.num =''
        this.$data.taskLv4Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        this.$data.taskLv4Form.task_progress_nosymbol = 0
        this.$data.taskLv4Form.task_TypeTag = 'Regular Task'
        this.$data.taskLv4Form.task_RegularTaskTime = this[iParentObj].task_RegularTaskTime
        this.$data.taskLv4Form.task_startTime = this[iParentObj].task_startTime
        this.$data.taskLv4Form.task_endTime = this[iParentObj].task_endTime
        this.$data.taskLv4Form.task_scheduletime = this[iParentObj].task_scheduletime
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
        this.$data.lv4TaskItemRule.showDeliverableTag = false        
      }
    },
    async createRegularTask (iSubTaskLevel, iParentObj) {
      console.log('Create regular task' )
      if (Number(iSubTaskLevel) === 3) {
        this.$data.taskLv3Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatus('Drafting')
        // Set data default value
        this.$data.taskLv3Form.task_status = 'Drafting'
        this.$data.taskLv3Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv3Form.task_level = 3
        this.$data.MonthlyOps = ''
        this.$data.Scheduletime = {}
        this.$data.week = ''
        this.$data.num =''
        this.$data.taskLv3Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        this.$data.taskLv3Form.task_progress_nosymbol = 0
        this.$data.taskLv3Form.task_TypeTag = 'Regular Task'
        this.$data.lv3TaskItemRule.showDeliverableTag = false
        this.$data.RegularTaskTimeVisible = true
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
        console.log("Number(iSubTaskLevel) === 4")
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatus('Drafting')
        // Set data default value
        this.$data.taskLv4Form.task_status = 'Drafting'
        this.$data.taskLv4Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv4Form.task_level = 4
        this.$data.DailyOps = ''
        this.$data.MonthlyOps = ''
        this.$data.Scheduletime = {}
        this.$data.week = ''
        this.$data.num =''
        this.$data.taskLv4Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        this.$data.taskLv4Form.task_progress_nosymbol = 0
        this.$data.taskLv4Form.task_TypeTag = 'Regular Task'
        this.$data.taskLv4Form.task_RegularTaskTime = this[iParentObj].task_RegularTaskTime
        this.$data.taskLv4Form.task_startTime = this[iParentObj].task_startTime
        this.$data.taskLv4Form.task_endTime = this[iParentObj].task_endTime
        this.$data.taskLv4Form.task_scheduletime = this[iParentObj].task_scheduletime
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
        this.$data.lv4TaskItemRule.showDeliverableTag = false        
      }
    },
    // 3. Level 1 task dialog
    startPlanTask (iObj) {
      var taskName = iObj.task_name
      var taskOppName = iObj.task_top_opp_name
      this.$store.dispatch('setNewPlanTaskName', '')
      this.$store.dispatch('setNewPlanTaskDesc', '')
      this.$store.dispatch('setNewPlanTaskName', taskName)
      this.$store.dispatch('setNewPlanTaskDesc', taskOppName)
      var url = '/Task/TaskPlan' + '?' + 'planTaskName=' + taskName + '&' + 'planTaskDesc=' + taskOppName
      this.$router.push({path: url})
    },
    async saveLv1Task () {
      if (this.$data.userLevel > 8 && this.$data.userRole !== 'Admin') {
        this.$message.error('No right to create Level 1 task!')
        return
      }
      var reqTask = this.$data.taskLv1Form
      if (reqTask != null) {
        if (this.isFieldEmpty(reqTask.task_name, 'Task number could not be empty!') ||
            this.isFieldEmpty(reqTask.task_type_id, 'Task type could not be empty!') ||
            this.isFieldEmpty(reqTask.task_top_opp_name, 'Opportunity Name could not be empty!') ||
            this.isFieldEmpty(reqTask.task_top_customer, 'Customer could not be empty!')) {
          return
        }
        if (reqTask.task_status === 'Planning' || reqTask.task_status === 'Running') {
          if (this.isFieldEmpty(reqTask.task_top_target_start, 'Target start time could not be empty!')) {
            return
          }
        }
        if (reqTask.task_status === 'Running' || reqTask.task_status === 'Done') {
          if (this.isFieldEmpty(reqTask.task_responsible_leader, 'Responsible leader could not be empty!')) {
            return
          }
        }
        if (reqTask.task_status === 'Done') {
          var result = await this.ifAllSubTasksDone(reqTask.task_name)
          if (!result) {
            this.$message.error('Exist sub task not Done!')
            return
          }
        }
        this.$data.taskLv1SaveBtnDisabled = true
        const res = await http.post('/tasks/saveTask', {
          reqTask: JSON.stringify(reqTask)
        })
        if (res.data.status === 0) {
          this.$message({message: 'Task created successfully!', type: 'success'})
        } else {
          this.$message({message: 'Task updated successfully!', type: 'success'})
        }
        this.$data.taskLv1SaveBtnDisabled = false
        this.openTaskById(res.data.data.Id)
        this.getTaskList(1, 20)
      }
    },
    ruleControlLv1TaskItem (iAction) {
      if (iAction === 'Edit') {
        // Set dialog default value
        this.$data.taskLv1DialogTitle = '1 - Business Opportunity'
        this.$data.activeTabForLv1 = 'tab_basic_info'
        this.$data.lv1TaskItemRule.showTaskNameInput = false
        this.$data.lv1TaskItemRule.disableTaskType = true
        this.$data.lv1TaskItemRule.showCreator = true
        this.$nextTick(() => {
          this.$refs.taskLv1Tabs.$children[0].$refs.tabs[2].style.display = ''
        })
      }
      if (iAction === 'Create') {
        this.$data.taskLv1DialogTitle = '1 - New Business Opportunity'
        this.$data.activeTabForLv1 = 'tab_basic_info'
        this.$data.lv1TaskItemRule.showTaskNameInput = true
        this.$data.lv1TaskItemRule.disableTaskType = false
        this.$data.lv1TaskItemRule.showCreator = false
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
      this.$data.taskLv1FormSubTasks = []
      this.$data.taskLv1DialogTitle = '1 - Business Opportunity'
      this.$data.activeTabForLv1 = 'tab_basic_info'
      done()
    },
    // 4. Level 2 task dialog
    async saveLv2Task () {
      var reqTask = this.$data.taskLv2Form
      if (reqTask != null) {
        if (this.isFieldEmpty(reqTask.task_parent_name, 'Task parent name could not be empty!') ||
            this.isFieldEmpty(reqTask.task_type_id, 'Task type could not be empty!') ||
            this.isFieldEmpty(reqTask.task_desc, 'Title could not be empty!')) {
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
        if (reqTask.task_status === 'Done') {
          var result = await this.ifAllSubTasksDone(reqTask.task_name)
          if (!result) {
            this.$message.error('Exist sub task not Done!')
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
        this.getTaskList(1, 20)
      }
    },
    ruleControlLv2TaskItem (iAction, iNeedInputParent) {
      console.log(iAction)
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
        this.$data.lv2TaskItemRule.showCreator = true
        this.$nextTick(() => {
          this.$refs.taskLv2Tabs.$children[0].$refs.tabs[2].style.display = '' // Show "Sub Tasks List" Tab
          this.$refs.taskLv2Tabs.$children[0].$refs.tabs[3].style.display = '' // Show "Sub Tasks List" Tab
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
        this.$data.lv2TaskItemRule.showCreator = false
        this.$nextTick(() => {
          this.$refs.taskLv2Tabs.$children[0].$refs.tabs[2].style.display = 'none' // Hide "Sub Tasks List" Tab
          this.$refs.taskLv2Tabs.$children[0].$refs.tabs[3].style.display = 'none' // Hide "Sub Tasks List" Tab
        })
      }
    },
    closeLv2TaskDialog (done) {
      console.log('Close lv 2 dialog')
      this.$data.taskLv2DialogVisible = false
      this.$data.taskLv2Form = {}
      this.$data.taskLv2Form.task_progress_nosymbol = 0
      this.$data.taskLv2FormSubTasks = []
      this.$data.taskLv2FormRegularTasks = []
      this.$data.taskLv2DialogTitle = '2 - Business Implementation'
      this.$data.activeTabForLv2 = 'tab_basic_info'
      done()
    },
    // 5. Level 3 task dialog
    async saveLv3Task () {
      console.log("debug")
      console.log(this.$data.taskLv3Form)
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
            this.isFieldEmpty(reqTask.task_desc, 'Title could not be empty!')||
            this.isFieldEmpty(reqTask.task_TypeTag, 'Type Tag could not be empty!')) {
          return
        }
        if(reqTask.task_TypeTag === 'Regular Task'){
          if(this.$data.taskLv3Form.task_RegularTaskTime === 'Weekly'&&this.$data.Scheduletime.ScheduletimeWeek!=null&&this.$data.week!=null){
            this.$data.taskLv3Form.task_scheduletime= "Recur every " +this.$data.Scheduletime.ScheduletimeWeek +" weeks(s) on:"+this.$data.week
          }else if(this.$data.taskLv3Form.task_RegularTaskTime === 'Monthly'){
            if(this.$data.MonthlyOps === 1&&this.$data.Scheduletime.ScheduletimeDay!=null&&this.$data.Scheduletime.ScheduletimeMonth1!=null){
              this.$data.taskLv3Form.task_scheduletime = "Day "+this.$data.Scheduletime.ScheduletimeDay+" of every " +this.$data.Scheduletime.ScheduletimeMonth1 +" month(s)"   
            }else if(this.$data.MonthlyOps === 2&&this.$data.taskLv3Form.task_RegularTaskTime === 'Monthly'&&this.$data.MonthlyOps === 2&&this.$data.num!=null&&this.$data.Scheduletime.ScheduletimeMonth2!=null&&this.$data.week!=null){
              this.$data.taskLv3Form.task_scheduletime = "The " +this.$data.num+" "+this.$data.week+" of every "+this.$data.Scheduletime.ScheduletimeMonth2 +" month(s)"}
          }else if(this.$data.taskLv3Form.task_RegularTaskTime === 'Daily'){
              if(this.$data.DailyOps === 1){
              this.$data.taskLv3Form.task_scheduletime = "Every Weekday"
              this.$data.taskLv4Form.task_scheduletime = "Every Weekday"
            }else{
              if(this.$data.Scheduletime.ScheduletimeDay!=null){ 
                this.$data.taskLv3Form.task_scheduletime = "Every "+this.$data.Scheduletime.ScheduletimeDay +" days"
                this.$data.taskLv4Form.task_scheduletime = "Every "+this.$data.Scheduletime.ScheduletimeDay +" days"           
              }
            }
          }
          if( this.$data.taskLv3Form.rangeRecurrence!=null){
            this.$data.taskLv3Form.task_startTime = this.$data.taskLv3Form.rangeRecurrence[0]
            this.$data.taskLv3Form.task_endTime = this.$data.taskLv3Form.rangeRecurrence[1]      
          }
          this.$data.lv3TaskItemRule.showRegularTaskList = true
          if( 
            this.isFieldEmpty(reqTask.task_RegularTaskTime, 'Recurrence pattern could not be empty!')||
            this.isFieldEmpty(reqTask.task_scheduletime, 'Scheduletime could not be empty!')||
            this.isFieldEmpty(reqTask.task_startTime, 'Range of recurrence could not be empty!')){
              return
            }
        }
        if (Number(reqTask.task_estimation) > 18) {
          this.$message.error('Task estimation could not be over 18 hours. If more effort required, please consider breaking down the task further!')
          return
        }
        if (reqTask.task_status === 'Running' || reqTask.task_status === 'Done') {
          if(reqTask.task_TypeTag === 'Regular Task'){
            console.log("reqTask.task_TypeTag === 'Regular Task'")
            this.$data.taskLv3WorklogShow = false
          }else{
            this.$data.taskLv3WorklogShow = true
            console.log("reqTask.task_TypeTag != 'Regular Task'")
            if (this.isFieldEmpty(reqTask.task_target_complete, 'Target complete date could not be empty!')) {
              return
            }
            if (this.isFieldEmpty(reqTask.task_assignee, 'Assignee could not be empty!')) {
              return
            }            
          }
        }
        if (reqTask.task_status === 'Done') {
          var result = await this.ifAllSubTasksDone(reqTask.task_name)
          if (!result) {
            this.$message.error('Exist sub task not Done!')
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
        if(reqTask.task_TypeTag === 'Regular Task'){
          const res1 = await http.post('/schedules/saveRegularTask',{
            reqRegularTaskTime : reqTask.task_RegularTaskTime,
            reqStartTime : reqTask.task_startTime,
            reqEndTime : reqTask.task_endTime,
            reqTaskId : res.data.data.TaskName,
            reqSchedule : reqTask.task_scheduletime,
          })      
        }
        if (res.data.status === 0) {
          this.$message({message: 'Task created successfully!', type: 'success'})
        } else {
          this.$message({message: 'Task updated successfully!', type: 'success'})
        }
        this.$data.lv3TaskItemRule.showSubTaskList = true
        this.$data.taskLv3SaveBtnDisabled = false
        this.openTaskById(res.data.data.Id)
        this.getTaskList(1, 20)
      }
    },
    ruleControlLv3TaskItem (iAction, iNeedInputParent) {
      console.log(iAction)
      if (iAction === 'Edit') {
        // Set Dialog Default Value
        this.$data.taskLv3DialogTitle = '3 - Executive Task'
        this.$data.activeTabForLv3 = 'tab_basic_info'
        this.$data.lv3TaskItemRule.showProgress = true
        // this.$nextTick(() => {
        //   this.$refs.taskLv3Tabs.$children[0].$refs.tabs[2].style.display = '' // Show "Sub Tasks List" Tab
        //   this.$refs.taskLv3Tabs.$children[0].$refs.tabs[3].style.display = '' // Show worklog history tab
        // })
        this.$data.lv3TaskItemRule.showProgress = true
        this.$data.lv3TaskItemRule.showCreator = true
        // Default value
        this.$data.lv3TaskItemRule.disableTaskEst = false
        // Common Rule for estimation and worklog button
        // Common Rule 1
        var statusIndex = this.getIndexOfValueInArr(this.$data.statusCollection, 'status_name', this.$data.taskLv3Form.task_status)
        this.$data.taskLv3WorklogShow = this.$data.statusCollection[statusIndex]['status_allow_worklog']
        this.$data.lv3TaskItemRule.disableTaskEst = this.$data.statusCollection[statusIndex]['status_disable_est']
        if(this.$data.taskLv3Form.task_TypeTag ==='Regular Task'){
          this.$data.taskLv3WorklogShow = false
        }        
        // Validate External Task(Pool Task/Auto Assign Task)
        if (!this.$data.taskLv3Form.task_creator.startsWith('PMT')) {
          this.$data.lv3TaskItemRule.disableTaskEst = true
          this.$data.lv3TaskItemRule.disableDesc = true
          this.$data.lv3TaskItemRule.disableStatus = true
          this.$data.lv3TaskItemRule.showRefPoolInput = false
          this.$data.lv3TaskItemRule.disableParentNameInput = true
          if (this.$data.taskLv3Form.task_type === 'Pool') {
            console.log('Pool Task')
            this.$data.taskLv3WorklogShow = false
            this.$data.lv3TaskItemRule.showRespLeader = false
            this.$data.lv3TaskItemRule.showSubTaskEst = false
            this.$data.lv3TaskItemRule.showTypeTag = false
            this.$data.lv3TaskItemRule.showDeliverableTag = false
            // this.$nextTick(() => {
            //   this.$refs.taskLv3Tabs.$children[0].$refs.tabs[2].style.display = 'none' // For ref pool, hide "Sub Tasks List" Tab
            //   this.$refs.taskLv3Tabs.$children[0].$refs.tabs[3].style.display = 'none' // For ref pool, hide "Worklog History" tab
            // })
          } else {
            console.log('Not Pool Task')
            this.$data.lv3TaskItemRule.showRespLeader = true
            this.$data.lv3TaskItemRule.showSubTaskEst = true
            this.$data.lv3TaskItemRule.showTypeTag = true
            this.$data.lv3TaskItemRule.showDeliverableTag = true
          }
        } else {
          console.log('PMT Task')
          this.$data.lv3TaskItemRule.disableDesc = false
          this.$data.lv3TaskItemRule.disableStatus = false
          this.$data.lv3TaskItemRule.showRefPoolInput = true
          this.$data.lv3TaskItemRule.showRespLeader = true
          this.$data.lv3TaskItemRule.showSubTaskEst = true
          this.$data.lv3TaskItemRule.showTypeTag = true
          this.$data.lv3TaskItemRule.disableParentNameInput = this.$data.statusCollection[statusIndex]['status_disable_change_parent']
        }
      }
      if (iAction === 'Create') {
        // Set Dialog Default Value
        this.$data.taskLv3DialogTitle = '3 - New Executive Task'      
        this.$data.activeTabForLv3 = 'tab_basic_info'
        // this.$nextTick(() => {
        //   this.$refs.taskLv3Tabs.$children[0].$refs.tabs[2].style.display = 'none' // Hide "Sub Tasks List" Tab
        //   this.$refs.taskLv3Tabs.$children[0].$refs.tabs[3].style.display = 'none' // Hide worklog history tab
        // })
        if (iNeedInputParent) {
          this.$data.lv3TaskItemRule.disableParentNameInput = false
        } else {
          this.$data.lv3TaskItemRule.disableParentNameInput = true
        }
        this.$data.RegularTaskTimeOps = ''
        this.$data.DailyOps = ''
        this.$data.MonthlyOps = ''
        this.$data.Scheduletime = {}
        this.$data.week = ''
        this.$data.num =''               
        this.$data.lv3TaskItemRule.disableTaskEst = false
        this.$data.lv3TaskItemRule.disableDesc = false
        this.$data.lv3TaskItemRule.disableStatus = false
        this.$data.lv3TaskItemRule.showRefPoolInput = true
        this.$data.lv3TaskItemRule.showRespLeader = true
        this.$data.lv3TaskItemRule.showSubTaskEst = false
        this.$data.lv3TaskItemRule.showProgress = false
        this.$data.taskLv3WorklogShow = false
        this.$data.lv3TaskItemRule.showCreator = false
        this.$data.lv3TaskItemRule.showRegularTaskList = false
        this.$data.lv3TaskItemRule.showSubTaskList = false
      }
    },
    closeLv3TaskDialog (done) {
      console.log('Close lv 3 dialog')
      this.$data.taskLv3DialogVisible = false
      this.$data.taskLv3Form = {}
      this.$data.taskLv3Form.task_progress_nosymbol = 0
      this.$data.taskLv3FormSubTasks = []
      this.$data.taskLv3FormRegularTasks = []
      this.$data.taskLv3FormHistories = []
      this.$data.taskLv3DialogTitle = '3 - Executive Task'
      this.$data.activeTabForLv3 = 'tab_basic_info'
      done()
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
          if(reqTask.task_TypeTag !== 'Regular Task') {
            this.$data.taskLv3WorklogShow = true
          //if (reqTask.task_TypeTag !== 'Public Task') {
            if (this.isFieldEmpty(reqTask.task_target_complete, 'Target complete date could not be empty!')) {
              return
            }
            if (this.isFieldEmpty(reqTask.task_assignee, 'Assignee could not be empty!')) {
              return
            }
          }else{
            this.$data.taskLv4WorklogShow = false
          }
        }
        this.$data.taskLv4SaveBtnDisabled = true
        if(this.$data.taskLv4Form.task_deliverableTag!=null&&typeof(this.$data.taskLv4Form.task_deliverableTag)==='object'){
            reqTask.task_deliverableTag = reqTask.task_deliverableTag.toString();             
        }
        const res = await http.post('/tasks/saveTask', {
          reqTask: JSON.stringify(reqTask)
        })
        const res1 = await http.post('/schedules/saveRegularTask',{
          reqRegularTaskTime : reqTask.task_RegularTaskTime,
          reqStartTime : reqTask.task_startTime,
          reqEndTime : reqTask.task_endTime,
          reqTaskId : res.data.data.TaskName,
          reqSchedule : reqTask.task_scheduletime,
        })  
        if (res.data.status === 0) {
          this.$message({message: 'Task created successfully!', type: 'success'})
        } else {
          this.$message({message: 'Task updated successfully!', type: 'success'})
        }
        this.$data.taskLv4SaveBtnDisabled = false
        this.openTaskById(res.data.data.Id)
        this.getTaskList(1, 20)
      }
    },
    ruleControlLv4TaskItem (iAction, iNeedInputParent) {
      if (iAction === 'Edit') {
        // Set Dialog Default Value
        this.$data.taskLv4DialogTitle = '4 - Workable Task'
        this.$data.activeTabForLv4 = 'tab_basic_info'
        // this.$nextTick(() => {
        //   this.$refs.taskLv4Tabs.$children[0].$refs.tabs[2].style.display = '' // Show worklog history tab
        // })
        this.$data.lv4TaskItemRule.showProgress = true
        this.$data.lv4TaskItemRule.showCreator = true
        this.$data.taskLv4WorklogShow = true
        // Common Rule for estimation and worklog button
        var statusIndex = this.getIndexOfValueInArr(this.$data.statusCollection, 'status_name', this.$data.taskLv4Form.task_status)
        // Common Rule 1
        this.$data.lv4TaskItemRule.disableTaskEst = this.$data.statusCollection[statusIndex]['status_disable_est']
        // Common Rule 2
        this.$data.taskLv4WorklogShow = this.$data.statusCollection[statusIndex]['status_allow_worklog']
        if(this.$data.taskLv4Form.task_TypeTag ==='Regular Task'){
          this.$data.taskLv4WorklogShow = false
        }
        this.$data.lv4TaskItemRule.disableParentNameInput = this.$data.statusCollection[statusIndex]['status_disable_change_parent']
      }
      if (iAction === 'Create') {
        // Set Dialog Default Value
        this.$data.taskLv4DialogTitle = '4 - New Workable Task'
        this.$data.activeTabForLv4 = 'tab_basic_info'
        // this.$nextTick(() => {
        //   this.$refs.taskLv4Tabs.$children[0].$refs.tabs[2].style.display = 'none' // Hide worklog history tab
        // })
        if (iNeedInputParent) {
          this.$data.lv4TaskItemRule.disableParentNameInput = false
        } else {
          this.$data.lv4TaskItemRule.disableParentNameInput = true
        }
        this.$data.lv4TaskItemRule.disableTaskEst = false
        this.$data.lv4TaskItemRule.showProgress = false
        this.$data.lv4TaskItemRule.showCreator = false
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
        var regularTaskForm = ''
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
        this.getSubTaskList(this[iObj].task_name, subTaskForm, taskLevel)
        this[iActiveTab] = 'tab_subtasks_list'
      }
      if(tab.name === 'tab_regular_list'){
        var subTaskForm = ''
        var regularTaskForm = ''
        if (taskLevel === 2) {
          regularTaskForm = 'taskLv2FormRegularTasks'
        }
        if (taskLevel === 3) {
          regularTaskForm = 'taskLv3FormRegularTasks'
        }    
        if (taskLevel === 4) {
          regularTaskForm = 'taskLv4FormRegularTasks'
        }
        this.getRegularTaskList(this[iObj].task_name,regularTaskForm, taskLevel)
        this[iActiveTab] = 'tab_regular_list'
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
      var taskTypeTag = this[iObj].task_TypeTag
      var taskAssigneeId = this[iObj].task_assignee
      if (taskTypeTag !== 'Public Task') {
        if (!this.checkIfAssigneeSameWithUser(taskAssigneeId)) {
          this.$message.error('You are not the task assignee, cannot record your effort on this task!')
          return
        }
      }
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
        this.$data.removeTaskDesc = iObj.task_desc
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
        this.getTaskList(1, 20)
      } else {
        this.$message.error(res.data.message)
      }
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
          var userList1 = res1.data.data
          this.$data.activeUserListForAll = []
          for (var f = 0; f < userList1.length; f++) {
            if (userList1[f].user_level > 0) {
              if (userList1[f].user_nickname !== null && userList1[f].user_nickname !== '') {
                userList1[f].user_eid = userList1[f].user_eid + ' (' + userList1[f].user_nickname + ')'
              }
              this.$data.activeUserListForAll.push(userList1[f])
            }
          }
        }
        var userListString = JSON.stringify(res.data.data)
        var userList = JSON.parse(userListString)
        this.$data.activeUserListForOthRespLeader = []
        for (var i = 0; i < userList.length; i++) {
          if (userList[i].user_level > 0 && userList[i].user_level <= 10) {
            if (userList[i].user_nickname !== null && userList[i].user_nickname !== '') {
              userList[i].user_eid = userList[i].user_eid + ' (' + userList[i].user_nickname + ')'
            }
            this.$data.activeUserListForOthRespLeader.push(userList[i])
          }
        }
        userList = []
        userList = JSON.parse(userListString)
        this.$data.activeUserListForLv1RespLeader = []
        for (var a = 0; a < userList.length; a++) {
          if (userList[a].user_level > 0 && userList[a].user_level <= 9) {
            if (userList[a].user_nickname !== null && userList[a].user_nickname !== '') {
              userList[a].user_eid = userList[a].user_eid + ' (' + userList[a].user_nickname + ')'
            }
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
          returnJson.responsible_leader = queryResult[i].task_responsible_leader
          returnJson.group_id = queryResult[i].task_group_id
          returnJson.reference = queryResult[i].task_reference
          returnJson.reference_desc = queryResult[i].task_reference_desc
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
        if (this[iObj].task_level === 4) {
          this[iObj].task_group_id = item.group_id
          this[iObj].task_reference = item.reference
          this[iObj].task_reference_desc = item.reference_desc
        }
      }
    },
    clearSelectForParentTask (iObj) {
      this[iObj].task_parent_name = null
      this[iObj].task_parent_desc = null
      this[iObj].task_TypeTag = null
      this[iObj].task_type_id = null
      this[iObj].task_responsible_leader = null
      this.$data.RegularTaskTimeVisible = false
      this[iObj].showDeliverableTag = true
      this[iObj].task_group_id = null
      this[iObj].task_reference = null
      this[iObj].reference_desc = null
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
      this[iObj].task_reference = item.value
      this[iObj].task_reference_desc = item.description
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
    async ifAllSubTasksDone (iTaskName) {
      if(iTaskName !== undefined && iTaskName !== null && iTaskName !== ''){
        const res = await http.get('/tasks/checkSubTaskDone', {
          reqTaskName: iTaskName
        })
        if (res.data.status === 0) {
          return true
        } else {
          return false
        }
      }
    },
    checkIfAssigneeSameWithUser (iAssigneeId) {
      var userId = Number(this.$store.getters.getUserId)
      var assigneeId = Number(iAssigneeId)
      if (userId !== null && userId > 0 && assigneeId !== null && assigneeId > 0) {
        if (userId === assigneeId) {
          return true
        }
      }
      return false
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
    checkEffortIsValid (iEffort) {
      var effort = Number(iEffort)
      if (effort % 0.5 === 0) {
        return true
      } else {
        return false
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
.breadcrumb-active {
  font-weight: bold;
}
.breadcrumb-click {
  cursor: pointer;
}
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]{
  -moz-appearance: textfield;
}
.el-textarea .el-textarea__inner {
  resize: vertical !important;
}

.collapse-span {
  margin-bottom: 5px;
}

.center-vertical{
  position: relative;
  top:50%;
  transform:translateY(-50%);
}
.center-horizontal{
  position: relative;
  left:50%;
  transform:translateX(-50%); 
}
</style>
