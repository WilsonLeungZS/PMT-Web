<!-- 
Module: externalTaskDialog
Description: display task details for external task (base information/status tracing)
Remark:
-->
<template>
  <el-dialog :before-close="closeTask" :visible.sync="externalTaskDialogVisible" :title="externalTaskDialogTitle" :width="dialogWidth" top="5%" :close-on-click-modal="false" class="external-task-dialog">
    <el-form :model="externalTask" ref="form" label-width="140px" label-position="left" class="external-task-dialog-form">
      <el-tabs v-model="activeTab" ref="externalTaskDialogTabs" type="card">
        <!-- Basic Information Tab -->
        <el-tab-pane label="Basic Information" name="tab_basic_info">
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item label="Name">
                <span style="width: 100%; color: black; font-weight: bold; font-size: 17px" >{{externalTask.taskName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item label="Status">
                <el-select disabled v-model="externalTask.taskStatus" style="width: 100%">
                  <el-option label="Drafting" value="Drafting"></el-option>
                  <el-option label="Planning" value="Planning"></el-option>
                  <el-option label="Running" value="Running"></el-option>
                  <el-option label="Done" value="Done"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item label="Issue Date">
                <el-date-picker disabled v-model="externalTask.taskIssueDate" type="datetime" placeholder="Select Date..." value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item label="Effort">
                <el-input v-model="externalTask.taskEffort" disabled>
                  <template slot="append" style="font-size:16px; width:100%">hrs</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :lg="{span: 12, offset: 1}">
              <el-form-item  label="Estimation">
                <el-input disabled v-model="externalTask.taskEstimation">
                  <template slot="append" style="font-size:16px; width:100%">hrs</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Description">
            <el-input disabled v-model="externalTask.taskDescription" class="highlight-text-format" type="textarea" :rows="6" style="width: 100%" ></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="24" :lg="11">
              <el-form-item label="Created By">
                <span>{{externalTask.taskCreator}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="saveTask" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="medium">OK</el-button>
    </span>
  </el-dialog> 
</template>

<script type="text/ecmascript-6">
  import http from '../../utils/http'
  import utils from '../../utils/utils'
  export default {
    name: 'ExternalTaskDialog',
    data() {
      return {
        btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
        btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
        headerColor: utils.themeStyle[this.$store.getters.getThemeStyle].headerColor,
        dialogWidth: '70%',
        activeTab: 'tab_basic_info',
        externalTaskDialogTitle: 'External Task Details',
        externalTaskDialogVisible: false,
        disabledSaveBtn: false,
        externalTask: {
          taskId: 0,
          taskName: '',
          taskDescription: '',
          taskCreator: '',
          taskStatus: 'Drafting',
          taskIssueDate: '',
          taskEffort: 0,
          taskEstimation: 0,
        }
      }
    },
    props: {
      'action': Object
    },
    watch: {
      action: {
         handler (val, oldVal) {
          console.log('PMT task dialog action: ', val)
          if(val == '' || val == null || val == undefined) {
            return
          }
          var actionObj = val
          if (actionObj.action == 'EDIT') {
            this.editTask(actionObj.taskId)
          }
        },
        immediate: true,
        deep: true
      }
    },
    created () {
      this.initTaskForm('External Task Details', 'tab_basic_info')
    },
    mounted () {
      console.log('Mounted')
    },
    updated () {
      console.log('Updated')
    },
    methods: {
      // Style method
      showPointer ({row, rowIndex}) {
        let pointerObj = {
          cursor: 'pointer'
        }
        return pointerObj
      },
      // Functional Methods
      initTaskForm(iTitle, iActiveTab) {
        this.$data.externalTaskDialogTitle = iTitle
        this.$data.activeTab = iActiveTab
        this.$data.externalTask = {
          taskId: 0,
          taskName: '',
          taskDescription: '',
          taskCreator: '',
          taskStatus: 'Drafting',
          taskIssueDate: '',
          taskEffort: 0,
          taskEstimation: 0,
        }
        this.$data.disabledSaveBtn = false
      },
      editTask (iTaskId) {
        this.initTaskForm('External Task Details', 'tab_basic_info')
        // Get task information by id
        this.$data.externalTaskDialogVisible = true
      },
      closeTask (done) {
        this.initTaskForm('External Task Details', 'tab_basic_info')
        this.$data.externalTaskDialogVisible = false
        this.$emit('closeTask', '2')
        done()
      },
      saveTask () {
        this.$data.externalTaskDialogVisible = false
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

.external-task-dialog {
  min-width: 600px;
}
.external-task-dialog .el-dialog__body {
  padding: 10px 20px;
}
.external-task-dialog>>>.el-dialog__header {
  text-align: center;
}
.external-task-dialog-form {
  text-align: left;
}
.external-task-dialog-form .el-form-item {
  margin-bottom: 10px;
}
.task-form-tab-subtasks-content {
  margin-top: 10px;
}
.task-form-tab-regulartasks-content {
  margin-top: 10px;
}
.external-task-dialog-form-list-name {
  font-size: 16px;
  color: #57606f;
  text-overflow: ellipsis;
  overflow: hidden;
}
.external-task-dialog-form-list-desc {
  font-size: 14px;
  color: #bdc3c7;
}
.external-task-dialog-form-desc {
  font-size: 17px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.external-task-dialog-history-tab {
  height: 200px;
  overflow: auto;
}
</style>

<style>
.highlight-text-format .el-input__inner{
  font-family: "Microsoft" !important;
  font-size: 20px !important;
  font-weight: bold !important;
}
.highlight-text-format .el-textarea__inner{
 font-family: "Microsoft" !important;
 font-size: 20px !important;
 font-weight: bold !important;
}
.external-task-dialog .el-dialog__body {
  padding: 10px 20px;
}
.external-task-dialog-form .el-table th {
  padding: 3px 0;
  color: #616161;
}
.external-task-dialog-form .el-form-item__error {
  top: 28%;
  left: 10px;
}
.el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
  content: '';
  margin-right: 0;
}
.el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:after, .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:after {
  content: '*';
  color: #F56C6C;
  margin-left: 4px;
}
</style>