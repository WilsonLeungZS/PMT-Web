<template>
  <div class="charts-body">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div class="content-title-item" @click="switchToPM">
              <i class="el-icon-user content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
            <el-divider direction="vertical"></el-divider>
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-monitor content-title-item-icon"></i>
              <span class="content-title-item-header">{{header2}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="content-main-col">
            <el-card class="box-card pt-title" shadow="never">
              <el-row :gutter="20">
                <el-col :span="3">
                  <el-date-picker v-model="monthSelect" type="month" placeholder="Select"
                    @change="changePtMonth"></el-date-picker>
                </el-col>
                <el-col :span="9">
                  <el-autocomplete style="width:100%" :trigger-on-focus="false" popper-class="task-autocomplete" :clearable="true"
                    v-model="taskSelect" :fetch-suggestions="queryTaskWorklogAsync" @select="handleTaskSelect" @clear="clearTask">
                    <template slot-scope="{ item }">
                      <div class="list_task_name">{{ item.value }}</div>
                      <span class="list_task_desc">{{ item.description }}</span>
                    </template>
                  </el-autocomplete>
                </el-col>
                <el-col :span="2">
                  <el-button type="success" icon="el-icon-edit-outline" style="font-size: 14px">Show Worklog</el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import http from '../../utils/http'
export default {
  name: 'Charts',
  data () {
    return {
      header1: 'Project Management',
      header2: 'Timesheet Management',
      isActive: true,
      monthSelect: '',
      taskIdSelect: 0,
      taskSelect: ''
    }
  },
  methods: {
    switchToPM () {
      this.$data.isActive = false
      this.$router.push({path: 'PrjManagement'})
    },
    changePtMonth (iDate) {
      this.$data.monthSelect = iDate
    },
    async queryTaskWorklogAsync (queryString, cb) {
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
      this.$data.taskIdSelect = item.id
      this.$data.taskSelect = item.value
    },
    clearTask () {
      this.$data.taskIdSelect = 0
      this.$data.taskSelect = ''
    }
  },
  created () {
    console.log('Start')
  }
}
</script>

<style scoped>
.charts-body {
  width: 100%;
  height: auto;
}
.el-main {
  color: #333;
  text-align: center;
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
  padding: 5px;
}
.pt-title {
  width: 100%;
  height: auto;
}
.pt-title-item {
  width: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 18px;
}
.list_task_name {
  font-size: 16px;
  color: #57606f;
  text-overflow: ellipsis;
  overflow: hidden;
}
.list_task_desc {
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
</style>
<style>
.el-card__body {
  padding: 20px;
}
</style>
