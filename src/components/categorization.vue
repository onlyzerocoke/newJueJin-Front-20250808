<template>
  <div class="main">

    <div class="nav-scroll-container">
      <div class="nav-items" v-for="(item, index) in tapArr" :key="index">
        <span class="nav-item" :class="{ active: activeIndex === index }" @click="setActive(index)">
          {{ item }}
        </span>
      </div>
    </div>

    <article class="thirstTagContainer" v-if="!piniaIfLogin && piniaFirstTag != 0 && piniaFirstTag != 3">

      <section class="thirstTag" v-for="(item, index) in thirstTag" :key="index" @click="activeThirstTag(index)"
        :class="{ 'activeThirstTag': activeThirstIndex === index }">
        {{ item }}
      </section>

    </article>

    <article class="thirstTagContainer"
      v-if="piniaIfLogin && piniaFirstTag !== 0 && piniaFirstTag !== 1 && piniaFirstTag !== 4">

      <section class="thirstTag" v-for="(item, index) in thirstTag" :key="index" @click="activeThirstTag(index)"
        :class="{ 'activeThirstTag': activeThirstIndex === index }">
        {{ item }}
      </section>

    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from "vue";
import { storeToRefs } from "pinia";
import useMainStore from "../Store";
import { articleListParam } from "../api/type/article";
import { reqArticleList } from "../api/api";
let { userStore } = useMainStore();
let { piniaIfLogin, piniaFirstTag, piniaThirstTag } = storeToRefs(userStore);
// Import statements and logic go here
let tapArr: string[] = piniaIfLogin.value
  ? [
    "关注",
    "综合",
    "后端",
    "前端",
    "排行榜",
    "Android",
    "iOS",
    "人工智能",
    "开发工具",
    "代码人生",
    "阅读",
  ]
  : [
    "综合",
    "后端",
    "前端",
    "排行榜",
    "Android",
    "iOS",
    "人工智能",
    "开发工具",
    "代码人生",
    "阅读",
  ];

let backThirstTag: string[] = ['全部', '后端', 'Java', 'Go', '架构', '面试', 'Spring Boot', 'Python', 'MySQL', '前端', 'Spring', 'Linux', '算法', 'HarmonyOS', '性能优化', 'JavaScript']
let frontThirstTag: string[] = ['全部', '前端', 'JavaScript', 'Vue.js', 'React.js', '面试', 'CSS', 'HarmonyOS', '后端', 'HTML', 'TypeScript', '前端框架', 'three.js', '架构', 'Node.js', 'Flutter'];
let androidThirstTag: string[] = ['全部', 'Android', '前端', 'Kotlin', 'HarmonyOS', '面试', 'Android Jetpack', 'Flutter', 'Java', 'IOS', '架构', '逆向', 'APP', '性能优化', 'Android Studio', '后端'];
let iOSThirstTag: string[] = ['全部', 'Swift', 'iOS', 'Apple', 'SwitftUI', '前端', 'Flutter', '变成语言', 'WWDC', '架构', 'Android', 'Xcode', 'APP', '数据库', '面试', 'Debug'];
let devThirstTag: string[] = ['全部', '后端', '前端', 'AI编程', 'Trae', '开源', 'GitHub', '低代码', '人工智能', 'HarmonyOS', '程序员', 'Python', 'Cursor', 'JavaScript', '数据库', '资讯'];
let AIThirstTag: string[] = ['全部', '人工智能', 'AI编程', 'LLM', 'AIGC', '后端', '前端', 'MCP', '程序员', '算法', 'Python', 'OpenAI', 'Agent', '深度学习', 'Trae', 'Cursor'];
let codeThirstTag: string[] = ['全部', '前端', '后端', 'Python', '程序员', '算法', 'HarmonyOS', 'Java', 'AI编程', 'GitHub', 'JavaScript', '数据库', '开源', '爬虫', '架构', '面试'];
let readThirstTag: string[] = ['全部', '程序员', '前端', '后端', '云原生', '算法', '人工智能', '面试', '大数据', 'Python', '数据库', 'Linux', 'JavaScript', 'LLM', '网络协议', 'AIGC'];
let thirstTag: Ref<string[]> = ref([]);

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
const activeIndex: Ref<number> = piniaIfLogin.value ? ref(1) : ref(0); // 当前选中的 tab 索引，默认第一个为 active
piniaFirstTag.value = activeIndex.value;
const setActive = async (index: number) => {
  activeIndex.value = index;
  piniaFirstTag.value = activeIndex.value;
  changeThirstTag(index);
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

// 初始化

.nav-scroll-container {
  margin-top: 5px !important;
  overflow-x: auto;
  /* 横向滚动 */
  overflow-y: hidden;
  /* 禁止垂直滚动 */
  white-space: nowrap;
  /* 不换行显示 */
  -webkit-overflow-scrolling: touch;
  /* iOS 惯性滚动 */
  background-color: #ffffff;
}

.nav-items {
  display: inline-flex;
  /* 横向排列 */
  padding: 8x 5px !important;
}

.nav-item {
  display: inline-block;
  font-size: 15px;
  color: #666;
  cursor: pointer;
  padding: 12px !important;
}

.nav-item.active {
  color: #1e80ff;
  font-weight: 600;
}

.nav-item.active {
  color: #1e80ff;
}

.thirstTagContainer {
  // width: 90%;
  // background-color: yellow;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px !important;
  margin-left: 15px !important;

  section {
    margin-right: 15px !important;
    // background-color: aqua;
    margin-bottom: 10px !important;
    color: #909090;
    font-size: 13.5px;
    padding: 5px 10px !important;
    cursor: pointer;

  }
}

.activeThirstTag {
  color: white !important;
  border-radius: 20px !important;
  background-color: #1E80FF;
}

@media screen and (min-width: 1221px) {
  .thirstTagContainer {
    display: none;
  }

  .nav-items {
    display: none;
  }

}
</style>