//统一管理咱们项目用户相关的接口

import request from '../utils/request'

import type {
    userInfoReponseData,
    userPhoneData,
    userPhoneReponseData,
    userLoginOrRegisterData,
    focusUserParams,
    getAvatarInfoParams
} from './type/user'

import type { articleListParam,articleListId,addPaperParam,getPaperParam } from './type/article'
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
    REPLYCOMMENT_URL = '/comment/replyComment',//回复评论
    UPLOADAVATAR_URL = '/upload/uploadImage',//上传图片
    ADDPAPER_URL = '/article/addPaper',//发表文章
    GETPAPERINFO_URL = '/article/getPaperInfo',//获取文章详情页信息
    FOCUSUSER_URL = '/user/focusUser',//关注
    GETAVATARINFO_URL='/user/getAvatarInfo'// 获取关注 赞过 收藏的信息
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

//上传图片
export const reqUploadAvatar = ()=>{
    return request.post<any,any>(API.UPLOADAVATAR_URL);
}

//发表文章
export const reqAddPaper = (data:addPaperParam)=>{
    return request.post<any,any>(API.ADDPAPER_URL,data);
}

//获取文章详情页信息
export const reqPaperInfo = (data:getPaperParam)=>{
    return request.post<any,any>(API.GETPAPERINFO_URL,data)
}

//关注
export const reqFocus = (data:focusUserParams)=>{
    return request.post<any,any>(API.FOCUSUSER_URL,data)
}


/// 获取关注 赞过 收藏的信息
export const reqAvatarInfo = (data:getAvatarInfoParams)=>{
    return request.post<any,any>(API.GETAVATARINFO_URL,data)
}