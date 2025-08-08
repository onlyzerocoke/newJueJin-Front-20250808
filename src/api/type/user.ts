// ./type.ts
import type { Ref } from 'vue';
export interface loginFormData {
    username: string; // 用户名
    password: string; // 密码
  }
  
  export interface loginResponseData {
    code: number; // 响应码
    message: string; // 响应消息
    data: {
      token: string; // 登录成功后返回的 token
    };
  }
  
  export interface userInfoReponseData {
    code: number; // 响应码
    message: string; // 响应消息
    data: {
      username: string; // 用户名
      role: string; // 用户角色
      avatar: string; // 用户头像
      email: string; // 用户邮箱
      [key: string]: any; // 其他用户信息
    };
  }

  //传给后端的值类型定义
  export interface userPhoneData {
    phone: string; // 手机号码
    countryCode: string; // 国家代码
  }
//后端返回的值类型定义
  export interface userPhoneReponseData {
    code: number; // 响应码
    message: string; // 响应消息
    data: {
      code: string; // 短信验证码
    };
  }

  export interface userLoginOrRegisterData {
   phone:string;  //手机号码
   code:string;   //验证码
  }