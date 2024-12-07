
<script setup>
import { ref,defineEmits } from 'vue';
import { DoAxiosWithErro } from '@/api';
import { useIdStore } from '@/stores/counter';

const files = ref([]);
const emits = defineEmits(['change']);
const inputRef = ref(null);
const IdStore = useIdStore();

const formdata = new FormData();


const handletrigger = () => {
  inputRef.value?.click();
}

const handlechange = async () => {
  files.value = Array.from(inputRef.value.files);
  files.value = files.value.slice(-3);

  files.value.forEach(item => {
    formdata.append('file',item,item.name);
  })

  formdata.append('parentId',IdStore.getNow().id);

  await DoAxiosWithErro('/api/files/upload','post',formdata,true);
  emits('change');
}
</script>

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

