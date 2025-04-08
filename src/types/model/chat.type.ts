export type ConversationType = "person" | "group";
export type MsgType = "text" | "image" | "video" | "audio" | "pdf";
// 聊天记录
export interface Message {
	id: string;
	roomId: string;
	senderId: string;
	content: string;
	isSelf?: boolean;
	createdAt: string;
	msgType?: MsgType;
}

export interface SocketMessage {
	msg: string;
	senderId: string;
	roomId: string;
	msgType: MsgType;
	type: ConversationType;
}

// 会话列表
export interface Conversation {
	id: string; // roomId / friendId
	name: string; // 群聊名称/好友昵称
	avatar: string; // 群聊头像/好友头像
	type: ConversationType;
	contactType?: number; // 0: 好友，1: 群聊
	memberCount?: number; // 群聊成员数量
	// lastMessage?: string; // 最后一条消息
	// time?: string; // 最后一条消息时间
	topType?: number; // 置顶类型
	messages: Message[]; // 消息列表
	unreadCount?: number; // 未读消息数量
}
