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
  data: Array<{
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
  }>;
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

export interface I_KickMemberApiResult {
  status: number;
  message: string;
  data: {
    raw: string[];
    affected: number;
  };
}

export interface I_QuitGroupApiResult {
  status: number;
  message: string;
  data: {
    raw: string[];
    affected: number;
  };
}

export interface I_DissolveGroupApiResult {
  status: number;
  message: string;
  data: {
    generatedMaps: string[];
    raw: string[];
    affected: number;
  };
}

// 群主设置管理员
export interface I_SetGroupAdminApiResult {
  status: number;
  message: string;
  data: {
    generatedMaps: string[];
    raw: string[];
    affected: number;
  };
}

// 群主取消管理员
export interface I_CancelGroupAdminApiResult {
  status: number;
  message: string;
  data: {
    generatedMaps: string[];
    raw: string[];
    affected: number;
  };
}
