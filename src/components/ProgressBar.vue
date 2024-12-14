<script setup>
    import { defineProps } from 'vue';
    const props = defineProps({
        progress:{
            type:Number,
            required:true
        }
    })
</script>
<template>
    <div class="progress">
        <div class="inpro">
          <el-progress
          :stroke-width="15"
          :percentage="props.progress"
          :text-inside="true"
          striped
          striped-flow
          :duration="10"
          ></el-progress>
          <div style="text-align: center;margin: 5px;">下载中...</div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.progress{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  .inpro{
    width: 50%;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
</style>