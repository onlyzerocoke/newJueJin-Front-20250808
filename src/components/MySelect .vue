<template>
  <el-select
    v-model="modelValue"
    :placeholder="placeholder"
    filterable
    :multiple="multiple"
    clearable
    @change="$emit('update:modelValue', modelValue)"
    style="width: 100%"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

interface OptionItem {
  label: string
  value: string | number
}

const props = defineProps<{
  modelValue: string | number | Array<string | number>
  options: OptionItem[]
  placeholder?: string
  multiple?: boolean
}>()

const emits = defineEmits(['update:modelValue'])

const modelValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  modelValue.value = newVal
})
</script>


<style lang="scss">
.el-select__selected-item el-select__placeholder{
  span{
    margin-left: 20px !important;
  }
}

.el-select-dropdown .el-select-dropdown__item {
  padding-left: 10px !important; /* 调整空隙大小 */
}

 .el-select-dropdown .el-select-dropdown__item:hover {
  background-color: #E8F3FF !important;

}

.el-select__selected-item,
.el-select__placeholder {
  padding-left: 8px !important;
}
</style>