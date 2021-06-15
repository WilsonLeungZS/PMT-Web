<template>
  <div class="sv-content-task-plan-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Backlogs ({{taskPlanListTotal}})</span>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="8" :lg="5" style="margin: 5px 0">
            <el-select v-model="taskSearchCustomer" multiple collapse-tags placeholder="Customers..." size="small">
              <el-option v-for="(customer, index) in customerData" :key="index" :label="customer.customerName" :value="customer.customerId"></el-option>
            </el-select>
          </el-col>
          <el-col :span="16" :lg="10" style="margin: 5px 0">
            <el-input @keyup.enter.native="searchTask" @clear="searchTask" v-model="taskSearchKeyword" placeholder="Search Task..." size="small" clearable>
              <el-button v-if="taskSearchKeyword != ''" @click="searchTask" slot="append" icon="el-icon-search"></el-button>
              <el-button v-if="taskSearchKeyword == ''" @click="searchTask" slot="append" icon="el-icon-refresh"></el-button>
            </el-input>
          </el-col>
          <el-col :span="12" :lg="5" style="margin: 5px 0">
            <el-checkbox @change="searchTask" v-model="taskCheckboxShowDoneTask" label="Show 'Done'" border size="small" style="width: 100%; height: 100%; padding: 6px"></el-checkbox>
          </el-col>
          <el-col :span="12" :lg="4" style="margin: 5px 0">
            <el-tooltip class="item" effect="dark" content="Only allow level < 10 user can create new backlog" placement="top">
              <el-button @click="createTask" :disabled="userLevel>10" type="success" icon="el-icon-plus" size="small" style="width: 100%">New Task</el-button>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row class="task-plan-list-table">
          <el-col :span="24">
            <el-table v-loading="taskPlanListLoading" :data="taskPlanList" :row-style="setTaskListBackgroundColor" width="100%" size="mini">
              <el-table-column prop="taskTypeTag" label="TypeTag" v-if="false"></el-table-column>
              <el-table-column prop="taskName" label="Name" align="left" width="130" fixed="left">
                <template slot-scope="scope">
                  <el-button @click="editTask(scope.row.taskId, scope.row.taskCategory)" type="text">{{scope.row.taskName}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="taskTitle" label="Title" align="left" min-width="200" show-overflow-tooltip></el-table-column>
              <el-table-column prop="taskStatus" label="Status" align="center"  width="68px">
                <template slot-scope="scope">
                  <el-tag effect="dark" type="warning" size="mini" v-if="scope.row.taskStatus == 'Drafting'">{{scope.row.taskStatus}}</el-tag>
                  <el-tag effect="dark" type="primary" size="mini" v-if="scope.row.taskStatus == 'Planning'">{{scope.row.taskStatus}}</el-tag>
                  <el-tag effect="dark" type="success" size="mini" v-if="scope.row.taskStatus == 'Running'" >{{scope.row.taskStatus}}</el-tag>
                  <el-tag effect="dark" type="info"    size="mini" v-if="scope.row.taskStatus == 'Done'"    >{{scope.row.taskStatus}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="taskCustomer" label="Customer" align="center" width="77" show-overflow-tooltip></el-table-column>
              <el-table-column prop="taskEffort" label="Effort" align="center" width="55"></el-table-column>
              <el-table-column prop="taskEstimation" label="Est" align="center" width="55"></el-table-column>
              <el-table-column align="right" width="50" fixed="right">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="disabledMessage" placement="top">
                    <el-button :disabled="disabledCreateRefTaskBtn" @click="createRefTask(scope.row)" type="primary" icon="el-icon-document-add" class="task-plan-list-table-btn"></el-button>
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
      taskSearchCustomer: [],
      taskSearchKeyword: '',
      taskCheckboxShowDoneTask: false,
      taskPlanListSize: 30,
      taskPlanListPage: 1,
      taskPlanListTotal: 0,
      taskSprintObj: null,
      taskReqPage: 1,
      customerData: [],
      // Loading
      taskPlanListLoading: false,
      userLevel: this.$store.getters.getUserLevel,
      disabledCreateRefTaskBtn: false,
      disabledMessage: 'Create PMT Task'
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
          /**
           * 2021-06-04 keep the customer selected after backlog task updated
           */
          // this.$data.taskSearchCustomer = []
          this.getTaskPlanListBySkills(sprintObj, this.$data.taskSearchKeyword, this.$data.taskSearchCustomer, this.$data.taskCheckboxShowDoneTask)
          this.validateSprint(sprintObj)
        } else {
          this.$data.taskSprintObj = null
          this.taskPlanList = []
          // this.$data.taskSearchCustomer = []
        }
        this.getCustomerList()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // Style Method
    setTaskListBackgroundColor ({row, column, rowIndex, columnIndex}) {
      return { 'background-color': row.taskBackgroundColor }
    },
    // Functional Method
    validateSprint (iSprintObj) {
      var sprintEndTime = iSprintObj.sprintEndTime
      var currentTime = this.formatDate(new Date(), 'yyyy-MM-dd')
      if (currentTime > sprintEndTime) {
        this.$data.disabledMessage = 'Not allow to edit sprint after the sprint end'
        this.$data.disabledCreateRefTaskBtn = true
      }
      else {
        this.$data.disabledMessage = 'Create PMT Task'
        this.$data.disabledCreateRefTaskBtn = false
      }
    },
    async getTaskPlanListBySkills (iSprintObj, iKeyword, iCustomer, iShowDoneTask) {
      this.$data.taskPlanListLoading = true
      this.$data.taskPlanList = []
      this.$data.taskPlanListTotal = 0
      this.$data.taskPlanListPage = 1
      if (iSprintObj.sprintRequiredSkills != null && iSprintObj.sprintRequiredSkills != '') {
        var skillsArray = iSprintObj.sprintRequiredSkills.toString()
        var customersArrayStr = iSprintObj.sprintCustomers != null? iSprintObj.sprintCustomers.toString(): null
        // Compare filter customer and sprint customer
        if (iCustomer != null && iCustomer.length > 0) {
          if (customersArrayStr != null && customersArrayStr.length > 0) {
            var customersArray = this.getSame(customersArrayStr.split(','), iCustomer.map(String))
            if (customersArray != null && customersArray.length > 0) {
              customersArrayStr = customersArray.toString()
            }
            this.$data.taskSearchCustomer = customersArray.map(Number)
            console.log('Same Customer -> ', customersArrayStr)
          } else {
            customersArrayStr = iCustomer.toString()
          }
        }
        var resCount = await http.post('/tasks/getTasksListCountBySkill', {
          reqSkillsArray: skillsArray,
          reqTaskKeyword: iKeyword,
          reqTaskCustomer: customersArrayStr,
          reqShowDoneTask: iShowDoneTask
        })
        if (resCount != null && resCount.data.status == 0) {
          this.$data.taskPlanListTotal = resCount.data.data
        }
        var resData = await http.post('/tasks/getTasksListBySkill', {
          reqSkillsArray: skillsArray,
          reqTaskKeyword: iKeyword,
          reqTaskCustomer: customersArrayStr,
          reqShowDoneTask: iShowDoneTask,
          reqPage: this.$data.taskReqPage,
          reqSize: this.$data.taskPlanListSize
        })
        if (resData != null && resData.data.status == 0) {
          var taskList = resData.data.data.filter(item => {
            item.taskRequiredSkillsStrList = item.taskRequiredSkillsStr.split(',')
            for(let i = 0;i<item.taskRequiredSkillsStrList.length;i++){
              return this.sprint.sprintRequiredSkillsStr.indexOf(item.taskRequiredSkillsStrList[i]) != -1
            }
          });
          this.taskPlanList = taskList.filter((item)=>{
            return this.sprint.sprintCustomersStr.indexOf(item.taskCustomer) != -1
          })
        }
        this.$data.taskPlanListPage = this.$data.taskReqPage
      }
      this.$data.taskPlanListLoading = false
    },
    handlePageChange(val) {
      console.log('Page change -> ', val)
      this.$data.taskReqPage = val
      this.getTaskPlanListBySkills(this.$data.taskSprintObj, this.$data.taskSearchKeyword, this.$data.taskSearchCustomer, this.$data.taskCheckboxShowDoneTask)
    },
    searchTask () {
      this.$data.taskReqPage = 1
      this.getTaskPlanListBySkills(this.$data.taskSprintObj, this.$data.taskSearchKeyword, this.$data.taskSearchCustomer, this.$data.taskCheckboxShowDoneTask)
    },
    createTask () {
      this.$emit('createTask')
    },
    createRefTask (iTaskObj) {
      this.$emit('createRefTask', iTaskObj)
    },
    editTask (iTaskId, iTaskCategory) {
      this.$emit('editTask', iTaskId, iTaskCategory)
    },
    async getCustomerList () {
      this.$data.customerData = []
      var customersArrayStr = this.$data.taskSprintObj.sprintCustomers != null? this.$data.taskSprintObj.sprintCustomers.toString(): null
      const res = await http.get('/sprints/getAllCustomersList')
      if (res.data.status === 0) {
        var allCustomerList = res.data.data
        var result = []
        if (allCustomerList != null && allCustomerList.length > 0) {
          if (customersArrayStr != null && customersArrayStr.length > 0) {
            var customersArray = customersArrayStr.split(',').map(Number)
            for (var i=0; i<allCustomerList.length; i++) {
              var customer = allCustomerList[i]
              console.log('Customer Id -> ', customer)
              console.log(customersArray)
              if (customersArray.indexOf(customer.customerId) != -1) {
                result.push(customer)
              }
            }
          } else {
            result = allCustomerList
          }
        }
        this.$data.customerData = result
      }
    },
    // Common Method
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
    getSame(arr1, arr2) {
      let newArr = [];
      for (let i=0; i<arr2.length; i++) {
        for (let j=0; j<arr1.length; j++) {
          if (arr1[j] === arr2[i]) {
            newArr.push(arr1[j])
          }
        }
      }
      return newArr
    }
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
.task-plan-list-table>>>.el-tag {
  font-size: 10px;
  padding: 0 3px;
}
.task-plan-list-table>>>.el-button {
  font-size: 12px;
}
</style>