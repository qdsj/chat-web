export interface I_ErrorApiResult {
	status: number;
	message: "string";
	data: null;
}

export interface I_FindUserByNameApiResult {
	data: {
		id: "string";
		username: "string";
		email: "string";
		friendShip: {
			id: "string";
			userId: "string";
			friendId: "string";
			requesterId: "string";
			requestMessage: "string";
			status: "string";
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
			friendShip: {
				id: "string";
				userId: "string";
				friendId: "string";
				requesterId: "string";
				requestMessage: "string";
				status: "string";
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
		id: "string";
		username: "string";
		email: "string";
	};
}

export interface I_GetFriendListApiResult {
	status: 0;
	message: "string";
	data: [
		{
			id: "string";
			username: "string";
			email: "string";
			friendShip: {
				id: "string";
				userId: "string";
				friendId: "string";
				requesterId: "string";
				requestMessage: "string";
				status: "string";
				blockerId: string;
				createdAt: "string";
			};
		}
	];
}
