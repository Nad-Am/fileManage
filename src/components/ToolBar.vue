<script setup>
import FileUp from '@/components/fileUorD/FileUp.vue';
// import FileDown from '@/components/FileDown.vue';
import FilesUp from '@/components/fileUorD/FilesUp.vue';

const emit = defineEmits(['handlecreat'])

const handleCreat = () => {
    emit('handlecreat')
    console.log('ko')
}
</script>
<template>
    <el-row :gutter="20">
        <el-col :span="6">
        <el-dropdown>
          <el-button type="primary">上传</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <FilesUp></FilesUp>
              </el-dropdown-item>
              <el-dropdown-item>
                <FileUp></FileUp>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="12" >
        <el-button @click="handleCreat">新建文件夹</el-button>
      </el-col>
    </el-row>
</template>