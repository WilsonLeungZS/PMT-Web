<template>
  <div class="header-content">
    <div v-for="(headerItem, index) in headerArray" :key="index" :class="{'header-content-item':true, 'active':headerItem.isActive}">
      <i :class="headerItem.icon"></i>
      <span @click="switchToPath(headerItem.path)">{{headerItem.header}}</span>
      <el-divider direction="vertical" v-if="headerItem.showDivider"></el-divider>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'TasksListHeader',
    data() {
      return {
        headerArray: [],
      }
    },
    props: {
      'header': Array
    },
    mounted() {
      this.headerArray = this.header
    },
    methods: {
      switchToPath(iPath) {
        if (iPath != this.$route.path) {
          this.$router.push({path: iPath})
        }
      }
    },
    components: {
    }
  }
</script>

<style scoped>
.header-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.header-content-item {
  margin-left: 10px;
  font-size: 20px;
  cursor: pointer;
}
.active {
  color: #ff6348;
  cursor: default;
}
</style>