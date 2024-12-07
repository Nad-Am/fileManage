<script lang="ts" setup>
import { ref, defineEmits } from 'vue'

import { useIdStore } from '@/stores/counter';

import { DoAxiosWithErro } from '@/api';

const emits = defineEmits(['change']);
const files = ref<File[]>([])
const IdStore = useIdStore();
const folderInput = ref<HTMLInputElement | null>(null)

// 触发文件夹选择器
const triggerFileSelect = () => {
  folderInput.value?.click()
}

// 处理文件夹内容
const handleFolderChange = (event: Event) => {
  const fileList = (event.target as HTMLInputElement).files
  if (!fileList) return
  files.value = Array.from(fileList) // 存储文件列表
  uploadFiles()
  const fileInput = event.target as HTMLInputElement
  fileInput.value = ''
}

// 上传文件到服务器
const uploadFiles = async () => {
  if (files.value.length === 0) {
    alert('No files to upload')
    return
  }

  const formData = new FormData()
  files.value.forEach((file) => {
    // 将文件路径和文件数据一起发送
    formData.append('file', file, file.webkitRelativePath)
  })
  let id = IdStore.getNow().id;
  id = id === -1 ? '' : id;
  formData.append('parentId',id);

  try {
    const response = await DoAxiosWithErro('/api/files/upload','post', formData,true)
    alert('Files uploaded successfully!')
    emits('change');
  } catch (error) {
    console.error('Upload failed:', error)
    alert('File upload failed.')
  }
}
</script>

<template>
  <div class="folder-upload">
    <el-button text @click="triggerFileSelect">上传文件夹</el-button>
    <input
      type="file"
      ref="folderInput"
      webkitdirectory
      multiple
      style="display: none"
      @change="handleFolderChange"
    />
  </div>
</template>

<style scoped>
.folder-upload {
  margin: 5px;
}
</style>
