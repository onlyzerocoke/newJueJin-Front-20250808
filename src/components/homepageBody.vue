<template>
    <div class="root">

        <div class="personInfoContainer">

            <article class="personInfoContentTop">
                <section class="personInfoContentTopLeft">

                    <div class="avatarContainer">
                        <a-avatar class="userAvatar" :size="100" :src="piniaAvatar"></a-avatar>
                    </div>

                    <div class="nameInfoContainer">
                        <p class="userName">{{ piniaUserName }}</p>
                        <p>+你从事什么职业?</p>
                        <p>+你的人人生格言是什么?</p>

                    </div>

                </section>

                <section class="personInfoContentTopRight">
                    <el-button class="setButton" type="primary">设置</el-button>
                </section>
            </article>

            <article class="personInfoContentMiddle">
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="toggleTab">
                    <el-tab-pane v-for="(item, index) in tabArr" :key="index" :name="index">
                        <template #label>
                            {{ item.label }}
                            <span v-if="item.count > 0" style="color: gray; margin-left: 4px;">{{ item.count }}</span>
                        </template>
                    </el-tab-pane>
                </el-tabs>

            </article>

            <!-- 关注 -->
            <section class="focusContainer" v-if="currentTabIndex == 5">
                <div class="focusContent">

                    <p class="focusContentLeft">
                        关注
                    </p>

                    <article class="focusContentRight">
                        <p v-for="(item, index) in focusArr" :key="index" @click="toggleFocusIndex(index)"
                            :class="currentFocusIndex == index ? 'activeFocus' : ''">{{ item }}</p>
                    </article>
                </div>
            </section>
            <el-divider v-if="currentTabIndex == 5"></el-divider>

            <!-- Mescroll -->
            <article class="listContainer">
                <!-- 文章列表 -->
                <MeScroll ref="meScrollRef" :down="{ use: true }" :up="{
                    use: true,
                    textLoading: '',         // 不显示加载中文字
                    htmlLoading: '',         // 不显示 loading 动画
                    isShowLoading: false,    // 禁止显示 loading
                }" @down-callback="downCallback" @up-callback="upCallback">


                    <!-- 骨架屏 -->
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
                                    <el-skeleton-item variant="image"
                                        style="width: 120px; height: 120px; flex-shrink: 0;" />
                                </div>

                            </template>
                        </el-skeleton>

                    </template>


                    <!-- 暂无文章数据 -->
                    <template v-else-if="dataList.length == 0">
                        <el-empty description="暂无数据" />
                    </template>




                    <section class="focusItemContainer">
                        <template v-for="(item, index) in dataList" :key="index">
                            <!-- 动态 -->
                            <section v-if="currentTabIndex == 0">
                                <!-- 动态-关注类型的item -->
                                <div class="focusItemContent" v-if="item.type == 0">
                                    <a-avatar class="userAvatar" :size="50" :src="piniaAvatar"></a-avatar>
                                    <p class="focusItemUserName">{{ piniaUserName }}</p>
                                    <p class="focusWord">关注了</p>
                                    <p class="beFocusUserName">{{ item?.personInfo?.name }}</p>
                                </div>

                                <!-- 动态-文章列表类型的item -->
                                <section class="praisePaperItemContainer" v-else>

                                    <div class="praisePaperItemContent">
                                        <article class="praisePaperItemContentTop">{{ piniaUserName }}
                                            <span>赞了这篇文章</span>
                                        </article>
                                        <el-divider></el-divider>

                                        <article class="praisePaperItemContentMiddle">

                                            <section class="praisePaperItemContentMiddleTop">

                                                <div class="leftContent">
                                                    <div class="avatarContainer">
                                                        <a-avatar class="userAvatar" :size="50"
                                                            :src="item.personInfo?.avatar"></a-avatar>
                                                    </div>

                                                    <div class="authorInfoContainer">
                                                        <p class="authorName">{{ item.paperInfo?.author }}</p>
                                                        <article class="occupationAndDateContainer">
                                                            <p class="occupation">{{ item.paperInfo?.occupation }}&nbsp;
                                                            </p>
                                                            <p>{{ timeAgo(item?.paperInfo?.create_time) }}</p>
                                                        </article>


                                                    </div>
                                                </div>

                                                <div class="rightContent">

                                                    <el-button type="primary" class="focusBtn"
                                                        @click="toFocus(item?.paperInfo?.id, item.authorId)"
                                                        v-if="!item.focusStatus">关注</el-button>

                                                    <!-- <el-button type="primary" class="focusBtn"
                                                        @click="toFocus(item?.paperInfo?.id, item.authorId)"
                                                        v-if="item.focusStatus">已关注</el-button> -->

                                                </div>
                                            </section>


                                            <section class="praisePaperItemContentMiddleMiddle"
                                                @click="toPaperDetail(item.paperId)">
                                                <p class="title">{{ item?.paperInfo?.title }}</p>
                                                <div class="contentAndImgContainer">
                                                    <article class="paperAbstract">
                                                        {{ getTruncatedContent(item?.paperInfo.abstract
                                                            , item.paperInfo.coverImage) }}
                                                    </article>
                                                    <el-image style="width: 80px; height:80px"
                                                        :src="item?.paperInfo?.coverImage" />
                                                </div>

                                            </section>

                                            <el-divider></el-divider>

                                            <section class="praisePaperItemContentMiddleBottom">
                                                <div class="iconContainer" @click="praiseChange(item.paperInfo.id)">
                                                    <!-- {{ item?.paperInfo?.praiseStatus }} -->
                                                    <i class="icon iconfont icon-zan1"
                                                        v-if="item.paperInfo.praiseStatus"></i>
                                                    <i class="icon iconfont icon-zan" v-else></i>

                                                    <p>{{ item.paperInfo.praise > 0 ? item.paperInfo.praise : '点赞' }}
                                                    </p>
                                                </div>

                                                <div class="iconContainer">
                                                    <i class="icon iconfont icon-pinglun"></i>
                                                    <p>{{ item?.totalComment.length > 0 ? item?.totalComment.length :
                                                        '评论'
                                                    }}
                                                    </p>
                                                </div>

                                                <div class="iconContainer">
                                                    <i class="icon iconfont icon-fenxiang1"></i>
                                                    <p>分享</p>
                                                </div>

                                            </section>
                                        </article>

                                    </div>

                                </section>
                            </section>


                            <!-- 关注 -->
                            <section class="followUserContaienr" v-if="currentTabIndex == 5">

                                <div class="followUserContent">
                                    <article class="followUserContentLeft">
                                        <div class="avatarContainer">
                                            <a-avatar class="userAvatar" :size="50"
                                                :src="item.personInfo?.avatar"></a-avatar>
                                        </div>

                                        <div class="followerUserInfo">
                                            <p class="followUserName">{{ item.personInfo?.name }}</p>
                                            <p class="followOccupation">{{ item.personInfo?.occupation }}</p>
                                        </div>
                                    </article>

                                    <article class="followUserContentRight">
                                        <el-button type="primary" class="followBtn" v-if="item.focusStatus"
                                            @click="toFocusList(item.authorId)">已关注</el-button>
                                        <el-button type="primary" class="noFollowBtn" v-else
                                            @click="toFocusList(item.authorId)">关注</el-button>
                                    </article>

                                </div>
                            </section>


                            <!-- 点赞 -->
                            <section class="praisePaperContianer" v-if="currentTabIndex == 7">
                                <div class="praiseContent">
                                    <article class="praiseLeft">
                                        <p class="praiseTitle">{{ item.paperInfo?.title }}</p>
                                        <p class="praisePaperAbstract" @click="toPaperDetail(item.paperId)">
                                            {{ getTruncatedContent(item?.paperInfo?.abstract,
                                                item.paperInfo?.coverImage)
                                            }}</p>
                                        <article class="praiseInfo">
                                            <p>{{ item.paperInfo?.author }}</p>
                                            <p class="praiseDate">{{ timeAgo(item.paperInfo?.create_time) }}</p>
                                            <section class="praiseIconContainer">
                                                <i class="icon iconfont icon-yanjing"></i>
                                                <p>{{ item.paperInfo?.view }}</p>
                                            </section>

                                            <section class="praiseIconContainer">
                                                <i class="icon iconfont icon-zan1" v-if="item.paperInfo.praiseStatus"
                                                    @click="praiseChange(item.paperInfo.id)"></i>
                                                <i class="icon iconfont icon-zan" v-else
                                                    @click="praiseChange(item.paperInfo.id)"></i>
                                                <p>{{ item.paperInfo?.praise }}</p>
                                            </section>

                                            <section class="praiseIconContainer">
                                                <i class="icon iconfont icon-pinglun"></i>
                                                <p>{{ item?.totalComment.length }}</p>
                                            </section>
                                        </article>
                                    </article>

                                    <article class="praiseRight">
                                        <el-image style="width: 80px; height:80px"
                                            :src="item.paperInfo?.coverImage"></el-image>
                                    </article>
                                </div>


                            </section>

                        </template>



                    </section>




                </MeScroll>


            </article>

        </div>
    </div>
