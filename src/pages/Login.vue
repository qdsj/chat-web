<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();

const formDataRef = ref();
const formData = ref({
  email: "",
  nickName: "",
  password: "",
  rePassword: "",
  checkCode: "",
});

// 邮箱校验
const validateEmail = (rule: any, value: string, callback: Function) => {
  const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,4}){1,2}$/;
  if (!reg.test(value)) {
    callback(new Error(rule.message));
  }
  return true;
};
// 密码校验
const validatePassword = (rule: any, value: string, callback: Function) => {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,18}$/;
  if (!reg.test(value)) {
    callback(new Error(rule.message));
  }
  return true;
};
// 确认密码校验
const validaterePassword = (rule: any, value: string, callback: Function) => {
  if (value !== formData.value.password) {
    callback(new Error(rule.message));
  }
  return true;
};

const rules = reactive({
  email: [
    {
      required: true,
      message: "请输入邮箱地址",
      trigger: "blur",
    },
    { validator: validateEmail, trigger: "blur", message: "邮箱格式不正确" },
  ],
  nickName: [
    {
      required: true,
      message: "请输入昵称",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
    },
    {
      validator: validatePassword,
      trigger: "blur",
      message: "密码由8-18的大写字母、小写字母和数字组成",
    },
  ],
  rePassword: [
    {
      required: true,
      message: "请输入密码",
    },
    {
      validator: validaterePassword,
      trigger: "blur",
      message: "两次输入的密码不一致",
    },
  ],
  checkCode: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "blur",
    },
  ],
});

const isLogin = ref(true);
const changeOpType = () => {
  isLogin.value = !isLogin.value;
  nextTick(() => {
    formDataRef.value.resetFields();
  });
};

const submit = () => {
  formDataRef.value.validate((valid: any) => {
    if (!valid) return;
    if (isLogin.value) {
      router.push("/main");
    } else {
      ElMessage.success("注册成功");
      changeOpType();
    }
  });
};
</script>

<template>
  <div class="login-panel">
    <div class="title">在线聊天系统</div>
    <div class="login-form">
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="email">
          <el-input
            size="large"
            clearable
            placeholder="请输入邮箱"
            maxLength="30"
            v-model.trim="formData.email"
          >
            <template #prefix>
              <span class="iconfont icon-iconemail"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="nickName" v-if="!isLogin">
          <el-input
            size="large"
            clearable
            placeholder="请输入昵称"
            v-model.trim="formData.nickName"
            maxLength="15"
          >
            <template #prefix>
              <span class="iconfont icon-user"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            size="large"
            clearable
            show-password
            placeholder="请输入密码"
            v-model.trim="formData.password"
          >
            <template #prefix>
              <span class="iconfont icon-icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="rePassword" v-if="!isLogin">
          <el-input
            size="large"
            clearable
            show-password
            placeholder="请输入确认密码"
            v-model.trim="formData.rePassword"
          >
            <template #prefix>
              <span class="iconfont icon-icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkCode">
          <el-input
            size="large"
            clearable
            placeholder="请输入验证码"
            v-model.trim="formData.checkCode"
          >
            <template #prefix>
              <span class="iconfont icon-icon_checkcode"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="submit">{{
            isLogin ? "登录" : "注册"
          }}</el-button>
        </el-form-item>
        <div class="bottom-link">
          <span class="a-link" @click="changeOpType">{{
            isLogin ? "没有账号？" : "已有账号？"
          }}</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.email-select {
  width: 250px;
}
.loading-panel {
  height: calc(100vh - 32px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  img {
    width: 300px;
  }
}
.login-panel {
  background: #fff;
  border-radius: 3px;
  width: 500px;
  margin: 300px auto;
  border: 1px solid #ddd;
  .title {
    padding: 10px;
    font-size: 20px;
    text-align: center;
  }

  .login-form {
    padding: 0px 15px 29px 15px;
    :deep(.el-input__wrapper) {
      box-shadow: none;
      border-radius: none;
    }
    .el-form-item {
      border-bottom: 1px solid #ddd;
    }
    .email-panel {
      display: flex;
      align-items: center;
      width: 100%;
      .input {
        flex: 1;
      }
      .icon-down {
        margin-left: 3px;
        width: 16px;
        cursor: pointer;
        border: none;
      }
    }
    .error-msg {
      height: 30px;
      line-height: 30px;
      color: #fb7373;
    }
    .check-code-panel {
      display: flex;
      .check-code {
        cursor: pointer;
        width: 120px;
        margin-left: 5px;
      }
    }
    .login-btn {
      margin-top: 20px;
      width: 100%;
      background: #07c160;
      height: 36px;
      font-size: 16px;
    }
    .bottom-link {
      text-align: right;
      .a-link {
        cursor: pointer;
        text-decoration: none;
        color: #436895;
      }
    }
  }
}
</style>
