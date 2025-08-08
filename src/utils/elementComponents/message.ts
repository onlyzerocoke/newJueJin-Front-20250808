// utils/message.ts
import { ElMessage } from 'element-plus'
export function useMessage(message: string,type?: 'success' | 'warning' | 'info' | 'error',duration?: number) {
    ElMessage({
        message,
        duration,
        type,
        showClose: true,
    })
}