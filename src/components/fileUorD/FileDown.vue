<template>
  <div>
    <el-input v-model="filename" placeholder="Enter filename to download" style="margin-bottom: 10px;" />
    <el-button type="primary" @click="downloadFile">Download File</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDownloadFile } from '@/utils/useDownLoadFile'; // 引入公用函数

const filename = ref('example.pdf');
const downloadUrl = 'http://localhost:3000/download'; // 下载地址

const downloadFile = () => {
  useDownloadFile(filename.value, downloadUrl); // 调用公用函数
};
</script>
