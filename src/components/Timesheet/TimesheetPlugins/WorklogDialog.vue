<!-- 
Module: WorklogDialog
Description: for user to input worklog
Remark:
-->
<template>
  <el-dialog :before-close="closeWorklog" title="Add Worklog" :visible.sync="worklogDialogVisible" width="500px" class="worklog-dialog" :close-on-click-modal="false">
    <el-form :model="worklog" label-width="65px" label-position="left">
      <el-form-item label="Task">
        <el-autocomplete v-model="worklog.worklogTaskName" 
          :fetch-suggestions="queryWorklogTask" @select="handleWorklogSelectedTask" @clear="clearWorklogSelectedTask" 
          :trigger-on-focus="false" popper-class="task-autocomplete" clearable style="width:100%">
          <template slot-scope="{ item }">
            <div class="form-list-task-name">{{item.value}} - <span>{{item.sprint}}</span></div>
            <span class="form-list-task-desc">{{item.title}}</span>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="Title" >
        <span style="justify-content: center">{{worklog.worklogTaskTitle}}</span>
      </el-form-item>
      <el-form-item label="Date">
        <el-date-picker :picker-options="pickerOptions" v-model="worklog.worklogDate" type="date" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
      </el-form-item>
      <el-form-item label="Effort" >
        <el-input v-model="worklog.worklogEffort" type="number">
          <template slot="append" style="font-size:16px; width:100%">hrs</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Remark" >
        <el-input type="textarea" :rows="6" v-model="worklog.worklogRemark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeWorklog">Close</el-button>
      <el-button v-if="showDeleteWorklogBtn" @click="deleteWorklog" type="danger">Delete</el-button>
      <el-button @click="submitWorklog" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}">Submit</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import http from '../../../utils/http'
  import utils from '../../../utils/utils'
  export default {
    name: 'WorklogDialog',
    data() {
      return {
        btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
        btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
        headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
        worklogDialogVisible: false,
        worklogAction: '',
        reqWorklogId: 0,
        reqTaskId: 0,
        userId: this.$store.getters.getUserId,
        worklog: {
          worklogId: 0,
          worklogTaskId: null,
          worklogTaskName: null,
          worklogTaskTitle: null,
          worklogUserId: null,
          worklogEffort: 0,
          worklogDate: null,
          worklogRemark: null,
        },
        disabledState: {
          disabledName: false
        },
        showDeleteWorklogBtn: true,
        worklogTaskStartTime: null,
        worklogTaskEndTime: null,
        pickerOptions: {
          disabledDate: (date) => {
            return this.dealDisabledDate(date);
          }
        }
      }
    },
    props: {
      'action': Object
    },
    watch: {
      action: {
         handler (val, oldVal) {
          console.log('Worklog dialog action: ', val)
          if(val == '' || val == null || val == undefined) {
            return
          }
          var actionObj = val
          this.editWorklog(actionObj)
        },
        immediate: true,
        deep: true
      }
    },
    created () {
    },
    mounted () {
    },
    updated () {
    },
    methods: {
      initWorklog () {
        this.$data.worklogAction = ''
        this.$data.showDeleteWorklogBtn = true
        var worklog = {
          worklogId: 0,
          worklogTaskId: null,
          worklogTaskName: null,
          worklogTaskTitle: null,
          worklogUserId: null,
          worklogEffort: 0,
          worklogDate: null,
          worklogRemark: null
        }
        this.$data.worklog = worklog
        var disabledState = {
          disabledName: false
        }
        this.$data.disabledState = disabledState
        this.$data.worklogTaskStartTime = null
        this.$data.worklogTaskEndTime = null
      },
      async editWorklog (actionObj) {
        this.initWorklog()
        console.log('Start to edit worklog -> ', actionObj.action)
        if (actionObj.action == 'EDIT-WORKLOG-BY-TASK') {
          this.$data.worklogAction = 'EDIT-WORKLOG-BY-TASK'
          this.$data.showDeleteWorklogBtn = false
          this.$data.worklog = {
            worklogTaskId : actionObj.taskId,
            worklogTaskName : actionObj.taskName,
            worklogTaskTitle : actionObj.taskTitle,
            worklogDate: actionObj.worklogDate != null? actionObj.worklogDate: null,
            worklogUserId: actionObj.userId
          }
          var result = await this.getWorklogTaskTimeRange(actionObj.taskId)
          // Validate if worklog date is between sprint start time and end time
          if (result) {
            var worklogTaskStartTime = this.$data.worklogTaskStartTime
            var worklogTaskEndTime = this.$data.worklogTaskEndTime
            if (actionObj.worklogDate != null && (actionObj.worklogDate < worklogTaskStartTime || actionObj.worklogDate > worklogTaskEndTime)) {
              this.$message.error('Could not record worklog out of task sprint start time[' + worklogTaskStartTime + '] and end time[' + worklogTaskEndTime + ']!')
              return
            }
          }
        }
        if (actionObj.action == 'EDIT-WORKLOG-BY-DATE') {
          this.$data.worklogAction = 'EDIT-WORKLOG-BY-DATE'
          this.$data.showDeleteWorklogBtn = false
          this.$data.worklog = {
            worklogDate: actionObj.worklogDate,
            worklogUserId: actionObj.userId
          }
        }
        if (actionObj.action == 'EDIT-WORKLOG') {
          this.$data.worklogAction = 'EDIT-WORKLOG'
          var worklogDate = actionObj.worklogDate.split('-')
          var reqWorklogMonth = worklogDate[0] + '-' + worklogDate[1]
          var reqWorklogDay = worklogDate[2]
          const res = await http.get('/worklogs/getWorklog', {
            reqTaskId: actionObj.taskId,
            reqUserId: actionObj.userId,
            reqWorklogMonth: reqWorklogMonth,
            reqWorklogDay: reqWorklogDay
          })
          if (res.data != null && res.data.status == 0) {
            var worklog = res.data.data
            this.$data.showDeleteWorklogBtn = true
            this.$data.worklog = {
              worklogTaskId: worklog.worklogTaskId,
              worklogTaskName: worklog.worklogTaskName,
              worklogTaskTitle: worklog.worklogTaskTitle,
              worklogEffort: worklog.worklogEffort,
              worklogDate: worklog.worklogDate,
              worklogRemark: worklog.worklogRemark,
              worklogUserId: worklog.worklogUserId
            }
            var result = await this.getWorklogTaskTimeRange(worklog.worklogTaskId)
            // Validate if worklog date is between sprint start time and end time
            if (result) {
              var worklogTaskStartTime = this.$data.worklogTaskStartTime
              var worklogTaskEndTime = this.$data.worklogTaskEndTime
              if (actionObj.worklogDate != null && (actionObj.worklogDate < worklogTaskStartTime || actionObj.worklogDate > worklogTaskEndTime)) {
                this.$message.error('Could not record worklog out of task sprint start time[' + worklogTaskStartTime + '] and end time[' + worklogTaskEndTime + ']!')
                return
              }
            }
          }
        }
        this.$data.worklogDialogVisible = true
      },
      async submitWorklog () {
        var reqWorklog = this.$data.worklog
        // Get worklog task
        var reqWorklogTaskId = reqWorklog.worklogTaskId
        console.log(reqWorklogTaskId)
        if (reqWorklogTaskId == 0 || reqWorklogTaskId == null || reqWorklogTaskId == '') {
          this.$message.error('Invalid Task!')
          return
        }
        // Get worklog Month and Day
        var reqWorklogDate = reqWorklog.worklogDate
        if (reqWorklogDate == null || reqWorklogDate == '') {
          this.$message.error('Invalid Date!')
          return
        }
        var dateArray = reqWorklogDate.split('-')
        var reqWorklogMonth = dateArray[0] + '-' + dateArray[1]
        var reqWorklogDay = dateArray[2]
        // Get worklog Effort
        var reqWorklogEffort = reqWorklog.worklogEffort
        if (reqWorklogEffort <= 0 || reqWorklogEffort > 25 || (reqWorklogEffort%0.5) != 0) {
          this.$message.error('Invalid Effort!')
          return
        }
        // Get User Id
        var reqWorklogUserId = reqWorklog.worklogUserId
        if (reqWorklogUserId == null || reqWorklogUserId == '') {
          reqWorklogUserId = this.$data.userId
        }
        var reqWorklogRemark = reqWorklog.worklogRemark
        var res = await http.post('/worklogs/updateWorklog', {
          reqWorklogUserId: reqWorklogUserId,
          reqWorklogTaskId: reqWorklogTaskId,
          reqWorklogMonth: reqWorklogMonth,
          reqWorklogDay: reqWorklogDay,
          reqWorklogEffort: reqWorklogEffort,
          reqWorklogRemark: reqWorklogRemark
        })
        if (res != null && res.data.status == 0) {
          this.$message({
            message: 'Worklog add or update successfully!',
            type: 'success'
          });
        } else {
          this.$message.error('Worklog add or update failed!')
          return
        }
        if (this.$data.worklogAction == 'EDIT-WORKLOG-BY-TASK') {
          this.$emit('refreshTask', reqWorklogTaskId)
        }
        this.$emit('refreshTimesheet')
        this.$data.worklogDialogVisible = false
      },
      async deleteWorklog () {
        var reqWorklog = this.$data.worklog
        // Get worklog task
        var reqWorklogTaskId = reqWorklog.worklogTaskId
        if (reqWorklogTaskId == 0 || reqWorklogTaskId == null || reqWorklogTaskId == '') {
          this.$message.error('Invalid Task!')
          return
        }
        // Get worklog Month and Day
        var reqWorklogDate = reqWorklog.worklogDate
        if (reqWorklogDate == null || reqWorklogDate == '') {
          this.$message.error('Invalid Date!')
          return
        }
        var dateArray = reqWorklogDate.split('-')
        var reqWorklogMonth = dateArray[0] + '-' + dateArray[1]
        var reqWorklogDay = dateArray[2]
        // Get User Id
        var reqWorklogUserId = reqWorklog.worklogUserId
        if (reqWorklogUserId == null || reqWorklogUserId == '') {
          reqWorklogUserId = this.$data.userId
        }
        var reqWorklogRemark = reqWorklog.worklogRemark
        var res = await http.post('/worklogs/updateWorklog', {
          reqWorklogUserId: reqWorklogUserId,
          reqWorklogTaskId: reqWorklogTaskId,
          reqWorklogMonth: reqWorklogMonth,
          reqWorklogDay: reqWorklogDay,
          reqWorklogEffort: 0,
          reqWorklogRemark: reqWorklogRemark
        })
        if (res != null && res.data.status == 0) {
          this.$message({
            message: 'Worklog delete successfully!',
            type: 'success'
          });
        } else {
          this.$message.error('Worklog delete failed!')
          return
        }
        if (this.$data.worklogAction == 'EDIT-WORKLOG-BY-TASK') {
          this.$emit('refreshTask', reqWorklogTaskId)
        }
        this.$emit('refreshTimesheet')
        this.$data.worklogDialogVisible = false
      },
      closeWorklog() {
        this.initWorklog()
        this.$data.worklogDialogVisible = false
      },
      // Worklog Task Method
      async queryWorklogTask (queryString, cb) {
        console.log('Query String: ' + queryString)
        var returnArr = []
        var reqTaskAssigneeId = this.$data.userId
        var reqDate = this.$data.worklog.worklogDate
        const res = await http.post('/tasks/getTasksByWorklogKeyword', {
          reqKeyword: queryString,
          reqTaskAssigneeId: reqTaskAssigneeId,
          reqDate: reqDate
        })
        if (res.data.status === 0) {
          var queryResult = res.data.data
          for (var i = 0; i < queryResult.length; i++) {
            var returnJson = {}
            returnJson.id = queryResult[i].taskId
            returnJson.value = queryResult[i].taskName
            returnJson.title = queryResult[i].taskTitle
            returnJson.sprint = queryResult[i].taskSprintName
            returnArr.push(returnJson)
          }
        }
        cb(returnArr)
      },
      handleWorklogSelectedTask (item) {
        this.$data.worklog.worklogTaskId = item.id
        this.$data.worklog.worklogTaskName = item.value
        this.$data.worklog.worklogTaskTitle = item.title
        this.$data.worklog.worklogUserId = this.$data.userId
        this.getWorklogTaskTimeRange(item.id)
      },
      clearWorklogSelectedTask () {
        this.initWorklog()
      },
      // Get worklog task allow time range by task sprint
      getWorklogTaskTimeRange (iTaskId) {
        return new Promise(async (resolve, reject) =>{
          console.log('getWorklogTaskTimeRange: ', iTaskId)
          const res = await http.get('/tasks/getTaskById', {
            reqTaskId: iTaskId
          })
          if (res.data != null && res.data.status == 0) {
            this.$data.worklogTaskStartTime = res.data.data.taskSprintStartTime
            this.$data.worklogTaskEndTime = res.data.data.taskSprintEndTime
            resolve(true)
          }
          resolve(false)
        })
      },
      dealDisabledDate (date) {
        var worklogTaskStartTime = this.$data.worklogTaskStartTime
        var worklogTaskEndTime = this.$data.worklogTaskEndTime
        if (worklogTaskStartTime != null && worklogTaskEndTime != null) {
          return !(date.getTime() >= (new Date(worklogTaskStartTime).getTime() - 24*60*60*1000) && date.getTime() <= new Date(worklogTaskEndTime).getTime())
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
      } 
    }
  }
</script>

<style scoped>
/* Common Style */
.justify-content-center {
  justify-content: center;
}
.justify-content-flex-start {
  justify-content: flex-start;
}
.justify-content-flex-end {
  justify-content: flex-end;
}
.pointer-style {
  cursor: pointer;
}

/* Worklog Dialog Style */
.worklog-dialog>>>.el-dialog__header {
  text-align: center;
}
.worklog-dialog>>>.el-dialog__body {
  padding: 10px 10px 10px 20px;
}
.worklog-dialog>>>.el-dialog__footer {
  padding: 10px;
}
.worklog-dialog>>>.el-form-item {
  margin-bottom: 10px;
}
.worklog-dialog>>>input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
.worklog-dialog>>>input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.form-list-task-name {
  font-size: 16px;
  line-height: 20px;
  color: #57606f;
  text-overflow: ellipsis;
  overflow: hidden;
}
.form-list-task-name span {
  color: #C0C4CC;
}
.form-list-task-desc {
  font-size: 12px;
  line-height: 14px;
  color: #bdc3c7;
}
</style>

<style>

</style>