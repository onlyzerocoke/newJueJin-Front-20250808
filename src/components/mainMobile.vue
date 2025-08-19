<template>
  <div class="main">
    <div class="mainContentContainer">

      <!-- 左侧目录 -->
      <div class="leftContentContainer">

        <article class="leftContent">
          <section class="leftContentItem" v-for="(item, index) in newTapArr" :key="index"
            :class="newTabCurIndex == index ? 'leftContentItemActice' : ''" @click="handleNewTabClick(index)">
            <i :class="newTabCurIndex == index ? item.activeName : item.name"></i>
            <p>{{ item.category }}</p>
          </section>
        </article>

      </div>

      <div class="newMain">
        <!-- 推荐 最新 -->
        <main class="mainContainer">
          <article class="recomAndLatestContainer" v-if="piniaIfLogin && piniaFirstTag != 0 && piniaFirstTag != 4">
            <section v-for="(item, index) in tabArr" :key="index" class="tab"
              :class="index == activeTabIndex ? 'active' : ''" @click="activeTab(index)">
              {{ item }}
            </section>
          </article>

          <article class="recomAndLatestContainer" v-if="!piniaIfLogin && piniaFirstTag != 3">
            <section v-for="(item, index) in tabArr" :key="index" class="tab"
              :class="index == activeTabIndex ? 'active' : ''" @click="activeTab(index)">
              {{ item }}
            </section>
          </article>
        </main>
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
                  <el-skeleton-item variant="image" style="width: 120px; height: 120px; flex-shrink: 0;" />
                </div>

              </template>
            </el-skeleton>

          </template>

          <!-- 暂无文章数据 -->
          <template v-else-if="dataList.length == 0">
            <el-empty description="暂无文章数据" />
          </template>


          <template v-else>

            <!-- 已登录的文章列表 -->
            <template v-if="piniaIfLogin && piniaFirstTag != 0 && piniaFirstTag != 4">
              <div class="articleListContainer" v-for="(item, index) in dataList" :key="index"
                @click.stop="goToDetail(item.id)">
                <article class="articleLeftContent">

                  <section class="title">
                    {{ getTruncatedTitle(item.title) }}
                  </section>

                  <section class="content">
                    {{ getTruncatedContent(item.abstract, item.avatar)
                    }}
                  </section>

                  <section class="iconCon">
                    <section class="wordBox">
                      <p class="word">{{ item.author }}&nbsp;&nbsp;&nbsp;|</p>
                    </section>
                    <section class="wordBox">
                      <i class="icon iconfont icon-yanjing"></i>
                      <p class="word">{{ handleView(item.view) }}</p>
                    </section>
                    <section class="wordBox">
                      <i class="icon iconfont icon-zan" @click.stop="praiseChange(item.id)"
                        v-if="!item.praiseStatus"></i>
                      <i class="icon iconfont icon-zan1" @click.stop="praiseChange(item.id)" v-else></i>
                      <p class="word">{{ handlePraise(item.praise) }}</p>
                    </section>
                  </section>

                </article>

                <article class="articleRightContent">
                  <el-image v-if="item.coverImage != null" :src="item.coverImage" lazy></el-image>
                </article>
              </div>

              <!-- <router-view /> -->
            </template>


            <!-- 未登录的文章列表 -->
            <template v-if="!piniaIfLogin && piniaFirstTag != 3">


              <div class="articleListContainer" v-for="(item, index) in dataList" :key="index"
                @click.stop="goToDetail(item.id)">
                <article class="articleLeftContent">

                  <section class="title">
                    {{ getTruncatedTitle(item.title) }}
                  </section>

                  <section class="content">
                    {{ getTruncatedContent(item.abstract, item.avatar)
                    }}
                  </section>

                  <section class="iconCon">
                    <section class="wordBox">
                      <p class="word">{{ item.author }}&nbsp;&nbsp;&nbsp;|</p>
                    </section>
                    <section class="wordBox">
                      <i class="icon iconfont icon-yanjing"></i>
                      <p class="word">{{ handleView(item.view) }}</p>
                    </section>
                    <section class="wordBox">
                      <i class="icon iconfont icon-zan" @click.stop="praiseChange(item.id)"
                        v-if="!item.praiseStatus"></i>
                      <i class="icon iconfont icon-zan1" @click.stop="praiseChange(item.id)" v-else></i>
                      <p class="word">{{ handlePraise(item.praise) }}</p>
                    </section>
                  </section>

                </article>

                <article class="articleRightContent">
                  <el-image v-if="item.coverImage != null" :src="item.coverImage" lazy></el-image>
                </article>
              </div>

              <!-- <router-view /> -->
            </template>

          </template>



        </MeScroll>

      </div>



      <!-- 右侧排行榜 -->
      <div class="rightTotalContentContainer">
        <div class="rightContentContainer">
          <article class="signInContainer">
            <section class="signInContent">
              <div class="signInContentLeftBox">
                <h5>上午好!</h5>
                <p>点亮社区的每一天</p>
              </div>

              <div class="signInContentRightBox">
                <el-button type="primary" plain class="signInBtn">去签到</el-button>
              </div>
            </section>
          </article>

        </div>

        <!-- 文章榜 -->
        <Rank :title="paperRankTitle">
          <!-- icon -->
          <template v-slot:icon>
            <i class="icon iconfont icon-wenzhang" slot="icon"></i>
          </template>

          <!-- 内容体 -->
          <template v-slot:content>
            <section class="paperRecomandItemContainer">
              <div class="paperRecomandItem">
                <p class="topOne">1</p>
                <p>前端必会:Promise全解析,...</p>
              </div>

              <div class="paperRecomandItem">
                <p class="topTwo">2</p>
                <p>不要再用addEventListener了...</p>
              </div>

              <div class="paperRecomandItem">
                <p class="topThree">3</p>
                <p>2025年07月GitHub十...</p>
              </div>

              <div class="paperRecomandItem">
                <p class="other">4</p>
                <p>事务报错，为何数据还是插入...</p>
              </div>

              <div class="paperRecomandItem">
                <p class="other">5</p>
                <p>手写Promise静态方法:从原...</p>
              </div>

            </section>
          </template>

        </Rank>

        <!-- 作者榜 -->
        <Rank :title="authoRankTitle">
          <!-- icon -->
          <template v-slot:icon>
            <i class="icon iconfont icon-zuozhe" slot="icon"></i>
          </template>

          <!-- 内容体 -->
          <template v-slot:content>

            <section class="authorRecomandItemContainer">

              <article class="authorRecomandContentLeft">
                <div class="authorRecomandAvatar">
                  <a-avatar src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg" />
                </div>

                <div class="authorName">
                  <p>ErpanOmer</p>
                  <p>Web前端工程师&nbsp;@跨境</p>
                </div>
              </article>

              <article class="authorRecomandContentRight">
                <p>+&nbsp;&nbsp;关注</p>
              </article>

            </section>


            <section class="authorRecomandItemContainer">

              <article class="authorRecomandContentLeft">
                <div class="authorRecomandAvatar">
                  <a-avatar src="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" />
                </div>

                <div class="authorName">
                  <p>江城开朗的豌豆</p>
                  <p>高级前端开发工程师&nbsp;|...</p>
                </div>
              </article>

              <article class="authorRecomandContentRight">
                <p>+&nbsp;&nbsp;关注</p>
              </article>

            </section>

            <section class="authorRecomandItemContainer">

              <article class="authorRecomandContentLeft">
                <div class="authorRecomandAvatar">
                  <a-avatar src="https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg" />
                </div>

                <div class="authorName">
                  <p>CAD老兵</p>
                  <p>作者暂无简介</p>
                </div>
              </article>

              <article class="authorRecomandContentRight">
                <p>+&nbsp;&nbsp;关注</p>
              </article>

            </section>


            <section class="authorRecomandItemContainer">

              <article class="authorRecomandContentLeft">
                <div class="authorRecomandAvatar">
                  <a-avatar src="https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg" />
                </div>

                <div class="authorName">
                  <p>京东云开发者</p>
                  <p>技术运营@京东科技信...</p>
                </div>
              </article>

              <article class="authorRecomandContentRight">
                <p>+&nbsp;&nbsp;关注</p>
              </article>

            </section>

            <section class="authorRecomandItemContainer">

              <article class="authorRecomandContentLeft">
                <div class="authorRecomandAvatar">
                  <a-avatar src="https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg" />
                </div>

                <div class="authorName">
                  <p>前端开发爱好者</p>
                  <p>公众号@前端开发爱好者</p>
                </div>
              </article>

              <article class="authorRecomandContentRight">
                <p>+&nbsp;&nbsp;关注</p>
              </article>

            </section>
          </template>

        </Rank>

        <!-- 推荐话题 -->
        <Rank :title="topicRankTitle">
          <!-- 内容体 -->
          <template v-slot:content>

            <article class="topicItemContainer">

              <section class="topicItemLeft">
                <i class="icon iconfont icon-tuijianfuwu"></i>
                <p>#推荐每日一条沸点#</p>

              </section>

              <p class="distance">19.0m</p>

            </article>

            <article class="topicItemContainer">

              <section class="topicItemLeft">
                <i class="icon iconfont icon-tuijianfuwu"></i>
                <p>#Tra又又又更新了?#</p>

              </section>

              <p class="distance">572k</p>

            </article>

            <article class="topicItemContainer">

              <section class="topicItemLeft">
                <i class="icon iconfont icon-tuijianfuwu"></i>
                <p>#每日快讯#</p>

              </section>

              <p class="distance">8.8m</p>

            </article>

            <article class="topicItemContainer">

              <section class="topicItemLeft">
                <i class="icon iconfont icon-tuijianfuwu"></i>
                <p>#MCP 怎么玩#</p>

              </section>

              <p class="distance">523k</p>

            </article>

            <article class="topicItemContainer">

              <section class="topicItemLeft">
                <i class="icon iconfont icon-tuijianfuwu"></i>
                <p>#每日一个知识点#</p>

              </section>

              <p class="distance">39.0m</p>

            </article>

            <article class="topicItemContainer">

              <section class="topicItemLeft">
                <i class="icon iconfont icon-tuijianfuwu"></i>
                <p>#工作中做淂最正确得...#</p>

              </section>

              <p class="distance">308k</p>

            </article>

            <article class="topicItemContainer">

              <section class="topicItemLeft">

                <p>新人报道</p>

              </section>

              <p class="distance">619k</p>

            </article>


            <article class="topicItemContainer">

              <section class="topicItemLeft">
                <i class="icon iconfont icon-tuijianfuwu"></i>
                <p>#挖掘一周#</p>

              </section>

              <p class="distance">619k</p>

            </article>

            <article class="topicItemContainer">

              <section class="topicItemLeft">

                <p>#金石计划征文活动#</p>

              </section>

              <p class="distance">619k</p>

            </article>
          </template>

        </Rank>

        <div class="waring">
          <p>联系邮箱:18806678143@163.com</p>
          <p>该网站仅仅用作与学习用途，不用于其他任何用途，若有侵权，请联系邮箱!</p>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, Ref } from "vue";
