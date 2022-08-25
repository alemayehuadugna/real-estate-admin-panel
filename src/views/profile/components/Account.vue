<template>
	<el-form :model="user">
		<el-form-item label="First Name">
			<el-input v-model="user.firstName" />
		</el-form-item>
		<el-form-item label="Last Name">
			<el-input v-model="user.lastName" />
		</el-form-item>
		<el-form-item label="Email">
			<el-input v-model="user.email" />
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submit">Update</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		name: "Account",
		props: {
			user: {
				type: Object,
				default: () => {
					return {
						id: "",
						firstName: "",
						lastName: "",
						email: "",
						profilePicture: ""
					};
				},
			},
		},
		methods: {
			submit() {
				this.$store.dispatch("user/updateInfo", this.user)
					.then(() => {
						this.$message({
							message: "User information has been updated successfully",
							type: "success",
							duration: 4 * 1000,
						});
					}).catch ((error) => {
						this.$message({
							message: error,
							type: "error",
							duration: 4 * 1000,
						});						
					})
			},
		},
	};
</script>
