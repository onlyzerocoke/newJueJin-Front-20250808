<template>
  <header class="headerContainer">
    <main class="headerContent">
      <article class="headerContentLeftBox">
        <img src="../image/header/indexLogoSmall.png" alt="" class="smallLogo" />
        <img src="../image/header/indexLogo.png" alt="" class="bigLogo" />

        <!-- 移动端导航栏 -->
        <p class="ifShowMobileNav mobileIndexWord">
          <span v-if="currentIndex == 6">{{ functionsArr[0] }}</span>
          <span v-else>{{ functionsArr[currentIndex] }}</span>
        <section class="functionsContainer" v-if="triangleFlag">

          <article class="functionsItem" v-for="(item, index) in functionsArr" :key="index"
            @click="chooseIndexListItem(index)" :class="index == currentIndex ? 'active' : ''">
            {{ item }}
          </article>
        </section>
        </p>

        <section class="triangle ifShowMobileNav" @click="clickTriangle"
          :class="triangleFlag ? 'triangleRotate' : 'triangleRotateBack'"></section>




        <!-- PC端导航栏 -->
        <div class="ifShowPCNav">
          <section class="pcNavContainer">
            <article class="navItem" v-for="(item, index) in functionsArr" :key="index">
              {{ item }}
            </article>

            <div class="ifShowAppContainer">
              <article class="appAndPluginContainer">
                <p>APP</p>
                <p>插件</p>
              </article>
            </div>
          </section>
        </div>
      </article>

      <article class="headerContentRightBox">

        <!-- 搜索输入框 -->
        <section class="iptContainer" :class="ifClicksSearchIpt ? 'activeSearchIptContainer' : ''">
          <el-form :model="form">
            <el-form-item>
              <el-input v-model="form.keyword" placeholder="探索稀土掘金" @click="clickSearchIpt">
              </el-input>
            </el-form-item>
          </el-form>

          <section class="searchBtn" :class="ifClicksSearchIpt ? 'activeSearchButton' : ''">
            <i class="icon iconfont icon-fangdajing1" v-if="!ifClicksSearchIpt"></i>
            <i class="icon iconfont icon-fangdajing" v-else></i>
          </section>
        </section>

        <!-- 创作者中心 -->
        <div class="ifcreateCenterContainerShow" :class="ifClicksSearchIpt ? 'activeCreateCenter' : ''">


          <section class="createCenterContainer" @click="clickcreateCenterFlag" v-if="pcFlag">
            <el-button text> 创作者中心</el-button>

            <div class="createCenterTriangle">
              <section class="triangle"></section>
            </div>
          </section>

          <section class="createCenterContainer" v-else @mouseenter="clickcreateCenterFlag">
            <el-button text> 创作者中心</el-button>

            <div class="createCenterTriangle">
              <section class="triangle"></section>
            </div>
          </section>




          <section class="createCenterContent" v-if="createCenterFlag" @mouseleave="clickcreateCenterFlag">

            <section class="createCenterContentBox">
              <article class="createCenterContentBoxTop">
                <div class="createCenterContentItem">
                  <div class="imgContainer">
                    <img src="../image/header/writePaper.svg" alt="">
                  </div>

                  <p>写文章</p>
                </div>

                <div class="createCenterContentItem">
                  <div class="imgContainer">
                    <img src="../image/header/writeFeiDian.svg" alt="">
                  </div>

                  <p>发沸点</p>
                </div>

                <div class="createCenterContentItem">
                  <div class="imgContainer">
                    <img src="../image/header/writeNote.svg" alt="">
                  </div>

                  <p>写笔记</p>
                </div>

                <div class="createCenterContentItem">
                  <div class="imgContainer">
                    <img src="../image/header/writeCode.svg" alt="">
                  </div>

                  <p>写代码</p>
                </div>

                <div class="createCenterContentItem">
                  <div class="imgContainer">
                    <img src="../image/header/craft.svg" alt="">
                  </div>

                  <p>草稿箱</p>
                </div>
              </article>

              <article class="createCenterContentBoxBottom">
                <article class="createCenterContentBoxBottomTop">
                  <p>创作灵感</p>
                  <p>查看更多&nbsp;></p>
                </article>

                <article class="createCenterContentBoxBottomTail">
                  <div class="createCenterContentBoxBottomTailItem">
                    <article class="tag">话题</article>
                    <p>#Trae超级体验官征文#</p>
                  </div>

                  <div class="createCenterContentBoxBottomTailItem">
                    <article class="tag">话题</article>
                    <p>#Trae.ai#</p>
                  </div>

                  <div class="createCenterContentBoxBottomTailItem">
                    <article class="tag">话题</article>
                    <p>#金石头#计划正文活动#</p>
                  </div>
                </article>

              </article>


            </section>

          </section>
        </div>

        <!-- 会员 -->
        <div class="ifShowHuiYuan">
          <section class="huiyuanContainer">
            <section class="huiyuanImage">
              <img src="../image/header/huiyuan.png" alt="" />
            </section>

            <p class="huiyuanWord">会员</p>
          </section>
        </div>

        <!-- <i class="icon iconfont icon-tixing"></i> -->
        <template v-if="piniaIfLogin">
          <i class="icon iconfont  icon-tixing" @mouseenter="ifEnterTixing" v-if="!tixingFlag"></i>
          <i class="icon iconfont  icon-tixing-tianchong" @mouseleave="ifEnterTixing" v-else></i>
        </template>

        <template v-else>
          <div class="blankBox">

          </div>
        </template>


        <div v-if="piniaIfLogin">
          <el-avatar shape="circle" :size="40" @click="clickAvatarFlag" :src="piniaAvatar"></el-avatar>
          <section class="avatarListContainer" v-if="avatarFlag">

            <section class="avatarListContent">
              <!-- 用户头像和用户名称 -->
              <article class="avatarListTopContent">
                <el-avatar shape="circle" :size="50"></el-avatar>
                <p>Ausey</p>
              </article>
              <!-- 关注、赞过和收藏 -->
              <article class="avatarListMiddleContent">
                <section class="avatarListMiddleItem">
                  <p>2</p>
                  <span>关注</span>
                </section>

                <section class="avatarListMiddleItem">
                  <p>2</p>
                  <span>赞过</span>
                </section>

                <section class="avatarListMiddleItem">
                  <p>2</p>
                  <span>收藏</span>
                </section>
              </article>

              <!-- 我的主页 -->
              <article class="avatarListBottomContent">
                <section class="avatarListBottomItem">
                  <i class="icon iconfont icon-touxiang2"></i>
                  <p>我的主页</p>
                </section>

                <section class="avatarListBottomItem">
                  <i class="icon iconfont icon-liwu"></i>
                  <p>成长福利</p>
                </section>

                <section class="avatarListBottomItem">
                  <i class="icon iconfont icon-bijiben"></i>
                  <p>闪念笔记</p>
                </section>

                <section class="avatarListBottomItem">
                  <i class="icon iconfont icon-xiajiantou-03"></i>
                  <p>会员中心</p>
                </section>

                <section class="avatarListBottomItem">
                  <i class="icon iconfont icon-touxiang2"></i>
                  <p>课程中心</p>
                </section>

                <section class="avatarListBottomItem">
                  <i class="icon iconfont icon-wodeyouhuiquan"></i>
                  <p>我的优惠</p>
                </section>

                <section class="avatarListBottomItem">
                  <i class="icon iconfont icon-qizhi"></i>
                  <p>我的报名</p>
                </section>

                <section class="avatarListBottomItem">
                  <i class="icon iconfont icon-zuji1"></i>
                  <p>我的足迹</p>
                </section>



              </article>

              <!-- 我的设置和登录 -->
              <article class="avatartListTailContent">
                <p>我的设置</p>
                <p @click="loginOut">退出登录</p>

              </article>
            </section>


          </section>

        </div>
        <!--  @click="openDialog" -->
        <el-button type="primary" class="loginBtn" v-else @click="showModal">登录&nbsp;|&nbsp;注册
        </el-button>

        <!-- eslint-disable-next-line vue/no-v-model-argument -->
        <a-modal v-model:open="open" @ok="handleOk" centered :footer="null" class="loginModal">
          <p class="loginTitle">登录掘金畅享更多权益</p>
          <a-divider />

          <div class="loginIptContainer">
            <p class="codeLoginWord">验证码登录&nbsp;/&nbsp;注册</p>
            <section class="loginIptContent">
              <!-- TODO:放入手机号和验证码表单 -->
              <article class="phoneIptContainer" :class="ifClickLoginIpt ? 'activeBackGroundColor' : ''">
                <!-- 修改选择器部分 -->
                <!-- eslint-disable-next-line vue/no-v-model-argument -->
                <a-select ref="select" v-model:value="countryCode" style="width: 100px;" @focus="focus"
                  @change="handleChange" class="selectContainer" optionLabelProp="label">
                  <a-select-option value="86" label="+86">
                    <div class="select-option-content">
                      <p class="code">+86</p>
                      <p class="country">中国</p>
                    </div>
                  </a-select-option>

                  <!-- <a-select-option value="87" label="+87">
      <div class="select-option-content">
        <p class="code">+87</p>
        <p class="country">美国</p>
      </div>
    </a-select-option> -->
                </a-select>
                <!-- eslint-disable-next-line vue/no-v-model-argument -->
                <a-input placeholder="请输入手机号" @focus="focusLoginIpt" @blur="blurLoginIpt"
                  v-model:value="phone"></a-input>
              </article>

              <article class="phoneIptContainer" :class="ifClickCodeIpt ? 'activeBackGroundColor' : ''">
                <!-- eslint-disable-next-line vue/no-v-model-argument -->
                <a-input placeholder="请输入验证码" @focus="focusCodeIpt" @blur="blurCodeIpt" v-model:value="code"></a-input>

                <p class="getCode" @click="getCode" :class="isDisabled ? 'activeWordColor' : ''">
                  {{ isDisabled ? `${countdown}秒后重新发送` : '获取验证码' }}
                </p>
              </article>

              <a-button type="primary" class="loginOrRgisterButton"
                @click="handleLoinOrRegister">登录&nbsp;/&nbsp;注册</a-button>

              <!-- TODO:其他登录和密码登录 -->
              <article class="otherLoginAndPasswordLoginContainer">
                <article class="otherLoginContent">
                  <p>其他登录:</p>
                  <article class="iconContainer">
                    <i class="icon iconfont icon-weibo"></i>
                    <i class="icon iconfont icon-weixin" @click="weixinLogin"></i>
                    <i class="icon iconfont icon-github" @click="handleGithubLogin"></i>
                  </article>
                </article>

                <p>密码登录</p>
              </article>
              <!-- TODO:同意用户协议 -->
              <p class="userPolicyContainer">注册登录即表示同意&nbsp;<span
                  class="userPolicyContent">用户协议</span>&nbsp;和&nbsp;<span class="userPolicyContent">隐私政策</span></p>
            </section>

          </div>


        </a-modal>

      </article>
    </main>


  </header>

