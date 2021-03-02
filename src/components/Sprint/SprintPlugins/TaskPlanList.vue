<template>
  <div class="sv-content-task-plan-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Backlogs</span>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input @keyup.enter.native="searchTask" @clear="searchTask" v-model="taskSearchCustomer" placeholder="Search Customer..." size="small" clearable></el-input>
          </el-col>
          <el-col :span="12">
            <el-input @keyup.enter.native="searchTask" @clear="searchTask" v-model="taskSearchKeyword" placeholder="Search Task..." size="small" clearable>
              <el-button @click="searchTask" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button @click="createTask" type="success" icon="el-icon-plus" size="small" style="width: 100%">New Task</el-button>
          </el-col>
        </el-row>
        <el-row class="task-plan-list-table">
          <el-col :span="24">
            <el-table v-loading="taskPlanListLoading" :data="taskPlanList" width="100%" size="mini">
              <el-table-column prop="taskTypeTag" label="TypeTag" v-if="false"></el-table-column>
              <el-table-column prop="taskName" label="Name" align="left" width="150">
                <template slot-scope="scope">
                  <el-button @click="editTask(scope.row.taskId, scope.row.taskCategory)" type="text">{{scope.row.taskName}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="taskTitle" label="Title" align="left" min-width="200" show-overflow-tooltip></el-table-column>
              <el-table-column prop="taskCustomer" label="Customer" align="center" min-width="70" show-overflow-tooltip></el-table-column>
              <el-table-column prop="taskEffort" label="Effort" align="center" width="55"></el-table-column>
              <el-table-column prop="taskEstimation" label="Est" align="center" width="55"></el-table-column>
              <el-table-column align="right" width="50" >
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="Create PMT Task" placement="top">
                    <el-button @click="createRefTask(scope.row)" type="primary" icon="el-icon-document-add" class="task-plan-list-table-btn"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="handlePageChange" :current-page="taskPlanListPage" :total="taskPlanListTotal" :page-size="taskPlanListSize" layout="total, prev, pager, next" style="float: right; margin-top: 5px"></el-pagination>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import http from '../../../utils/http'
import utils from '../../../utils/utils'
export default {
  name: 'TaskPlanList',
  components: {
  },
  data () {
    return {
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
      taskPlanList: [],
      taskSearchCustomer: '',
      taskSearchKeyword: '',
      taskPlanListSize: 30,
      taskPlanListPage: 1,
      taskPlanListTotal: 0,
      taskSprintObj: null,
      taskReqPage: 1,
      // Loading
      taskPlanListLoading: false
    }
  },
  props: {
      'sprint': Object
    },
  watch: {
    sprint: {
      handler (val, oldVal) {
        var sprintObj = val
        if (sprintObj != null && sprintObj != '') {
          this.$data.taskSprintObj = sprintObj
          this.getTaskPlanListBySkills(sprintObj, this.$data.taskSearchKeyword, this.$data.taskSearchCustomer)
        } else {
          this.$data.taskSprintObj = null
          this.taskPlanList = []
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async getTaskPlanListBySkills (iSprintObj, iKeyword, iCustomer) {
      this.$data.taskPlanListLoading = true
      this.$data.taskPlanList = []
      this.$data.taskPlanListTotal = 0
      if (iSprintObj.sprintRequiredSkills != null && iSprintObj.sprintRequiredSkills != '') {
        var skillsArray = iSprintObj.sprintRequiredSkills.toString()
        console.log(skillsArray)
        var resCount = await http.post('/tasks/getTasksListCountBySkill', {
          reqSkillsArray: skillsArray,
          reqTaskKeyword: iKeyword,
          reqTaskCustomer: iCustomer
        })
        if (resCount != null && resCount.data.status == 0) {
          this.$data.taskPlanListTotal = resCount.data.data
        }
        var resData = await http.post('/tasks/getTasksListBySkill', {
          reqSkillsArray: skillsArray,
          reqTaskKeyword: iKeyword,
          reqTaskCustomer: iCustomer,
          reqPage: this.$data.taskReqPage,
          reqSize: this.$data.taskPlanListSize
        })
        if (resData != null && resData.data.status == 0) {
          var taskList = resData.data.data
          this.$data.taskPlanList = taskList
        }
        this.$data.taskPlanListPage = this.$data.taskReqPage
      }
      this.$data.taskPlanListLoading = false
    },
    handlePageChange(val) {
      console.log('Page change -> ', val)
      this.$data.taskReqPage = val
      this.getTaskPlanListBySkills(this.$data.taskSprintObj, this.$data.taskSearchKeyword, this.$data.taskSearchCustomer)
    },
    searchTask () {
      this.getTaskPlanListBySkills(this.$data.taskSprintObj, this.$data.taskSearchKeyword, this.$data.taskSearchCustomer)
    },
    createTask () {
      this.$emit('createTask')
    },
    createRefTask (iTaskObj) {
      this.$emit('createRefTask', iTaskObj)
    },
    editTask (iTaskId, iTaskCategory) {
      this.$emit('editTask', iTaskId, iTaskCategory)
    }
  },
  created () {
  }
}
</script>

<style scoped>
.sv-content-task-plan-list {
  width: 100%;
  height: auto;
}
.sv-content-task-plan-list>>>.el-card__body {
  padding: 5px;
}
.task-plan-list-table {
  width: 100%;
  margin-top: 10px;
}
.task-plan-list-table>>>.el-table td {
  padding: 5px 0;
}
.task-plan-list-table>>>.el-table th {
  padding: 5px 0;
}
.task-plan-list-table>>>.el-button {
  padding: 3px 4px;
}
.task-plan-list-table>>>.el-button--primary {
  font-size: 16px;
}
</style>