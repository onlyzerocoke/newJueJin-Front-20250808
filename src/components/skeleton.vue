<template v-if="loading">
    <el-skeleton animated>
        <template #template>
            <div style="display: flex; gap: 16px">
                <!-- 左边：文字骨架区域 -->
                <div style="flex: 1">
                    <el-skeleton-item variant="text" class="el-skeleton-itemLeft " />
                    <el-skeleton-item variant="text" class="el-skeleton-itemLeft " />
                    <el-skeleton-item variant="text" class="el-skeleton-itemLeft " />
                    <el-skeleton-item variant="text" class="el-skeleton-itemLeft " />
                </div>

                <!-- 右边：图片骨架 -->
                <el-skeleton-item variant="image" style="width: 120px; height: 120px; flex-shrink: 0;" />
            </div>

        </template>
    </el-skeleton>

</template>


<script setup lang="ts">
const { loading } = defineProps({
  loading: Boolean
})

</script>