<template>
  <div class="root">


    <main class="main">
      <!-- 图标 -->
      <div class="leftIconPlaceholder">
        <div class="leftIconContainer">
          <section v-if="showElement">
            <div class="avatar">
              <div>
                <a-avatar class="userAvatar" :src="authorInfo?.avatar"></a-avatar>
              </div>


            </div>
            <p class="follow" v-show="!authorInfo?.followStatus" @click="toFocus">关注</p>
            <p class="focusBlankBox">&nbsp;&nbsp;&nbsp;</p>
          </section>

          <template v-for="(item, index) in iconArr" :key="index">
            <el-badge class="item"
              :value="item.commentNum == 0 ? (item.praiseNum == 0 ? (item.collectNum == 0 ? '' : item.collectNum) : item.praiseNum) : item.commentNum"
              color="#C2C8D1" :badge-style="getCircleStyle(item, index)">
              <article class="iconContent">
                <i :class="item.ifPraised ? item.activeName : (currentIndex == index ? item.hoverName : item.defaultName)"
                  @mouseenter="ifEnterIcon(true, index)" @mouseleave="ifEnterIcon(false, index)"
                  @click="ifClickIcon(index)"></i>

              </article>
            </el-badge>
          </template>

        </div>
      </div>
      <!-- 文章内容 -->
      <div class="paperContainer">
        <!-- <section class="back" @click="backIndex">
          <i class="icon iconfont icon-xiangzuojiantou"></i>
        </section> -->
        <Back></Back>

        <article class="paperContent">
          <h1>{{ paperInfo?.title }}</h1>
        </article>

        <article class="infoContainer">
          <section class="infoContentLeft">
            <p class="authorName">{{ paperInfo?.author }}</p>
            <P class="date">{{ formatDate(paperInfo?.create_time) }}</P>
            <section class="view">
              <i class="icon iconfont icon-yanjing"></i>
              <span>{{ paperInfo?.view }}</span>
            </section>
          </section>


          <el-button type="primary" class="focus" @click="toFocus" v-if="!authorInfo?.followStatus">关注</el-button>
          <el-button type="primary" class="beFocusBtn" @click="toFocus" v-else>√ &nbsp;&nbsp;已关注</el-button>
        </article>

        <article class="paperDeatail">
          <div v-html="paperInfo?.content"></div>
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


                <TinyMce ref="editorRef" v-model="mdlValue.fullText" :toolbar="toolbar" :width="editorWidth"
                  :height="editorHeight" :menubar="''" v-if="piniaIfLogin" />

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
                      <TinyMce v-model="replyContentMap[item.id]" :toolbar="toolbar" :width="editorWidth"
                        :height="editorHeight" @input="(val) => replyContentMap[item.id] = val" :menubar="''" />

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
                        <p v-if="jtem.type == 1">回复{{ jtem.replyname }}</p>
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
                        <TinyMce v-model="replyContentMap[jtem.id]" :toolbar="toolbar" :width="editorWidth"
                          :height="editorHeight" :menubar="''" @input="(val) => replyContentMap[jtem.id] = val" />

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
              <a-avatar class="userAvatar" :src="authorInfo?.avatar"></a-avatar>
            </section>

            <section class="nameAndOccupationContainer">
              <p class="name">{{ authorInfo?.name }}</p>
              <p class="occupation">{{ authorInfo?.occupation }}</p>

            </section>
          </article>

          <div class="paperNumAndFansContainer">
            <article class="paperNumAndFansContent">
              <section class="paperNumAndFansItem">
                <p>{{ authorInfo?.paperNum }}</p>
                <p>文章</p>
              </section>

              <section class="paperNumAndFansItem">
                <p>{{ authorInfo?.views }}</p>
                <p>阅读</p>
              </section>

              <section class="paperNumAndFansItem">
                <p>{{ authorInfo?.fans }}</p>
                <p>粉丝</p>
              </section>

            </article>

            <article class="btnContainer">
              <el-button type="primary" class="focus" @click="toFocus" v-if="!authorInfo?.followStatus">关注</el-button>
              <el-button type="primary" class="beFocusBtn" @click="toFocus" v-else>√ &nbsp;&nbsp;已关注</el-button>
              <el-button type="primary" plain class="private">私信</el-button>
            </article>


          </div>
        </article>

      </div>

      <!-- 评论区抽屉 -->
      <el-drawer class="myDrawer" v-model="drawer" :with-header="false" size="drawerSize">
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


                <TinyMce ref="editorRef" v-model="mdlValue.fullText" :toolbar="toolbar" :width="editorWidth"
                  :height="editorHeight" :menubar="''" v-if="piniaIfLogin" />

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
                      <TinyMce v-model="replyContentMap[item.id]" :toolbar="toolbar" :width="editorWidth"
                        :height="editorHeight" @input="(val) => replyContentMap[item.id] = val" :menubar="''" />

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
                        <p v-if="jtem.type == 1">回复{{ jtem.replyname }}</p>
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
                        <TinyMce v-model="replyContentMap[jtem.id]" :toolbar="toolbar" :width="editorWidth"
                          :height="editorHeight" :menubar="''" @input="(val) => replyContentMap[jtem.id] = val" />

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
      </el-drawer>

    </main>

    <!-- 0~600px显示的底部导航栏 -->
    <div class="tabbar">
      <template v-for="(item, index) in iconArr.slice(0, 3)" :key="index">
        <article class="iconContent">
          <i :class="item.ifPraised ? item.activeName : (currentIndex == index ? item.hoverName : item.defaultName)"
            @mouseenter="ifEnterIcon(true, index)" @mouseleave="ifEnterIcon(false, index)"
            @click="ifClickIcon(index)"></i>
          <p>{{ item.commentNum == 0 ? (item.praiseNum == 0 ? (item.collectNum == 0 ? '' : item.collectNum) :
            item.praiseNum) : item.commentNum }}</p>
        </article>
      </template>

      <section>

        <div class="avatar">
          <div>
            <a-avatar class="userAvatar" :src="authorInfo?.avatar"></a-avatar>
          </div>
        </div>
        <p class="follow" v-show="!authorInfo?.followStatus" @click="toFocus">关注</p>

      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref, Ref, onMounted, onBeforeUnmount, reactive, computed } from 'vue';
