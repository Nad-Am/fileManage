<template>
  <el-col :span="15">
    <h3 class="mb-2">home</h3>
    <el-menu
      v-model:default-active="activeMenu"
      class="el-menu-vertical-demo"
      router
      @open="handleOpen"
      @close="handleClose"
      style="height: 80vh;"
    >
      <el-sub-menu :index="'all'">
        <template #title>
          <el-icon><location /></el-icon>
          <span>我的文件</span>
        </template>
        <el-menu-item index="0" @click="handleOpen">全部</el-menu-item>
        <el-menu-item index="about" @click="goToAbout('about')">图片</el-menu-item>
        <el-menu-item index="1" @click="goToAbout('1')">文档</el-menu-item>
        <el-menu-item index="6" @click="goToAbout('6')">视频</el-menu-item>
        <el-menu-item index="14" @click="goToAbout('14')">音频</el-menu-item>
        <el-menu-item index="23" @click="goToAbout('23')">其他</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="delete" :route="{name:'delete'}">
        <el-icon><icon-menu /></el-icon>
        <span>回收站</span>
      </el-menu-item>
    </el-menu>
  </el-col>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const route = useRoute()
const activeMenu = ref(route.query.categoryId || 'all');

// 点击菜单项时，跳转并传递 categoryId
const goToAbout = (categoryId) => {
  router.push({ name: 'about', query: { categoryId } });
  activeMenu.value = categoryId;
}

const handleOpen = () => {
  router.push({ name: 'about', query: { categoryId:0,path:"ijasij"} });
}

const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
}
</script>
