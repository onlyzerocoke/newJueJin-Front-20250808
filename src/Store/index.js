
import userStore from './user'
import useHeaderStore from './header'
export default function useMainStore() {
   return {
     userStore: userStore(),
     useHeaderStore: useHeaderStore(),
   }
 }