</template>

///
<reference types="vite/client" />
<script setup lang="ts">

//@ts-ignore
import {
  Ref,
  watch,
  onMounted,
  onBeforeUnmount,
  ref,
  computed,
  onUnmounted,
} from "vue";
import { reqLoginOrRegister, reqUserInfo, reqMessageCode } from "../api/api";
import { ElMessage } from "element-plus";
import { useMessage } from "../utils/elementComponents/message";
import {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
  userPhoneData,
  userPhoneReponseData,
  userLoginOrRegisterData,
} from "../api/type/user";
import { storeToRefs } from "pinia";
import useMainStore from "../Store";
import QRCode from "qrcode";
let phone: Ref<string> = ref("");

//@ts-ignore
//搜索框
//@ts-ignore
const form = ref({
  keyword: "",
});

let functionsArr: Ref<string[]> = ref([
  "首页",
  "BOT",
  "沸点",
  "课程",
  "直播",
  "活动",
  "AI刷题",
  "商城",
]);

// indexList列表
let triangleFlag: Ref<boolean> = ref(false);

const clickTriangle = (event: any) => {
  event.stopPropagation();
  triangleFlag.value = !triangleFlag.value;
};

const handleIndexList = (event: any) => {
  const functionsContainer = document.querySelector(".functionsContainer");
  if (functionsContainer && !functionsContainer.contains(event.target)) {
    triangleFlag.value = !triangleFlag.value;
  }
};

