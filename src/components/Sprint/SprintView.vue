<template>
  <div class="sv-body">
    <el-container>
      <el-main>
        <!-- Header -->
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-data-line content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
          </el-col>
        </el-row>
        <!-- Content -->
        <el-row class="sv-content">
          <el-col :span="planListLength" :lg="planListLengthLg">
            <el-tabs @tab-click="changeTab" v-model="tabActive" :tab-position="tabPosition" class="sv-content-plan-list">
              <el-tab-pane name="tab_people_resource">
                <span slot="label"><i class="el-icon-s-custom"></i> People Res</span>
                People Resource
              </el-tab-pane>
              <el-tab-pane name="tab_task_backlog">
                <span slot="label"><i class="el-icon-s-order"></i> Task List</span>
                Task Backlog
              </el-tab-pane>
              <el-tab-pane name="tab_hide">
                <span slot="label" style="color: #bdbdbd"><i class="el-icon-arrow-left"></i> Hide</span>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="sprintLength" :lg="sprintLengthLg">
            <div style="width: 100%; height: 100px; border: 1px solid red"></div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import http from '../../utils/http'
import utils from '../../utils/utils'
export default {
  name: 'SprintView',
  components: {
  },
  data () {
    return {
      header1: 'Sprint View',
      isActive: true,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
      tabPosition: 'left',
      tabActive: 'tab_people_resource',
      planListLength: 12,
      planListLengthLg: 12
    }
  },
  computed: {
    sprintLength: function () {
      return 24 - this.planListLength
    },
    sprintLengthLg: function () {
      return 24 - this.planListLengthLg
    }
  },
  methods: {
    changeTab (tab, event) {
      if (tab.name == 'tab_hide') {
        this.$data.planListLengthLg = 2
        this.$data.planListLength = 3
      } else {
        this.$data.planListLengthLg = 12
        this.$data.planListLength = 12
      }
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
.sv-body {
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

/* Content Style */
.sv-content {
  border: 1px solid #DCDFE6;
  padding: 10px 10px 10px 10px;
  margin-top: 10px;
}
.sv-content-plan-list {
  width: 100%; 
  height: 100%; 
}
</style>
<style>
.sv-body .el-tabs--border-card>.el-tabs__content {
  padding: 0;
}
</style>
