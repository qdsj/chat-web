<script setup lang="ts">
import { ref } from "vue";
import { useSocketStore } from "@/store/useSocketStore";
import { useRoute } from "vue-router";
import ChatSession from "./ChatSession.vue";
import MessageSend from "./MessageSend.vue";
import Blank from "@/components/Blank.vue";
const socketStore = useSocketStore();
const route = useRoute();
const selfName = ref("");
// const message = ref("");
const searchKey = ref("");

// 搜索好友 or 群聊
const search = () => {
	console.log(searchKey.value);
};
// 会话列表
interface Conversation {
	id: string;
	name: string;
	lastMessage?: string;
	time?: string;
	contactType?: number;
	topType?: number;
}
const conversations = ref<Conversation[]>([
	{ id: "group-all", name: "所有人的群聊", contactType: 1 },
	{ id: "1", name: "张三", lastMessage: "你好！", time: "10:00", topType: 1 },
	{ id: "2", name: "Zenos", lastMessage: "在吗？", time: "09:30" },
	{ id: "3", name: "王五", lastMessage: "好的", time: "昨天" },
]);

// 当前选中的会话
const currentChatSession = ref<Conversation | null>();
// 点击会话
const chatSessionClickHandle = (item: Conversation) => {
	currentChatSession.value = Object.assign({}, item);
};

// 聊天记录列表
const messages = ref([
	{ id: 1, sender: "", content: "你好！", isSelf: false, time: "10:00" },
	{
		id: 2,
		sender: selfName.value,
		content: "你好，有什么可以帮你的吗？",
		isSelf: true,
		time: "10:01",
	},
]);

onMounted(() => {
	console.log(route);
	selfName.value = (route.query.name || "") as string;

	// connect socket
	socketStore.socketInitial({
		onConnectCallbacks: [
			() => {
				// socketStore.socketJoinRoom("group-all");
			},
		],
		onMessageCallbacks: [
			(data: any) => {
				console.log("message", data);
				messages.value.push({
					id: messages.value.length + 1,
					sender: data.sender,
					content: data.content,
					isSelf: false,
					time: new Date().toLocaleTimeString("zh-CN", {
						hour: "2-digit",
						minute: "2-digit",
					}),
				});
			},
		],
	});
});
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
			<div class="chat-session-list">
				<template v-for="item in conversations">
					<ChatSession :data="item" @click="chatSessionClickHandle(item)"></ChatSession>
				</template>
			</div>
		</template>

		<!-- 右边 -->
		<template #right-content>
			<div class="title-panel" v-if="currentChatSession">
				<div class="title">
					<span>{{ currentChatSession.name }}</span>
				</div>
				<!-- 群聊 -->
				<div class="iconfont icon-icon_more"></div>
			</div>
			<el-main class="chat-box" v-show="currentChatSession">
				<div class="messages-container">
					<div
						v-for="msg in messages"
						:key="msg.id"
						:class="['message', msg.isSelf ? 'message-self' : 'message-other']">
						<el-avatar size="small">{{ msg.isSelf ? "Me" : msg.sender }}</el-avatar>
						<el-card class="message-content" shadow="never">
							{{ msg.content }}
							<div class="message-time">{{ msg.time }}</div>
						</el-card>
					</div>
				</div>
			</el-main>
			<Blank v-if="!currentChatSession"></Blank>
			<!-- 发送组件 -->
			<MessageSend v-if="currentChatSession" :currentChatSession="currentChatSession || {}"></MessageSend>
		</template>
	</Layout>
</template>

<style scoped lang="scss">
.top-search {
	padding: 30px 10px 20px 10px;
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
	height: calc(100vh - 360px);
	padding: 0;
	display: flex;
	flex-direction: column;

	.messages-container {
		flex: 1;
		padding: 20px;
		overflow-y: auto;

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
				.message-time {
					font-size: 12px;
					color: #909399;
					margin-top: 4px;
					text-align: right;
				}
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
	height: 91px;
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
</style>
