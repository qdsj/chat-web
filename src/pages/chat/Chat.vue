<script setup lang="ts">
import Blank from "@/components/Blank.vue";
import { useChatStore } from "@/store/useChatStore";
import { useSocketStore } from "@/store/useSocketStore";
import { ref } from "vue";
import MessageSend from "./MessageSend.vue";

import { useUserStore } from "@/store/useUserStore";
import { Pane, Splitpanes } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import SessionList from "./SessionList.vue";

const socketStore = useSocketStore();
const chatStore = useChatStore();
const userStore = useUserStore();

const searchKey = ref("");

// 搜索好友 or 群聊
const search = () => {
	console.log(searchKey.value);
};

watch(
	() => socketStore.client,
	(client) => {
		if (client) {
			socketStore.addMsgCallbacks([
				(data: any) => {
					console.log(data);
					// 将消息保存到会话列表中
					chatStore.addMessage(data);
				},
			]);
		}
	}
);

// 显示群聊详情
const showGroupDetail = () => {};

const isSelf = (sender: string) => {
	return sender === userStore.userInfo!.id;
};

const isSelf = (sender: string) => {
	return sender === userStore.userInfo!.id;
};
</script>

<template>
	<Layout>
		<!-- 左边 -->
		<template #left-content>
			<!-- 搜索框 -->
			<div class="top-search">
				<el-input clearable placeholder="搜索" v-model="searchKey" size="large" @keyup="search">
					<template #suffix>
						<span class="iconfont icon-search"></span>
					</template>
				</el-input>
			</div>
			<!-- 会话列表 -->
			<SessionList />
			<SessionList />
		</template>

		<!-- 右边 -->
		<template #right-content>
			<splitpanes horizontal class="default-theme">
				<pane size="75">
					<div class="title-panel" v-if="chatStore.currentConversation">
					<div class="title-panel" v-if="chatStore.currentConversation">
						<div class="title">
							<span>{{ chatStore.currentConversation.name }}</span>
							<span>{{ chatStore.currentConversation.name }}</span>
							<!-- 群聊 -->
							<span v-if="chatStore.currentConversation.contactType == 1">
								({{ chatStore.currentConversation.memberCount }})
							<span v-if="chatStore.currentConversation.contactType == 1">
								({{ chatStore.currentConversation.memberCount }})
							</span>
						</div>
						<!-- 群聊 -->
						<div
							v-if="chatStore.currentConversation.contactType == 1"
							v-if="chatStore.currentConversation.contactType == 1"
							class="iconfont icon-icon_more"
							@click="showGroupDetail"></div>
					</div>
					<el-container class="chat-container">
						<el-main class="chat-box" v-show="chatStore.currentConversation">
					<el-container class="chat-container">
						<el-main class="chat-box" v-show="chatStore.currentConversation">
							<div class="messages-container">
								<template v-for="msg in chatStore.currentConversation?.messages" :key="msg">
								<template v-for="msg in chatStore.currentConversation?.messages" :key="msg">
									<div class="message-time">
										<span>{{ msg.time }}</span>
									</div>
									<div :class="['message', isSelf(msg.sender) ? 'message-self' : 'message-other']">
										<el-avatar size="small">{{ isSelf(msg.sender) ? "Me" : msg.sender }}</el-avatar>
									<div :class="['message', isSelf(msg.sender) ? 'message-self' : 'message-other']">
										<el-avatar size="small">{{ isSelf(msg.sender) ? "Me" : msg.sender }}</el-avatar>
										<div class="message-content" shadow="never">
											{{ msg.content }}
										</div>
									</div>
								</template>
							</div>
						</el-main>
					</el-container>
					<Blank v-if="!chatStore.currentConversation"></Blank>
					<Blank v-if="!chatStore.currentConversation"></Blank>
				</pane>
				<pane min-size="15" size="25" v-if="chatStore.currentConversation">
				<pane min-size="15" size="25" v-if="chatStore.currentConversation">
					<!-- 发送组件 -->
					<MessageSend :chatStore.currentConversation="chatStore.currentConversation || {}"> </MessageSend>
					<MessageSend :chatStore.currentConversation="chatStore.currentConversation || {}"> </MessageSend>
				</pane>
			</splitpanes>
		</template>
	</Layout>
</template>

<style scoped lang="scss">
.splitpanes__pane {
	transition: none; /* 禁用过渡效果 */
}

.top-search {
	padding: 20px 10px;
	background-color: #f7f7f7;
	display: flex;
	align-items: center;
	.iconfont {
		font-size: 18px;
	}
}
.chat-container {
	height: 100vh;
	border: 1px solid #dcdfe6;
}

.sidebar {
	border-right: 1px solid #dcdfe6;
	.conversation-list {
		border-right: none;
	}
	.el-menu-item {
		display: flex;
		align-items: center;
		padding: 12px 20px;
		.conversation-info {
			margin-left: 12px;
			flex: 1;
			display: flex;
			flex-direction: column;
			height: 100%;
			line-height: 1;
			justify-content: space-between;

			.name {
				display: block;
				font-weight: bold;
			}
			.last-message {
				font-size: 12px;
				color: #909399;
			}
		}
		.time {
			font-size: 12px;
			color: #909399;
		}
	}
}

.chat-box {
	// height: calc(100vh - 360px);
	padding: 0;
	display: flex;
	flex-direction: column;

	.messages-container {
		flex: 1;
		padding: 20px;
		overflow-y: auto;

		.message-time {
			display: flex;
			align-items: center;
			justify-content: center;
			span {
				padding: 2px 5px;
				background: #ddd;
				color: #fff;
				border-radius: 2px;
			}
		}

		.message {
			display: flex;
			align-items: flex-start;
			margin-bottom: 20px;

			&.message-self {
				flex-direction: row-reverse;
				.message-content {
					margin-right: 12px;
					margin-left: 0;
					background-color: #ecf5ff;
				}
			}

			&.message-other .message-content {
				margin-left: 12px;
				background-color: #f4f4f5;
			}

			.message-content {
				max-width: 60%;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				padding: 12px 16px;
				white-space: normal;
				background: #e0e0e0;
				color: #000;
				border-radius: 24px 16px 16px 4px;
				box-shadow: 0 3px 3px rgba(0, 0, 0, 0.5);
			}
		}
	}
}

.input-box {
	border-top: 1px solid #dcdfe6;
	padding: 10px 20px;
	background-color: #fff;

	.toolbar {
		margin-bottom: 10px;
		display: flex;
		gap: 10px;
	}

	.el-input {
		margin-bottom: 10px;
	}

	.emoji-panel {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 5px;

		.emoji {
			cursor: pointer;
			font-size: 20px;
			text-align: center;
			&:hover {
				background-color: #f5f7fa;
			}
		}
	}
}

.title-panel {
	width: 100%;
	height: 80px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20px;
	font-size: 18px;
	color: #000000;
	border-bottom: 1px solid #ddd;
	.title {
		font-size: 18px;
		font-weight: 600;
	}
}

.chat-container {
	height: calc(100% - 80px);
}
</style>
