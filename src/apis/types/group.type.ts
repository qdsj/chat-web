import { ConversationType } from "@/types/model/chat.type";

export interface I_CreateGroupChatApiResult {
  status: number;
  message: string;
  data: {
    name: string;
    description: string;
    avatar: string;
    type: string;
    deleted: boolean;
    deletedAt: Date;
    id: string;
    createdAt: string;
  };
}

export interface I_GetGroupListApiResult {
  status: number;
  message: string;
  data: [
    {
      id: string;
      name: string;
      description: string;
      avatar: string;
      type: ConversationType;
      deleted: boolean;
      deletedAt: null;
      createdAt: string;
      roomShip: {
        id: string;
        roomId: string;
        userId: string;
        status: string;
        userType: string;
        createdAt: string;
      };
      member: I_GetGroupMemberInfoApiResult["data"];
      memberCount: number;
    }
  ];
}

export interface I_UpdateGroupChatInfoApiResult {
  status: number;
  message: string;
  data: null;
}

export interface I_GetGroupMemberInfoApiResult {
  status: number;
  message: string;
  data: [
    {
      chatRoomShipInfo: {
        id: string;
        roomId: string;
        userId: string;
        status: string;
        userType: string;
        createdAt: string;
      };
      id: string;
      username: string;
      email: string;
      avatar: string;
      description: string;
      sex: string;
    }
  ];
}

export interface I_GetGroupMemberCountApiResult {
  status: number;
  message: string;
  data: number;
}

export interface I_AddGroupMemberApiResult {
  status: number;
  message: string;
  data: [
    {
      userId: string;
      roomId: string;
      type: string;
      status: string;
      userType: string;
      id: string;
      createdAt: string;
    }
  ];
}
