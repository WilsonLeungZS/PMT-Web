<template>
  <el-container>
    <el-header height="40">
      <page-header :header="headers" ></page-header>
    </el-header>
    <el-main>
      <el-row class="el-main-filter-bar">
        <el-col :span="24" class="el-main-bar">
          <tasks-list-filter-bar @createTask="createTask" @getTaskFilter="getTaskFilter"></tasks-list-filter-bar>
        </el-col>
      </el-row>
      <el-row class="el-main-content">
        <el-col :span="24" class="el-main-bar">
          <tasks-list-content @editTask="editTask" :filter="taskListFilter"></tasks-list-content>
        </el-col>
      </el-row>
    </el-main>
    <level-one-task-dialog @editSubtask="editTask" @createSubtask="createTask" @closeTask="closeTask" :action="levelOneTaskDialogAction"></level-one-task-dialog>
    <level-two-task-dialog @closeTask="closeTask" :action="levelTwoTaskDialogAction"></level-two-task-dialog>
  </el-container>
</template>

<script type="text/ecmascript-6">
  import PageHeader from '../CommonPlugins/PageHeader.vue'
  import TasksListFilterBar from '../TaskList/TasksListFilterBar'
  import TasksListContent from '../TaskList/TasksListContent'
  import LevelOneTaskDialog from '../TaskDialog/LevelOneTaskDialog.vue'
  import LevelTwoTaskDialog from '../TaskDialog/LevelTwoTaskDialog.vue'
  export default {
    name: 'TasksList',
    data() {
      return {
        headers: [
          {header: 'Tasks List', path:'/TaskList/TasksList', icon: 'el-icon-tickets', isActive: true, showDivider: false}
        ],
        taskListFilter: '',
        levelOneTaskDialogAction: {},
        levelTwoTaskDialogAction: {}
      }
    },
    methods: {
      // Get data from child componets
      getTaskFilter (iTaskFilter) {
        this.$data.taskListFilter = '{"taskLevel": "0"}'
        console.log('getTaskFilter', iTaskFilter)
        this.$data.taskListFilter = JSON.stringify(iTaskFilter)
      },
      // ---> <-----
      createTask (iNewTaskLevel, iNewTaskParent = null) {
        var newTaskLevel = iNewTaskLevel
        var newTaskParent = iNewTaskParent
        console.log('New Task Level ' + newTaskLevel, ' New Task Parent ' + newTaskParent)
        if(newTaskLevel == '1') {
          // Create Level 1 task
          console.log('Start to create Level 1 Task')
          this.$data.levelOneTaskDialogAction = {
            action: 'Create',
            taskLevel: newTaskLevel
          }
        }
        if(newTaskLevel == '2') {
          // Create Level 2 task
          console.log('Start to create Level 2 Task')
          this.$data.levelTwoTaskDialogAction = {
            action: 'Create',
            taskLevel: newTaskLevel,
            taskParent: newTaskParent
          }
        }
      },
      editTask (iTaskId, iTaskName, iTaskLevel) {
        var taskId = iTaskId
        var taskName = iTaskName
        var taskLevel = iTaskLevel
        console.log('Task Id ' + taskId, 'Task Name ' + taskName, 'Task Level ' + taskLevel)
        if(taskLevel == '1') {
          // Edit Level 1 task
          console.log('Start to edit Level 1 Task')
          this.$data.levelOneTaskDialogAction = {
            action: 'Edit',
            taskLevel: taskLevel,
            taskId: taskId,
            taskName: taskName
          }
        }
        if(taskLevel == '2') {
          // Edit Level 2 task
          console.log('Start to edit Level 2 Task')
          this.$data.levelTwoTaskDialogAction = {
            action: 'Edit',
            taskLevel: taskLevel,
            taskId: taskId,
            taskName: taskName
          }
        }
      },
      closeTask (iTaskLevel) {
        var taskLevel = iTaskLevel
        if(taskLevel == '1') {
          this.$data.levelOneTaskDialogAction = {
            action: 'Close',
            taskLevel: taskLevel
          }
        }
        if(taskLevel == '2') {
          this.$data.levelTwoTaskDialogAction = {
            action: 'Close',
            taskLevel: taskLevel
          }
        }
      }
    }, 
    components: {
      PageHeader,
      TasksListFilterBar,
      TasksListContent,
      LevelOneTaskDialog,
      LevelTwoTaskDialog
    }
  }
</script>

<style scoped>
.el-header {
  text-align: center;
  line-height: 40px;
}
.el-main {
  color: #333;
  text-align: center;
  line-height: auto;
  padding: 5px 0;
}
.el-main-filter-bar {
  background-color: #E9EEF3; 
  padding: 5px;
}
.el-main-content {
  margin-top: 10px;
  padding: 0 5px;
}
.el-main-bar {
  height: auto;
}
</style>