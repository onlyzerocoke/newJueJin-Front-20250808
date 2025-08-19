<template>
    <div class="root">
        <article class="totalContainer">

            <section class="totalContentTop">

                <div class="totalContentLeft">
                    <Back class="back"></Back>
                    <i class="icon iconfont icon-logo"></i>
                </div>


                <div class="totalContentRight">
                    <p class="craft">草稿箱</p>
                    <!-- <el-button type="primary" class="publishBtn" @click="drawer = true">发布</el-button> -->
                    <!-- 点击发布文章后弹出框-->
                    <el-popover placement="bottom" width="auto" trigger="manual" :visible="popoverVisible"
                        :teleported="false" popper-class="article-popper" @click.stop>
                        <template #default>
                            <div ref="popoverRef">
                                <p class="popoverTitle">发布文章</p>
                                <el-divider></el-divider>
                                <div class="formContainer">

                                    <article class="formContent">

                                        <section class="ClassificationContainer">

                                            <div class="ClassificationContentLeft">
                                                <p class="star">*</p>
                                                <p class="ClassificationWord">分类:</p>
                                            </div>

                                            <div class="ClassificationContentRight">
                                                <p class="ClassificationItem" v-for="(item, index) in Classification"
                                                    :key="index" @click="clickClassItem(index)"
                                                    :style="currentClassIndex === index ? { backgroundColor: '#E8F3FF', color: '#657DFA' } : {}">
                                                    {{ item }}
                                                </p>


                                            </div>
                                        </section>

                                        <section class="addLabelContainer">
                                            <div class="addLabelContentLeft">
                                                <p class="star">*</p>
                                                <p class="addLabelWord">添加标签:</p>
                                            </div>

                                            <div style="width: 300px;" class="addLabelContentRight">
                                                <MySelect v-model="selectedTags" :options="tagOptions"
                                                    class="custom-select" placeholder="请选择标签" :append-to-body="false"
                                                    :multiple="false" @change="handleSelectChange" />

                                            </div>
                                        </section>

                                        <section class="uploadCoverImageContainer">
                                            <p>文章页面:</p>
                                            <div class="uploadCoverImageContent">

                                                <el-upload class="avatar-uploader" :action=url :show-file-list="false"
                                                    :on-success="handleAvatarSuccess"
                                                    :before-upload="beforeAvatarUpload">

                                                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />

                                                    <el-icon v-else class="avatar-uploader-icon">
                                                        <Plus />
                                                    </el-icon>
                                                </el-upload>

                                                <p>建议尺寸:192*128px(封面仅展示在首页信息流中)</p>
                                            </div>

                                        </section>


                                        <section class="AbstractContainer">

                                            <div class="AbstractContententLeft">
                                                <p class="star">*</p>
                                                <p class="addLabelWord">编辑摘要:</p>
                                            </div>


                                            <div class="AbstractContententRight">
                                                <el-input type="textarea" v-model="value" maxlength="100"
                                                    show-word-limit rows="6" resize="none" placeholder="请输入摘要..."
                                                    :input-style="{ width: '30rem' }"></el-input>
                                            </div>

                                        </section>

                                        <el-divider></el-divider>

                                        <section class="publishBtnContainer">

                                            <div class="publishBtnContentLeft">

                                            </div>

                                            <div class="publishBtnContentRight">

                                                <el-button type="primary" class="cancelBtn"
                                                    @click="popoverVisible = false">取消</el-button>
                                                <el-button type="primary" class="certainBtn"
                                                    @click="reqAddArticle">确认并发布</el-button>
                                            </div>

                                        </section>

                                    </article>
                                </div>
                            </div>
                        </template>
                        <template #reference>
                            <el-button class="publishBtn" @click="popoverVisible = !popoverVisible">发布</el-button>
                        </template>
                    </el-popover>
                    <i class="icon iconfont icon-qiehuan"></i>
                </div>



                <a-avatar class="userAvatar" :src="piniaAvatar" :size="42"></a-avatar>

            </section>




            <section class="titleContianer">

                <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto"
                    label-position="left">
                    <el-form-item label="标题" prop="title" class="title">
                        <el-input v-model="ruleForm.title" placeholder="请输入标题" />
                    </el-form-item>
                </el-form>

            </section>




 <!-- :toolbar="`bold italic underline | formatselect | blockquote code codesample | bullist numlist | link image | removeformat` -->
            <!-- @vue-ignore -->
            <TinyMce ref="editorRef" imgMaxWidth="400" :menubar="''" placeholder="请输入正文..."
                :toolbar=toolbar>
            </TinyMce>


        </article>




    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import Back from '../components/back.vue'
