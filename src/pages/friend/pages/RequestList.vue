<script setup lang="ts">
import { DialogConfig } from "@/types/types";
import type { ButtonType as ElButtonType } from "element-plus";
import { useFriendStore } from "@/store/useFriendStore";
import { I_GetRequestListApiResult } from "@/apis/types/friend.types";

const friendStore = useFriendStore();

const dialogConfig = ref<DialogConfig>({
  show: false,
  title: "通过朋友验证",
  buttons: [],
});

const formData = ref({
  remarkName: "",
});

const applyList = ref<I_GetRequestListApiResult["data"]>();

onMounted(() => {
  getContactApplyList();
});

// 获取好友申请列表
const getContactApplyList = async () => {
  const [_, res] = await friendStore.getRequestList();

  if (res) {
    applyList.value = res;
  }
};

const agreeApply = async (applyId: string, username: string) => {
  dialogConfig.value.show = true;
  formData.value.remarkName = username || "";
  dialogConfig.value.buttons = [
    {
      type: "primary" as ElButtonType,
      text: "确定",
      click: async () => {
        await friendStore.agreeFriend(applyId);
      },
    },
  ];
};
</script>

<template>
  <ContentPanel :showTopBorder="true"
    ><div>
      <div class="apply-item" v-for="item in applyList">
        <AvatarBase
          :width="50"
          :avatar="item.avatar"
          :alt="item.username"
        ></AvatarBase>
        <div class="contact-info">
          <div class="nickname">{{ item.username }}</div>
          <div class="apply-info">{{ item.friendShip.requestMessage }}</div>
        </div>
        <div class="op-btn">
          <div v-if="item.friendShip.status == 'pending'">
            <el-dropdown placement="bottom-end" trigger="click">
              <span class="el-dropdown-link">
                <el-button
                  type="primary"
                  @click="agreeApply(item.id, item.username)"
                  >接受</el-button
                >
              </span>
            </el-dropdown>
          </div>
          <div v-else class="result-name">{{ item.friendShip.status }}</div>
        </div>
      </div>
    </div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      @close="dialogConfig.show = false"
      :showCancel="true"
    >
      <el-form :model="formData" label-width="60px">
        <el-form-item label="备注名" props="remarkName">
          <el-input
            v-model="formData.remarkName"
            placeholder="请输入备注名"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
    <div v-if="!applyList" class="no-data">暂无申请</div>
  </ContentPanel>
</template>

<style scoped lang="scss">
.apply-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 10px;
  .contact-type {
    display: flex;
    justify-content: center;
    // 文本垂直排列
    writing-mode: vertical-lr;
    vertical-align: middle;
    background: #2cb6fe;
    color: #fff;
    border-radius: 5px 0px 0px 5px;
    height: 50px;
    margin-right: 10px;
  }
  .user-contact {
    background: #08bf61;
  }
  .contact-info {
    width: 410px;
    margin-left: 10px;
    .nick-name {
      color: #000;
    }
    .apply-info {
      color: #999;
      font-size: 12px;
      margin-top: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .op-btn {
    width: 50px;
    text-align: center;
    .result-name {
      color: #999;
      font-size: 12px;
    }
  }
}
.no-data {
  text-align: center;
  font-size: 16px;
  color: #9d9d9d;
  line-height: 30px;
}
</style>
