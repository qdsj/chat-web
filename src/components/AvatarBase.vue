<script lang="ts" setup>
import { AvatarCircle } from "@zenos-chen/avatar/vue";
defineProps({
  avatar: {
    type: String,
    default: "",
  },
  alt: {
    type: String,
    default: "",
  },
  width: {
    type: Number,
    default: 40,
  },
  borderRadius: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div
    class="user-avatar-container"
    :style="{
      width: width + 'px',
      height: width + 'px',
      borderRadius: borderRadius + 'px',
    }"
  >
    <img v-if="avatar !== ''" class="user-avatar" :src="avatar" :alt="alt" />
    <div v-else class="user-avatar-alt">
      <!-- <AvatarCircle :str="alt" :height="width" /> -->
      <AvatarCircle str="H" :height="width" />
    </div>
  </div>
</template>

<style scoped lang="scss">
svg {
  width: 100%;
  height: 100%;
}
.user-avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #d3d3d3;
}
.user-avatar {
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0px 0px 4px lightgray;
  transition: transform 0.3s;
  width: 100%;
  height: 100%;
  &:hover {
    box-shadow: 0px 0px 4px gray;
    transform: scale(1.1);
  }
}
</style>
