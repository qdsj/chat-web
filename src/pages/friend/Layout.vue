<script setup lang="ts">
import { blockFriend, unblockFriend } from "@/apis/friend";
import { useFriendStore } from "@/store/useFriendStore";
import ContextMenu from "@imengyu/vue3-context-menu";
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import ListGroup from "./components/ListGroup.vue";

const friendStore = useFriendStore();
const searchKey = ref("");

// 搜索好友 or 群聊
const search = () => {
	console.log(searchKey.value);
};

const newFriendGroup = {
	name: "新朋友",
	children: [
		{
			name: "搜好友",
			path: "/contact/search",
			type: "search",
		},
		{
			name: "新的朋友",
			path: "/contact/contactNotice",
			type: "newFriend",
		},
	],
};

const newGroupGroup = {
	name: "群聊",
	children: [
		{
			name: "新建群聊",
			path: "/contact/createGroup",
			type: "group",
		},
		{
			name: "相亲相爱一家人",
			path: "/contact/groupDetail?id=group@qq.com&name=相亲相爱一家人",
			type: "friend",
			avatar: "",
			data: {
				email: "group@qq.com",
				name: "相亲相爱一家人",
			},
		},
	],
};

const friendGroup = {
	name: "我的好友",
	children: [
		...(friendStore.friendList || []).map((item) => {
			return {
				name: item.username,
				path: `/contact/userDetail?id=${item.email}&username=${item.username}`,
				type: "friend",
				avatar: "",
				data: {
					email: item.email,
					name: item.username,
				},
			};
		}),
	],
};

const onContextMenu = (e: MouseEvent, data: any) => {
	e.preventDefault();
	ContextMenu.showContextMenu({
		x: e.x,
		y: e.y,
		items: [
			{
				label: "删除好友",
				onClick: () => {
					ElMessageBox.confirm("你确定要拉黑该联系人吗?", "Warning", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
						.then(() => {
							ElMessage({
								type: "success",
								message: "删除联系人成功",
							});
						})
						.catch(() => {
							ElMessage({
								type: "info",
								message: "取消删除",
							});
						});
				},
			},
			{
				label: data.status == "blocked" ? "恢复好友关系" : "拉黑好友",
				onClick: () => {
					const confirmMsg =
						data.status === "blocked" ? "你确定要恢复与该联系人的好友关系吗？" : "你确定要删除该好友吗？";
					ElMessageBox.confirm(confirmMsg, "Warning", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
						.then(async () => {
							if (data.status === "status") {
								await unblockFriend({ friendId: data.id });
							} else {
								await blockFriend({ friendId: data.id });
							}
							const successMsg = data.status === "blocked" ? "恢复好友关系成功" : "删除好友成功";
							ElMessage({
								type: "success",
								message: successMsg,
							});
						})
						.catch(() => {
							const cancelMsg = data.status === "blocked" ? "取消恢复好友关系" : "取消删除好友";
							ElMessage({
								type: "info",
								message: cancelMsg,
							});
						});
				},
			},
		],
	});
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
			<!-- 联系人 or 群聊 -->
			<div class="list-group-container">
				<ListGroup :name="newFriendGroup.name" :children="newFriendGroup.children" />
				<ListGroup :name="newGroupGroup.name" :children="newGroupGroup.children" />
				<ListGroup :name="friendGroup.name" :children="friendGroup.children" />
			</div>
		</template>
		<!-- 右边 -->
		<template #right-content>
			<router-view v-slot="{ Component }">
				<component :is="Component" ref="componentRef"></component>
			</router-view>
		</template>
	</Layout>
</template>

<style scoped lang="scss">
.top-search {
	padding: 20px 10px;
	background-color: #f7f7f7;
	display: flex;
	align-items: center;
	.iconfont {
		font-size: 18px;
	}
}

.list-grtoup-container {
	height: calc(100vh - 92px);
}

.title-panel {
	width: 100%;
	height: 81px;
	display: flex;
	align-items: center;
	padding-left: 10px;
	font-size: 18px;
	color: #000000;
}
</style>