// avatarList列表
let avatarFlag: Ref<boolean> = ref(false);
const clickAvatarFlag = (event: any) => {
  event.stopPropagation();
  avatarFlag.value = !avatarFlag.value;
};

const handleAvatarList = (event: any) => {
  const avatarListContent = document.querySelector(".avatarListContent");
  if (avatarListContent && !avatarListContent.contains(event.target)) {
    avatarFlag.value = !avatarFlag.value;
  }
};

// createCenter列表
let createCenterFlag: Ref<boolean> = ref(false);
const clickcreateCenterFlag = (event: any) => {
  event.stopPropagation();
  createCenterFlag.value = !createCenterFlag.value;
};

const handlecreateCenterList = (event: any) => {
  const createCenterContent = document.querySelector(".createCenterContent");
  if (createCenterContent && !createCenterContent.contains(event.target)) {
    createCenterFlag.value = !createCenterFlag.value;
  }
};

onMounted(() => {
  // countryCode.value = '86';

  // 监察indexList列表
  watch(
    () => triangleFlag.value,
    async (newVal) => {
      if (newVal && triangleFlag.value) {
        document.addEventListener("click", handleIndexList);
      }
    }
  );

  // 监察avatarList列表
  watch(
    () => avatarFlag.value,
    async (newVal) => {
      if (newVal && avatarFlag.value) {
        document.addEventListener("click", handleAvatarList);
      }
    }
  );

  //监察 createCenter列表
  watch(
    () => createCenterFlag.value,
    async (newVal) => {
      if (newVal && createCenterFlag.value) {
        document.addEventListener("click", handlecreateCenterList);
      }
    }
  );

  //检查是否点了搜索输入框
  watch(
    () => ifClicksSearchIpt.value,
    async (newVal) => {
      if (newVal && ifClicksSearchIpt.value) {
        document.addEventListener("click", handleIptContainer);
      }
    }
  );
});

let currentIndex: Ref<number> = ref(0);
const chooseIndexListItem = (index: number) => {
  currentIndex.value = index;
};

//判断当前屏幕是否为pc
let pcFlag: Ref<boolean> = ref(false);
window.addEventListener("resize", function () {
  if (isPC()) {
    pcFlag.value = true;
  } else {
    pcFlag.value = false;
  }
});

const isPC = () => {
  return window.innerWidth >= 1920;
};

// 判断是否点击了搜索表单
let ifClicksSearchIpt: Ref<boolean> = ref(false);
const clickSearchIpt = () => {
  ifClicksSearchIpt.value = true;
};

const handleIptContainer = (event: any) => {
  const iptContainer = document.querySelector(".iptContainer");
  if (iptContainer && !iptContainer.contains(event.target)) {
    ifClicksSearchIpt.value = false;
  }
};

// 鼠标进入提醒
let tixingFlag: Ref<boolean> = ref(false);
const ifEnterTixing = (event: any) => {
  event.stopPropagation();
  tixingFlag.value = !tixingFlag.value;
};

//退出登录

const loginOut = () => {
  const isConfirmed = confirm(
    "确定登出吗? 每一片贫瘠的土地都需要坚定的挖掘者!"
  );
  if (isConfirmed) {
    piniaToken.value = "";
    piniaIfLogin.value = false;
  }
  window.location.reload();

};

// const open: Ref<boolean> = ref(false);
const showModal = () => {
  // open.value = true;
  useHeaderStore.openModal()
};
const handleOk = (e: MouseEvent) => {
  // open.value = false;
  useHeaderStore.closeModal()
};

const countryCode: Ref<string> = ref("86");

const focus = () => {
  console.log("focus");
};

const handleChange = (value: string) => {
  countryCode.value = value;
  console.log(`selected ${value}`);
};

let ifClickLoginIpt: Ref<boolean> = ref(false);
const focusLoginIpt = () => {
  ifClickLoginIpt.value = true;
};

const blurLoginIpt = () => {
  ifClickLoginIpt.value = false;
};

let ifClickCodeIpt: Ref<boolean> = ref(false);
const focusCodeIpt = () => {
  ifClickCodeIpt.value = true;
};

const blurCodeIpt = () => {
  ifClickCodeIpt.value = false;
};

const userInfo = ref<userInfoReponseData | null>(null);

//验证码倒计时
// 定义响应式数据
const isDisabled = ref(false);
const countdown = ref(60);
let timer: ReturnType<typeof setInterval> | null = null; // 使用 setInterval 的返回类型

