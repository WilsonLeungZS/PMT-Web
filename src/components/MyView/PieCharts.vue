<template>
  <div class="mt-body">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div class="content-title-item" @click="switchToPT">
              <i class="el-icon-date content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
            <el-divider direction="vertical"></el-divider>
            <div  :class="{'content-title-item':true, 'active':isActive}" >
              <i class="el-icon-data-analysis content-title-item-icon"></i>
              <span class="content-title-item-header">{{header2}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7" style="margin-top:1px; padding: 0 5px 0 5px;">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <!-- <span>{{taskForm.taskName}}</span> -->
                
              </div>
              <!-- <div class="pt-task-box">
                <el-form :label-position="labelPosition" label-width="100px" :model="taskForm" size="mini">
                  <el-form-item label="Status">
                    <el-col :span="24" class="pt-task-box-content-item">
                      <span>{{taskForm.taskStatus}}</span>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="Type">
                     <el-col :span="24" class="pt-task-box-content-item">
                      <span>{{taskForm.taskType}}</span>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="Effort">
                     <el-col :span="24" class="pt-task-box-content-item">
                      <span>{{taskForm.taskEffort}} / {{taskForm.taskEstimation}} hrs</span>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="Month Effort">
                     <el-col :span="24" class="pt-task-box-content-item">
                      <span style="color:#57606f; font-size: 20px; font-weight:bold;margin-right:10px">{{taskForm.taskMonthEffort}}</span> hrs
                    </el-col>
                  </el-form-item>
                  <el-form-item label="Description">
                    <el-col :span="24" class="pt-task-box-content-item">
                      <span>{{taskForm.taskDescription}}</span>
                    </el-col>
                  </el-form-item>
                </el-form>
              </div> -->
            </el-card>
          </el-col><!-- Task Box -->
          <!-- <el-col :span="17" style="margin-top:1px; padding: 0 5px 0 5px;">
            <el-card class="box-card" shadow="never">
              <el-table :data="taskWorklogList" style="width: 100%">
                <el-table-column prop="worklog_id" label="Id" v-if="false"></el-table-column>
                <el-table-column prop="worklog_user" sortable label="User" align="center"></el-table-column>
                <el-table-column prop="worklog_date" sortable label="Date" align="center" ></el-table-column>
                <el-table-column prop="worklog_effort" sortable label="Effort" align="center"></el-table-column>
                <el-table-column label="Worklog Management" align="center" width="400">
                  <template slot-scope="scope">
                    <el-input type="number" size="small" v-model="scope.row.worklog_change_effort" class="pt-worklog">
                      <template slot="append">Hours</template>
                    </el-input>
                    <el-button size="small" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" icon="el-icon-edit" style="margin-left:10px" @click="adjustEffort(scope)">Adjust Effort</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col> -->
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
export default {
  name: 'PieCharts',
  data () {
    return {
      header1: 'Assign To Me',
      header2: 'Pie Charts',
      isActive: true,
      headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      labelPosition: 'left',
    }
  },
  methods: {
    switchToPT () {
      this.$data.isActive = false
      this.$router.push({path: 'AssignToMe'})
    },
  },
  created () {
    console.log("!!!!!")
    //this.resetTimesheet(firstDate)
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
/* Main Style */
.content-main-col {
  margin-top: 20px;
}
.mt-table-month-picker {
  height:40px;
  padding-left: 5px;
  padding-right: 5px;
  line-height: 46px;
  font-size: 16px;
  margin: 0 5px;
  width: auto;
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
.content-task-col {
  margin-top:40px;
  height:400px;
  width: 100%;
  border: 1px solid black
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
</style>
<style>
.mt-table {
  width: 100%;
}
.mt-table-header-row {
  height: 40px;
}
.mt-table-header-cell-weekday {
  font-size: 13px;
  border-top: 1px solid #f1f2f6;
  padding: 0 !important;
  color: white;
}
.mt-table-header-cell {
  font-size: 13px;
  border-top: 1px solid #f1f2f6;
  padding: 0 !important;
  color: #2f3542;
}
.mt-table-row {
  height: 40px;
}
.mt-table-cell {
  font-size: 13px;
  padding: 0 !important;
  border: 1px solid #f1f2f6;
}
.mt-table-col-weekday {
  background-color: #ced6e0;
}
.mt-table-col-nonweekday {
  background-color: white;
}
.mt-worklog-form {
  text-align: left;
}
.el-textarea .el-textarea__inner {
  resize: none;
}
.el-form-item {
  margin-bottom: 12px;
}
.el-dialog__body {
  padding: 10px 20px;
}
.el-dialog__footer {
  padding: 10px;
}
.el-table__footer-wrapper tbody td {
  color: #747d8c;
  border: 1px solid #f1f2f6;
  padding: 10px 0;
  font-weight: bold;
}
.el-autocomplete-suggestion li {
  line-height: 28px;
}
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
</style>
