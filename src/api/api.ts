//统一管理咱们项目用户相关的接口

import request from '../utils/request'

import type {
    userInfoReponseData,
    userPhoneData,
    userPhoneReponseData,
    userLoginOrRegisterData
} from './type/user'

import type { articleListParam,articleListId } from './type/article'
import type {sendParentParam,getCommentParam,addCommentPraiseParam,replyCommentParam} from './type/comment'
//项目用户相关的请求地址

enum API {
    LOGINOREGISTER_URL = '/loginOrRegister',
    USERINFO_URL = '/admin/acl/index/info',
    MESSAGE_URL = '/sendSmsCode',
    ARTICLELIST_URL = '/article/getArticleList',
    PRAISEPAPER_URL='/article/addPraise',//点赞
    PARENTCOMMENT_URL = '/comment/addComment',//发表评论
    GETCOMMENT_URL = '/comment/getCommentList',//获取评论列表
    COMMENTPRAISE_URL='/comment/addCommentPraise',//点赞评论
    REPLYCOMMENT_URL = '/comment/replyComment'//回复评论
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

// 发表父级评论
export const reqParentComment= (data:sendParentParam)=>{
    return request.post<any,any>(API.PARENTCOMMENT_URL,data);
}

// 获取评论列表
export const reqCommentList = (data:getCommentParam)=>{
    return request.post<any,any>(API.GETCOMMENT_URL,data)
}


//点赞评论
export const reqPraiseComment = (data:addCommentPraiseParam)=>{
    return request.post<any,any>(API.COMMENTPRAISE_URL,data)
}

// 回复评论
export const reqReplyComment = (data:replyCommentParam)=>{
    return request.post<any,any>(API.REPLYCOMMENT_URL,data);
}