import axios from "axios";
import MeScroll from "./MeScroll.vue";
import useMainStore from "../Store";
import { storeToRefs } from "pinia";
import { reqArticleList, reqPraisePaper } from "../api/api";
import { articleListParam, articleListId } from "../api/type/article";
import { useMessage } from '../utils/elementComponents/message'
import { forceLoginOut } from '../utils/repeatHooks'
import Rank from './Rank.vue'
import { useRouter } from 'vue-router'
const { userStore, useHeaderStore } = useMainStore();
let { piniaSecondTag, piniaFirstTag, piniaThirstTag, piniaToken, piniaIfLogin, piniaUserId } = storeToRefs(userStore);
let tabArr: string[] = ["推荐", "最新"];
const activeTabIndex = ref(0);
const activeTab = (index: number) => {
  activeTabIndex.value = index;
  piniaSecondTag.value = index;
  piniaThirstTag.value = 0;

};

const meScrollRef = ref(null);
const dataList = ref<any[]>([]);
// 骨架屏
const loading = ref(true); // 默认正在加载
let limit: Ref<number> = ref(10);
// 下拉刷新回调
const downCallback = (mescroll: any) => {
  loading.value = true;
  // 这里非常关键：重置上拉加载状态
  mescroll.resetUpScroll();
  // 然后再拉第一页数据
  fetchData(1, piniaFirstTag.value, piniaSecondTag.value, piniaThirstTag.value, limit.value, (curPageData: any) => {
    dataList.value = curPageData;
    loading.value = false;
    // 结束下拉刷新（注意这个是下拉的）
    mescroll.endSuccess();
  });
};



