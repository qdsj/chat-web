<script setup lang="ts">
import config from "../../../package.json";

// TODO 检查更新
const checkUpdate = () => {};
</script>

<template>
  <ContentPanel>
    <el-form ref="formDataRef" label-width="180px">
      <el-form-item label="版本信息">
        <div class="verson-info">
          <div>版本 {{ config.version }}</div>
          <div>
            <el-button type="primary" @click="checkUpdate">检查更新</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </ContentPanel>
</template>

<style scoped lang="scss"></style>
