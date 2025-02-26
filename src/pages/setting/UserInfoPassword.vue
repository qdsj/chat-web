<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
const emits = defineEmits(["editBack"]);
const formDataRef = ref();
const formData = reactive({
  password: "",
  rePassword: "",
});
const validateRePass = (rule: any, value: string) => {
  if (value !== formData.password) {
    return new Error("两次输入的密码不一致");
  }
  return true;
};
const rules = reactive({
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    {
      min: 6,
      max: 12,
      message: "长度在 6 到 12 个字符",
      trigger: "blur",
    },
  ],
  rePassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: validateRePass,
      massage: "两次输入的密码不一致！",
    },
  ],
});

const changePassword = () => {
  formDataRef.value.validate((valid: boolean) => {
    if (!valid) return;
    ElMessageBox.confirm("修改密码后需重新登录，确认要更改吗？", "Warning", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        ElMessage({
          type: "success",
          message: "修改密码成功，请重新登录！",
        });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消修改密码",
        });
      });
  });
};

const cancel = () => {
  emits("editBack");
};
</script>

<template>
  <div>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
      label-width="180px"
      @submit.prevent
    >
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          clearable
          placeholder="请输入新密码"
          v-model.trim="formData.password"
          show-password
        >
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="rePassword">
        <el-input
          type="password"
          clearable
          placeholder="请再次确认密码"
          v-model.trim="formData.rePassword"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changePassword">修改密码</el-button>
        <el-button link @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss"></style>
