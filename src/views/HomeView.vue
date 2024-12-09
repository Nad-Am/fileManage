<script setup>
import Menue from '@/components/MeNue.vue';
import { useRouter} from 'vue-router';
import { useUserStore } from '@/stores/user';
import { ElMessageBox, ElMessage } from 'element-plus';

const userStore = useUserStore();
const router = useRouter();

const logout = () => {
  ElMessageBox.alert('确定退出登录吗','退出',{
    confirmButtonText:"OK"
  }).then(async ()=> {
    await userStore.logout();
    ElMessage({
      message:'退出登录成功',
      type:'success'
    })
    router.push('/');
  })
}

</script>

<template>
  <div class="common-layout">
    <el-container style="min-width: 1300px;" class="el-con">
      <el-header>
        <el-row>
          <el-col :span="0.5" style="margin: auto">
            <el-avatar
              :size="50"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
          </el-col>
          <el-col :span="20" style="margin: auto 0; font-weight: bolder;">{{ userStore.useInfo.username }}</el-col>
          <el-col :span="2" style="margin:auto">
            <el-button type="primary" @click="logout">退出登录</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-container>
          <el-aside width="250px">
            <Menue></Menue>
          </el-aside>
          <el-main style="width: 85vh;padding: 0;scrollbar-width: none;">
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