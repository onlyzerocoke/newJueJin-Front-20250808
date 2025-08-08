import { App } from 'vue';
import MeScrollComponent from './components/MeScroll.vue';
import useMeScroll from './useMeScroll';

export { MeScrollComponent, useMeScroll };

export default {
  install(app: App) {
    app.component('MeScroll', MeScrollComponent);
  }
};
