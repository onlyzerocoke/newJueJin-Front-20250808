<template>
  <div ref="mescrollRef" class="mescroll">
    <div class="mescroll-content">
      <!-- 下拉刷新区域 -->
      <slot name="header">
   
      </slot>
      
      <!-- 内容区域 -->
      <slot>
     
      </slot>
      
      <!-- 上拉加载区域 -->
      <slot name="footer">
      
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, getCurrentInstance, watch } from 'vue';
import MeScroll from 'mescroll.js';
import 'mescroll.js/mescroll.min.css';

export default defineComponent({
  name: 'MeScrollComponent',
  props: {
    // 下拉刷新的配置
    down: {
      type: Object,
      default: () => ({})
    },
    // 上拉加载的配置
    up: {
      type: Object,
      default: () => ({})
    },
    // 高度
    height: {
      type: String,
      default: '100%'
    },
    // 是否自动初始化
    autoInit: {
      type: Boolean,
      default: true
    }
  },
  emits: ['init', 'down-callback', 'up-callback'],
  setup(props, { emit, expose }) {
    const mescrollRef = ref<HTMLElement | null>(null);
    const mescroll = ref<any>(null);
    const instance = getCurrentInstance();

    // 合并下拉刷新配置
    const downOption = computed(() => {
      return {
        callback: (mescroll: any) => emit('down-callback', mescroll),
        ...props.down
      };
    });

    // 合并上拉加载配置
    const upOption = computed(() => {
      return {
        callback: (page: any, mescroll: any) => emit('up-callback', page, mescroll),
        ...props.up
      };
    });

    // 初始化 MeScroll
    const initMeScroll = () => {
      if (!mescrollRef.value) return;
      
      mescroll.value = new MeScroll(mescrollRef.value, {
        down: downOption.value,
        up: upOption.value
      });
      
      // 发出初始化事件
      emit('init', mescroll.value);
    };

    // 监听配置变化
    watch(() => props.down, (newVal) => {
      if (mescroll.value && mescroll.value.optDown) {
        Object.assign(mescroll.value.optDown, newVal);
      }
    }, { deep: true });

    watch(() => props.up, (newVal) => {
      if (mescroll.value && mescroll.value.optUp) {
        Object.assign(mescroll.value.optUp, newVal);
      }
    }, { deep: true });

    // 挂载时初始化
    onMounted(() => {
      if (props.autoInit) {
        initMeScroll();
      }
    });

    // 销毁时清理
    onBeforeUnmount(() => {
      if (mescroll.value) {
        mescroll.value.destroy();
      }
    });

    // 暴露方法给父组件
    expose({
      // 暴露 mescroll 对象
      getMeScroll: () => mescroll.value,
      
      // 手动初始化
      init: initMeScroll,
      
      // 代理 mescroll 的主要方法
      triggerDownScroll: () => mescroll.value?.triggerDownScroll(),
      triggerUpScroll: () => mescroll.value?.triggerUpScroll(),
      resetUpScroll: () => mescroll.value?.resetUpScroll(),
      setPageNum: (num: number) => mescroll.value?.setPageNum(num),
      setPageSize: (size: number) => mescroll.value?.setPageSize(size),
      endByPage: (dataSize: number, totalPage: number, systime?: number) => 
        mescroll.value?.endByPage(dataSize, totalPage, systime),
      endBySize: (dataSize: number, totalSize: number, systime?: number) => 
        mescroll.value?.endBySize(dataSize, totalSize, systime),
      endSuccess: (dataSize?: number, hasNext?: boolean, systime?: number) => 
        mescroll.value?.endSuccess(dataSize, hasNext, systime),
      endErr: () => mescroll.value?.endErr()
    });

    return {
      mescrollRef,
      mescroll
    };
  }
});
</script>

<style scoped>
.mescroll {
  width: 100%;
  height: v-bind(height);
  overflow-y: auto;
}
</style>
