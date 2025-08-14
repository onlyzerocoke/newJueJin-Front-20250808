import { ElMessage } from 'element-plus';
import useMainStore from '../Store/index.js';
import { storeToRefs } from 'pinia';

export const forceLoginOut = () => {
  const { userStore } = useMainStore();
  const { piniaToken, piniaIfLogin, piniaAvatar, piniaUserId } = storeToRefs(userStore);

  piniaToken.value = '';
  piniaIfLogin.value = false;
  piniaAvatar.value = '';
  piniaUserId.value = 0;
  ElMessage.info({
    message: '您已退出登录',
    type: 'error', // 注意：不能写 ElMessage.info，还要传 type
    duration: 30000,
  });
  window.location.reload();
};