<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    iframSrc:{
        type:String,
        required:true
    }
})

const emits = defineEmits(['quite']);

</script>
<template>
    <div class="main">
      <el-row class="nave">
        <el-col style="margin: 5px;" :span="22">文件预览</el-col>
        <el-col @click="emits('quite')" style="margin: 5px;" :span="1">
            <el-icon><CloseBold /></el-icon>
        </el-col>
      </el-row>
      <iframe
       class="ifra"
       frameborder="0"
       :src="props.iframSrc"
      ></iframe>
    </div>
</template>
<style lang="less" scoped>
    .main{
        border-radius: 1%;
        background: white;
        padding: 10px;
        width: 800px;
        height: 500px;
        overflow: hidden;
    }
    .ifra{
        width: 103%;
        height: 100%;
        border: 0;
        overflow: hidden;
        scrollbar-width: none;
    }
</style>
