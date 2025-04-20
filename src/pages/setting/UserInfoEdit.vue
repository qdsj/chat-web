<script setup lang="ts">
import { useUserStore } from "@/store/useUserStore";
const userStore = useUserStore();

const props = defineProps({
  data: {
    type: Object as PropType<{
      id: string;
      username: string;
      email: string;
      avatar: string;
      sex: string;
      description: string;
    }>,
    required: true,
    default: () => ({
      id: "",
      username: "",
      email: "",
      avatar: "",
      sex: "",
      description: "",
    }),
  },
});
const emits = defineEmits(["editBack"]);
const formDataRef = ref();
const formData = ref({ ...props.data });

const rules = reactive({
  avatar: [
    {
      required: true,
      message: "请上传头像",
      trigger: "blur",
    },
  ],
  username: [
    {
      required: true,
      message: "请输入昵称",
      trigger: "blur",
    },
    {
      min: 2,
      max: 150,
      message: "长度在 2 到 150 个字符",
      trigger: "blur",
    },
  ],
  sex: [
    {
      required: true,
      message: "请选择性别",
      trigger: "blur",
    },
  ],
  description: [
    {
      required: true,
      message: "请选择地区",
      trigger: "blur",
    },
  ],
});

const updateAvatar = (avatar: string) => {
  formData.value.avatar = avatar;
};

// 保存个人信息
const saveUserInfo = () => {
  formDataRef.value.validate(async (valid: any) => {
    if (!valid) return;
    const { avatar, sex, description } = formData.value;
    await userStore.updateUserInfo(avatar, sex, description);
    await userStore.getUserInfo();
    emits("editBack");
  });
};
// 取消编辑个人信息
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
      label-width="100px"
      @submit.prevent
    >
      <el-form-item label="头像" prop="avatar">
        <AvatarUpload
          :avatar="formData.avatar"
          @updateAvatar="updateAvatar"
        ></AvatarUpload>
      </el-form-item>
      <el-form-item label="昵称" prop="username">
        <el-input
          maxlength="150"
          clearable
          placeholder="请输入昵称"
          v-model.trim="formData.username"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="formData.sex">
          <el-radio :value="'male'">男</el-radio>
          <el-radio :value="'female'">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="地区" prop="area">{{ "广州" }}</el-form-item>
      <el-form-item label="个性签名" prop="description">
        <el-input
          clearable
          placeholder="请输入个性签名"
          v-model="formData.description"
          type="textarea"
          :rows="5"
          maxlength="30"
          :show-word-limit="true"
          resize="none"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveUserInfo">保存个人信息</el-button>
        <el-button link @click="cancel"> 取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  font-size: 16px;
}
.info {
  margin-left: 5px;
  color: #949494;
  font-size: 12px;
}
</style>
