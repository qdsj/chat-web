<script setup lang="ts">
import UserBaseInfo from "@/components/UserBaseInfo.vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/useUserStore";
import ContentPanel from "@/components/ContentPanel.vue";
import SearchAdd from "./SearchAdd.vue";
import { useFriendStore } from "@/store/useFriendStore";
import { I_FindUserByNameApiResult } from "@/apis/friend";

const userStore = useUserStore();
const friendStore = useFriendStore();
const contactId = ref();

const searchResult = ref<I_FindUserByNameApiResult["data"]>({} as I_FindUserByNameApiResult["data"]);
type friendShipStatusType = "pending" | "accepted" | "rejected" | "blocked";

const friendShipStatus = computed(() => {
	return (searchResult.value.friendShip?.status || "pending") as friendShipStatusType;
});

const search = async () => {
	if (!contactId.value) {
		ElMessage.warning("请输入用户名");
		return;
	}

	const data = await friendStore.searchUserByName(contactId.value);
	if (data) {
		searchResult.value = data;
		// magic number
		// searchResult.value.status = data.friendShip.status; // 默认不是好友
	} else {
		ElMessage.error("未找到用户");
		return;
	}
};

const contactTypeName = computed(() => {
	if (userStore.userInfo!.id === searchResult.value.id) return "自己";
	// if (searchResult.value.contactType === "USER") return "用户";
	// if (searchResult.value.contactType === "GROUP") return "群组";
});

const searchAddRef = ref();
// 发送好友申请
const applyContact = () => {
	if (searchAddRef.value) {
		searchAddRef.value.showFun(searchResult.value);
	}
};

// 发消息
const sendMessage = () => {};

// 重置表单
const resetForm = () => {};
</script>

<template>
	<ContentPanel>
		<!-- 输入框 -->
		<div class="search-form">
			<el-input
				clearable
				placeholder="请输入用户ID或群组ID"
				v-model="contactId"
				size="large"
				@keydown.enter="search"></el-input>
			<div class="search-btn iconfont icon-search" @click="search"></div>
		</div>
		<div class="search-result-panel" v-if="searchResult.id">
			<!-- 信息展示 -->
			<div class="search-result">
				<span class="contact-type">{{ contactTypeName }}</span>
				<UserBaseInfo :userInfo="searchResult"></UserBaseInfo>
			</div>
			<!-- 各类按钮(搜索人不是自己显示) -->
			<div class="op-btn" v-if="searchResult.id != userStore.userInfo!.id">
				<el-button type="primary" v-if="friendShipStatus === 'pending'" @click="applyContact">
					{{ "申请添加好友" }}
				</el-button>
				<el-button type="primary" v-if="['accepted', 'blocked'].includes(friendShipStatus)" @click="sendMessage"
					>发消息</el-button
				>
			</div>
		</div>
		<!-- <div v-if="!searchResult" class="no-data">没有搜索到任何结果</div> -->
	</ContentPanel>
	<!-- 添加好友申请弹框 -->
	<SearchAdd ref="searchAddRef" @reload="resetForm"></SearchAdd>
</template>

<style scoped lang="scss">
.search-form {
	padding-top: 50px;
	display: flex;
	align-items: center;
	:deep(.el-input__wrapper) {
		border-radius: 4px 0px 0px 4px;
		border-right: none;
	}
	.search-btn {
		background: #07c160;
		color: #fff;
		line-height: 40px;
		width: 80px;
		text-align: center;
		border-radius: 0px 5px 5px 0px;
		cursor: pointer;
		&:hover {
			background: #0dd36c;
		}
	}
}
.no-data {
	padding: 30px 0px;
}
.search-result-panel {
	.search-result {
		padding: 30px 20px 20px 20px;
		background: #fff;
		border-radius: 5px;
		margin-top: 10px;
		position: relative;
		.contact-type {
			position: absolute;
			top: 0px;
			left: 0px;
			background: #2cb6fe;
			padding: 2px 5px;
			color: #fff;
			border-radius: 5px 0px 0px 0px;
			font-size: 12px;
		}
	}
	.op-btn {
		border-radius: 5px;
		margin-top: 10px;
		padding: 10px;
		background: #fff;
		text-align: center;
	}
}
</style>