import useMainStore from '../Store/index'
import { storeToRefs } from "pinia";
import TinyMce from '../components/Tinymce/index.vue'
import MySelect from '../components/MySelect .vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { reqUploadAvatar, reqAddPaper,reqPaperInfo } from '../api/api'
import { addPaperParam,getPaperParam} from '../api/type/article'
import { forceLoginOut } from '../utils/repeatHooks'
import {useMessage} from '../utils/elementComponents/message'
const { userStore } = useMainStore();
const router = useRouter();
let { piniaAvatar, piniaUserId } = storeToRefs(userStore);
const title = ref('')

interface RuleForm {
    title: string
    region: string
    count: string
    date1: string
    date2: string
    delivery: boolean
    location: string
    type: string[]
    resource: string
    desc: string
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    title: '',
    region: '',
    count: '',
    date1: '',
    date2: '',
    delivery: false,
    location: '',
    type: [],
    resource: '',
    desc: '',
})


const rules = reactive<FormRules<RuleForm>>({
    title: [
        { required: true, message: '请输入标题!', trigger: 'blur' },

    ],

})

const Classification = ['后端', '前端', 'Android', 'iOS', '人工智能', '开发工具', '代码人生', '阅读']
const toolbar = [
  'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen',
  'formatselect fontselect fontsizeselect'
]
let currentClassIndex = ref<number>(0);
const clickClassItem = (index: number) => {
    currentClassIndex.value = index;
}

