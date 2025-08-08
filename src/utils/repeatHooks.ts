import { ElMessage } from 'element-plus';
import useMainStore from '../Store/index.js';
import { storeToRefs } from 'pinia';

export const forceLoginOut = () => {
  const { userStore } = useMainStore(); // 👈 调用放进函数内部
  const { piniaToken, piniaIfLogin } = storeToRefs(userStore);

  piniaToken.value = '';
  piniaIfLogin.value = false;

  ElMessage.info({
  message: '您已退出登录',
  type: 'error', // 注意：不能写 ElMessage.info，还要传 type
  duration: 30000,
});
  window.location.reload();
};