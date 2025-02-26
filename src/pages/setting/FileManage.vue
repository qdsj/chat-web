<script setup lang="ts">
const copying = ref(false);
const formData = reactive({
  sysSetting: "",
});
const changeFolder = () => {};
const openLocalFolder = () => {};
</script>

<template>
  <ContentPanel v-loading="copying" element-loading-text="正在复制文件">
    <el-form label-position="top" :model="formData" label-width="80px">
      <el-form-item label="文件管理" prop="sysSetting" class="file-manage">
        <div class="file-input" :title="formData.sysSetting">
          {{ formData.sysSetting }}
        </div>
        <div class="tips">文件的默认保存位置</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changeFolder">更改</el-button>
        <el-button type="primary" @click="openLocalFolder"
          >打开文件夹</el-button
        >
      </el-form-item>
    </el-form>
  </ContentPanel>
</template>

<style scoped lang="scss">
.file-manage {
  :deep(.el-form-item__content) {
    display: block;
  }
  :deep(.el-form-item__label) {
    font-size: 18px;
  }
  .file-input {
    background: #fff;
    padding: 0px 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
  }
  .tips {
    color: #888;
    font-size: 13px;
  }
}
</style>
