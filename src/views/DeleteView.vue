<script setup>
import { watch, ref, reactive, onMounted} from 'vue';
import { DoAxios,DoAxiosWithErro } from '@/api';
import { ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const detail = reactive([]);
const userStore = useUserStore();
const router = useRouter();
const defdetail = reactive(detail.map(item => ({...item,check:false,hasmous:false})));
const checkAll = ref(false);
const indeter = ref(false);
const isfetching = ref(false);


const handleenter = (e) => {
    e.hasmous = true;
}
const handleleave = (e) => {
    e.hasmous = false;
}
const handleAll = () => {
    defdetail.forEach(item => {
        item.check = checkAll.value
    })
}

const deleteEnd = async (id) => {
   await DoAxiosWithErro('/api/files/delete','delete',{fileId:id},true)
   const index = defdetail.findIndex(item => item.id === id);
   defdetail.splice(index,1)
}

const handleRefesh = async (e) => {
    isfetching.value = true;
    const fordata =new FormData();
    fordata.append('fileId',e.id);
    await DoAxiosWithErro('/api/files/recycle/restore','put',fordata,true);
    const index = defdetail.findIndex(item => item.id === e.id);
    defdetail.splice(index,1)
    isfetching.value = false;
}

watch(defdetail,(newvalue) => {
    checkAll.value = newvalue.every(i => i.check);
    indeter.value = newvalue.some(i => i.check) && !checkAll.value;
})

onMounted(async () => {
    try{
        isfetching.value = true;
        const respon = await DoAxiosWithErro('/api/files/list','post',{
            id:0,
            isRoot:true,
            pageNo:1,
            pageSize:10,
            isAsc:true,
            isDeleted:true
        },true)
        detail.splice(0, detail.length, ...respon.data.list);
    } catch(e) {
        ElMessageBox.alert('登录过期请重新登录', e, {
        confirmButtonText: '确定',
        }).then(() => {
        router.push('/');
        });
    } finally {
        isfetching.value = false
        defdetail.splice(0,defdetail.length,...detail.map(item => ({...item,check:false,hasmous:false})))
    }
})

</script>
<template>
    <el-container>
        <el-header height="30px">
            <el-button type="primary" round>
                <el-icon style="margin: 3px;"><Delete /></el-icon>
                清空回收站
            </el-button>
        </el-header>
        <el-main>
            <el-row>回收站</el-row>
            <el-row>
                <el-col :span="8">
                    <el-checkbox
                    v-model="checkAll"
                    :indeterminate="indeter"
                    @change="handleAll"
                    ></el-checkbox>
                    文件
                </el-col>
                <el-col :span="6">删除时间</el-col>
                <el-col :span="4">有效时间</el-col>
            </el-row>
            <div class="scol" v-loading="isfetching">
                <el-row
                class="item"
                 v-for="(item,index) in defdetail"
                 :key="index"
                 @mouseenter="handleenter(item)"
                 @mouseleave="handleleave(item)"
                >
                    <el-col style="min-width: 100px; overflow: hidden; text-overflow: ellipsis; flex-wrap: nowrap; text-wrap: nowrap;" :span="8" class="name">
                        <el-checkbox  v-model="item.check" :value="item.name"></el-checkbox>
                        <el-icon color="yellow" size="25px"><WalletFilled /></el-icon>
                        {{ item.name }}
                    </el-col>
                    <el-col v-show="!item.hasmous" :span="6">{{ item.updatedTime }}</el-col>
                    <el-col v-show="!item.hasmous" :span="4">{{ item.expirationData }}天</el-col>
                    <el-col v-show="item.hasmous" :span="10" style="padding-left: 10%;">
                        <el-tooltip
                        effect="light"
                        content="还原"
                        >
                            <el-icon @click="handleRefesh(item)" style="margin: 10px; color: rgba(51, 191, 240); cursor: pointer;"><Refresh /></el-icon>
                        </el-tooltip>
                        <el-tooltip
                        effect="light"
                        content="彻底删除"
                        >
                            <el-icon @click="deleteEnd(item.id)" style="margin: 10px; color: rgba(51, 191, 240); cursor: pointer;"><Delete /></el-icon>
                        </el-tooltip>
                    </el-col>
                </el-row>
            </div>
        </el-main>
    </el-container>
</template>
<style scoped>
.item:hover{
    background:rgb(241, 244, 244);;
}
.name{
    padding: 10px 0;
}
.name:hover{
  color: rgba(51, 191, 240);
}
.scol{
    height: 72vh;
    scrollbar-width: none;
    overflow: auto;
}
</style>