<script setup>
import { reactive,ref } from 'vue';
import { DoAxiosWithErro } from '@/api';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
    const userStore = useUserStore();
    const formRef = ref(null);
    const avatarSrc = ref(userStore.userInfo.avatar);
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
        oldpass:[{validator:validatePass,trigger:'change'}],
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
    if (!form) {
        return;
    }
    form.validate(async (valid) => {
        if (valid) {
            console.log("thatok")
            try {
                const formdata = new FormData();
                formdata.append('rawPassword',formInfo.oldpass)
                formdata.append('newPassword',formInfo.newpass)
                await DoAxiosWithErro('/api/users/password', 'put',formdata, true);
                ElMessage({
                    message:'修改成功',
                    typ:'success'
                })
            } catch (error) {
                console.error("请求失败：", error);
            } finally {
                form.resetFields();
            }
        } else {
            // 不显示控制台错误
            console.log("验证未通过");
        }
    });
};

const handleChangeAvatar = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.addEventListener('change', async (event) => {
        const file = event.target.files[0]; // 获取选择的文件
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            // 读取图片文件
            reader.readAsDataURL(file);

            // 上传文件到服务器（示例）
            const formData = new FormData();
            formData.append('isChange', true);
            formData.append('avatar', file);

            try {
                const respon = await DoAxiosWithErro('/api/users/avatar', 'post', formData, true);
                userStore.userInfo.avatar = respon.data; // 更新全局状态
                avatarSrc.value = respon.data; // 同步更新头像 URL
                console.log("头像更新成功",avatarSrc);
            } catch (error) {
                console.error("头像更新失败", error);
            }
        } else {
            alert('请选择一个有效的图片文件');
        }
    });
    input.click(); // 触发文件选择
};



</script>
<template>
    <div>
        <div style="height: 100px; width: 100px;">
            <el-avatar
                :size="80"
                :src="avatarSrc"
            />
            <el-dropdown class="custom-dropdown">
                <span>修改头像</span>
                <template #dropdown>
                    <el-dropdown-item @click="handleChangeAvatar">上传图片</el-dropdown-item>
                </template>
            </el-dropdown>
        </div>
        <div style="padding: 10px 0; font-weight: bold;">修改密码:</div>
        <el-form
            ref="formRef"
            :model="formInfo"
            :rules="rule"
            style="width: 70%;"
        >
        <el-input autocomplete="off" type="password" aria-hidden="true" style="display: none;"></el-input>
            <el-form-item label="旧密码" prop="oldpass">
                <el-input placeholder="旧密码" autocomplete="off" type="password" show-password v-model="formInfo.oldpass"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newpass">
                <el-input placeholder="请输入新密码" name="newpass" autocomplete="off" type="password" show-password v-model="formInfo.newpass"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleconfirm">确认修改</el-button>
                <el-button @click="hanlecancle">取消修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style lang="less" scoped>
.custom-dropdown{
  border: 0;
  outline: none;
  --el-dropdown-menu-focus-border-color: transparent;
}
</style>
