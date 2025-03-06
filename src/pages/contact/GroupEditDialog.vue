<script setup lang="ts">
import GroupEditForm from "./GroupEditForm.vue";

const emits = defineEmits(["reloadGroupInfo"]);

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
  emits("reloadGroupInfo");
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
    width="400px"
    @close="dialogConfig.show = false"
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
