<script setup>

import ListCard from '@/components/ListCard.vue';
import ToolBar from '@/components/ToolBar.vue';
import MoveFile from '@/components/MoveFile.vue';
import PreView from '@/components/PreView.vue';
import ProgressBar from '@/components/ProgressBar.vue';

import { useRouter, useRoute } from 'vue-router';
import {  DoAxiosWithErro} from '@/api';
import { reactive, ref, watch} from 'vue';  // 引入 watch
import { ElMessage, ElMessageBox } from 'element-plus';
import { catrgoryConfig } from '@/utils/typeDefin';
import { useIdStore } from '@/stores/counter';
import { useDownloadFile } from '@/utils/useDownLoadFile';

// 初始化数据
const iframSrc = ref('');
const nowCategoryId = ref('');
const pageSize = 12;
const search = ref('');
const total = ref(0);
const pageNo = ref(1);
const MultyList = reactive([]);
const progress = ref(0);

const recalling = ref(false);
const isloading = ref(true);
const isfetchmore = ref(false);
const isBulk = ref(false);
const isMoveFile = ref(false);
const isDownloading = ref(false);

const router = useRouter();
const route = useRoute();
const IdStore = useIdStore();

const data = reactive([]);

const getConfig = (categoryId,id = '') => {
  const mainType = catrgoryConfig(categoryId).mainType;
    let axiosBody;
    if(!mainType) {
      axiosBody = {id,isRoot:id === '',isAsc:true,isDeleted:false,pageNo:pageNo.value,pageSize};
    } else {
      axiosBody ={mainType,pageNo:pageNo.value,pageSize};
    }
    return catrgoryConfig(categoryId,axiosBody).axiosConfig;
}

const initList = async (newCategoryId) => {
  if(newCategoryId === '-1') {
    if(route.query.search){
      console.log('search')
      handlesearch(route.query.search);
    }
    isloading.value = false;
    return
  }
  try {
    IdStore.openNewFlied = false;
    if(!newCategoryId || ['','all'].includes(newCategoryId)) {
      IdStore.openNewFlied =true;
    }
    pageNo.value = 1;
    nowCategoryId.value = newCategoryId;
    isloading.value = true; //开始加载
    IdStore.cleareSotre();
    IdStore.pushId({id:'',name:'全部文件'})
    const config = getConfig(newCategoryId);
    const respon = await DoAxiosWithErro(...config);

    total.value = respon.data.total;
    data.splice(0,data.length,...respon.data.list);
  } catch (error) {
    ElMessageBox.alert('登录过期请重新登录', error, {
      confirmButtonText: '确定',
    }).finally(() => {
      router.push('/');
    });
  } finally {
    isloading.value = false; // 结束加载
  }
}

const handlesearch = async (name) => {
  if(!name) {
    ElMessage({
      message:'搜索内容不能为空',
      type:'warning'
    })
    return
  }
  IdStore.openNewFlied = false;
  IdStore.cleareSotre();
  IdStore.pushId({id:-1,name:`搜索：${name}`,value:name})
  router.push({
    path:route.path,
    query:{
      categoryId:-1,
      search:name
    }
  })
  const respon = await DoAxiosWithErro('/api/files/search','post',{
    pageNo:pageNo.value,
    pageSize,
    isAsc:true,
    fileName:name
  },true)
  total.value = respon.data.total;
  data.splice(0,data.length,...respon.data.list);
  search.value = '';
}

// 新建文件夹
const buildNewfolder = () => {
  if (recalling.value) return;
  data.unshift({
    id:-1,
    categoryId:0,
  })
  recalling.value = true;
}

// 退出新建文件夹
const quitBuild = (e) => {
  if(e.id === -1){
    // const index = data.findIndex(item => item.id === -1)
    data.splice(0,1);
    recalling.value = false 
  }
}

const finishRecall = async (e,name) => {
  if(e.id === -1) {
    try{
      const fordata = new FormData()
      fordata.append('parentId',IdStore.getNow().id)
      fordata.append('folderName',name)
      await DoAxiosWithErro('/api/files/create','post',fordata,true)
      handleChange();
    } catch{
      data.splice(0,1);
    } finally{
      recalling.value = true;
    }
  } else {
      const formdata = new FormData();
      formdata.append('fileId',e.id);
      formdata.append('newFileName',name);
      await DoAxiosWithErro('/api/files/rename','put',formdata,true);
      handleChange();
  }
}

const handleMore = async (length) => {
  if(length >= total.value) {
    return;
  }
  pageNo.value = length/pageSize + 1;
  isfetchmore.value = true //开始请求
  if(IdStore.getNow().id === -1) {
    const respon = await DoAxiosWithErro('/api/files/search','post',{
      pageNo:pageNo.value,
      pageSize,
      isAsc:true,
      fileName:name
    },true)
    isfetchmore.value = false;
    data.push(...respon.data.list);
    return
  }
  const config = getConfig(nowCategoryId.value,IdStore.getNow().id);
  const respon = await DoAxiosWithErro(...config);
  isfetchmore.value = false;
  data.push(...respon.data.list);
}

