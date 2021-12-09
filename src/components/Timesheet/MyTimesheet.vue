<template>
  <div class="mt-body">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-date content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
            <el-divider direction="vertical"></el-divider>
            <div class="content-title-item " @click="switchToPT">
              <i class="el-icon-data-analysis content-title-item-icon"></i>
              <span class="content-title-item-header">{{header2}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="selectBox">
              <el-select v-model="customersActive" multiple collapse-tags placeholder="Customers..." size="small">
                <el-option v-for="(customer, index) in customersList" :key="index" :label="customer.customerName" :value="customer.customerId"></el-option>
              </el-select>
              <el-button icon="el-icon-close" circle size="small" @click="customerClear('clear')"></el-button>
            </div>
          </el-col>
          <el-col :span="24" class="content-main-col">
            <timesheet @refresh="refreshTaskTable" @getCurrentMonthTimesheet="getCurrentMonthTimesheet" :timesheetObj="timesheetObj" :customersActive="customersActive"></timesheet>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="content-main-col" style="padding: 0 5px;">
            <el-divider content-position="center"><b>Current Sprint Tasks (Assign To Me)</b></el-divider>
            <task-table @refresh="refreshTimesheet" :taskTableObj="taskTableObj" :customersActive="customersActive"></task-table>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
import Timesheet from './TimesheetPlugins/Timesheet'
import TaskTable from '../Task/TaskPlugins/TaskTable'
export default {
  name: 'MyTimesheet',
  components: {
    Timesheet,
    TaskTable
  },
  data () {
    return {
      header1: 'My Timesheet',
      header2: 'Project Timesheet',
      isActive: true,
      timesheetObj: {
        timesheetUserId: this.$store.getters.getUserId,
        timesheetStartDate: null,
        timesheetEndDate: null
      },
      taskTableObj: {
        taskTableUserId: this.$store.getters.getUserId,
        taskTableDate: null
      },
      customersList: [],
      customersActive: [],
    }
  },
  methods: {
    customerClear(val){
      if(val == 'clear'){
        this.customersActive = []
      }
    },
    async getCustomerList (groupCustomer) {
      const res = await http.get('/sprints/getAllCustomersList')
      this.customersActive= []
      this.customersList = res.data.data
    },
    switchToPT () {
      this.$data.isActive = false
      this.$router.push({path: 'ProjectTimesheet'})
    },
    getCurrentMonthTimesheet () {
      var now = new Date()
      var nowMonth = now.getMonth() 
      var nowYear = now.getFullYear()
      var monthStartDate = new Date(nowYear, nowMonth, 1)
      var monthEndDate = new Date(nowYear, nowMonth + 1, 0)
      var startDate = this.formatDate(monthStartDate, 'yyyy-MM-dd')
      var endDate = this.formatDate(monthEndDate, 'yyyy-MM-dd')
      this.$data.timesheetObj = {
        type: 'MyTimesheet',
        timesheetUserId: this.$store.getters.getUserId,
        timesheetStartDate: startDate,
        timesheetEndDate: endDate,
        date: new Date()
      }
    },
    getAssignToMeTasks () {
      this.$data.taskTableObj = {
        taskTableSource: 'MyTimesheet',
        taskTableUserId: this.$store.getters.getUserId,
        taskTableDate: this.formatDate(new Date(), 'yyyy-MM-dd'),
        date: new Date().getTime()
      }
    },
    refreshTimesheet () {
      this.getCurrentMonthTimesheet()
    },
    refreshTaskTable() {
      this.getAssignToMeTasks()
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
    }
  },
  created () {
    this.getCurrentMonthTimesheet()
    this.getAssignToMeTasks()
    this.getCustomerList()
  }
}
</script>

<style scoped>
.mt-body {
  width: 100%;
  height: auto;
}
.el-main {
  color: #333;
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
  margin-left:5px;
  height:20px;
  width: auto;
  font-size: 20px;
}
/* Main Style */
.content-main-col {
  margin-top: 20px;
}
/*Common Style*/
.bg-color {
  background-color: #eccc68;
}
.active {
  color: #ff6348;
  border-bottom: 1px solid #ff6348;
  cursor: default;
}
.selectBox{
  text-align: left;
  margin: 0px 10px;
}
</style>