const selectedTags = ref<string[]>([])
const tagOptions = [
    { label: '后端', value: 0 },
    { label: 'Java', value: 1 },
    { label: 'Go', value: 2 },
    { label: '架构', value: 3 },
    { label: '面试', value: 4 },
    { label: 'Spring Boot', value: 5 },
    { label: 'Python', value: 6 },
    { label: 'MySQL', value: 7 },
    { label: '前端', value: 8 },
    { label: 'Spring', value: 9 },
    { label: 'Linux', value: 10 },
    { label: '算法', value: 11 },
    { label: 'HarmonyOS', value: 12 },
    { label: '性能优化', value: 13 },
    { label: 'JavaScript', value: 14 },
    { label: '前端', value: 15 },
    { label: 'JavaScript', value: 16 },
    { label: 'Vue.js', value: 17 },
    { label: 'React.js', value: 18 },
    { label: '面试', value: 19 },
    { label: 'CSS', value: 20 },
    { label: 'HarmonyOS', value: 21 },
    { label: '后端', value: 22 },
    { label: 'HTML', value: 23 },
    { label: 'TypeScript', value: 24 },
    { label: '前端框架', value: 25 },
    { label: 'three.js', value: 26 },
    { label: '架构', value: 27 },
    { label: 'Node.js', value: 28 },
    { label: 'Flutter', value: 29 },
    { label: 'Android', value: 30 },
    { label: '前端', value: 31 },
    { label: 'Kotlin', value: 32 },
    { label: 'HarmonyOS', value: 33 },
    { label: '面试', value: 34 },
    { label: 'Android Jetpack', value: 35 },
    { label: 'Flutter', value: 36 },
    { label: 'Java', value: 37 },
    { label: 'IOS', value: 38 },
    { label: '架构', value: 39 },
    { label: '逆向', value: 40 },
    { label: 'APP', value: 41 },
    { label: '性能优化', value: 42 },
    { label: 'Android Studio', value: 43 },
    { label: '后端', value: 44 },
    { label: 'Swift', value: 45 },
    { label: 'iOS', value: 46 },
    { label: 'Apple', value: 47 },
    { label: 'SwitftUI', value: 48 },
    { label: '前端', value: 49 },
    { label: 'Flutter', value: 50 },
    { label: '变成语言', value: 51 },
    { label: 'WWDC', value: 52 },
    { label: '架构', value: 53 },
    { label: 'Android', value: 54 },
    { label: 'Xcode', value: 55 },
    { label: 'APP', value: 56 },
    { label: '数据库', value: 57 },
    { label: '面试', value: 58 },
    { label: 'Debug', value: 59 },
    { label: '后端', value: 60 },
    { label: '前端', value: 61 },
    { label: 'AI编程', value: 62 },
    { label: 'Trae', value: 63 },
    { label: '开源', value: 64 },
    { label: 'GitHub', value: 65 },
    { label: '低代码', value: 66 },
    { label: '人工智能', value: 67 },
    { label: 'HarmonyOS', value: 68 },
    { label: '程序员', value: 69 },
    { label: 'Python', value: 70 },
    { label: 'Cursor', value: 71 },
    { label: 'JavaScript', value: 72 },
    { label: '数据库', value: 73 },
    { label: '资讯', value: 74 },
    { label: '人工智能', value: 75 },
    { label: 'AI编程', value: 76 },
    { label: 'LLM', value: 77 },
    { label: 'AIGC', value: 78 },
    { label: '后端', value: 79 },
    { label: '前端', value: 80 },
    { label: 'MCP', value: 81 },
    { label: '程序员', value: 82 },
    { label: '算法', value: 83 },
    { label: 'Python', value: 84 },
    { label: 'OpenAI', value: 85 },
    { label: 'Agent', value: 86 },
    { label: '深度学习', value: 87 },
    { label: 'Trae', value: 88 },
    { label: 'Cursor', value: 89 },
    { label: '前端', value: 90 },
    { label: '后端', value: 91 },
    { label: 'Python', value: 92 },
    { label: '程序员', value: 93 },
    { label: '算法', value: 94 },
    { label: 'HarmonyOS', value: 95 },
    { label: 'Java', value: 96 },
    { label: 'AI编程', value: 97 },
    { label: 'GitHub', value: 98 },
    { label: 'JavaScript', value: 99 },
    { label: '数据库', value: 100 },
    { label: '开源', value: 101 },
    { label: '爬虫', value: 102 },
    { label: '架构', value: 103 },
    { label: '面试', value: 104 },
    { label: '程序员', value: 105 },
    { label: '前端', value: 106 },
    { label: '后端', value: 107 },
    { label: '云原生', value: 108 },
    { label: '算法', value: 109 },
    { label: '人工智能', value: 110 },
    { label: '面试', value: 111 },
    { label: '大数据', value: 112 },
    { label: 'Python', value: 113 },
    { label: '数据库', value: 114 },
    { label: 'Linux', value: 115 },
    { label: 'JavaScript', value: 116 },
    { label: 'LLM', value: 117 },
    { label: '网络协议', value: 118 },
    { label: 'AIGC', value: 119 },
];

//控制弹出框
let popoverVisible = ref(false)

//获取下拉选择框的当前选项
const handleSelectChange = (val: string[]) => {
    selectedTags.value = val

}

// const popoverRef = ref<HTMLElement | null>(null)
// const handleClickOutside = (event: MouseEvent) => {
//     if (!popoverRef.value) return
//     const target = event.target as Node
//     if (popoverVisible.value && !popoverRef.value.contains(target)) {
//         popoverVisible.value = false
//     }
// }

const popoverRef = ref<HTMLElement | null>(null) // 弹出框内容
const popoverBtn = ref<HTMLElement | null>(null) // 按钮
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    if (
        popoverVisible.value &&
        popoverRef.value &&
        popoverBtn.value &&
        !popoverRef.value.contains(target) &&
        !popoverBtn.value.contains(target)
    ) {
        popoverVisible.value = false
    }
}


onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})


//图片上传
// @ts-ignore
const url = import.meta.env.VITE_APP_BASE_API + '/upload/uploadImage';

// 预览图片临时url
const imageUrl = ref('')
// 后端返回图片的真实url可以用于提交文章

const localUrl = ref('')
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    if (response && response.location) {
        localUrl.value = response.location
    } else {
        ElMessage.error('上传失败: 返回数据格式错误')
    }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(rawFile.type)) {
        ElMessage.error('仅支持 JPG/PNG/WEBP 格式!');
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片大小不能超过2MB')
        return false
    }
    return true
}

// 摘要
const value = ref('')

const mentionStyle = reactive({
    height: '120px',
    resize: 'none', // 禁止拖动
    lineHeight: '1.5em',
    padding: '8px'
})

