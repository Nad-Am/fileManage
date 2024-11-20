<script setup>
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router';
import { ref, watch } from 'vue';  // 引入 watch
import ListCard from '@/components/ListCard.vue';
import ToolBar from '@/components/ToolBar.vue';
import FileDown from '@/components/fileUorD/FileDown.vue';

// 初始化数据
const recalling = ref(false);
const route = useRoute();
const router = useRouter();

const data = ref([  // 默认数据
  { name: "yes", typ: 1, size: 21, modif: '2002.12.2', id: 'ac' },
  { name: "yes", typ: 2, size: 1, modif: '2002.12.3', id: 'bc' },
  { name: "main", typ: 3, size: 201, modif: '2002.12.4', id: 'cc' },
]);

const newlist = { name: "", typ: "1", size: 201, modif: '2002.12.4', id: '' };

// mock 数据
const mockdata = {
  1: [
    { name: "y", typ: 1, size: 21, modif: '2002.12.2', id: 'ac' },
    { name: "yes", typ: 2, size: 1, modif: '2002.12.3', id: 'bc' },
    { name: "maikmsk1n", typ: '1', size: 201, modif: '2002.12.4', id: 'cc' },
    { name: "yepamskm", typ: 1, size: 21, modif: '2002.12.2', id: 'ac' },
    { name: "yedsmk1", typ: 2, size: 1, modif: '2002.12.3', id: 'bc' },
    { name: "main", typ: 3, size: 201, modif: '2002.12.4', id: 'cc' },
    { name: "yepamskm", typ: 1, size: 21, modif: '2002.12.2', id: 'ac' },
    { name: "yedsmk1", typ: 2, size: 1, modif: '2002.12.3', id: 'bc' },
    { name: "main", typ: 3, size: 201, modif: '2002.12.4', id: 'cc' },
    { name: "yepamskm", typ: 1, size: 21, modif: '2002.12.2', id: 'ac' },
    { name: "yedsmk1", typ: 2, size: 1, modif: '2002.12.3', id: 'bc' },
    { name: "main", typ: 3, size: 201, modif: '2002.12.4', id: 'cc' },
    { name: "yepamskm", typ: 1, size: 21, modif: '2002.12.2', id: 'ac' },
    { name: "yedsmk1", typ: 2, size: 1, modif: '2002.12.3', id: 'bc' },
    { name: "main", typ: 3, size: 201, modif: '2002.12.4', id: 'cc' },
    { name: "yepamskm", typ: 1, size: 21, modif: '2002.12.2', id: 'ac' },
    { name: "yedsmk1", typ: 2, size: 1, modif: '2002.12.3', id: 'bc' },
    { name: "main", typ: 3, size: 201, modif: '2002.12.4', id: 'cc' },
  ],
  6: [
    { name: "yepamskm", typ: 1, size: 21, modif: '2002.12.2', id: 'ac' },
    { name: "yedsmk1", typ: 2, size: 1, modif: '2002.12.3', id: 'bc' },
    { name: "main", typ: 3, size: 201, modif: '2002.12.4', id: 'cc' },
  ]
}

// 新建文件夹
const buildNewfolder = () => {
  if (recalling.value) return;
  recalling.value = true;
  data.value = [{ ...newlist }, ...data.value];
}

// 退出新建文件夹
const quitBuild = () => {
  data.value.shift();
  recalling.value = false;
}

// 使用 watch 监听路由的变化
watch(() => route.query.categoryId, (newCategoryId) => {
  console.log("tigger");
  // if(!newCategoryId) {
  //   return
  // }
  if (mockdata[newCategoryId]) {
    setTimeout(() => {
      data.value = mockdata[newCategoryId]; 
    }, 1000);
  } else {
    data.value = [];  
  }
}, { immediate: true });  
</script>

<template>
  <div class="about">
    <el-row :gutter="0">
      <el-col :span="18">
        <ToolBar @handlecreat="buildNewfolder" />
      </el-col>
      <el-col :span="6">
        <el-input
          style="width: 240px"
          placeholder="Pick a date"
          prefix-icon="search"
        />
      </el-col>
    </el-row>
    <div style="flex-grow: 1;">
      <ListCard :detail="data" @hanlequit="quitBuild" />
    </div>
    <FileDown></FileDown>
  </div>
</template>

<style scoped>
.about{
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
