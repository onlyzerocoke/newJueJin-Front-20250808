<template>
  <div class="root">


    <main class="main">
      <!-- 图标 -->
      <div class="leftIconPlaceholder">
        <div class="leftIconContainer">
          <section v-if="showElement">
            <div class="avatar">
              <div>
                <a-avatar class="userAvatar"
                  src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg"></a-avatar>
              </div>


            </div>
            <p class="follow">关注</p>
          </section>

          <article class="iconContent" v-for="(item, index) in iconArr" :key=index>
            <i :class="currentIndex == index ? item.activeName : item.defaultName"
              @mouseenter="ifEnterIcon(true, index)" @mouseleave="ifEnterIcon(false, index)"></i>
          </article>
        </div>
      </div>
      <!-- 文章内容 -->
      <div class="paperContainer">
        <section class="back" @click="backIndex">
          <i class="icon iconfont icon-xiangzuojiantou"></i>
        </section>

        <article class="paperContent">
          <h1>Flutter 使用 AI Curs用 AI Curs用 AI Curs用 AI Curs用 AI Curs用 AI Curs用 AI Curs用 AI Curs用 AI Curs用 AI Curs用 AI
            Curs用 AI Curs用 AI Curs用 AI Curs用 AI Curs</h1>
        </article>

        <article class="infoContainer">
          <p class="authorName">Ausey</p>
          <P class="date">2025-08-06</P>
          <section class="view">
            <i class="icon iconfont icon-yanjing"></i>
            <span>56</span>
          </section>

        </article>

        <article class="paperDeatail">
          <div></div>
        </article>

        <article class="commentContainer">
          <div class="commentContent">
            <h3>评论&nbsp;{{ totalCommentNum }}</h3>

            <div class="imageAndEditorContianer">

              <article class="imageAndEditorContent">

                <section class="userAvatar" v-if="piniaIfLogin">
                  <a-avatar class="userAvatar" :src="piniaAvatar"></a-avatar>
                </section>

                <section class="userAvatar" v-else>
                  <a-avatar class="userAvatar"
                    src="https://i.postimg.cc/sXjP3kFs/a4fa5161369727154bc3a7d1c52bb9c0.png"></a-avatar>
                </section>


                <TinyMce ref="editorRef" v-model="mdlValue.fullText" :toolbar="toolbar" :width="480" :height="100"
                  :menubar="''" v-if="piniaIfLogin" />

                <div class="fakeEditorContainer" v-else>
                  <article class="loginBtnContainer">
                    <el-button type="primary" class="loginBtn" @click="open = true">登录&nbsp;|&nbsp;注册
                    </el-button>
                    <p>即可发布评论!</p>
                  </article>
                </div>

              </article>

            </div>
          </div>



        </article>

        <article class="btnContainer">
          <div class="blankBox"></div>
          <el-button type="primary" class="sendBtn" @click="sendParentComment" v-if="piniaIfLogin">发送</el-button>
        </article>

        <article class="latestAndNewArrContainer">

          <section v-for="(item, index) in latestAndNewArr" :key="index" @click="ifCurrentClick(index)"
            :class="latestCurrentIndex == index ? 'activeColor' : ''">
            {{ item }}
          </section>

        </article>

        <template v-if="loading">
          <skeleton :loading="loading"></skeleton>
        </template>


        <!-- 用户评论 -->
        <template v-else-if="commentList.length > 0">
          <article class="parentCommentContainer">

            <section v-for="(item, index) in commentList" :key="index">
              <div class="parentCommentContent">

                <section class="vistorAvatar">
                  <a-avatar class="userAvatar" :src="item.avatar"></a-avatar>
                </section>


                <section class="rightCommentContent">

                  <section class="userInfo">
                    <article class="nameAndOccupation">
                      <p class="name">
                        {{ item.name }}
                      </p>

                      <p class="occupation" v-if="item.occupation != null">
                        {{ item.occupation }}
                      </p>
                    </article>
                  </section>


                  <p class="comment" v-html="item.content">

                  </p>


                  <section class="praiseAndDateContainer">
                    <section class="userReply">
                      <p class="date">
                        {{ timeAgo(item.created_at) }}
                      </p>

                      <div class="praiseContainer">
                        <i class="icon iconfont icon-zan1" v-if="item.praiseStatus" @click="commentPraise(item.id)"></i>
                        <i class="icon iconfont icon-zan" v-else @click="commentPraise(item.id)"></i>
                        <p>{{ item.like_count > 0 ? item.like_count : '点赞' }}</p>
                      </div>

                      <!-- 新增内容--回复父评论 -->
                      <div class="toPraiseContainer" v-if="replyingCommentId === item.id && piniaIfLogin">
                        <i class="icon iconfont icon-pinglunshixin"></i>
                        <p class="cancelReplyWord" @click="replyingCommentId = null">取消回复</p>
                      </div>

                      <!-- 新增内容 item要变为ktem或jtem-->
                      <div class="toPraiseContainer" @click="showReplyEditor(item.id)" v-else>
                        <i class="icon iconfont icon-pinglun"></i>
                        <p>{{ item.children.length > 0 ? item.children.length : '回复' }}</p>
                      </div>


                    </section>


                    <!-- 新增内容 -->
                    <!-- 富文本编辑器（只在当前回复的评论下显示） -->
                    <div v-if="replyingCommentId === item.id && piniaIfLogin" class="replyEditor">
                      <TinyMce v-model="replyContentMap[item.id]" :toolbar="toolbar" :width="480"
                        @input="(val) => replyContentMap[item.id] = val" :height="100" :menubar="''" />

                      <section class="replyBtnContainer">
                        <div class="blankBox">

                        </div>
                        <el-button type="primary" size="small" @click="sendReply(item.id, 0, item.name, item.id)"
                          class="replyBtn">发送</el-button>
                      </section>
                    </div>

                  </section>
                </section>


              </div>

              <div class="childrenCommentContainer">
                <template v-for="(jtem, index) in item.children">
                  <article class="childrenCommentContent">

                    <section class="childrenCommentTop">
                      <section class="sonVistorAvatar">
                        <a-avatar class="sonUserAvatar" :src="jtem.avatar"></a-avatar>
                      </section>
                      <section class="nickName">
                        <p class="vistorName">{{ jtem.name }}</p>
                        <p class="authorSymbol" v-if="jtem.user_id == authorid">作者</p>
                        <p v-if="jtem.type==1">回复{{ jtem.replyname }}</p>
                        <p class="symbol">:</p>
                        <p class="sonComment" v-html="jtem.content">

                        </p>
                      </section>


                    </section>

                    <section class="childrenCommentBottom">

                      <section class="praiseAndDateContainer">
                        <p class="date">
                          {{ timeAgo(jtem.created_at) }}
                        </p>

                        <div class="praiseContainer">
                          <i class="icon iconfont icon-zan1" v-if="jtem.praiseStatus"
                            @click="commentPraise(jtem.id)"></i>
                          <i class="icon iconfont icon-zan" v-else @click="commentPraise(jtem.id)"></i>
                          <p>{{ jtem.like_count > 0 ? jtem.like_count : '点赞' }}</p>
                        </div>

                        <!-- 新增内容--回复子评论 -->
                        <div class="toPraiseContainer" v-if="replyingCommentId === jtem.id && piniaIfLogin">
                          <i class="icon iconfont icon-pinglunshixin"></i>
                          <p class="cancelReplyWord" @click="replyingCommentId = null">取消回复</p>
                        </div>


                        <!-- 新增内容 item要变为ktem或jtem-->
                        <div class="toPraiseContainer" @click="showReplyEditor(jtem.id)" v-else>
                          <i class="icon iconfont icon-pinglun"></i>
                          <p>回复</p>
                        </div>

                      </section>

                      <!-- 新增内容 -->
                      <!-- 富文本编辑器（只在当前回复的评论下显示） -->
                      <div v-if="replyingCommentId === jtem.id && piniaIfLogin" class="replyEditor">
                        <TinyMce v-model="replyContentMap[jtem.id]" :toolbar="toolbar" :width="480" :height="100"
                          :menubar="''" @input="(val) => replyContentMap[jtem.id] = val" />

                        <section class="replyBtnContainer">
                          <div class="blankBox">

                          </div>
                          <el-button type="primary" size="small" @click="sendReply(jtem.id, 1, jtem.name, item.id)"
                            class="replyBtn">发送</el-button>
                          <!-- <p>{{ jtem.name }}</p> -->
                        </section>
                      </div>
                    </section>
                  </article>

                  <!-- <article class="childrenCommentContent" v-for="(ktem, index) in jtem.son">

                    <section class="childrenCommentTop">
                      <section class="sonVistorAvatar">
                        <a-avatar class="sonUserAvatar" :src="ktem.avatar"></a-avatar>
                      </section>
                      <section class="nickName">
                        <p class="vistorName">{{ ktem.name }}</p>
                        <p class="authorSymbol" v-if="ktem.user_id == authorid">作者</p>
                        <p>回复</p>
                        <p>{{ ktem.replyname }}</p>
                        <p class="symbol">:</p>
                        <p class="sonComment" v-html="ktem.content">

                        </p>
                      </section>


                    </section>

                    <section class="childrenCommentBottom">

                      <section class="praiseAndDateContainer">
                        <p class="date">
                          {{ timeAgo(ktem.created_at) }}
                        </p>

                        <div class="praiseContainer">
                          <i class="icon iconfont icon-zan1" v-if="ktem.praiseStatus"
                            @click="commentPraise(ktem.id)"></i>
                          <i class="icon iconfont icon-zan" v-else @click="commentPraise(ktem.id)"></i>
                          <p>{{ ktem.like_count > 0 ? ktem.like_count : '点赞' }}</p>
                        </div>

                        新增内容--回复子评论
                        <div class="toPraiseContainer" v-if="replyingCommentId === ktem.id && piniaIfLogin">
                          <i class="icon iconfont icon-pinglunshixin"></i>
                          <p class="cancelReplyWord" @click="replyingCommentId = null">取消回复</p>
                        </div>


                        新增内容 item要变为ktem或jtem
                        <div class="toPraiseContainer" @click="showReplyEditor(ktem.id)" v-else>
                          <i class="icon iconfont icon-pinglun"></i>
                          <p>回复</p>
                        </div>

                      </section>
                      新增内容
                      富文本编辑器（只在当前回复的评论下显示）
                      <div v-if="replyingCommentId === ktem.id && piniaIfLogin" class="replyEditor">
                        <TinyMce v-model="replyContentMap[ktem.id]" :toolbar="toolbar" :width="480" :height="100"
                          :menubar="''" @input="(val) => replyContentMap[ktem.id] = val" />

                        <section class="replyBtnContainer">
                          <div class="blankBox">

                          </div>
                          <el-button type="primary" size="small" @click="sendReply(ktem.id, 1, ktem.name, item.id)"
                            class="replyBtn">发送</el-button>
                        </section>
                      </div>

                    </section>
                  </article> -->
                </template>

              </div>
            </section>


            <template v-if="commentList.length == 3">
              <el-button type="info" plain class="remainCommentBtn" @click="getCommentList(true)">
                <p class="remainCommentBtnWord">查看全部{{ remainCommentNum }}条评论</p><el-icon class="el-icon--right">
                  <ArrowDown />
                </el-icon>
              </el-button>
            </template>


          </article>
        </template>

        <!-- 无评论 -->
        <template v-else>
          <blankData message="暂无评论数据"></blankData>
        </template>

      </div>

      <!-- 作者信息 -->
      <div class="rightPersonInfoContainer">
        <article class="rightPersonContent">
          <article class="baseInfo">
            <section class="authorAvatar">
              <a-avatar class="userAvatar"
                src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg"></a-avatar>
            </section>

            <section class="nameAndOccupationContainer">
              <p class="name">皮蛋小精灵</p>
              <p class="occupation">前端开发</p>

            </section>
          </article>

          <div class="paperNumAndFansContainer">
            <article class="paperNumAndFansContent">
              <section class="paperNumAndFansItem">
                <p>98</p>
                <p>文章</p>
              </section>

              <section class="paperNumAndFansItem">
                <p>28k</p>
                <p>阅读</p>
              </section>

              <section class="paperNumAndFansItem">
                <p>51</p>
                <p>粉丝</p>
              </section>

            </article>

            <article class="btnContainer">
              <el-button type="primary" class="focus">关注</el-button>
              <el-button type="primary" plain class="private">私信</el-button>
            </article>


          </div>
        </article>

      </div>

    </main>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref, Ref, onMounted, onBeforeUnmount, reactive } from 'vue';