</template>

<script lang="ts" setup>
import useMainStore from '../Store/index'
import { storeToRefs } from 'pinia';
import { ref, onMounted, nextTick } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import type { focusUserParams } from '../api/type/user'
import { reqActionsList, reqPraisePaper, reqFocus } from '../api/api'
import { useMessage } from '../utils/elementComponents/message'
import MeScroll from "./MeScroll.vue";
import type { articleListId } from '../api/type/article'
import type { actionsListParam } from '../api/type/actions'
import { forceLoginOut } from '../utils/repeatHooks'
import { useRouter } from 'vue-router'
const { userStore, useHeaderStore } = useMainStore();
//@ts-ignore
const { piniaAvatar, piniaUserName, piniaUserId } = storeToRefs(userStore);

const router = useRouter()

const activeName = ref(0);
const currentTabIndex = ref<number | undefined>(0)

const toggleTab = (tab: TabsPaneContext, event: Event) => {
    dataList.value = [];


    currentTabIndex.value = Number(tab.index);
    console.log("currentTabIndex.value", currentTabIndex.value);
    console.log("dataList.value", dataList.value);
    downCallback(meScrollRef.value, currentTabIndex.value)


}

const tabArr = ref([
    { label: '动态', count: 0 },
    { label: '文章', count: 0 },
    { label: '专栏', count: 0 },
    { label: '沸点', count: 0 },
    { label: '收藏集', count: 0 },
    { label: '关注', count: 0 },
    { label: '作品', count: 0 },
    { label: '点赞', count: 140 }
])

