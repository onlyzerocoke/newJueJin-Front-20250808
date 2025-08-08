//统一管理咱们项目用户相关的接口

import request from '../utils/request'

import type {

    loginFormData,

    loginResponseData,

    userInfoReponseData,

    userPhoneData,
    userPhoneReponseData,
    userLoginOrRegisterData
} from './type/user'

import type { articleListParam,articleListId } from './type/article'
//项目用户相关的请求地址

enum API {
    LOGINOREGISTER_URL = '/loginOrRegister',
    USERINFO_URL = '/admin/acl/index/info',
    MESSAGE_URL = '/sendSmsCode',
    ARTICLELIST_URL = '/article/getArticleList',
    PRAISEPAPER_URL='article/addPraise'
}


//登录接口
export const reqLoginOrRegister = (data: userLoginOrRegisterData) =>
    request.post<any, any>(API.LOGINOREGISTER_URL, data)

//获取用户信息
export const reqUserInfo = () =>
    request.get<any, userInfoReponseData>(API.USERINFO_URL)

//获取验证码
export const reqMessageCode = (data: userPhoneData) =>
    request.post<any, userPhoneReponseData>(API.MESSAGE_URL, data)

// 获取文章列表
export const reqArticleList = (data: articleListParam) =>
    request.post<any, any>(API.ARTICLELIST_URL, data)


// 点赞文章
export const reqPraisePaper = (data: articleListId) =>{
    return request.post<any,any>(API.PRAISEPAPER_URL,data)
}
