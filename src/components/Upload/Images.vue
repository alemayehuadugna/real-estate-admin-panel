<template>
    <div>
        <el-upload
        action="http://BrockMK:7070/upload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleImageSuccess">
            <i class="el-icon-plus"></i>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>        
    </div>
</template>

<script>
    export default {
        name: 'ImageUpload',
        props: {
            value: Array
        },
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false
            };
        },
        computed: {
            imageUrl() {
                return this.value
            }
        },
        methods: {
            rmImages() {
                this.emitInput([])
            },
            emitInput(val) {
                this.$emit('input', val);
            },
            handleImageSuccess(file) {
                this.value.push(process.env.VUE_APP_STORAGE_SERVER + file.filename);
                this.emitInput(this.value)
            },            
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                
                this.dialogImageUrl = process.env.VUE_APP_STORAGE_SERVER + file.name;
                this.dialogVisible = true;
            },

        }
    }
</script>