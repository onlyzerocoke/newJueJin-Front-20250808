import type { Ref } from 'vue';
export interface sendParentParam {
    articleId: string; 
    userId: number; 
    content: string;
    parentId: number;
   
  }

  export interface getCommentParam {
    articleId: string; 
    dataNum: number; 
    type: number;
    userId:number,
    ifLogin:boolean
   
  }
