<template>
	<div class="file-container">
        <div class="file-input">
            <input
                type="file"
                ref="file"
                id="demo-file"
                @change="onSelect"
            />
        </div>
        <div class="main-image-container">
            <div v-if="imageUrls.length == 0" class="container">
                <div class="image-container">
                    <span class="svg-container">
                        <svg-icon
                            icon-class="image"
                            style="width: 50px; height: 50px"
                        />
                    </span>
                </div>
            </div>

            <div class="container" v-else v-for="item in imageUrls.length" :key="item">
                <div class="image-container">
                    <el-image
                        style="width: 120px; height: 120px"
                        :src="imageUrls[item - 1]"
                        fit="cover"
                        :preview-src-list="imageUrls"
                    ></el-image>
                </div>
				<el-button type="text" @click="handleRemove(imageUrls[item-1])">Remove</el-button>
            </div>
        </div>
	</div>
</template>

<script>

	export default {
		name: "FileUpload",
		props: {
			value: Array,
			urls: Array,
			removedImages: Array
		},
		data() {
			return {
				file: "",
				message: "",
				imageUrls: [],
				files: []
			};
		},
		created() {
			// console.log('urls: ', this.urls)
			this.imageUrls = this.urls;
		},
		methods: {
			emitInput(val) {
				this.$emit("input", val);
			},
			onSelect() {
				const file = this.$refs.file.files[0];
				this.file = file;
				this.url = URL.createObjectURL(file);
				this.imageUrls.push(this.url);
				this.files.push({file:this.file, url: this.url});
				this.emitInput(this.files);
			},
			onSubmit() {

			},
			handleRemove(url) {				
				if (url.includes(process.env.VUE_APP_STORAGE_API)) {
					// console.log('url from remote storage')
					var urlIndex = this.imageUrls.indexOf(url);
					this.imageUrls.splice(urlIndex, 1);
					let removedImage = url.replace(process.env.VUE_APP_STORAGE_API, '');
					console.log('removed image: ', removedImage);
					this.removedImages.push(removedImage);
					console.log('removedImages: ', this.removedImages)
				} else {
					// console.log('url from local storage')
					// console.log('local url: ', url);	
					let localFileIndex = -1;
					for (let i=0; i<this.files.length; i++) {
						if(this.files[i].url === url) {
							localFileIndex = i;
							break;
						}
					}
					// console.log('LocalFileIndex: ', localFileIndex);
					if (localFileIndex !== -1) {
						this.files.splice(localFileIndex, 1);
						// console.log('files: ', this.files);
					}
					let localFileUrl = this.imageUrls.indexOf(url);
					this.imageUrls.splice(localFileUrl, 1);
					// console.log('localFileUrl: ', localFileUrl);
				}


			}
		},
	};
</script>

<style scoped>
.file-container{
    display: fle;
}
.container {
	display: flex;
	display: inline-block;
	padding: 4px;
	width: 120px;
	height: 120px;
}
.image-container {
	text-align: center;
	display: flex;
	align-items: center;
	width: 100%;
	height: 100%;
}
.main-image-container {
	padding: 10px;
	display: flex;
	display: inline-block;
	box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
}

.svg-container {
	/* color: $dark_gray; */
	align-items: center;
	vertical-align: middle;
	align-items: center;
	color: #95989d;
	width: 50px;
	height: 50px;
	margin: 0 auto;
}
#demo-file::file-selector-button {
	border: 2px solid #555555;
	color: #555555;
	padding: 8px;
	border-radius: 4px;
    margin-bottom: 10px;
	background-color: #ffffff;
}

#demo-file::file-selector-button:hover {
	background-color: #e9e9e9;
}

#demo-file::-webkit-file-upload-button {
	border: 2px solid #555555;
	color: #555555;
	padding: 8px;
	border-radius: 4px;
	background-color: #ffffff;
}

#demo-file::-webkit-file-upload-button:hover {
	background-color: #e9e9e9;
}
</style>