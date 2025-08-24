
import { defineStore } from 'pinia'
const userStore = defineStore('user', {
  persist: true,
  state: () => {
    return {
      piniaToken: '',
      piniaIfLogin: false,
      piniaAvatar: '',
      piniaUserId: 0,
      piniaUserName:'',
      //前端、后端等标签
      piniaFirstTag: 0,
      // 推荐 最新
      piniaSecondTag: 0,
      piniaThirstTag: 0,

    }
  },
  getters: {

  },

  actions: {

  }
})

export default userStore;