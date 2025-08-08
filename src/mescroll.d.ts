declare module 'mescroll.js' {
  interface MeScrollDown {
    use?: boolean;
    auto?: boolean;
    autoShowLoading?: boolean;
    isLock?: boolean;
    offset?: number;
    outOffsetRate?: number;
    minAngle?: number;
    mustToTop?: boolean;
    hardwareClass?: string;
    warpId?: string;
    warpClass?: string;
    resetClass?: string;
    textInOffset?: string;
    textOutOffset?: string;
    textLoading?: string;
    textSuccess?: string;
    textErr?: string;
    beforeLoading?: (mescroll: MeScroll) => void;
    showLoading?: (mescroll: MeScroll) => void;
    afterLoading?: (mescroll: MeScroll) => void;
    onMoving?: (mescroll: MeScroll, rate: number, downHight: number) => void;
    beforeEndDownScroll?: (mescroll: MeScroll) => boolean;
    endDownScroll?: (mescroll: MeScroll) => void;
    callback?: (mescroll: MeScroll) => void;
  }

  interface MeScrollUp {
    use?: boolean;
    auto?: boolean;
    isLock?: boolean;
    isBoth?: boolean;
    isBounce?: boolean;
    callback?: (page: MeScrollPage, mescroll: MeScroll) => void;
    page?: MeScrollPage;
    noMoreSize?: number;
    offset?: number;
    toTop?: MeScrollToTop;
    loadFull?: MeScrollLoadFull;
    empty?: MeScrollEmpty;
    clearId?: string;
    clearEmptyId?: string;
    hardwareClass?: string;
    warpId?: string;
    warpClass?: string;
    htmlLoading?: string;
    htmlNodata?: string;
    inited?: (mescroll: MeScroll, upwarp: HTMLElement) => void;
    showLoading?: (mescroll: MeScroll, upwarp: HTMLElement) => void;
    showNoMore?: (mescroll: MeScroll, upwarp: HTMLElement) => void;
    onScroll?: (mescroll: MeScroll, y: number, isUp: boolean) => void;
    scrollbar?: MeScrollBar;
    lazyLoad?: MeScrollLazyLoad;
  }

  interface MeScrollToTop {
    src?: string;
    offset?: number;
    warpId?: string;
    warpClass?: string;
    onClick?: (mescroll: MeScroll) => void;
  }

  interface MeScrollLoadFull {
    use?: boolean;
    delay?: number;
  }

  interface MeScrollEmpty {
    warpId?: string;
    icon?: string;
    tip?: string;
    btntext?: string;
    btnClick?: (mescroll: MeScroll) => void;
  }

  interface MeScrollBar {
    use?: boolean;
    barClass?: string;
    show?: number;
    hide?: number;
  }

  interface MeScrollLazyLoad {
    use?: boolean;
    attr?: string;
    showClass?: string;
    delay?: number;
    offset?: number;
  }

  interface MeScrollPage {
    num?: number;
    size?: number;
    time?: number;
  }

  interface MeScrollOptions {
    down?: MeScrollDown;
    up?: MeScrollUp;
  }

  class MeScroll {
    constructor(mescrollId: string | HTMLElement, options?: MeScrollOptions);
    
    optDown: MeScrollDown;
    optUp: MeScrollUp;
    
    scrollTo(y: number, duration?: number): void;
    resetUpScroll(): void;
    triggerDownScroll(): void;
    triggerUpScroll(): void;
    setPageNum(num: number): void;
    setPageSize(size: number): void;
    lockDownScroll(isLock: boolean): void;
    lockUpScroll(isLock: boolean): void;
    endByPage(dataSize: number, totalPage: number, systime?: number): void;
    endBySize(dataSize: number, totalSize: number, systime?: number): void;
    endSuccess(dataSize?: number, hasNext?: boolean, systime?: number): void;
    endErr(): void;
    showDownScroll(): void;
    showUpScroll(): void;
    hideUpScroll(): void;
    hideDownScroll(): void;
    clearDataList(): void;
    clearEmptyId(): void;
    destroy(): void;
    removeEmpty(): void;
  }

  export default MeScroll;
}