const handleChange = async () => {
  isloading.value = true;
  const id = IdStore.getNow().id;
  if(id === -1) {
    handlesearch(IdStore.getNow().value);
  }
  const respon = await DoAxiosWithErro(
    '/api/files/list',
    'post',
    {
      id,
      isRoot:id === '',
      pageNo:1,
      pageSize,
      isAsc:true,
      isDeleted:false},
    true
  )
  total.value = respon.data.total;
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
    pageNo.value = 1;
    isloading.value = true
    try{
      if(!e.folder) {
        const respon = await DoAxiosWithErro(`/api/files/preview/${e.id}`,'get',{},true);
        window.open(respon.data,'other')
        // iframSrc.value = respon.data;
      } else {
        data.splice(0,data.length)
        IdStore.pushId({id:e.id,name:e.name});
        const respon = await DoAxiosWithErro(
        '/api/files/list',
        'post',
        {id:e.id,isRoot:false,pageNo:pageNo.value,pageSize,isAsc:true,isDeleted:false},
        true
      )
      total.value = respon.data.total;
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
const getMultChoice = (list) => {
  if(!list.length) {
    isBulk.value = false;
    return
  }
  MultyList.splice(0,MultyList.length,...list);
  isBulk.value = true;
}

const fetchMuDelte = async () => {
  const list = MultyList.map(i => i.id);
   await DoAxiosWithErro(
    '/api/files/recycle/deleteBatch',
    'put',
    {fileIds:list},
    true,true);

    const newdata = data.filter(i => !list.includes(i.id));
    MultyList.splice(0,MultyList.length);
    data.splice(0,data.length,...newdata);
}

const fetchMuMove = async () => {
  isMoveFile.value = true;
}
const quiteMove = () => {
  isMoveFile.value = false;
}
const submitMove = async (parentId)=> {
  const list = MultyList.map(i => i.id);
  await DoAxiosWithErro('/api/files/moveBatch','put',{
    fileIds:list,
    newParentId:parentId
  },true,false)
  isMoveFile.value = false;

  const nowId = IdStore.getNow().id;
  if(nowId === '') {
    initList('');
  } else {
    handleclicked({
      id:nowId,
      folder:true
    })
  }
}

const fetchMuDownload = async (e) => {
  // console.log(MultyList);
  if(!e) {
    console.log("BarTriger");
  } else {
    console.log("Click",e);
  }
  const list = e ? e : MultyList;
  for (const i of list) {
    isDownloading.value = false
    await useDownloadFile(i.id, i.name, updataProgress);
  }
}
const updataProgress = (newProgress) => {
  if(newProgress === -1) {
    isDownloading.value = false;
    return
  }
  if(newProgress === -2) {
    isloading.value = true
  } else {
    isloading.value = false
  }
  progress.value = newProgress;
  if(newProgress >= 99) {
    isDownloading.value = false;
    return
  }
  if(newProgress >= 0) {
    isDownloading.value = true;
    return
  }
}

const PreViewQuite = () => {
  iframSrc.value = '';
}

// 使用 watch 监听路由的变化
watch(() => route.query.categoryId, (newCategoryId) => {
  initList(newCategoryId);
},{immediate:true});


</script>

<template>
  <div class="about">
    <el-row :gutter="0">
      <el-col :span="18">
        <ToolBar
         :isBulkOperation="isBulk" 
         @handlecreat="buildNewfolder" 
         @StoreChange="handleChange" 
         @MultyDownload="fetchMuDownload"
         @MultyDelete="fetchMuDelte"
         @MultyMove="fetchMuMove"
         />
      </el-col>
      <el-col :span="6">
        <el-input
          v-model="search"
          style="width: 240px"
          placeholder="搜素全部文件"
        >
        <template #append>
          <el-icon @click="handlesearch(search)"><Search /></el-icon>
        </template>
        </el-input>
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
        @handleLoad="fetchMuDownload"
        @handleMultChoice="getMultChoice"
        />
    </div>
    <div class="preview" v-if="isMoveFile || iframSrc!== '' || isDownloading">
      <PreView
      v-if="iframSrc !== ''"
      @quite="PreViewQuite"
      :ifram-src="iframSrc"
      ></PreView>
      <MoveFile 
       v-if="isMoveFile"
       @quite="quiteMove"
       @moved="submitMove"
      ></MoveFile>
      <ProgressBar v-if="isDownloading" :progress="progress"></ProgressBar>
    </div>
  </div>
</template>

<style scoped>
.about{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.preview{
  position: fixed;
  display: flex;
  z-index: 9999;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0; 
  width: 100vw;
  height: 100vh;
  background: rgb(239, 247, 253,0.5);
}
</style>
