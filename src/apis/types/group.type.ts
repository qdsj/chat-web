export interface I_CreateGroupChatApiResult {
  status: number;
  message: "string";
  data: {
    name: "string";
    description: "string";
    avatar: "string";
    type: "string";
    deleted: "boolean";
    deletedAt: "Date";
    id: "string";
    createdAt: "string";
  };
}

export interface I_GetGroupListApiResult {
  status: number;
  message: "string";
  data: [
    {
      id: "string";
      name: "string";
      description: "string";
      avatar: "string";
      type: "string";
      deleted: boolean;
      deletedAt: null;
      createdAt: "string";
      roomShip: {
        id: "string";
        roomId: "string";
        userId: "string";
        status: "string";
        userType: "string";
        createdAt: "string";
      };
    }
  ];
}
