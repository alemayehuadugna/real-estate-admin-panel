<template>
	<div>
		<el-upload
			class="upload-demo"
			ref="upload"
			action="http://BrockMK:7070/upload"
            :on-preview="handlePreview"
			:auto-upload="false"
		>
			<el-button slot="trigger" size="small" type="primary"
				>select file</el-button
			>
			<el-button
				style="margin-left: 10px"
				size="small"
				type="success"
				@click="submitUpload"
				>upload to server</el-button
			>
			<div class="el-upload__tip" slot="tip">
				jpg/png files with a size less than 500kb
			</div>
		</el-upload>
	</div>
</template>
<script>
	export default {
		methods: {
			submitUpload() {
				this.$refs.upload.submit();
			},
		},
	};
</script>