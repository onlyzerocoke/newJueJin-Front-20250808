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
                                                    show-word-limit  rows="6"
                                                    resize="none"
                                                    placeholder="请输入摘要..."  :input-style="{ width: '30rem' }" ></el-input>
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



                <a-avatar class="userAvatar" :src="piniaAvatar" :size="48"></a-avatar>

            </section>



            <!-- <section class="titleContianer">
         
                <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto"
                    label-position="left">
                    <el-form-item label="标题" prop="title" class="title">
                        <el-input v-model="ruleForm.title" />
                    </el-form-item>
                </el-form>

            </section> -->





            <!-- @vue-ignore -->
            <!-- <TinyMce :menubar="''" placeholder="请输入正文..."
                :toolbar="`bold italic underline | formatselect | blockquote code codesample | bullist numlist | link image | removeformat`">
            </TinyMce> -->


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

import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { reqUploadAvatar } from '../api/api'
const { userStore } = useMainStore();
let { piniaAvatar } = storeToRefs(userStore);
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
    title: '请输入标题',
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
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],

})

const Classification = ['后端', '前端', 'Android', 'iOS', '人工智能', '开发工具', '代码人生', '阅读']

let currentClassIndex = ref<number>(0);
const clickClassItem = (index: number) => {
    currentClassIndex.value = index;
}

const selectedTags = ref<string[]>([])
const tagOptions = [
    { label: '前端', value: 'frontend' },
    { label: '后端', value: 'backend' },
    { label: 'Android', value: 'android' },
    { label: 'iOS', value: 'ios' },
    { label: '人工智能', value: 'ai' },
    { label: '开发工具', value: 'tools' },
    { label: '代码人生', value: 'code' },
    { label: '阅读', value: 'reading' },
    { label: '前端2', value: 'frontend' },
    { label: '后端2', value: 'backend' },
    { label: 'Android2', value: 'android' },
    { label: 'iOS2', value: 'ios' },
    { label: '人工智能2', value: 'ai' },
    { label: '开发工具2', value: 'tools' },
    { label: '代码人生2', value: 'code' },
    { label: '阅读2', value: 'reading' },
]

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
console.log("url", url);

const imageUrl = ref('')

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
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

                // margin-right: 37.5rem !important;

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
                    margin-right: 20px !important;
                    cursor: pointer;
                }

                .publishBtn {
                    padding: 10px 20px !important;
                    background-color: $defaultDeepWordColor;
                    color: white;
                }

                .icon-qiehuan {
                    font-size: 40px;
                    margin: 0px 40px !important;
                }

                .userAvatar {
                    width: 80% !important;
                    height: 80% !important;
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

@media screen and (min-width: 320px) and (max-width: 345px) {
    
}
</style>