import type { ComputedRef } from 'vue'
import Back from '../components/back.vue'
import { storeToRefs } from "pinia";
import type { sendParentParam, getCommentParam, addCommentPraiseParam, replyCommentParam } from '../api/type/comment'
import type { getPaperParam, articleListId } from '../api/type/article'
import type { focusUserParams } from '../api/type/user'
import '@opentiny/fluent-editor/style.css';
import skeleton from './skeleton.vue';
import { useRouter } from 'vue-router'
import TinyMce from './Tinymce/index.vue'
import {
  ArrowDown
} from '@element-plus/icons-vue'
import { useMessage } from '../utils/elementComponents/message'
import useMainStore from '../Store/index'
import { reqParentComment, reqCommentList, reqPraiseComment, reqReplyComment, reqPaperInfo, reqPraisePaper, reqFocus } from '../api/api';
import { forceLoginOut } from '../utils/repeatHooks'
import blankData from '../components/blankData.vue'
const { userStore, useHeaderStore } = useMainStore();
const { piniaUserId, piniaAvatar, piniaIfLogin, piniaFirstTag, piniaSecondTag } = storeToRefs(userStore);
let { open } = storeToRefs(useHeaderStore);
const route = useRoute()
let paperId = route.params.id as string;
const showElement = ref(false);

type typeIcon = {
  ifPraised: boolean,
  defaultName: string,
  hoverName: string,
  activeName: string,
  ifShowBadge: boolean,
  praiseNum: number | ComputedRef<number>,
  commentNum: number | ComputedRef<number>,
  collectNum: number | ComputedRef<number>,
}

// 总评论条数
let totalCommentNum: Ref<number> = ref(0);
// 总赞数
let totalPraiseNum: Ref<number> = ref(0);

