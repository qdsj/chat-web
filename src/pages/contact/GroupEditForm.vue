<script setup lang="ts">
import { ElMessage } from "element-plus";

const formDataRef = ref();
const formData = ref({
  groupId: "",
  groupOwnerId: "blue123",
  groupName: "群组",
  avatarFile: "",
  numberCount: 0,
  joinType: 0,
  groupNotice: "群公告",
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
  joinType: [
    {
      required: true,
      message: "请选择加入权限",
      trigger: "change",
    },
  ],
});

const emits = defineEmits(["editBack"]);
const submit = () => {
  formDataRef.value.validate((valid: any) => {
    if (!valid) return;
  });

  if (formData.value.groupId) {
    ElMessage.success("群组修改成功");
    emits("editBack");
  } else {
    ElMessage.success("群组创建成功");
  }
  formDataRef.value.resetFields();
};

const showFun = (data: any) => {
  formDataRef.value.resetFields();
  formData.value = data;
  formData.value.avatarFile = data.groupId;
};

defineExpose({
  showFun,
});
</script>

<template>
  <el-form
    ref="formDataRef"
    :model="formData"
    :rules="rules"
    label-width="80px"
  >
    <el-form-item label="群名称" prop="groupName">
      <el-input
        maxLength="150"
        clearable
        placeholder="请输入群名称"
        v-model.trim="formData.groupName"
      ></el-input>
    </el-form-item>
    <el-form-item label="封面" prop="avatarFile">
      <AvatarUpload
        v-model="formData.avatarFile"
        ref="avatarUploadRef"
      ></AvatarUpload>
    </el-form-item>
    <el-form-item label="加入权限" prop="joinType">
      <el-radio-group v-model="formData.joinType">
        <el-radio :value="0">直接添加</el-radio>
        <el-radio :value="1">管理员同意后加入</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="公告" prop="groupNotice">
      <el-input
        clearable
        placeholder="请输入群公告"
        v-model.trim="formData.groupNotice"
        type="textarea"
        :rows="5"
        maxlength="300"
        :show-word-limit="true"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">
        {{ formData.groupId ? "修改群组" : "创建群组" }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
