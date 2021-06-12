<template>
  <!-- role page set-->
  <div class="role-set">
    <el-dialog
      :title="params.type"
      :visible.sync="params.visible"
      :close-on-click-modal="false"
      width="580px"
      center
    >
      <section>
        <ul>
          <li>
            <p>Name：</p>
            <el-input v-model="params.Name"></el-input>
          </li>
          <li>
            <p>level：</p>
            <el-input v-model="params.level"></el-input>
          </li>
          <li>
            <p>remark：</p>
            <el-input v-model="params.remark"></el-input>
          </li>
        </ul>
      </section>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updaterole">{{
          params.type
        }}</el-button>
        <el-button type="info" @click="shut">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "@/utils/http";
export default {
  props: ["params"],
  methods: {
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
</style>


