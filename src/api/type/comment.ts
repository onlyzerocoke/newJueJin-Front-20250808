import type { Ref } from 'vue';
export interface sendParentParam {
  articleId: string,
  userId: number,
  content: string,
  parentId: number,

}

export interface getCommentParam {
  articleId: string,
  dataNum: number,
  type: number,
  userId: number,
  ifLogin: boolean

}


export interface addCommentPraiseParam {
  commentId: string,
  userId: number,
}


export interface replyCommentParam {
  parentId: number,
  userId: number,
  articleId: string,
  content: string,
  replyName: string,
  type:number
}

