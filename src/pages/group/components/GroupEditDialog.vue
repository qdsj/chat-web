<script setup lang="ts">
import GroupEditForm from "./GroupEditForm.vue";

const emits = defineEmits(["reloadGroupInfo", "close-drawer"]);

const props = defineProps({
  closeDrawer: Function,
});

const dialogConfig = ref({
  show: false,
  title: "修改群聊",
  buttons: [],
});

const groupEditRef = ref();
const showFun = (data: any) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    groupEditRef.value.showFun(data);
  });
};

const editBack = () => {
  dialogConfig.value.show = false;
  if (props.closeDrawer) {
    props.closeDrawer();
  }
  emits("reloadGroupInfo");
};

const handleClose = () => {
  dialogConfig.value.show = false;
  emits("close-drawer", false);
};

defineExpose({
  showFun,
});
</script>

<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="600px"
    @close="handleClose"
    :showCancel="false"
  >
    <GroupEditForm ref="groupEditRef" @editBack="editBack"></GroupEditForm>
  </Dialog>
</template>

<style lang="scss" scoped>
:deep(.cust-dialog .dialog-body) {
  border-bottom: 0px;
}
</style>
