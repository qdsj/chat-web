<!-- ContextMenu.vue -->
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

interface MenuItem {
  label: string;
  action: () => void;
}

const props = defineProps<{
  menuItems: MenuItem[];
  position: { x: number; y: number };
  visible: boolean;
}>();

const emit = defineEmits(["update:visible"]);

const menuRef = ref<HTMLElement | null>(null);

// 动态定位样式
const menuStyle = ref({
  left: "0px",
  top: "0px",
  opacity: "0", // 初始隐藏用于计算尺寸
});

// 可视区域修正
const adjustPosition = () => {
  const { innerWidth, innerHeight } = window;
  const menuWidth = 120; // 与CSS中min-width一致
  const menuHeight = props.menuItems.length * 32; // 预估每项高度

  const finalX =
    props.position.x + menuWidth > innerWidth
      ? innerWidth - menuWidth - 5
      : props.position.x;

  const finalY =
    props.position.y + menuHeight > innerHeight
      ? innerHeight - menuHeight - 5
      : props.position.y;

  menuStyle.value = {
    left: `${finalX}px`,
    top: `${finalY}px`,
    opacity: "1",
  };
};

// 监听visible变化
watch(
  () => props.visible,
  (val) => {
    if (val) {
      adjustPosition();
    }
  }
);

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu();
  }
};

// 修改关闭菜单逻辑
const closeMenu = () => {
  emit("update:visible", false);
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", closeMenu);
  window.addEventListener("scroll", closeMenu, true);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", closeMenu);
  window.removeEventListener("scroll", closeMenu, true);
});
</script>

<template>
  <!-- 右键菜单内容 -->
  <div v-if="visible" ref="menuRef" class="context-menu" :style="menuStyle">
    <div
      v-for="(item, index) in menuItems"
      :key="index"
      class="menu-item"
      @click.stop="item.action()"
    >
      {{ item.label }}
    </div>
  </div>
  <!-- 渲染父组件传入的内容 -->
  <slot />
</template>

<style scoped>
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  min-width: 120px;
  transition: opacity 0.1s;
}

.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f0f0f0;
}
</style>
