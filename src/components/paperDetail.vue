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
            <i :class="item.defaultName"></i>
          </article>
        </div>
      </div>
      <!-- 文章内容 -->
      <div class="paperContainer">
        <article class="paperContent">
          <h1>Flutter 使用 AI Cursor 快速完成一个图表封装【提效】</h1>
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
const route = useRoute()
const paperId = route.params.id
const showElement = ref(false);
type typeIcon = {
  defaultName: String,
}
// 图标名称
const iconArr: typeIcon[] = [{ 'defaultName': 'icon iconfont icon-dianzan' }, { 'defaultName': 'icon iconfont icon-bg-chat' }, { 'defaultName': 'icon iconfont icon-shoucang-yishoucang' }, { 'defaultName': 'icon iconfont icon-fenxiangyifenxiang' }, { 'defaultName': 'icon iconfont icon-xinfangjubao' }, { 'defaultName': 'icon iconfont icon-saomiao1' }]
const handleScroll = () => {
  showElement.value = window.scrollY >= 200;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
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
    align-items: flex-start;
    margin-top: 20px !important;

    // width: 200px;
    height: 3000px;
    // background-color: red;

    .rightPersonInfoContainer {
      @extend .center;
      // width: 200px;
      // height: 100px;
      background-color: orange;
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

          .focus{
            background-color:#1E80FF ;
          }

           .focus:hover{
            background-color: #1171EE;
           }

           .private:hover{
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
  display: flex;
  flex-direction: column;
  padding: 10px !important;
  // background-color: purple;
  background-color: white;
  max-width: 1500px !important;
  margin-right: 20px !important
  // margin-right: 50px !important;

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
</style>