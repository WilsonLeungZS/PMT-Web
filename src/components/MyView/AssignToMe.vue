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
            <div class="content-title-item" @click="switchToPT" >
              <i class="el-icon-data-analysis content-title-item-icon"></i>
              <span class="content-title-item-header">{{header2}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="tl-bar">
          <el-col :span="24">
            <div class="tl-bar-item">
              <el-badge :value="statusCount.draftingcount" class="item">
                <el-button >Drafting</el-button>
              </el-badge>
              <el-badge :value="statusCount.planningcount" class="item">
                <el-button >Planning</el-button>
              </el-badge>
              <el-badge :value="statusCount.runningcount" class="item" type="primary">
                <el-button>Running</el-button>
              </el-badge>
              <el-badge :value="statusCount.donecount" class="item" type="warning">
                <el-button>Done</el-button>
              </el-badge>
              <el-select
                v-model="taskGroupsVal"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="Task groups">
                <el-option
                  v-for="item in taskGroups"
                  :key="item.Id"
                  :label="item.Name"
                  :value="item.Name">
                </el-option>
              </el-select>
              <el-input placeholder="Search task..." v-model="searchVal" class="tl-bar-item-input" clearable @keyup.enter.native="searchTask">
                <el-button slot="append" icon="el-icon-search" @click="searchTask"></el-button>
              </el-input>
              <el-button class="tl-bar-item-btn" type="primary"  @click="filterTask">Filter</el-button>            
            </div>
          </el-col>
        </el-row>
        <el-row class="tl-main">
          <el-col :span="8" style="margin-top:1px; padding: 0 5px 0 5px;">
            <el-card class="box-card" shadow="hover" >
              <div slot="header" class="clearfix">
                <span>Task Warning</span>
                <el-button style="float: right; padding: 3px 0" v-if="false" type="text">操作按钮</el-button>
              </div>
              <div>
              <span>You've got {{taskWarning.length}} tasks not complete in this sprint!</span>
              <div v-for="(task,index) in taskWarning" :key="index" class="text item">
                <span>{{ task.task_name}}</span>
              </div>                
              </div>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-table :data="taskslistData" class="tl-main-table"  fit empty-text="No Data"
              row-key="task_name" lazy 
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
              <el-table-column prop="task_name" label="Number" width="180px" key="1"></el-table-column>
              <el-table-column prop="task_desc" label="Title" show-overflow-tooltip align="left" min-width="230px" key="2"></el-table-column>
              <el-table-column prop="task_status" label="Status" align="center" width="130px" key="3"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
export default {
  name: 'AssignToMe',
  data () {
    return {
      header1: 'Assign To Me',
      header2: 'Pie Charts',
      isActive: true,
      headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      activeNames: [],
      assignToMeList: [],
      taskslistData: [],
      taskslistLoading:false,
      statusCount:{
        planningcount: 0,
        draftingcount: 0,
        runningcount: 0,
        donecount: 0        
      },
      searchVal: '',
      taskWarning: [],
      taskGroups: [],
      taskGroupsVal: ''
    }
  },
  methods: {
    switchToPT () {
      this.$data.isActive = false
      console.log("PieCharts")
      this.$router.push({path: 'PieCharts'})
    },
    filterTask () {

    },
    getCurrentMonthFirst () {
      var date = new Date()
      date.setDate(1)
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      var firstDate = new Date(date.getFullYear(), month - 1, day)
      return firstDate
    },
    async getTaskList () {
      console.log('Start to get task list')
      var today = new Date()
      this.$data.activeNames = []
      const res = await http.post('/tasks/getAssignToTaskLevel3',{
        AssignId: 1,
      })
      var Parenttaskname = []
      for(var i = 0 ; i < res.data.data.length ; i++){
        Parenttaskname.push(res.data.data[i].task_name)
        this.countStatus(res.data.data[i].task_status)
        if(res.data.data[i].task_taskGroup!=null){
          this.gettaskWarning(res.data.data[i],today)
        }
      }
      const res2 = await http.get('/tasks/getAssignToTaskLevel4NotLevel3',{
          ParentTaskName: Parenttaskname,
          AssignId: 1
        })
      for(var i = 0 ; i < res.data.data.length ; i++){
        const res1 = await http.post('/tasks/getAssignToTaskLevel4ForLevl3',{
          AssignId: 1,
          ParentTaskName: res.data.data[i].task_name
        })
        if(res1.data.status!=1||res1.data.data!=null){
           res.data.data[i].children = res1.data.data
           for(var j = 0 ;j < res1.data.data.length ; j++){
             this.countStatus(res1.data.data[j].task_status)
             this.gettaskWarning(res1.data.data[j],today)
           }
        }
      }
      this.$data.taskslistData = res.data.data
      for(var i = 0 ; i < res2.data.data.length;i++){
        this.$data.taskslistData.push(res2.data.data[i])
        this.countStatus(res2.data.data[i].task_status)
        this.gettaskWarning(res2.data.data[i],today)
      }
      const res3 = await http.post('/tasks/getTaskGroup')      
      console.log(res3)
      this.$data.taskGroups =  res3.data.data
    },
    gettaskWarning (iTask,today) {
      iTask.task_taskGroup.EndTime.replace(/-/g,"/")
      var endDate = new Date(iTask.task_taskGroup.EndTime)
      var days = parseInt(Math.ceil((endDate-today)/(1000*3600*24)))
      if(days<5){
          this.$data.taskWarning.push(iTask)
      }
    },
    searchTask () {

    },
    countStatus (taskstatus) {
      if(taskstatus=='Planning'){
        this.$data.statusCount.planningcount++;
      }else if(taskstatus=='Drafting'){
        this.$data.statusCount.draftingcount++;
      }else if(taskstatus=='Running'){
        this.$data.statusCount.runningcount++;
      }else if(taskstatus=='Done'){
        this.$data.statusCount.donecount++;
      }
    },
  },
  created () {
    var firstDate = this.getCurrentMonthFirst()
    //this.resetTimesheet(firstDate)
    this.getTaskList()
    this.$data.taskGroups = []
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
  margin-left:5px;
  height:20px;
  width: auto;
  font-size: 20px;
}
/*Common Style*/
.active {
  color: #ff6348;
  border-bottom: 1px solid #ff6348;
  cursor: default;
}
</style>
<style>

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]{
  -moz-appearance: textfield;
}
.item {
  margin-top: 10px;
  margin-right: 40px;

}
.tl-bar{
  height: 50px;
  margin-top: 20px;
  margin-left: 10px;
}
.tl-bar-item {
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.tl-bar-item-btn{
  margin-left: 20px;
}
.text {
  font-size: 14px;
  text-align: left;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.tl-bar-item-input {
  width: 30%;
  background-color: #fff;
  margin-left: 20px;
  border-radius: 30px;
  color: black;
}

</style>