// 上拉加载回调
const upCallback = (page: any, mescroll: any) => {
  loading.value = true;
  fetchData(page.num, piniaFirstTag.value, piniaSecondTag.value, piniaThirstTag.value, limit.value, (curPageData: any) => {
    // 更新列表
    if (page.num === 1) {
      dataList.value = curPageData;
      loading.value = false;
    }
    else {
      dataList.value = dataList.value.concat(curPageData);
      loading.value = false;
    };
    // 结束上拉加载
    mescroll.endSuccess(curPageData.length);
  });
};

const fetchData = async (pageNum: number, firstTag: number, secondTag: number, thirstTag: number, limit: number, callback: (data: any[]) => void) => {
  try {
    const res = await reqArticleList({ firstTag, secondTag, thirstTag, page: pageNum, limit, piniaToken: piniaToken.value, piniaUserId: piniaUserId.value });
    // console.log("curpageData",res.data);

    if (res.code === 200 && Array.isArray(res.data)) {
      callback(res.data);
    } else {
      useMessage(res.message || "数据获取失败");
      callback([]); // 给个空数组，确保不会卡住
    }
  } catch (err) {
    console.error("fetchData error", err);
    useMessage("请求出错");
    callback([]);
  }
};

watch(piniaFirstTag, (newVal) => {
  // 当 piniaFirstTag 变化时，重置数据
  dataList.value = [];
  loading.value = true;
  downCallback(meScrollRef.value);
  // 重置上拉加载状态
  // if (meScrollRef.value) {
  //   meScrollRef.value.resetUpScroll();
  // }
});


