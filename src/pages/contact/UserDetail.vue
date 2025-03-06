<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();

const userInfo = ref({
  nickName: "",
  personalSignature: "",
});
onMounted(() => {
  userInfo.value = {
    nickName: "panda",
    personalSignature: "panda的个性签名",
  };
});

const delContact = () => {
  ElMessageBox.confirm("你确定要删除该联系人吗?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "删除联系人成功",
      });
      router.push("/contact/blank");
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};

const sendmessage = () => {};
</script>

<template>
  <ContentPanel :showTopBorder="true">
    <div class="user-info">
      <UserBaseInfo :userInfo="userInfo"></UserBaseInfo>
      <div class="more-op">
        <el-dropdown placement="bottom-end" trigger="click">
          <span class="el-dropdown-link">
            <div class="iconfont icon-icon_more"></div>
          </span>
          <template #dropdown>
            <el-dropdown-item @click="delContact">删除联系人</el-dropdown-item>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="part-item">
      <div class="part-title">个性签名</div>
      <div class="part-content">{{ userInfo.personalSignature || "-" }}</div>
    </div>
    <div class="send-message" @click="sendmessage">
      <div class="iconfont icon-icon_chat"></div>
      <div class="text">发消息</div>
    </div>
  </ContentPanel>
</template>

<style scoped lang="scss">
.user-info {
  position: relative;
  .more-op {
    position: absolute;
    right: 0px;
    top: 20px;
    .icon-icon_more {
      color: #9e9e9e;
      font-size: 20px;
      &:hover {
        background-color: #ddd;
      }
    }
  }
}
.part-item {
  display: flex;
  border-bottom: 10x solid #eaeaea;
  padding: 20px 0px;
  .part-title {
    width: 80px;
    color: #9e9e9e;
  }
  .part-content {
    flex: 1;
    margin-left: 15px;
    color: #161616;
  }
}

.send-message {
  width: 80px;
  margin: 0px auto;
  text-align: center;
  margin-top: 20px;
  color: #7d8cac;
  padding: 5px;
  .icon-icon_chat {
    font-size: 28px;
  }
  .text {
    font-size: 16px;
    margin-top: 5px;
  }
  &:hover {
    background: #e9e9e9;
    cursor: pointer;
  }
}
</style>
