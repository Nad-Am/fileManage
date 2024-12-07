<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, watch } from 'vue';

const router = useRouter();
const route = useRoute();

// 初始化 activeMenu 为路由中的 categoryId 或默认值 '0'
const activeMenu = ref(route.query.categoryId || 'all');

// 使用 watch 监听路由变化，动态更新 activeMenu
watch(() => route.query.categoryId, (newCategoryId) => {
  activeMenu.value = newCategoryId;
});

// 点击菜单项时，跳转并传递 categoryId
const goToAbout = (categoryId) => {
  router.push({ name: 'about', query: { categoryId } });
  activeMenu.value = categoryId;
  // console.log('open the:',activeMenu.value)
}

</script>

<template>
  <el-col :span="15">
    <h3 class="mb-2">home</h3>
    <el-menu
      v-model:default-active="activeMenu"
      class="el-menu-vertical-demo"
      style="height: 80vh;"
      :router="true"
      
    >
      <el-sub-menu :index="'all'">
        <template #title>
          <el-icon><location /></el-icon>
          <span>我的文件</span>
        </template>
        <el-menu-item :index="'all'" @click="goToAbout('all')">全部</el-menu-item>
        <el-menu-item :index="'5'" @click="goToAbout('5')">图片</el-menu-item>
        <el-menu-item :index="'22'" @click="goToAbout('22')">文档</el-menu-item>
        <el-menu-item :index="'9'" @click="goToAbout('9')">音频</el-menu-item>
        <el-menu-item :index="'13'" @click="goToAbout('13')">视频</el-menu-item>
        <el-menu-item :index="'100'" @click="goToAbout('100')">其他</el-menu-item>
      </el-sub-menu>
      <el-menu-item :index="'delete'" :route="{path:'/home/delete' }">
        <el-icon><WindPower /></el-icon>
        <span>回收站</span>
      </el-menu-item>
      <el-menu-item :index="'modify'" :route="{path:'/home/modify'}">
        <el-icon><Tools /></el-icon>
        <span>账户设置</span>
      </el-menu-item>
    </el-menu>
  </el-col>
</template>