watch(piniaSecondTag, (newVal) => {
  // 当 piniaSecondTag 变化时，重置数据
  dataList.value = [];
  loading.value = true;
  downCallback(meScrollRef.value);
  // 重置上拉加载状态
  // if (meScrollRef.value) {
  //   meScrollRef.value.resetUpScroll();
  // }
});

watch(piniaThirstTag, (newVal) => {
  // 当 piniaThirstTag 变化时，重置数据
  dataList.value = [];
  loading.value = true;
  downCallback(meScrollRef.value);
  // 重置上拉加载状态
  // if (meScrollRef.value) {
  //   meScrollRef.value.resetUpScroll();
  // }
});



const urls: string[] = [
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
  "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
  "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
  "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
  "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
  "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg",
];



// 设备宽度
const windowWidth = ref(window.innerWidth)
// 获取设备宽度
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// 截断函数
function getTruncatedTitle(fullTitle: string): string {
  const width = windowWidth.value
  let charCount: number = 100

  if (width < 330) charCount = 10
  else if (width < 400) charCount = 15
  else if (width < 460) charCount = 20
  else if (width < 500) charCount = 25
  else if (width < 550) charCount = 33
  else if (width < 2500) charCount = 40
  else charCount = fullTitle.length

  return fullTitle.length > charCount
    ? fullTitle.slice(0, charCount) + '...'
    : fullTitle
}



// 截断内容
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

const handlePraise = (praise: number) => {
  if (praise > 999) {
    praise = Math.round(praise / 1000 * 10) / 10;
    return praise + 'k'
  } else {
    return praise;
  }
};

const handleView = (view: number) => {
  if (view > 999) {
    view = Math.round(view / 1000 * 10) / 10;
    return view + 'k'
  } else {
    return view
  }
};

// 点赞 
const praiseChange = async (paperId: number) => {
  // console.log(paperId);
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

  const idx = dataList.value.findIndex(item => item.id === paperId);

  const updatedItem = {
    ...dataList.value[idx],
    praise: paperStatus.praiseNum,
    praiseStatus: paperStatus.praiseStatus,
  };
  // 替换更新
  dataList.value.splice(idx, 1, updatedItem);



  const currentDate = new Date().toDateString()

}
const paperRankTitle: string = '文章榜'
const authoRankTitle: string = '作者榜'
const topicRankTitle: string = '推荐话题'

type TabItem = {
  name: string
  activeName: string
  category: string
}

const newTapArr: TabItem[] = piniaIfLogin.value
  ? [
    { 'name': 'icon iconfont icon-guanzhuxuanzhong', 'activeName': 'icon iconfont icon-guanzhu', 'category': "关注" },
    { 'name': 'icon iconfont icon-compass-full', 'activeName': 'icon iconfont icon-bg-compass', 'category': "综合" },
    { 'name': 'icon iconfont icon-Abstract_xianshiping_display', 'activeName': 'icon iconfont icon-a-xianshiping1', 'category': "后端" },

    { 'name': 'icon iconfont icon-terminal-box-fill', 'activeName': 'icon iconfont icon-terminal-box-line', 'category': "前端" },
    { 'name': 'icon iconfont icon-paihang', 'activeName': 'icon iconfont icon-paihang', 'category': "排行榜" },
    { 'name': 'icon iconfont icon-android1', 'activeName': 'icon iconfont icon-android', 'category': "Android" },
    { 'name': 'icon iconfont icon-pingguo', 'activeName': 'icon iconfont icon-pingguo1', 'category': "iOS" },

    { 'name': 'icon iconfont icon-rengongzhinengdanao', 'activeName': 'icon iconfont icon-_rengongzhineng', 'category': "人工智能" },
    { 'name': 'icon iconfont icon-kaifagongju1', 'activeName': 'icon iconfont icon-kaifagongju', 'category': "开发工具" },
    { 'name': 'icon iconfont icon-keyboard-box-fill', 'activeName': 'icon iconfont icon-keyboard-box-line', 'category': "代码人生" },

    { 'name': 'icon iconfont icon-read-full', 'activeName': 'icon iconfont icon-read', 'category': "阅读" },

  ]
  : [
    { 'name': 'icon iconfont icon-compass-full', 'activeName': 'icon iconfont icon-bg-compass', 'category': "综合" },
    { 'name': 'icon iconfont icon-Abstract_xianshiping_display', 'activeName': 'icon iconfont icon-a-xianshiping1', 'category': "后端" },

    { 'name': 'icon iconfont icon-terminal-box-fill', 'activeName': 'icon iconfont icon-terminal-box-line', 'category': "前端" },
    { 'name': 'icon iconfont icon-paihang', 'activeName': 'icon iconfont icon-paihang', 'category': "排行榜" },
    { 'name': 'icon iconfont icon-android1', 'activeName': 'icon iconfont icon-android', 'category': "Android" },
    { 'name': 'icon iconfont icon-pingguo', 'activeName': 'icon iconfont icon-pingguo1', 'category': "iOS" },

    { 'name': 'icon iconfont icon-rengongzhinengdanao', 'activeName': 'icon iconfont icon-_rengongzhineng', 'category': "人工智能" },
    { 'name': 'icon iconfont icon-kaifagongju1', 'activeName': 'icon iconfont icon-kaifagongju', 'category': "开发工具" },
    { 'name': 'icon iconfont icon-keyboard-box-fill', 'activeName': 'icon iconfont icon-keyboard-box-line', 'category': "代码人生" },

    { 'name': 'icon iconfont icon-read-full', 'activeName': 'icon iconfont icon-read', 'category': "阅读" }];

