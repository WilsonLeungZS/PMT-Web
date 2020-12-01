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
          <el-col :span="4" style="height: 100%">
            <div class="tl-bar-item">
              <el-input size="small" :disabled="disabledSearch" placeholder="Search..." v-model="searchVal" class="tl-bar-item-input" clearable @keyup.enter.native="searchTask">
                <el-button size="small" :disabled="disabledSearch" slot="append" icon="el-icon-search" @click="searchTask"></el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="1" style="height: 100%">
            <div class="tl-bar-item">
              <el-tooltip class="item" effect="dark" content="New Task" placement="top-start">
                <el-button size="mini" :disabled="isEx" @click="createNewTask(formFilter.filterTaskLevel)" :style="{'background-color': btnColor, 'color': 'white'}" icon="el-icon-plus" class="tl-bar-item-btn"></el-button>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6" style="height: 100%">
            <div class="tl-bar-item">
              <span style="margin-right:15px; font-size: 14px">Full Task List Level</span>
              <el-radio-group size="small" v-model="formFilter.filterTaskLevel" @change="changeLevel()" >
                <el-radio-button label="1"></el-radio-button>
                <el-radio-button label="2"></el-radio-button>
                <el-radio-button label="3"></el-radio-button>
                <el-radio-button label="EX"></el-radio-button>
              </el-radio-group>              
            </div>
          </el-col>
          <el-col :span="10" style="height: 100%">
            <div class="tl-bar-item">
              <el-form size="small" :inline="true" :model="formFilter" label-width="100px" class="tl-bar-item">
                <el-form-item label="Assign to" v-show="isPathSelectionLv3 || isFullSelectionLv3">
                  <el-select v-model="formFilter.filterAssignTo" filterable style="width:100%">
                    <el-option label="" value=""></el-option>
                    <el-option v-for="(activeUser, index) in activeUserListForAll" :key="index" :label="activeUser.user_eid" :value="activeUser.user_id">
                      <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Skill Group" v-show="isFullSelectionLv3">
                  <el-select clearable v-model="formFilter.filterSkill" filterable style="width:100%" default-first-option>
                    <el-option v-for="item in skillTypeOps" :key="item" :label="item" :value="item"></el-option>
                  </el-select> 
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="1" style="height: 100%">
            <div class="tl-bar-item">
              <el-popover :disabled="formFilterdisable" placement="bottom" title="More Filter" width="300" trigger="click">
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
                  <el-row style="margin: 5px;" v-if="!taskListRule.showColForEx">
                    <el-col :span="8">Leading By</el-col>
                    <el-col :span="16">
                      <el-select v-model="formFilter.filterLeadingBy" filterable size="small" style="width:100%">
                        <el-option label="" value=""></el-option>
                        <el-option v-for="(activeUser, index) in activeUserListForLv1RespLeader" :key="index" :label="activeUser.user_eid" :value="activeUser.user_id">
                          <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                          <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-divider></el-divider>
                  <el-row v-if="isFullSelectionLv3" style="margin: 5px;">
                    <el-col :span="8">Opportunity</el-col>
                    <el-col :span="16">
                      <el-select clearable v-model="formFilter.filterOpportunity" filterable size="small" style="width:100%">
                        <el-option label="" value=""></el-option>
                        <el-option v-for="(opportunity, index) in OpportunityNameOps" :key="index" :label="opportunity.task_opp_name" :value="opportunity.task_name"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row v-if="isFullSelectionLv3" style="margin: 5px;">
                    <el-col :span="8">Time Group</el-col>
                    <el-col :span="16">
                    <el-select @keyup.enter.native="changeGroup()" @change="formSelectCheck" ref="fuzzySearch" @remove-tag="removeTag()" @focus="changeGroup()" v-model="formFilter.filterTimeGroup" multiple filterable default-first-option style="width: 100%" size="small">
                      <el-option label=" " value="0"></el-option>
                      <el-option :disabled="group.group_dis == true"  v-for="(group, index) in taskGroups" :key="index" :label="group.group_name" :value="group.group_id"></el-option>
                    </el-select>
                    </el-col>
                  </el-row>
                <el-button slot="reference" icon="el-icon-more-outline" size="mini" class="tl-bar-item-btn" style="border: 1px solid #DCDFE6"></el-button>
              </el-popover>
            </div>
          </el-col>
          <el-col :span="2" style="height: 100%">
            <div class="tl-bar-item">
              <el-button type="primary" @click="confirmFilterTask" :style="{'background-color': btnColor, 'color': 'white'}" icon="el-icon-circle-check" size="mini" class="tl-bar-item-btn"></el-button>
              <el-button type="info" @click="clearFilterTask" icon="el-icon-circle-close" size="mini" class="tl-bar-item-btn"></el-button>
            </div>
          </el-col>
        </el-row>
        <el-dialog title="Warning" :visible.sync="timeGroupConfirm" width="30%">
          <span>You haven't selected TimeGroup, which may lead to bad performance due to excessive query data.</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="timeGroupConfirm = false">Cancel</el-button>
            <el-button type="primary" @click="confirmNullforTimeGroup()">Confirm</el-button>
          </span>
        </el-dialog>
<!------- 2. End of Search Bar -->
<!------- 3. Task Path----->
        <el-row class="path-bar" v-if="showTaskPath">
          <el-col >
            <el-button @click.native="backToLv1()" type="text">[{{ lv1TaskNamePath }}] {{ lv1TaskPath }} </el-button> 
            <i v-if="!showForLv1AndLv2" class="el-icon-arrow-right"></i>
            <el-button @click.native="backToLv2()" v-if="!showForLv1AndLv2" type="text">[{{ lv2TaskNamePath }}] {{ lv2TaskPath }} </el-button> 
            <i v-if="!showForLv1AndLv2" class="el-icon-arrow-right"></i>
            <el-select collapse-tags @keyup.enter.native="changeGroup()" @change="selectCheck" v-if="!showForLv1AndLv2" ref="fuzzySearch" @remove-tag="removeTag()" @focus="changeGroup()" v-model="selectTaskGroup" multiple filterable default-first-option style="width: 300px" size="small">
              <el-option label=" " value="0"></el-option>
              <el-option :disabled="group.group_dis == true" v-for="(group, index) in taskGroups" :key="index" :label="group.group_name" :value="group.group_id"></el-option>
            </el-select>          
          </el-col>
        </el-row>
        <el-divider class="el-divider--horizontal1"></el-divider>
