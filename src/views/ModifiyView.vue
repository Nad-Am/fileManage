<script setup>
import { reactive,ref } from 'vue';
import debounce from '@/utils/debounce';

    const formRef = ref(null);
    const formInfo = reactive({
        newpass:'',
        oldpass:''
    })

    const validatePass = (rule, value, callback) => {
        const reg = /^(?=.*[a-zA-Z])(?=.*[\d])[a-zA-Z\d]{6,10}$/;
        if (value === '') {
            return callback(new Error('Please input the password'));
        }
        if (!reg.test(value)) {
            return callback(new Error("密码是至少各包含一个数字和英文的8位字符串"));
        }
        callback();
    };


    const rule = reactive({
        oldpass:[{validator:debounce(validatePass),trigger:'change'}],
        newpass:[{validator:validatePass,trigger:'change'}]
    })

    const hanlecancle = () => {
        const form = formRef.value;
        if(form) {
            form.resetFields();
        }
    }
    const handleconfirm = () => {
        const form = formRef.value;
        form.validate((valid) => {
            if(valid) {
                console.log('ok',formInfo);
                form.resetFields();
            } else {
                console.log("sorry");
            }
        })
    }

</script>
<template>
    <div>
        <div style="height: 100px; width: 100px;">
        <el-avatar
            :size="80"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        </div>
        <el-form
            ref="formRef"
            :model="formInfo"
            :rules="rule"
            style="width: 70%;"
        >
            <el-form-item label="旧密码" prop="oldpass">
                <input type="password" show-password v-model="formInfo.oldpass"></input>
            </el-form-item>
            <el-form-item label="新密码" prop="newpass">
                <el-input autocomplete="off" type="password" show-password v-model="formInfo.newpass"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleconfirm">确认修改</el-button>
                <el-button @click="hanlecancle">取消修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>