let backThirstTag: string[] = ['全部', '后端', 'Java', 'Go', '架构', '面试', 'Spring Boot', 'Python', 'MySQL', '前端', 'Spring', 'Linux', '算法', 'HarmonyOS', '性能优化', 'JavaScript']
let frontThirstTag: string[] = ['全部', '前端', 'JavaScript', 'Vue.js', 'React.js', '面试', 'CSS', 'HarmonyOS', '后端', 'HTML', 'TypeScript', '前端框架', 'three.js', '架构', 'Node.js', 'Flutter'];
let androidThirstTag: string[] = ['全部', 'Android', '前端', 'Kotlin', 'HarmonyOS', '面试', 'Android Jetpack', 'Flutter', 'Java', 'IOS', '架构', '逆向', 'APP', '性能优化', 'Android Studio', '后端'];
let iOSThirstTag: string[] = ['全部', 'Swift', 'iOS', 'Apple', 'SwitftUI', '前端', 'Flutter', '变成语言', 'WWDC', '架构', 'Android', 'Xcode', 'APP', '数据库', '面试', 'Debug'];
let devThirstTag: string[] = ['全部', '后端', '前端', 'AI编程', 'Trae', '开源', 'GitHub', '低代码', '人工智能', 'HarmonyOS', '程序员', 'Python', 'Cursor', 'JavaScript', '数据库', '资讯'];
let AIThirstTag: string[] = ['全部', '人工智能', 'AI编程', 'LLM', 'AIGC', '后端', '前端', 'MCP', '程序员', '算法', 'Python', 'OpenAI', 'Agent', '深度学习', 'Trae', 'Cursor'];
let codeThirstTag: string[] = ['全部', '前端', '后端', 'Python', '程序员', '算法', 'HarmonyOS', 'Java', 'AI编程', 'GitHub', 'JavaScript', '数据库', '开源', '爬虫', '架构', '面试'];
let readThirstTag: string[] = ['全部', '程序员', '前端', '后端', '云原生', '算法', '人工智能', '面试', '大数据', 'Python', '数据库', 'Linux', 'JavaScript', 'LLM', '网络协议', 'AIGC'];
let thirstTag: Ref<string[]> = ref([]);

const newTabCurIndex: Ref<number> = piniaIfLogin ? ref(1) : ref(0);
const handleNewTabClick = (index: number) => {
  newTabCurIndex.value = index;
  piniaFirstTag.value = newTabCurIndex.value;

};

let activeThirstIndex: Ref<number> = ref(0);

const activeThirstTag = (index: number) => {
  activeThirstIndex.value = index;
  piniaThirstTag.value = index;
}

watch(piniaFirstTag, (newVal) => {
  activeThirstIndex.value = 0; // 重置 thirstTag 的索引
  piniaThirstTag.value = 0;


});



