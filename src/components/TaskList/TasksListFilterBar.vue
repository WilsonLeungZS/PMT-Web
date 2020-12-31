<!-- 
Module: TasksListFilterBar
Description: Provide filter criteria for task list(search key word/switch task level/detail filter criteria/...)
Remark:
1. Change el-col-lg min width from 1200px to 1540px in "..\node_modules\_element-ui@2.13.2@element-ui\lib\theme-chalk\index.css"
-->
<template>
  <el-row class="tl-filter-bar">
    <el-col :span="20" :lg="4" class="tl-filter-bar-item justify-content-center">
      <el-input v-show="showState.showSearch" :disabled="disabledState.disabledSearch" v-model="taskFilter.taskSearchValue" @keyup.enter.native="returnTaskFilter('SearchKeyword')" placeholder="Search..." size="small" clearable>
        <el-button :disabled="disabledState.disabledSearch" @click="returnTaskFilter('SearchKeyword')" icon="el-icon-search" size="small" slot="append"></el-button>
      </el-input>
    </el-col>
    <el-col  :span="4" :lg="1" class="tl-filter-bar-item justify-content-center">
      <el-tooltip class="item" effect="light" placement="top">
        <div slot="content">Create New Level {{taskFilter.taskLevel}} Task</div>
        <el-button v-show="taskFilter.taskLevel != 'EX'? true: false" @click="clickCreateNewTask()" type="primary" icon="el-icon-plus" size="small" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white', 'font-size': '17px', 'padding': '5px 10px', 'width': '80%'}"></el-button>
      </el-tooltip>
    </el-col>
    <el-col :span="24" :lg="6" class="tl-filter-bar-item justify-content-center">
      <span v-show="showState.showLevel">Full Task Level</span>
      <el-radio-group v-show="showState.showLevel" :disabled="disabledState.disabledLevel" v-model="taskFilter.taskLevel" @change="returnTaskFilter('ChangeLevel')" size="small" >
        <el-radio-button label="1"></el-radio-button>
        <el-radio-button label="2"></el-radio-button>
        <el-radio-button label="3"></el-radio-button>
        <el-radio-button label="EX"></el-radio-button>
      </el-radio-group>
    </el-col>
    <el-col :span="24" :lg="13" class="tl-filter-bar-item justify-content-center">
      <el-form :inline="true" size="small" label-width="100px" label-position="right" class="tl-filter-bar-item-form">
        <el-form-item v-show="showState.showAssignTo" label="Assign To">
          <el-select v-show="showState.showAssignTo" :disabled="disabledState.disabledAssignTo" v-model="taskFilter.taskAssignTo" filterable>
            <el-option label="" value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="showState.showSkillGroup" label="Skill Group">
          <el-select v-show="showState.showSkillGroup" :disabled="disabledState.disabledSkillGroup" v-model="taskFilter.taskSkillGroup" filterable>
            <el-option label="" value=""></el-option>
          </el-select>
        </el-form-item>
        <!-- More Filter -->
        <el-form-item>
          <el-popover placement="bottom" title="More Filter" width="300" trigger="click">
            <el-form size="small" label-width="100px" label-position="left" class="tl-filter-bar-item-form">
              <el-form-item v-show="showState.showStatus" label="Status" style="margin-bottom: 5px">
                <el-select v-show="showState.showStatus" :disabled="disabledState.disabledStatus" v-model="taskFilter.taskStatus">
                  <el-option label="" value=""></el-option>
                  <el-option label="Drafting" value="Drafting"></el-option>
                  <el-option label="Planning" value="Planning"></el-option>
                  <el-option label="Running" value="Running"></el-option>
                  <el-option label="Done" value="Done"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-show="showState.showLeadingBy" label="Leading By">
                <el-select v-show="showState.showLeadingBy" :disabled="disabledState.disabledLeadingBy" v-model="taskFilter.taskLeadingBy">
                  <el-option label="" value=""></el-option>
                </el-select>
              </el-form-item>
              <el-divider style="margin: 15px"></el-divider>
              <el-form-item v-show="showState.showOpportunity" label="Opportunity" style="margin-bottom: 5px">
                <el-select v-show="showState.showOpportunity" :disabled="disabledState.disabledOpportunity" v-model="taskFilter.taskOpportunity">
                  <el-option label="" value=""></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-show="showState.showTimeGroup" label="Time Group">
                <el-select v-show="showState.showTimeGroup" :disabled="disabledState.disabledTimeGroup" v-model="taskFilter.taskTimeGroup">
                  <el-option label="" value=""></el-option>
                </el-select>
              </el-form-item>
            </el-form>     
            <el-button v-show="showState.showBtn" icon="el-icon-more-outline" slot="reference"></el-button>
          </el-popover>
        </el-form-item>
        <!-- End More Filter -->
        <el-form-item>
          <el-button v-show="showState.showBtn" :disabled="disabledState.disabledBtn" @click="returnTaskFilter('ExecuteFilter')" type="primary" icon="el-icon-circle-check"></el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-show="showState.showBtn" :disabled="disabledState.disabledBtn" @click="returnTaskFilter('ClearFilter')" type="info" icon="el-icon-circle-close"></el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script type="text/ecmascript-6">
  import http from '../../utils/http'
  import utils from '../../utils/utils'
  export default {
    name: 'TasksListFilterBar',
    data() {
      return {
        btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
        taskFilter: {
          taskSearchValue: '',
          taskLevel: '1',
          taskAssignTo: '',
          taskSkillGroup: '',
          taskStatus: '',
          taskLeadingBy: '',
          taskOpportunity: '',
          taskTimeGroup: null,
          isClear: false
        },
        disabledState: {
          disabledSearch: false,
          disabledLevel: false,
          disabledAssignTo: false,
          disabledSkillGroup: false,
          disabledStatus: false,
          disabledLeadingBy: false,
          disabledOpportunity: false,
          disabledTimeGroup: false,
          disabledBtn: false
        },
        showState: {
          showSearch: true,
          showLevel: true,
          showAssignTo: true,
          showSkillGroup: true,
          showStatus: true,
          showLeadingBy: true,
          showOpportunity: true,
          showTimeGroup: true,
          showBtn: true
        }
      }
    },
    props: {
    },
    mounted() {
    },
    created () {
      var taskFilter = this.$data.taskFilter
      this.$emit('getTaskFilter', taskFilter)
    },
    methods: {
      clickCreateNewTask() {
        var newTaskLevel = this.$data.taskFilter.taskLevel
        this.$emit('createTask', newTaskLevel)
      },
      returnTaskFilter (iAction) {
        console.log('Method returnTaskFilter start - ' + iAction)
        var taskFilter = this.$data.taskFilter
        if (iAction == 'ClearFilter') {
          taskFilter = {
            taskSearchValue: '',
            taskLevel: '1',
            taskAssignTo: '',
            taskSkillGroup: '',
            taskStatus: '',
            taskLeadingBy: '',
            taskOpportunity: '',
            taskTimeGroup: null,
            isClear: true
          }
          this.$data.taskFilter = taskFilter
        } else {
          taskFilter.isClear = false
        }
        console.log('Method returnTaskFilter end ', taskFilter)
        this.$emit('getTaskFilter', taskFilter)
      },
      returnDisabledState () {
        var disabledState = this.$data.disabledState
        this.$emit('getDisabledState', disabledState)
      },
      returnShowState () {
        var showState = this.$data.showState
        this.$emit('getShowState', showState)
      }
    },
    components: {
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
/* -- End Common Style -- */

.tl-filter-bar {
  height: 40px;
}
.tl-filter-bar-item {
  height: 100%;
  display: flex;
  align-items: center;
}
.tl-filter-bar-item span {
  margin-right: 10px; 
  font-size: 18px;
}
.tl-filter-bar-item-form .el-form-item {
  margin-bottom: 0;  
}
.tl-filter-bar-item-form .el-form-item .el-button{
  font-size: 16px; 
  padding: 5px 11px;
}
</style>
<style>
.tl-filter-bar-item-form .el-form-item__label{
  font-size: 16px;
}
</style>