<template>
  <TinyMce ref="tiny" v-model="mdlValue.fullText" :toolbar="toolbar" width="30%" height="200px" :menubar="''" />

</template>

<script setup>
import { ref } from 'vue'
import TinyMce from './Tinymce/index.vue'  // 路径根据你实际调整

const toolbar = [
  'image emoticons',

].join(' ')

const mdlValue = ref({
  fullText: ''
})
</script>

<style lang="scss">
// .mce-tab:nth-child(1) {
//   display: none !important;

// }
  .mce-container-body mce-abs-layout{
    height: 0px !important;
    display: none !important;
  }

</style>