onMounted(() => {


    downCallback(meScrollRef.value)
    // fetchData(1, 10, 0, piniaUserId.value, (curPageData: any) => {
    //     dataList.value = curPageData;
    //     console.log("列表数据:", curPageData);
    // });


})

const dataList = ref<any[]>([]);
let loading = ref<boolean>(false);
let limit = ref<number>(10);
//当前tab索引
let type = ref<number>(0)
const meScrollRef = ref(null);
//获取文章列表
const fetchData = async (page: number, limit: number, type: number | undefined, userId: number, focusType: number, callback: (data: any[]) => void) => {
    const data: actionsListParam = { page, limit, type, userId, focusType }
    // @ts-ignore
    const res = await reqActionsList(data);
    try {
        if (res.code === 200 && Array.isArray(res.data)) {
            callback(res.data);
        } else {
            // useMessage(res.message || "数据获取失败");
            callback([]); // 给个空数组，确保不会卡住
        }
    } catch (err) {
        console.error("fetchData error", err);
        useMessage("请求出错");
        callback([]);
    }

}

// //上拉加载
const upCallback = (page: any, mescroll: any) => {
    console.log("上拉加载");

    fetchData(page.num, limit.value, currentTabIndex.value, piniaUserId.value, currentFocusIndex.value, (curPageData: any) => {
        // 更新列表
        if (page.num === 1) dataList.value = curPageData;
        else {
            dataList.value = dataList.value.concat(curPageData);
        };
        // 结束上拉加载
        mescroll.endSuccess(curPageData.length);
    });
};


// // 下拉刷新回调
const downCallback = (mescroll: any, type?: number | undefined) => {
    // 这里非常关键：重置上拉加载状态
    mescroll.resetUpScroll();
    // 然后再拉第一页数据
    fetchData(1, limit.value, currentTabIndex.value, piniaUserId.value, currentFocusIndex.value, (curPageData: any) => {
        dataList.value = curPageData;
        // 结束下拉刷新（注意这个是下拉的）
        mescroll.endSuccess();
        // console.log("fetch type:", currentTabIndex.value);
        // console.log("返回数据:", curPageData);

    });

};


