export interface I_GetSingleChatHistoryResultApi {
  status: number;
  message: "string";
  data: [
    {
      id: "string";
      roomId: "string";
      senderId: "string";
      receiverId: "string";
      content: "string";
      msgType: "string";
      createdAt: "string";
    }
  ];
}

export interface I_GetGroupChatHistoryResultApi {
  status: number;
  message: "stirng";
  data: [
    {
      id: "string";
      roomId: "string";
      senderId: "string";
      atPersonId: "string";
      content: "string";
      msgType: "string";
      createdAt: "string";
      type: "string";
    }
  ];
}

export interface I_getChatWindowsTimeResultApi {
  status: number;
  message: "string";
  data: [
    {
      type: "string";
      id: "string";
      userId: "string";
      roomId: "string";
      openTime: "string";
      createAt: "string";
      roomInfo: {
        id: "string";
        name: "string";
        description: "string";
        avatar: "string";
        type: "string";
        deleted: boolean;
        deletedAt: "string";
        createdAt: "string";
      };
    }
  ];
}
