<script setup>
import { watch, ref, reactive } from 'vue';
const detail = [
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },{
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },{
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },{
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },{
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
    {
        name:'nask',
        type: 'pos',
        size:123,
        deleteTime: '2024.12.01',
        expirationData:10
    },
]


const defdetail = reactive(detail.map(item => ({...item,check:false,hasmous:false})));
const checkAll = ref(false);
const indeter = ref(false);


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

watch(defdetail,(newvalue) => {
    checkAll.value = newvalue.every(i => i.check);
    indeter.value = newvalue.some(i => i.check) && !checkAll.value;
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
                <el-col :span="4">大小</el-col>
                <el-col :span="4">删除时间</el-col>
                <el-col :span="4">有效时间</el-col>
            </el-row>
            <div class="scol">
                <el-row
                class="item"
                 v-for="(item,index) in defdetail"
                 :key="index"
                 @mouseenter="handleenter(item)"
                 @mouseleave="handleleave(item)"
                >
                    <el-col :span="8" class="name">
                        <el-checkbox v-show="true" v-model="item.check" :value="item.name"></el-checkbox>
                        <el-icon color="yellow" size="25px"><WalletFilled /></el-icon>
                        {{ item.name }}
                    </el-col>
                    <el-col v-show="!item.hasmous" :span="4">{{ item.size }}</el-col>
                    <el-col v-show="!item.hasmous" :span="4">{{ item.deleteTime }}</el-col>
                    <el-col v-show="!item.hasmous" :span="4">{{ item.expirationData }}天</el-col>
                    <el-col v-show="item.hasmous" :span="12" style="padding-left: 10%;">
                        <el-tooltip
                        effect="light"
                        content="还原"
                        >
                            <el-icon style="margin: 10px; color: rgba(51, 191, 240); cursor: pointer;"><Refresh /></el-icon>
                        </el-tooltip>
                        <el-tooltip
                        effect="light"
                        content="彻底删除"
                        >
                            <el-icon style="margin: 10px; color: rgba(51, 191, 240); cursor: pointer;"><Delete /></el-icon>
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
    max-height: 72vh;
    scrollbar-width: none;
    overflow: auto;
}
</style>