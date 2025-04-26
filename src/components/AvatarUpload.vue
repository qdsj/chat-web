<script lang="ts" setup>
  import { ref } from "vue";
  import { ElMessage } from "element-plus";
  import { Plus } from "@element-plus/icons-vue";
  import { uploadFile } from "@/apis/oss";

  import type { UploadProps } from "element-plus";

  const props = defineProps({
    avatar: {
      type: String,
      default: "",
    },
  });

  const emit = defineEmits(["updateAvatar"]);
  const imageUrl = ref(props.avatar);
  watch(
    () => props.avatar,
    (newVal) => {
      imageUrl.value = newVal;
    }
  );

  const onSuccess = (res: any) => {
    if (res?.url) {
      imageUrl.value = res.url;
      emit("updateAvatar", res.url);
    }
  };

  const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
    // 允许图片格式为 jpg，png,jpeg,gif,webp
    const isJPG = ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(rawFile.type);
    if (!isJPG) {
      ElMessage.error("Avatar picture must be JPG format!");
      return false;
    } else if (rawFile.size / 1024 / 1024 > 2) {
      ElMessage.error("Avatar picture size can not exceed 2MB!");
      return false;
    }
    return true;
  };
</script>

<template>
  <el-upload class="avatar-uploader"
             :show-file-list="false"
             :http-request="uploadFile"
             :on-success="onSuccess"
             :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl"
         :src="imageUrl"
         class="avatar" />
    <el-icon v-else
             class="avatar-uploader-icon">
      <Plus />
    </el-icon>
  </el-upload>
</template>

<style scoped>
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    text-align: center;
  }
</style>