let currentFocusIndex = ref<number>(0)
const focusArr = ref<string[]>(['关注的用户']);
// const focusArr = ref<string[]>(['关注的用户', '关注的团队', '关注者', '订阅的专栏', '关注标签']);

const toggleFocusIndex = (index: number) => {
    currentFocusIndex.value = index;
    console.log("currentFocusIndex.value", currentFocusIndex.value);

    downCallback(meScrollRef);

}
const windowWidth = ref(window.innerWidth)

//截断摘要
const getTruncatedContent = (content: string, ifImageLive: null | string) => {
    const width = windowWidth.value
    let charCount: number = 100

    if (width < 330) charCount = 10
    else if (width < 400) charCount = 15
    else if (width < 460) charCount = 20
    else if (width < 500) charCount = 25
    else if (width < 600) charCount = 30
    else if (width < 1020) charCount = 35
    else if (width < 2500) charCount = 43
    else charCount = content.length

    return content.length > charCount && ifImageLive != null
        ? content.slice(0, charCount) + '...'
        : content.slice(0, charCount) + '...'

};

//处理时间
const timeAgo = (createdAt: string) => {
    const now = new Date().getTime();
    const past = new Date(createdAt).getTime();
    const diff = Math.floor((now - past) / 1000); // 秒差

    if (diff < 60) return `${diff} 秒前`;
    if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} 天前`;
    if (diff < 2592000) return `${Math.floor(diff / 604800)} 周前`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} 月前`;
    return `${Math.floor(diff / 31536000)} 年前`;
}

// 点赞 
const praiseChange = async (paperId: number) => {

    const data: articleListId = {
        paperId: paperId,

    };
    const res: any = await reqPraisePaper(data);


    if (res.code == 401) {
        forceLoginOut()
    } else if (res.code == 400) {
        useHeaderStore.openModal()
    }

    const paperStatus = res.data;

    const idx = dataList.value.findIndex(item => item.paperInfo.id === paperId);

    dataList.value[idx].paperInfo.praise = paperStatus.praiseNum;
    dataList.value[idx].paperInfo.praiseStatus = paperStatus.praiseStatus;
    console.log("paperStatus.praiseStatus",paperStatus.praiseStatus);
    
    console.log(dataList.value[idx]);
    
    // downCallback(meScrollRef.value)



}

//关注
const toFocus = async (paperId: number, authorId: number) => {
    const data: focusUserParams = {
        userId: piniaUserId.value,
        //@ts-ignore
        authorId
    }

    const res = await reqFocus(data);

    if (res.code == 400) {
        useMessage(res.message, 'warning')
    } else if (res.code == 401) {
        forceLoginOut();
    } else if (res.code == 200) {
        const idx = dataList.value.findIndex(item => item.paperInfo.id === paperId);
        dataList.value[idx].focusStatus = res.data.followStatus;
        downCallback(meScrollRef.value)
        // const updatedItem = {
        //     ...dataList.value[idx],
        //     focusStatus: res.data.followStatus
        // };
        // dataList.value.splice(idx, 1, updatedItem);

    }
}

//关注列表的关注
const toFocusList = async (authorId: number) => {


    const data: focusUserParams = {
        userId: piniaUserId.value,
        //@ts-ignore
        authorId
    }

    const res = await reqFocus(data);

    if (res.code == 400) {
        useMessage(res.message, 'warning')
    } else if (res.code == 401) {
        forceLoginOut();
    } else if (res.code == 200) {
        const idx = dataList.value.findIndex(item => item.authorId === authorId);
        dataList.value[idx].focusStatus = res.data.followStatus;

    }
}

const toPaperDetail = (paperId: number) => {
    console.log("toPaperDetail");

    router.push(`/paper/${paperId}`);
}
</script>


<style lang="scss">
// 初始化
html,
body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
ul,
ol,
li,
dl,
dt,
dd,
figure {
    margin: 0;
    padding: 0;
}

ul,
ol {
    list-style: none;
}

button,
input {
    border: none;
    outline: none;
}

a {
    text-decoration: none;
    color: inherit;
}

