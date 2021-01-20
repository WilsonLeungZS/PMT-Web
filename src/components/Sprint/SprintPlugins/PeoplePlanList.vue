<template>
  <div class="sv-content-people-plan-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>People Resource</span>
      </div>
      <div class="people-plan-list-table">
        <el-table :data="peopleList" width="100%" size="small">
          <el-table-column prop="userName" label="Name" align="left" width="150"></el-table-column>
          <el-table-column prop="userSkills" label="Skills" align="left" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userLevel" label="Level" align="center" width="60"></el-table-column>
          <el-table-column prop="userWorkingHrs" label="WHrs" align="center" width="60"></el-table-column>
          <el-table-column prop="userCapacity" label="Capacity" align="center" width="100">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.userCapacity" :step="scope.row.userWorkingHrs" step-strictly :min="0" :max="scope.row.userMaxCapacity" controls-position="right" size="mini"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="right" fixed="right" width="50">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="Assigen to Sprint" placement="top">
                <el-button type="primary" icon="el-icon-d-arrow-right"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import http from '../../../utils/http'
import utils from '../../../utils/utils'
export default {
  name: 'PeoplePlanList',
  components: {
  },
  data () {
    return {
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2,
      peopleList: [
        {userName: 'zhongshu.liang(Wilson)', userLevel: '10', userWorkingHrs: 9, userSkills: 'PMO,Custom-Build,PMO,Custom-Build,PMO,Custom-Build', userCapacity: 90, userMaxCapacity: 90},
        {userName: 'zhongshu.liang', userLevel: '10', userWorkingHrs: 9, userSkills: 'PMO,Custom-Build', userCapacity: 90, userMaxCapacity: 90},
        {userName: 'zhongshu.liang', userLevel: '10', userWorkingHrs: 8, userSkills: 'PMO,Custom-Build', userCapacity: 80, userMaxCapacity: 80},
        {userName: 'zhongshu.liang', userLevel: '10', userWorkingHrs: 8, userSkills: 'PMO,Custom-Build', userCapacity: 80, userMaxCapacity: 80}
      ]
    }
  },
  methods: {
  },
  created () {
  }
}
</script>

<style scoped>
.sv-content-people-plan-list {
  width: 100%;
  height: auto;
}
.sv-content-people-plan-list>>>.el-card__body {
  padding: 5px;
}
.people-plan-list-table {
  width: 100%;
}
.people-plan-list-table>>>.el-table td {
  padding: 5px 0;
}
.people-plan-list-table>>>.el-table th {
  padding: 5px 0;
}
.people-plan-list-table>>>.el-button {
  padding: 6px 7px;
}
.people-plan-list-table>>>.el-input-number--mini {
  width: 90px;
}
</style>