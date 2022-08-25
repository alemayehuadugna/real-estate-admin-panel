<template>
	<div class="createPost-container">
		<el-form>
			<sticky :z-index="10" class-name="sub-navbar" v-if="viewChoice !== 'View'">
				<el-button
					v-loading="loading"
					style="margin-left: 10px"
					@click="submitForm"
				>
					Save
				</el-button>
				<el-button v-loading="loading" type="danger" plain>
					Discard
				</el-button>
			</sticky>

			<div class="createPost-main-container">
				<el-col :gutter="10">

					<el-row :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
						<div class="grid-content">
							<el-form-item>
								<div>
									<span class="span-label" >Property Images</span>
								</div>
								<div class="images-container" v-if="viewChoice !== 'View'">
									<Upload v-model="postForm.propertyImages" :urls="imageUrls" :removedImages="removedImages" />
								</div>
								
								<div class="images-container" v-else>
									<div class="carousel-container">
										<el-carousel :interval="4000" type="card"> 
											<el-carousel-item v-for="url in imageUrls" :key="url">
												<el-image :src="url" :preview-src-list="imageUrls" fit="scale-down"> </el-image>
											</el-carousel-item>
										</el-carousel>
									</div>
								</div>
							</el-form-item>
						</div>

					</el-row>

					<el-row :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
						<div class="grid-content"  v-if="viewChoice !== 'View'">
							<el-form-item>
								<div>
									<span class="span-label">Agent Id</span>
								</div>
								<div style="max-width: 230px;">
									<el-input
										placeholder="Enter here"
										v-model="postForm.agentId"
									></el-input>
								</div>
							</el-form-item>
						</div>
						<div class="grid-content" v-else>
							<el-form-item>
								<div>
									<span class="span-label">Property Agent</span>
								</div>
								<div class="agent-container">
									<div class="agent-item">
										<span>Full Name</span>
										<el-input
											placeholder="Longitude"
											v-model="agent.fullName"
											disabled
										></el-input>
									</div>
									<div class="agent-item">
										<span>Phone</span>
										<el-input
											placeholder="Latitude"
											v-model="agent.phone"
											disabled
										></el-input>
									</div>
									<div class="agent-item">
										<span>Email</span>
										<el-input
											placeholder="Latitude"
											v-model="agent.email"
											disabled
										></el-input>
									</div>									
								</div>
							</el-form-item>
						</div>
					</el-row>

					<el-row :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
						<div class="grid-content">
							<el-form-item prop="desc">
								<span class="span-label"
									>Property Description</span
								>
								<div>
									<el-input
										type="textarea"
										:autosize="{ minRows: 2, maxRows: 6 }"
										placeholder="Enter here"
										v-model="postForm.description"
										style="max-width: 600px"
										:disabled="viewChoice === 'View'"
									></el-input>
								</div>
							</el-form-item>
						</div>
					</el-row>

					<el-row :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
						<div class="grid-content">
							<el-form-item>
								<span class="span-label">Property Price</span>
								<div>
									<el-input-number
										v-model="postForm.pricing"
										:disabled="viewChoice === 'View'"
									></el-input-number>
								</div>
							</el-form-item>
						</div>
					</el-row>

					<el-row :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
						<div class="grid-content">
							<el-form-item >
								<span class="span-label">Property Address</span>
								<div>
									<div class="address-input">
										<el-input
											placeholder="Region"
											v-model="postForm.address.region"
											:disabled="viewChoice === 'View'"
										></el-input>
									</div>
									<div class="address-input">
										<el-input
											placeholder="City"
											v-model="postForm.address.city"
											:disabled="viewChoice === 'View'"
										></el-input>
									</div>
									<div class="address-input">
										<el-input
											placeholder="Subcity"
											v-model="postForm.address.subcity"
											:disabled="viewChoice === 'View'"
										></el-input>
									</div>
									<div class="address-input">
										<el-input
											placeholder="Kebele"
											v-model="postForm.address.kebele"
											:disabled="viewChoice === 'View'"
										></el-input>
									</div>
									<div class="address-input">
										<el-input
											placeholder="House Number"
											v-model="postForm.address.houseNumber"
											:disabled="viewChoice === 'View'"
										></el-input>
									</div>
									<div class="address-input">
										<el-input
											placeholder="Area Name"
											v-model="postForm.address.areaName"
											:disabled="viewChoice === 'View'"
										></el-input>
									</div>
									<div class="address-input">
										<el-input
											placeholder="Property Name"
											v-model="postForm.address.propertyName"
											:disabled="viewChoice === 'View'"
										></el-input>
									</div>
									<div class="address-input">
										<el-input
											placeholder="Floor Number"
											v-model="postForm.address.floorNumber"
											:disabled="viewChoice === 'View'"
										></el-input>
									</div>
								</div>
							</el-form-item>
						</div>
					</el-row>

					<el-row :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
						<div class="grid-content">
							<el-form-item>
								<span class="span-label">Property Area</span>
								<div>
									<el-input-number
										v-model="postForm.area"
										:disabled="viewChoice === 'View'"
									></el-input-number>
								</div>
							</el-form-item>
						</div>
					</el-row>

					<el-row :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
						<div class="grid-content">
							<el-form-item>
								<span class="span-label"
									>Property Amenities</span
								>
								<div style="padding: 5px">
									<el-checkbox-group
										v-model="postForm.amenities"
										:disabled="viewChoice === 'View'"
									>
										<el-checkbox
											label="Online activities"
											name="type"
										></el-checkbox>
										<el-checkbox
											label="Promotion activities"
											name="type"
										></el-checkbox>
										<el-checkbox
											label="Offline activities"
											name="type"
										></el-checkbox>
										<el-checkbox
											label="Simple brand exposure"
											name="type"
										></el-checkbox>
									</el-checkbox-group>
								</div>
							</el-form-item>
						</div>
					</el-row>

					<el-row :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
						<div class="grid-content">
							<el-form-item>
								<div class="count-input">
									<span class="span-label"
										>Number of Bedrooms</span
									>
									<div>
										<el-input-number
											v-model="postForm.bedroomCount"
											:disabled="viewChoice === 'View'"
										></el-input-number>
									</div>
								</div>
								<div class="count-input">
									<span class="span-label"
										>Number of Bathroom</span
									>
									<div>
										<el-input-number
											v-model="postForm.bathroomCount"
											:disabled="viewChoice === 'View'"
										></el-input-number>
									</div>
								</div>
								<div class="count-input">
									<span class="span-label">
										Number of Parking Garage
									</span>
									<div>
										<el-input-number
											v-model="postForm.garage"
											:disabled="viewChoice === 'View'"
										></el-input-number>
									</div>
								</div>
							</el-form-item>
						</div>
					</el-row>

					<el-row :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
						<div class="grid-content">
							<el-form-item>
								<div>
									<span class="span-label">
										Property Location
									</span>
								</div>
								<div class="location-input">
									<el-input
										placeholder="Longitude"
										v-model="postForm.geoLocation.long"
										:disabled="viewChoice === 'View'"
									></el-input>
								</div>
								<div class="location-input">
									<el-input
										placeholder="Latitude"
										v-model="postForm.geoLocation.lat"
										:disabled="viewChoice === 'View'"
									></el-input>
								</div>
							</el-form-item>
						</div>
					</el-row>

					<el-row :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
						<div class="grid-content">
							<el-form-item>
								<div>
									<span class="span-label"
										>Property Type</span
									>
								</div>
								<div>
									<el-radio-group
										v-model="postForm.propertyType"
										:disabled="viewChoice === 'View'"
									>
										<div class="radio-container">
											<el-radio label="Type A" border >
												Type A
											</el-radio>
										</div>
										<div class="radio-container">
											<el-radio label="Type B" border
												>Type B</el-radio
											>
										</div>
										<div class="radio-container">
											<el-radio label="Type C" border
												>Type C</el-radio
											>
										</div>
										<div class="radio-container">
											<el-radio label="Type D" border
												>Type D</el-radio
											>
										</div>
									</el-radio-group>
								</div>
							</el-form-item>
						</div>
					</el-row>

					<el-row :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
						<div class="grid-content">
							<el-form-item>
								<div>
									<span class="span-label"
										>Property Status</span
									>
								</div>
								<div>
									<el-radio-group
										v-model="postForm.propertyStatus"
										:disabled="viewChoice === 'View'"
									>
										<div class="radio-container">
											<el-radio label="For Sale" border
												>For Sale</el-radio
											>
										</div>
										<div class="radio-container">
											<el-radio label="For Rent" border
												>For Rent</el-radio
											>
										</div>
									</el-radio-group>
								</div>
							</el-form-item>
						</div>
					</el-row>

					<el-row :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
						<div class="grid-content">
							<el-form-item>
								<div>
									<span class="span-label"
										>Property Furnishing</span
									>
								</div>
								<div>
									<el-radio-group
										v-model="postForm.furnishing"
										:disabled="viewChoice === 'View'"
									>
										<el-radio-button
											label="true"
										>Furnished</el-radio-button>
										<el-radio-button
											label="false"
										>Unfurnished</el-radio-button>
									</el-radio-group>
								</div>
							</el-form-item>
						</div>
					</el-row>

					<el-row :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
						<div class="grid-content">
							<el-form-item>
								<div>
									<span class="span-label"
										>Property Finishing</span
									>
								</div>
								<div>
									<el-radio-group
										v-model="postForm.finishing"
										:disabled="viewChoice === 'View'"
									>
										<el-radio-button
											label="true"
										>Finished</el-radio-button>
										<el-radio-button
											label="false"
										>Unfinished</el-radio-button>
									</el-radio-group>
								</div>
							</el-form-item>
						</div>
					</el-row>

					<el-row :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
						<div class="footer-container"></div>
					</el-row>
				</el-col>
			</div>
		</el-form>
	</div>
