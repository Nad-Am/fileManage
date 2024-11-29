<template>
    <input
    style="display: none;"
     type="file"
     ref="inputRef"
     @change="handlechange"
     multiple
    />
    <el-button text @click="handletrigger">上传文件</el-button>
</template>

<script setup>
import { ref } from 'vue';
import { DoAxios, DoAxiosWithErro } from '@/api';

const files = ref([]);
const inputRef = ref(null);

const formdata = new FormData();


const handletrigger = () => {
  inputRef.value?.click();
}

const handlechange = async () => {
  files.value = Array.from(inputRef.value.files);
  files.value = files.value.slice(-3);

  files.value.forEach(item => {
    formdata.append('file',item,item.webkitRelativePath);
  })

  formdata.append('parentId','');

  const data = await DoAxiosWithErro('/api/files/upload','post',formdata,true);
   console.log(data);
}


</script>
