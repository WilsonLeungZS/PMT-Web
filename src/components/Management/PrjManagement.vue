<template>
  <div class="pm-body">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-user content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
            <el-divider direction="vertical"></el-divider>
            <div class="content-title-item " @click="switchToTM">
              <i class="el-icon-monitor content-title-item-icon"></i>
              <span class="content-title-item-header">{{header2}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <sprints-list></sprints-list>
          </el-col>
          <!-- End User list -->
        </el-row>
        <el-row>
          <el-col :span="24">
            <users-list></users-list>
          </el-col>
          <!-- End User list -->
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
import UsersList from './ManagementPlugins/UsersList'
import SprintsList from './ManagementPlugins/SprintsList'
export default {
  name: 'Projecpmanagement',
  components: {
    UsersList,
    SprintsList
  },
  data () {
    return {
      header1: 'Project Management',
      header2: 'Timesheet Management',
      isActive: true,
      userData: [],
      userResetData: [],
      activeFilter: [
        {text: 'Active', value: true},
        {text: 'Inactive', value: false}
      ],
      roleFilter: [
        {text: 'Admin', value: 'Admin'},
        {text: 'General', value: 'General'},
        {text: 'Special', value: 'Special'}
      ],
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2
    }
  },
  methods: {
    switchToTM () {
      this.$data.isActive = false
      this.$router.push({path: 'PmtManagement'})
    }
  },
  created () {
  }
}
</script>

<style scoped>
/* Header Style */
.active {
  color: #ff6348;
  border-bottom: 1px solid #ff6348;
  cursor: default;
}
.pm-body {
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
</style>
