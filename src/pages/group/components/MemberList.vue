<!-- components/group/MemberList.vue -->
<script setup lang="ts">
import { computed, ref, nextTick } from "vue";
import AvatarBase from "@/components/AvatarBase.vue";
import ContextMenu from "@/pages/chat/components/ContextMenu.vue";
import Avatar from "@/components/Avatar.vue";
import { I_GetGroupMemberInfoApiResult } from "@/apis/types/group.type";
import { GroupInfo } from "@/types/model/group.type";

const props = defineProps({
  members: {
    type: Array as PropType<I_GetGroupMemberInfoApiResult["data"]>,
    required: true,
  },
  isSearching: Boolean,
  groupInfo: {
    type: Object as PropType<GroupInfo>,
    required: true,
  },
});

const emit = defineEmits(["add-member", "remove-member"]);

const currentComponent = computed(() =>
  props.isSearching ? Avatar : AvatarBase
);

// 右键菜单逻辑
const showMenu = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const selectedMemberId = ref<string | null>(null);

const handleRightClick = (event: MouseEvent, memberId: string) => {
  if (!validateRightClick(memberId)) return;

  nextTick(() => {
    selectedMemberId.value = memberId;
    menuPosition.value = { x: event.clientX, y: event.clientY };
    showMenu.value = true;
  });
};

const validateRightClick = (memberId: string) => {
  return (
    props.groupInfo.userType === "owner" && memberId !== props.groupInfo.userId
  );
};

// 菜单操作
const menuItems = [
  {
    label: "从群聊中移除",
    action: () => emit("remove-member", selectedMemberId.value),
  },
];

// 添加以下代码
const closeMenu = () => {
  showMenu.value = false;
};

// 暴露方法给父组件
defineExpose({
  closeMenu,
});
</script>

<template>
  <div class="group-info-item">
    <div
      v-for="item in members"
      :key="item.id"
      class="grid-container"
      @contextmenu.prevent="!isSearching && handleRightClick($event, item.id)"
    >
      <component
        :is="currentComponent"
        :avatar="item.avatar"
        :username="item.username"
        :user-id="item.id"
        :email="item.email"
        :width="50"
      />
      <div class="nickname">{{ item.username }}</div>
    </div>

    <ContextMenu
      :menu-items="menuItems"
      :position="menuPosition"
      :visible="showMenu"
      @update:visible="showMenu = $event"
    />

    <div class="grid-container" @click="$emit('add-member')">
      <div class="iconfont icon-add"></div>
      <div class="nickname">添加</div>
    </div>
  </div>
</template>

<style scoped>
.group-info-item {
  display: flex;
  align-items: center;
  margin: 15px 0px;
  flex-wrap: wrap;
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    justify-items: center; /* 单元格内水平居中 */
    align-items: center; /* 单元格内垂直居中 */
    margin-bottom: 30px;
    .iconfont {
      width: 50px;
      height: 50px;
      border: 1px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
