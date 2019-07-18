<template>
  <div class="um-body">
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
          <el-col :span="15">
            <div class="pm-content">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span class="pm-content-header">
                    Users List
                    <el-tooltip class="item" effect="dark" content="Add New User" placement="top">
                      <el-button type="primary" icon="el-icon-plus" size="mini" circle
                        class="pm-content-header-btn" @click="addUser"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Expoet Users List" placement="top">
                      <el-button type="success" icon="el-icon-download" size="mini" circle class="pm-content-header-btn"></el-button>
                    </el-tooltip>
                  </span>
                </div>
                <el-table :data="userData" style="width:100%;height:auto" fit>
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-row :gutter="15">
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Name</span>
                        </el-col>
                        <el-col :span="10" class="pm-table-expand-item">
                          <el-input v-model="props.row.user_name" size="small" style="width: 100%"></el-input>
                        </el-col>
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Email</span>
                        </el-col>
                        <el-col :span="10" class="pm-table-expand-item">
                          <el-input v-model="props.row.user_email" size="small" style="width: 100%"></el-input>
                        </el-col>
                      </el-row>
                      <el-row :gutter="15" style="margin-top: 10px">
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Team</span>
                        </el-col>
                        <el-col :span="10" class="pm-table-expand-item">
                          <el-select v-model="props.row.user_team" size="small" style="width: 100%">
                            <el-option label="TOS" value="TOS"></el-option>
                            <el-option label="Billing" value="Billing"></el-option>
                            <el-option label="BSS" value="BSS"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Role</span>
                        </el-col>
                        <el-col :span="10" class="pm-table-expand-item">
                          <el-select v-model="props.row.user_role" size="small" style="width: 100%">
                            <el-option label="Admin" value="Admin"></el-option>
                            <el-option label="General" value="General"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                      <el-row :gutter="15" style="margin-top: 10px">
                        <el-col :span="2" class="pm-table-expand-label">
                          <span>Active</span>
                        </el-col>
                        <el-col :span="12" class="pm-table-expand-item">
                          <el-switch v-model="props.row.user_isactive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                        </el-col>
                        <el-col :span="10" class="pm-table-expand-item">
                          <el-button type="primary" size="small"
                            style="width:100%" @click="saveUser(props)">Save</el-button>
                          <el-button type="info" size="small"
                            style="width:100%" @click="cancelUser(props)">Cancel</el-button>
                        </el-col>
                      </el-row>
                    </template>
                  </el-table-column>
                  <el-table-column label="Id" prop="user_id" v-if="false"></el-table-column>
                  <el-table-column label="Name" prop="user_name" min-width="100" show-overflow-tooltip sortable></el-table-column>
                  <el-table-column label="Email" prop="user_email" min-width="230" show-overflow-tooltip sortable></el-table-column>
                  <el-table-column label="Team" prop="user_team" align="center" min-width="70" sortable></el-table-column>
                  <el-table-column label="Role" align="center"
                      :filters="roleFilter"
                      :filter-method="rolefilterHandler">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.user_role === 'Admin'" size="small" effect="dark">{{scope.row.user_role}}</el-tag>
                      <el-tag v-if="scope.row.user_role === 'General'" size="small" type="info" effect="dark">{{scope.row.user_role}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="Active" align="center"
                      :filters="activeFilter"
                      :filter-method="activefilterHandler">
                    <template slot-scope="scope">
                      <i v-if="scope.row.user_isactive" class="el-icon-success"
                        style="font-size: 25px; color: #2ed573"></i>
                      <i v-if="!scope.row.user_isactive" class="el-icon-error"
                        style="font-size: 25px; color: #ff4757"></i>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'ProjectManagement',
  data () {
    return {
      header1: 'Project Related',
      header2: 'Task Related',
      isActive: true,
      userData: [
        {user_id: 1, user_name: 'zhongshu.liang', user_email: 'zhongshu.liang@accenture.com', user_team: 'TOS', user_role: 'Admin', user_isactive: true},
        {user_id: 2, user_name: 'chaofeng.jia', user_email: 'chaofeng.jia@accenture.com', user_team: 'Billing', user_role: 'General', user_isactive: true},
        {user_id: 3, user_name: 'xu.xu', user_email: 'xu.xu@accenture.com', user_team: 'Billing', user_role: 'General', user_isactive: false},
        {user_id: 4, user_name: 'zefeng.wu', user_email: 'zefeng.wu@accenture.com', user_team: 'TOS', user_role: 'General', user_isactive: true},
        {user_id: 5, user_name: 'yixin.li', user_email: 'yixin.li@accenture.com', user_team: 'TOS', user_role: 'General', user_isactive: true},
        {user_id: 6, user_name: 'zhongshu.liang', user_email: 'zhongshu.liang@accenture.com', user_team: 'TOS', user_role: 'Admin', user_isactive: true},
        {user_id: 7, user_name: 'chaofeng.jia', user_email: 'chaofeng.jia@accenture.com', user_team: 'Billing', user_role: 'General', user_isactive: true},
        {user_id: 8, user_name: 'xu.xu', user_email: 'xu.xu@accenture.com', user_team: 'Billing', user_role: 'General', user_isactive: false},
        {user_id: 9, user_name: 'zefeng.wu', user_email: 'zefeng.wu@accenture.com', user_team: 'TOS', user_role: 'General', user_isactive: true},
        {user_id: 10, user_name: 'yixin.li', user_email: 'yixin.li@accenture.com', user_team: 'TOS', user_role: 'General', user_isactive: true}
      ],
      userResetData: [],
      activeFilter: [
        {text: 'Active', value: true},
        {text: 'Inactive', value: false}
      ],
      roleFilter: [
        {text: 'Admin', value: 'Admin'},
        {text: 'General', value: 'General'}
      ]
    }
  },
  methods: {
    switchToTM () {
      this.$data.isActive = false
      this.$router.push({path: 'TaskManagement'})
    },
    activefilterHandler (value, row, column) {
      return row['user_isactive'] === value
    },
    rolefilterHandler (value, row, column) {
      return row['user_role'] === value
    },
    saveUser (props) {
      console.log(props)
    },
    cancelUser (props) {
      var index = props.$index
      if (props.row.user_id > 0) {
        props.row.user_name = this.$data.userResetData[index].user_name
        props.row.user_email = this.$data.userResetData[index].user_email
        props.row.user_team = this.$data.userResetData[index].user_team
        props.row.user_role = this.$data.userResetData[index].user_role
        props.row.user_isactive = this.$data.userResetData[index].user_isactive
      } else {
        this.$data.userData.splice(index, 1)
      }
    },
    addUser () {
      var user = {
        user_id: -1,
        user_name: 'N/A',
        user_email: 'N/A',
        user_team: 'TOS',
        user_role: 'General',
        user_isactive: false
      }
      this.$data.userData.unshift(user)
    }
  },
  created () {
    console.log('Created')
    var jsonString = JSON.stringify(this.$data.userData)
    this.$data.userResetData = JSON.parse(jsonString)
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
.pm-content {
  width: auto;
  height: auto;
  padding: 20px 5px 0px 5px;
  text-align: left;
}
.pm-content-header {
  font-size: 24px;
  margin-left: 10px;
  color: #747d8c;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}
.pm-content-header-btn {
  margin-left: 20px;
}
.pm-table-expand-label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 32px;
  line-height: 32px;
  font-size: 15px;
  color: #99a9bf;
}
.pm-table-expand-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 32px;
  line-height: 32px;
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
<style>
.el-card__body {
  padding: 5px 10px;
}
</style>
