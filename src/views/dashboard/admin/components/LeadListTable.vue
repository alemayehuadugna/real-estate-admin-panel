<template>
    <el-table :data="list" style="width: 100%;padding-top: 15px;">
        <el-table-column label="PropertyId" min-width="200">
            <template slot-scope="scope">
                {{ scope.row.propertyId }}
            </template>
        </el-table-column>
        <el-table-column label="AgentName" min-width="195">
            <template slot-scope="scope">
                {{ scope.row.agentId.firstName }} {{ scope.row.agentId.lastName }}
            </template>
        </el-table-column>
        <el-table-column label="status" width="100" align="center">
            <template slot-scope="{row}">
             <el-tag :type="row.progress | statusFilter">
                {{ row.progress }} 
            </el-tag>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { leadList } from '@/api/lead-search'

export default {
    filters: {
        statusFilter(status) {
            const statusMap = {
                success: 'success',
                pending: 'info',
                failure: 'danger'
            }
            return statusMap[status]
        }
    },
    data() {
        return {
            list: null
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            leadList().then(response => {
                this.list = response.data
            })
        }
    }
}
</script>
