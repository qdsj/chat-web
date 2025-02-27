<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
  },
});
</script>

<template>
  <div class="avatar-upload">
    <div class="avatar-show">
      <template v-if="modelValue">
        <ShowLocalImage
          :fileId="modelValue"
          partType="avatar"
          :width="40"
        ></ShowLocalImage>
      </template>
      <template v-else>
        <el-upload
          :show-file-list="false"
          accept=".png,.PNG,.jpeg,.JPEG,.jpg,.JPG,.gif,.GIF"
        >
          <span class="iconfont icon-add"></span>
        </el-upload>
      </template>
    </div>
    <div class="select-btn">
      <el-upload
        :show-file-list="false"
        accept=".png,.PNG,.jpeg,.JPEG,.jpg,.JPG,.gif,.GIF"
      >
        <el-button type="primary" size="small">选择</el-button>
      </el-upload>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar-upload {
  display: flex;
  justify-content: center;
  align-items: end;
  .avatar-show {
    background: #ededed;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    overflow: hidden;
    position: relative;
    .icon-add {
      font-size: 30px;
      color: #b9b9b9;
      width: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
    }
    img {
      width: 100%;
      height: 100%;
    }
    .op {
      position: absolute;
      color: #0e8aef;
      top: 80px;
    }
  }
  .select-btn {
    vertical-align: bottom;
    margin-left: 5px;
  }
}
</style>
