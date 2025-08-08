<template>
    <div>
        <article class="paperRecomandContainer">
            <!-- 文章榜 和 换一换 -->
             <!-- <slot name="header">

             </slot>
              -->
            <section class="paperRankContainer">

                <div class="paperRankLeftContent">
                    <!-- <i class="icon iconfont icon-wenzhang"></i> -->
                     <slot name="icon"></slot>
                    <p>{{ props.title }}</p>
                </div>

                <div class="changeRightContent">
                    <i class="icon iconfont icon-huanyihuan"></i>
                    <!-- <i class="icon iconfont icon-huanyihuan"></i> -->
                    <p class="changeWord">换一换</p>
                </div>

            </section>

            <el-divider />

            <!-- 内容体 -->
            <slot name="content">

            </slot>

            <el-divider />

            <div class="seeMoreContainer">
                <p>查看更多</p>
                <i class="icon iconfont icon-xiangyoujiantou"></i>
            </div>

        </article>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps({
    title: String
});
</script>

<style lang="scss" scoped>
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


.paperRecomandContainer {
  background-color: white;
  padding: 15px !important;
  border-radius: 10px;
  margin-bottom: 20px !important;
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


  .seeMoreContainer{
    @extend .center;
    margin-top: 10px !important;
    p{
      color: $defaultWordColor;
      font-size: 14px;
      cursor: pointer;
    }

  }


</style>