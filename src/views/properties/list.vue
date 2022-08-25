<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input
				placeholder="Search for"
				style="width: 300px"
				class="filter-item"
			/>

			<el-button
				class="filter-item"
				style="margin-left: 5px"
				type="primary"
				icon="el-icon-search"
			>
				Search
			</el-button>

			<el-button
				class="filter-item"
				style="margin-left: 20px"
				type="primary"
				icon="el-icon-search"
				@click="handleFilterDialog"
			>
				Filter
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
		>
			<el-table-column
				label="ID"
				prop="id"
				sortable="custom"
				align="center"
				width="220px"
			>
				<template slot-scope="{ row }">
					<span>{{ row.id }}</span>
				</template>
			</el-table-column>

			<el-table-column label="Region" min-width="150px">
				<template slot-scope="{ row }">
					<span>{{ row.address.region }}</span>
				</template>
			</el-table-column>

			<el-table-column label="City" min-width="150px">
				<template slot-scope="{ row }">
					<span>{{ row.address.city }}</span>
				</template>
			</el-table-column>

			<el-table-column label="Subcity" min-width="150px">
				<template slot-scope="{ row }">
					<span>{{ row.address.subcity }}</span>
				</template>
			</el-table-column>

			<el-table-column label="Pricing" min-width="150px">
				<template slot-scope="{ row }">
					<span>{{ row.pricing }}</span>
				</template>
			</el-table-column>

			<el-table-column label="Rating" min-width="150px">
				<template slot-scope="{ row }">
					<span>{{ row.rating }}</span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="Actions" width="230" class-name="small-padding fixed-width">
				<template slot-scope="{ row, $index}">
					<router-link :to="'/property/view/' + row.id">
						<el-button size="mini" style="margin: 2px;">
							View
						</el-button>
					</router-link>					
					<router-link :to="'/property/edit/' + row.id">
						<el-button type="primary" size="mini" style="margin: 2px;">
							Edit
						</el-button>
					</router-link>
					<el-button type="danger" size="mini" style="margin: 2px;" @click="handleDelete(row.id , $index)">
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
			title="Filter"
			:visible.sync="dialogFilterVisible"
			:width="responsiveWidth"
			style="margin-bottom: 20px"
		>
			<el-form ref="filterForm" :model="filterQuery" class="create-form">
				<el-form-item>
					<span>Property Status</span>
					<div>
						<el-select
							v-model="filterQuery.status"
							placeholder="Please select"
						>
							<el-option
								v-for="item in statusOptions"
								:key="item"
								:label="item"
								:value="item"
							/>
						</el-select>
					</div>
				</el-form-item>

				<el-form-item>
					<span>Property Area</span>
					<el-slider
						v-model="filterQuery.area"
						range
						:max="8000"
					></el-slider>
				</el-form-item>

				<el-form-item>
					<span>Address</span>
					<div>
						<el-input
							placeholder="Enter Region"
							v-model="filterQuery.address.region"
							style="width: 30%"
						></el-input>
						<el-input
							placeholder="Enter City"
							v-model="filterQuery.address.city"
							style="width: 30%; margin-left: 5px"
						></el-input>
						<el-input
							placeholder="Enter Area Name"
							v-model="filterQuery.address.areaName"
							style="width: 30%; margin-left: 5px"
						></el-input>
					</div>
				</el-form-item>

				<el-form-item>
					<span>Property Price</span>
					<el-slider
						v-model="filterQuery.price"
						range
						:max="20000"
					></el-slider>
				</el-form-item>

				<el-form-item>
					<span>Bedroom</span>
					<el-slider
						v-model="filterQuery.bedroomCount"
						show-input
						style="margin-left: 10px"
					>
					</el-slider>
				</el-form-item>

				<el-form-item>
					<span>Bathroom</span>
					<el-slider
						v-model="filterQuery.bathroomCount"
						show-input
						style="margin-left: 10px"
					>
					</el-slider>
				</el-form-item>

				<el-form-item>
					<span>Property Type</span>
					<div>
						<el-select
							v-model="filterQuery.propertyType"
							placeholder="Please select"
						>
							<el-option
								v-for="item in propertyTypeOptions"
								:key="item"
								:label="item"
								:value="item"
							/>
						</el-select>
					</div>
				</el-form-item>

				<el-form-item>
					<span>Property Rating</span>
					<el-slider
						v-model="filterQuery.rating"
						range
						:max="5.0"
					></el-slider>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFilterVisible = false">
					Cancel
				</el-button>
				<el-button type="primary" @click="handleFilter">
					Filter
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { listProperties, filterProperties, deleteProperty } from "@/api/property";
	import { mapGetters } from "vuex";
	import Pagination from "@/components/Pagination";
	var address = { region: "", city: "", areaName: "" };
	var area = [2000, 6000];
	var price = [2000, 7000];

	export default {
		name: "PropertyManagement",
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
				},
				statusOptions: ["forSale", "forRent", "Rented", "Sold"],
				propertyTypeOptions: ["Apartment", "Villa", "Condominium"],
				filterQuery: {
					address,
					area,
					price,
					status: "",
					bedroomCount: 0,
					bathroomCount: 0,
					propertyType: "",
					rating: [3, 4],
				},
				downloadLoading: false,
				searchByOptions: ["Id", "Agent", "Price"],
				dialogFormVisible: false,
				dialogFilterVisible: false,
				dialogStatus: "",
				textMap: {
					filter: "Filter",
					create: "Create",
				},
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
				listProperties(this.listQuery)
					.then((response) => {
						this.list = response.data;
						this.total = response.total;
						this.listLoading = false;
					})
					.catch((error) => {
						console.log(error);
					});
			},
			handleFilterDialog() {
				this.dialogFilterVisible = true;
			},
			handleFilter() {
				this.dialogFilterVisible = false;
				this.filterQuery.limit = this.listQuery.limit;
				this.filterQuery.page = this.listQuery.page;
				filterProperties(this.filterQuery)
					.then((response) => {
						this.list = response.data;
						this.total = response.total;
					})
					.catch((error) => {
						console.log(error);
					});
			},
			handleDelete(id, index) {
				deleteProperty(id).then((response) => {
					this.total = response.total;
					this.list.splice(index, 1);
					this.$notify({
						title: "Success",
						message: "Delete Successfully",
						type: "success",
						duration: 2000
					});
				}).catch(err => {
					console.log(err)
					this.$notify({
						title: "Error",
						message: "Delete Unsuccessful",
						type: "error",
						duration: 2000
					});
				})
			}
		},
	};
</script>
