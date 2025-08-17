<template>
    <div>
        <section class="back" @click="backIndex">
            <i class="icon iconfont icon-xiangzuojiantou"></i>
        </section>
    </div>
</template>


<script lang="ts" setup>
import {useRouter} from 'vue-router'
const router = useRouter();
// 返回首页
const backIndex = () => {
  router.push(`/`)
}


</script>

<style lang="scss">

.back {
  margin-bottom: 15px !important;
  cursor: pointer;

  .icon {
    font-size: 20px;

  }
}

</style>