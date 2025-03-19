<script setup lang="ts">
import type { ButtonType as ElButtonType } from "element-plus";
import { addFriend } from "@/apis/friend";

import { useUserStore } from "@/store/useUserStore";
const userStore = useUserStore();

const emits = defineEmits(["reload"]);

const formDataRef = ref();
const formData = ref({
  id: "",
  applyInfo: "",
});
const rules = reactive({
  applyInfo: [
    {
      required: true,
      message: "请输入申请信息",
      trigger: "blur",
    },
  ],
});

// 弹窗配置信息
const dialogConfig = ref({
  show: false,
  title: "提交申请",
  buttons: [
    {
      type: "primary" as ElButtonType,
      text: "确定",
      click: () => {
        submitApply();
      },
    },
  ],
});

// 显示弹窗，传入数据
const showFun = (data?: any) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = data;
    formData.value.applyInfo = "我是" + userStore.userInfo.nickName;
  });
};

// 提交好友申请信息
const submitApply = () => {
  // 添加成功  or  申请成功，等待对方同意
  formDataRef.value.validate(async (valid: any) => {
    if (!valid) return;
    const res = await addFriend({
      friendId: formData.value.id,
      requestMessage: formData.value.applyInfo,
    });
    if (res.status === 200) {
      ElMessage.success("申请成功，等待对方同意");
    } else {
      ElMessage.error("申请失败");
    }
  });
  dialogConfig.value.show = false;
  emits("reload");
};

defineExpose({
  showFun,
});
</script>

<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        @submit.prevent
      >
        <el-form-item>
          <el-input
            type="textarea"
            :rows="5"
            clearable
            placeholder="输入申请信息, 更容易被通过"
            v-model.trim="formData.applyInfo"
            resize="none"
            show-word-limit
            maxlength="100"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<style scoped lang="scss"></style>