import { storeToRefs } from "pinia";
import type { sendParentParam, getCommentParam, addCommentPraiseParam, replyCommentParam } from '../api/type/comment'
import '@opentiny/fluent-editor/style.css';
import skeleton from './skeleton.vue';
import { useRouter } from 'vue-router'
import TinyMce from './Tinymce/index.vue'
import {
  ArrowDown
} from '@element-plus/icons-vue'
import { useMessage } from '../utils/elementComponents/message'
import useMainStore from '../Store/index'
import { reqParentComment, reqCommentList, reqPraiseComment, reqReplyComment } from '../api/api';
import { forceLoginOut } from '../utils/repeatHooks'
import blankData from '../components/blankData.vue'
const { userStore, useHeaderStore } = useMainStore();
const { piniaUserId, piniaAvatar, piniaIfLogin } = storeToRefs(userStore);
let { open } = storeToRefs(useHeaderStore);
const route = useRoute()
let paperId = route.params.id as string;
const showElement = ref(false);



type typeIcon = {
  defaultName: string,
  activeName: string
}
// 图标名称
const iconArr: typeIcon[] = [
  { 'defaultName': 'icon iconfont icon-dianzan', 'activeName': 'icon iconfont icon-dianzan_kuai' },
  { 'defaultName': 'icon iconfont icon-bg-chat', 'activeName': 'icon iconfont icon-duihua' },
  { 'defaultName': 'icon iconfont icon-shoucang-yishoucang', 'activeName': 'icon iconfont icon-a-shoucang-yishoucang' },
  { 'defaultName': 'icon iconfont icon-fenxiangyifenxiang', 'activeName': 'icon iconfont icon-fenxiang' },
  { 'defaultName': 'icon iconfont icon-xinfangjubao', 'activeName': 'icon iconfont icon-jubao' },
  { 'defaultName': 'icon iconfont icon-saomiao1', 'activeName': 'icon iconfont icon-saomiao' }]
