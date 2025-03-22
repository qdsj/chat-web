<script setup lang="ts">
import { blockFriend, unblockFriend } from "@/apis/friend";
import ContextMenu from "@imengyu/vue3-context-menu";
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import { ElMessage, ElMessageBox } from "element-plus";
import LeftContent from "./components/LeftContent.vue";

//@ts-ignore
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
			<LeftContent />
		</template>
		<!-- 右边 -->
		<template #right-content>
			<!-- header -->
			<router-view v-slot="{ Component }">
				<component :is="Component" ref="componentRef"></component>
			</router-view>
		</template>
	</Layout>
</template>

<style scoped lang="scss"></style>
