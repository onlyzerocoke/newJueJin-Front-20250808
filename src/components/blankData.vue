     <template>
        <el-empty :description="message" />
    </template>


<script lang="ts" setup>

const {message} = withDefaults(defineProps<{
  message?: string
}>(), {
  message: '暂无文章数据'
})

</script>