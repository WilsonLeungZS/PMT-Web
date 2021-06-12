<template>
  <!-- people attribute management -->
  <div class="people">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <!-- user start  -->
      <el-tab-pane label="User" name="User">
        <UsersList ref="user"></UsersList>
      </el-tab-pane>
      <!-- user end  -->

      <!-- skill start  -->
      <el-tab-pane label="Skill" name="Skill">
        <el-card>
          <span class="btn-box">
            <span>Skill List</span>
            <el-button
              :style="{
                'background-color': btnColor,
              }"
              icon="el-icon-plus"
              size="mini"
              @click="openSkill()"
              >Create New Skill</el-button
            >
          </span>
          <el-table :data="skillList">
            <el-table-column prop="skillId" label="Id" width="50">
            </el-table-column>
            <el-table-column prop="skillName" label="Name" width="150">
              <template slot-scope="scope">
                <span
                  :style="{
                    color: btnColor,
                    cursor: 'pointer',
                  }"
                  @click="openSkill(scope.row)"
                  >{{ scope.row.skillName }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="skillDesc" label="Description">
            </el-table-column>
            <el-table-column prop="skillGroup" label="Group"> </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <!-- skill end  -->

      <!-- role start  -->
      <el-tab-pane label="Role" name="Role">
        <el-card>
          <span class="btn-box">
            <span>Role List</span>
            <el-button
              :style="{
                'background-color': btnColor,
              }"
              icon="el-icon-plus"
              size="mini"
              @click="openRole()"
              >Create New Role</el-button
            >
          </span>
          <el-table :data="roleList">
            <el-table-column prop="Id" label="Id" width="50"> </el-table-column>
            <el-table-column prop="Name" label="Name" width="150">
              <template slot-scope="scope">
                <span
                  :style="{
                    color: btnColor,
                    cursor: 'pointer',
                  }"
                  @click="openRole(scope.row)"
                  >{{ scope.row.Name }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="level" label="Level"> </el-table-column>
            <el-table-column prop="remark" label="Remark"> </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <!-- role end  -->
    </el-tabs>

    <!-- popup page -->
    <skillSet v-if="skillParams.visible" :params="skillParams"></skillSet>
    <roleSet v-if="roleParams.visible" :params="roleParams"></roleSet>
  </div>
</template>  

<script>
import http from "@/utils/http";
import utils from "@/utils/utils";
import UsersList from "@/components/Management/ManagementPlugins/UsersList";
import skillSet from "./components/skillSet";
import roleSet from "./components/roleSet";
export default {
  name: "people",
  components: {
    UsersList,
    skillSet,
    roleSet,
  },
  data() {
    return {
      activeName: "User",
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      skillList: [],
      roleList: [],
      skillParams: {
        visible: false,
      },
      roleParams: {
        visible: false,
      },
    };
  },
  mounted() {
    this.getAllSkillsList();
    this.getRoleList();
  },
  methods: {
    handleClick(tab) {
      if (tab.label == "User") {
        this.$refs.user.getUserList();
        this.$refs.user.getAllSkillsList();
        return;
      }
      this[
        {
          Skill: "getAllSkillsList",
          Role: "getRoleList",
        }[tab.label]
      ]();
    },
    async getAllSkillsList() {
      this.$data.skillsList = [];
      const res = await http.get("/users/getAllSkillsList");
      if (res.data.status == 0 && res.data.data.length != 0) {
        this.skillList = res.data.data;
      } else {
        this.$message.error("Failed to get skill list!");
      }
    },
    async getRoleList() {
      let res = await http.get("/roles/getRoleList");
      if (res.data.status == 0 && res.data.data.length != 0) {
        this.roleList = res.data.data;
      } else {
        this.$message.error("Failed to get role list!");
      }
    },
    openSkill(row) {
      this.skillParams = {
        ...this.skillParams,
        ...row,
        type: "Skill Set",
      };
      console.log(row);
      if (!row) {
        this.skillParams = {
          visible: false,
          type: "New Skill",
        };
      }
      this.skillParams.visible = true;
    },
    openRole(row) {
      this.roleParams = {
        ...this.roleParams,
        ...row,
        type: "Role Set",
      };
      console.log(row);
      if (!row) {
        this.roleParams = {
          visible: false,
          type: "New Role",
        };
      }
      this.roleParams.visible = true;
    },
  },
};
</script>


<style scoped>
.people {
  padding: 0 10px;
}
.el-card >>> .el-card__body {
  padding: 0px;
}
.btn-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  margin-left: 10px;
  padding: 18px 20px;
  font-size: 24px;
  color: #747d8c;
}
.btn-box .el-button {
  font-size: 14px;
  margin-left: 30px;
  border: none;
  color: white;
}
.el-table--fit {
  border-top: 1px solid #ebeef5;
}
</style>