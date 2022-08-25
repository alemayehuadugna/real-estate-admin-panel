<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.id" placeholder="Reported-Name" style="width: 200px; margin-right: 6px" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                Search
            </el-button>
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
        <el-table-column label="Report-Id" align="center" min-width="150px">
            <template slot-scope="{row}">
                <span>{{ row.reportId }}</span>
            </template>
        </el-table-column>
        <el-table-column label="Reported-Name" min-width="150px" align="center">
            <template slot-scope="{row}">
                <span>{{ row.reportedId.firstName }} {{ row.reportedId.lastName }}</span>
            </template>
        </el-table-column>
        <el-table-column label="Reported-Phone" min-width="150px" align="center">
            <template slot-scope="{row}">
                <span>{{ row.reportedId.phone }}</span>
            </template>
        </el-table-column>
        <el-table-column label="Report-Count" min-width="150px">
            <template slot-scope="{row}">
                <span class="link-type" @click="handleUpdate(row.reportedList, row.reportedId.firstName, row.reportedId.lastName, row.count)"> {{ row.count }}</span>
            </template>
        </el-table-column>
        <el-table-column label="Action" align="center" width="100" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
                <el-button size="mini" type="danger" @click="handleDelete(row.reportId, $index)">
                    Delete
                </el-button>
            </template>
        </el-table-column>   
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="dialogStatus" :visible.sync="tableVisible" :width="responsiveWidth">
    <div>
        <div style="padding-bottom: 10px; font-weight: bold">
            <span>{{ 'Reported-Name:' }} {{ reportedName }}</span>
        </div>
        <div style="padding-bottom: 20px; font-weight: bold">
            <span >{{ 'Report-Count:'}} {{ reportCount }}</span>
        </div>
    </div>
    <el-table  :data="reportList" >
        <el-table-column label="ReporterName" min-width="100">
            <template slot-scope="scope">
                {{ scope.row.reporterId.firstName }} {{ scope.row.reporterId.lastName }}
            </template>
        </el-table-column>
        <el-table-column label="Type" min-width="100">
            <template slot-scope="scope">
                {{ scope.row.type }}
            </template>
        </el-table-column>
        <el-table-column label="Description" width="100">
            <template slot-scope="scope">
                {{ scope.row.description }}
            </template>
        </el-table-column>
    </el-table>
    </el-dialog>
    </div>
</template>

<script>
import { fetchList, deleteReport, searchList } from '@/api/report'
import pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'


export default {
    name: 'Report',
    components: { pagination },
    data() {
        return {
            tableKey: 0,
            list: null,
            reportList: null,
            reportedName: null,
            reportCount: null,
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 10,
                id: undefined
            },
            temp: {
                id: undefined,
                reportId: undefined,
                reportedId: undefined,
                count: undefined
            },
            tableVisible: false,
            dialogStatus: '',
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
                    this.total = response.total
                    this.reportList = response.data.reportedList

                    //Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    }, 1.5 * 100)
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
                this.listLoading = true
                const id = this.listQuery.id;
                if(id ==='' || id==='undefined') {
                    this.getList()
                }else {
                    this.list = null
                    searchList(id).then(response => {
                        this.list = [response.data]
                        setTimeout(()=> {
                            this.listLoading = false
                        }, 1.5 * 100)
                    })
                }

            },
            handleUpdate(row, firstName, lastName, count) {
                this.reportedName = firstName + ' ' + lastName
                this.reportCount = count
                this.dialogStatus = 'Reported-List'
                this.reportList = row;
                this.tableVisible = true
            },
            handleDelete(reportId, index) {
                this.$notify({
                    title: 'Success',
                    message: 'Delete Successfully',
                    type: 'success',
                    duration: 2000
                })
                this.list.splice(index, 1)
                deleteReport(reportId).then(response => {
                    setTimeout(() => {
                        this.listLoading = fasle
                    }, 1.5 * 100)
                })
            },
        }
}
</script>