watch(value, (newVal) => {
    if (newVal.length > 100) {
        ElMessage.warning('最多只能输入100个字');
        value.value = newVal.slice(0, 100);
    }
});

const editorRef = ref();
let thirstTag = ref<number>(-1);

// 每组元素个数
const groupSize = 15;

// 计算出第三级标签在第n组的索引
const getIndexInGroup = (value: any) => {
    const indexInGroup = value % groupSize;
    thirstTag.value = indexInGroup+1;
}


//发表文章
const reqAddArticle = async () => {
    const contnent = editorRef.value.getContent()

    getIndexInGroup(selectedTags.value);
    const data: addPaperParam = {
        userId: piniaUserId.value,
        title: ruleForm.title,
        abstract: value.value,
        content: contnent,
        coverImage: localUrl.value,
        type: currentClassIndex.value + 2,
        thirstTag: thirstTag.value

    }

    const res = await reqAddPaper(data);

    if (res.code == 401) {
        forceLoginOut();
        router.push('/');
    }else if(res.code==202){
        useMessage(res.msg,'warning')
    }else if(res.code==200){
        useMessage(res.msg,'success')
        window.location.reload();
    }

}


</script>

<style lang="scss">
// 全局初始化
// 初始化
html,
body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
ul,
ol,
li,
dl,
dt,
dd,
figure {
    margin: 0;
    padding: 0;
}

ul,
ol {
    list-style: none;
}

button,
input {
    border: none;
    outline: none;
}

a {
    text-decoration: none;
    color: inherit;
}

// 全局变量
$defaultTriangleColor: #515767;
$defaultDeepWordColor: #1e9cff;
$defautlShallowColor: #1e80ff;
$defaultWordColor: #666b79;

// // Flex 布局工具类
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.start {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}


.root {
    margin: 0 auto;
    background-color: white;

    .totalContainer {

        display: flex;
        flex-direction: column;

        .totalContentTop {
            @extend .between;
            // background-color: yellow;

            .totalContentLeft {
                @extend .center;
                // background-color: red;

                .back {
                    margin-top: 15px !important;
                    // background-color: orange;
                }

                margin-right: 440px !important;

                .icon {
                    font-size: 25px;
                }
            }

            .totalContentRight {
                @extend .start;

                // background-color: aqua;
                .craft {
                    padding: 5px 12px !important;
                    color: $defaultDeepWordColor;
                    border: 1.5px solid $defautlShallowColor;
                    margin: 0px 20px !important;
                    cursor: pointer;
                }

                .publishBtn {
                    padding: 10px 20px !important;
                    background-color: $defaultDeepWordColor;
                    color: white;
                }

                .icon-qiehuan {
                    font-size: 20px;
                    margin: 0px 20px !important;
                }

                .userAvatar {
                    width: 60% !important;
                    height: 60% !important;
                }
            }
        }


    }

}

.titleContianer {
    margin-bottom: 15px !important;

    .el-form-item__label {
        margin-right: 10px !important;
    }
}

.popover {
    display: flex;
    flex-direction: column;


}

