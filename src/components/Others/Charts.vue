<template>
  <div class="charts-body">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24" class="content-title-col">
            <div :class="{'content-title-item':true, 'active':isActive}">
              <i class="el-icon-pie-chart content-title-item-icon"></i>
              <span class="content-title-item-header">{{header1}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="content-main-col">
            <input type="file" @change="loadTextFromFile">
          </el-col>
        </el-row>
        <el-row>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="request_time" label="Time" width="170px" align="center"></el-table-column>
            <el-table-column prop="ip_address" label="IP Address" width="160px" align="center"></el-table-column>
            <el-table-column prop="request_method" label="HTTP Method" width="120px" align="center"></el-table-column>
            <el-table-column prop="http_status" label="HTTP Status" width="120px" align="center"></el-table-column>
            <el-table-column prop="response_time" label="Response Time" width="150px" align="center"></el-table-column>
            <el-table-column prop="request_url" label="URL"></el-table-column>
          </el-table>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Charts',
  data () {
    return {
      header1: 'Charts',
      isActive: true,
      tableData: []
    }
  },
  methods: {
    loadTextFromFile (e) {
      const file = e.target.files[0]
      console.log(file)
      const reader = new FileReader()
      reader.onload = e => this.$emit('load', this.handleLocalhostAccess(e.target.result))
      reader.readAsText(file)
    },
    handleLocalhostAccess (item) {
      // %h %l %u %t &quot;%r&quot; %s %b %T
      // 172.25.35.200 - - [24/Aug/2019:19:41:41 +0800] "GET /apex/n4mobile.faces HTTP/1.1" 200 2490 0.042
      // 远程主机 - - 日期时间 查询字符串 HTTP状态码 发送字节数 处理请求时间
      var keyWord = '.faces'
      var logDataArray = []
      var result = []
      logDataArray = item.split('\r\n')
      console.log('Length: ' + logDataArray.length)
      for (var i = 0; i < logDataArray.length; i++) {
        var resJson = {}
        var logDataLine = logDataArray[i]
        if (logDataLine === '') {
          continue
        }
        // Spile IP
        var logDataLineArray1 = logDataLine.split('-')
        resJson.ip_address = logDataLineArray1[0]
        // Spile Time
        var logDataLineArray2 = logDataLineArray1[2].split(']')
        resJson.request_time = logDataLineArray2[0].replace('[', '').replace(' +0800', '')
        // Spile Method/Url/Status Code/response time
        logDataLineArray2[1] = logDataLineArray2[1].replace('"', '').replace('"', '').trim()
        var logDataLineArray3 = logDataLineArray2[1].split(/\s+/)
        resJson.request_method = logDataLineArray3[0]
        resJson.request_url = logDataLineArray3[1]
        resJson.http_status = logDataLineArray3[3]
        resJson.response_time = Number(logDataLineArray3[5])
        if (resJson.request_url.indexOf(keyWord) > 0) {
          console.log('Keyword[' + keyWord + '] found')
          result.push(resJson)
        } else {
          continue
        }
      }
      console.log(result)
      this.$data.tableData = result
    }
  },
  created () {
    console.log('Start')
  }
}
</script>

<style scoped>
.charts-body {
  width: 100%;
  height: auto;
}
.el-main {
  color: #333;
  text-align: center;
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
/* Main Style */
.content-main-col {
  margin-top: 20px;
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
</style>