const changeThirstTag = (index: number) => {
  if (!piniaIfLogin.value) {

    switch (index) {
      case 1:
        thirstTag.value = backThirstTag;
        break;
      case 2:
        thirstTag.value = frontThirstTag;
        break;
      case 4:
        thirstTag.value = androidThirstTag;
        break;
      case 5:
        thirstTag.value = iOSThirstTag;
        break;
      case 6:
        thirstTag.value = devThirstTag;
        break;
      case 7:
        thirstTag.value = AIThirstTag;
        break;
      case 8:
        thirstTag.value = codeThirstTag;
        break;
      case 9:
        thirstTag.value = readThirstTag;
        break;
      default:
        thirstTag.value = [];
    }
  } else {
    switch (index) {
      case 2:
        thirstTag.value = backThirstTag;
        break;
      case 3:
        thirstTag.value = frontThirstTag;
        break;
      case 5:
        thirstTag.value = androidThirstTag;
        break;
      case 6:
        thirstTag.value = iOSThirstTag;
        break;
      case 7:
        thirstTag.value = devThirstTag;
        break;
      case 8:
        thirstTag.value = AIThirstTag;
        break;
      case 9:
        thirstTag.value = codeThirstTag;
        break;
      case 10:
        thirstTag.value = readThirstTag;
        break;
      default:
        thirstTag.value = [];
    }
  }

};

const router = useRouter()

// 跳转到文章详情页
const goToDetail = (id: number) => {
  router.push(`/paper/${id}`)
}
</script>

