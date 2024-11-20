<template>
    <div class="login">
        <h3>登录</h3>
        <el-form ref="Login" :model="form" label-width="auto" style="max-width: 600px">
            <el-form-item label="昵称">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input v-model="form.password" type="password" autocomplete="off" />
            </el-form-item>
            <el-from-item class="button">
                <el-button @click="handleLogin" class="sub" type="primary" :loading="false">
                Submit
                </el-button>
            </el-from-item>
        </el-form>
        <div class="turn">还没有账号？请前往<el-link @click="handelturn" class="link" type="primary">注册</el-link></div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { useUserStore } from '@/stores/user';
import { reactive, defineEmits, ref } from 'vue'
  
  const Login = ref(null);
  // do not use same name with ref
  const form = reactive({
    name: '',
    password: undefined,
  })
  const emit = defineEmits(['turnLoR'])

  const handelturn = () => {
    emit('turnLoR','register')
  }

  const handleLogin = async () => {
    const userInfo = {email:form.name,password:form.password};
    const userstor = useUserStore();
    await userstor.login(userInfo);
    console.log(userstor.userToken);
    
  }

  </script>

  <style lang="less" scoped>
  .login{
    font-weight: bolder;
    text-shadow: 1px 1px 1px rgb(232, 230, 228);
    h3{
        font-size: 2rem;
        font-weight: bold;
        margin:2rem 0;
        text-align: center;
    }
    .button{
    margin: 3rem 0;
    display: flex;
    justify-content: center;
    }
    .sub{
        width:6rem;
        height: 2rem;
    }
    .turn{
      position: absolute;
      right: 1rem;
      bottom: 1rem;
    }
    .link{
      margin:0 0 5px 2px;
      font-size: 1rem;
    }
  }
  </style>