<script setup>

</script>

<template>
<div class="lay-contain">
    <div class="left">
        <slot name="left"></slot>
    </div>
    <div class="main">
        <slot name="main"></slot>
    </div>
</div>
</template>

<style lang="less" scoped>
.lay-contain{
    width: 100%;
    height: 100%;
    display: flex;
    .main{
        flex: 1;
        height: 100%;
        overflow: auto;
    }
    .left{
        width: auto;
        height: 100%;
        overflow: auto;
    }
}
</style>
