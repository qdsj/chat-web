<script setup lang="ts">
import type { ButtonType as ElButtonType } from "element-plus";
import { ElMessage } from "element-plus";

import { useUserStore } from "@/store/useUserStore";
import { useFriendStore } from "@/store/useFriendStore";
import { useGroupStore } from "@/store/userGroupStore";
const userStore = useUserStore();
const friendStore = useFriendStore();
const groupStore = useGroupStore();

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
    if (formDataRef.value) {
      formDataRef.value.resetFields();
    }
    formData.value = data;
    formData.value.applyInfo = "我是" + userStore.userInfo!.username;
  });
};

// 提交好友申请信息
const submitApply = () => {
  // 添加成功  or  申请成功，等待对方同意
  formDataRef.value.validate(async (valid: any) => {
    if (!valid) return;
    const [error, isSuccess] = await friendStore.addFriend(
      formData.value.id,
      formData.value.applyInfo
    );

    if (isSuccess) {
      ElMessage.success("申请成功，等待对方同意");
    } else {
      ElMessage.error(error || "申请失败");
    }
  });
  dialogConfig.value.show = false;
  groupStore.isSearching = false;
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
        <el-form-item prop="applyInfo">
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
