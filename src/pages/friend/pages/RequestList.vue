<script setup lang="ts">
import { DialogConfig } from "@/util/types";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ButtonType as ElButtonType } from "element-plus";
import { getRequestList, agreeFriend, blockFriend } from "@/apis/friend";

const dialogConfig = ref<DialogConfig>({
	show: false,
	title: "通过朋友验证",
	buttons: [],
});

const formData = ref({
	remarkName: "",
});

const applyList = ref([
	{
		contactType: 0, // 联系人类型，0为好友，1为群聊
		status: "", // 状态，0为待处理，1为已同意，2为已拒绝，3为被拉黑
		statusName: "statusName",
		applyUserId: "",
		id: "",
		username: "",
		requestMessage: "",
	},
]);

onMounted(() => {
	getContactApplyList();
});

// 获取好友申请列表
const getContactApplyList = async () => {
	const res = await getRequestList();
	if (res.status == 200) {
		applyList.value = res.data;
	} else {
		ElMessage.warning("获取好友申请列表失败");
		return;
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
				await agreeFriend({ friendId: applyId });
			},
		},
	];
};

const handleBlock = (applyId: string, username: string) => {
	ElMessageBox.confirm(`确定要拉黑${username}吗?`, "Warning", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(async () => {
			const res = await blockFriend({ friendId: applyId });

			ElMessage({
				type: "success",
				message: res.message,
			});
		})
		.catch(() => {
			ElMessage({
				type: "info",
				message: "取消拉黑",
			});
		});
};
</script>

<template>
	<ContentPanel :showTopBorder="true"
		><div>
			<div class="apply-item" v-for="item in applyList">
				{{ item.contactType }}
				<!-- <div
          :class="['contact-type', item.contactType == 0 ? 'user-contact' : '']"
        >
          {{ item.contactType == 0 ? "好友" : "群聊" }}
        </div> -->
				<Avatar :width="50" :userId="item.id" :username="item.username"></Avatar>
				<div class="contact-info">
					<div class="nickname">{{ item.username }}</div>
					<div class="apply-info">{{ item.requestMessage }}</div>
				</div>
				<div class="op-btn">
					<div v-if="item.status == 'pending'">
						<el-dropdown placement="bottom-end" trigger="click">
							<span class="el-dropdown-link">
								<el-button type="primary">接受</el-button>
							</span>
							<template #dropdown>
								<el-dropdown-item @click="agreeApply(item.id, item.username)">同意</el-dropdown-item>
								<el-dropdown-item @click="handleBlock(item.id, item.username)">拉黑</el-dropdown-item>
							</template>
						</el-dropdown>
					</div>
					<div v-else class="result-name">{{ item.status }}</div>
				</div>
			</div>
		</div>
		<Dialog
			:show="dialogConfig.show"
			:title="dialogConfig.title"
			:buttons="dialogConfig.buttons"
			width="400px"
			@close="dialogConfig.show = false"
			:showCancel="true">
			<el-form :model="formData" label-width="60px">
				<el-form-item label="备注名" props="remarkName">
					<el-input v-model="formData.remarkName" placeholder="请输入备注名"></el-input>
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
