<script setup lang="ts">
import type { ButtonType as ElButtonType } from "element-plus";

// 定义自定义按钮类型
type CustomButtonType = {
  text: string;
  type?: ElButtonType;
  click: () => void;
};

const props = defineProps({
  title: {
    type: String,
  },
  show: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  buttons: {
    type: Array as () => CustomButtonType[],
  },
  top: {
    type: Number,
    default: 80,
  },
  width: {
    type: String,
    default: "30%",
  },
  padding: {
    type: Number,
    default: 15,
  },
});
// maxHeight = 视口高度 - 某个元素距离视口顶部的距离 - 底部的100像素
const maxHeight = window.innerHeight - props.top - 100;

const emits = defineEmits(["close"]);
const close = () => {
  emits("close");
};
</script>

<template>
  <div>
    <el-dialog
      :show-close="showClose"
      :model-value="show"
      :close-on-click-modal="false"
      :title="title"
      class="cust-dialog"
      :top="top + 'px'"
      :width="width"
      @close="close"
    >
      <div
        class="dialog-body"
        :style="{ 'max-height': maxHeight + 'px', padding: padding + 'px' }"
      >
        <slot></slot>
      </div>
      <template v-if="(buttons && buttons.length > 0) || showCancel">
        <div class="dialog-footer">
          <el-button @click="close" v-if="showCancel" type="info"
            >取消</el-button
          >
          <el-button
            v-for="btn in buttons"
            :type="btn.type || 'primary'"
            @click="btn.click"
          >
            {{ btn.text }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.cust-dialog {
  .el-dialog__body {
    padding: 0px;
  }
  .dialog-body {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    min-height: 80px;
    overflow: auto;
    overflow-x: hidden;
  }
  .dialog-footer {
    text-align: right;
    padding: 5px 20px;
  }
}
</style>