<style scoped lang="scss">
// 初始化
* {
  margin: 0 !important;
  padding: 0 !important;
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

.mainContainer {
  // margin-top: 12px !important;
  // margin-right: 10px !important;
  // margin-left: 10px !important;
  // margin-bottom: -10px !important;
  // background-color: aqua;
}

.recomAndLatestContainer {
  @extend .start;
  // margin: 0 auto !important;
  // margin-left:px !important;
  // margin-top: -50px !important;
  // background-color: red !important;
  border-bottom: 2px solid #e4e6eb;
  position: relative;
  z-index: 1;
  padding-bottom: 8px !important;
  padding-top: 15px !important;
  padding-left: 10px !important;
  padding-bottom: 12px !important;
  background-color: white;
  // max-width: 900px;
  margin: 0 auto !important;

  section {
    padding: 10px 16px;
    font-size: 16px;
    color: #666;
    cursor: pointer;
    position: relative;
    margin-right: 20px !important;
  }

  .active {
    color: #000;
  }

  .tab.active::after {
    content: "";
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 3px;
    background-color: #1677ff;
    border-radius: 2px;
  }
}

.item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.list-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.praiseAndTitleContainer {
  flex: 1;
  min-width: 0; // 防止内容撑爆

  display: flex;
  flex-direction: column;
  // background-color: yellow !important;
}

.paperContainer {
  position: relative;
  z-index: -1;
  width: 100%;
  cursor: pointer;
  padding: 15px !important;
  // background-color: red;
  background-color: white;

  .paperContentAndImage {
    display: flex;
    justify-content: flex-start !important;
    margin-top: 5px !important;
    background-color: purple;
    max-width: 40%;

    .paperContent {
      font-size: 12px !important;
      // background-color: blue;
      margin-top: 5px !important;
      color: #9198a5;
    }

    .world {
      font-size: 12px;
      color: #8a919f;
    }

    .wordContainer {
      @extend .center;
      cursor: pointer;
      margin-right: 5px !important;

      // text-align: center;
      .world {
        margin-top: -3px !important;
      }

      .icon {
        margin-right: 5px !important;
        @extend .center;
      }

      .world:nth-child(1) {
        white-space: nowrap !important;
      }
    }

    // .el-image {
    //   margin-left: 15px !important;
    // }

    .iconContainer {
      @extend .start;
      flex-wrap: nowrap !important;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .wordContainer {
        display: flex;
        align-items: center;
        font-size: 14px;

        .icon {
          margin-right: 4px;
        }
      }
    }


    /* 基础样式 */
    .el-image {
      width: 100%;
      aspect-ratio: 106 / 69;
      display: block;
      margin: 0 auto;

      width: 120px; // 固定宽度
      height: auto;
      flex-shrink: 0; // 不被压缩
      display: block;

      width: 120px;
      height: 80px;
      flex-shrink: 0;
      margin-left: 160px !important;
      object-fit: cover;
      border-radius: 6px;
    }

    @media screen and (max-width: 321px) {
      .el-image {
        max-width: 120px;
      }
    }

    @media screen and (min-width: 321px) and (max-width: 376px) {
      .el-image {
        max-width: 120px;
      }
    }

    @media screen and (min-width: 376px) and (max-width: 426px) {
      .el-image {
        max-width: 120px;
      }
    }

    @media screen and (min-width: 426px) and (max-width: 454px) {
      .el-image {
        max-width: 120px;
      }
    }

    @media screen and (min-width: 454px) and (max-width: 510px) {
      .el-image {
        max-width: 120px;
      }
    }

    @media screen and (min-width: 511px) and (max-width: 541px) {
      .el-image {
        max-width: 120px;
      }
    }

    @media screen and (min-width: 541px) and (max-width: 581px) {
      .el-image {
        max-width: 120px;
      }
    }

    @media screen and (min-width: 581px) and (max-width: 621px) {
      .el-image {
        max-width: 120px;
      }
    }

    @media screen and (min-width: 621px) and (max-width: 712px) {
      .el-image {
        max-width: 120px;
      }
    }

    @media screen and (min-width: 712px) and (max-width: 840px) {
      .el-image {
        max-width: 120px;
      }
    }

    @media screen and (min-width: 840px) and (max-width: 941px) {
      .el-image {
        max-width: 120px;
      }
    }

    @media screen and (min-width: 941px) and (max-width: 1041px) {
      .el-image {
        max-width: 120px;
      }
    }

    @media screen and (min-width: 1041px) and (max-width: 1226px) {
      .el-image {
        max-width: 120px;
      }
    }

    @media screen and (min-width: 1226px) and (max-width: 1441px) {
      .el-image {
        max-width: 120px;
      }
    }

    @media screen and (min-width: 1441px) {
      .el-image {
        max-width: 120px;
      }
    }
  }
}

.articleListContainer:hover {
  background-color: #F7F8FA;
}

.articleListContainer {
  // @extend .start;
  @extend .between;
  // max-width: 1200px;
  // width: 80%;
  background-color: white;
  // background-color: blue;
  // gap: 0;
  /* 移除间距 */
  // margin: 0px 10px !important;
  // max-width: 900px;
  // max-width: 35%;
  padding: 15px !important;
  user-select: none;
  cursor: pointer;
  margin: 0 auto !important;

  .articleLeftContent {
    margin-right: 20px !important;
  }

  .content {
    margin: 10px 0 !important;
    color: #8A919F;
    font-size: 12px;
  }

  .iconCon {
    @extend .start;
    color: #8A919F;
    font-size: 12px;

    .wordBox {
      @extend .center;
    }

    .icon {
      margin-right: 5px !important;
    }

    .word {
      margin-right: 5px !important;
    }
  }

  .el-image {
    width: 100px !important;
    border-radius: 5px;
  }
}


.title {
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-skeleton-itemLeft {
  display: block;
  height: 16px !important;
  width: 50%;
  margin-bottom: 12px !important;

}

.mainContentContainer {
  display: flex;
  justify-content: flex-start !important;
  // display: flex;
  // align-items: flex-start; // 子元素顶部对齐
  margin-top: 10px !important;


  // padding: 10px 260px !important;
  // background-color: red;
  .leftContentContainer {
    @extend .center;
    user-select: none;
    height: 80%;
    background-color: white !important;
    // background-color: red !important;
    border-radius: 5px;

    /* 移除间距 */
    display: none;

    .leftContent {
      // display: flex;
      // flex-direction: column;


      .leftContentItem {
        @extend .between;
        padding: 10px !important;
        background-color: white;

        .icon {
          margin-right: 15px !important;
          font-size: 20px !important;
        }

        cursor: pointer;

        p {
          width: 130px;
          // white-space: nowrap;
          color: #616B7D;
        }

        margin: 10px !important;
      }

      .leftContentItemActice {
        background-color: #EAF2FF;
        border-radius: 5px;

        p {
          color: #2C88FF !important;
        }
      }
    }


  }


}

.rightContentContainer {
  @extend .center;
  // display: flex;
  // flex-direction: column;
  // background-color: red;
  background-color: white;
  border-radius: 5px;
  padding: 15px 10px !important;
  margin-bottom: 20px !important;

  .signInContainer {
    user-select: none;

    .signInContent {
      @extend .between;
      padding: 10px 20px !important;

      .signInContentLeftBox {
        width: 90px;
        margin-right: 40px !important;
        display: flex;
        flex-direction: column;

        // background-color: red;
        p {
          color: $defaultWordColor;
          font-size: 11px;
          margin-top: 5px !important;


        }
      }


      .signInBtn {
        padding: 10px 5px !important;
        font-size: 12px !important;
      }

      .signInBtn:hover {
        background-color: #E8F2FF;
        color: #1171EE;
      }
    }
  }

}

.paperRecomandContainer {
  background-color: white;
  padding: 20px !important;
  border-radius: 10px;

  .paperRankContainer {
    @extend .between;
    margin-bottom: 10px !important;

    .paperRankLeftContent {
      @extend .between;
      color: #252933;

      .iconfont {
        font-size: 20px;
        margin-right: 5px !important;
      }

    }

    .changeRightContent {
      @extend .center;
      text-align: center;

      .iconfont {
        margin-top: 2px !important;
      }
    }

    .changeWord {
      color: $defaultWordColor;
      font-size: 12px;
      cursor: pointer;

    }

    .el-divider {
      border-color: #F1F2F5 !important;
    }
  }
}

.paperRecomandItemContainer {
  // background-color: aqua;
  margin-top: 15px !important;
  cursor: pointer;

  .paperRecomandItem {
    @extend .start;
    margin-bottom: 10px !important;

    p:nth-child(1) {
      margin-right: 10px !important;
      font-weight: 600;
      font-size: 15px !important;
      // color: red !important;
      // background-color: linear-gradient(180deg, #f64242 20%, rgba(246, 66, 66, .4) 80%) !important;

    }

    p:nth-child(2) {
      margin-left: 10px !important;
      font-size: 13px !important;
      color: #343741;
    }

    .topOne {
      background: linear-gradient(180deg, #f64242 20%, rgba(246, 66, 66, 0.4) 80%);
      background-clip: text;
      color: transparent;
    }

    .topTwo {
      background: linear-gradient(180deg, #ff7426 20%, rgba(255, 116, 38, .4) 80%);
      background-clip: text;
      color: transparent;
    }

    .topThree {
      background: linear-gradient(180deg, #ffac0c 20%, rgba(255, 172, 12, .4) 80%);
      background-clip: text;
      color: transparent;
    }

    .other {
      color: gray;
    }
  }


}


.seeMoreContainer {
  @extend .center;
  margin-top: 10px !important;

  p {
    color: $defaultWordColor;
    font-size: 14px;
    cursor: pointer;
  }

}

.authorRecomandItemContainer {
  @extend .between;
  margin: 12px 0px !important;
  cursor: pointer;

  .authorRecomandContentLeft {
    @extend .start;


    .authorName {
      margin-left: 5px !important;
      font-size: 11px;

      p:nth-child(1) {
        margin-bottom: 5px !important;
      }

      p:nth-child(2) {
        color: #515767;
      }
    }
  }

  .authorRecomandContentRight {
    color: #1E80FF;
    font-size: 12px;
    margin-left: 10px !important;
    cursor: pointer;
  }





}

.topicItemContainer {
  @extend .between;
  margin: 10px 0px !important;
  cursor: pointer;

  .topicItemLeft {
    @extend .start;

    p {
      margin-left: 5px !important;
      font-size: 14px;
    }
  }

  .distance {
    color: #949AA7;
    font-size: 12px !important;
  }
}


.waring {
  p {
    font-size: 10px;
  }

  p:nth-child(1) {
    color: #8A919F !important;
  }

  p:nth-child(2) {
    color: red !important;
  }
}

.rightTotalContentContainer {
  // background-color: aqua;
  display: none;
}


@media screen and (min-width: 1001px) {
  .rightTotalContentContainer {
    display: block;
  }
}

// .leftContentContainer {
//   display: none;
// }

@media screen and (min-width: 1221px) {
  .leftContentContainer {
    display: block !important;
  }

}


@media screen and (min-width:1250px) and (max-width:1300px) {
  .mainContentContainer {
    padding: 0px 50px !important;
  }


}

@media screen and (min-width:1300px) and (max-width:1350px) {
  .mainContentContainer {
    padding: 0px 100px !important;
  }


}

@media screen and (min-width:1350px) and (max-width:1400px) {
  .mainContentContainer {
    padding: 0px 120px !important;
  }


}

@media screen and (min-width:1400px) and (max-width:1450px) {
  .mainContentContainer {
    padding: 0px 130px !important;
  }


}

@media screen and (min-width:1450px) and (max-width:1650px) {
  .mainContentContainer {
    padding: 0px 200px !important;
  }


}

@media screen and (min-width:1650px) and (max-width:1850px) {
  .mainContentContainer {
    padding: 0px 250px !important;
  }


}

@media screen and (min-width:1850px) {
  .mainContentContainer {
    padding: 0px 300px !important;
  }


}

.el-empty {
  overflow: hidden !important;
}


.newMain {
  flex: 1;
  min-width: 0;
  margin: 0 10px !important;
  width: 80% !important;
  // padding: 0 200px !important;
  // background-color: orange;
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
}

// .skeleton-left {
//   flex: 1;
// }

// .skeleton-right {
//   width: 120px;
//   height: 120px;
//   flex-shrink: 0;
// }</style>