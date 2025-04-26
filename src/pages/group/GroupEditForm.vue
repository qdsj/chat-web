<script setup lang="ts">
import { useGroupStore } from "@/store/userGroupStore";

const groupStore = useGroupStore();

const formDataRef = ref();
const formData = ref({
  groupId: "",
  groupName: "",
  avatarFile: "",
  groupDescription: "",
  type: "",
});

const rules = ref({
  groupName: [
    {
      required: true,
      message: "请输入群名称",
      trigger: "blur",
    },
  ],
  // avatarFile: [
  //   {
  //     required: true,
  //     message: "请上传封面图片",
  //     trigger: "change",
  //   },
  // ],
  groupDescription: [
    {
      required: true,
      message: "请输入群聊描述",
      trigger: "blur",
    },
  ],
});

const emits = defineEmits(["editBack"]);
const submit = () => {
  formDataRef.value.validate(async (valid: any) => {
    if (!valid) return;
    const { groupId, groupDescription, type } = formData.value;
    await groupStore.updateGroupChatInfo(groupId, groupDescription, type);
    await groupStore.getGroupChatList();
    formDataRef.value.resetFields();
    emits("editBack");
  });
};

const showFun = (data: any) => {
  formData.value = data;
  formData.value.avatarFile = data.groupId;
};

defineExpose({
  showFun,
});
</script>

<template>
  <el-form ref="formDataRef" :model="formData" :rules="rules">
    <el-form-item label="群名称" prop="groupName">
      <el-input
        maxLength="150"
        clearable
        placeholder="请输入群名称"
        v-model.trim="formData.groupName"
      ></el-input>
    </el-form-item>
    <el-form-item label="群聊描述" prop="groupDescription">
      <el-input
        clearable
        placeholder="请输入群聊描述"
        v-model.trim="formData.groupDescription"
        type="textarea"
        :rows="5"
        maxlength="300"
        :show-word-limit="true"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">
        {{ "修改群聊信息" }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
:deep(.el-form-item__content) {
  justify-content: center;
}
</style>
