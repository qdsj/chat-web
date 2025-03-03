<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";

const applyList = ref([
  {
    contactType: 0, // 联系人类型，0为好友，1为群聊
    status: 0, // 状态，0为待处理，1为已同意，2为已拒绝，3为被拉黑
    statusName: "",
    applyUserId: "",
    applyId: "",
    contactName: "",
    applyInfo: "",
  },
]);

onMounted(() => {
  getContactApplyList();
});

// TODO 此处需要对接后端接口，获取好友申请列表
const getContactApplyList = () => {
  // pageNum.value++;
  // if (pageNum.value > pageTotal.value) return;
  applyList.value = [
    {
      contactType: 0, // 联系人类型，0为好友，1为群聊
      status: 0, // 状态，0为待处理，1为已同意，2为已拒绝，3为被拉黑
      statusName: "待处理",
      applyUserId: "",
      applyId: "",
      contactName: "张三",
      applyInfo: "我是张三，想和你成为朋友！",
    },
  ];
};

const delWithApply = (applyId: string, contactType: number, status: number) => {
  ElMessageBox.confirm("确定要执行此操作吗?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "操作成功",
      });
      console.log(applyId, contactType, status);
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消操作",
      });
    });
};
</script>

<template>
  <ContentPanel :showTopBorder="true"
    ><div>
      <div class="apply-item" v-for="item in applyList">
        <div
          :class="['contact-type', item.contactType == 0 ? 'user-contact' : '']"
        >
          {{ item.contactType == 0 ? "好友" : "群聊" }}
        </div>
        <Avatar :width="50" :userId="item.applyUserId"></Avatar>
        <div class="contact-info">
          <div class="nickname">{{ item.contactName }}</div>
          <div class="apply-info">{{ item.applyInfo }}</div>
        </div>
        <div class="op-btn">
          <div v-if="item.status == 0">
            <el-dropdown placement="bottom-end" trigger="click">
              <span class="el-dropdown-link">
                <el-button type="primary">接受</el-button>
              </span>
              <template #dropdown>
                <el-dropdown-item
                  @click="delWithApply(item.applyId, item.contactType, 1)"
                  >同意</el-dropdown-item
                >
                <el-dropdown-item
                  @click="delWithApply(item.applyId, item.contactType, 2)"
                  >拒绝</el-dropdown-item
                >
                <el-dropdown-item
                  @click="delWithApply(item.applyId, item.contactType, 3)"
                  >拉黑</el-dropdown-item
                >
              </template>
            </el-dropdown>
          </div>
          <div v-else class="result-name">{{ item.statusName }}</div>
        </div>
      </div>
    </div>
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