const commentNum = computed(() => totalCommentNum.value)
const praiseNum = computed(() => totalPraiseNum.value)
// 图标名称
const iconArr = reactive<typeIcon[]>([
  { 'ifPraised': false, 'defaultName': 'icon iconfont icon-dianzan', 'hoverName': 'icon iconfont icon-dianzan_kuai', 'activeName': 'icon iconfont icon-zan1', 'ifShowBadge': true, 'commentNum': 0, 'praiseNum': praiseNum, 'collectNum': 0 },
  { 'ifPraised': false, 'defaultName': 'icon iconfont icon-bg-chat', 'hoverName': 'icon iconfont icon-duihua', 'activeName': '', 'ifShowBadge': true, commentNum, 'praiseNum': 0, 'collectNum': 0 },
  { 'ifPraised': false, 'defaultName': 'icon iconfont icon-shoucang-yishoucang', 'hoverName': 'icon iconfont icon-a-shoucang-yishoucang', 'activeName': 'icon-shoucang_shixin', 'ifShowBadge': true, 'commentNum': 0, 'praiseNum': 0, 'collectNum': 0 },
  { 'ifPraised': false, 'defaultName': 'icon iconfont icon-fenxiangyifenxiang', 'hoverName': 'icon iconfont icon-fenxiang', 'activeName': '', 'ifShowBadge': false, 'commentNum': 0, 'praiseNum': 0, 'collectNum': 0 },
  { 'ifPraised': false, 'defaultName': 'icon iconfont icon-xinfangjubao', 'hoverName': 'icon iconfont icon-jubao', 'activeName': '', 'ifShowBadge': false, 'commentNum': 0, 'praiseNum': 0, 'collectNum': 0 },
  { 'ifPraised': false, 'defaultName': 'icon iconfont icon-saomiao1', 'hoverName': 'icon iconfont icon-saomiao', 'activeName': '', 'ifShowBadge': false, 'commentNum': 0, 'praiseNum': 0, 'collectNum': 0 }])

const handleScroll = () => {
  showElement.value = window.scrollY >= 200;
};





