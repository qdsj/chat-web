<script setup lang="ts">
import { useRouter } from "vue-router";
import { SearchIcon, newFriendIcon, groupIcon } from "./AvatarIcon";
const props = defineProps({
	avatar: {
		type: String,
		default: "",
	},
	data: {
		type: Object,
		default: {},
	},
	path: {
		type: String,
		default: "",
	},
	name: {
		type: String,
		default: "",
	},
	// 是好友item，还是群组item
	// 还有其他item
	type: {
		type: String,
		default: "friend",
	},
});
const router = useRouter();
const avatarMap = {
	search: SearchIcon,
	newFriend: newFriendIcon,
	group: groupIcon,
};

const gotoPage = (data: any) => {
	router.push(props.path);
};
</script>

<template>
	<div class="list-item part-item" @click="gotoPage">
		<Avatar
			v-if="type == 'friend'"
			:avatar="avatar"
			:userId="data.email"
			:username="data.name"
			:width="35"
			:showDetail="false"></Avatar>

		<component v-else :is="avatarMap[type as keyof typeof avatarMap]" />

		<div class="text">
			{{ name }}
		</div>
	</div>
</template>

<style scoped lang="scss">
.list-item.part-item {
	display: flex;
	align-items: center;
	padding: 15px;
	position: relative;
	&:hover {
		cursor: pointer;
		background-color: #d6d6d6;
	}
	.iconfont {
		width: 37px;
		height: 37px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		color: #fff;
	}
	.text {
		flex: 1;
		color: #000000;
		margin-left: 10px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 18px;
	}
}
</style>
