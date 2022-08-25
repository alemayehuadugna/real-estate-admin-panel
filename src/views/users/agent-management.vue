<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input
				v-model="listQuery.searchFor"
				placeholder="Search For"
				style="width: 300px"
				class="filter-item"
				@keyup.enter.native="
					listQuery.searchFor === undefined ||
					listQuery.searchFor === '' ||
                    listQuery.searchBy === undefined ||
                    listQuery.searchBy === ''
						? getList()
						: handleFilter()
				"
			/>
			<el-select
				v-model="listQuery.searchBy"
				placeholder="Search By"
				clearable
				style="width: 112px; margin-left: 3px"
				class="filter-item"
			>
				<el-option
					v-for="item in searchByOptions"
					:key="item"
					:label="item"
					:value="item"
				/>
			</el-select>
			<el-button
				class="filter-item"
				style="margin-left: 5px"
				type="primary"
				icon="el-icon-search"
				@click="
					listQuery.searchFor === undefined ||
					listQuery.searchFor === '' ||
                    listQuery.searchBy === undefined ||
                    listQuery.searchBy === ''
						? getList()
						: handleFilter()
				"
			>
				Search
			</el-button>
			<el-button
				class="filter-item"
				style="margin-left: 20px"
				type="primary"
				icon="el-icon-edit"
				@click="handleCreate"
			>
				Add
			</el-button>
			<el-button
				:loading="downloadLoading"
				class="filter-item"
				type="primary"
				icon="el-icon-download"
			>
				Export
			</el-button>
		</div>

		<el-table
			:key="tableKey"
			v-loading="listLoading"
			:data="list"
			border
			fit
			highlight-current-row
			style="width: 100%"
			@sort-change ="sortChange"
		>
			<el-table-column label="ID"  align="center" width="220px">
				<template slot-scope="{ row }">
					<span>{{ row.id }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Name" min-width="150px">
				<template slot-scope="{ row }">
					<span>{{ row.firstName + " " + row.lastName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Phone" min-width="100px">
				<template slot-scope="{ row }">
					<span>{{ row.phone }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Email" min-width="200px">
				<template slot-scope="{ row }">
					<span>{{ row.email }}</span>
				</template>
			</el-table-column>
            <el-table-column label="Sold" prop="sold" min-width="70px" sortable="custom">
				<template slot-scope="{ row }">
					<span>{{ row.salesDone }}</span>
				</template>
			</el-table-column>
            <el-table-column label="Rented" prop="rented" min-width="70px" sortable="custom">
				<template slot-scope="{ row }">
					<span>{{ row.rentDone }}</span>
				</template>
			</el-table-column>
            <el-table-column label="Rating" prop="rating" min-width="70px" sortable="custom">
				<template slot-scope="{ row }">
					<span>{{ row.rating.toFixed(2) }}</span>
				</template>
			</el-table-column>    
			<el-table-column
				label="Actions"
				align="center"
				width="230"
				class-name="small-padding fixed-width"
			>
				<template slot-scope="{ row, $index }">
					<el-button type="primary" size="mini">
						Deactivate
					</el-button>
					<el-button
						v-if="row.status != 'deleted'"
						size="mini"
						type="danger"
						@click="handleDelete(row, $index)"
					>
						Delete
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination
			v-show="total > 0"
			:total="total"
			:page.sync="listQuery.page"
			:limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<el-dialog
			:title="textMap"
			:visible.sync="dialogFormVisible"
			:width="responsiveWidth"
		>
			<el-form ref="dataForm" :model="temp" class="create-form">
				<el-form-item label="First Name" prop="firstName">
					<el-input v-model="temp.firstName" />
				</el-form-item>
				<el-form-item label="Last Name" prop="lastName">
					<el-input v-model="temp.lastName" />
				</el-form-item>
				<el-form-item label="Phone" prop="phone">
					<el-input v-model="temp.phone" />
				</el-form-item>
				<el-form-item label="Email" prop="email">
					<el-input v-model="temp.email" />
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

<script>
	import {
		listAgents,
		deleteAgent,
		createAgent,
		filterAgent,
	} from "@/api/agent-management";
	import Pagination from "@/components/Pagination";
	import { mapGetters } from "vuex";

	export default {
		name: "AgentManagement",
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
					searchBy: undefined,
					searchFor: undefined,
					sort: null
				},
				downloadLoading: false,
				searchByOptions: ["Id", "Name", "Phone", "Email"],
				temp: {
					firstName: "",
					lastName: "",
					phone: "",
					email: "",
					profilePicture:
						"https://www.shareicon.net/download/2017/01/06/868320_people.svg",
				},
				dialogFormVisible: false,
				dialogStatus: "",
				textMap: "Create",
				width: "96%",
				rules: {},
			};
		},
		created() {
			this.getList();
		},
		computed: {
			...mapGetters(["device"]),
			responsiveWidth() {
				if (this.device === "mobile") {
					return "90%";
				} else {
					return "60%";
				}
			},
		},
		methods: {
			getList() {
				this.listLoading = true;
				listAgents(this.listQuery)
					.then((response) => {
						this.list = response.data;
						this.total = response.total;
						this.listLoading = false;
					})
					.catch((error) => {
						console.log(error);
					});
			},
			handleFilter() {
				filterAgent(this.listQuery)
					.then((response) => {
						this.list = response.data;
						this.total = response.total;
					})
					.catch((error) => {
						console.log(error);
					});
			},
			sortChange(data) {
				const { prop, order } = data;
				if (prop === 'sold') {
					this.listQuery.searchBy = 'Sales';
					this.sortBy(order)
				} else if (prop === 'rented') {
					this.listQuery.searchBy = 'Rents';
					this.sortBy(order)
				} else if (prop === 'rating') {
					this.listQuery.searchBy = 'Rating';
					this.sortBy(order)
				}
			},
			sortBy(order) {
				if (order === 'ascending') {
					this.listQuery.sort = 'asc'
				} else {
					this.listQuery.sort = 'desc'
				}
				this.handleFilter()
			},
			handleDelete(row, index) {
				deleteAgent(row.id).then((response) => {
					if (response.data) {
						this.total = response.total;
						this.$notify({
							title: "Success",
							message: "Delete Successfully",
							type: "success",
							duration: 2000,
						});
						this.list.splice(index, 1);
					}
				});
			},
			handleCreate() {
				this.resetTemp();
				this.dialogStatus = "create";
				this.dialogFormVisible = true;
			},
			createData() {
				this.$refs["dataForm"].validate((valid) => {
					if (valid) {
						this.temp.password = "11001100";
						createAgent(this.temp)
							.then(() => {
								this.dialogFormVisible = false;
								this.getList();
								this.$notify({
									title: "Success",
									message: "Created Successfully",
									type: "success",
									duration: 2000,
								});
							})
							.catch((error) => {
								console.log(error);
							});
					}
				});
			},
			resetTemp() {
				this.temp = {
					id: undefined,
					firstName: "",
					lastName: "",
					phone: "",
					email: "",
					profilePicture: "",
				};
			},
		},
	};
</script>

<style scoped>
.create-form {
	width: 75%;
	margin-left: 10%;
}

@media (min-width: 992px) {
	.create-form {
		width: 50%;
		margin-left: 15%;
	}
}
</style>