const handleScroll = () => {
  showElement.value = window.scrollY >= 200;
};





onMounted(() => {
  getCommentList(false)
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

let ifEnter: Ref<boolean> = ref(false);
let currentIndex: Ref<number> = ref(-1);
const ifEnterIcon = (flag: boolean, index: number) => {

  ifEnter.value = flag;
  currentIndex.value = index;
  if (flag == false) {
    //移出Icon之后就重置
    currentIndex.value = -1;
  }
}

const toolbar = [
  'image emoticons',

]

const mdlValue = reactive({
  fullText: ''
})

const latestAndNewArr: string[] = ['最热', '最新']
let latestCurrentIndex: Ref<number> = ref(0);
const ifCurrentClick = (index: number) => {
  latestCurrentIndex.value = index;
  getCommentList(false);
}

// 发送父级评论
const editorRef = ref()

const sendParentComment = async () => {
  const contnent = editorRef.value.getContent()
  const data: sendParentParam = {
    articleId: paperId,
    parentId: 0,
    userId: piniaUserId.value,
    content: contnent
  }


  const res = await reqParentComment(data)

  if (res.code == 200) {
    useMessage('发送成功', 'success')
    // 清空富文本
    editorRef.value.setContent('')
    mdlValue.fullText = ''
    latestCurrentIndex.value = 1;
    getCommentList(false);

  } else if (res.code == 401) {
    forceLoginOut();
  } else {
    useMessage(res.message, 'warning')
  }


}

let ifClckAllComment: Ref<boolean> = ref(false);
// 评论数组
let commentList: Ref<any[]> = ref([])
// 剩余评论总条数
let remainCommentNum: Ref<number> = ref(0)
// 骨架屏状态
let loading: Ref<boolean> = ref(true);

// 总评论条数
let totalCommentNum: Ref<number> = ref(0);
// 获取评论
const getCommentList = async (flag: boolean) => {
  ifClckAllComment.value = flag;

  let dataNum = ifClckAllComment.value ? 0 : 3;
  //  console.log(dataNum);
  commentList.value = [];
  const data: getCommentParam = {
    articleId: paperId,
    dataNum,
    type: latestCurrentIndex.value,
    ifLogin: piniaIfLogin.value,
    userId: piniaUserId.value
  }


  const res = await reqCommentList(data);
  if (res.code == 200) {
    commentList.value = res.data;
    totalCommentNum.value = res.totalCommentNum;
    remainCommentNum.value = res.totalCommentNum - 3;
    loading.value = false;
  }

}

interface CommentItem {
  id: number
  article_id: number
  user_id: number
  parent_id: number
  content: string
  like_count: number
  praiseStatus?: boolean
  avatar?: string
  name?: string
  occupation?: string
  created_at?: string
  children?: CommentItem[]
  son?: CommentItem[]
}


//评论点赞
const commentPraise = async (commentId: string) => {
  const data: addCommentPraiseParam = {
    userId: piniaUserId.value,
    commentId,
  }

  const res = await reqPraiseComment(data);

  if (res.code == 400) {
    open.value = true;
  } else if (res.code == 200) {
    // 调用
    const { commentId, praiseStatus, praiseNum } = res.data // 你的后端返回数据
    updateCommentPraise(commentList.value, commentId, praiseStatus, praiseNum)
  } else if (res.code == 401) {
    forceLoginOut();
  }
}

// 递归实时渲染父子孙评论的点赞数量和状态
const updateCommentPraise = (commentList: any[], targetId: number, praiseStatus: boolean, praiseNum: number) => {
  for (let comment of commentList) {
    if (comment.id === targetId) {
      // 找到目标评论，更新数据
      comment.like_count = praiseNum
      comment.praiseStatus = praiseStatus
      return true // 找到了就返回
    }

    // 如果有 children 就递归
    if (comment.children && comment.children.length > 0) {
      if (updateCommentPraise(comment.children, targetId, praiseStatus, praiseNum)) {
        return true
      }
    }

    // 如果有 son 就递归
    if (comment.son && comment.son.length > 0) {
      if (updateCommentPraise(comment.son, targetId, praiseStatus, praiseNum)) {
        return true
      }
    }
  }
  return false
}


// 统计日期是几周前 几月前 
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




// 回复父 子 孙评论
const replyingCommentId = ref<number | null>(null)

// 点击“回复”按钮
const showReplyEditor = (commentId: number) => {
  if (!piniaIfLogin.value) {
    open.value = true;
    return;
  }
  // 如果点的是同一条评论，就切换显示/隐藏
  replyingCommentId.value = replyingCommentId.value === commentId ? null : commentId
}

const replyContentMap = reactive<Record<number, string>>({})
// 发送回复
const sendReply = async (replyid: number, type: number, replyName: string, parentId: number,) => {

  // const content = replyEditorRef.value.getContent()
    const content = replyContentMap[replyid] || ''
  console.log('content', content)
  const data: replyCommentParam = {
    parentId,
    userId: piniaUserId.value,
    articleId: paperId,
    content,
    replyName,
    type,
  }
  let res: any = await reqReplyComment(data);
  if (res.code == 200) {
    useMessage(res.message, 'success');
    getCommentList(true);
  } else if (res.code == 401) {

    forceLoginOut();
  }

  else {
    useMessage(res.message, 'error');
    getCommentList(true);
  }
  replyContentMap[parentId] = ''
  replyingCommentId.value = null
}
// 获取文章内容
let authorid: Ref<number> = ref(0);





const router = useRouter()
// 返回首页
const backIndex = () => {
  router.push(`/`)
}



</script>

<style lang="scss">
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

.root {
  background-color: #F2F3F5;
  @extend .center;

  .leftIconContainer {
    position: fixed;
    // margin-right: 15px !important;
    display: flex;
    flex-direction: column;
    align-items: center;

    .avatar {
      background-color: white;
      padding: 7px !important;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .userAvatar {
        width: 27px;
        height: 27px;
        border-radius: 50%;
      }
    }



    article {
      margin-bottom: 15px !important;
    }

    .iconContent {
      @extend .center;
      cursor: pointer;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      padding: 18px !important;
      background-color: white;

      .icon {
        font-size: 15x;
      }
    }
  }

  .main {
    display: flex;
    justify-content: center;
    align-items: flex-start;

    margin-top: 20px !important;

    // width: 200px;
    // padding-left: 200px !important;
    height: 3000px;

    // background-color: red;
    // margin: 0 auto !important;
    .rightPersonInfoContainer {
      @extend .center;
      // width: 200px;
      // height: 100px;
      // background-color: orange;
      background-color: white;
      padding: 10px !important;
      // padding-left: 25px !important;
      // // padding-top: 20px !important;
      // padding-right: 25px !important;
      border-radius: 5px !important;

      .rightPersonContent {
        // background-color: aqua;
      }

      .baseInfo {
        @extend .start;

        .userAvatar {
          width: 40px;
          height: 40px;
          margin-right: 5px !important;
        }

        .name {
          color: #252933;
        }

        .occupation {
          color: $defaultWordColor;
          font-size: 12px;
        }
      }

      .paperNumAndFansContainer {
        display: flex;
        flex-direction: column;
        margin: 5px 0px !important;
        // background-color: green;

        .paperNumAndFansContent {
          @extend .start;
          padding-left: 10px !important;
          // background-color: blue;
          text-align: center;

          .paperNumAndFansItem {
            margin-right: 50px !important;
            cursor: pointer;

            // background-color: yellow;
            p:nth-child(1) {
              font-size: 15px;
              color: #25295A;
              margin-bottom: 5px !important;
            }

            p:nth-child(2) {
              color: #8A919F;
              font-size: 12px !important;
            }
          }
        }

        .btnContainer {
          @extend .start;
          margin-top: 10px !important;

          // padding-left: 10px !important;
          .el-button {
            padding: 5px 40px !important;
            margin-right: 10px !important;
            font-size: 13px !important;
          }

          .focus {
            background-color: #1E80FF;
          }

          .focus:hover {
            background-color: #1171EE;
          }

          .private:hover {
            color: $defautlShallowColor;
            background-color: #E8F2FF;
          }

        }
      }

    }
  }

}

.follow {
  transform: translate(0, -7px);
  color: white;
  background-color: $defautlShallowColor;
  font-size: 10px;
  border-radius: 5px;
  text-align: center;
  padding: 2px 3px !important;
  cursor: pointer;

}

.leftIconPlaceholder {
  width: 60px; // 设置占位宽度（根据你设计图实际宽度来）
}

.paperContainer {
  width: 600px !important;
  display: flex;
  flex-direction: column;
  padding: 10px !important;
  background-color: white;
  // background-color: purple;
  // max-width: 1500px !important;
  margin-right: 20px !important; // margin-right: 50px !important;

}




.infoContainer {
  @extend .start;
  margin: 10px 0px !important;

  p {
    margin-right: 10px !important;
  }

  section {
    margin-right: 10px !important;

  }

  .authorName {
    color: #515767;
  }

  .date {
    color: #8A919F;
  }

  .view {
    color: #8A919F;
  }
}

.commentContainer {
  @extend .start;

  .commentContent {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    .userAvatar {
      margin-right: 10px !important;
    }

    .imageAndEditorContent {
      display: flex;
      justify-content: flex-start;
      margin-top: 10px !important;
      // background-color: yellow;
      height: 50%;


    }
  }


}

.sendBtn {
  width: 10%;

}

.btnContainer {
  @extend .between;
  margin-top: 10px !important;

  .blankBox {
    width: 10px;
    height: 10px;
    // background-color: red !important;
  }
}

.latestAndNewArrContainer {
  @extend .start;
  text-align: center;
  cursor: pointer;

  section:nth-child(1) {
    padding-right: 10px !important;
    border-right: 2px solid #E4E6EB;
  }

  section:nth-child(2) {
    padding-left: 10px !important;

  }
}

.activeColor {
  color: $defautlShallowColor;
}

.parentCommentContainer {
  display: flex;
  flex-direction: column;
  margin-top: 15px !important;
  margin-left: 10px !important;

  .parentCommentContent {
    display: flex;
    align-items: flex-start;
    margin-bottom: 25px !important;

    .vistorAvatar {
      margin-right: 20px !important;
      // background-color: yellow;
    }

    .rightCommentContent {
      display: flex;
      flex-direction: column;
      // background-color: purple;

      .userInfo {
        .nameAndOccupation {
          @extend .start;

          .name {
            color: #515767;
            margin-right: 15px !important;
          }

          .occupation {
            color: #8A919F;
            font-size: 13px;
          }
        }
      }

      .comment {
        margin: 15px 0px !important;
      }

      .praiseAndDateContainer {
        // @extend .start;
        display: flex;
        flex-direction: column;
        color: #8A919F;
        font-size: 14px;

        .userReply {
          @extend .start;
        }

        .praiseContainer {
          @extend .center;
          margin-right: 20px !important;
          margin-left: 20px !important;
          text-align: center;

          // background-color: yellow;
          .icon {
            margin-right: 5px !important;
            cursor: pointer;
          }

          p {
            margin-top: -2px !important;
          }
        }

        .toPraiseContainer {
          @extend .center;
          text-align: center;

          //  background-color: purple;
          .icon {
            margin-right: 5px !important;
            cursor: pointer;
          }

          p {
            margin-top: -3px !important;
          }
        }
      }


    }
  }
}

.remainCommentBtn {
  border: none !important;
  cursor: pointer;

}

.remainCommentBtn:hover {
  background-color: #F2F3F5 !important;
  color: #515767 !important;
}



.remainCommentBtnWord {
  margin-right: 10px !important;
}

.childrenCommentContent {
  margin-left: 45px !important;
  margin-bottom: 15px !important;

  .childrenCommentTop {
    @extend .start;
  }

  .childrenCommentBottom {
    margin-left: 40px !important
  }

  .nickName {
    @extend .start;
    margin: 0px 8px !important;

    .vistorName {
      color: #5E616C;
    }

    .sonComment {
      font-size: 15px;
    }

    .authorSymbol {
      background-color: #EAF2FF;
      font-size: 12px;
      padding: 0px 5px !important;
      color: #1E80FF;
      margin: 0px 5px !important;
    }
  }

  .praiseAndDateContainer {
    margin-top: 10px !important;
    color: #8A919F;
    font-size: 13px;

    .icon {
      margin-right: 5px !important;
      cursor: pointer;
    }

    @extend .start;

    .praiseContainer {
      @extend .start;
      margin: 0px 15px !important;

    }

    .toPraiseContainer {
      @extend .start;
    }
  }
}

.comment {
  img {
    max-width: 80px !important;
    height: auto !important;
  }
}

.back {
  margin-bottom: 15px !important;
  cursor: pointer;

  .icon {
    font-size: 20px;

  }
}

.fakeEditorContainer {
  @extend .center;
  width: 500px;
  height: 100px;
  border-radius: 5px;
  background-color: #F2F3F5;

  .loginBtnContainer {
    @extend .start;

    .loginBtn {
      background-color: #f4f9ff !important;
      color: white !important;
      padding: 12px 10px !important;
      background-color: #1E80FF !important;
      margin-right: 10px !important;
    }

  }

}

.replyEditor {
  margin-top: 10px !important;
}

.cancelReplyWord {
  cursor: pointer;
  color: #1E80FF;
}

.replyBtnContainer {
  @extend .between;

  .blankBox {
    width: 50px;
    height: 50px;
  }

  .replyBtn {
    padding: 10px !important;
  }
}

.parentCommentContainer {
  img {
    max-width: 80px !important;
    height: auto !important;
  }
}
</style>