<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
  },
});
const emits = defineEmits(["editBack"]);
const formDaraRef = ref();
const formData = computed(() => {
  return props.data!;
});

const rules = reactive({
  // avatarFile: [
  //   {
  //     required: true,
  //     message: "请上传头像",
  //     trigger: "blur",
  //   },
  // ],
  nickName: [
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
});

// 保存个人信息
const saveUserInfo = () => {
  formDaraRef.value.validate((valid: any) => {
    if (!valid) return;
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
      ref="formDaraRef"
      label-width="100px"
      @submit.prevent
    >
      <el-form-item label="头像" prop="avatarFile">
        <AvatarUpload v-model="formData.avatarFile"></AvatarUpload>
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input
          maxlength="150"
          clearable
          placeholder="请输入昵称"
          v-model.trim="formData.nickName"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="formData.sex">
          <el-radio :value="1">男</el-radio>
          <el-radio :value="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="朋友权限" prop="joinType">
        <el-switch
          v-model="formData.joinType"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
        <div class="info">加我为好友时需要验证</div>
      </el-form-item>
      <el-form-item label="地区" prop="area"></el-form-item>
      <el-form-item label="个性签名" prop="personalSignature">
        <el-input
          clearable
          placeholder="请输入个性签名"
          v-model="formData.personalSignature"
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
