<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.phone" placeholder="PhoneNumber" style="width: 200px;margin-right: 6px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="Lead-Id" align="center" min-width="150px" >
        <template slot-scope="{row}">
          <span>{{ row.leadId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Agent-Phone" width="150px" align="center">
        <!-- <template slot-scope="{row}">
          <span>{{ row.agentId.phone }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="User-Phone" min-width="150px">
        <!-- <template slot-scope="{row}">
          <span>{{ row.userId.phone }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="Property-Id" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.propertyId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Type" width="110px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Start-Date" min-width="150px">
        <template slot-scope="{row}">
            <span>{{ row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="End-Date" align="center" min-width="150">
        <template slot-scope="{row}">
          <span >{{ row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Progress" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.progress | statusFilter">
            {{ row.progress }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Description" align="center" width="200px">
        <template slot-scope="{row}">
          <span >{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.progress==='pending'" size="mini" type="success" @click="handleModifyStatus(row,'success')">
            Success
          </el-button>
          <el-button v-if="row.progress==='pending'" size="mini" @click="handleModifyStatus(row,'failure')">
            Failure
          </el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(row.leadId,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
             
             <!-- create lead -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :width="responsiveWidth">
      <el-form ref="dataForm" :rules="rules" :model="temp" class="create-form">
        <el-form-item label="AgentId" prop="agentId">
            <el-input v-model="temp.agentId" placeholder="Enter Agent Id" />
        </el-form-item>
        <el-form-item label="UserId" prop="userId">
            <el-input v-model="temp.userId" placeholder="Enter User Id" />
        </el-form-item>
        <el-form-item label="PropertyId" prop="propertyId">
            <el-input v-model="temp.propertyId" placeholder="Enter Property Id" />
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Description" prop="description" >
          <el-input v-model="temp.description" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="createData">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script >
import { fetchList, searchList, createLead, updateProgress, deleteLead } from '@/api/lead'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'

const calendarTypeOptions = [
  { key: 'rent', display_name: 'Rent' },
  { key: 'sale', display_name: 'Sale' },
]

const calendarTypeKeyValue = calendarTypeOptions.reduce(function(acc, cur) {
    acc[cur.key]=cur.display_name
    return acc
  }, {})

export default {
  name: 'LeadTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(progress) {
      const statusMap = {
        success: 'success',
        pending: 'info',
        failure: 'danger'
      }
      return statusMap[progress]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        phone: undefined,
      },
      calendarTypeOptions,
      statusOptions: ['success', 'failure', 'pending'],
      temp: {
        id: undefined,
        agentId: undefined,
        userId: undefined,
        propertyId: undefined,
        type: '',
        description: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: 'Create'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        agentId: [{ type: 'string', required: true, message: 'agentId is required', trigger: 'blur' }],
        userId: [{ type: 'string', required: true, message: 'userId is required', trigger: 'blur' }],
        propertyId: [{ type: 'string', required: true, message: 'propertyId is required', trigger: 'blur' }],
      },
    //   downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters([
      'device'
    ]),
    responsiveWidth() {
      if (this.device === 'mobile') {
        return "90%";
      } else {
        return "60%";
      }
    }

  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        console.log("lead: ",this.list)
        this.total = response.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
      this.listLoading = true
      const phone = this.listQuery.phone
      if(this.listQuery.phone =='' || this.listQuery.phone==='undefined') { 
          this.getList()
      }else{
          this.list = null
          searchList(phone).then(response => {
              this.list = response.data
              setTimeout(() => {
                  this.listLoading = false
              }, 1.5 * 100)
              })
          }
     },
     handleModifyStatus(row, status) {
      this.$message({
        message: 'Success',
        type: 'success'
      })
      row.progress = status
      const progress = status
      const id = row.leadId
      updateProgress({ progress }, id).then(response => {
          setTimeout(() => {
              this.listLoading = false
          }, 1.5 * 100)
      })
    },
  
    resetTemp() {
      this.temp = {
        id: undefined,
        agentId: undefined,
        userId: undefined,
        propertyId: undefined,
        type: '',
        description: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const agentId = this.temp.agentId
          const userId = this.temp.userId
          const propertyId = this.temp.propertyId
          const type = this.temp.type
          const description = this.temp.description
          createLead({agentId, userId, propertyId, type, description}).then(response => {
            console.log("list: ", response);
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(leadId, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
      deleteLead(leadId).then(response => {
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })
    },
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const data = this.formatJson(filterVal)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'table-list'
    //     })
    //     this.downloadLoading = false
    //   })
    // },

          
  }
}


</script>

<style scoped>
    .create-form {
      width: 75%;
      margin-left: 10px;
    }

    @media (min-width: 92px) {
      .create-form {
        width: 50%;
        margin-left: 15%;
      }
    }
</style>