// 获取验证码方法
const getCode = () => {
  if (isDisabled.value) return; // 防止在倒计时中重复点击
  isDisabled.value = true; // 禁用按钮
  startCountdown(); // 启动倒计时
  // 这里可以加上获取验证码的逻辑
  handleGetMessageCode();
};

// 启动倒计时
const startCountdown = () => {
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer!); // 清除定时器
      isDisabled.value = false; // 启用按钮
      countdown.value = 60; // 重置倒计时
    }
  }, 1000); // 每秒更新一次
};

// 清除定时器，防止内存泄漏
onBeforeUnmount(() => {
  clearInterval(timer!);
});

//获取验证码函数
const handleGetMessageCode = async () => {
  const data: userPhoneData = {
    phone: phone.value,
    countryCode: countryCode.value,
  };

  try {
    const response: userPhoneReponseData = await reqMessageCode(data);
    console.log("获取验证码成功", response);
    if (response.code == 400) {
      useMessage(response.message, "warning");
    }
  } catch (error) {
    console.log("获取验证码失败", error);
  }
  // reqMessageCode
};

const isExpanded = ref(false);
const allTags = ref([
  "前端",
  "后端",
  "Linux",
  "人工智能",
  "数据库",
  "DevOps",
  "数据分析",
]);
const visibleTags = computed(() => allTags.value.slice(0, 3)); // 默认显示的标签
const hiddenTags = computed(() => allTags.value.slice(3)); // 隐藏的标签

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

let code: Ref<string> = ref("");
const { userStore, useHeaderStore } = useMainStore();
let { piniaToken, piniaIfLogin, piniaAvatar, piniaUserId } = storeToRefs(userStore);
let { open } = storeToRefs(useHeaderStore);
// 登录或注册
const handleLoinOrRegister = async () => {
  const data: userLoginOrRegisterData = {
    phone: phone.value,
    code: code.value,
  };

  try {
    const response: any = await reqLoginOrRegister(data);

    if (response.code === 200) {
      // 登录成功
      ElMessage.success("登录成功");
      piniaToken.value = response.data.token;
      piniaIfLogin.value = true;
      piniaAvatar.value = response.data.user.avatar;
      piniaUserId.value = response.data.user.id;
      // 关闭登录弹窗
      // open.value = false;
      useHeaderStore.closeModal()
      // 刷新页面
      window.location.reload();
    } else {
      // 登录失败
      ElMessage.error(response.message || "登录失败");
    }
  } catch (error) { }
};

let ifWeiXinLogin: Ref<boolean> = ref(false);
// 微信登录
const weixinLogin = () => {
  console.log("微信登录");
};

