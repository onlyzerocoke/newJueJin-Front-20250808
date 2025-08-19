import type { Ref } from 'vue';
export interface articleListParam {
    firstTag: number; 
    secondTag: number; 
    thirstTag: number;
    page: number;
    limit: number;
    piniaToken:string;
    piniaUserId: number; // 用户ID
  }

  export interface articleListId {
    paperId: number; // 文章ID
  }


  export interface addPaperParam {
    userId: number; 
    title: string; 
    abstract: string;
    content: string;
    coverImage: string;
    type:number;
    thirstTag: number; // 用户ID
  }

   export interface getPaperParam {
    userId: number,
    paperId:string
  }
