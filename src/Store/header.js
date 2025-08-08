import { de } from 'element-plus/es/locale/index.mjs';
import { defineStore } from 'pinia';

const useHeaderStore = defineStore('header', {
  state: () => ({
    open: false
  }),
  actions: {
    openModal() {
      this.open = true;
    },
    closeModal() {
      this.open = false;
    }
  }
});

export default useHeaderStore;