<!------- 3. End of Task Path------>
<!------- 4. Task List -->
        <el-row class="tl-main" v-if="showForLv1AndLv2">
          <el-col :span="24">
            <el-table :row-class-name="mouseClick" @row-click="onRowClick" :row-key="rowKey" v-loading="taskslistLoading" :data="taskslistData" class="tl-main-table" fit empty-text="No Data" :header-cell-style="{'background-color': headerColor, color:'white'}">
              <el-table-column prop="task_id" label="Id" v-if="false" key="1"></el-table-column>
              <el-table-column  prop="task_parent_name" label="Parent Id" width="105px" v-if="taskListRule.showColForLv2" key="2">
                <template slot-scope="scope">
                   <el-button type="text" @click.stop="openTaskByName(scope.row.task_parent_name)">{{scope.row.task_parent_name}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="task_name" label="Number" width="127px" key="3">
                <template slot-scope="scope">
                   <el-button type="text" @click.stop="openTaskById(scope.row.task_id)">{{scope.row.task_name}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="task_top_opp_name" label="Opportunity Name" show-overflow-tooltip align="left" min-width="300px" v-if="taskListRule.showColForLv1" key="4"></el-table-column>
              <el-table-column prop="task_top_target_start" label="Target Start" show-overflow-tooltip align="center" width="150px" v-if="taskListRule.showColForLv1" key="5"></el-table-column>
              <el-table-column prop="task_desc" label="Title" show-overflow-tooltip align="left" min-width="230px" v-if="!taskListRule.showColForLv1" key="6"></el-table-column>
              <el-table-column prop="task_top_customer" label="Customer" show-overflow-tooltip align="center" min-width="100px" v-if="taskListRule.showColForLv1" key="7"></el-table-column>
              <el-table-column prop="task_top_type_of_work" label="Type Of Work" align="center" min-width="110px" v-if="taskListRule.showColForLv1" key="8"></el-table-column>
              <el-table-column prop="task_status" label="Status" align="center" width="100px" v-if="taskListRule.showColForEx" key="9">
                <template slot-scope="scope">
                  <el-tag type="warning" effect="dark" size="mini" style="font-weight:bold" v-if="scope.row.task_status == 'Drafting'">{{scope.row.task_status}}</el-tag>
                  <el-tag effect="dark" size="mini" style="font-weight:bold" v-if="scope.row.task_status == 'Planning'">{{scope.row.task_status}}</el-tag>
                  <el-tag type="success" effect="dark" size="mini" style="font-weight:bold" v-if="scope.row.task_status == 'Running'">{{scope.row.task_status}}</el-tag>
                  <el-tag type="info" effect="dark" size="mini" style="font-weight:bold" v-if="scope.row.task_status == 'Done'">{{scope.row.task_status}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="task_top_team_sizing" label="Team Sizing" show-overflow-tooltip align="center" width="120px" v-if="taskListRule.showColForLv1" key="10"></el-table-column>
              <el-table-column prop="task_scope" label="Scope(Baseline)" show-overflow-tooltip align="center" width="190px" v-if="taskListRule.showColForLv2" key="11"></el-table-column>
              <el-table-column prop="task_effort" label="Effort" align="center" width="90px" v-if="!taskListRule.showColForLv1" key="12"></el-table-column>
              <el-table-column prop="task_estimation" label="Estimation" align="center" width="120px" v-if="!taskListRule.showColForLv1" key="13"></el-table-column>
              <el-table-column prop="task_responsible_leader" label="Leading By" show-overflow-tooltip align="center" width="160px" v-if="!taskListRule.showColForEx" key="14">
                <template slot-scope="scope">
                  <el-tooltip :content="scope.row.task_responsible_leader_full_name" placement="top" effect="dark">
                    <div slot>{{scope.row.task_responsible_leader}}</div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="task_skill" label="Related Skills" show-overflow-tooltip align="center" width="180px" v-if="taskListRule.showColForLv2" key="15"></el-table-column>
              <el-table-column fixed="right" label="Edit" align="center" v-if="!taskListRule.showColForEx" width="70px">
                <template slot-scope="scope">
                  <el-button @click.stop="removeTask(scope.row.task_id, scope.row.task_name, scope.row)" :style="{'border': 'none', 'color': 'white'}" type="danger" size="mini" icon="el-icon-delete"></el-button>
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
      <el-row class="tp-main" v-if="!showForLv1AndLv2">
        <el-col :span="24">
          <el-row v-if="subTaskListLoading" v-loading="true" element-loading-text="Data loading, please wait..." class="task-list-loading"></el-row>
          <div class="form_list_task_desc" v-if="noDataLoading">No data</div>               
            <div style="margin-bottom:20px"  v-for="(task,index) in lv2TaskList" :key="index" :name="index">
              <el-table  v-loading="tableLoading == index" :data="task" :row-class-name="getSubTaskRowClassName" :row-key="rowKey" :expand-row-keys="expandRowArray" size="small" class="tp-main-table tp-table-border" fit empty-text="No Data" :header-cell-style="{'background-color': headerColor, color:'white'}">
                <el-table-column type="expand">
                <template slot-scope="props">
                    <el-row>
                      <el-col :span="23" :offset="1">
                        <el-table :data="props.row.task_sub_tasks" size="small" style="width: 100%;" class="sub-task-table tl-plan-task-sub-task-table">
                          <el-table-column label="Id" prop="sub_task_id" v-if="false" key="1"></el-table-column>
                          <el-table-column label="Number" prop="sub_task_name" align="left" width="210px" key="2">
                            <template slot-scope="scope">
                              <el-button @click.stop="refreshTaskId = task.task_id; refreshTaskName = task.task_name;  refreshTaskIndex = index; openTaskById(scope.row.sub_task_id)" type="text" class="sub-tasks-name-btn" size="small">{{scope.row.sub_task_name}}</el-button>
                            </template>
                          </el-table-column>
                          <el-table-column label="Description" prop="sub_task_desc" align="left" show-overflow-tooltip key="3"></el-table-column>   
                          <el-table-column label="Status" prop="sub_task_status" align="center" width="110px" key="4">
                            <template slot-scope="scope">
                              <el-tag type="warning" effect="dark" size="mini" style="font-weight:bold" v-if="scope.row.sub_task_status == 'Drafting'">{{scope.row.sub_task_status}}</el-tag>
                              <el-tag effect="dark" size="mini" style="font-weight:bold" v-if="scope.row.sub_task_status == 'Planning'">{{scope.row.sub_task_status}}</el-tag>
                              <el-tag type="success" effect="dark" size="mini" style="font-weight:bold" v-if="scope.row.sub_task_status == 'Running'">{{scope.row.sub_task_status}}</el-tag>
                              <el-tag type="info" effect="dark" size="mini" style="font-weight:bold" v-if="scope.row.sub_task_status == 'Done'">{{scope.row.sub_task_status}}</el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column label="Effort" prop="sub_task_effort" align="center" width="70px" key="5"></el-table-column>
                          <el-table-column label="Est" prop="sub_task_estimation" align="center" width="70px" key="6"></el-table-column>
                          <el-table-column label="Sub-Tasks Est" prop="sub_task_none_estimation" align="center" width="130px" key="7"></el-table-column>
                          <el-table-column label="Leading By/Assignee" prop="sub_task_assignee" align="center" width="180px" key="8">
                            <template slot-scope="scope">
                              <el-tooltip :content="scope.row.sub_task_assignee_full_name" placement="top" effect="dark">
                                <div slot>{{scope.row.sub_task_assignee}}</div>
                              </el-tooltip>
                            </template>
                          </el-table-column>
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
                    <span v-if="scope.row.task_level === 2? true: false" disabled>{{scope.row.task_name}}</span>
                    <el-button v-if="scope.row.task_level === 2? false: true" size="mini" type="text" @click.stop="refreshTaskId = task.task_id; refreshTaskName = task.task_name;  refreshTaskIndex = index; openTaskById(scope.row.task_id)">{{scope.row.task_name}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="task_desc" label="Title" show-overflow-tooltip align="left" min-width="270px" key="3"></el-table-column>
                <el-table-column prop="task_group" label="Time Group" align="center" width="137px" key="4">
                  <template slot-scope="scope">
                    <el-select v-if="scope.row.task_level===3" :disabled="(scope.row.task_status==='Running'||scope.row.task_status==='Done')" @change="((val)=>{changeTaskGroup(val, scope.row.task_id, scope.row.task_parent_name, index)})" v-model="scope.row.task_group_id" style="width: 100%" size="mini">
                      <el-option label=" " value="0"></el-option>
                      <el-option v-for="(group, index) in taskGroups" :key="index" :label="group.group_name" :value="group.group_id" v-if="group.group_name !== 'All'"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="task_reference" label="Ref Pool" align="center" width="110px" key="5">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click.stop="openTaskByName(scope.row.task_reference)">{{scope.row.task_reference}}</el-button>
                  </template>
                </el-table-column>                            
                <el-table-column prop="task_status" label="Status" align="center" width="110px" key="6">
                  <template slot-scope="scope">
                    <el-tag type="warning" effect="dark" size="mini" style="font-weight:bold" v-if="scope.row.task_status == 'Drafting'">{{scope.row.task_status}}</el-tag>
                    <el-tag effect="dark" size="mini" style="font-weight:bold" v-if="scope.row.task_status == 'Planning'">{{scope.row.task_status}}</el-tag>
                    <el-tag type="success" effect="dark" size="mini" style="font-weight:bold" v-if="scope.row.task_status == 'Running'">{{scope.row.task_status}}</el-tag>
                    <el-tag type="info" effect="dark" size="mini" style="font-weight:bold" v-if="scope.row.task_status == 'Done'">{{scope.row.task_status}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="task_effort" label="Effort" align="center" width="70px" key="7"></el-table-column>
                <el-table-column prop="task_estimation" label="Est" align="center" width="70px" key="8"></el-table-column>
                <el-table-column prop="task_subtasks_estimation" label="Sub-Tasks Est" align="center" width="130px" key="9"></el-table-column>
                <el-table-column prop="task_assignee" label="Leading By/Assignee" align="center" width="180px" key="10">
                  <template slot-scope="scope">
                    <el-tooltip :content="scope.row.task_assignee_full_name" placement="top" effect="dark">
                      <div slot>{{scope.row.task_assignee}}</div>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="Edit" align="center" width="120">
                  <template slot-scope="scope">
                    <el-button @click.stop="refreshTaskId = task.task_id; refreshTaskName = task.task_name;  refreshTaskIndex = index; createTaskInPlanMode(scope.row.task_level+1, scope.row)" :style="{'border': 'none', 'color': 'white'}" type="success" size="mini" icon="el-icon-plus"></el-button>
                    <el-button v-if="scope.row.task_level===2" @click.stop="refreshLv2Task(task,index)" type="info" size="mini" icon="el-icon-refresh"></el-button>
                    <el-button v-if="scope.row.task_level===3" @click.stop="refreshTaskId = task.task_id; refreshTaskName = task.task_name;  refreshTaskIndex = index; removeTask(scope.row.task_id, scope.row.task_name, scope.row)" :style="{'border': 'none', 'color': 'white'}" type="danger" size="mini" icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
              </el-table> 
              <div >
                <el-row class="tl-pagination">
                  <el-col :span="24" class="tl-pagination-col">
                    <el-pagination v-if="pathSelection"
                      background
                      @current-change="handleCurrentChange1"
                      @click.native="getTaskIndex(task)"
                      :current-page="currentPage1"
                      :page-sizes="[20, 50, 100, 500]"
                      :page-size="pageSize1"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="task.length">
                    </el-pagination>
                    <el-pagination v-if="!pathSelection"
                      background
                      @current-change="((page)=>{handleCurrentChangeOfEachTable(page, task[0].task_name, index)})"
                      @size-change="((size)=>{handleSizeChangeOfEachTable(size, task[0].task_name, index)})"
                      :page-sizes="[20, 50, 100, 500]"
                      layout="total, sizes, prev, pager, next, jumper"
                      :current-page="task[0].task_current_page"
                      :page-size="task[0].task_page_size"
                      :total="task[0].task_length">
                    </el-pagination>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
<!------- 4. End of Task List -->
<!------- 7. Level 1 Task Details Dialog -->
    <el-dialog :before-close="closeLv1TaskDialog" :title="taskLv1DialogTitle" :visible.sync="taskLv1DialogVisible" :width="dialogWidth" style="min-width: 600px;" :close-on-click-modal="false" class="tl-taskform abow_dialog">
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
<!------- 7. End of Level 1 Task Details Dialog -->
<!------- 8. Level 2 Task Details Dialog -->
    <el-dialog :before-close="closeLv2TaskDialog" :title="taskLv2DialogTitle" :visible.sync="taskLv2DialogVisible" :width="dialogWidth" style="min-width: 500px;" :close-on-click-modal="false" class="tl-taskform">
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
                  <span>{{ taskLv2Form.task_name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1" >
                <el-form-item label="Task Type" prop="task_type_id">
                  <el-select :disabled="lv2TaskItemRule.disableTaskType" v-model="taskLv2Form.task_type_id" style="width: 100%">
                    <el-option v-for="(tasktype, index) in taskTypeArrayForLv2Task" :key="index" :label="tasktype.type_name" :value="tasktype.type_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Skills">
                  <el-select  v-model="taskLv2Form.task_skill" multiple filterable default-first-option style="width: 100%">
                    <el-option v-for="item in skillTypeOps" :key="item" :label="item" :value="item"></el-option>
                  </el-select>  
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1" >
                <el-form-item label="Time Type">
                    <el-radio-group v-model="taskLv2Form.task_time_type">
                      <el-radio label="Sprintly">Sprintly</el-radio>
                      <el-radio label="Weekly">Weekly</el-radio>
                      <el-radio label="Monthly">Monthly</el-radio>
                      <el-radio label="Others">Others</el-radio>
                    </el-radio-group>
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
                  <el-col :span="24">
                    <el-input v-model="taskLv2Form.task_effort" disabled>
                      <template slot="append" style="font-size:16px; width:100%">hrs</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Estimation">
                  <el-col :span="24">
                    <el-input :disabled="lv2TaskItemRule.disableTaskEst" v-model="taskLv2Form.task_estimation" type="number">
                      <template slot="append" style="font-size:16px; width:100%">hrs</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-form-item label="Sub-Tasks Est" v-if="lv2TaskItemRule.showSubTaskEst">
                  <el-col :span="24">
                    <el-input v-model="taskLv2Form.task_subtasks_estimation" disabled>
                      <template slot="append" style="font-size:16px; width:100%">hrs</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- Second Tab -->
          <!-- Normal Sub Task List -->
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
          <el-tab-pane label="Regular-Tasks List" name="tab_regular_tasks_list">
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
<!------- 8. End Level 2 Task Details Dialog -->
<!------- 9. Level 3 Task Details Dialog -->
    <el-dialog :before-close="closeLv3TaskDialog" :title="taskLv3DialogTitle" :visible.sync="taskLv3DialogVisible" :width="dialogWidth" style="min-width: 500px;" :close-on-click-modal="false" class="tl-taskform">
      <el-form ref="form" :model="taskLv3Form" label-width="140px" label-position="left" class="tl-edit-form" :rules="taskLv3FormRules" :disabled="disableLv3Form">
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
                <el-form-item label="Type Tag" prop="task_type_tag">
                  <el-select @change="changeTaskTypeTag" v-model="taskLv3Form.task_type_tag" style="width: 100%" :disabled="lv3TaskItemRule.disableTypeTag">
                    <el-option
                      v-for="item in typeTagOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>                  
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1" v-if="lv3TaskItemRule.showDeliverableTag">
                <el-form-item label="Deliverable Tag">
                  <el-select  v-model="taskLv3Form.task_deliverable_tag" multiple filterable allow-create default-first-option style="width: 100%">
                    <el-option v-for="item in DeliverOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>            
                </el-form-item>
              </el-col>
            </el-row> 
            <el-form-item label="Ref External Task" v-if="lv3TaskItemRule.showRefPoolInput">
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
              <el-col :span="24" v-if="lv3TaskItemRule.showTaskGroup&&lv3TaskItemRule.showDeliverableTag">
                <el-form-item label="Time Group">
                  <el-select :disabled="taskLv3TimeGroupDisabled" v-model="taskLv3Form.task_group_id" @change="selectLv3TaskGroup" style="width: 100%" placeholder="Select Task Group...">
                    <el-option label="" value=""></el-option>
                    <el-option v-for="(taskgroup, index) in taskGroups" :key="index" :label="taskgroup.group_name" :value="taskgroup.group_id" v-if="taskgroup.group_name !== 'All'"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
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
                  <el-select :disabled="lv3TaskItemRule.disableStatus" v-model="taskLv3Form.task_status" @change = "statusChange" style="width: 100%">
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
              <el-col :span="12" :offset="1" v-if="lv3TaskItemRule.showActualComplete">
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
              <el-col :span="12" :offset="1" v-if="lv3TaskItemRule.showRespLeader">
                <el-form-item label="Assignee">
                  <el-select :disabled="lv3TaskItemRule.disableAssignee" filterable v-model="taskLv3Form.task_assignee" style="width: 100%">
                    <el-option v-for="(activeUser, index) in activeUserListForAll" :key="index" :label="activeUser.user_eid" :value="activeUser.user_id">
                      <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11" v-if="!lv3TaskItemRule.showRespLeader">
                <el-form-item label="Assignee">
                  <el-select  filterable v-model="taskLv3Form.task_assignee" style="width: 100%">
                    <el-option label=" " value=""></el-option>
                    <el-option v-for="(activeUser, index) in activeUserListForAll" :key="index" :label="activeUser.user_eid" :value="activeUser.user_id">
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
                  <el-col :span="24">
                    <el-input v-model="taskLv3Form.task_effort" disabled>
                      <template slot="append" style="font-size:16px; width:100%">hrs</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Estimation">
                  <el-col :span="24">
                    <el-input :disabled="lv3TaskItemRule.disableTaskEst" v-model="taskLv3Form.task_estimation" type="number">
                      <template slot="append" style="font-size:16px; width:100%">hrs</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-form-item label="Sub-Tasks Est" v-if="lv3TaskItemRule.showSubTaskEst">
                  <el-col :span="24">
                    <el-input v-model="taskLv3Form.task_subtasks_estimation" disabled>
                      <template slot="append" style="font-size:16px; width:100%">hrs</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Progress" v-if="lv3TaskItemRule.showProgress">
              <el-progress class="tl-edit-form-progress" :text-inside="true" :stroke-width="24" :percentage="Number(taskLv3Form.task_progress_nosymbol)" :status="taskLv3FormProgressStatus"></el-progress>
            </el-form-item>
          </el-tab-pane>
          <!-- End Second Tab -->
          <!-- Recurrence Tab -->
          <el-tab-pane label="Recurrence" name="tab_recurrence">
            <el-divider content-position="left">Schedule Option</el-divider>
            <el-row>
              <el-col :offset="1" :span="3" style="border-right: 1px solid #DCDFE6">
                <el-radio-group v-model="taskLv3Form.task_recurrence_options" :disabled="lv3TaskItemRule.disableRecurrence">
                  <el-radio style="padding:10px 0" label="Weekly">Weekly</el-radio><br>
                  <el-radio style="padding:10px 0" label="Monthly">Monthly</el-radio><br>
                </el-radio-group>
              </el-col>
              <el-col :offset="1" :span="17">            
                <div v-if="taskLv3Form.task_recurrence_options === 'Weekly'">
                  Recur every week on:
                  <el-select v-model="taskLv3Form.task_recurrence_sch_weeks" size="small" style="margin-left: 10px; width: auto" multiple clearable :disabled="lv3TaskItemRule.disableRecurrence">
                    <el-option label="Sunday" value="SUN"></el-option>
                    <el-option label="Monday" value="MON"></el-option>
                    <el-option label="Tuesday" value="TUE"></el-option>
                    <el-option label="Wednesday" value="WED"></el-option>
                    <el-option label="Thursday" value="THU"></el-option>
                    <el-option label="Friday" value="FRI"></el-option>
                    <el-option label="Saturday" value="SAT"></el-option>
                  </el-select>
                </div>
                <div v-if="taskLv3Form.task_recurrence_options === 'Monthly'"> 
                  Recur every month on (day):
                  <el-select v-model="taskLv3Form.task_recurrence_sch_days" size="small" style="margin-left: 10px; width: auto" multiple clearable :disabled="lv3TaskItemRule.disableRecurrence">
                    <el-option v-for="day in 31" :key="day" :label="day" :value="day"></el-option>
                  </el-select>
                </div>                    
              </el-col>             
            </el-row>
            <el-divider content-position="left">Time Range</el-divider>
            <el-row>
              <el-col :span="16">
                <el-date-picker v-model="taskLv3Form.task_recurrence_sch_time_range" type="daterange" start-placeholder="Start Date" end-placeholder="End Date" value-format="yyyy-MM-dd"  style="width:auto"></el-date-picker>
              </el-col>
            </el-row>                  
          </el-tab-pane>
          <!-- One-off Sub Task -->
          <el-tab-pane label="Sub-Tasks List" name="tab_subtasks_list">
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
          <!-- Regular Sub Task -->
          <el-tab-pane label="Sub-Tasks List" name="tab_regular_tasks_list">
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
          <!-- Worklog List Tab -->
          <el-tab-pane label="Worklogs List" name="tab_worklog_histories">
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
        <el-button :disabled="taskLv3SaveBtnDisabled" @click="saveLv3Task()" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="medium">Save</el-button>
      </span>
    </el-dialog>
<!------- 9. End Level 3 Task Details Dialog -->
<!------- 10. Level 4 Task Details Dialog -->
    <el-dialog :before-close="closeLv4TaskDialog" :title="taskLv4DialogTitle" :visible.sync="taskLv4DialogVisible" :width="dialogWidth" style="min-width: 500px;" :close-on-click-modal="false" class="tl-taskform">
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
                <el-form-item label="Type Tag" prop="task_type_tag">
                  <span>{{taskLv4Form.task_type_tag}}</span>                
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1"  v-if="lv3TaskItemRule.showDeliverableTag" >
                <el-form-item label="Deliverable Tag">
                  <el-select disabled  v-model="taskLv4Form.task_deliverable_tag" multiple filterable allow-create default-first-option style="width: 100%">
                    <el-option v-for="item in DeliverOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>            
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Ref External Task" v-if="taskLv4Form.task_reference != null && taskLv4Form.task_reference != ''">
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
                  <el-select :disabled="lv4TaskItemRule.disableStatus" v-model="taskLv4Form.task_status" @change = "statusChange" style="width: 100%">
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
              <el-col :span="12" :offset="1" v-if="lv4TaskItemRule.showActualComplete">
                <el-form-item label="Actual Complete">
                  <el-date-picker v-model="taskLv4Form.task_actual_complete" type="date" style="width: 100%" placeholder="Select Date..." value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Responsible Leader">
                  <el-select v-model="taskLv4Form.task_responsible_leader" style="width: 100%" disabled>
                    <el-option v-for="(activeUser, index) in activeUserListForOthRespLeader" :key="index" :label="activeUser.user_eid" :value="activeUser.user_id">
                      <span style="float: left; margin-right:20px">{{ activeUser.user_eid }}</span>
                      <span style="float: right; color: #8492a6; font-size: 12px">Level - {{ activeUser.user_level }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-form-item label="Assignee">
                  <el-select :disabled="lv4TaskItemRule.disableAssignee" filterable v-model="taskLv4Form.task_assignee" style="width: 100%">
                    <el-option label=" " value=""></el-option>
                    <el-option v-for="(activeUser, index) in activeUserListForAll" :key="index" :label="activeUser.user_eid" :value="activeUser.user_id">
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
                  <el-col :span="24">
                    <el-input v-model="taskLv4Form.task_effort" disabled>
                      <template slot="append" style="font-size:16px; width:100%">hrs</template>
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Estimation">
                  <el-col :span="24">
                    <el-input :disabled="lv4TaskItemRule.disableTaskEst" v-model="taskLv4Form.task_estimation" type="number">
                      <template slot="append" style="font-size:16px; width:100%">hrs</template>
                    </el-input>
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
<!------- 10. End Level 4 Task Details Dialog -->
<!------- 11. Record Worklog Dialog -->
    <el-dialog title="Record Worklog" :visible.sync="worklogDialogVisible" width="28%" style="min-width: 1100px" :close-on-click-modal="false">
      <el-form :model="worklogForm" label-width="70px" class="tl-worklog-form">
        <el-form-item label="Task" >
          <span style="font-size: 17px">{{worklogForm.worklog_task}}</span>
        </el-form-item>
        <el-form-item label="Date">
          <el-date-picker v-model="worklogForm.worklog_date" type="date" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="Effort" >
          <el-input v-model="worklogForm.worklog_effort" type="number">
            <template slot="append" style="font-size:16px; width:100%">hrs</template>
          </el-input>
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
<!------- 11. End Record Worklog Dialog -->
<!------- 12. Remove Task Dialog -->
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
<!------- 12. End Remove Task Dialog -->
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
import Vue from "vue"
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
      headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
      // Task List Value
      searchVal: '',
      disabledSearch: false,
      formFilter: {
        filterTaskLevel: 1,
        filterAssignTo: '',
        filterStatus: '',
        filterLeadingBy: '',
        filterShowRefPool: false,
        filterTimeGroup : [],
        filterOpportunity: '',
        filterSkill: ''
      },
      currentPage: 1,
      pageSize: 20,
      currentPage1: 1,
      pageSize1: 20,
      tasksTotalSize: 0,
      taskslistData: [],
      taskslistLoading: false,
      subTaskListLoading: true,
      tasksSubTaskLoading: false,
      tasksWorklogHistoriesLoading: false,
      pathSelection: true,
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
      taskLv2SaveBtnDisabled: false,
      // Level 3 Task Dialog Value
      taskLv3DialogVisible: false,
      disableLv3Form: false,
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
      taskLv3TimeGroupDisabled : false,
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
        showColForPool: false,
        showColForEx: false
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
        showSubTaskList : false,
        showTaskGroup: true,
        disableAssignee: false,
        disableRecurrence: false
      },
      taskLv3FormRules: {
        task_parent_name: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_type_id: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_desc: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_type_tag: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_regular_task_time: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_schedule_time: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_startTime: [{required: true, message: 'Could not be empty', trigger: 'blur'}]
      },
      lv4TaskItemRule: {
        disableParentNameInput: true,
        disableTaskEst: false,
        showProgress: true,
        showCreator: true,
        showDeliverableTag:true,
        disableAssignee: false
      },
      taskLv4FormRules: {
        task_parent_name: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_type_id: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_desc: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_type_tag: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_regular_task_time: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
        task_schedule_time: [{required: true, message: 'Could not be empty', trigger: 'blur'}],
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
      removeTaskParentName: '',
      removeTaskDesc: '',
      // Common Value
      //Dialog
      dialogWidth: '70%',
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
      expandRowArray: [],
      //Path 
      showTaskPath : false,
      lv1TaskPath : '',
      lv1TaskNamePath: '',
      lv2TaskPath : '',
      lv2TaskNamePath: '',
      lv2TaskList: [],
      isFullSelectionLv3: false,
      isPathSelectionLv3: false,
      // Tab Item Value
      isChange : true,
      defaultTimeGroup:[],
      timeGroupConfirm : false,      
      showForLv1AndLv2 : true,
      selection : {},
      // Task Group
      currentTaskGroupId : '',
      taskGroups : [],
      selectTaskGroup : [],
      //Filter Table
      OpportunityNameOps: [],
      skillTypeOps:  [],
      formFilterdisable:false,
      //Data
      TaskLv2Id: '',
      currentTask: [],
      tableLoading: null,
      noDataLoading: false,
      isEx : false,
      currentTablePage: 1,
      currentLevel : '',
      failToCreateL4 : false
    }
  },
  watch: {
    lv1TaskNamePath(newVal, oldVal) {
      console.log('Lv 1 Path change', oldVal, ' -> ', newVal)
      if (newVal != null && newVal != '' && newVal != undefined) {
        console.log('release search')
        this.$data.disabledSearch = true
      } else {
        console.log('Need to disabled search')
        this.$data.disabledSearch = false
      }
    }

  },
  methods: {
    //mouse click css for path
    mouseClick() {
      return 'mouseClick'
    },
    getSubTaskRowClassName ({row, rowIndex}) {
      if(row!=null){
        if(Number(row.task_level) === 2 && row.task_sub_tasks.length === 0){
          return 'row-expand-cover row-height-line'
        }else if (row.task_sub_tasks.length === 0) {
          return 'row-expand-cover'
        }        
      }
      //row.index = rowIndex;
    },
    async onRowClick (row, event, column) {
      console.log('Click to open row')
      this.$data.formFilter.filterStatus = ''
      this.$data.formFilter.filterLeadingBy = ''
      this.$data.formFilter.filterAssignTo = ''
      this.$data.formFilter.filterOpportunity = ''
      this.$data.formFilter.filterSkill = ''
      if(row != null){
          this.$data.formFilterdisable = true
          this.$data.selection = row
          var iTaskId = this.$data.selection.task_name
          var iTaskLevel = this.$data.selection.task_level
          if (Number(this.$data.formFilter.filterTaskLevel) === 2) {
            console.log('Click in full lv2 task')
            this.$data.lv1TaskPath = await this.getTaskTOPDesc(this.$data.selection.task_parent_name)
            this.$data.lv1TaskNamePath = this.$data.selection.task_parent_name
            this.$data.lv2TaskPath = await this.getTaskTOPDesc(this.$data.selection.task_name)
            this.$data.lv2TaskNamePath = this.$data.selection.task_name
            this.$data.formFilter.filterTaskLevel = 1
          }
          this.$data.isPathSelectionLv3 = false
          this.$data.TaskLv2Id = iTaskId
          this.$data.selectTaskGroup = []
          if (Number(this.$data.formFilter.filterTaskLevel) === 1 || Number(this.$data.formFilter.filterTaskLevel) === 2) {
            this.$data.taskslistData = []
            this.$data.lv2TaskList = []
            this.$data.pathSelection = true    
            this.$data.showTaskPath = true
            if (iTaskLevel === 1) {
              this.$data.currentLevel = 2
              this.$data.lv1TaskPath = await this.getTaskTOPDesc(iTaskId);
              this.$data.lv1TaskNamePath = iTaskId
              this.getLevel2TaskListByParentTask(iTaskId, 1, 20)
              this.$data.showForLv1AndLv2 = true
            } else if (iTaskLevel === 2) {
              this.$data.currentLevel = 3
              this.$data.subTaskListLoading = true
              this.$data.isChange = true
              this.$data.lv2TaskList = []
              this.$data.lv2TaskPath = await this.getTaskTOPDesc(iTaskId);
              this.$data.lv2TaskNamePath = iTaskId
              this.ruleShowListColumn(3)
              this.$data.showForLv1AndLv2 = false
              this.$data.isPathSelectionLv3 = true
              await this.getTaskGroup(0, false, true)
              if (this.$data.isChange) {
                for(var i = 0 ; i < this.$data.taskGroupArray.length ; i++){
                  this.$data.selectTaskGroup.push(this.$data.taskGroupArray[i])  
                }        
              }
              await this.openTaskTab(iTaskId, 1, 20)  
              this.getTaskGroup(0,true,true)
              this.$data.subTaskListLoading = false
            }  
          }
         this.$data.formFilterdisable = false
      }
    },
    rowKey (row) {
      return row.task_id
    },
    changeInput () {
      this.$forceUpdate()
    },
    confirmFilterTask () {
      if(this.$data.formFilter.filterTimeGroup.length == 0 && Number(this.$data.formFilter.filterTaskLevel) == 3 ){
        this.$data.timeGroupConfirm = true
      }else{
        this.filterTask()
      }
    },
    confirmNullforTimeGroup () {
      this.$data.timeGroupConfirm = false
      this.filterTask()
    },
    backToLv1 () {
      this.$data.showForLv1AndLv2 = true
      this.$data.showTaskPath = false
      this.$data.pathSelection = false
      this.$data.formFilter.filterStatus = ''
      this.$data.formFilter.filterLeadingBy = ''
      this.$data.formFilter.filterAssignTo = ''
      this.$data.formFilter.filterOpportunity = ''
      this.$data.formFilter.filterSkill = ''
      this.$data.formFilter.filterTimeGroup = []
      this.$data.lv1TaskNamePath = ''
      this.$data.lv1TaskPath = ''
      this.$data.lv2TaskNamePath = ''
      this.$data.lv2TaskPath = ''
      this.filterTask()
    },
    backToLv2 () {
      console.log('Click to return to lv2 task list')
      this.$data.showForLv1AndLv2 = true
      var row = {}
      row.task_name = this.$data.lv1TaskNamePath
      row.task_level = 1
      console.log(row)
      this.$data.formFilter.filterStatus = ''
      this.$data.formFilter.filterLeadingBy = ''
      this.$data.formFilter.filterAssignTo = ''
      this.$data.formFilter.filterOpportunity = ''
      this.$data.formFilter.filterSkill = ''
      this.$data.formFilter.filterTimeGroup = []
      this.$data.lv2TaskNamePath = ''
      this.$data.lv2TaskPath = ''
      this.onRowClick(row)
    },
    changeLevel () {
      this.$data.pathSelection = false
      this.$data.formFilter.filterStatus = ''
      this.$data.formFilter.filterLeadingBy = ''
      this.$data.formFilter.filterAssignTo = ''
      this.$data.formFilter.filterOpportunity = ''
      this.$data.formFilter.filterSkill = ''
      this.$data.formFilter.filterTimeGroup = []
      this.$data.lv1TaskNamePath = ''
      this.$data.lv1TaskPath = ''
      this.$data.lv2TaskNamePath = ''
      this.$data.lv2TaskPath = ''
      this.filterTask()
    },
    // 1. Task List Function (Filter Critera/Search Task/Get Task List)
    async filterTask () {
      console.log('Filter Task Start')
      this.$data.taskGroupArray = []
      this.$data.taskslistData = []
      this.$data.lv2TaskList = []
      this.$data.isEx = false
      this.getActiveUserList()
      if((Number(this.$data.formFilter.filterTaskLevel) === 1 || Number(this.$data.formFilter.filterTaskLevel) === 2) && this.$data.pathSelection === false ){
        this.$data.formFilter.filterShowRefPool = false
        if(this.$data.formFilter.filterTimeGroup!=[]){
          this.$data.formFilter.filterTimeGroup = []
        }
        if(Number(this.$data.formFilter.filterTaskLevel) === 2){
          this.$data.currentLevel = 2
        }else{
          this.$data.currentLevel = 1
        }
        this.$data.showTaskPath = false
        this.$data.isFullSelectionLv3 = false
        this.$data.isPathSelectionLv3 = false
        this.getTaskList(1, 20)
      } else if ((Number(this.$data.formFilter.filterTaskLevel) === 1 || Number(this.$data.formFilter.filterTaskLevel) === 2) && this.$data.pathSelection === true ){
        console.log('Path Selection filter start ->', this.$data.pathSelection)
        this.$data.formFilter.filterShowRefPool = false
        if (this.$data.formFilter.filterTimeGroup != []) {
          this.$data.formFilter.filterTimeGroup = []
        }
        this.$data.showTaskPath = true
        this.$data.isFullSelectionLv3 = false
        if (this.$data.lv1TaskNamePath != '' && this.$data.lv2TaskNamePath != '' ) {
          this.$data.isPathSelectionLv3 = true
          await this.openTaskTab(this.$data.lv2TaskNamePath, 1, 20) 
        } 
        if (this.$data.lv1TaskNamePath != '' && this.$data.lv2TaskNamePath == '' ) {
          this.$data.isPathSelectionLv3 = false
          await this.getLevel2TaskListByParentTask(this.$data.lv1TaskNamePath, 1, 20)
        }
        this.getTaskGroup(0, true, true)
      } else if (Number(this.$data.formFilter.filterTaskLevel) === 3) {
        this.$data.pathSelection = false
        this.$data.formFilter.filterShowRefPool = false
        this.$data.subTaskListLoading = true
        this.$data.showForLv1AndLv2 = false
        this.$data.showTaskPath  = false
        this.$data.isFullSelectionLv3 = true
        this.$data.isPathSelectionLv3 = true
        await this.getTaskGroup(0,false,true)
        await this.getTaskList(1, 20)
        await this.getTaskGroup(0,true,true)
        this.$data.subTaskListLoading = false     
      } else {
        this.$data.isEx = true
        this.$data.formFilter.filterShowRefPool = true
        this.$data.showForLv1AndLv2 = true
        this.$data.showTaskPath  = false
        this.$data.isFullSelectionLv3 = false
        this.$data.isPathSelectionLv3 = false
        this.getTaskList(1, 20)
      }
    },
    async refreshLv2Task (iTask,index) {
      console.log('Start to refresh level 2 task')
      var reqTaskGroupId = []
      if(Number(this.$data.formFilter.filterTaskLevel) === 3){
        reqTaskGroupId = this.$data.formFilter.filterTimeGroup
      }else{
        reqTaskGroupId = this.$data.selectTaskGroup
      }
      var reqTaskGroupFlag = 0
      const res = await http.get('/tasks/refreshLevel2TaskSubEstimation', {
        reqTaskId: iTask[0].task_id,
        reqTaskGroupId: reqTaskGroupId,
        reqTaskGroupFlag: reqTaskGroupFlag
      })     
      if (res.data.status === 0) {
        this.$data.lv2TaskList[index][0].task_subtasks_estimation = res.data.data.task_subtasks_estimation
      }
      this.handleCurrentChangeOfEachTable(1,iTask[0].task_name,index)    
      this.$data.lv2TaskList[index][0].task_current_page = 1
      this.$data.currentPage1 = 1
    },
    clearFilterTask () {
      this.$data.formFilter = {
        filterTaskLevel: this.$data.formFilter.filterTaskLevel,
        filterAssignTo: '',
        filterStatus: '',
        filterShowRefPool: false,
        filterLeadingBy: '',
        filterTimeGroup: this.$data.defaultTimeGroup
      }
      this.$data.isChange = false
      this.$message('Reset all filter criteria to default!');
    },
    searchTask () {
      this.$data.isChange = false
      this.getTaskList(1, 20)
    },
    async createTaskInPlanMode (iSubTaskLevel, iTaskObj) {
      console.log("Start to createTaskInPlanMode")
      console.log(iTaskObj)
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.$data.currentLevel = iSubTaskLevel
      if (Number(iSubTaskLevel) === 3) {
        this.getTaskGroup(0, true, true)
        this.$data.taskLv3Form = {}
        this.$data.lv3TaskItemRule.showSubTaskList = false
        this.$data.lv3TaskItemRule.showRegularTaskList = false
        this.$data.lv3TaskItemRule.showDeliverableTag = true
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatusOptions('Drafting')
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
        this.$data.taskLv3Form.task_group_id = this.$data.selectTaskGroup.length == 0 ? this.$data.formFilter.filterTimeGroup[0]: this.$data.selectTaskGroup[0]
        if (this.$data.selectTaskGroup.length == 0) {
          if(this.$data.formFilter.filterTimeGroup[0] == 'All' || this.$data.formFilter.filterTimeGroup[0] == 0) {
            this.$data.taskLv3Form.task_group_id = null
          }
        } else {
          if(this.$data.selectTaskGroup[0] == 'All' || this.$data.selectTaskGroup[0] == 0) {
            this.$data.taskLv3Form.task_group_id = null
          }
        }
        this.$data.taskLv3Form.task_type_tag = 'One-Off Task'
        // Show or hide column
        this.ruleControlLv3TaskItem('Create', false)
        this.$data.lv3TaskItemRule.disableTaskType = true
        this.$data.taskLv3DialogVisible = true
      }
      if (Number(iSubTaskLevel) === 4) {
        //if(iTaskObj.task_sub_tasks.length == 0 ){
        await this.getTaskWorklogHistory(iTaskObj.task_id, 'taskLv3FormHistories')
        if(this.$data.taskLv3FormHistories.length == 0){
          this.$data.taskLv4Form = {}
          // Set dialog value
          this.getActiveUserList()
          this.getTaskStatusOptions('Drafting')
          // Set data default value
          this.$data.taskLv4Form.task_status = 'Drafting'
          this.$data.taskLv4Form.task_issue_date = this.dateToString(new Date())
          this.$data.taskLv4Form.task_level = 4
          this.$data.taskLv4Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
          this.$data.taskLv4Form.task_progress_nosymbol = 0
          // Set parent data of sub task
          this.$data.taskLv4Form.task_parent_name = iTaskObj.task_name
          this.$data.taskLv4Form.task_type_tag = iTaskObj.task_type_tag
          this.$data.taskLv4Form.task_type_id = iTaskObj.task_type_id
          if(iTaskObj.task_deliverable_tag!=null){
            this.$data.taskLv4Form.task_deliverable_tag = iTaskObj.task_deliverable_tag.split(',')
          }
          this.$data.taskLv4Form.task_parent_desc = iTaskObj.task_desc
          this.$data.taskLv4Form.task_responsible_leader = iTaskObj.task_responsible_leader_id
          this.$data.taskLv4Form.task_group_id = iTaskObj.group_id
          this.$data.taskLv4Form.task_reference = iTaskObj.task_reference
          this.$data.taskLv4Form.task_reference_desc = iTaskObj.task_reference_desc
          // Show or hide column
          this.ruleControlLv4TaskItem('Create', false)
          this.$data.lv4TaskItemRule.disableTaskType = true
          this.$data.taskLv4DialogVisible = true          
        } else {
          this.$message({
            showClose: true,
            message: 'Task has worklog, cannot create sub task!',
            type: 'error'
          });       
        }
      }
      loading.close()
    },
    //For Time Group select check
    selectCheck (){
      if(this.$data.selectTaskGroup.length != 0){
        if(this.$data.selectTaskGroup.includes('0')){
          for(var i = 0 ; i < this.$data.taskGroups.length ; i ++){
            this.$data.taskGroups[i].group_dis = true
          }
          this.$data.selectTaskGroup = []
          this.$data.selectTaskGroup.push('0')
        }else if(this.$data.selectTaskGroup.includes('All')){
          for(var i = 0 ; i < this.$data.taskGroups.length-1 ; i ++){
            this.$data.taskGroups[i].group_dis = true
          }
          this.$data.selectTaskGroup = []
          this.$data.selectTaskGroup.push('All')
        }
      }else{
          for(var i = 0 ; i < this.$data.taskGroups.length ; i ++){
            this.$data.taskGroups[i].group_dis = false
          }         
       }      
    },
    formSelectCheck () {
      if(this.$data.formFilter.filterTimeGroup.length != 0&&this.$data.isChange){
        if(this.$data.formFilter.filterTimeGroup.includes('0')){
          for(var i = 0 ; i < this.$data.taskGroups.length ; i ++){
            this.$data.taskGroups[i].group_dis = true
          }        
          this.$data.formFilter.filterTimeGroup = []
          this.$data.formFilter.filterTimeGroup.push('0')            
        }else if(this.$data.formFilter.filterTimeGroup.includes('All')){
          for(var i = 0 ; i < this.$data.taskGroups.length-1 ; i ++){
            this.$data.taskGroups[i].group_dis = true
          }        
          this.$data.formFilter.filterTimeGroup = []
          this.$data.formFilter.filterTimeGroup.push('All') 
        }
      }else{
          for(var i = 0 ; i < this.$data.taskGroups.length ; i ++){
            this.$data.taskGroups[i].group_dis = false
          }         
        }
    },
    removeTag() {
      this.$data.isChange = false
      if(Number(this.$data.formFilter.filterTaskLevel) === 1||Number(this.$data.formFilter.filterTaskLevel) === 2){
        this.openTaskTab(this.TaskLv2Id, 1, 20)
      }     
    },
    async changeGroup(){
      this.$refs.fuzzySearch.$refs.input.blur = () => {
        this.$data.isChange = false
        if(Number(this.$data.formFilter.filterTaskLevel) === 1||Number(this.$data.formFilter.filterTaskLevel) === 2){
          this.openTaskTab(this.TaskLv2Id, 1, 20)
        }          
      };
    },
    async getTaskList (iPage, iSize) {
      console.log('Start to get task list: page[' + iPage + '] size[' + iSize + ']')
      this.$data.taskslistData = []
      this.$data.lv2TaskList = []
      this.$data.formFilterdisable = true
      this.$data.taskslistLoading = true
      this.$data.noDataLoading = false
      this.$data.pageSize = iSize
      this.$data.currentPage = iPage
      var reqCurrentTimeGroup = []
      var reqTaskLevel = this.$data.formFilter.filterTaskLevel
      this.ruleShowListColumn(reqTaskLevel)
      // console.log(this.$data.isChange)
      console.log('reqTaskLevel: ' + reqTaskLevel)
      if(reqTaskLevel !== 1 && reqTaskLevel !== 2 && this.$data.isChange && this.$data.formFilter.filterTimeGroup.length<1){
        for(var i = 0 ; i < this.$data.taskGroupArray.length ; i++){
          this.$data.formFilter.filterTimeGroup.push(this.$data.taskGroupArray[i])  
          this.$data.defaultTimeGroup.push(this.$data.taskGroupArray[i])
        }            
      }
      console.log(this.$data.formFilter.filterTimeGroup)
      var reqCurrentTimeGroup = ''
      if(this.$data.formFilter.filterTimeGroup.length == 0||this.$data.formFilter.filterTimeGroup == null){
        reqCurrentTimeGroup = 'null'
      }else{
        reqCurrentTimeGroup = this.$data.formFilter.filterTimeGroup
      }
      if(this.$data.formFilter.filterTaskLevel === 'EX'){
        reqTaskLevel = 3
        reqCurrentTimeGroup = ''
      }else{
        reqTaskLevel = Number(this.$data.formFilter.filterTaskLevel)
      }      
      var sizeCriteria = {
        reqTaskLevel: reqTaskLevel,
        reqTaskKeyword: this.$data.searchVal,
        reqFilterAssignee: this.$data.formFilter.filterAssignTo,
        reqFilterStatus: this.$data.formFilter.filterStatus,
        reqFilterShowRefPool: this.$data.formFilter.filterShowRefPool,
        reqCurrentTimeGroup : reqCurrentTimeGroup,
        reqLeadingBy : this.$data.formFilter.filterLeadingBy,
        reqOpportunity :this.$data.formFilter.filterOpportunity,
        reqSkill : this.$data.formFilter.filterSkill,
        reqFilterTaskLevel: this.$data.formFilter.filterTaskLevel
      }
      var listCriteria = {
        reqPage: iPage,
        reqSize: iSize,
        reqParentTaskName: null,
        reqTaskLevel: reqTaskLevel,
        reqTaskKeyword: this.$data.searchVal,
        reqFilterAssignee: this.$data.formFilter.filterAssignTo,
        reqFilterStatus: this.$data.formFilter.filterStatus,
        reqFilterShowRefPool: this.$data.formFilter.filterShowRefPool,
        reqCurrentTimeGroup : reqCurrentTimeGroup,
        reqLeadingBy : this.$data.formFilter.filterLeadingBy,
        reqOpportunity :this.$data.formFilter.filterOpportunity,
        reqSkill : this.$data.formFilter.filterSkill,
        reqFilterTaskLevel: this.$data.formFilter.filterTaskLevel
      }
      console.log(sizeCriteria)
      console.log(listCriteria)
      if(reqTaskLevel === 1 || reqTaskLevel ===2){
        sizeCriteria.reqSkill = ''
        sizeCriteria.reqOpportunity = ''
        listCriteria.reqSkill = ''
        listCriteria.reqOpportunity = ''
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
        if(reqTaskLevel === 1){
          for(var i = 0 ; i < this.$data.taskslistData.length ; i++){
            var Opportunity = {}
            Opportunity.task_name = this.$data.taskslistData[i].task_name
            Opportunity.task_opp_name = this.$data.taskslistData[i].task_top_opp_name
            this.$data.OpportunityNameOps.push(Opportunity)
          }
        }        
      }else{
        if(Boolean(this.$data.formFilter.filterShowRefPool) === false){
          this.$data.subTaskListLoading = true
          this.$data.showForLv1AndLv2 = false
          const res1 = await http.get('/tasks/getTaskListTotalSize', sizeCriteria)
          console.log(res1)
          if (res1.data.status === 0) {
            this.$data.tasksTotalSize = res1.data.data.task_list_total_size
            const res2 = await http.get('/tasks/getLv3TaskList', listCriteria)
            console.log(res2)
            if (res2.data.status === 0) {
            for(var i = 0; i < res2.data.data.length ; i ++) {
                if(res2.data.data[i].length > 20){
                  var task_length = res2.data.data[i].length
                    res2.data.data[i] = res2.data.data[i].slice(0,20)
                    res2.data.data[i].length = task_length
                }
              }
              this.$data.lv2TaskList = res2.data.data
              if(this.$data.lv2TaskList.length === 0){
                this.$data.noDataLoading = true
              }
            } else {
              this.$data.lv2TaskList = []
              this.$data.noDataLoading = true
            }
          } else {
            this.$data.tasksTotalSize = 0
            this.$data.noDataLoading = true
          }
          this.$data.subTaskListLoading = false     
        }else{
          this.ruleShowListColumn(3)
          this.$data.showForLv1AndLv2 = true
          const res1 = await http.get('/tasks/getTaskListTotalSize', sizeCriteria)
          console.log(res1)
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
        }
      }
      const res3 =  await http.post('/tasks/getSkillFromReference')
      this.$data.skillTypeOps = res3.data.data    
      this.$data.isChange = true
      this.$data.taskslistLoading = false
      this.$data.formFilterdisable = false
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
    handleCurrentChange1 (val) {
      this.$data.currentPage1 = val
    },
    getTaskIndex (task) {
      var iTask = []
      this.$data.currentTask = task
      this.handleCurrentChangeOfEachTable (this.$data.currentPage1, this.$data.currentTask[0].task_name, 0)
    },
    ruleShowListColumn (iTaskLevel) {
      if (Number(iTaskLevel) === 1) {
        this.$data.taskListRule.showColForLv1 = true
        this.$data.taskListRule.showColForLv2 = false
        this.$data.taskListRule.showColForLv3 = false
        this.$data.taskListRule.showColForEx = false
        this.$data.taskListRule.showColRef = false
      } else if (Number(iTaskLevel) === 2) {
        this.$data.taskListRule.showColForLv1 = false
        this.$data.taskListRule.showColForLv2 = true
        this.$data.taskListRule.showColForLv3 = false
        this.$data.taskListRule.showColForEx = false
        this.$data.taskListRule.showColRef = false
      } else if (iTaskLevel === 'EX') {
        this.$data.taskListRule.showColForLv1 = false
        this.$data.taskListRule.showColForLv2 = false
        this.$data.taskListRule.showColForLv3 = false
        this.$data.taskListRule.showColForEx = true
        this.$data.taskListRule.showColRef = false
      }
    },
    async getTaskGroup (iGroupId,isShowRelate,isShowCurrent) {
      console.log('start to get getTaskGroup')
      this.$data.taskGroups = []
      var today = this.dateForYMD(new Date())
      console.log('Current date is ' + today)
      const res = await http.get('/tasks/getTaskGroup', {
        tGroupId: iGroupId,
        //tGroupRelatedTask: iGroupRelatedTask,
        tToday : today,
        isShowCurrent : isShowCurrent,
        isShowRelate : isShowRelate
      })
      if (res.data.status === 0) {
        if (iGroupId === 0) {
          this.$data.taskGroupArray = []
          var taskGroupArr = res.data.data
          this.$data.taskGroups = taskGroupArr
          var resResult = []
          for (var i = 0; i < taskGroupArr.length; i++) {
            var resJson = {}
            resJson.group_long_name = taskGroupArr[i].group_name + ' ' + taskGroupArr[i].group_start_time + ' ~ ' + taskGroupArr[i].group_end_time
            resJson.group_id = taskGroupArr[i].group_id
            this.$data.taskGroupArray.push(resJson.group_id)
            resResult.push(resJson)
          }
          var all = {group_id: "All",group_name: "All",group_dis: false}
          this.$data.taskGroups.push(all)        
        } else {
          this.$data.taskGroupForm.formGroupId = res.data.data[0].group_id
          this.$data.taskGroupForm.formGroupName = res.data.data[0].group_name
          this.$data.taskGroupForm.formGroupTimeRange = [res.data.data[0].group_start_time, res.data.data[0].group_end_time]
        }
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
        for(var i = 0 ; i < this.$data.lv2TaskList.length ; i++){
          console.log(iParentTaskName)
          console.log(this.$data.lv2TaskList[i][0].task_name)
          if(this.$data.lv2TaskList[i][0].task_name === iParentTaskName ){
            if(Number(this.$data.formFilter.filterTaskLevel) == 3){
              await this.handleCurrentChangeOfEachTable(this.$data.lv2TaskList[i][0].task_current_page, iParentTaskName, i)              
            }else{
              await this.handleCurrentChangeOfEachTable(this.$data.currentPage1, iParentTaskName, i)  
            }
            break
          }
        }
        this.$message({message: 'Task\' time group updated successfully!', type: 'success'})
      } else {
        this.$message.error('Task\' time group updated fail!')
      }
    },
    async handleCurrentChangeOfEachTable (iPage, iTaskName, Index) {
      console.log('Current Page: ' + iPage)
      this.$data.tableLoading = Index
      this.$data.currentTablePage = iPage
      var pageSize = this.$data.lv2TaskList[Index][0].task_page_size
      if((this.$data.formFilter.filterTimeGroup != null && this.$data.formFilter.filterTimeGroup!='') || (this.$data.selectTaskGroup != null && this.$data.selectTaskGroup != '')){
        console.log(iPage, pageSize, iTaskName, Index)
        await this.getTaskListForEachTable(iPage, pageSize, iTaskName, Index)
        this.$data.tableLoading = null
        this.getTaskGroup(0,true,true)
      }else{
        console.log(iPage, pageSize, iTaskName, Index)
        await this.getTaskGroup(0,false,true)
        await this.getTaskListForEachTable(iPage, pageSize, iTaskName, Index)
        this.$data.tableLoading = null
        this.getTaskGroup(0,true,true)
      }
      this.$data.lv2TaskList[Index][0].task_current_page = iPage 
    },
    async handleSizeChangeOfEachTable (iSize, iTaskName, Index) {
      this.$data.lv2TaskList[Index].task_page_size = iSize
      await this.getTaskListForEachTable(1, iSize, iTaskName, Index)
      this.$data.tableLoading = null
    },
    async getTaskListForEachTable (iPage, iSize, iTaskName, Index) {
      var reqTaskLevel = 3
      var reqCurrentTimeGroup = []
      var response = []
      this.ruleShowListColumn(reqTaskLevel)
      var reqCurrentTimeGroup = []
      this.$data.tasksTotalSize = this.$data.lv2TaskList[Index].length
      if(Number(this.$data.formFilter.filterTaskLevel)===1 || Number(this.$data.formFilter.filterTaskLevel)=== 2){
        reqCurrentTimeGroup = this.$data.selectTaskGroup
      }else{
        reqCurrentTimeGroup = this.$data.formFilter.filterTimeGroup
      }
      var sizeCriteria = {
        reqTaskLevel: reqTaskLevel,
        reqParentTaskName: iTaskName,
        reqTaskKeyword: this.$data.searchVal,
        reqFilterAssignee: this.$data.formFilter.filterAssignTo,
        reqFilterStatus: this.$data.formFilter.filterStatus,
        reqCurrentTimeGroup : reqCurrentTimeGroup,
        reqLeadingBy : this.$data.formFilter.filterLeadingBy,
        reqOpportunity :this.$data.formFilter.filterOpportunity,
        reqSkill : this.$data.formFilter.filterSkill,
      }
      var listCriteria = {
        reqPage: iPage,
        reqSize: iSize,
        reqTaskLevel: reqTaskLevel,
        reqParentTaskName: iTaskName,
        reqTaskKeyword: this.$data.searchVal,
        reqFilterAssignee: this.$data.formFilter.filterAssignTo,
        reqFilterStatus: this.$data.formFilter.filterStatus,
        reqCurrentTimeGroup : reqCurrentTimeGroup,
        reqLeadingBy : this.$data.formFilter.filterLeadingBy,
        reqOpportunity :this.$data.formFilter.filterOpportunity,
        reqSkill : this.$data.formFilter.filterSkill,
      }
      console.log(sizeCriteria)
      console.log(listCriteria)
      console.log('Path Selection: ' + this.$data.showTaskPath)
      if(Boolean(this.$data.formFilter.filterShowRefPool) === false){
        this.$data.showForLv1AndLv2 = false
        const res1 = await http.get('/tasks/getTaskListTotalSize', sizeCriteria)
        console.log(res1)
        if (res1.data.status === 0) {
          const res2 = await http.get('/tasks/getLv3TaskListForSingleTable', listCriteria)
          if (res2.data.status === 0) {
            console.log(res2.data.data)
            this.$data.lv2TaskList[Index] = []
            this.$data.lv2TaskList[Index] = res2.data.data
            this.$data.lv2TaskList[Index][0].task_length = res1.data.data.task_list_total_size+1
            this.$data.lv2TaskList[Index].length = res1.data.data.task_list_total_size+1
            // //update singel table after pagination 
            // this.$forceUpdate(); 
          }
        } else {
          if (this.$data.showTaskPath) {
            console.log('Removed: Lv2 task should exist')
            var removedLv3Task = this.$data.lv2TaskList[Index].splice(1, 1)
            console.log(removedLv3Task)
          } else {
            console.log('Removed: Lv2 task should not exist')
            var removedLv2Task = this.$data.lv2TaskList.splice(Index, 1)
            console.log(removedLv2Task)
          }
        }   
      }
    },
    // 2. Task info
    openTaskById (iTaskId) {
      console.log('Start to get task by Id ' + iTaskId)
      var url = '/tasks/getTaskById'
      var criteria = {
        reqTaskId: iTaskId
      }
      this.getTask(url, criteria)  
    },
    async openTaskTab (iTaskName, iPage, iSize) {
      this.$data.subTaskListLoading = true
      this.$data.tableLoading = null
      this.$data.lv2TaskList = []
      var response = []
      var reqCurrentTimeGroup = ''
      const res2 = await http.post('/tasks/getTaskByName',{
        reqTaskName : iTaskName
      })
      console.log('Get task by name', res2)
      this.$data.pageSize1 = iSize
      this.$data.currentPage1 = iPage
      if(this.$data.selectTaskGroup.length === 0){
        this.$data.selectTaskGroup = []
      }
      if(this.$data.selectTaskGroup.length == 0||this.$data.selectTaskGroup == null){
        reqCurrentTimeGroup = 'null'
      }else{
        reqCurrentTimeGroup = this.$data.selectTaskGroup
      }
      var reqTaskGroupFlag = this.$data.currentTaskGroupFlag
      var sizeCriteria = {
        reqParentTaskName: iTaskName,
        reqCurrentTimeGroup : reqCurrentTimeGroup,
        reqTaskGroupFlag: 0,
        reqFilterAssignee: this.$data.formFilter.filterAssignTo,
        reqFilterStatus: this.$data.formFilter.filterStatus,
        reqLeadingBy : this.$data.formFilter.filterLeadingBy,
      }
      var listCriteria = {
        reqPage: iPage,
        reqSize: iSize,
        reqParentTaskName: iTaskName,
        reqCurrentTimeGroup : reqCurrentTimeGroup,
        reqTaskGroupFlag: 0,
        reqFilterAssignee: this.$data.formFilter.filterAssignTo,
        reqFilterStatus: this.$data.formFilter.filterStatus,
        reqLeadingBy : this.$data.formFilter.filterLeadingBy,
      }
      console.log(sizeCriteria)
      console.log(listCriteria)
      console.log('Path mode: Start to get task list size')
      const res = await http.get('/tasks/getPlanTaskSizeByParentTask', sizeCriteria)
      console.log(res)
      if (res.data.status === 0) {
          res2.data.data.task_page_number = iPage
          res2.data.data.task_page_size = iSize  
          console.log('Path mode: Start to get task list data') 
          const res11 =  await http.get('/tasks/getPlanTaskListByParentTask', listCriteria)
          console.log(res11)
          response = res11.data.data
          if (res11.data.status === 0) {
            if(response.length > 20){
              var task_length = response.length
                response = response.slice(0,20)
                response.length = task_length
            }
          } else {
            response = []
          }                      
      }else{
        response = []
      }
      this.$data.lv2TaskList.push(response)
      if(this.$data.lv2TaskList.length > 1){
        var rtnResult = []
        rtnResult.push(this.$data.lv2TaskList.slice(0,1))
        this.$data.lv2TaskList = rtnResult
        
      }
      this.$data.subTaskListLoading = false
      this.$data.isChange = true
    },
    async getTaskTOPDesc(taskName){
      const res = await http.post('/tasks/getTaskTOPDesc', {
        reqTaskName: taskName
      })
      if(res.data.data != null){
        var taskReferenceDesc = res.data.data.task_reference_desc;
        return taskReferenceDesc;
      }else{
        return null;
      }
    },
    async getLevel2TaskListByParentTask (iTaskId,iPage,iSize) {
      console.log('Start to get level 2 task list')
      this.$data.taskslistLoading = true
      var reqParentTaskName = iTaskId
      var reqTaskGroupId = this.$data.currentTaskGroupId
      var reqTaskGroupFlag = this.$data.currentTaskGroupFlag
      this.ruleShowListColumn(2)
      const res = await http.post('/tasks/getLevel2TaskListByParentTask', {
        reqParentTaskName: reqParentTaskName,
        reqTaskGroupId: reqTaskGroupId,
        reqTaskGroupFlag: 0,
        reqPage: iPage,
        reqSize: iSize
      })
      console.log(res.data)
      if (res.data.status === 0) {
        this.$data.taskslistData = []
        this.$data.tasksTotalSize = res.data.data.length
        this.$data.taskslistData = res.data.data
      } else {
        this.$data.taskslistData = []
      }
      this.$data.taskslistLoading = false
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
    changeTaskTypeTag () {
      if(this.$data.taskLv3Form.task_type_tag === 'Regular Task'){
        this.$data.lv3TaskItemRule.showDeliverableTag = false
        this.$data.lv4TaskItemRule.showDeliverableTag = false
        this.$data.lv3TaskItemRule.showActualComplete = false
        this.$data.lv4TaskItemRule.showActualComplete = false
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
        this.$data.lv3TaskItemRule.showActualComplete = true
        this.$data.lv3TaskItemRule.showProgress = true
        this.$data.lv3TaskItemRule.showEffort = true
        this.$data.lv4TaskItemRule.showEffort = true
        this.$data.lv4TaskItemRule.showProgress = true
        this.$data.lv4TaskItemRule.showActualComplete = true  
      }
    },
    statusChange(){
      if(this.$data.taskLv3Form.task_status === 'Done'){
        this.$data.taskLv3Form.task_actual_complete = this.dateForYMD(new Date());
      }
      if(this.$data.taskLv4Form.task_status === 'Done'){
        this.$data.taskLv4Form.task_actual_complete = this.dateForYMD(new Date());
      }
    },
     async getTask (iUrl, iCriteria) {
      const res = await http.post(iUrl, iCriteria)
      if (res.data.status === 0) {
        var rtnTask = res.data.data
        if (rtnTask.task_level === 1) {
          this.getActiveUserList()
          this.getTaskType(null)
          this.getTaskStatusOptions(rtnTask.task_status)
          this.$data.taskLv1Form = {}
          this.$data.taskLv1Form = rtnTask
          // Load return data
          // this.getSubTaskList(rtnTask.task_name, 'taskLv1FormSubTasks', 1)
          this.ruleControlLv1TaskItem('Edit')
          this.$data.taskLv1DialogVisible = true
        }
        if (rtnTask.task_level === 2) {
          // Clear existing data
          this.getActiveUserList()
          this.getTaskStatusOptions(rtnTask.task_status)
          if (rtnTask.task_parent_type !== null) {
            this.getTaskType(rtnTask.task_parent_type)
          } else {
            this.getTaskType(null)
          }
          const res1 =  await http.post('/tasks/getSkillFromReference')
          this.$data.skillTypeOps = res1.data.data
          this.$data.taskLv2Form = {}
          this.$data.taskLv2Form = rtnTask
          if(rtnTask.task_skill != null){
            this.$data.taskLv2Form.task_skill = rtnTask.task_skill.split(",")
          }
          if (Number(rtnTask.task_progress_nosymbol) < 100) {
            this.$data.taskLv2FormProgressStatus = 'success'
          } else {
            this.$data.taskLv2FormProgressStatus = 'exception'
          }
          // this.getSubTaskList(rtnTask.task_name, 'taskLv2FormSubTasks', 2)
          this.getRegularTaskList(rtnTask.task_name, 'taskLv2FormRegularTasks', 2)
          this.ruleControlLv2TaskItem('Edit', null)
          this.$data.taskLv2DialogVisible = true
        }
        if (rtnTask.task_level === 3) {
          // Clear existing data
          this.getActiveUserList()
          this.getTaskStatusOptions(rtnTask.task_status)
          this.getTaskType(null)
          this.$data.taskLv3Form = {}
          this.$data.taskLv3Form = res.data.data
          if (rtnTask.task_deliverable_tag != null) {
            this.$data.taskLv3Form.task_deliverable_tag = rtnTask.task_deliverable_tag.split(",")            
          }
          if (Number(res.data.data.task_progress_nosymbol) < 100) {
            this.$data.taskLv3FormProgressStatus = 'success'
          } else {
            this.$data.taskLv3FormProgressStatus = 'exception'
          }
          this.$data.lv3TaskItemRule.showSubTaskList = true
          if (res.data.data.task_type_tag === 'Regular Task') {
            const res1 = await http.post('/schedules/getSchedulesByTaskName',{
              reqTaskName : rtnTask.task_name
            })
            if(res1.data.status === 0 ){
              let obj = res1.data.data
              this.$set(this.$data.taskLv3Form, 'task_recurrence_sch_time_range', obj.schedule_time_range)
              this.$set(this.$data.taskLv3Form, 'task_recurrence_options', obj.schedule_regular_time)
              if(obj.schedule_regular_time == 'Weekly') {
                this.$set(this.$data.taskLv3Form, 'task_recurrence_sch_weeks', obj.schedule_value)
              }
              if(obj.schedule_regular_time == 'Monthly') {
                this.$set(this.$data.taskLv3Form, 'task_recurrence_sch_days', obj.schedule_value)
              }
            }     
          } else {
            this.getSubTaskList(rtnTask.task_name, 'taskLv3FormSubTasks', 3)  
            await this.getTaskWorklogHistory(rtnTask.task_id, 'taskLv3FormHistories')
          }
          this.ruleControlLv3TaskItem('Edit', null)
          this.$data.taskLv3DialogVisible = true
        }
        if (rtnTask.task_level === 4) {
          // Clear existing data
          this.getActiveUserList()
          this.getTaskStatusOptions(rtnTask.task_status)
          this.getTaskType(null)
          this.$data.taskLv4Form = {}
          this.$data.taskLv4Form = res.data.data
          this.changeTaskTypeTag()
          if(this.$data.taskLv4Form.task_deliverable_tag != null){
            this.$data.taskLv4Form.task_deliverable_tag = this.$data.taskLv4Form.task_deliverable_tag.split(",")            
          }
          if (Number(res.data.data.task_progress_nosymbol) < 100) {
            this.$data.taskLv4FormProgressStatus = 'success'
          } else {
            this.$data.taskLv4FormProgressStatus = 'exception'
          }
          await this.getTaskWorklogHistory(rtnTask.task_id, 'taskLv4FormHistories')
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
      this[iSubTaskListItem] = []
      if (res.data.status === 0) {
        this[iSubTaskListItem] = res.data.data
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
    async createNewTask (iTaskLevel) {
      if(Boolean(this.$data.showTaskPath) === true && Boolean(this.$data.showForLv1AndLv2) === true ){
        iTaskLevel = 2
      }else if(Boolean(this.$data.showTaskPath) === true && Boolean(this.$data.showForLv1AndLv2) === false){
        iTaskLevel = 3
      }
      console.log('Create new task: ' + iTaskLevel)
      this.$data.currentLevel = iTaskLevel
      if (Number(iTaskLevel) === 1) {
        if (this.$data.userLevel > 8 && this.$data.userRole !== 'Admin') {
          this.$message.error('No right to create Level 1 task!')
          return
        }
        this.$data.taskLv1Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskType(null)
        this.getTaskStatusOptions('Drafting')
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
          const res1 =  await http.post('/tasks/getSkillFromReference')
          this.$data.skillTypeOps = res1.data.data
        if (this.$data.userLevel > 10 && this.$data.userRole !== 'Admin') {
          this.$message.error('No right to create Level 2 task!')
          return
        }
        this.$data.taskLv2Form = {}
        if(this.$data.showForLv1AndLv2 == true && this.$data.pathSelection == true){
          this.$data.taskLv2Form.task_parent_name = this.$data.lv1TaskNamePath
        }
        // Set dialog value
        this.getActiveUserList()
        this.getTaskType(null)
        this.getTaskStatusOptions('Drafting')
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
        this.getTaskType(null)
        this.getActiveUserList()
        this.getTaskStatusOptions('Drafting')
        this.$data.lv3TaskItemRule.showDeliverableTag = true
        this.$data.taskTypeArrayForLv2Task = []
        if(!this.$data.showForLv1AndLv2  && this.$data.pathSelection == true){
          this.$data.taskLv3Form.task_parent_name = this.$data.lv2TaskNamePath
          const res = await http.post('/tasks/getTaskTypeByName',{
            reqTaskName: this.$data.lv2TaskNamePath
          })
          if(res.data.status === 0){
            this.$data.taskLv3Form.task_type_id = res.data.data
          }
        }
        
        // Set data default value
        this.$data.taskLv3Form.task_status = 'Drafting'
        this.$data.taskLv3Form.task_type_tag = 'One-Off Task'
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
        this.getTaskType(null)
        this.getTaskStatusOptions('Drafting')
        this.$data.lv4TaskItemRule.showDeliverableTag = true
        this.$data.taskTypeArrayForLv2Task = []
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
        this.getTaskStatusOptions('Drafting')
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
        this.getTaskStatusOptions('Drafting')
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
        this.$data.lv3TaskItemRule.disableTypeTag = false
      }
      if (Number(iSubTaskLevel) === 4) {
        console.log('Number(iSubTaskLevel) === 4')
        this.$data.taskLv4Form = {}
        console.log(this.$data.failToCreateL4)
        if(this.$data.failToCreateL4 == false){
          // Set dialog value
          this.getActiveUserList()
          this.getTaskStatusOptions('Planning')
          // Set data default value
          const res  = await http.post('/tasks/getTaskByName',{
            reqTaskName : this[iParentObj].task_name
          })
          if(res.data.status ===0 && res.data.data != null ){
            this.$data.taskLv4Form.task_type_tag = res.data.data.task_type_tag
          }
          this.$data.taskLv4Form.task_status = res.data.data.task_status
          this.$data.taskLv4Form.task_issue_date = this.dateToString(new Date())
          this.$data.taskLv4Form.task_level = 4
          this.$data.taskLv4Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
          this.$data.taskLv4Form.task_progress_nosymbol = 0
          // Set parent data of sub task
          this.$data.taskLv4Form.task_deliverable_tag = this[iParentObj].task_deliverable_tag
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
        } else {
          this.$message({
            showClose: true,
            message: 'Failed to create sub task!',
            type: 'error'
          });             
        }
      }
    },
    async createRegularTask (iSubTaskLevel, iParentObj) {
      console.log('Create regular task' )
      if (Number(iSubTaskLevel) === 3) {
        this.$data.taskLv3Form = {}
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatusOptions('Planning')
        // Set data default value
        this.$data.taskLv3Form.task_status = 'Planning'
        this.$data.taskLv3Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv3Form.task_level = 3
        this.$data.taskLv3Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        this.$data.taskLv3Form.task_progress_nosymbol = 0
        this.$data.taskLv3Form.task_type_tag = 'Regular Task'
        this.$data.lv3TaskItemRule.showDeliverableTag = false
        // Set parent data of sub task
        this.$data.taskLv3Form.task_parent_name = this[iParentObj].task_name
        this.$data.taskLv3Form.task_parent_desc = this[iParentObj].task_desc
        this.$data.taskLv3Form.task_type_id = this[iParentObj].task_type_id
        this.$data.taskLv3Form.task_responsible_leader = this[iParentObj].task_responsible_leader
        // Show or hide column
        this.ruleControlLv3TaskItem('Create', false)
        this.$data.taskLv3DialogVisible = true
        this.$data.taskLv3WorklogShow = false
        this.$data.lv3TaskItemRule.showProgress = false
        this.$data.lv3TaskItemRule.showEffort = false
        this.$data.lv3TaskItemRule.showActualComplete = false
        this.$data.lv3TaskItemRule.disableTypeTag = true
        this.$data.lv3TaskItemRule.showDeliverableTag = false
      }
      if (Number(iSubTaskLevel) === 4) {
        this.$data.taskLv4Form = {}
        console.log("Number(iSubTaskLevel) === 4")
        // Set dialog value
        this.getActiveUserList()
        this.getTaskStatusOptions(this[iParentObj].task_status)
        // Set data default value
        this.$data.taskLv4Form.task_status = this[iParentObj].task_status
        this.$data.taskLv4Form.task_issue_date = this.dateToString(new Date())
        this.$data.taskLv4Form.task_level = 4
        this.$data.taskLv4Form.task_creator = 'PMT:' + this.$data.userEmployeeNumber
        this.$data.taskLv4Form.task_progress_nosymbol = 0
        this.$data.taskLv4Form.task_type_tag = 'Regular Task'
        this.$data.taskLv4Form.task_regular_task_time = this[iParentObj].task_regular_task_time
        this.$data.taskLv4Form.task_startTime = this[iParentObj].task_startTime
        this.$data.taskLv4Form.task_endTime = this[iParentObj].task_endTime
        this.$data.taskLv4Form.task_schedule_time = this[iParentObj].task_schedule_time
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
    // 3. Level 1 task dialog
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
      reqTask.task_skill = this.$data.taskLv2Form.task_skill
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
        if (this.$data.formFilter.filterTaskLevel == 2) {
          this.filterTask ()
        } else {
          this.getLevel2TaskListByParentTask(reqTask.task_parent_name,1,20)
        }
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
      this.$data.taskLv3SaveBtnDisabled = true
      var reqTask = this.$data.taskLv3Form
      if (reqTask != null) {
        if (this.$data.taskLv3Form.task_deliverable_tag != null && typeof(this.$data.taskLv3Form.task_deliverable_tag) ==='object' ){
          this.$data.taskLv3Form.task_deliverable_tag = this.$data.taskLv3Form.task_deliverable_tag.toString();             
        }
        if (reqTask.task_deliverable_tag !=null && typeof(reqTask.task_deliverable_tag)==='string' ){
          this.$data.taskLv3Form.task_deliverable_tag = this.$data.taskLv3Form.task_deliverable_tag.split(',')
        }
        if (this.isFieldEmpty(reqTask.task_parent_name, 'Task parent name could not be empty!') ||
            this.isFieldEmpty(reqTask.task_type_id, 'Task type could not be empty!') ||
            this.isFieldEmpty(reqTask.task_desc, 'Title could not be empty!')||
            this.isFieldEmpty(reqTask.task_type_tag, 'Type Tag could not be empty!')) {
          this.$data.taskLv3SaveBtnDisabled = false
          return
        }
        if (reqTask.task_type_tag != 'Public Task' && Number(reqTask.task_estimation) > 24) {
          this.$message.error('Task estimation could not be over 24 hours. If more effort required, please consider break down the task further!')
          this.$data.taskLv3SaveBtnDisabled = false
          return
        }
        if (reqTask.task_group_id == null || reqTask.task_group_id == '') {
          if (!(reqTask.task_type_tag === 'Regular Task')) {
            if (reqTask.task_status === 'Running' || reqTask.task_status === 'Done') {
              this.$message.error('Cannot update the task status to Running/Done for no time group task!');
              this.$data.taskLv3SaveBtnDisabled = false
              return;
            }
          }
        }
        if (reqTask.task_status === 'Running' || reqTask.task_status === 'Done') {
          if (reqTask.task_type_tag === 'Regular Task') {
            this.$data.lv3TaskItemRule.showActualComplete = false
          } else {
            this.$data.lv3TaskItemRule.showActualComplete = true
            this.$data.lv3TaskItemRule.showEffort = true
            if (this.isFieldEmpty(reqTask.task_target_complete, 'Target complete date could not be empty!') || 
                this.isFieldEmpty(reqTask.task_assignee, 'Assignee could not be empty!')) {
              this.$data.taskLv3SaveBtnDisabled = false
              return
            }         
          }
        }
        if (reqTask.task_status === 'Done' && reqTask.task_name != '' && reqTask.task_name != null) {
          if (reqTask.task_type_tag != 'Regular Task') {
            var result = await this.ifAllSubTasksDone(reqTask.task_name)
            if (!result) {
              this.$message.error('Exist sub task not Done!')
              this.$data.taskLv3SaveBtnDisabled = false
              return
            }
          }
        }
        if(this.$data.taskLv3Form.task_deliverable_tag != null && typeof(this.$data.taskLv3Form.task_deliverable_tag) === 'object'){
          reqTask.task_deliverable_tag = reqTask.task_deliverable_tag.toString();             
        }
        // Regular Task Validation
        if (reqTask.task_type_tag === 'Regular Task') {
          if (reqTask.task_recurrence_options === 'Weekly' && reqTask.task_recurrence_sch_weeks != null) {
            reqTask.task_recurrence_schedule = 'Recur every week on: ' + reqTask.task_recurrence_sch_weeks.toString()
          }
          else if (reqTask.task_recurrence_options === 'Monthly' && reqTask.task_recurrence_sch_days != null) {
            reqTask.task_recurrence_schedule = 'Recur every month on: ' + reqTask.task_recurrence_sch_days.toString()
          } else {
            this.$message.error('Recurrence options invalid!')
            this.$data.taskLv3SaveBtnDisabled = false
            return
          }
          if (reqTask.task_recurrence_sch_time_range != null) {
            reqTask.task_recurrence_sch_start_time = reqTask.task_recurrence_sch_time_range[0]
            reqTask.task_recurrence_sch_end_time = reqTask.task_recurrence_sch_time_range[1]      
          } else {
            this.$message.error('Recurrence time range could not be empty!')
            this.$data.taskLv3SaveBtnDisabled = false
            return
          }
          if (this.isFieldEmpty(reqTask.task_recurrence_schedule, 'Recurrence schedule could not be empty!') ||
              this.isFieldEmpty(reqTask.task_recurrence_sch_start_time, 'Recurrence start time could not be empty!')) {
            this.$data.taskLv3SaveBtnDisabled = false
            return
          }
        }
        const res = await http.post('/tasks/saveTask', {
          reqTask: JSON.stringify(reqTask)
        })
        if (reqTask.task_type_tag === 'Regular Task') {
          const res1 = await http.post('/schedules/saveRegularTask',{
            reqTaskName: res.data.data.TaskName,
            reqTaskId: res.data.data.Id,
            reqRegularTaskTime: reqTask.task_recurrence_options,
            reqStartTime: reqTask.task_recurrence_sch_start_time,
            reqEndTime: reqTask.task_recurrence_sch_end_time,
            reqSchedule: reqTask.task_recurrence_schedule,
            reqStatus: reqTask.task_status
          })
        }
        if (res.data.status === 0) {
          this.$message({message: 'Task created successfully!', type: 'success'})  
        } else {
          this.$message({message: 'Task updated successfully!', type: 'success'})
        }
        this.openTaskById(res.data.data.Id)
        await this.getTaskGroup(0, false, true)        
        this.$data.lv3TaskItemRule.showSubTaskList = true
        this.$data.taskLv3SaveBtnDisabled = false
        for(var i = 0 ; i < this.$data.lv2TaskList.length ; i++){
          if(this.$data.lv2TaskList[i][0].task_name === reqTask.task_parent_name ){
            if(Number(this.$data.formFilter.filterTaskLevel) == 3){
              await this.handleCurrentChangeOfEachTable(this.$data.lv2TaskList[i][0].task_current_page, reqTask.task_parent_name, i)              
            }else{
              await this.handleCurrentChangeOfEachTable(this.$data.currentPage1,reqTask.task_parent_name,i)  
            }
            break
          }
        }
      }
    },
    // lv3 dialog tab: [0]-> Basic Information, [1]->Status Tracing, [2]->Recurrence, [3]->Sub-Tasks List, [4]->Regular Sub-Tasks List, [5]->Worklogs List
    async ruleControlLv3TaskItem (iAction, iNeedInputParent) {
      if (iAction === 'Edit') {
        // Set Dialog Default Value
        this.$data.taskLv3DialogTitle = '3 - Executive Task'
        this.$data.activeTabForLv3 = 'tab_basic_info'
        this.$data.disableLv3Form = false
        this.$data.lv3TaskItemRule.showProgress = true
        this.$data.lv3TaskItemRule.disableTypeTag = true
        this.$data.lv3TaskItemRule.showProgress = true
        this.$data.lv3TaskItemRule.showCreator = true
        // Default value
        this.$data.lv3TaskItemRule.disableTaskEst = false
        if (this.$data.taskLv3Form.task_status == 'Running' || this.$data.taskLv3Form.task_status == 'Done') {
          this.$data.lv3TaskItemRule.showActualComplete = true
          this.$data.lv3TaskItemRule.disableRecurrence = true
          this.$data.taskLv3TimeGroupDisabled = true
        } else {
          this.$data.lv3TaskItemRule.showActualComplete = false
          this.$data.lv3TaskItemRule.disableRecurrence = false
          this.$data.taskLv3TimeGroupDisabled = false
        }
        // Common Rule for estimation and worklog button
        // Common Rule 1
        var statusIndex = this.getIndexOfValueInArr(this.$data.statusCollection, 'status_name', this.$data.taskLv3Form.task_status)
        this.$data.taskLv3WorklogShow = this.$data.statusCollection[statusIndex]['status_allow_worklog']
        this.$data.lv3TaskItemRule.disableTaskEst = this.$data.statusCollection[statusIndex]['status_disable_est']
        // Validate External Task(Pool Task/Auto Assign Task)
        if (!this.$data.taskLv3Form.task_creator.startsWith('PMT')) {
          this.$data.lv3TaskItemRule.disableParentNameInput = true
          this.$data.lv3TaskItemRule.disableDesc = true
          this.$data.lv3TaskItemRule.disableStatus = true
          this.$data.lv3TaskItemRule.disableTaskEst = true
          this.$data.lv3TaskItemRule.showRefPoolInput = false
          if (this.$data.taskLv3Form.task_type === 'Pool') {
            console.log('Pool Task')
            this.$data.disableLv3Form = true
            this.$data.taskLv3WorklogShow = false
            this.$data.lv3TaskItemRule.showRespLeader = false
            this.$data.lv3TaskItemRule.showSubTaskEst = false
            this.$data.lv3TaskItemRule.showTypeTag = false
            this.$data.lv3TaskItemRule.showDeliverableTag = false
            this.$data.lv3TaskItemRule.showTaskGroup = false
            this.$nextTick(() => {
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[2].style.display = 'none' // For pool task, hide "Recurrence" Tab
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[3].style.display = 'none' // For pool task, hide "One-Off Sub Tasks List" tab
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[4].style.display = 'none' // For pool task, hide "Regular Sub Tasks List" tab
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[5].style.display = 'none' // For pool task, hide "Worklogs List" tab
            })
          } else {
            console.log('Not Pool Task')
            this.$data.lv3TaskItemRule.showRespLeader = true
            this.$data.lv3TaskItemRule.showSubTaskEst = true
            this.$data.lv3TaskItemRule.showTaskGroup = true
            this.$data.lv3TaskItemRule.showTypeTag = true
            this.$data.lv3TaskItemRule.showDeliverableTag = true
            this.$nextTick(() => {
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[2].style.display = 'none' // For non-pool task, hide "Recurrence" Tab
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[3].style.display = '' // For non-pool task, show "One-Off Sub Tasks List" tab
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[4].style.display = 'none' // For non-pool task, hide "Regular Sub Tasks List" tab
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[5].style.display = '' // For non-pool task, show "Worklogs List" tab
            })
          }
        } else {
          console.log('PMT Task')
          this.$data.lv3TaskItemRule.disableDesc = false
          this.$data.lv3TaskItemRule.disableStatus = false
          this.$data.lv3TaskItemRule.showRefPoolInput = true
          this.$data.lv3TaskItemRule.showRespLeader = true
          this.$data.lv3TaskItemRule.showSubTaskEst = true
          this.$data.lv3TaskItemRule.showTypeTag = true
          this.$data.lv3TaskItemRule.showTaskGroup = true
          this.$data.lv3TaskItemRule.disableParentNameInput = this.$data.statusCollection[statusIndex]['status_disable_change_parent']
          if (this.$data.taskLv3Form.task_type_tag === 'Regular Task') {
            console.log('Regular PMT Task')
            this.$data.taskLv3WorklogShow = false
            this.$data.lv3TaskItemRule.showProgress = false
            this.$data.lv3TaskItemRule.showEffort = false
            this.$data.lv3TaskItemRule.disableTypeTag = true
            this.$data.lv3TaskItemRule.showDeliverableTag = false
            this.$nextTick(() => {
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[2].style.display = '' // For regular task, show "Recurrence" Tab
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[3].style.display = 'none' // For regular task, Hide "One-Off Sub Tasks List" tab
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[4].style.display = '' // For regular task, show "Regular Sub Tasks List" tab
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[5].style.display = 'none' // For regular task, Hide "Worklogs List" tab
            })
          } else {
            console.log('Normal PMT Task')
            this.$data.lv3TaskItemRule.disableTypeTag = false
            if(this.$data.taskLv3FormHistories.length > 0) {
              this.$data.lv3TaskItemRule.disableAssignee = true
            } else {
              this.$data.lv3TaskItemRule.disableAssignee = false
            }
            this.$nextTick(() => {
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[2].style.display = 'none' // For normal task, hide "Recurrence" Tab
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[3].style.display = '' // For normal task, show "One-Off Sub Tasks List" tab
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[4].style.display = 'none' // For normal task, hide "Regular Sub Tasks List" tab
              this.$refs.taskLv3Tabs.$children[0].$refs.tabs[5].style.display = '' // For normal task, show "Worklogs List" tab
            })
          }
        }
      } else if (iAction === 'Create') {
        // Set Dialog Default Value
        this.$data.taskLv3TimeGroupDisabled = false
        this.$data.taskLv3DialogTitle = '3 - New Executive Task'      
        this.$data.activeTabForLv3 = 'tab_basic_info'
        this.$data.disableLv3Form = false
        if (iNeedInputParent) {
          this.$data.lv3TaskItemRule.disableParentNameInput = false
        } else {
          this.$data.lv3TaskItemRule.disableParentNameInput = true
        }        
        this.$data.lv3TaskItemRule.disableTypeTag = false      
        this.$data.lv3TaskItemRule.disableTaskEst = false
        this.$data.lv3TaskItemRule.disableDesc = false
        this.$data.lv3TaskItemRule.disableStatus = false
        this.$data.lv3TaskItemRule.disableRecurrence = false
        this.$data.lv3TaskItemRule.showRefPoolInput = true
        this.$data.lv3TaskItemRule.showTypeTag = true
        this.$data.lv3TaskItemRule.showRespLeader = true
        this.$data.lv3TaskItemRule.showSubTaskEst = false
        this.$data.lv3TaskItemRule.showProgress = false
        this.$data.lv3TaskItemRule.showCreator = false
        this.$data.lv3TaskItemRule.showRegularTaskList = false
        this.$data.lv3TaskItemRule.showSubTaskList = false
        this.$data.lv3TaskItemRule.showTaskGroup = true
        this.$data.lv3TaskItemRule.showActualComplete = false 
        this.$data.taskLv3WorklogShow = false
        if (this.$data.taskLv3Form.task_type_tag === 'Regular Task') {
          this.$nextTick(() => {
            this.$refs.taskLv3Tabs.$children[0].$refs.tabs[2].style.display = '' // Show "Recurrence" Tab
          })
        } else {
          this.$nextTick(() => {
            this.$refs.taskLv3Tabs.$children[0].$refs.tabs[2].style.display = 'none' // Hide "Recurrence" Tab
          })
        }
        this.$nextTick(() => {
          this.$refs.taskLv3Tabs.$children[0].$refs.tabs[3].style.display = 'none' // Hide "One-Off Sub Tasks List" Tab
          this.$refs.taskLv3Tabs.$children[0].$refs.tabs[4].style.display = 'none' // Hide "Regular Sub Tasks List" tab
          this.$refs.taskLv3Tabs.$children[0].$refs.tabs[5].style.display = 'none' // Hide "Worklog Histories" tab
        })
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
    selectLv3TaskGroup (val) {
      this.$data.taskLv3Form.task_group_id = val
      this.$forceUpdate()
    },
    // 6. Level 4 task dialog
    async saveLv4Task () {
      this.$data.taskLv4SaveBtnDisabled = true
      var reqTask = this.$data.taskLv4Form    
      if (this.$data.taskLv4Form.task_deliverable_tag != null && typeof(this.$data.taskLv4Form.task_deliverable_tag) === 'object') {
          reqTask.task_deliverable_tag = reqTask.task_deliverable_tag.toString();             
      }
      if (reqTask.task_deliverable_tag != null && typeof(reqTask.task_deliverable_tag)==='string') {
        this.$data.taskLv4Form.task_deliverable_tag = this.$data.taskLv4Form.task_deliverable_tag.split(',')
      }      
      if (reqTask != null) {
        if (this.isFieldEmpty(reqTask.task_parent_name, 'Task parent name could not be empty!') ||
            this.isFieldEmpty(reqTask.task_type_id, 'Task type could not be empty!') ||
            this.isFieldEmpty(reqTask.task_desc, 'Title could not be empty!')||
            this.isFieldEmpty(reqTask.task_type_tag, 'Type Tag could not be empty!')) {
          this.$data.taskLv4SaveBtnDisabled = false
          return
        }
        if (reqTask.task_type_tag != 'Public Task' && Number(reqTask.task_estimation) > 18) {
          this.$message.error('Task estimation could not be over 18 hours. If more effort required, please consider breaking down the task further!')
          this.$data.taskLv4SaveBtnDisabled = false
          return
        }
        if (reqTask.task_status === 'Running' || reqTask.task_status === 'Done') {
          if(reqTask.task_type_tag !== 'Regular Task') {
            if (this.isFieldEmpty(reqTask.task_target_complete, 'Target complete date could not be empty!')) {
              this.$data.taskLv4SaveBtnDisabled = false
              return
            }
            if (this.isFieldEmpty(reqTask.task_assignee, 'Assignee could not be empty!')) {
              this.$data.taskLv4SaveBtnDisabled = false
              return
            }
          }
        }
        if(this.$data.taskLv4Form.task_deliverable_tag != null && typeof(this.$data.taskLv4Form.task_deliverable_tag) === 'object'){
            reqTask.task_deliverable_tag = reqTask.task_deliverable_tag.toString();             
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
        const res2 = await http.post('/tasks/getTaskByName',{
          reqTaskName: reqTask.task_parent_name
        })
        for(var i = 0 ; i < this.$data.lv2TaskList.length ; i++){
          if(this.$data.lv2TaskList[i][0].task_name === res2.data.data.task_parent_name ){
            this.handleCurrentChangeOfEachTable(1,res2.data.data.task_parent_name,i)
            break
          }
        }
      }
    },
    ruleControlLv4TaskItem (iAction, iNeedInputParent) {
      if (iAction === 'Edit') {
        // Set Dialog Default Value
        this.$data.taskLv4DialogTitle = '4 - Workable Task'
        this.$data.activeTabForLv4 = 'tab_basic_info'
        this.$data.lv4TaskItemRule.showProgress = true
        this.$data.lv4TaskItemRule.showCreator = true
        this.$data.taskLv4WorklogShow = true
        // Common Rule for estimation and worklog button
        var statusIndex = this.getIndexOfValueInArr(this.$data.statusCollection, 'status_name', this.$data.taskLv4Form.task_status)
        // Common Rule 1
        this.$data.lv4TaskItemRule.disableTaskEst = this.$data.statusCollection[statusIndex]['status_disable_est']
        // Common Rule 2
        this.$data.taskLv4WorklogShow = this.$data.statusCollection[statusIndex]['status_allow_worklog']
        
        if(this.$data.taskLv4Form.task_type_tag ==='Regular Task'){
          this.$data.lv4TaskItemRule.showProgress = false
          this.$data.taskLv4WorklogShow = false
          this.$nextTick(() => {
            this.$refs.taskLv4Tabs.$children[0].$refs.tabs[2].style.display = 'none' // For regular task, hide worklog history tab
          })
        } else {
          this.$data.lv4TaskItemRule.showProgress = true
          this.$nextTick(() => {
            this.$refs.taskLv4Tabs.$children[0].$refs.tabs[2].style.display = '' // Show worklog history tab
          })
        }
        if(this.$data.taskLv4FormHistories.length > 0){
          this.$data.lv4TaskItemRule.disableAssignee = true
        }else{
          this.$data.lv4TaskItemRule.disableAssignee = false
        }
        this.$data.lv4TaskItemRule.disableParentNameInput = this.$data.statusCollection[statusIndex]['status_disable_change_parent']
      }
      if (iAction === 'Create') {
        // Set Dialog Default Value
        this.$data.taskLv4DialogTitle = '4 - New Workable Task'
        this.$data.activeTabForLv4 = 'tab_basic_info'
        if (iNeedInputParent) {
          this.$data.lv4TaskItemRule.disableParentNameInput = false
        } else {
          this.$data.lv4TaskItemRule.disableParentNameInput = true
        }
        this.$data.lv4TaskItemRule.disableTaskEst = false
        this.$data.lv4TaskItemRule.showProgress = false
        this.$data.lv4TaskItemRule.showCreator = false
        this.$data.taskLv4WorklogShow = false
        this.$nextTick(() => {
          this.$refs.taskLv4Tabs.$children[0].$refs.tabs[2].style.display = 'none' // Hide worklog history tab
        })
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
      if(tab.name === 'tab_regular_tasks_list'){
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
        this[iActiveTab] = 'tab_regular_tasks_list'
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
      var taskTypeTag = this[iObj].task_type_tag
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

      const result = await http.post('/worklogs/getTaskStatusAndLevel', {
        TaskId: reqTaskId
      })
      var taskLevel = Number(result.data.data.task_level);
      var taskStatus = result.data.data.task_status;
      if((taskLevel === 3 && (taskStatus === 'Drafting' | taskStatus === 'Planning')) || (taskLevel === 4 && taskStatus === 'Drafting' | taskStatus === 'Planning')){
        this.$message.error('The task status is Drafting/Planning!!!');
        return
      }
      
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
      this.$data.failToCreateL4 = true
      if (res.data.status === 0) {
        this.$data.worklogDialogVisible = false
        this.$message({message: 'Add worklog successfully!', type: 'success'})
      } else {
        this.$message.error('Failed to add worklog!')
      }
    },
    // Remove Task Dialog
    removeTask (iTaskId, iTaskName, iObj) {
      console.log(iTaskId, iTaskName, iObj)
      this.$data.removeTaskId = iTaskId
      this.$data.removeTaskName = iTaskName
      this.$data.removeTaskParentName = iObj.task_parent_name
      if (iObj.task_level === 1) {
        this.$data.removeTaskDesc = iObj.task_top_opp_name
      } 
      else if (iObj.task_level === 2 || iObj.task_level === 3) {
        this.$data.removeTaskDesc = iObj.task_desc
      }
      else {
        this.$data.removeTaskDesc = iObj.sub_task_desc
        this.$data.removeTaskParentName = iObj.sub_task_lv2_parent_name
      }
      this.$data.removeTaskDialogVisible = true
    },
    closeRemoveTask () {
      this.$data.removeTaskId = null
      this.$data.removeTaskName = ''
      this.$data.removeTaskParentName = ''
      this.$data.removeTaskDesc = ''
      this.$data.removeTaskDialogVisible = false
    },
    getDay (day) {
      var today = new Date()
      var targetDayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(targetDayMilliseconds)
      return this.dateToString(today)
    },
    async confirmRemoveTask () {
      var taskId = this.$data.removeTaskId
      var taskName = this.$data.removeTaskName
      var taskParentName = this.$data.removeTaskParentName
      // If worklog removed, the task can be removed
      var tUpdatedDate = this.getDay(0)
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
        console.log('Lv2 task list Length: ' + this.$data.lv2TaskList.length)
        for(var i = 0 ; i < this.$data.lv2TaskList.length ; i++){
          console.log(taskParentName)
          console.log(this.$data.lv2TaskList[i][0].task_name)
          if(this.$data.lv2TaskList[i][0].task_name === taskParentName ){
            if(Number(this.$data.formFilter.filterTaskLevel) == 3){
              await this.handleCurrentChangeOfEachTable(this.$data.lv2TaskList[i][0].task_current_page, taskParentName, i)              
            }else{
              await this.handleCurrentChangeOfEachTable(this.$data.currentPage1, taskParentName, i)  
            }
            break
          }
        }
        this.closeRemoveTask()
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
        var user_level = 0
        if(Number(this.$data.formFilter.filterTaskLevel) === 1){
          user_level = 9
        }else{
          user_level = 10
        }
        for (var a = 0; a < userList.length; a++) {
          if (userList[a].user_level > 0 && userList[a].user_level <= user_level) {
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
    getTaskStatusOptions (iStatus) {
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
      //var reqTaskLevel = Number(this.$data.formFilter.filterTaskLevel) - 1
      var reqTaskLevel = Number(this.$data.currentLevel)-1
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
          returnJson.type_tag = queryResult[i].task_type_tag
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
          this[iObj].task_type_tag = item.type_tag
          this[iObj].task_group_id = item.group_id
          this[iObj].task_reference = item.reference
          this[iObj].task_reference_desc = item.reference_desc
        }
      }
    },
    clearSelectForParentTask (iObj) {
      this[iObj].task_parent_name = null
      this[iObj].task_parent_desc = null
      this[iObj].task_type_tag = null
      this[iObj].task_type_id = null
      this[iObj].task_type_tag = null
      this[iObj].task_responsible_leader = null
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
    //Get current time as format: yyyy-MM-dd
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
    dateForYMD (iDate) {
      if (iDate !== null && iDate !== '' && iDate !== 'Invalid Date') {
        var changeDateYear = iDate.getFullYear()
        var changeDateMonth = this.stringAddZero(iDate.getMonth() + 1)
        var changeDateDay = this.stringAddZero(iDate.getDate())
        return changeDateYear + '-' + changeDateMonth + '-' + changeDateDay
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
    },
    setDialogWidth() {
      var val = document.body.clientWidth
      var defWidth = window.screen.width * 0.7
      console.log('width: --->', val)
      if (val < defWidth) {
        this.dialogWidth = '100%'
      } else {
        this.dialogWidth = '70%'
      }
    }
  },
  created () {
    this.$data.taskGroupArray = []
    this.$data.isChange = true
    this.$data.pathSelection = false
    this.$data.pageSize = 20
    this.$data.currentPage = 1
    this.$data.pageSize1 = 20
    this.$data.currentPage1 = 1
    this.getTaskGroup(0,true,true)
    this.getTaskList(1, 20)
    this.getActiveUserList()
    this.getTaskType(null)
  },
  mounted () {
    window.onresize = () => {
      return (() => {
        this.setDialogWidth()
      })()
    }
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
.path-bar {
  margin-top: 10px ;
  padding:5px 0;
  /* float:left; */
  background-color:#F7F7F7;
}
.tl-bar-item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tl-bar-item-btn {
  font-size: 1rem;
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
.task-list-loading {
  min-height: 150px;
  width: 100%;
  font-size: 17px;
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
.el-divider--horizontal1 {
  margin-top: 10px;
}
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
.row-expand-cover .el-table__expand-icon {
  visibility: hidden;
}
.row-height-line {
  background-color: #F7F7F7 !important;
}
.mouseClick {
  cursor: pointer
}
.not-allow {
  cursor: not-allowed;
}
.tl-bar-item .el-form-item {
  margin-bottom: 0;
}
.tl-bar-item .el-button--mini {
  padding: 7px 11px;
}
.tl-bar-item .el-radio-button--small .el-radio-button__inner {
  padding: 8px 11px;
}
</style>
