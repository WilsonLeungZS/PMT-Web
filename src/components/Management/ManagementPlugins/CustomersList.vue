<template>
<div class="cm-content">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="cm-content-header">
        <span>Customers List</span>
        <el-button @click="createCustomer" class="cm-content-header-btn" :style="{'background-color': btnColor, 'border': 'none', 'color': 'white'}" icon="el-icon-plus" size="mini">Create New Customer</el-button>
      </span>
    </div>
    <el-table v-loading="customerLoading" :data="customerData" fit>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row :gutter="15">
            <el-col :span="4" :lg="2" class="cm-table-expand-label">
              <span>Name</span>
            </el-col>
            <el-col :span="6" :lg="4" class="cm-table-expand-item">
              <el-input v-model="props.row.customerName" size="small" style="width: 100%"></el-input>
            </el-col>
            <el-col :span="4" :lg="2" class="cm-table-expand-label">
              <span>Description</span>
            </el-col>
            <el-col :span="10" :lg="8" class="cm-table-expand-item">
              <el-input v-model="props.row.customerDescription" size="small" style="width: 100%"></el-input>
            </el-col>
            <el-col :span="4" :lg="2" class="cm-table-expand-label">
              <span>Email Domain</span>
            </el-col>
            <el-col :span="10" :lg="6" class="cm-table-expand-item">
              <el-input v-model="props.row.customerEmailDomain" size="small" style="width: 100%"></el-input>
            </el-col>
            <el-col :span="4" :lg="2" class="cm-table-expand-label">
              <span>Home Page</span>
            </el-col>
            <el-col :span="10" :lg="14" class="cm-table-expand-item">
              <el-input v-model="props.row.customerHomepage" size="small" style="width: 100%"></el-input>
            </el-col>
            <el-col :span="8" :lg="4" class="pm-table-expand-item">
              <el-button @click="cancelCustomer(props)" type="info" size="small" style="width:100%" >Cancel</el-button>
            </el-col>
            <el-col :span="8" :lg="4" class="pm-table-expand-item">
              <el-button @click="saveCustomer(props)" :style="{'background-color': btnColor2, 'border': 'none', 'color': 'white'}" size="small" style="width:100%">Save</el-button>
            </el-col>                    
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="Id" prop="customerId" v-if="false"></el-table-column>
      <el-table-column label="Name" prop="customerName" align="left" min-width="50"></el-table-column>
      <el-table-column label="Description" prop="customerDescription" align="left"></el-table-column>
      <el-table-column label="Email Domain" prop="customerEmailDomain" align="left"></el-table-column>
      <el-table-column label="Home Page" prop="customerHomepage" align="left">
        <template slot-scope="scope">
          <a :href="scope.row.customerHomepage" target="_blank">{{scope.row.customerHomepage}}</a>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
import http from '../../../utils/http'
import utils from '../../../utils/utils'
export default {
  name: 'CustomersList',
  data () {
    return {
      customerLoading: false,
      customerData: [],
      customerResetData: [],
      btnColor: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor,
      btnColor2: utils.themeStyle[this.$store.getters.getThemeStyle].btnColor2
    }
  },
  methods: {
    // Customer Management
    async getCustomerList () {
      this.$data.customerLoading = true
      this.$data.customerData = []
      const res = await http.get('/sprints/getAllCustomersList')
      if (res.data.status === 0) {
        this.$data.customerData = res.data.data
        var jsonString1 = JSON.stringify(this.$data.customerData)
        this.$data.customerResetData = JSON.parse(jsonString1)
      } else {
        this.$data.customerResetData = []
      }
      this.$data.customerLoading = false
    },
    createCustomer () {
      var customer = {
        customerId: 0,
        customerName: '',
        customerDescription : '',
        customerHomepage: '',
        customerEmailDomain: ''
      }
      this.$data.customerData.unshift(customer)
    },
    async saveCustomer (props) {
      var customer = props.row
      if(this.isEmptyField(customer.customerName, 'Name')) return
      const res = await http.post('/sprints/updateCustomer', {
        reqCustomerId: customer.customerId,
        reqCustomerName: customer.customerName,
        reqCustomerDescription : customer.customerDescription,
        reqCustomerHomepage: customer.customerHomepage,
        reqCustomerEmailDomain: customer.customerEmailDomain,
      })
      if (res.data.status === 0) {
        this.getCustomerList()
        this.showMessage('Add/Update customer successfully!', 'success')
      } else {
        this.$message.error('Add/Update customer Failed!')
      }
    },
    cancelCustomer (props) {
      var index = props.$index
      if (props.row.customerId > 0) {
        props.row.customerName = this.$data.customerResetData[index].customerName
        props.row.customerDescription = this.$data.customerResetData[index].customerDescription
        props.row.customerHomepage = this.$data.customerResetData[index].customerHomepage
        props.row.customerEmailDomain = this.$data.customerResetData[index].customerEmailDomain
      } else {
        this.$data.customerData.splice(index, 1)
      }
    },
    // Common method
    isEmptyField (iField, iFieldName) {
      if (iField == null || iField == '') {
        this.showMessage( iFieldName + ' could not be empty!', 'error')
        return true
      }
    },
    showMessage (iMsg, iType) {
      this.$message({
        message: iMsg,
        type: iType
      })
    }
  },
  created () {
    this.getCustomerList()
  }
}
</script>

<style scoped>
/* Content Style */
.cm-content {
  width: auto;
  height: auto;
  padding: 20px 5px 0px 5px;
  text-align: left;
}
.cm-content-header {
  font-size: 24px;
  margin-left: 10px;
  color: #747d8c;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}
.cm-content-header-btn {
  font-size: 14px;
  margin-left: 30px;
}
.cm-table-expand-label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 32px;
  line-height: 32px;
  font-size: 15px;
  color: #99a9bf;
  margin-bottom: 10px;
}
.cm-table-expand-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 32px;
  line-height: 32px;
  margin-bottom: 10px;
}
.cm-content>>>.el-divider {
  background-color: #e0e0e0;
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
.cm-content .el-card__body {
  padding: 5px 10px;
}
.cm-content .el-table td, .el-table th {
  padding: 8px 0;
}
.cm-content .el-divider--horizontal {
  margin: 2px 0 10px 0;
}
/* google、safari */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
