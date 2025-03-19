<script setup lang="ts">
import { useUserStore } from "@/store/useUserStore";
const userStroe = useUserStore();

const props = defineProps({
  userId: {
    type: String,
    required: true,
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

const userInfo = ref({
  userId: "",
  nickName: "",
  contactType: 1,
});
const getContactInfo = () => {
  userInfo.value.userId = props.userId;
  // TODO 获取联系人详情数据
  userInfo.value.nickName = "nickName";
};

// TODO 发送消息
const sendMessage = () => {};

// TODO 加为好友
const addContact = () => {};
</script>

<template>
  <el-popover
    :width="250"
    placement="right-start"
    :show-arrow="false"
    transition="none"
    trigger="click"
    :hide-after="0"
    @show="getContactInfo"
    ref="popover"
  >
    <template #reference>
      <AvatarBase
        :userId="userId"
        :width="width"
        :borderRadius="borderRadius"
        :showDetail="false"
      ></AvatarBase>
    </template>
    <template #default>
      <UserBaseInfo :userInfo="userInfo"></UserBaseInfo>
      <div class="op-btn" v-if="userId !== userStroe.userInfo?.id">
        <el-button
          v-if="userInfo.contactType == 1"
          type="primary"
          @click="sendMessage"
        >
          发送消息
        </el-button>
        <el-button v-else type="primary" @click="addContact"
          >加为好友</el-button
        >
      </div>
    </template>
  </el-popover>
</template>

<style scoped lang="scss">
.op-btn {
  text-align: center;
  border-top: 1px solid #eaeaea;
  padding-top: 10px;
  margin-top: 10px;
}
</style>
