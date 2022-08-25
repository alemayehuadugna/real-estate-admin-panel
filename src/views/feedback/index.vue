<template>
    <div>
    <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;padding-top: 15px"
    >
        <el-table-column label="Feedback-Id" align="center" min-width="150px">
            <template slot-scope="{row}">
                <span>{{ row.feedbackId }}</span>
            </template>
        </el-table-column>
        <el-table-column label="Message" min-width="150px" align="center">
            <template slot-scope="{row}">
                <span>{{ row.message }}</span>
            </template>
        </el-table-column>
        <el-table-column label="Name" width="150px" align="center">
            <template slot-scope="{row}">
                <span>{{ row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column label="Action" align="center" width="100" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
                <el-button size="mini" type="danger" @click="handleDelete(row.feedbackId,$index)">
                    Delete
                </el-button>
            </template>
        </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
</template>

<script>
import { fetchList, deleteFeedback } from '@/api/feedback'
import Pagination from '@/components/Pagination'

export default {
    name: 'Feedback',
    components: { Pagination },
    data() {
        return {
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 10,
            },
            temp: {
                id: undefined,
                feedbackId: undefined,
                message: undefined,
                name: undefined
            },
           }
          },
            created() {
                this.getList()
            },
            methods: {
                getList() {
                    this.listLoading = true
                    fetchList(this.listQuery).then(response => {
                        this.list = response.data
                        this.total = response.total

                        //Just to simulate the time of the request
                        setTimeout(() => {
                            this.listLoading = false
                        }, 1.5 * 100)
                    })
                },
                handleDelete(feedbackId, index) {
                    this.$notify({
                        title: 'Success',
                        message: 'Delete Successfully',
                        type: 'success',
                        duration: 2000
                    })
                    this.list.splice(index, 1)
                    deleteFeedback(feedbackId).then(response => {
                        setTimeout(() => {
                            this.listLoading = false
                        }, 1.5 * 100)
                    })
                },
            }
}
</script>
