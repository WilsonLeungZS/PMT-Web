<template>
<div class="tm-content">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="tm-content-header">
        <span>Timelines List</span>
        <el-button @click="createTimeline" class="tm-content-header-btn" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" icon="el-icon-plus" size="mini">Create New Timeline</el-button>
      </span>
    </div>
    <el-table v-loading="timelineLoading" :data="timelineData" fit>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row :gutter="15">
            <el-col :span="4" :lg="1" class="tm-table-expand-label">
              <span>Name</span>
            </el-col>
            <el-col :span="20" :lg="3" class="tm-table-expand-item">
              <el-input v-model="props.row.timelineName" size="small" style="width: 100%"></el-input>
            </el-col>
            <el-col :span="4" :lg="2" class="tm-table-expand-label">
              <span>Start Time</span>
            </el-col>
            <el-col :span="8" :lg="3" class="tm-table-expand-item">
              <el-date-picker @change="changeTimelineTime(props.row)" v-model="props.row.timelineStartTime" size="small" type="date" value-format="yyyy-MM-dd" placeholder="Select Date..." style="width: 100%" clearable></el-date-picker>
            </el-col>
            <el-col :span="4" :lg="2" class="tm-table-expand-label">
              <span>End Time</span>
            </el-col>
            <el-col :span="8" :lg="3" class="tm-table-expand-item">
              <el-date-picker @change="changeTimelineTime(props.row)" v-model="props.row.timelineEndTime" size="small" type="date" value-format="yyyy-MM-dd" placeholder="Select Date..." style="width: 100%" clearable></el-date-picker>
            </el-col>
            <el-col :span="4" :lg="2" class="tm-table-expand-label">
              <span>Working Days</span>
            </el-col>
            <el-col :span="8" :lg="4" class="tm-table-expand-item">
              <span>Total <b style="text-decoration:underline; margin: 0 5px; font-size: 16px">{{props.row.timelineWorkingDays}}</b> days</span> 
            </el-col> 
            <el-col :span="6" :lg="2" class="tm-table-expand-item">
              <el-button @click="cancelTimeline(props)" type="info" size="small" style="width:100%">Cancel</el-button>
            </el-col>
            <el-col :span="6" :lg="2" class="tm-table-expand-item">
              <el-button @click="saveTimeline(props)" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="small" style="width:100%">Save</el-button>
            </el-col>                    
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="Id" prop="timelineId" v-if="false"></el-table-column>
      <el-table-column label="Name" prop="timelineName" align="left"></el-table-column>
      <el-table-column label="Start Time" prop="timelineStartTime" align="center"></el-table-column>
      <el-table-column label="End Time" prop="timelineEndTime" align="center"></el-table-column>
      <el-table-column label="Working Days" prop="timelineWorkingDays" align="center"></el-table-column>
      <el-table-column label="Status" prop="timelineStatus" align="center">
        <template slot-scope="scope">
          <el-tag size="small" type="primary" effect="dark">{{scope.row.timelineStatus}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
import http from '../../../utils/http'
import utils from '../../../utils/utils'
export default {
  name: 'TimelinesList',
  data () {
    return {
      timelineData: [],
      timelineResetData: [],
      timelineLoading: false,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2
    }
  },
  methods: {
    // Functional Method
    async getTimelineList () {
      this.$data.timelineLoading = true
      this.$data.timelineData = []
      const res = await http.get('/sprints/getAllTimelinesList')
      if (res.data.status === 0) {
        this.$data.timelineData = res.data.data
        var jsonString1 = JSON.stringify(this.$data.timelineData)
        this.$data.timelineResetData = JSON.parse(jsonString1)
      } else {
        this.$data.timelineResetData = []
      }
      this.$data.timelineLoading = false
    },
    createTimeline () {
      var timeline = {
        timelineId: 0,
        timelineName: '',
        timelineStartTime : null,
        timelineEndTime: null,
        timelineWorkingDays: 0,
        timelineStatus: 'Active'
      }
      this.$data.timelineData.unshift(timeline)
    },
    cancelTimeline (props) {
      var index = props.$index
      if (props.row.timelineId > 0) {
        props.row.timelineName = this.$data.timelineResetData[index].timelineName
        props.row.timelineStartTime = this.$data.timelineResetData[index].timelineStartTime
        props.row.timelineEndTime = this.$data.timelineResetData[index].timelineEndTime
        props.row.timelineWorkingDays = this.$data.timelineResetData[index].timelineWorkingDays
      } else {
        this.$data.timelineData.splice(index, 1)
      }
    },
    async saveTimeline (props) {
      var timeline = props.row
      if(this.isEmptyField(timeline.timelineName, 'Name')) return
      const res = await http.post('/sprints/updateTimeline', {
        reqTimelineId: timeline.timelineId,
        reqTimelineName: timeline.timelineName,
        reqTimelineStartTime: timeline.timelineStartTime,
        reqTimelineEndTime: timeline.timelineEndTime,
        reqTimelineWorkingDays: timeline.timelineWorkingDays,
        reqTimelineStatus: timeline.timelineStatus,
      })
      if (res.data.status === 0) {
        this.getTimelineList()
        this.showMessage('Add/Update timeline successfully!', 'success')
      } else {
        this.$message.error('Add/Update timeline Failed!')
      }
    },
    async changeTimelineTime (timeline) {
      // Validate timeline start time should bigger than end time
      if (timeline.timelineStartTime != null && timeline.timelineEndTime != null) {
        if (timeline.timelineStartTime > timeline.timelineEndTime) {
          timeline.timelineStartTime = timeline.timelineEndTime
          timeline.timelineEndTime = null
          this.showMessage('Timeline start time could not later than end time!', 'error')
          return
        }
      }
      // Get Working Days
      if (timeline.timelineStartTime != null && timeline.timelineEndTime != null) {
        var res = await http.get('https://ipo.gzatcc.com/api/others/workdays', {
          start_date: timeline.timelineStartTime,
          end_date: timeline.timelineEndTime,
        })
        var workingDays = 0
        if (res != null && res.data != null) {
          workingDays = Number(res.data.workday_count)
        }
        timeline.timelineWorkingDays = workingDays
      } 
      if (timeline.timelineStartTime == null && timeline.timelineEndTime == null) {
        timeline.timelineWorkingDays = 0
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
    }
  },
  created () {
    this.getTimelineList()
  }
}
</script>

<style scoped>
/* Content Style */
.tm-content {
  width: auto;
  height: auto;
  padding: 20px 5px 0px 5px;
  text-align: left;
}
.tm-content-header {
  font-size: 24px;
  margin-left: 10px;
  color: #747d8c;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}
.tm-content-header-btn {
  font-size: 14px;
  margin-left: 30px;
}
.tm-table-expand-label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 32px;
  line-height: 32px;
  font-size: 15px;
  color: #99a9bf;
  margin-bottom: 10px;
}
.tm-table-expand-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 32px;
  line-height: 32px;
  margin-bottom: 10px;
}
.tm-content>>>.el-divider {
  background-color: #e0e0e0;
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
.tm-content .el-card__body {
  padding: 5px 10px;
}
.tm-content .el-table td, .el-table th {
  padding: 8px 0;
}
.tm-content .el-divider--horizontal {
  margin: 2px 0 10px 0;
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
