export interface AddFriendRequest {
    Headers: {
        Authorization: string;
    };
    Body: {
        friendId: number;
    };
}

export interface ConfirmFriendRequest {
    Headers: {
        Authorization: string;
    };
    Body: {
        friendId: number;
    };
}

export interface RemoveFriendRequest {
    Headers: {
        Authorization: string;
    };
    Body: {
        friendUsername: string;
    };
}

export interface ShowFriendRequest {
    Headers: {
        Authorization: string;
    };
}

export interface showFriendRequests {
    Headers: {
        Authorization: string;
    };
}