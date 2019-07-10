<template>
  <div class="mt-body">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-date content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
            <el-divider direction="vertical"></el-divider>
            <div class="content-title-item " @click="switchToPT">
              <i class="el-icon-data-analysis content-title-item-icon"></i>
              <span class="content-title-item-header">{{header2}}</span>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'MyTimesheet',
  data () {
    return {
      header1: 'My Timesheet',
      header2: 'Project Timesheet',
      isActive: true
    }
  },
  methods: {
    switchToPT () {
      this.$data.isActive = false
      this.$router.push({path: 'ProjectTimesheet'})
    }
  },
  created () {
    console.log('Created My Timesheet')
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
  height: 160px;
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
