<template>
	<el-form>
		<el-form-item label="Old Password">
			<el-input v-model="oldPassword" />
		</el-form-item>
		<el-form-item label="New Password">
			<el-input v-model="newPassword" />
		</el-form-item>
		<el-form-item label="Confirm New Password">
			<el-input v-model="confirmPassword" />
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submit">Change</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		name: "ChangePassword",
		props: {
			user: {
				type: Object,
				default: () => {
					return {
						id: ""
					};
				},
			},
		},
		data () {
			return {
				oldPassword: "",
				newPassword: "",
				confirmPassword: ""
			}
		},
		methods: {
			submit() {
				if (this.newPassword === this.confirmPassword) {
					this.$store.dispatch("user/changePassword", { id: this.user.id, password: this.newPassword })
						.then(() => {
							this.$message({
								message: "User password has been changed",
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
				} else {
					this.$message({
						message: "confirm your password correctly",
						type: "error",
						duration: 4 * 1000,
					});
				}
			},
		},
	};
</script>
