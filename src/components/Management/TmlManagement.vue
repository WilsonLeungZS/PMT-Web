<template>
  <div class="tm-body">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div v-for="(header, index) in headersArray" :key="index" class="content-title-item" @click="switchTo(header.headerPath)">
              <span :class="{'active': header.headerName == 'Timeline'? true: false}">
                <i class="content-title-item-icon" :class="header.headerIcon"></i>
                <span class="content-title-item-header">{{header.headerName}}</span>
              </span>
              <el-divider v-if="header.headerDivider" direction="vertical"></el-divider>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <timelines-list></timelines-list>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import utils from '../../utils/utils'
import TimelinesList from './ManagementPlugins/TimelinesList'
export default {
  name: 'TimelineManagement',
  components: {
    TimelinesList
  },
  data () {
    return {
      headersArray: utils.headersArray,
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2
    }
  },
  methods: {
    switchTo (iPath) {
      this.$router.push({path: iPath})
    }
  },
  created () {
  }
}
</script>

<style scoped>
.active {
  color: #ff6348;
  border-bottom: 1px solid #ff6348;
  cursor: default;
  padding-bottom: 5px;
}
.tm-body {
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
  margin-right: 10px;
  cursor: pointer;
}
.content-title-item-icon {
  height:20px;
  width: 20px;
  font-size: 20px;
}
.content-title-item-header {
  margin-left: 5px;
  margin-right: 10px;
  height:20px;
  width: auto;
  font-size: 20px;
}
</style>
