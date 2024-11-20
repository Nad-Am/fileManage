<template>
  <div class="login">
      <h3>注册</h3>
      <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item label="name" prop="name">
        <el-input v-model="ruleForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Password" prop="pass">
        <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Confirm" prop="checkPass">
        <el-input
          v-model="ruleForm.checkPass"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="email" prop="email">
        <el-input v-model="ruleForm.email" autocomplete="off" />
      </el-form-item>
      <el-form-item class="checkcode" label="checkcode" prop="checkcode">
        <el-input class="code"  v-model="ruleForm.checkcode" autocomplete="off" />
        <el-button class="but" @click="sendMessage" :disabled="sendButton.disable">{{ sendButton.value }}</el-button>
      </el-form-item>
      <el-form-item class="sub">
        <el-button type="primary" @click="submitForm">
          Submit
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      </el-form-item>
    </el-form>
    <div class="turn">已有账号，请前往<el-link @click="handleturn" class="link" type="primary">登录</el-link></div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref , defineEmits} from 'vue'
//   import { FormInstance, FormRules } from 'element-plus' // 不需要类型导入

const ruleFormRef = ref('')

const sendButton = reactive({
  value:"发送请求",
  refresh:0,
  disable:false
})

const ruleForm = reactive({
  pass: '',
  checkPass: '',
  age: '',
  name:'',
  email:'',
  checkcode:''
})
const emit = defineEmits(["turnLoR"])

const handleturn = () => {
  emit('turnLoR','login');
}

const hadleSend = async () => {
  const fromData = new FormData();
  fromData.append('to',ruleForm.email)
  const response = await axios.post('/api/users/email',fromData);
  console.log(response);   
} 

const checkName = (rule,value,callback) => {
  if(!value) {
   return callback(new Error("请输入昵称"))
  }
  callback();
}

const checkEmail = (rule,value, callback)=> {
  const reg = /^[0-9A-Za-z._%]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/
  if(!value) {
    return callback(new Error("请输入绑定邮箱"))
  } else {
    if(!reg.test(value)){
     return callback(new Error("请输入正确的邮箱地址"))
    }
  }
  callback();
}

const checkCode = (rule,value,callback) => {
  if(value === '') {
    return callback(new Error("请输入验证码"))
  }
  callback();
}

const validatePass = (rule, value, callback) => {
  console.log('Password value:', value);  // 调试日志
  const reg = /^(?=.*[a-zA-Z])(?=.*[\d])[a-zA-Z\d]{6,10}$/;
  if (value === '') {
    return callback(new Error('Please input the password'));
  }
  if (!reg.test(value)) {
    return callback(new Error("密码是至少各包含一个数字和英文的8位字符串"));
  }
  if (ruleForm.checkPass !== '') {
    ruleFormRef.value?.validateField("checkPass");
  }
  callback();
};


const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}



const rules = reactive({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  name: [{validator: checkName, trigger:"blur"}],
  email:[{validator:checkEmail,trigger:"blur"}],
  checkcode:[{validator:checkCode,trigger:'blur'}]
})

const submitForm = () => {
  console.log("tiger")
  const formEl = ruleFormRef.value;
  if (!formEl) {
    console.log("undefind is err");
    return;
  }
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      console.log(ruleForm);
    } else {
      console.log('error submit!')
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

const sendMessage = () => {
    const formEl = ruleFormRef.value;
    formEl.validateField('email',(valtor) => {
      if(valtor) {
        console.log("send Message");
        hadleSend();
      } else{
        console.log("not exist email")
      }
    })
}
</script>


<style lang="less" scoped>
@import "../assets/var.less";
.login{
  font-weight: bolder;
  text-shadow: 1px 1px 1px rgb(232, 230, 228);
  h3{
      font-size: 2rem;
      font-weight: bold;
      margin:0.5rem 0 1rem 0;
      text-align: center;
  }
  .sub{
    padding:0.5rem 32%;
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
  .checkcode{
    .but{
      position: absolute;
      right: 6rem;
    }
    .code{
      width: 200px;
    }
  }
}
</style>