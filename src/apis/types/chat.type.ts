export interface I_GetChatHistoryResultApi {
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
