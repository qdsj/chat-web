<script lang="ts" setup>
const props = defineProps({
  userId: {
    type: String,
  },
  width: {
    type: Number,
    default: 40,
  },
  borderRadius: {
    type: Number,
    default: 0,
  },
  showDetail: {
    type: Boolean,
    default: false,
  },
});

const showDetailHandler = () => {
  if (!props.showDetail) return;
  // TODO 查看图片详情
};
</script>

<template>
  <div
    class="user-avatar"
    @click="showDetailHandler"
    :style="{
      width: width + 'px',
      height: width + 'px',
      'border-radius': borderRadius + 'px',
    }"
  >
    <ShowLocalImage
      :width="width"
      :fileId="userId"
      partType="avatar"
      :forceGet="true"
    ></ShowLocalImage>
  </div>
</template>

<style scoped lang="scss">
.user-avatar {
  flex-shrink: 0;
  background: #d3d3d3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
}
</style>
