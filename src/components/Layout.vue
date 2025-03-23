<script setup lang="ts">
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
</script>

<template>
  <splitpanes class="layout-container">
    <pane min-size="20" size="30" max-size="50" class="left-side-inner">
      <slot name="left-content"></slot>
    </pane>
    <pane min-size="50" size="70" class="right-content">
      <slot name="right-content"></slot>
    </pane>
  </splitpanes>
</template>

<style scoped lang="scss">
.splitpanes__pane {
  transition: none; /* 禁用过渡效果 */
}

:deep(.splitpanes__splitter) {
  width: 5px;
}

.layout-container {
  display: flex;
  .left-side-inner {
    width: 450px;
    background: #e6e5e5;
    border-color: #ddd;
    border-style: solid;
    border-width: 0px 1px 0px 0px;
  }
  .right-content {
    flex: 1;
    height: calc(100vh - 2px);
    background-color: #f5f5f5;
    width: 100%;
  }
}
</style>
