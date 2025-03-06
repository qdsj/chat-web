<script setup lang="ts">
const props = defineProps({
  showTopBorder: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    class="content-panel"
    :style="{ 'border-top': props.showTopBorder ? '1px solid #ddd' : 'none' }"
  >
    <div class="content-inner">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-panel {
  overflow: hidden;
  height: calc(100vh - 92px);
  padding-top: 10px;
  .content-inner {
    margin: 0px auto;
    width: 600px;
  }
}
</style>