$defaultTriangleColor: #515767;
$defaultDeepWordColor: #1e9cff;
$defautlShallowColor: #1e80ff;
$defaultWordColor: #666b79;

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.start {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

* {
    user-select: none;
}

.root {
    margin: 0 auto;

    .personInfoContainer {
        display: flex;
        flex-direction: column;

        margin-top: 20px !important;


        .personInfoContentTop {
            @extend .between;
            background-color: white;
            // background-color: purple;
            padding: 35px 20px !important;

            .personInfoContentTopLeft {
                @extend .start;
                cursor: pointer;

                .avatarContainer {
                    margin-right: 20px !important;
                }

                p:nth-child(2) {
                    margin: 5px 0px !important;
                    color: $defautlShallowColor ;
                }

                p:nth-child(3) {
                    margin: 5px 0px !important;
                    color: $defautlShallowColor ;
                }

                .userName {
                    font-weight: 600;
                    font-size: 25px;
                }
            }
        }


        .personInfoContentMiddle {
            background-color: white;
            // background-color: purple;
            margin-top: 20px !important;
            padding: 10px !important;
            padding-left: 10px !important;
        }

        .setButton {
            width: 100px;
            background-color: white !important;
            border: 1px solid $defaultDeepWordColor;
            color: $defaultDeepWordColor;
            font-size: 15px;
            padding: 0px 20px !important;
            // margin-left: 300px !important;
            cursor: pointer;
        }
    }
}

.myTabs .el-tabs__active-bar {
    background-color: #1e80ff;
    width: 36px !important;
    /* 下划线长度 */
    height: 2px;
    border-radius: 2px;
    left: 50% !important;
    /* 水平居中需要加 !important */
    transform: translateX(-50%);
}

.myTabs .el-tabs__item.is-active {
    color: #1e80ff;
    font-weight: 600;
}

.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.el-tabs__item {
    margin-right: 30px !important;
    color: #909090 !important;
    font-size: 16px !important;
    font-family: 'Times New Roman', Times, serif;
}

.el-tabs__active-bar {
    width: 15px !important;
    margin-left: 8px !important;
}



.el-tabs__item.is-active,
.el-tabs__item:hover {
    color: black !important;
}

.listContainer {
    display: flex;
    flex-direction: column;

    .focusItemContainer {
        // @extend .start;
        display: flex;
        flex-direction: column;
        // margin-top:1px !important;
        // padding: 15px !important;
        // background-color: white;

        margin-bottom: 10px !important;
        padding-top: 0px !important;

        .focusItemContent {
            background-color: white;
            margin-bottom: 10px !important;
            @extend .start;
            padding-left: 20px !important;

            .userAvatar {
                margin-right: 10px !important;
            }

            .focusWord {
                margin: 0px 5px !important;
                font-size: 15px;
                color: #8A9AA9;
            }
        }
    }

    .praisePaperItemContainer {
        display: flex;
        flex-direction: column;
        background-color: white;
        margin-bottom: 10px !important;

        // background-color: aqua;
        // padding: 20px !important;
        .praisePaperItemContent {
            flex: 1; // ✅ 占满父容器剩余空间
            // background-color: red;
        }

        .praisePaperItemContentTop {
            padding: 15px !important;

            span {
                color: #8A9AA9 !important;
                font-size: 14px;
            }
        }
    }
}

.praisePaperItemContentMiddle {
    // background-color: yellow;
    width: 100% !important; // ✅ 撑满父容器

    // border-bottom: 1px solid red;
    // margin-bottom: 25px !important;
    .praisePaperItemContentMiddleTop {
        @extend .between;
        padding: 5px 15px !important;
        // // background-color: red;
        // margin-bottom: 10px !important;

        .leftContent {
            // @extend .between;
            @extend .start;


            .avatarContainer {
                margin-right: 10px !important;
            }

            .occupationAndDateContainer {
                @extend .start;


                color: #8A9AA9 !important;
                font-size: 12px;
                margin-top: 5px !important;
            }
        }

        // .rightContent {
        //     .el-button {
        //         color: #6CBD45;
        //         border-color: 1px solid #6CBD45 !important;
        //         background-color: #FFFFFF;
        //         padding: 0px 15px !important;
        //     }
        // }



    }

    .praisePaperItemContentMiddleMiddle {
        display: flex;
        flex-direction: column;
        // padding-left: 60px !important;
        margin-left: 80px !important;
        // border-bottom: 1px solid #EBEBEB;
        cursor: pointer;

        .contentAndImgContainer {
            display: flex;
            align-items: flex-start;
            // background-color: orange;
            margin-top: 5px !important;
            // flex-wrap: wrap; // ✅ 允许内部换行

            .paperAbstract {
                width: 80%;
                display: flex;
                flex-wrap: wrap;
                color: #5C6066;
                margin-right: 20px !important;
                font-size: 15px !important;
                line-height: 25px !important;
            }

            padding-bottom: 25px !important;
        }
    }

    .praisePaperItemContentMiddleBottom {
        @extend .start;

        .iconContainer {
            @extend .center;
            color: #8A93A0;
            padding: 10px 0px !important;
            flex: 1;
            cursor: pointer;

            .icon {
                margin-right: 5px !important;
            }
        }

        .iconContainer:nth-child(2) {
            border-right: 1px solid #EBEBEB !important;
            border-left: 1px solid #EBEBEB !important;
        }
    }
}

.praisePaperItemContentMiddleTop {
    width: 100% !important;
}

.praisePaperItemContentMiddle .praisePaperItemContentMiddleTop .rightContent .focusBtn {
    color: rgb(108, 189, 69);
    background-color: rgb(255, 255, 255);
    padding: 0px 15px !important;
    border-color: rgb(108, 189, 69);
}

.praisePaperItemContentMiddle .praisePaperItemContentMiddleTop .rightContent .beFocusBtn {
    color: #FFFFFF !important;
    background-color: rgb(108, 189, 69) !important;
    padding: 0px 15px !important;
    border-color: rgb(108, 189, 69);
}

.focusContainer {
    flex: 1;
    // background-color: aqua;
    background-color: white;

    //   background-color: orange;
    padding: 10px 20px !important;

    .focusContent {
        @extend .between;

        .focusContentLeft {
            // margin-right: 200px !important;
        }

        .focusContentRight {
            @extend .start;
            cursor: pointer;

            p {
                // background-color: red;
                padding: 0px 10px !important;
                color: #72777B;
                font-size: 15px;
                border-right: 1px solid #72777B;
                user-select: none;
            }

            p:last-child {
                border-right: none !important;
            }

        }
    }
}

.activeFocus {
    color: black !important;
}

.followUserContaienr {
    @extend .start;
    padding: 15px !important;
    background-color: white;
    cursor: pointer;

    .followUserContent {
        @extend .between;
        flex: 1;

    }

    .followUserContentLeft {
        @extend .start;

        .avatarContainer {
            margin-right: 10px !important;
        }
    }


    .followUserContentRight {
        .followBtn {
            background-color: #92C452;
            border-color: 1px solid pink !important;
        }
    }

    .followerUserInfo {
        display: flex;
        flex-direction: column;

        .followOccupation {
            color: #B9C0C8;
            font-size: 12px;
            margin-top: 5px !important;
        }
    }
}

.followUserContaienr:hover {
    background-color: #FBFBFB;
}

.followUserContaienr .followUserContentRight .followBtn {
    background-color: rgb(146, 196, 82);
    color: white;
    padding: 5px 20px !important;
    border-color: rgb(146, 196, 82);
}


.followUserContaienr .followUserContentRight .noFollowBtn {
    background-color: white !important;
    color: rgb(146, 196, 82);
    padding: 5px 20px !important;
    border-color: rgb(146, 196, 82);
}

.praisePaperContianer {

    border-color: 1px solid #F1F2F5;


    .praiseContent {
        @extend .between;
        padding: 15px !important;
        background-color: white;
        border-bottom: 1px solid #F1F2F5;

        .praisePaperAbstract {
            cursor: pointer;
        }

        // @extend .start;

        .praiseInfo {
            @extend .start;
            color: #8A919F;
            font-size: 14px;

            p {
                border-right: 1px solid #EFF0F3;
                padding-right: 10px !important;
            }

            .praiseDate {
                margin: 0px 10px !important;
            }

            .praiseTitle {
                font-size: 25px !important;
                font-weight: 600;
            }

            .praiseIconContainer {
                @extend .start;
                cursor: pointer;
                margin-right: 10px !important;


                .icon {
                    margin-right: 5px !important;
                }

            }
        }

        .praisePaperAbstract {
            width: 80%;
            color: #8A919F;
            font-size: 15px;
            margin: 10px 0px !important;
        }
    }

}

// @media screen and(max-width:600px){
//     .personInfoContentTop{
       
//     }
// }
</style>