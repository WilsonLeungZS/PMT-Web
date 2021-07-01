<template>
  <!-- role page set-->
  <div class="role-set">
    <el-dialog
      :title="params.type"
      :visible.sync="params.visible"
      :close-on-click-modal="false"
      width="800px"
      center
    >
      <section>
        <ul>
          <li>
            <p>Name：</p>
            <el-input v-model="params.Name"></el-input>
          </li>
          <li>
            <p>Level：</p>
            <el-select v-model="params.level" placeholder="select">
              <el-option
                v-for="item in 13"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </li>
          <li>
            <p>Remark：</p>
            <el-input v-model="params.remark"></el-input>
          </li>
          <li>
            <p>Select：</p>
            <el-transfer
              v-model="selected"
              :data="unselected"
              :titles="['unselected', 'selected']"
              @change="updateUser"
            ></el-transfer>
          </li>
        </ul>
      </section>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updaterole">{{
          params.type
        }}</el-button>
        <el-button type="info" @click="shut">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "@/utils/http";
export default {
  props: ["params"],
  data() {
    return {
      unselected: [],
      selected: [],
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    // User Management
    async getUserList() {
      const res = await http.get("/users/getAllUsersList");
      if (res.data.status === 0) {
        this.unselected = res.data.data.map((item) => {
          item.userRole = item.userRole.split(",");
          item.label = item.userFullName;
          item.key = item.userFullName;
          item.userRole.indexOf(this.params.Name) != -1 &&
            this.selected.push(item.userFullName);
          return item;
        });
      } else {
        this.unselected = [];
      }
    },
    updateUser(selectList, type, key) {
      let userList = [];
      this.unselected.forEach((item) => {
        key.indexOf(item.userFullName) != -1 && userList.push(item);
      });
      userList.forEach(async (item) => {
        if (type == "left") {
          item.userRole.splice(item.userRole.indexOf(this.params.Name), 1);
        } else {
          item.userRole.push(this.params.Name);
        }
        await http.post("/users/updateUser", {
          reqUserId: item.userId,
          reqUserRole: item.userRole.toString(),
          reqUserIsActive:1,
        });
      });
    },
    async updaterole() {
      await http.post("/roles/updaterole", {
        Id: this.params.Id,
        Name: this.params.Name,
        level: this.params.level,
        remark: this.params.remark,
      });
      this.$parent.getRoleList();
      this.shut();
    },
    shut() {
      this.params.visible = false;
    },
  },
};
</script>
      
<style scoped>
section ul {
  padding: 0;
  margin: 0;
  list-style: none;
}
section ul li {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
section ul li p {
  width: 100px;
}
section ul li .el-input {
  flex: 1;
}
section ul li .el-select {
  flex: 1;
}
section ul li >>> .el-transfer {
  flex: 1;
}
section ul li >>> .el-transfer-panel {
  width: 45%;
}
section ul li >>> .el-transfer__buttons {
  width: 10%;
  padding: 0;
  text-align: center;
  box-sizing: border-box;
}
section ul li >>> .el-transfer__buttons button {
  display: inline-block;
}
</style>


