<script setup>
import Menue from '@/components/MeNue.vue';
import { RouterView , RouterLink} from 'vue-router';
import { Search } from '@element-plus/icons-vue'

</script>

<template>
  <div class="common-layout">
    <el-container class="el-con">
      <el-header>
        <el-row>
          <el-col :span="1" style="margin: 10px 0;">
            <el-avatar
              :size="40"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
          </el-col>
          <el-col :span="3">name</el-col>
          <el-col :span="3">
            <el-button type="primary" style="margin:10px 0">退出登录</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-container>
          <el-aside width="250px">
            <Menue></Menue>
          </el-aside>
          <el-main style="width: 85vh; min-width: 500px; scrollbar-width: none;">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>
<style lang="less" scoped>
@import "@/assets/var.less";
.common-layout{
  width: 100vw;
}
.el-con .el-header{
  border-bottom:2px solid @fromBg;
}
  
</style>