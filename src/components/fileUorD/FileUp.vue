<template>
    <el-upload
      class="upload-demo"
      action="http://localhost:3000/upload-folder"
      :on-change="handleChange"
      :show-file-list="false"
      directory
      name="files"
    >
      <el-button text>上传文件</el-button>
    </el-upload>
  </template>
  <script lang="ts" setup>
  import { ref } from 'vue'
  
  import type { UploadProps, UploadUserFile } from 'element-plus'
  
  const fileList = ref<UploadUserFile[]>([])
  
  const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    fileList.value = fileList.value.slice(-3)
  }
  </script>