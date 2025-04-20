import { ConversationType } from "@/types/model/chat.type";

export interface I_ErrorApiResult {
  status: number;
  message: "string";
  data: null;
}

type I_FriendShipStatus = "pending" | "accepted" | "rejected" | "blocked";

export interface I_FindUserByNameApiResult {
  data: {
    id: "string";
    username: "string";
    email: "string";
    type?: ConversationType;
    friendShip: {
      id: "string";
      userId: "string";
      friendId: "string";
      requesterId: "string";
      requestMessage: "string";
      status: I_FriendShipStatus;
      blockerId: "string";
      createdAt: "string";
    };
  };
}

export interface I_AddFriendApiResult {
  status: number;
  message: "string";
  data: {
    id: "string";
    username: "string";
    email: "string";
  };
}

export interface I_GetRequestListApiResult {
  status: number;
  message: "string";
  data: [
    {
      id: "string";
      username: "string";
      email: "string";
      avatar?: "string";
      friendShip: {
        id: "string";
        userId: "string";
        friendId: "string";
        requesterId: "string";
        requestMessage: "string";
        status: I_FriendShipStatus;
        blockerId: "string";
        createdAt: "string";
      };
    }
  ];
}

export interface I_AgreeFriendApiResult {
  status: number;
  message: "string";
  data: {
    blockerId: "string";
    createdAt: "string";
    id: "string";
    receiverId: "string";
    requestMessage: "string";
    requesterId: "string";
    status: I_FriendShipStatus;
  };
}

export interface I_GetFriendListApiResult {
  status: number;
  message: "string";
  data: [
    {
      id: "string";
      username: "string";
      email: "string";
      avatar?: "string";
      description: "string";
      sex: "string";
      friendShip: {
        id: "string";
        userId: "string";
        friendId: "string";
        requesterId: "string";
        requestMessage: "string";
        status: I_FriendShipStatus;
        blockerId: "string";
        createdAt: "string";
      };
    }
  ];
}

export interface I_blockFriendApiResult {
  status: number;
  message: "string";
  data: {
    blockerId: "string";
    createdAt: "string";
    friendId: "string";
    id: "string";
    requesterId: "string";
    requestMessage: "string";
    status: I_FriendShipStatus;
    userId: "string";
  };
}
