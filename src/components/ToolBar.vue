<script setup>
import FileUp from '@/components/fileUorD/FileUp.vue';
// import FileDown from '@/components/FileDown.vue';
import FilesUp from '@/components/fileUorD/FilesUp.vue';
import { useIdStore } from '@/stores/counter';

const emit = defineEmits(['handlecreat','StoreChange'])
const IdSotre = useIdStore();
const handleCreat = () => {
    emit('handlecreat')
}
const handleTo = (index) => {
  if(index === IdSotre.index) {
    return
  }
  IdSotre.turnId(index);
  emit('StoreChange');
}
const StoreBack = () => {
  IdSotre.backword();
  emit('StoreChange');
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
                <FilesUp @change="emit('StoreChange')"></FilesUp>
              </el-dropdown-item>
              <el-dropdown-item>
                <FileUp @change="emit('StoreChange')"></FileUp>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="12" >
        <el-button v-if="IdSotre.openNewFlied" @click="handleCreat">新建文件夹</el-button>
      </el-col>
    </el-row>
    <el-row style="padding: 10px 0;">
      <el-col :span="18">
        <el-text
         @click="StoreBack"
         v-show="IdSotre.Idstack.length !== 1"
         style="cursor: pointer;"
        >
        返回上一级
        </el-text>
        <el-text
         style="padding: 0 5px; cursor: pointer;"
         type="primary" 
         v-for="(item, index) in IdSotre.Idstack"
         :key="item.id"
         @click="handleTo(index,item)"
         >
          {{ item.name }}
          <el-icon v-show="index !== IdSotre.Idstack.length - 1"><ArrowRight /></el-icon>
        </el-text>

      </el-col>
    </el-row>
</template>