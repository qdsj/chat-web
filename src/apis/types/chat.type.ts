export interface I_GetSingleChatHistoryResultApi {
  status: number;
  message: string;
  data: [
    {
      id: string;
      roomId: string;
      senderId: string;
      receiverId: string;
      content: string;
      msgType: string;
      createdAt: string;
    }
  ];
}

export interface I_GetGroupChatHistoryResultApi {
  status: number;
  message: string;
  data: [
    {
      id: string;
      roomId: string;
      senderId: string;
      atPersonId: string;
      content: string;
      msgType: string;
      createdAt: string;
      type: string;
    }
  ];
}

export interface I_updateChatWindowsTimeResultApi {
  status: number;
  message: string;
  data: {
    userId: string;
    roomId: string;
    openTime: string;
    id: string;
    createAt: string;
  };
}

export interface I_AddSessionResultApi {
  status: number;
  message: string;
  data: {
    userId: string;
    roomId: string;
    type: string;
    id: string;
    isDeleted: true;
    createdAt: string;
  };
}

export interface I_GetSessionListResultApi {
  status: number;
  message: string;
  data: [
    {
      id: string;
      userId: string;
      roomId: string;
      type: string;
      isDeleted: boolean;
      createdAt: string;
      openTime: string;
      roomInfo: {
        id: string;
        name: string;
        username?: string;
        description: string;
        avatar: string;
        type: string;
        deleted: boolean;
        deletedAt: string;
        createdAt: string;
        count: number;
      };
    }
  ];
}

export interface I_deleteSessionResultApi {
  status: number;
  message: string;
  data: string;
}
