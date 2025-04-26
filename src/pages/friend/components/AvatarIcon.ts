export const AvatarIcon = defineComponent({
	name: "AvatarIcon",
	props: ["icon", "iconBgColor"],
	template: `<div :class="['iconfont', icon]" :style="{ background: iconBgColor }"></div>`,
});

export const SearchIcon = defineComponent({
	name: "SearchIcon",
	components: {
		AvatarIcon,
	},
	template: `<AvatarIcon icon="icon-search" iconBgColor="#fa9d3b"></AvatarIcon>`,
});

export const newFriendIcon = defineComponent({
	name: "newFriendIcon",
	components: {
		AvatarIcon,
	},
	template: `<AvatarIcon icon="icon-icon-plane" iconBgColor="#08bf61"></AvatarIcon>`,
});

export const groupIcon = defineComponent({
	name: "groupIcon",
	components: {
		AvatarIcon,
	},
	template: `<AvatarIcon icon="icon-icon-add-group" iconBgColor="#1485ee"></AvatarIcon>`,
});