</template>

<script>
	import Upload from "@/components/Upload/ImageUpload3";
	import Sticky from "@/components/Sticky";
	import { createProperty, getProperty, updateProperty } from "@/api/property";

	const defaultForm = {
		id: "",
		propertyImages: [],
		description: "",
		pricing: 0,
		address: {
			region: "",
			city: "",
			subcity: "",
			kebele: "",
			houseNumber: "",
			areaName: "",
			propertyName: "",
			floorNumber: "",
		},
		area: 0,
		amenities: [],
		bedroomCount: 0,
		bathroomCount: 0,
		garage: 0,
		rooms: [],
		geoLocation: {
			long: 0,
			lat: 0,
		},
		propertyType: "",
		propertyStatus: "",
		furnishing: false,
		finishing: false,
		agentId: null,
		
	};
	const agent = {
			fullName: '',
			phone: '',
			email: ''
		}

	export default {
		name: "PropertyDetail",
		components: { Upload, Sticky },
		props: {
			viewChoice: {
				type: String,
			},
		},
		data() {
			return {
				postForm: Object.assign({}, defaultForm),
				loading: false,
				tempRoute: {},
				files: [],
				imageUrls: [],
				disabled: false,
				agent,
				removedImages: []
			};
		},
		created() {
			if (this.viewChoice === "Edit") {
				const id = this.$route.params && this.$route.params.id;
				this.tempRoute = Object.assign({}, this.$route);
				this.postForm.id = id;
				this.fetchData(id, this.tempRoute, 'Edit Property');
				
			} 
			if (this.viewChoice === "View") {
				this.disabled = true;
				const id = this.$route.params && this.$route.params.id;
				this.tempRoute = Object.assign({}, this.$route);
				this.fetchData(id, this.tempRoute, 'View Property');
			}
			if (this.viewChoice === "Create") {
				// this.postForm = this.defaultForm
			}

			this.tempRoute = Object.assign({}, this.$route);
		},
		methods: {
			fetchData(id, tempRoute, task) {
				getProperty(id).then(response => {
					this.postForm = response.data
					if (this.viewChoice === 'Edit') {
						this.postForm.agentId = response.data.agent.id;
					} else if (this.viewChoice === 'View') {
						this.agent = response.data.agent;
					}
					this.postForm.propertyImages = [];
					this.savedImages = response.data.images;
					response.data.images.forEach(image => {
						this.imageUrls.push(process.env.VUE_APP_STORAGE_API + image);
					})

					// set tagsView title
					this.setTagsViewTitle(tempRoute, task);

					// set page title
					this.setPageTitle(task);
				}).catch (err => {
					console.log('get property error: ', err);
				})
			},

			setTagsViewTitle(tempRoute, task) {
				const title = task;
				const route = Object.assign({}, tempRoute, {
					title: `${title}-${this.postForm.id}`,
				});
				this.$store.dispatch("tagsView/updateVisitedView", route);
			},
			setPageTitle(task) {
				const title = task;
				document.title = `${title} - ${this.postForm.id}`;
			},
			submitForm() {
				let data = new FormData();
				// console.log('propertyImages: ', this.postForm.propertyImages);
				this.postForm.propertyImages.forEach((item) => {
					data.append("propertyImages", item.file);
				});
				data.append("description", this.postForm.description);
				data.append("pricing", this.postForm.pricing);
				data.append("address_region", this.postForm.address.region);
				data.append("address_city", this.postForm.address.city);
				data.append("address_subcity", this.postForm.address.subcity);
				data.append("address_kebele", this.postForm.address.kebele);
				data.append("address_houseNumber", this.postForm.address.houseNumber);
				data.append("address_areaName", this.postForm.address.areaName);
				data.append("address_propertyName",	this.postForm.address.propertyName);
				data.append("address_floorNumber", this.postForm.address.floorNumber);
				data.append("area", this.postForm.area);
				this.postForm.amenities.forEach((item) => {
					data.append("amenities", item);
				});
				data.append("bedroomCount", this.postForm.bedroomCount);
				data.append("bathroomCount", this.postForm.bathroomCount);
				data.append("garage", this.postForm.garage);
				// console.log('rooms: ', this.postForm.rooms);
				if (this.postForm.rooms !== null) {
					this.postForm.rooms.forEach((item) => {
						data.append("rooms", item);
					});
				}
				data.append("geoLocation_long", this.postForm.geoLocation.long);
				data.append("geoLocation_lat", this.postForm.geoLocation.lat);
				data.append("propertyType", this.postForm.propertyType);
				data.append("propertyStatus", this.postForm.propertyStatus);
				data.append("furnishing", this.postForm.furnishing);
				data.append("finishing", this.postForm.finishing);
				data.append("agentId", this.postForm.agentId);
				this.removedImages.forEach( image => {
					data.append("removedImages", image)
				})
				
				// console.log('data: ', data)
				if (this.viewChoice === 'Create') {
					this.createProperty(data);
				} else if (this.viewChoice === 'Edit') {
					this.editProperty(this.postForm.id, data);
				}
			},
			createProperty(data) {
				createProperty(data)
					.then(() => {
						this.$notify({
							title: 'Success',
							message: "Create Successfully",
							type: 'success',
							duration: 2000
						})
						this.postForm = Object.assign({}, defaultForm);
						this.viewChoice = 'View';
					})
					.catch((err) => {
						console.log(err);
						this.$notify({
							title: 'Error',
							message: "Create Unsuccessful",
							type: 'error',
							duration: 2000
						})
					});
			},
			editProperty( id, data) {
				// console.log('property id: ', id);
				console.log('Data: ', data)
				updateProperty(id, data)
					.then(() => {

					})
					.catch(err => {
						console.log(err);
					})
			}
		},
	};
</script>

<style lang='scss' scoped>
.createPost-container {
	position: relative;

	.createPost-main-container {
		padding: 40px 45px 20px 50px;
	}
}

.el-row {
	padding-left: 20px;
	padding-right: 20px;
	border-radius: 4px;
	margin-top: 10px;
}

.grid-content {
	border-radius: 4px;
	display: block;
	display: inline-block;
	width: 100%;
	height: 100%;
}

.span-label {
	font-family: sans-serif;
	font-size: 14px;
	font-weight: bold;
	color: #606266;
}

.address-input {
	padding-left: 20px;
	padding-bottom: 10px;
	max-width: 300px;
	display: inline-block;
}

.count-input {
	padding-left: 30px;
	padding-bottom: 10px;
	display: inline-block;
}

.location-input {
	padding-left: 30px;
	padding-bottom: 10px;
	display: inline-block;
}

.radio-container {
	padding: 5px;
	display: inline-block;
}

.footer-container {
	height: 50px;	
}
.agent-container {
	padding: 20px;
	display: flex;
	display: inline-block;
	box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}
.agent-item {
	max-width: 230px; 
	padding-left: 10px;
	display: flex;
	display: inline-block;
}

</style>