<script setup lang="ts">
import UserInfoEdit from "./UserInfoEdit.vue";
import UserInfoPassword from "./UserInfoPassword.vue";
import { useUserStore } from "@/store/useUserStore";

const userStore = useUserStore();

const showType = ref(0);
const changePart = (part: number) => {
  showType.value = part;
};
// 退出登录
const logout = () => {};

// 编辑返回
const editBack = () => {
  showType.value = 0;
};
</script>

<template>
  <ContentPanel>
    <!-- 个人信息详情 -->
    <div class="show-info" v-if="showType == 0">
      <div class="user-info">
        <!-- TODO 个人用户信息-->
        <UserBaseInfo
          :userInfo="userStore.userInfo"
          :showArea="userStore.userInfo.contactType == 'USER'"
        ></UserBaseInfo>
        <div class="more-op">
          <el-dropdown placement="bottom-end" trigger="click">
            <span class="el-dropdown-link">
              <div class="iconfont icon-icon_more"></div>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="changePart(1)"
                  >修改个人信息</el-dropdown-item
                >
                <el-dropdown-item @click="changePart(2)"
                  >修改密码</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="part-item">
        <div class="part-title">朋友权限</div>
        <div class="part-content">
          {{
            userStore.userInfo.joinType == 0
              ? "直接添加为好友"
              : "加我为好友时需要验证"
          }}
        </div>
      </div>
      <div class="part-item">
        <div class="part-title">个性签名</div>
        <div class="part-content">
          {{ userStore.userInfo.personalSignature || "-" }}
        </div>
      </div>
      <div class="logout">
        <el-button @click="logout">退出登录</el-button>
      </div>
    </div>

    <!-- 修改个人信息 -->
    <div v-if="showType == 1">
      <UserInfoEdit
        :data="userStore.userInfo"
        @editBack="editBack"
      ></UserInfoEdit>
    </div>

    <!-- 修改密码 -->
    <div v-if="showType == 2">
      <UserInfoPassword @editBack="editBack"></UserInfoPassword>
    </div>
  </ContentPanel>
</template>

<style scoped lang="scss">
.show-info {
  .user-info {
    position: relative;
    .more-op {
      position: absolute;
      right: 0px;
      top: 20px;
      .el-dropdown-link {
        .iconfont {
          font-size: 20px;
        }
        .icon-icon_more {
          color: #9e9e9e;
          &:hover {
            background: #ddd;
          }
        }
      }
    }
  }
  .part-item {
    display: flex;
    border-bottom: 1px solid #eaeaea;
    padding: 20px 0px;
    .paer-title {
      width: 60px;
      color: #9e9e9e;
    }
    .part-content {
      flex: 1;
      margin-left: 15px;
      color: #161616;
    }
  }
  .logout {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
