<script setup>
import FileUp from '@/components/fileUorD/FileUp.vue';
import FilesUp from '@/components/fileUorD/FilesUp.vue';
import { useIdStore } from '@/stores/counter';
import { Delete, Download, Sort } from '@element-plus/icons-vue';

const emit = defineEmits(['handlecreat','StoreChange','MultyDelete','MultyMove','MultyDownload'])
const props = defineProps({
  isBulkOperation:{
    type:Boolean,
    default:true
  }
})
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
  <div>
    <!-- 上传，新建 -->
    <el-row v-show="!props.isBulkOperation" :gutter="20">
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
    <!-- 批量操作 -->
    <el-row :gutter="20" v-show="props.isBulkOperation">
      <el-col :span="3">
        <el-button plain :icon="Download" @click="emit('MultyDownload')" >下载</el-button>
      </el-col>
      <el-col :span="3">
        <el-button plain :icon="Delete" @click="emit('MultyDelete')">删除</el-button>
      </el-col>
      <el-col v-if="IdSotre.openNewFlied" :span="3">
        <el-button plain :icon="Sort" @click="emit('MultyMove')">移动</el-button>
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
  </div>
</template>