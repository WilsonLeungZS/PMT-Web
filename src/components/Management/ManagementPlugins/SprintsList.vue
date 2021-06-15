<template>
<div class="sm-content">
  <el-card v-loading="sprintListLoading" class="box-card">
    <div slot="header" class="clearfix">
      <span class="sm-content-header">
        <span>Sprints List</span>
      </span>
    </div>
    <el-card v-for="(timeline, index) in timelineData" :key="index" class="box-card sm-content-sprint" shadow="hover">
      <div slot="header" class="clearfix">
        <el-collapse>
          <el-collapse-item @click.native="getSprintUserList(index, timeline.timelineStartTime, timeline.timelineEndTime, timeline.timelineWorkingDays)">
            <template slot="title">
              <el-row style="width: 100%; background-color: #eceff1">
                <el-col :span="4" :lg="4" class="sm-content-sprint-header-col">
                  <span style="margin-left: 10px"><b>{{timeline.timelineName}} <i @click.stop="copySprints(timeline.timelineId)" class="el-icon-document-copy sm-content-sprint-copy-item"></i></b></span>
                </el-col>
                <el-col :span="8" :lg="7" class="sm-content-sprint-header-col">
                  <span><b>Time Range:</b> {{timeline.timelineStartTime}} ~ {{timeline.timelineEndTime}}</span>
                </el-col>
                <el-col :span="3" :lg="4" class="sm-content-sprint-header-col">
                  <span><b>Working Days:</b> {{timeline.timelineWorkingDays}}</span>
                </el-col>
                <el-col :span="7" :lg="7" class="sm-content-sprint-header-col">
                  <span><b>Capacity ( Planned:</b> {{timeline.timelinePlannedCapacity}}</span>
                  <el-divider direction="vertical"></el-divider>
                  <span><b>Contract:</b> {{timeline.timelineContractCapacity}}<b> )</b></span>
                </el-col>
                <el-col :span="2" :lg="2" class="sm-content-sprint-header-col" style="justify-content: center;">
                  <el-button v-if="timeline.timelineCanObsolete" type="danger" size="mini">Obsolete</el-button>
                  <el-button v-if="timeline.timelineCanCreate" @click.stop="createSprint(timeline)" type="primary" size="mini">New Sprint</el-button>
                </el-col>
              </el-row>
            </template>
            <div style="margin: 0 20px">
              <el-table :data="timeline.timelineUsers" height="300px" :row-class-name="highlightRowClassName" class="sm-content-sprint-user-list-table">
                <el-table-column label="Name" prop="sprintUserFullName" align="left" min-width="100" sortable></el-table-column>
                <el-table-column label="Assign To Sprints" prop="sprintUserAssignToSprints" align="left" min-width="250" sortable show-overflow-tooltip></el-table-column>
                <el-table-column label="Skills" prop="sprintUserSkills" align="center" width="250" sortable show-overflow-tooltip></el-table-column>
                <el-table-column label="Planned Capacity" prop="sprintUserPlannedCapacity" align="center" width="250" sortable></el-table-column>
                <el-table-column label="Remaining Capacity" prop="sprintUserRemainingCapacity" align="center" width="250" sortable>
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.sprintUserRemainingCapacity  > 0" size="small" type="danger" effect="dark">{{scope.row.sprintUserRemainingCapacity}}</el-tag>
                    <el-tag v-if="scope.row.sprintUserRemainingCapacity == 0" size="small" type="info" effect="dark">{{scope.row.sprintUserRemainingCapacity}}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-table :data="timeline.timelineSprints" fit>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row :gutter="15">
              <el-col :span="4" :lg="2" class="sm-table-expand-label">
                <span>Name</span>
              </el-col>
              <el-col :span="8" :lg="8" class="sm-table-expand-item">
                <el-input v-model="props.row.sprintName" size="small" style="width: 100%"></el-input>
              </el-col>
              <el-col :span="4" :lg="2" class="sm-table-expand-label">
                <span>Base Capacity</span>
              </el-col>
              <el-col :span="8" :lg="3" class="sm-table-expand-item">
                <el-input v-model="props.row.sprintBaseCapacity" size="small" style="width: 100%">
                  <template slot="append">hrs</template>
                </el-input>
              </el-col>
              <el-col :span="4" :lg="2" class="sm-table-expand-label">
                <span>Leader</span>
              </el-col>
              <el-col :span="8" :lg="7" class="sm-table-expand-item">
                <el-select v-model="props.row.sprintLeaderId" size="small" style="width: 100%" filterable>
                  <el-option label="" value=""></el-option>
                  <el-option v-for="(leader, index) in leadersList" :key="index" :label="leader.userFullName" :value="leader.userId">
                    <span style="float: left; margin-right:20px">{{leader.userFullName}}</span>
                    <span style="float: right; color: #8492a6; font-size: 12px">Level - {{leader.userLevel}}</span>
                  </el-option>
                </el-select>
              </el-col>              
            </el-row>
            <el-divider></el-divider>
            <el-row :gutter="15">
              <el-col :span="4" :lg="2" class="sm-table-expand-label">
                <span>Baseline</span>
              </el-col>
              <el-col :span="20" :lg="13" class="sm-table-expand-item">
                <el-input v-model="props.row.sprintBaseline" size="small" style="width: 100%"></el-input>
              </el-col>
              <el-col :span="4" :lg="2" class="sm-table-expand-label">
                <span>Customers</span>
              </el-col>
              <el-col :span="8" :lg="7" class="sm-table-expand-item">
                <el-select v-model="props.row.sprintCustomers" size="small" style="width: 100%" multiple>
                  <el-option v-for="(customer, index) in customersList" :key="index" :label="customer.customerName" :value="customer.customerId"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row :gutter="15">
              <el-col :span="4" :lg="2" class="sm-table-expand-label">
                <span>Required Skills</span>
              </el-col>
              <el-col :span="8" :lg="13" class="sm-table-expand-item">
                <el-select v-model="props.row.sprintRequiredSkills" size="small" style="width: 100%" multiple>
                  <el-option-group v-for="(skillGroup, index) in skillsList" :key="index" :label="skillGroup.Label">
                    <el-option v-for="(skill, index) in skillGroup.Options" :key="index" :label="skill.skillName" :value="skill.skillId">
                      <span style="float: left;">{{ skill.skillName }}</span>
                      <span style="float: left; margin-left:10px; color: #8492a6; font-size: 12px">{{ skill.skillDesc }}</span>
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-col>
              <el-col :span="4" :lg="2" class="sm-table-expand-label">
                <span>Data Source</span>
              </el-col>
              <el-col :span="8" :lg="5" class="sm-table-expand-item">
                <el-select v-model="props.row.sprintDataSource" size="small" style="width: 100%" multiple>
                  <el-option label="Manual" value="Manual"></el-option>
                  <el-option label="Service Now" value="ServiceNow"></el-option>
                  <el-option label="TRLS" value="TRLS"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6" :lg="2" class="sm-table-expand-item">
                <el-button @click="saveSprint(props.row)" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="small" style="width:100%">Save</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="Id" prop="sprintId" v-if="false" :key="1"></el-table-column>
        <el-table-column label="Name" prop="sprintName" align="left" min-width="100" sortable show-overflow-tooltip :key="2"></el-table-column>
        <el-table-column label="Base Capacity" prop="sprintBaseCapacity" align="center" width="150" :key="3"></el-table-column>
        <el-table-column label="Required Skills" prop="sprintRequiredSkillsStr" align="center" min-width="100" show-overflow-tooltip :key="4"></el-table-column>
        <el-table-column label="Baseline" prop="sprintBaseline" align="left" min-width="200" show-overflow-tooltip :key="5"></el-table-column>
        <el-table-column label="Customers" prop="sprintCustomersStr" align="center" show-overflow-tooltip :key="6"></el-table-column>
        <el-table-column label="Leader" prop="sprintLeader" align="center" width="150" sortable :key="7"></el-table-column>
        <el-table-column label="Status" prop="sprintStatus" align="center" width="100" :key="8">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.sprintStatus === 'Active'" size="small" type="primary" effect="dark">{{scope.row.sprintStatus}}</el-tag>
            <el-tag v-if="scope.row.sprintStatus === 'Running'" size="small" type="success" effect="dark">{{scope.row.sprintStatus}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </el-card>
  <!-- Create new sprint dialog -->
  <el-dialog title="Create New Sprint" :visible.sync="newSprintDialogVisible" width="800px" class="sm-dialog">
    <div>
      <el-card class="box-card" shadow="never">
        <el-row :gutter="20">
          <el-col :span="3" class="sm-dialog-label">
            <span>Start Time</span>
          </el-col>
          <el-col :span="5" class="sm-dialog-item">
            <span>{{sprintData.sprintStartTime}}</span>
          </el-col>
          <el-col :span="3" class="sm-dialog-label">
            <span>End Time</span>
          </el-col>
          <el-col :span="5" class="sm-dialog-item">
            <span>{{sprintData.sprintEndTime}}</span>
          </el-col>
          <el-col :span="4" class="sm-dialog-label">
            <span>Working Days</span>
          </el-col>
          <el-col :span="4" class="sm-dialog-item">
            <span>Total <b style="text-decoration:underline; margin: 0 5px; font-size: 16px">{{sprintData.sprintWorkingDays}}</b> days</span> 
          </el-col>
          <el-col :span="3" class="sm-dialog-label">
            <span>Name</span>
          </el-col>
          <el-col :span="21" class="sm-dialog-item">
            <el-input v-model="sprintData.sprintName" size="small" style="width: 100%"></el-input>
          </el-col>
          <el-col :span="3" class="sm-dialog-label">
            <span>Leader</span>
          </el-col>
          <el-col :span="9" class="sm-dialog-item">
            <el-select v-model="sprintData.sprintLeaderId" size="small" style="width: 100%" filterable>
              <el-option label="" value=""></el-option>
              <el-option v-for="(leader, index) in leadersList" :key="index" :label="leader.userFullName" :value="leader.userId">
                <span style="float: left; margin-right:20px">{{leader.userFullName}}</span>
                <span style="float: right; color: #8492a6; font-size: 12px">Level - {{leader.userLevel}}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4" class="sm-dialog-label">
            <span>Base Capacity</span>
          </el-col>
          <el-col :span="8" class="sm-dialog-item">
            <el-input v-model="sprintData.sprintBaseCapacity" size="small" style="width: 100%">
              <template slot="append">hrs</template>
            </el-input>
          </el-col>                  
        </el-row>
        <el-divider></el-divider>
        <el-row :gutter="20">
          <el-col :span="3" class="sm-dialog-label">
            <span>Baseline</span>
          </el-col>
          <el-col :span="21" class="sm-dialog-item">
            <el-input v-model="sprintData.sprintBaseline" size="small" style="width: 100%"></el-input>
          </el-col>
          <el-col :span="4" class="sm-dialog-label">
            <span>Required Skills</span>
          </el-col>
          <el-col :span="20" class="sm-dialog-item">
            <el-select v-model="sprintData.sprintRequiredSkills" size="small" style="width: 100%" multiple>
              <el-option-group v-for="(skillGroup, index) in skillsList" :key="index" :label="skillGroup.Label">
                <el-option v-for="(skill, index) in skillGroup.Options" :key="index" :label="skill.skillName" :value="skill.skillId">
                  <span style="float: left;">{{ skill.skillName }}</span>
                  <span style="float: left; margin-left:10px; color: #8492a6; font-size: 12px">{{ skill.skillDesc }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-col>
          <el-col :span="4" class="sm-dialog-label">
            <span>Data Source</span>
          </el-col>
          <el-col :span="20" class="sm-dialog-item">
            <el-select v-model="sprintData.sprintDataSource" size="small" style="width: 100%" multiple>
              <el-option label="Manual" value="Manual"></el-option>
              <el-option label="Service Now" value="ServiceNow"></el-option>
              <el-option label="TRLS" value="TRLS"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" class="sm-dialog-label">
                <span>Customers</span>
              </el-col>
              <el-col :span="20" class="sm-dialog-item">
                <el-select v-model="sprintData.sprintCustomers" size="small" style="width: 100%" multiple>
                  <el-option v-for="(customer, index) in customersList" :key="index" :label="customer.customerName" :value="customer.customerId"></el-option>
                </el-select>
              </el-col>
        </el-row>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="newSprintDialogVisible = false" size="small">Cancel</el-button>
      <el-button @click="saveSprint(sprintData)" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" size="small">Create</el-button>
    </span>
  </el-dialog>
  <!-- Copy Sprints Dialog -->
  <el-dialog v-loading="copySprintsLoading" title="Copy Sprints" :visible.sync="copySprintsDialogVisible" width="1200px" class="sm-dialog">
    <div>
      <el-row>
        <el-col :span="11">
          <el-card class="box-card" shadow="never" style="width: 100%; height: 350px;">
            <el-row>
              <el-col :span="7" class="sm-dialog-label">
                <span>Source Timeline</span>
              </el-col>
              <el-col :span="17" class="sm-dialog-item">
                <el-select disabled v-loading="copySprintsTimelinesListLoading" v-model="copySprintsSourceTimeline" size="small" style="width: 100%">
                  <el-option v-for="(timeline, index) in copySprintsTimelinesList" :key="index" :label="timeline.timelineName + ' 【' + timeline.timelineStartTime + ' ~ ' + timeline.timelineEndTime + '】'" :value="timeline.timelineId"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-table v-loading="copySprintsSourceTimelineSprintsListLoading" @selection-change="handleCopySprintsSelectionChange" :data="copySprintsSourceTimelineSprintsList" style="width: 100%" size="small" height="285px">
              <el-table-column prop="sprintId" v-if="false"></el-table-column>
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column prop="sprintName" label="Sprint" align="left" min-width="150" show-overflow-tooltip></el-table-column>
              <el-table-column prop="sprintCustomersStr" label="Customers" align="center" width="150" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="2">
          <div style=" display: flex; justify-content: center; align-items: center; width: 100%; height: 350px">
            <el-button :disabled="copySprintsBtnDisabled" @click="copySprintsFromSource" type="primary" icon="el-icon-d-arrow-right" size="small" style="font-size: 20px; padding: 5px; width: 80%"></el-button>
          </div>
        </el-col>
        <el-col :span="11">
          <el-card class="box-card" shadow="never" style="width: 100%; height: 350px;">
            <el-row>
              <el-col :span="7" class="sm-dialog-label">
                <span>Target Timeline</span>
              </el-col>
              <el-col :span="17" class="sm-dialog-item">
                <el-select @change="handleCopySprintsTargetTimelineChange" v-loading="copySprintsTimelinesListLoading" v-model="copySprintsTargetTimeline" size="small" style="width: 100%">
                  <el-option v-for="(timeline, index) in copySprintsTimelinesList" :key="index" :label="timeline.timelineName + ' 【' + timeline.timelineStartTime + ' ~ ' + timeline.timelineEndTime + '】'" :value="timeline.timelineId" v-if="timeline.timelineCanCreate">
                    <span style="float: left;">{{ timeline.timelineName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 12px">{{ timeline.timelineStartTime }} ~ {{ timeline.timelineEndTime }}</span>
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-table v-loading="copySprintsTargetTimelineSprintsListLoading" :data="copySprintsTargetTimelineSprintsList" style="width: 100%" size="small" height="285px">
              <el-table-column prop="sprintId" v-if="false"></el-table-column>
              <el-table-column prop="sprintName" label="Sprint" align="left" min-width="150" show-overflow-tooltip></el-table-column>
              <el-table-column prop="sprintCustomersStr" label="Customers" align="center" width="150" show-overflow-tooltip></el-table-column>
              <el-table-column label="Remove" align="center" fixed="right" width="70">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.sprintExistIndicator == 'New'" @click="removeCopySprint(scope.row)" type="danger" icon="el-icon-delete" size="small" style="padding: 4px 8px; font-size: 14px;"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="copySprintsDialogVisible = false">Cancel</el-button>
      <el-button @click="saveCopySprintsList" :disabled="copySprintsSaveBtnDisabled" type="primary">Save</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import http from '../../../utils/http'
import utils from '../../../utils/utils'
export default {
  name: 'SprintsList',
  data () {
    return {
      skillsList: [],
      leadersList: [],
      customersList: [],
      timelineData: [],
      sprintData: {
        sprintId: 0,
        sprintName: null,
        sprintStartTime : null,
        sprintEndTime : null,
        sprintBaseline: null,
        sprintWorkingDays: 0,
        sprintBaseCapacity: 0,
        sprintRequiredSkills: [],
        sprintCustomers: [],
        sprintStatus: 'Active',
        sprintDataSource: ['Manual'],
        sprintLeaderId: null,
        sprintTimelineId: null,
        sprintCustomers: []
      },
      sprintGroup: [],
      newSprintDialogVisible: false,
      sprintListLoading: false,
      copySprintsDialogVisible: false,
      copySprintsBtnDisabled: true,
      copySprintsSaveBtnDisabled: false,
      copySprintsLoading: false,
      copySprintsTimelinesList: [],
      copySprintsSourceTimeline: null,
      copySprintsSourceTimelineSprintsList: [],
      copySprintsSelection: [],
      copySprintsTargetTimeline: null,
      copySprintsTargetTimelineSprintsList: [],
      copySprintsTimelinesListLoading: false,
      copySprintsSourceTimelineSprintsListLoading: false,
      copySprintsTargetTimelineSprintsListLoading: false,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2
    }
  },
  watch: {
    copySprintsTargetTimeline: {
      handler (newVal, oldVal) {
        this.$data.copySprintsBtnDisabled = true
        if(newVal != null) {
          if (this.$data.copySprintsSelection != null && this.$data.copySprintsSelection.length > 0) {
            this.$data.copySprintsBtnDisabled = false
          }
        }
      },
      immediate: true
    },
    copySprintsSelection: {
      handler (newVal, oldVal) {
        this.$data.copySprintsBtnDisabled = true
        if(newVal != null && newVal.length > 0) {
          if (this.$data.copySprintsTargetTimeline != null) {
            this.$data.copySprintsBtnDisabled = false
          } 
        }
      },
      immediate: true
    }
  },
  methods: {
    // Create public task for new sprint
    async createPublic(resultSprint){
      console.log('Start to create public task')
      var publicTaskObj = {
        reqTaskId: 0,
        reqTaskParentTaskName: null,
        reqTaskCategory: 'PMT-TASK-REF',
        reqTaskType: null,
        reqTaskDescription: null,
        reqTaskReferenceTask: 'Public',
        reqTaskTypeTag: 'Public Task',
        reqTaskDeliverableTag: null,
        reqTaskCreator: 'PMT:System',
        reqTaskRequiredSkills: resultSprint.RequiredSkills,
        reqTaskCustomer: 'PMO',
        reqTaskStatus: 'Running',
        reqTaskEstimation: 0,
        reqTaskIssueDate: this.formatDate(new Date(), 'yyyy-MM-dd'),
        reqTaskTargetComplete: resultSprint.EndTime,
        reqTaskActualComplete: resultSprint.EndTime,
        reqTaskRespLeaderId: resultSprint.LeaderId,
        reqTaskAssigneeId: null,
        reqTaskSprintId: resultSprint.Id,
        reqTaskSprintIndicator: 'PUBLIC'
      }
      var publicTaskStr = JSON.stringify(publicTaskObj)
      var publicTaskArray = []
      // Leave task (annual/sick/others)
      var nonFlexLeave = JSON.parse(publicTaskStr)
      nonFlexLeave.reqTaskName = 'Leave - ' + resultSprint.Id
      nonFlexLeave.reqTaskTitle = 'Annual/Sick/Other Leave'
      publicTaskArray.push(nonFlexLeave)
      // Leave task (flex)
      var flexLeave = JSON.parse(publicTaskStr)
      flexLeave.reqTaskName = 'FlexLeave - ' + resultSprint.Id
      flexLeave.reqTaskTitle = 'Flex Leave'
      publicTaskArray.push(flexLeave)
      // Training task (training)
      var training = JSON.parse(publicTaskStr)
      training.reqTaskName = 'Training - ' + resultSprint.Id
      training.reqTaskTitle = 'Company Training'
      publicTaskArray.push(training)
      // Meeting task (meeting)
      var meeting = JSON.parse(publicTaskStr)
      meeting.reqTaskName = 'Meeting - ' + resultSprint.Id
      meeting.reqTaskTitle = 'Team meeting (Daily Scrum/Retrospective/Planning/Monthly/Other Meeting)'
      publicTaskArray.push(meeting)

      for (var i=0; i<publicTaskArray.length; i++) {
        const res = await http.post('/tasks/updateTask', publicTaskArray[i])
        if (res.data != null && res.data.status == 0) {
          console.log('Create public task successfully -> ', publicTaskArray[i].reqTaskName)
        } else {
          console.log('Create public task fail -> ', publicTaskArray[i].reqTaskName)
        }
      }
    },
    // Style Method
    highlightRowClassName ({row, rowIndex}) {
      if (row.sprintUserRemainingCapacity > 0) {
        return 'highlight-row'
      } else {
        return ''
      }
    },
    // Skill & User List Handling
    async getAllSkillsList () {
      console.log('Start getAllSkillsList')
      this.$data.skillsList = []
      const res = await http.get('/users/getAllSkillsList')
      if (res.data.status === 0) {
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
    async getActiveLeadersList () {
      this.$data.leadersList = []
      const res = await http.get('/users/getActiveUsersListByLevelLimit', {reqUserLevelLimit: 10})
      if (res.data.status === 0) {
        this.$data.leadersList = res.data.data.filter(item => item.userLevel <= 10)
      } else {
        this.$data.leadersList = []
      }
    },
    async getSprintUserList (index, iStartTime, iEndTime, iWorkingDays) {
      console.log('getSprintUserList -> ', index, iStartTime, iEndTime)
      this.$data.timelineData[index].timelineUsers = []
      var res = await http.get('/sprints/getSprintsGroupUserList', {
        reqStartTime: iStartTime,
        reqEndTime: iEndTime,
        reqWorkingDays: iWorkingDays
      })
      if (res.data != null && res.data.status == 0) {
        this.$data.timelineData[index].timelineUsers = res.data.data
        this.$forceUpdate()
      }
    },
    async getCustomerList () {
      this.$data.customersList = []
      const res = await http.get('/sprints/getAllCustomersList')
      if (res.data.status === 0) {
        this.$data.customersList = res.data.data
      }
    },
    async getTimelineList () {
      this.$data.timelineData = []
      const res = await http.get('/sprints/getAllTimelinesList')
      if (res.data.status === 0) {
        this.$data.timelineData = res.data.data
      }
    },
    // Sprint Management
    async getSprintsList () {
      console.log('getSprintsList start')
      this.$data.sprintListLoading = true
      this.$data.sprintGroup = []
      const res = await http.get('/sprints/getActiveSprintsGroup')
      if (res.data.status === 0) {
        var sprintGroup = res.data.data
        this.$data.sprintGroup = sprintGroup
      } else {
        this.$data.sprintGroup = []
      }
      this.$data.sprintListLoading = false
    },
    createSprint (iTimeline) {
      this.$data.sprintData = {
        sprintId: 0,
        sprintName: null,
        sprintBaseline: null,
        sprintStartTime: iTimeline.timelineStartTime,
        sprintEndTime: iTimeline.timelineEndTime,
        sprintWorkingDays: iTimeline.timelineWorkingDays,
        sprintBaseCapacity: 0,
        sprintRequiredSkills: [],
        sprintCustomers: [],
        sprintStatus: 'Active',
        sprintDataSource: ['Manual'],
        sprintLeaderId: null,
        sprintTimelineId: iTimeline.timelineId
      }
      this.$data.newSprintDialogVisible = true
    },
    async saveSprint (sprint) {
      console.log(sprint)
      if(this.isEmptyField(sprint.sprintName, 'Name') || this.isEmptyField(sprint.sprintStartTime, 'Start Time') || this.isEmptyField(sprint.sprintEndTime, 'End Time')) return
      if (sprint.sprintRequiredSkills.length > 0) {
        for (var i=0; i<sprint.sprintRequiredSkills.length; i++) {
          sprint.sprintRequiredSkills[i] = '#' + sprint.sprintRequiredSkills[i] + '#'
        }
      } else {
        this.showMessage('Required skills could not be empty!', 'error')
        return
      }
      if (sprint.sprintCustomers.length > 0) {
        for (var i=0; i<sprint.sprintCustomers.length; i++) {
          sprint.sprintCustomers[i] = '#' + sprint.sprintCustomers[i] + '#'
        }
      }
      const res = await http.post('/sprints/updateSprint', {
        reqSprintId: sprint.sprintId,
        reqSprintName: sprint.sprintName,
        reqSprintStartTime : sprint.sprintStartTime,
        reqSprintEndTime: sprint.sprintEndTime,
        reqSprintBaseline: sprint.sprintBaseline,
        reqSprintWorkingDays: sprint.sprintWorkingDays,
        reqSprintBaseCapacity: sprint.sprintBaseCapacity,
        reqSprintRequiredSkills: sprint.sprintRequiredSkills != null? sprint.sprintRequiredSkills.toString(): null,
        reqSprintCustomers: sprint.sprintCustomers != null? sprint.sprintCustomers.toString(): null,
        reqSprintStatus: sprint.sprintStatus,
        reqSprintDataSource: sprint.sprintDataSource != null? sprint.sprintDataSource.toString(): null,
        reqSprintLeaderId: sprint.sprintLeaderId,
        reqSprintTimelineId: sprint.sprintTimelineId
      })
      if (res.data != null && res.data.status === 0) {
        // Create public task for new sprint
        var resultSprint = res.data.data
        console.log('resultSprint -> ', resultSprint)
        if (res.data.message.startsWith('Create')) {
          this.createPublic(resultSprint)
        }
        console.log('resultSprint -> Done')
        this.getAllSkillsList()
        this.getActiveLeadersList()
        this.getCustomerList()
        this.getTimelineList()
        this.getSprintsList()
        this.showMessage('Add/Update sprint successfully!', 'success')
        this.$data.newSprintDialogVisible = false
      } else {
        this.$message.error('Add/Update sprint Failed!')
      }
    },
    obsoleteSprint (props) {
      var sprint = props.row
      var sprintId = sprint.sprintId
      // No task under this sprint, will delete it
      // If all task done, will update sprint status to obsolete
      // If exist task not done, return
    },
    async copySprints (iTimelineId) {
      console.log('Copy Sprints from timeline ->', iTimelineId)
      this.$data.copySprintsTimelinesList = []
      this.$data.copySprintsSourceTimeline = iTimelineId
      this.$data.copySprintsTargetTimeline = null
      this.$data.copySprintsSourceTimelineSprintsList = []
      this.$data.copySprintsTargetTimelineSprintsList = []
      this.$data.copySprintsDialogVisible = true
      // Get timeline list
      this.$data.copySprintsTimelinesListLoading = true
      const res = await http.get('/sprints/getAllTimelinesList')
      if (res.data != null && res.data.status === 0) {
        this.$data.copySprintsTimelinesList = res.data.data
        this.$data.copySprintsTimelinesListLoading = false
      }
      // Get source timeline sprints list
      this.$data.copySprintsSourceTimelineSprintsListLoading = true
      const res1 = await http.get('/sprints/getSprintsListByTimelineId', {
        reqTimelineId: Number(this.$data.copySprintsSourceTimeline)
      })
      if (res1.data != null && res1.data.status === 0) {
        this.$data.copySprintsSourceTimelineSprintsList = res1.data.data
      }
      this.$data.copySprintsSourceTimelineSprintsListLoading = false
    },
    async handleCopySprintsTargetTimelineChange () {
      if (this.$data.copySprintsTargetTimeline == this.$data.copySprintsSourceTimeline) {
        this.$message.error('Source timeline and target timeline cannot be same!')
        this.$data.copySprintsTargetTimeline = null
        return
      }
      this.$data.copySprintsTargetTimelineSprintsList = []
      this.$data.copySprintsTargetTimelineSprintsListLoading = true
      const res = await http.get('/sprints/getSprintsListByTimelineId', {
        reqTimelineId: Number(this.$data.copySprintsTargetTimeline)
      })
      if (res.data != null && res.data.status === 0) {
        this.$data.copySprintsTargetTimelineSprintsList = res.data.data
      }
      this.$data.copySprintsTargetTimelineSprintsListLoading = false
    },
    async handleCopySprintsSelectionChange (val) {
      this.$data.copySprintsSelection = val
    },
    copySprintsFromSource () {
      console.log(this.$data.copySprintsTargetTimelineSprintsList, this.$data.copySprintsSelection)
      var copySprintsSelection = this.$data.copySprintsSelection
      var backupList = JSON.stringify(this.$data.copySprintsTargetTimelineSprintsList)
      for (var i=0; i<copySprintsSelection.length; i++) {
        var index = this.getIndexOfValueInArr(this.$data.copySprintsTargetTimelineSprintsList, 'sprintName', copySprintsSelection[i].sprintName)
        if (index != -1) {
          this.$message.error('Target timeline exist same name sprint!')
          this.$data.copySprintsTargetTimelineSprintsList = JSON.parse(backupList)
          return
        }
        copySprintsSelection[i].sprintExistIndicator = 'New'
        this.$data.copySprintsTargetTimelineSprintsList.push(copySprintsSelection[i])
      }
    },
    removeCopySprint (iSprint) {
      console.log('Sprint -> ', iSprint)
      if (this.$data.copySprintsTargetTimelineSprintsList != null && this.$data.copySprintsTargetTimelineSprintsList.length > 0) {
        var index = this.getIndexOfValueInArr(this.$data.copySprintsTargetTimelineSprintsList, 'sprintId', iSprint.sprintId)
        if (index != -1) {
          this.$data.copySprintsTargetTimelineSprintsList.splice(index, 1)
        }
      }
    },
    async saveCopySprintsList () {
      var copySprintsTargetTimelineSprintsList = this.$data.copySprintsTargetTimelineSprintsList
      if (copySprintsTargetTimelineSprintsList != null && copySprintsTargetTimelineSprintsList.length > 0) {
        // Disabeld button and loading
        this.$data.copySprintsSaveBtnDisabled = true
        this.$data.copySprintsLoading = true
        var newSprintIdArray = []
        for (var i=0; i<copySprintsTargetTimelineSprintsList.length; i++) {
          if (copySprintsTargetTimelineSprintsList[i].sprintExistIndicator == 'New') {
            newSprintIdArray.push(copySprintsTargetTimelineSprintsList[i].sprintId)
          }
        }
        if (newSprintIdArray != null && newSprintIdArray.length > 0 && this.$data.copySprintsSourceTimeline != null && this.$data.copySprintsTargetTimeline != null) {
          var res = await http.post('/sprints/copySprints', {
            reqSprintIdArray: newSprintIdArray.toString(),
            reqSourceTimelineId: Number(this.$data.copySprintsSourceTimeline),
            reqTargetTimelineId: Number(this.$data.copySprintsTargetTimeline)
          })
          if (res.data != null && res.data.status === 0) {
            res.data.data.forEach(item => {
              this.createPublic(item)
            });
            this.showMessage('Copy sprints to target timeline successfully!', 'success')
          } else {
            this.$message.error('Failed to copy sprints to target timeline!')
          }
          this.handleCopySprintsTargetTimelineChange()
        }
        this.$data.copySprintsSaveBtnDisabled = false
        this.$data.copySprintsLoading = false
        this.initSprintsList()
      } else {
        this.$message.error('Target timeline no sprint exist!')
        return
      }
    },
    // Common method
    isEmptyField (iField, iFieldName) {
      if (iField == null || iField == '') {
        this.showMessage( iFieldName + ' could not be empty!', 'error')
        return true
      }
    },
    showMessage (iMsg, iType) {
      this.$message({
        message: iMsg,
        type: iType
      })
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
    initSprintsList () {
      this.getAllSkillsList()
      this.getActiveLeadersList()
      this.getCustomerList()
      this.getTimelineList()
      this.getSprintsList()
    }
  },
  created () {
    this.initSprintsList()
  }
}
</script>

<style scoped>
/* Content Style */
.sm-content {
  width: auto;
  height: auto;
  padding: 20px 5px 0px 5px;
  text-align: left;
}
.sm-content-header {
  font-size: 24px;
  margin-left: 10px;
  color: #747d8c;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}
.sm-content-header-btn {
  font-size: 14px;
  margin-left: 30px;
}
.sm-table-expand-label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 32px;
  line-height: 32px;
  font-size: 15px;
  color: #99a9bf;
  margin-bottom: 10px;
}
.sm-table-expand-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 32px;
  line-height: 32px;
  margin-bottom: 10px;
}
.sm-content>>>.el-divider {
  background-color: #e0e0e0;
}
.sm-content-sprint {
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
}
.sm-content-sprint>>>.el-card__header {
  padding: 0px;
}
.sm-content-sprint>>>.el-collapse-item__header {
  border: 0;
  height: 38px;
  line-height: 38px;
}
.sm-content-sprint-header-col {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
}
.sm-content-sprint-header-col .span{
  width: 100%;
}
.sm-content-sprint-copy-item {
  color: white;
  font-size: 16px;
  font-weight: 500;
  background-color: #409EFF;
  border-radius: 3px;
  padding: 4px 8px;
  margin-left: 3px;
}
.sm-dialog>>>.el-dialog__body {
  padding: 5px 10px;
}
.sm-dialog-label {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 32px;
  line-height: 32px;
  font-size: 15px;
  color: #99a9bf;
  margin-bottom: 10px;
}
.sm-dialog-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 32px;
  line-height: 32px;
  margin-bottom: 10px;
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
</style>
<style>
.sm-content .el-card__body {
  padding: 5px 10px;
}
.sm-content .el-table td {
  padding: 8px 0;
}
.sm-content .el-table th {
  padding: 3px 0;
}
.sm-content .el-divider--horizontal {
  margin: 2px 0 10px 0;
}
.sm-content-sprint-user-list-table .highlight-row{
  background: #f0f9eb;
}
/* google、safari */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
