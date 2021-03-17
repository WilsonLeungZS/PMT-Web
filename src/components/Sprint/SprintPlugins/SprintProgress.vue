<!-- 
Module: SprintProgress
Description: display sprint progress
Remark:
-->
<template>
  <el-card class="box-card sprint-progress-card" shadow="never">
    <el-row class="sprint-progress-card-row">
      <el-col :span="8" class="sprint-progress-card-col">
        <el-progress :text-inside="true" :stroke-width="30" :percentage="datePercentage" :format="getDateProgress" class="sprint-progress-card-col-progress"></el-progress>
        <el-divider direction="vertical"></el-divider>
      </el-col>
      <el-col :span="8" class="sprint-progress-card-col">
        <el-progress :text-inside="true" :stroke-width="30" :percentage="capacityPercentage" :format="getCapacityProgress" :status="capacityProgressStatus" class="sprint-progress-card-col-progress"></el-progress>
        <el-divider direction="vertical"></el-divider>
      </el-col>
      <el-col :span="8" class="sprint-progress-card-col">
        <el-progress :text-inside="true" :stroke-width="30" :percentage="taskPercentage" :format="getTaskProgress" :status="taskProgressStatus" class="sprint-progress-card-col-progress"></el-progress>
      </el-col>
    </el-row>
  </el-card>
</template>

<script type="text/ecmascript-6">
  import http from '../../../utils/http'
  import utils from '../../../utils/utils'
  export default {
    name: 'ExternalTaskDialog',
    data() {
      return {
        sprint: null,
        // Date Progress Value
        datePercentage: 0,
        datePass: 0,
        dateTotal: 0,
        // Capacity Progress Value
        capacityProgressStatus: 'success',
        capacityPercentage: 0,
        capacityUsed: 0,
        capacityPlanned: 0,
        // Task Progress Value
        taskProgressStatus: 'exception',
        taskPercentage: 0,
        taskDone: 0,
        taskTotal: 0
      }
    },
    props: {
      'sprintObj': Object
    },
    watch: {
      sprintObj: {
         handler (val, oldVal) {
          console.log('Sprint progress obj: ', val)
          if(val == '' || val == null || val == undefined) {
            return
          } 
          this.$data.sprint = val
          this.getProgress(val)
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
      async getProgress (sprint) {
        // 1. Get date progress
        var res = await http.get('https://ipo.gzatcc.com/api/others/workdays', {
          start_date: sprint.sprintStartTime,
          end_date: sprint.sprintEndTime,
        })
        if (res != null && res.data != null) {
          // Total sprint workdays
          var totalWorkdayCount = res.data.workday_count
          // Pass workdays
          var workdayList = res.data.workday_list
          var currentDay = this.formatDate(new Date(), 'yyyy-MM-dd')
          var passWorkdayCount = 0
          if (workdayList != null) {
            for (var i=0; i<workdayList.length; i++) {
              if (currentDay < workdayList[i]) {
                break
              } else {
                passWorkdayCount++
              }
            }
          }
          // Set up date progress
          this.$data.datePercentage = this.getPercentage(passWorkdayCount, totalWorkdayCount)
          this.$data.datePass = passWorkdayCount
          this.$data.dateTotal = totalWorkdayCount
        }
        // 2. Get capacity progress and task progress
        var res = await http.get('/sprints/getSprintProgressById', {
          reqSprintId: sprint.sprintId,
        })
        if (res != null && res.data != null) {
          var result = res.data.data
          var capacityResult = null
          var taskResult = null
          if (result != null && result.length > 0) {
            capacityResult = result[0]
            taskResult = result[1]
          }
          if (capacityResult != null) {
            this.$data.capacityPercentage = this.getPercentage(capacityResult.usedCapacity, capacityResult.plannedCapacity) > 100? 100: this.getPercentage(capacityResult.usedCapacity, capacityResult.plannedCapacity)
            this.$data.capacityUsed = capacityResult.usedCapacity
            this.$data.capacityPlanned = capacityResult.plannedCapacity
            if (this.$data.capacityPercentage < this.$data.datePercentage) {
              this.$data.capacityProgressStatus = 'exception'
            } else {
              this.$data.capacityProgressStatus = 'success'
            }
          }
          if (taskResult != null) {
            this.$data.taskPercentage = this.getPercentage(taskResult.doneTaskCount, taskResult.totalTaskCount) > 100? 100: this.getPercentage(taskResult.doneTaskCount, taskResult.totalTaskCount)
            this.$data.taskDone = taskResult.doneTaskCount
            this.$data.taskTotal = taskResult.totalTaskCount
            if (this.$data.taskPercentage < this.$data.datePercentage) {
              this.$data.taskProgressStatus = 'exception'
            } else {
              this.$data.taskProgressStatus = 'success'
            }
          }
        }
      },
      getDateProgress (percentage) {
        return 'Pass Date: ' + this.$data.datePass + ' / ' + this.$data.dateTotal + ' (' + this.$data.datePercentage + '%)'
      },
      getCapacityProgress (percentage) {
        return 'Used Capacity: ' + this.$data.capacityUsed + ' / ' + this.$data.capacityPlanned + ' (' + this.getPercentage(this.$data.capacityUsed, this.$data.capacityPlanned) + '%)'
      },
      getTaskProgress (percentage) {
        return 'Done Task: ' + this.$data.taskDone + ' / ' + this.$data.taskTotal + ' (' + this.getPercentage(this.$data.taskDone, this.$data.taskTotal) + '%)'
      },
      //Common Method
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
      getPercentage (numerator, denominator) {
        if (numerator == 0 || denominator == 0) {
          return 0
        }
        return Math.round(numerator / denominator * 10000) / 100.00
      }    
    }
  }
</script>

<style scoped>
.sprint-progress-card {
  border-color: #bdbdbd;
  height: 38px;
}
.sprint-progress-card>>>.el-card__body {
  padding: 0;
  width: 100%;
  height: 100%;
}
.sprint-progress-card-row {
  width: 100%;
  height: 100%;
}
.sprint-progress-card-col {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sprint-progress-card-col>>>.el-divider--vertical {
  margin: 0;
}
.sprint-progress-card-col-progress {
  width: 100%;
  margin: 0 8px;
}
.sprint-progress-card-col-progress>>>.el-progress-bar__outer {
  border-radius: 4px;
}
.sprint-progress-card-col-progress>>>.el-progress-bar__inner {
  border-radius: 4px;
}
.sprint-progress-card-col-progress>>>.el-progress-bar__innerText {
  font-size: 20px;
  color: black;
}
</style>

<style>
</style>