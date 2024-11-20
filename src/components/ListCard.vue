<script setup>
import { defineEmits, defineProps, ref, watch, reactive } from 'vue';

import * as Icons from '@element-plus/icons-vue'
const pro = defineProps({
    detail: {
        type: Array,
        required: true,
    },
});
const emits = defineEmits(['clicked','hanlequit','handleDelet','handleRecalled','handleLoad']);
const checkAll = ref(false);
const indeter = ref(false);
const scoll = ref(null)
const Iconname = {1:'Folder', 2:'Promotion', 3:'ChatSquare'}
const checkList = reactive(pro.detail.map(item => {
  return { ...item, check: false, hasmouse:false, typeIcon:Iconname[item.typ], isrecall:false}
}))


const handlenter = (e) => {
  e.hasmouse = true;
}
const handleLeave = (e) => {
  e.hasmouse = false
}
// 全选和取消全选的处理
const handleAll = () => {
  checkList.forEach(item => {
    item.check = checkAll.value;
  });
};

const handleclick = (e) => {
  emits('clicked',e)
  console.log("mainclick")
}

const handleRecall = (e) => {
  e.isrecall = false;
  console.log("colcick")
}

const handlequit = (e) =>{
    if(e.id === '') {
      emits('hanlequit')
    }
    e.isrecall = false
}

const handleDelet = (e)=> {
  emits('handleDelet',e)
}

const handleRecalled = (e) => {
  emits('handleRecalled',e)
}

const handleLoad = (e) => {
  emits('handleLoad',e);
}

const getIconComponent = (name) => {
  return Icons[name] || null
}

const scollTop = () => {
  if(scoll.value) {
    scoll.value.scrollTo({
      top:0,
      behavior:'smooth'
    })
  }
}

// 检测 checkList 的变化，并同步更新 checkAll 状态
watch(checkList, (newVal) => {
  checkAll.value =  newVal.every(item => item.check);
  indeter.value = newVal.some(i => i.check) && !checkAll.value;
},{deep:true});



watch(
  () => pro.detail,
  (newDetail) => {
    scollTop()
    checkList.splice(0, checkList.length, ...newDetail.map(item => ({
      ...item,
      check: false,
      hasmouse: false,
      typeIcon: Iconname[item.typ],
      isrecall: item.id === ''
    })));
  },
  { immediate: true, deep: true }
);

</script>

<template>
  <div>
    <el-row :gutter="10" style="padding: 10px; min-width: 700px;">
      <el-col :span="0.5">
        <el-checkbox
        :indeterminate="indeter"
          v-model="checkAll"
          @change="handleAll"
        >
        </el-checkbox>
      </el-col>
      <el-col :span="4">文件名</el-col>
      <el-col :span="6" style="padding-left: 100px; width: 100px;">修改时间</el-col>
      <el-col :span="4">类型</el-col>
      <el-col :span="4">大小</el-col>
    </el-row>

    <div ref="scoll" style="height: 75vh;overflow: auto;min-width: 700px; scrollbar-width: none;">
      <el-row 
        class="el-row-dom"
        v-for="(item, index) in checkList" :gutter="10" 
        :key="item.id || index" 
        @mouseenter="handlenter(item)" 
        @mouseleave="handleLeave(item)"
        style="margin-bottom: 5px; padding: 10px; min-width: 700px;"
      >
        <el-col :span="0.5">
            <el-checkbox v-model="item.check" :value="item.id"></el-checkbox>
        </el-col>
        <el-col :span="4">
          <el-row  @click="handleclick" v-show="!item.isrecall">
            <el-icon size="20" style="margin: 5px 5px;">
              <component :is="getIconComponent(item.typeIcon)"></component>
            </el-icon>
            <span style="font-size: large;line-height: 25px;" class="name">{{ item.name }}</span>
          </el-row>
          <el-row style="min-width: 270px;" v-show="item.isrecall">
            <el-icon size="20" style="margin: 5px 5px;">
              <component :is="getIconComponent(item.typeIcon)"></component>
            </el-icon>
            <el-input style="width: 60%;margin-right: 5px;"></el-input>
            <el-button @click="handleRecall(item)" type="success" circle icon="Check" size="small"></el-button>
            <el-button @click="handlequit(item)" type="danger" circle icon="Close" size="small"></el-button>
          </el-row>
        </el-col>
        <el-col v-show="!item.hasmouse || item.isrecall" :span="6" style="padding-left: 100px;">{{ item.modif }}</el-col>
        <el-col v-show="item.hasmouse && !item.isrecall" :span="6">
          <el-tooltip
            content="下载"
            effect="light"
            @click="handleLoad"
          >
            <el-icon style="margin:0 10px; cursor: pointer;" color="rgba(51, 191, 240)"><Download /></el-icon>
          </el-tooltip>
          <el-tooltip
            content="删除"
            effect="light"
            @click="handleDelet"
          >
            <el-icon style="margin:0 10px; cursor: pointer;" color="rgba(51, 191, 240)"><DeleteFilled /></el-icon>
          </el-tooltip>
          <el-tooltip
            content="重命名"
            effect="light"
            @click="handleRecalled"
          >
            <el-icon @click="item.isrecall = true" style="margin:0 10px; cursor: pointer;" color="rgba(51, 191, 240)"><RefreshLeft /></el-icon>
          </el-tooltip>
          <el-tooltip
            content="更多"
            effect="light"
          >
            <el-icon style="margin:0 10px; cursor: pointer;" color="rgba(51, 191, 240)"><MoreFilled /></el-icon>
          </el-tooltip>
        </el-col>
        <el-col :span="4">{{ item.typ }}</el-col>
        <el-col :span="4">{{ item.size }}</el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="less" scoped>
.el-row-dom:hover{
  background:rgb(241, 244, 244);
}
.name:hover{
  color: rgba(51, 191, 240);
}
</style>