.el-popover {
    padding: 20px !important;

    .popoverTitle {
        // padding: 20px !important;
        font-size: 20px;
        // background-color: yellow;
        padding-bottom: 10px !important
    }

    .formContainer {
        @extend .center;

        // background-color: yellow;
        .ClassificationContainer {
            display: flex;
            align-items: flex-start;
            margin: 20px 0px !important;

            // background-color: purple;
            .ClassificationContentLeft {
                @extend .start;
                margin-right: 5px !important;
                width: 50px !important;
                // background-color: red;



                .star {
                    @extend .center;
                    text-align: center;
                    color: #F86364;


                }

                .ClassificationWord {
                    @extend .center;

                    // background-color: yellow;
                    text-align: center;
                }

            }

            .ClassificationContentRight {
                @extend .start;
                flex-wrap: wrap;
                width: 450px !important;

                // background-color: aqua;
                .ClassificationItem {
                    @extend .center;
                    cursor: pointer;
                    color: #8690B3;
                    width: 90px !important;
                    margin-bottom: 5px !important;
                    background-color: #F4F5F5;
                    margin-right: 15px !important;
                    padding: 5px 15px !important;
                }

                .ClassificationItem:hover {
                    background-color: #E5E6EB;
                    color: #86909C;
                }
            }

        }

        .addLabelContainer {
            // @extend .center;
            display: flex;
            align-items: flex-start;
            // background-color: yellow;

            .addLabelContentLeft {
                @extend .start;
                margin-right: 10px !important;
                margin-top: 7px !important;
                // // text-align: center;
                // background-color: aqua
            }

            .star {
                @extend .center;
                text-align: center;
                color: #F86364;


            }
        }

        .uploadCoverImageContainer {
            display: flex;
            align-items: flex-start;
            margin-top: 20px !important;
            padding-left: 5px !important;

            .uploadCoverImageContent {
                display: flex;
                flex-direction: column;
                margin-left: 10px !important;

                p {
                    margin-top: 10px !important;
                    color: $defaultTriangleColor;
                }

            }
        }

        .AbstractContainer {
            display: flex;
            align-items: flex-start;
            margin-top: 10px !important;
            margin-bottom: 30px !important;

            .AbstractContententLeft {
                @extend .start;
                margin-right: 10px !important;

                .star {
                    @extend .center;
                    text-align: center;
                    color: #F86364;


                }
            }
        }
    }



}

.root {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh; // 让白色占满整个页面高度
    background-color: #fff;


}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
}

.avatar {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
}

@media screen and (min-width: 320px) and (max-width:768px) {
    .root .totalContainer .totalContentTop .totalContentLeft {
        margin-right: 0px !important;
    }

}



@media screen and (min-width: 320px) and (max-width: 375px) {




    .root .totalContainer .totalContentTop .totalContentRight .craft {
        display: inline-block; // 保证 margin 生效
        margin: 15px !important;
        padding: 5px 5px !important;

    }


    .root .totalContainer .totalContentTop .totalContentRight .icon-qiehuan {

        margin: 0 20px !important;
    }

}

@media screen and (min-width: 375px) and (max-width: 625px) {

    .root .totalContainer .totalContentTop .totalContentLeft {
        margin-right: 45px !important;
    }


    .root .totalContainer .totalContentTop .totalContentRight .craft {
        display: inline-block; // 保证 margin 生效
        margin: 15px !important;
        padding: 5px 5px !important;

    }


    .root .totalContainer .totalContentTop .totalContentRight .icon-qiehuan {

        margin: 0 25px !important;
    }

    .totalContentLeft {
        margin-left: 0px !important;
    }

}

@media screen and (min-width: 375px) and (max-width: 425px) {

    .root .totalContainer .totalContentTop .totalContentLeft {
        margin-right: 45px !important;
    }




}

@media screen and (min-width: 425px) and (max-width: 525px) {

    .root .totalContainer .totalContentTop .totalContentLeft {
        margin-right: 120px !important;
    }




}

@media screen and (min-width: 525px) and (max-width: 625px) {

    .root .totalContainer .totalContentTop .totalContentLeft {
        margin-right: 240px !important;
    }

}

@media screen and (min-width: 625px) and (max-width: 725px) {

    .root .totalContainer .totalContentTop .totalContentLeft {
        margin-right: 300px !important;
    }

}

@media screen and (min-width: 725px) and (max-width: 768px) {

    .root .totalContainer .totalContentTop .totalContentLeft {
        margin-right: 300px !important;
    }

}





@media screen and (min-width:425px) and (max-width: 768px) {
    .root .totalContainer .totalContentTop .totalContentRight .craft {
        display: inline-block; // 保证 margin 生效
        margin: 10px !important;
        padding: 5px 5px !important;

    }


    .root .totalContainer .totalContentTop .totalContentRight .icon-qiehuan {

        margin: 0 15px !important;
    }

}

.publishBtnContainer {
    margin-top: 20px !important;
    @extend .between;

    .publishBtnContentRight {
        @extend .start;

        .el-button {
            margin-right: 10px !important;
        }

        .cancelBtn {
            background-color: white;
            padding: 10px 25px !important;
            color: $defaultDeepWordColor;
            border: 1px solid $defaultDeepWordColor;
        }

        .certainBtn {
            background-color: $defaultDeepWordColor;
            padding: 10px 15px !important;
            color: white;
            border: 1px solid #1E80FF;
        }
    }
}
</style>