onMounted(() => {
  getCommentList(false)
  window.addEventListener('scroll', handleScroll);
  getPaperInfo();
  updateEditorSize(); // 初始化判断
  window.addEventListener('resize', updateEditorSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', updateEditorSize);
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
  //replyingCommentId.value === commentId说明点击了当前评论的富文本编辑器已经打开
  replyingCommentId.value = replyingCommentId.value === commentId ? null : commentId
}

const replyContentMap = reactive<Record<number, string>>({})
// 发送回复
const sendReply = async (replyid: number, type: number, replyName: string, parentId: number,) => {

  // const content = replyEditorRef.value.getContent()
  const content = replyContentMap[replyid] || ''

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
  replyContentMap[replyid] = ''
  replyingCommentId.value = null
}
// 获取文章内容
let authorid: Ref<number> = ref(0);





const router = useRouter()
// 返回首页
const backIndex = () => {
  piniaSecondTag.value = 0;
  router.push('/')
  // router.back()
  // window.location.reload();

  // router.push(`/`)
}

let paperInfo = ref<any>();
let authorInfo = ref<any>();

//获取文章详情页信息
const getPaperInfo = async () => {
  const data: getPaperParam = {
    userId: piniaUserId.value,
    paperId: paperId
  }

  const res = await reqPaperInfo(data);
  if (res.code == 200) {
    paperInfo.value = res.data.articleInfo;
    authorInfo.value = res.data.authorInfo;
    iconArr[0].ifPraised = res.ifPraiseCurrentPaper;
    totalPraiseNum.value = res.data.articleInfo.praise;
  }

}

//格式化文章日期
const formatDate = (dateTimeStr: string) => {
  if (!dateTimeStr) return '';
  return dateTimeStr.substring(0, 10);

}
//评论抽屉
const drawer = ref(false);

const ifClickIcon = async (index: number) => {

  // 处理点赞逻辑
  if (index == 0) {
    const data: articleListId = {
      paperId: Number(paperId)
    }
    const res = await reqPraisePaper(data)
    iconArr[0].ifPraised = res.data?.praiseStatus;
    totalPraiseNum.value = res.data?.praiseNum;
  }

  //处理评论逻辑
  if (index == 1) {
    drawer.value = !drawer.value;
  }

  //TODO:处理收藏逻辑
  // if (iconArr[index].ifPraised) {

  // }
}



// circle 样式默认值
const defaultCircleStyle = {
  backgroundColor: '#C2C8D1',
  color: '#fff',
  borderRadius: '50%',
  padding: '5px !important'
};

// circle 样式 active 值
const activeCircleStyle = {
  backgroundColor: '#1E80FF',
  color: '#fff',
  borderRadius: '50%',
  padding: '5px !important'
};

const getCircleStyle = (item: any, index: number) => {
  const iconClass = item.ifPraised ? item.activeName : (currentIndex.value === index ? item.hoverName : item.defaultName);
  // 如果当前 class 是 activeName 就返回 active 样式
  if (iconClass === item.activeName && item.activeName !== '') {
    return activeCircleStyle;
  }
  return defaultCircleStyle;
};

let editorWidth = ref(480);
let editorHeight = ref(100);

const updateEditorSize = () => {
  if (window.innerWidth < 601) {
    editorWidth.value = 250;
    editorHeight.value = 150;
  } else if (600 < window.innerWidth && window.innerWidth < 1001) {
    editorWidth.value = 400;
    editorHeight.value = 200;
  }

  else {
    editorWidth.value = 480;
    editorHeight.value = 100;
  }
}



//关注
const toFocus = async () => {
  const data: focusUserParams = {
    userId: piniaUserId.value,
    //@ts-ignore
    authorId: authorInfo.value.id
  }

  const res = await reqFocus(data);

  if (res.code == 400) {
    useMessage(res.message, 'warning')
  } else if (res.code == 401) {
    forceLoginOut();
  } else if (res.code == 200) {
    authorInfo.value.fans = res.data.newFansNum;
    authorInfo.value.followStatus = res.data.followStatus;
  }
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
  // background-color: #F2F3F5;
  @extend .center;
  background-color: #F2F3F5 !important;

  // 或者直接去掉 overflow

  .leftIconContainer {
    position: fixed;
    // margin-right: 15px !important;
    display: flex;
    flex-direction: column;
    align-items: center;

    .avatar {
      @extend .center;
      width: 40px;
      height: 40px;
      background-color: white;
      // background-color: yellow;
      padding: 7px !important;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .userAvatar {
        width: 40px;
        height: 40px;
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
    padding-bottom: 60px;
    /* 留出给底部栏的空间 */
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
  margin-bottom: 10px !important;
}

.leftIconPlaceholder {
  width: 60px; // 设置占位宽度（根据你设计图实际宽度来）
}

.paperContainer {
  width: 750px !important;
  display: flex;
  flex-direction: column;
  padding: 10px !important;
  background-color: white;
  // background-color: purple;
  // max-width: 1500px !important;
  margin-right: 20px !important; // margin-right: 50px !important;

}




.infoContainer {
  @extend .between;

  .infoContentLeft {

    @extend .start;
  }

  .beFocusBtn {
    display: none !important;
  }

  .focus {
    display: none !important;
  }

  margin: 10px 0px !important;

  .focus {
    padding: 5px 20px !important;
  }

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
  margin-top: 10px !important;

  // background-color: red;
  // margin: 0 auto !important;
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
  // width: 10%;
  padding: 5px 10px !important;

}

.btnContainer {
  @extend .between;
  margin-top: 10px !important;
  width: 74%;

  // background-color: red;
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

.paperDeatail {
  img {
    max-width: 400px !important;
    width: auto !important;
    height: auto !important;
    margin: 0 auto !important;
  }
}

.myDrawer {
  padding: 20px !important;
}

//0~600
//0~600的公共样式
@media screen and (min-width:0px) and (max-width:600px) {
  .rightPersonInfoContainer {
    display: none !important;
  }

  .leftIconContainer {
    display: none !important;
  }

  .el-badge {
    display: none !important;
  }



  .btnContainer {
    width: 90%;
  }

  //让tabbar不会因为上移而消失
  .root {
    position: relative;
    overflow-x: hidden;
    overflow-y: visible; // 或者直接去掉 overflow
  }

  .tabbar {
    display: block !important;
    width: 100%;
    height: 50px;
    bottom: 0;
    position: fixed;
    left: 0;
    background-color: white;
    z-index: 9999 !important;
    border-top: 1px solid #E4E6EB;
    display: flex !important;
    justify-content: space-around; // 平均分布
    align-items: center; // 垂直居中

    .iconContent {
      //  background-color: aqua;
      display: flex;

      p {
        margin-left: 5px !important;
      }
    }

    .avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px !important;
      height: 40px !important;
      border-radius: 50%;
      // background-color: red !important;
    }

  }


}


@media screen and (max-width:320px) {
  .paperDeatail {
    img {
      max-width: 200px !important;
    }

  }

  .paperContainer {
    margin: 0 auto;
    width: 350px !important;
    // margin-left: -20px !important;
  }

}

@media screen and (min-width:320px) and (max-width:380px) {
  .paperDeatail {
    img {
      max-width: 200px !important;
    }

  }

  .paperContainer {
    margin: 0 auto;
    width: 350px !important;
    margin-left: -20px !important;
  }

}

@media screen and (min-width:380px) and (max-width:460px) {
  .paperDeatail {
    img {
      max-width: 200px !important;
    }

  }

  .paperContainer {
    margin: 0 auto;
    width: 400px !important;
    margin-left: -20px !important;
  }

}

@media screen and (min-width:380px) and (max-width:460px) {
  .paperDeatail {
    img {
      max-width: 200px !important;
    }

  }

  .paperContainer {
    margin: 0 auto;
    width: 400px !important;
    margin-left: -20px !important;
  }

}

@media screen and (min-width:460px) and (max-width:520px) {
  .paperDeatail {
    img {
      max-width: 200px !important;
    }

  }

  .paperContainer {
    margin: 0 auto;
    width: 450px !important;
    margin-left: -20px !important;
  }

}

@media screen and (min-width:520px) and (max-width:601px) {
  .paperDeatail {
    img {
      max-width: 200px !important;
    }

  }

  .paperContainer {
    margin: 0 auto;
    width: 490px !important;
    margin-left: -20px !important;
  }

}

//⬆

//600~1000
//600~1000的公共样式
@media screen and (min-width:601px) and (max-width:1000px) {

  .btnContainer {
    width: 90%;
  }

  .rightPersonInfoContainer {
    display: none !important;
  }

  .tabbar {
    display: none;
  }

  // .paperContainer {
  //   margin-left: 10px !important;
  // }

}


@media screen and (min-width:601px) and (max-width:635px) {
  .paperDeatail {

    img {
      max-width: 300px !important;

    }

  }

  .paperContainer {
    margin: 0 auto;
    width: 480px !important;
    margin-left: -5px !important;
  }

}

@media screen and (min-width:635px) and (max-width:700px) {
  .paperDeatail {

    img {
      max-width: 300px !important;

    }

  }

  .paperContainer {
    margin: 0 auto;
    width: 540px !important;
    margin-left: -5px !important;
  }

}

@media screen and (min-width:700px) and (max-width:800px) {
  .paperDeatail {

    img {
      max-width: 330px !important;

    }

  }

  .paperContainer {
    margin: 0 auto;
    width: 540px !important;
    margin-left: -5px !important;
  }

}

@media screen and (min-width:800px) and (max-width:900px) {
  .paperDeatail {

    img {
      max-width: 330px !important;

    }

  }

  .paperContainer {
    margin: 0 auto;
    width: 580px !important;
    // margin-left: -5px !important;
  }

}


@media screen and (min-width:900px) and (max-width:1000px) {
  .paperDeatail {

    img {
      max-width: 350px !important;

    }

  }

  .paperContainer {
    margin: 0 auto;
    width: 700px !important;
    // margin-left: -5px !important;
  }

}


@media screen and (min-width:1000px) and (max-width:1100px) {
  .paperDeatail {

    img {
      max-width: 350px !important;

    }

  }

  .paperContainer {
    margin: 0 auto;
    width: 600px !important;
    // margin-left: -5px !important;
  }

}


.beFocusBtn {
  background-color: #FFFFFF !important;
  border: 1px solid #E4E6EB !important;
  color: #949BA7 !important;

}


.tabbar {
  display: none;
}

@media screen and (min-width:0px) and (max-width:1001px) {
  .infoContainer {
    .focus {
      display: block !important;

    }

    .beFocusBtn {
      display: block !important;
    }
  }

}
</style>