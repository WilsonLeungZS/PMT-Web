<template>
  <!-- skill page set-->
  <div class="skill-set">
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
            <el-input v-model="params.skillName"></el-input>
          </li>
          <li>
            <p>Description：</p>
            <el-input v-model="params.skillDesc"></el-input>
          </li>
          <li>
            <p>Group：</p>
            <el-input v-model="params.skillGroup"></el-input>
          </li>
        </ul>
      </section>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateSkill">{{
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
    async updateSkill() {
      await http.post("/skills/updateSkill", {
        Id: this.params.skillId,
        Name: this.params.skillName,
        Description: this.params.skillDesc,
        Group: this.params.skillGroup,
      });
      this.$parent.getAllSkillsList();
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


