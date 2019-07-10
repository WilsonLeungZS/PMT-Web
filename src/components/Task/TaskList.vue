<template>
  <div class="tl-body">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-tickets content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="tl-bar">
          <el-col :span="14">
            <div class="tl-bar-item">
              <el-input placeholder="Search task..." v-model="inputTaskVal" class="tl-bar-item-input" clearable>
                <el-select v-model="selectTaskType" slot="prepend" placeholder="Select" class="tl-bar-item-input-select">
                  <el-option label="All" value="0"></el-option>
                  <el-option label="Change" value="1"></el-option>
                  <el-option label="Incident" value="2"></el-option>
                  <el-option label="ITSR" value="3"></el-option>
                  <el-option label="Service Request" value="4"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="5"><div class="tl-bar-item"></div></el-col>
          <el-col :span="1"><div class="tl-bar-item"></div></el-col>
        </el-row>
        <el-row class="tl-main">
          <el-col :span="24">
            <el-table :data="tasklistData" class="tl-main-table" fit="true">
              <el-table-column prop="task_number" label="Number" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="task_type" label="Type"></el-table-column>
              <el-table-column prop="task_desc" label="Description" width="350px" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="task_status" label="Status"></el-table-column>
              <el-table-column prop="task_effort" label="Effort" width="80px"></el-table-column>
              <el-table-column prop="task_estimation" label="Estimation" width="100px"></el-table-column>
              <el-table-column prop="task_assign_team" label="Assign team"></el-table-column>
              <el-table-column
                fixed="right"
                label="Edit"
                width="100">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">Edit</el-button>
                  <el-button type="text" size="small">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row class="tl-Pagination">
          <el-col :span="24"></el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'TaskList',
  data () {
    return {
      header1: 'Task List',
      isActive: true,
      inputTaskVal: '',
      selectTaskType: '',
      tasklistData: [
        {task_number: 'CGM190001', task_type: 'Change', task_desc: 'eRO urgent change to add flex field to CNE', task_status: 'Prod Released', task_effort: 4, task_estimation: 10, task_assign_team: 'TOS'},
        {task_number: 'INC19050632', task_type: 'Incident', task_desc: 'Missing Equipment Movement - MTL (HSU)', task_status: 'Open', task_effort: 4, task_estimation: 4, task_assign_team: 'Billing'},
        {task_number: 'INCTASK15486235', task_type: 'Change', task_desc: 'eRO urgent change to add flex field to CNE', task_status: 'Prod Released', task_effort: 4, task_estimation: 10, task_assign_team: 'ACN-APP-TOS'},
        {task_number: 'INC19050632', task_type: 'Service Request', task_desc: 'eRO urgent change to add flex field to CNE', task_status: 'Prod Released', task_effort: 4, task_estimation: 10, task_assign_team: 'ACN-APP-TOS'},
        {task_number: 'CGM190001', task_type: 'Change', task_desc: 'TESTETSTTTTTTTTT eRO urgent change to add flex field to CNE', task_status: 'Prod Released', task_effort: 4, task_estimation: 10, task_assign_team: 'ACN-APP-TOS'},
        {task_number: 'CGM190001', task_type: 'Change', task_desc: 'eRO urgent change to add flex field to CNE', task_status: 'Prod Released', task_effort: 4, task_estimation: 10, task_assign_team: 'ACN-APP-TOS'},
        {task_number: 'CGM190001', task_type: 'Change', task_desc: 'eRO urgent change to add flex field to CNE', task_status: 'Prod Released', task_effort: 4, task_estimation: 10, task_assign_team: 'ACN-APP-TOS'}
      ]
    }
  }
}
</script>

<style scoped>
.tl-body {
  width: 100%;
  height: auto;
}
.el-main {
  color: #333;
  text-align: center;
  height:auto;
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
/* Task list bar style */
.tl-bar {
  height: 50px;
  margin-top: 10px;
}
.tl-bar-item {
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tl-bar-item-input {
  width: 98%;
  background-color: #fff;
  border-radius: 30px;
  color: black;
}
.tl-bar-item-input-select {
  width: 150px;
}
/* Task list main style */
.tl-main {
  height: auto;
  width: 100%;
  margin-top: 10px;
}
.tl-main-table {
  width:100%;
  height: auto;
}
.tl-Pagination {
  height: 30px;
  width: 100%;
  margin-top: 10px;
  border: 1px solid red;
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
.single-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
