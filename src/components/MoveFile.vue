<script setup>
import { DoAxiosWithErro } from '@/api';
import { computed, onMounted, reactive, ref } from 'vue';
import { catrgoryConfig } from '@/utils/typeDefin';
import { useUserStore } from '@/stores/user';
    const userStore = useUserStore();
    const Flielist = reactive([]);
    const emits = defineEmits(['quite','moved']);
    const pageNo = ref(1);
    const pageSize = 15;
    const naveStore = reactive({
        index: 0,
        Ids:[
            {
                id:'',
                name:'全部文件',
                path:userStore.userInfo.username
            }
        ]
    });
    const body = computed(() => {
        const id = naveStore.Ids[naveStore.index].id;
        return {
            id,
            isRoot: id === '',
            isAsc:true,
            pageNo:pageNo.value,
            pageSize
        }
    })

    const getNowList = async () => {
        const config = catrgoryConfig(0,body.value).axiosConfig
        const respon = await DoAxiosWithErro(...config)
        const list = respon.data.list.filter(i => i.folder)
        Flielist.splice(0,Flielist.length,...list);
        console.log(Flielist)
    }

    const selectFile = (parentInfo) => {
        naveStore.index ++;
        naveStore.Ids.push({
            id:parentInfo.id,
            name:parentInfo.name,
            path:parentInfo.path
        })
        getNowList();
    }

    const quite = () => {
        emits('quite')
    }
    const moved = ()=> {
        emits('moved',naveStore.Ids[naveStore.index].id);
    }

    const naveChange = (index) => {
        if(index === naveStore.index) return
        naveStore.index = index
        naveStore.Ids.splice(index + 1,naveStore.Ids.length);
        getNowList();
    } 

    onMounted(async ()=> {
       await getNowList();
    })
</script>
<template>
    <div class="main">
        <el-row class="head">
            <el-col :span="23" style="font-weight: bolder;">移动到</el-col>
            <el-col @click="quite" :span="1">
                <el-icon><CloseBold /></el-icon>
            </el-col>
        </el-row>
        <el-row class="nav">
            <el-text
            class="navItem"
             v-for="(item,index) in naveStore.Ids"
             :key="item.id"
             @click="naveChange(index)"
            >
                {{ item.name }}
                <el-icon v-show="index !== naveStore.Ids.length - 1"><ArrowRight /></el-icon>
            </el-text>
        </el-row>
        <div class="listconter">
            <div class="list">
                <el-row
                v-for="item in Flielist"
                :key="item.id"
                class="listcard"
                @click="selectFile(item)"
                >
                    <el-col :span="1">
                        <el-icon size="25"><Folder /></el-icon>
                    </el-col>
                    <el-col :span="10">{{ item.name }}</el-col>
                </el-row>
            </div>
            <div v-show="Flielist.length === 0" class="openfile">
                <el-icon size="45"><FolderOpened /></el-icon>
                <div style="color: #b7b0b0;">移动到 {{ naveStore.Ids[naveStore.index].name }} 文件夹</div>
            </div>
        </div>
        <div class="tail">
            <el-button round @click="quite">取消</el-button>
            <el-button type="primary" round @click="moved">移动到此处</el-button>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import '@/assets/var.less';
    .main{
        position: relative;
        border-radius: 1%;
        width: 900px;
        height: 650px;
        background: white;
    }
    .head{
        padding: 10px 15px;
    }
    .nav{
        padding: 10px 16px;
        background: #f3f0f0;
        .navItem{
            color:@linkBg;
            cursor: pointer;
        }
    }
    .listconter{
        height: 75%;
        overflow: scroll;
        scrollbar-width: none;
        padding: 2px;
        .listcard{
            padding: 5px 10px;
            &:hover{
                background: #f3f0f0;
            }
        }
        .openfile{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 100%;
            height: 100%;
        }
    }
    .tail{
        position: absolute;
        bottom: 20px;
        right: 20px;
    }
</style>