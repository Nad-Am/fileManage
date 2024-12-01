<script setup>
import { useRouter, useRoute } from 'vue-router';
import { DoAxios, DoAxiosWithErro} from '@/api';
import { reactive, ref, watch} from 'vue';  // 引入 watch
import ListCard from '@/components/ListCard.vue';
import ToolBar from '@/components/ToolBar.vue';
import { ElMessageBox } from 'element-plus';
import { menueTurn } from '@/utils/typeDefin';
import { useIdStore } from '@/stores/counter';

// 初始化数据
const recalling = ref(false);
const isloading = ref(true);
const isfetchmore = ref(false);
const router = useRouter();
const route = useRoute();
const IdStore = useIdStore();

const data = reactive([]);

// const Filetype = new Map([

// ])

// 新建文件夹
const buildNewfolder = () => {
  if (recalling.value) return;
  recalling.value = true;
}

// 退出新建文件夹
const quitBuild = () => {
  recalling.value = false;
}

const finishRecall = () => [
  
]

const handleMore = async () => {
  isfetchmore.value = true //开始请求
  const respon = await DoAxiosWithErro(
      '/api/files/listByMainType',
      'get',
      {mainType:'application',pageSize:15,pageNo:2},
      true
    )
  isfetchmore.value = false;
  data.push(...respon.data.list);
}

const handleChange = async () => {
  isloading.value = true;
  const respon = await DoAxiosWithErro(
    '/api/files/list',
    'post',
    {
      id:IdStore.getNow().id,
      isRoot:IdStore.getNow().id === '',
      pageNo:1,
      pageSize:10,
      isAsc:true,
      isDeleted:false},
    true
  )
  data.splice(0,data.length,...respon.data.list);
  isloading.value = false;
}

const fetchDelete = async (e) => {
  const formdata = new FormData();
  formdata.append('fileId',e)
  try{
    isloading.value = true;
    await DoAxiosWithErro('/api/files/recycle/delete','put',formdata,true);
    isloading.value = false;
    const index = data.findIndex(item => item.id === e);
    if (index !== -1) {
      data.splice(index, 1);
    }
  } catch(e) {
    console.log(e);
  }
  isloading.value = false;
}
const handleclicked = async (e) => {
    isloading.value = true
    try{
      if(!e.folder) {
        const respon = await DoAxiosWithErro(`/api/files/preview/${e.id}`,'get',{},true);
        console.log(respon)
        window.open(respon.data,'other')
      } else {
        data.splice(0,data.length)
        IdStore.pushId({id:e.id,name:e.name});
        const respon = await DoAxiosWithErro(
        '/api/files/list',
        'post',
        {id:e.id,isRoot:false,pageNo:1,pageSize:10,isAsc:true,isDeleted:false},
        true
      )
      data.splice(0,data.length,...respon.data.list);
      }
    } catch(e) {
        ElMessageBox.alert('登录过期请重新登录', e, {
        confirmButtonText: '确定',
      }).finally(() => {
        router.push('/');
      });
    }
    isloading.value = false;
}
// 使用 watch 监听路由的变化
watch(() => route.query.categoryId, async (newCategoryId) => {
  try {
    isloading.value = true; //开始加载
    data.length = 0;
    if([' ','all'].includes(newCategoryId)|| newCategoryId === undefined) {
      IdStore.cleareSotre();
      IdStore.pushId({id:'',name:'全部文件'})
      const respon = await DoAxiosWithErro(
      '/api/files/list',
      'post',
      {id:IdStore.getNow().id,isRoot:true,pageNo:1,pageSize:10,isAsc:true,isDeleted:false},
      true);
      data.splice(0, data.length, ...respon.data.list);
    } else {
      const respon = await DoAxiosWithErro(
      '/api/files/listByMainType',
      'get',
      {mainType:menueTurn(newCategoryId),pageSize:20,pageNo:1},
      true);
      data.splice(0, data.length, ...respon.data.list);
    }
  } catch (error) {
    ElMessageBox.alert('登录过期请重新登录', error, {
      confirmButtonText: '确定',
    }).finally(() => {
      router.push('/');
    });
  } finally {
    isloading.value = false; // 结束加载
  }
},{immediate:true});


</script>

<template>
  <div class="about">
    <el-row :gutter="0">
      <el-col :span="18">
        <ToolBar @handlecreat="buildNewfolder" @StoreChange="handleChange" />
      </el-col>
      <el-col :span="6">
        <el-input
          style="width: 240px"
          placeholder="Pick a date"
          prefix-icon="search"
        />
      </el-col> 
    </el-row>
    <div style="flex-grow: 1;">
      <ListCard
        v-loading="isloading"
        :detail="data" 
        :isfetching="isfetchmore"
        @handleRecalled="finishRecall"
        @hanlequit="quitBuild"
        @fetchMore="handleMore"
        @handleDelet="fetchDelete"
        @clicked="handleclicked"
        />
    </div>
    <!-- <FileDown></FileDown> -->
  </div>
</template>

<style scoped>
.about{
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
