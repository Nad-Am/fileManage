<script setup>
import { ref, reactive, watch, defineEmits, defineProps } from 'vue';
import * as Icons from '@element-plus/icons-vue';
// import debounce from '@/utils/debounce';

const pro = defineProps({
    detail: {
        type: Array,
        required: true,
    },
    isfetching:{
      type:Boolean,
      default:false
    }
});
const emits = defineEmits(['clicked', 'hanlequit', 'handleDelet', 'handleRecalled', 'handleLoad','fetchMore']);
const checkAll = ref(false);
const indeter = ref(false);
const scoll = ref(null);

const Iconname = new Map([
  [0, 'Folder'],
  [2, 'Promotion'],
  [3, 'ChatSquare']
]);

const typeFile = new Map([
  [0, '文件夹'],
  [2, 'Promotion'],
  [3, 'ChatSquare']
]);


const checkList = reactive(
  pro.detail.map((item) => ({
    ...item,
    check: false,
    hasmouse: false,
    isrecall: false,
  }))
);

const handlenter = (e) => {
  e.hasmouse = true;
};
const handleLeave = (e) => {
  e.hasmouse = false;
};

// 全选和取消全选的处理
const handleAll = () => {
  checkList.forEach((item) => {
    item.check = checkAll.value;
  });
};

const handleclick = (e) => {
  emits('clicked', e);
};

const handleRecall = (e) => {
  emits('handleRecalled',e);
  e.isrecall = false;
};

const handlequit = (e) => {
  emits('hanlequit',e);
  e.isrecall = false;
};

const handleDelet = (e) => {
  emits('handleDelet', e);
  e.isrecall = false;
};

const handleRecalled = (e) => {
  e.isrecall = true
  emits('handleRecalled', e);
};

const handleLoad = (e) => {
  emits('handleLoad', e);
};

const getIconComponent = (categoryId) => {
  if(categoryId === 0) {
    return Icons['Folder'] || null;
  }
  if(categoryId < 6) {
    return Icons['Picture'] || null;
  }
  if(categoryId < 10) {
    return Icons['Headset'] || null;
  }
  if(categoryId < 14) {
    return Icons['VideoCamera']
  }
  if(categoryId < 23) {
    return Icons['Document'] || null
  }
  return Icons['Promotion'] || null;
};

const getType = (categoryId) => {
  if(categoryId === 0) {
    return '文件夹';
  }
  if(categoryId < 6) {
    return '图片';
  }
  if(categoryId < 10) {
    return '音频';
  }
  if(categoryId < 14) {
    return '视频'
  }
  if(categoryId < 23) {
    return '文档'
  }
  return '其他'
};

const scollTop = () => {
  if (scoll.value) {
    scoll.value.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
};

const handleMore = () => {
  if (!scoll.value) return;
  const scrollTop = scoll.value.scrollTop; // 当前滚动位置
  const scrollHeight = scoll.value.scrollHeight; // 滚动区域总高度
  const clientHeight = scoll.value.clientHeight; // 可视区域高度

  // 判断是否接近底部，触发加载更多
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    console.log('do more')
    emits('fetchMore',pro.detail.length);
  }
}

// const doMore = debounce(handleMore);


// 检测 checkList 的变化，并同步更新 checkAll 状态
watch(
  checkList,
  (newVal) => {
    checkAll.value = newVal.every((item) => item.check);
    indeter.value = newVal.some((i) => i.check) && !checkAll.value;
  },
  { deep: true }
);

watch(
  () => pro.detail,
  (newDetail) => {
    // scollTop();
    checkList.splice(
      0,
      checkList.length,
      ...newDetail.map((item) => ({
        ...item,
        check: false,
        hasmouse: false,
        isrecall: item.id === '',
      }))
    );
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
      <el-col :span="6" style="min-width: 270px; overflow: scroll; scrollbar-width: none;">文件名</el-col>
      <el-col :span="8" style="padding-left: 100px; min-width: 250px;">修改时间</el-col>
      <el-col :span="4">类型</el-col>
    </el-row>

    <div 
      ref="scoll" 
      @scroll="handleMore"
      style="height: 75vh;overflow: auto;min-width: 700px;scrollbar-width: none; "
    >
    <el-empty v-show="detail.length ===0" description="description" />
      <el-row 
        class="el-row-dom"
        v-for="(item, index) in checkList" 
        :gutter="10" 
        :key="item.id || index" 
        @mouseenter="handlenter(item)" 
        @mouseleave="handleLeave(item)"
        style="margin-bottom: 5px; padding: 10px; min-width: 700px;"
      >
        <el-col :span="0.5">
          <el-checkbox v-model="item.check" :value="item.id"></el-checkbox>
        </el-col>
        <el-col :span="6" style="min-width: 270px;">
          <el-row @click="handleclick(item)" v-show="!item.isrecall" style="flex-wrap: nowrap;">
            <el-icon size="20" style="margin: 5px 5px;">
              <component :is="getIconComponent(item.categoryId)"></component>
            </el-icon>
            <div style="min-width: 200px; white-space: nowrap; overflow: hidden;text-overflow: ellipsis" class="name">{{ item.name }}</div>
          </el-row>
          <el-row style="min-width: 270px;" v-show="item.isrecall">
            <el-icon size="20" style="margin: 5px 5px;">
              <component :is="getIconComponent(item.categoryId)"></component>
            </el-icon>
            <el-input style="width: 60%;margin-right: 5px;"></el-input>
            <el-button @click="handleRecall(item)" type="success" circle icon="Check" size="small"></el-button>
            <el-button @click="handlequit(item)" type="danger" circle icon="Close" size="small"></el-button>
          </el-row>
        </el-col>
        <el-col v-show="!item.hasmouse || item.isrecall" :span="8" style="padding-left: 100px; min-width: 250px;">{{ item.updatedTime }}</el-col>
        <el-col v-show="item.hasmouse && !item.isrecall" :span="8">
          <el-tooltip
            content="下载"
            effect="light"
          >
            <el-icon @click="handleLoad(item)" style="margin:0 10px; cursor: pointer;" color="rgba(51, 191, 240)"><Download /></el-icon>
          </el-tooltip>
          <el-tooltip
            content="删除"
            effect="light"
          >
            <el-icon @click="handleDelet(item.id)" style="margin:0 10px; cursor: pointer;" color="rgba(51, 191, 240)"><DeleteFilled /></el-icon>
          </el-tooltip>
          <el-tooltip
            content="重命名"
            effect="light"
          >
            <el-icon @click="handleRecalled(item)" style="margin:0 10px; cursor: pointer;" color="rgba(51, 191, 240)"><RefreshLeft /></el-icon>
          </el-tooltip>
          <el-tooltip
            content="更多"
            effect="light"
          >
            <el-icon style="margin:0 10px; cursor: pointer;" color="rgba(51, 191, 240)"><MoreFilled /></el-icon>
          </el-tooltip>
        </el-col>
        <el-col :span="4">{{ getType(item.categoryId) }}</el-col>
      </el-row>
      <div style="width: 100%; height: 30px;" v-loading="pro.isfetching"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.el-row-dom:hover{
  background: rgb(241, 244, 244);
}
.name:hover{
cursor: pointer;
  color: rgba(51, 191, 240);
}
</style>
