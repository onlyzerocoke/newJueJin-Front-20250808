import type { Ref } from 'vue'
import { ref } from 'vue'

interface MeScrollInstance {
  getMeScroll: () => any;
  triggerDownScroll: () => void;
  triggerUpScroll: () => void;
  resetUpScroll: () => void;
  setPageNum: (num: number) => void;
  setPageSize: (size: number) => void;
  endByPage: (dataSize: number, totalPage: number, systime?: number) => void;
  endBySize: (dataSize: number, totalSize: number, systime?: number) => void;
  endSuccess: (dataSize?: number, hasNext?: boolean, systime?: number) => void;
  endErr: () => void;
  [key: string]: any;
}

interface UseMeScrollOptions<T> {
  // 初始请求参数
  params?: Record<string, any>;
  // 数据请求函数
  requestData: (params: any) => Promise<{ list: T[], total: number }>;
  // 下拉刷新配置
  down?: Record<string, any>;
  // 上拉加载配置
  up?: Record<string, any>;
  // 自动初始化
  autoInit?: boolean;
}

export default function useMeScroll<T = any>(options: UseMeScrollOptions<T>) {
  const {
    params = {},
    requestData,
    down = {},
    up = {},
    autoInit = true
  } = options;

  const meScrollRef: Ref<MeScrollInstance | null> = ref(null);
  const list: Ref<T[]> = ref([]);
  const isLoading = ref(false);
  const page = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const searchParams = ref({ ...params });

  // 下拉刷新回调
  const downCallback = async () => {
    page.value = 1;
    await loadData(true);
  };

  // 上拉加载回调
  const upCallback = async (mescrollPage: any) => {
    page.value = mescrollPage.num;
    pageSize.value = mescrollPage.size;
    await loadData(false);
  };

  // 加载数据
  const loadData = async (isRefresh: boolean) => {
    if (isLoading.value) return;
    
    isLoading.value = true;
    try {
      const params = {
        page: page.value,
        pageSize: pageSize.value,
        ...searchParams.value
      };
      
      const { list: newList, total: newTotal } = await requestData(params);
      total.value = newTotal;
      
      // 更新列表数据
      if (isRefresh) {
        list.value = newList;
      } else {
        list.value = [...list.value, ...newList];
      }
      
      // 通知 mescroll 加载完成
      if (meScrollRef.value) {
        meScrollRef.value.endBySize(newList.length, newTotal);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      if (meScrollRef.value) {
        meScrollRef.value.endErr();
      }
    } finally {
      isLoading.value = false;
    }
  };

  // 重新加载数据
  const refresh = () => {
    if (meScrollRef.value) {
      meScrollRef.value.resetUpScroll();
    }
  };

  // 搜索方法 - 更新参数并重新加载
  const search = (newParams: Record<string, any>) => {
    searchParams.value = { ...searchParams.value, ...newParams };
    refresh();
  };

  // 重置所有参数和数据
  const reset = () => {
    searchParams.value = { ...params };
    refresh();
  };

  return {
    meScrollRef,
    list,
    isLoading,
    page,
    pageSize,
    total,
    searchParams,
    downCallback,
    upCallback,
    refresh,
    search,
    reset,
    
    // MeScroll 配置
    meScrollOptions: {
      down: {
        callback: downCallback,
        ...down
      },
      up: {
        callback: upCallback,
        ...up
      },
      autoInit
    }
  };
}