const handleGithubLogin = () => {
  // GitHub OAuth 配置
  const githubConfig = {
    // @ts-ignore
    clientId: import.meta.env.VITE_APP_GITHUB_CLIENT_ID,
    // @ts-ignore
    redirectUri: `${import.meta.env.VITE_APP_BASE_API}${import.meta.env.VITE_APP_GITHUB_CALLBACK}`,
    scope: "user:email",
  };

  // 构建 GitHub 授权 URL
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${githubConfig.clientId
    }&redirect_uri=${encodeURIComponent(githubConfig.redirectUri)}&scope=${githubConfig.scope
    }`;



  // 打开新窗口进行 GitHub 授权
  window.open(authUrl, "_blank", "width=800,height=600");

  // 监听消息事件，接收登录结果
  window.addEventListener(
    "message",
    async (event) => {
      if (event.data.type === "github-login") {
        const { token, user } = event.data;
        // 更新登录状态
        piniaToken.value = token;
        piniaIfLogin.value = true;
        piniaAvatar.value = user.avatar;
        // open.value = false;
        useHeaderStore.closeModal();
        window.location.reload();
      }
    },
    false
  );
};


</script>



<style lang="scss" scoped>
.read-more-card {
  width: 400px;
  padding: 16px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  cursor: pointer;
}

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

.bigLogo {
  display: none;
}

.headerContainer {
  user-select: none;
  @extend .center;

  background-color: white;
  //  background-color: red;
  padding: 5px 5px !important;

  .headerContent {
    @extend .between;

    // background-color: yellow;
    .headerContentLeftBox {
      @extend .between;
      // background-color: aqua;

      p {
        color: $defaultDeepWordColor;
        margin-left: 8px;
      }

      .triangle {
        width: 0;
        height: 0;
        cursor: pointer;
        border-left: 0.3rem solid transparent;
        border-right: 0.3rem solid transparent;
        border-top: 0.3rem solid $defaultTriangleColor;
        margin-left: 4px;
      }

      .triangleRotate {
        animation: rotateTriangle 0.2s forwards !important;
        border-top: 0.3rem solid $defaultDeepWordColor !important;
      }

      .triangleRotateBack {
        animation: rotateTriangleBack 0.2s forwards !important;
        border-top: 0.3rem solid $defaultWordColor !important;
      }

      @keyframes rotateTriangle {
        0% {
          transform: rotate(0deg);
        }

        100% {
          transform: rotate(-180deg);
        }
      }

      @keyframes rotateTriangleBack {
        0% {
          transform: rotate(-180deg);
        }

        100% {
          transform: rotate(0deg);
        }
      }
    }

    .functionsContainer {
      position: absolute;
      top: 52px;
      margin-left: -50px !important;
      z-index: 9999;
      border-top-right-radius: 5px !important;
      border-bottom-right-radius: 5px !important;
      box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.3);
      background-color: white;


      .functionsItem {
        @extend .center;
        padding: 15px 50px !important;
        // background-color: aqua;

        color: $defaultWordColor;
      }
    }

    .headerContentRightBox {
      // background-color: green;

      @extend .between;

      .iptContainer {
        // background-color: orange;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 3px;
        border: 1px solid #c2c8d1;

        .el-input {
          :deep(.el-input__wrapper) {
            background-color: #ffffff;
            box-shadow: 0 0 0 0;
          }
        }

        .searchBtn {
          @extend .center;
          background-color: #f2f3f5;
          cursor: pointer;
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;
          padding: 4px 12px !important;
          margin-right: 3px !important;
          // width: 32px;
          // height: 30px;

          .iconfont {
            font-size: 20px !important;
          }
        }
      }

      .avatarListContainer {
        position: absolute;
        @extend .center;
        cursor: pointer;
        border-radius: 5px;
        top: 50px;
        z-index: 9999;
        right: 13px;
        background-color: #ffffff;
        padding: 10px !important;
        box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.3);

        .avatarListContent {
          .avatarListTopContent {
            display: flex;

            // background-color: aqua;
            p {
              margin-top: 5px !important;
              color: black;
              margin-left: 10px !important;
            }
          }

          .avatarListMiddleContent {
            @extend .center;
            // background-color: yellow;
            padding: 10px 5px !important;
            // padding-left: 20px !important;
            border-bottom: 1px solid #f4f5f7;

            // margin-left: -30px !important;
            .avatarListMiddleItem {
              display: flex;
              flex-direction: column;
              justify-content: center;
              // margin-left: 30px !important;
              // background-color: aqua;

              p {
                text-align: center;
              }

              span {
                font-size: 12px;
                color: $defaultWordColor;
              }
            }

            .avatarListMiddleItem:nth-child(2) {
              margin: 0px 40px !important;
            }
          }

          .avatarListBottomContent {
            width: 250px;
            //  background-color: orange;
            margin-top: 15px !important;
            flex-wrap: wrap;
            @extend .center;
            border-bottom: 1px solid #f4f5f7;
            padding-bottom: 10px !important;

            .avatarListBottomItem:hover {
              background-color: #f7f8fa !important;
              border-radius: 5px !important;
            }

            .avatarListBottomItem {
              @extend .start;
              padding: 10px 15px !important;
              // margin-right: 15px !important;
              // margin-bottom: 15px !important;

              i {
                font-size: 16px !important;
                margin-right: 5px !important;
              }

              p {
                font-size: 14px;
              }
            }
          }

          .avatartListTailContent {
            @extend .between;
            color: $defaultWordColor;
            padding: 8px 0px !important;
            margin-top: 5px !important;

            p {
              &:hover {
                color: #1e80ff;
              }

              font-size: 12px;
            }
          }
        }
      }
    }
  }
}

.iconfont {
  font-size: 26px !important;
}

// 创作者中心
//小尺寸下创作者中心会被隐藏
.ifcreateCenterContainerShow {
  display: none;
}

.createCenterContainer {
  @extend .start;
  float: left;
  margin: 0 10px !important;
  background-color: #1e80ff;
  border-radius: 3px;

  .el-button {
    color: white;
    font-size: 12px;
    padding: 10px !important;
  }

  .el-button:hover {
    background-color: #1e80ff !important;
  }

  .createCenterTriangle {
    @extend .center;
    padding: 0 3px !important;
    border-left: 1px solid #358dff;
    height: 40px !important;

    .triangle {
      width: 0;
      height: 0;
      cursor: pointer;
      border-left: 0.3rem solid transparent;
      border-right: 0.3rem solid transparent;
      border-top: 0.3rem solid white;
      margin-left: 4px;
    }
  }
}

.ifcreateCenterContainerShow {
  .createCenterContent {
    cursor: pointer;
    position: fixed;
    top: 52px;
    background-color: white;

    border-radius: 5px;
    padding: 10px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;

    .createCenterContentBoxTop {
      @extend .between;
      border-bottom: 1px solid #e4e6eb;
      padding: 15px !important;

      .createCenterContentItem {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-right: 20px !important;

        .imgContainer {
          width: 40px;
          height: 40px;
          // background-color: red;
          @extend .center;
          margin-bottom: 10px;
        }

        p {
          color: #515767;
          font-size: 13px;
          text-align: center !important;
          // background-color: pink;
        }

        &p:nth-child(5) {
          margin-right: 0px !important;
        }
      }

      .createCenterContentItem:nth-child(5) {
        margin-right: 0px !important;
      }
    }

    .createCenterContentBoxBottom {
      margin-top: 10px !important;

      .createCenterContentBoxBottomTop {
        @extend .between;

        p:nth-child(2) {
          color: #8a919f !important;
          font-size: 14px;
        }
      }

      .createCenterContentBoxBottomTail {
        margin-top: 10px !important;

        .createCenterContentBoxBottomTailItem {
          @extend .start;

          .tag {
            @extend .center;
            padding: 3px !important;
            margin-right: 5px !important;
            margin-bottom: 5px !important;
            background-color: #eaf2ff;
            color: #1f80ff;
            font-size: 12px;
            border-radius: 3px;
          }

          p {
            font-size: 13px;
            color: #32353f;
          }
        }
      }
    }
  }
}

.el-avatar {
  cursor: pointer;
}

//会员
.ifShowHuiYuan {
  display: none !important;
}

.huiyuanContainer {
  @extend .between;

  p {
    color: #8a919f;
    font-size: 15px;
    width: 30px;
    margin-left: 5px !important;
    // background-color: red;
  }
}

.icon-tixing {
  cursor: pointer !important;
  // &:hover{
  //   fill: red !important;
  // }
}

.icon {
  cursor: pointer !important;
}

.huiyuanImage {
  @extend .center;

  img {
    width: 25px;
    height: 28px;
  }
}

// pc的nav

.ifShowPCNav {
  display: none;

  p {
    color: $defaultWordColor !important;
  }
}

.pcNavContainer {
  @extend .between;

  .navItem {
    @extend .center;
    cursor: pointer;
    color: $defaultWordColor;
    width: 48px;
    height: 50px !important;
    // background-color: green;
    margin-left: 5px !important;
    border-bottom: 2px solid transparent;
  }

  .navItem:hover {
    color: #252933;
    border-bottom: 2px solid $defaultDeepWordColor;
  }
}

.appAndPluginContainer {
  @extend .between;

  p {
    @extend .center;
    width: 35px;
  }

  cursor: pointer;
}

.appAndPluginContainer p:hover {
  color: black !important;
}

.ifShowAppContainer {
  display: none;
}

// 被选中时字体颜色
.active {
  color: $defaultDeepWordColor !important;
}

// 搜索框被点击时
.activeSearchIptContainer {
  border-color: #1e80ff !important;
  // animation: activeSearchIptContainerGo 0.5s linear forwards;
}

@keyframes activeSearchIptContainerGo {
  0% {}

  100% {
    width: 100px;
    // background-color: aqua;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}

.activeSearchButton {
  background-color: #eaf2ff !important;
}

.activeCreateCenter {
  // display: none !important;
  visibility: hidden !important;
}

.iptAndCreateCentrContainer {
  @extend .between;

  position: relative;

  // background-color: red;
  .iptContainer {
    position: absolute;
  }

  .ifcreateCenterContainerShow {
    position: absolute;
    left: 300px;
  }
}

.loginBtn {
  background-color: #f4f9ff !important;
  color: #007fff !important;
  padding: 12px 10px !important;
}

.loginTitle {
  margin-bottom: 10px !important;
  color: black;
  font-size: 20px !important;
  padding: 10px !important;
  padding-bottom: 0px !important;
}

.LoginContainer {


  .loginIptContainer {
    margin-top: 20px !important;
    background-color: red !important;

    p {
      color: black;
      font-size: 17px !important;
    }
  }
}



.phoneIptContainer {
  @extend .start;
  margin-top: 15px !important;
  // width: 80vw !important;
  width: 80%;
  background-color: #f2f3f5;
  padding: 5px !important;
  border-radius: 5px !important;
  border: 0.5px solid transparent !important;

  // box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.3);
  .phoneDrownContainer {
    @extend .center;

    .icon-xiangxiajiantou {
      font-size: 10px !important;
      margin-left: 15px !important;
    }
  }

  .el-input {
    :deep(.el-input__wrapper) {
      background-color: #f2f3f5;
      box-shadow: 0 0 0 0;
    }
  }

  :global(.ant-select-selector) {
    background-color: transparent !important;
    border: 1px solid transparent !important;
  }

  :global(.ant-select-focused .ant-select-selector) {
    border-color: transparent !important;
    /* 改变边框颜色 */
    box-shadow: 0 0 0 2px transparent !important;
    /* 改变聚焦阴影 */
  }

  :global(.ant-select-dropdown) {
    width: 200px !important;
  }

  :global(.ant-input) {
    background-color: transparent !important;
    border: none !important;
  }

  :global(.ant-input:focus),
  :global(.ant-input-focused) {
    border-color: transparent !important;
    /* 改变边框颜色 */
    box-shadow: 0 0 0 2px transparent !important;
    /* 改变聚焦阴影 */
  }

  .getCode {
    width: 140px;
    cursor: pointer;
    font-size: 13px;
    text-align: center;
    padding: 5px 0px !important;
    color: #1e80fe;
    // background-color: aqua;
    user-select: none;
  }

  :global(.ant-btn) {
    margin-top: 20px !important;
    width: 80% !important;
    background-color: #1e80ff !important;
    padding-top: 10px !important;
    padding-bottom: 30px !important;
    text-align: center !important;
  }
}

.ant-select-item-option {
  background-color: white !important;
}

/* 为 p 标签添加更多样式 */
.select-option-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.codeLoginWord {
  color: black;
  font-size: 15px;
  margin-top: 10px !important;
}

.activeBackGroundColor {
  background-color: white;

  border: 0.5px solid #1e80ff !important;
}

.otherLoginAndPasswordLoginContainer {
  width: 80% !important;
  flex-wrap: wrap;
  color: #515767;
  @extend .between;
  margin-top: 10px !important;

  .otherLoginContent {
    @extend .between;
  }

  .icon-weixin {
    margin: 0px 5px !important;
  }

  .iconContainer {
    margin-left: 10px !important;
  }

  p {
    cursor: pointer;
  }
}

.userPolicyContainer {
  flex-wrap: wrap;
  color: #8a919f;
  @extend .center;

  .userPolicyContent {
    cursor: pointer;
    color: #1e80ff !important;
  }
}

.activeWordColor {
  color: #90909d !important;
}

// 媒体查询分界
@media screen and (max-width: 319px) {
  .headerContentLeftBox {
    margin-right: 40vw !important;
  }

  .iptContainer {
    display: none !important;
  }
}

@media screen and (min-width: 320px) and (max-width: 345px) {
  .avatarListContainer {
    right: 5px !important;
  }

  .mobileIndexWord {
    text-align: center;
    width: 40px;
  }

  .headerContentLeftBox {
    margin-right: 30vw !important;
  }

  .iptContainer {
    display: none !important;
  }
}

@media screen and (min-width: 345px) and (max-width: 429px) {
  .mobileIndexWord {
    text-align: center;
    width: 40px;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  // .headerContentLeftBox {
  //   margin-right: 10vw !important;
  // }

  // .headerContentRightBox {
  //   .el-input {
  //     width: 30vw;
  //   }
  // }

  .iptContainer {
    display: block;
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

@media screen and (min-width: 429px) and (max-width: 530px) {
  .mobileIndexWord {
    text-align: center;
    width: 32px;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 10vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 120px;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

@media screen and (min-width: 530px) and (max-width: 540px) {
  .mobileIndexWord {
    text-align: center;
    width: 32px;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 25vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 120px;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

@media screen and (min-width: 540px) and (max-width: 641px) {
  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 25vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 120px;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

// 大掘金logo出现
@media screen and (min-width: 641px) and (max-width: 696px) {
  .mobileIndexWord {
    text-align: center;
    width: 34px;
  }

  .smallLogo {
    display: none;
  }

  .bigLogo {
    display: block;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 20vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 140px;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

@media screen and (min-width: 696px) and (max-width: 799px) {
  .smallLogo {
    display: none;
  }

  .bigLogo {
    display: block;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 25vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 140px;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

// 出现创作者中心
@media screen and (min-width: 799px) and (max-width: 830px) {
  .ifcreateCenterContainerShow {
    display: block;
  }

  .smallLogo {
    display: none;
  }

  .bigLogo {
    display: block;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 20vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 140px;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

@media screen and (min-width: 830px) and (max-width: 900px) {
  .ifcreateCenterContainerShow {
    display: block;
  }

  .smallLogo {
    display: none;
  }

  .bigLogo {
    display: block;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 20vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 140px;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

@media screen and (min-width: 900px) and (max-width: 958px) {
  .ifcreateCenterContainerShow {
    display: block;
  }

  .smallLogo {
    display: none;
  }

  .bigLogo {
    display: block;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 30vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 140px;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

//出现会员
@media screen and (min-width: 958px) and (max-width: 978px) {
  .ifShowHuiYuan {
    display: block !important;
  }

  .ifcreateCenterContainerShow {
    display: block;
  }

  .smallLogo {
    display: none;
  }

  .bigLogo {
    display: block;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 25vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 140px;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

@media screen and (min-width: 978px) and (max-width: 1070px) {
  .ifShowHuiYuan {
    display: block !important;
  }

  .ifcreateCenterContainerShow {
    display: block;
  }

  .smallLogo {
    display: none;
  }

  .bigLogo {
    display: block;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 25vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 140px;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

// 输入框变长
@media screen and (min-width: 1070px) and (max-width: 1150px) {
  .mobileIndexWord {
    text-align: center;
    width: 32px;
  }

  .iptContainer {
    .el-input {
      width: 320px !important;
    }
  }

  .ifShowHuiYuan {
    display: block !important;
  }

  .ifcreateCenterContainerShow {
    display: block;
  }

  .smallLogo {
    display: none;
  }

  .bigLogo {
    display: block;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 20vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 140px;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

// 会员文字消失
@media screen and (min-width: 1150px) and (max-width: 1190px) {
  .iptContainer {
    .el-input {
      width: 320px !important;
    }
  }

  .ifShowHuiYuan {
    display: block !important;

    p {
      display: none;
    }
  }

  .ifcreateCenterContainerShow {
    display: block;
  }

  .smallLogo {
    display: none;
  }

  .bigLogo {
    display: block;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 25vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 140px;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

//出现横板导航栏
@media screen and (min-width: 1190px) and (max-width: 1270px) {
  .ifShowMobileNav {
    display: none !important;
  }

  .iptContainer {
    .el-input {
      width: 320px !important;
    }
  }

  .ifShowHuiYuan {
    display: block !important;

    p {
      display: none;
    }
  }

  .ifcreateCenterContainerShow {
    display: block;
  }

  .smallLogo {
    display: none;
  }

  .bigLogo {
    display: block;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  // .headerContentLeftBox {
  //   margin-right: 5vw !important;
  // }

  .headerContentRightBox {
    .el-input {
      width: 160px !important;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

//再次出现会员文字
@media screen and (min-width: 1190px) and (max-width: 1270px) {
  .ifShowHuiYuan {
    display: block !important;

    p {
      display: block !important;
    }
  }

  .ifShowMobileNav {
    display: none !important;
  }

  .ifShowPCNav {
    display: block !important;
  }

  .iptContainer {
    .el-input {
      width: 320px !important;
    }
  }

  .ifShowHuiYuan {
    display: block !important;

    p {
      display: none;
    }
  }

  .ifcreateCenterContainerShow {
    display: block;
  }

  .smallLogo {
    display: none;
  }

  .bigLogo {
    display: block;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 5vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 160px !important;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

@media screen and (min-width: 1270px) and (max-width: 1350px) {
  .ifShowHuiYuan {
    display: block !important;

    p {
      display: block !important;
    }
  }

  .ifShowMobileNav {
    display: none !important;
  }

  .ifShowPCNav {
    display: block !important;
  }

  .iptContainer {
    .el-input {
      width: 320px !important;
    }
  }

  .ifShowHuiYuan {
    display: block !important;

    p {
      display: none;
    }
  }

  .ifcreateCenterContainerShow {
    display: block;
  }

  .smallLogo {
    display: none;
  }

  .bigLogo {
    display: block;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 15vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 160px !important;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

// nav 出现 app 和 插件
@media screen and (min-width: 1350px) and (max-width: 1400px) {
  .ifShowAppContainer {
    display: block;
  }

  .ifShowHuiYuan {
    display: block !important;

    p {
      display: block !important;
    }
  }

  .ifShowMobileNav {
    display: none !important;
  }

  .ifShowPCNav {
    display: block !important;
  }

  .iptContainer {
    .el-input {
      width: 160px;
    }
  }

  .ifShowHuiYuan {
    display: block !important;

    p {
      display: none;
    }
  }

  .ifcreateCenterContainerShow {
    display: block;
  }

  .smallLogo {
    display: none;
  }

  .bigLogo {
    display: block;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 15vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 160px;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

// 输入框变长
@media screen and (min-width: 1400px) {
  .headerContainer {
    padding: 0px !important;
  }

  .navItem {
    padding: 10px 0px !important;
  }

  .ifShowAppContainer {
    display: block;
  }

  .ifShowHuiYuan {
    display: block !important;

    p {
      display: block !important;
    }
  }

  .ifShowMobileNav {
    display: none !important;
  }

  .ifShowPCNav {
    display: block !important;
  }

  .iptContainer {
    .el-input {
      width: 230px !important;
    }
  }

  .ifShowHuiYuan {
    display: block !important;

    p {
      display: none;
    }
  }

  .ifcreateCenterContainerShow {
    display: block;
  }

  .smallLogo {
    display: none;
  }

  .bigLogo {
    display: block;
  }

  .headerContentLeftBox {
    p {
      margin: 0 5px !important;
    }
  }

  .headerContentLeftBox {
    margin-right: 10vw !important;
  }

  .headerContentRightBox {
    .el-input {
      width: 160px;
    }
  }

  .icon-tixing {
    margin: 0 10px !important;
  }

  .icon-tixing-tianchong {
    margin: 0 10px !important;
  }
}

// 调整头像列表
@media screen and (min-width: 445px) and (max-width: 456px) {
  .avatarListContainer {
    right: 15px !important;
  }
}

@media screen and (min-width: 456px) and (max-width: 476px) {
  .avatarListContainer {
    right: 20px !important;
  }
}

@media screen and (min-width: 476px) and (max-width: 501px) {
  .avatarListContainer {
    right: 32px !important;
  }
}

@media screen and (min-width: 501px) and (max-width: 529px) {
  .avatarListContainer {
    right: 40px !important;
  }
}

@media screen and (min-width: 550px) and (max-width: 561px) {
  .avatarListContainer {
    right: 25px !important;
  }
}

@media screen and (min-width: 561px) and (max-width: 593px) {
  .avatarListContainer {
    right: 30px !important;
  }
}

@media screen and (min-width: 593px) and (max-width: 630px) {
  .avatarListContainer {
    right: 40px !important;
  }
}

@media screen and (min-width: 630px) and (max-width: 645px) {
  .avatarListContainer {
    right: 45px !important;
  }
}

@media screen and (min-width: 740px) and (max-width: 770px) {
  .avatarListContainer {
    right: 28px !important;
  }
}

@media screen and (min-width: 770px) and (max-width: 830px) {
  .avatarListContainer {
    right: 35px !important;
  }
}

@media screen and (min-width: 850px) and (max-width: 883px) {
  .avatarListContainer {
    right: 30px !important;
  }
}

@media screen and (min-width: 883px) and (max-width: 903px) {
  .avatarListContainer {
    right: 30px !important;
  }
}

@media screen and (min-width: 910px) and (max-width: 974px) {
  .avatarListContainer {
    right: 33px !important;
  }
}

@media screen and (min-width: 974px) and (max-width: 979px) {
  .avatarListContainer {
    right: 35px !important;
  }
}

@media screen and (min-width: 1008px) and (max-width: 1069px) {
  .avatarListContainer {
    right: 35px !important;
  }
}

@media screen and (min-width: 1114px) and (max-width: 1190px) {
  .avatarListContainer {
    right: 23px !important;
  }
}

@media screen and (min-width: 1190px) and (max-width: 1203px) {
  .avatarListContainer {
    right: 23px !important;
    margin-top: 10px !important;
  }
}

@media screen and (min-width: 1203px) and (max-width: 1230px) {
  .avatarListContainer {
    right: 30px !important;
    margin-top: 10px !important;
  }
}

@media screen and (min-width: 1230px) and (max-width: 1270px) {
  .avatarListContainer {
    right: 50px !important;
    margin-top: 10px !important;
  }
}

@media screen and (min-width: 1270px) and (max-width: 1393px) {
  .avatarListContainer {
    right: 0px !important;
    margin-top: 10px !important;
  }
}

@media screen and (min-width: 1270px) and (max-width: 1393px) {
  .avatarListContainer {
    right: 0px !important;
    margin-top: 10px !important;
  }
}


//创作者中心
@media screen and (min-width: 1190px) and (max-width: 1400px) {
  .createCenterContent {
    margin-top: 10px !important;
  }
}

@media screen and (min-width: 799px) and (max-width: 1463px) {
  .createCenterContent {
    right: 50px !important;
  }
}

.smallLogo {
  width: 50px;
  height: 30px;
}

.bigLogo {
  width: 100px;
  height: 30px;
}

.blankBox {
  width: 50px;
  height: 50px;
  // background-color: red;
}

.loginIptContainer {
  // background-color: red !important;
  padding: 10px 20px !important;
}

.triangle:hover {
  width: 0;
  height: 0;
  cursor: pointer;
  border-left: 0.3rem solid transparent;
  border-right: 0.3rem solid transparent;
  border-top: 0.3rem solid red;
  margin-left: 4px;
}


// .createCenterTriangle:hover .triangle {
//   transform: rotate(180deg);
//   transition: transform 0.3s ease;
// }

/* 鼠标悬停时触发旋转动画 */
.createCenterTriangle:hover .triangle {
  animation: rotate180 0.3s forwards;
}

/* 鼠标离开时触发反转动画 */
.createCenterTriangle:not(:hover) .triangle {
  animation: rotateBack 0.3s forwards;
}

@keyframes rotate180 {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(180deg);
  }
}

@keyframes rotateBack {
  from {
    transform: rotate(180deg);
  }

  to {
    transform: rotate(0deg);
  }
}

.createCenterContainer {
  .el-button:hover {
    background-color: #1171EE !important;
  }
}

.createCenterTriangle:hover {
  background-color: #1171EE !important;
}
</style>