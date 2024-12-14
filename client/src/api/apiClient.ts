const API_BASE_URL = 'http://127.0.0.1:3000';

// Helper function to send requests
export async function fetchAPI(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Network response was not ok');
    }

    return response.json();
}

export async function createChat(receiverUsername: string): Promise<any> {
    return fetchAPI('/chats/create', {
        method: 'POST',
        body: JSON.stringify({ receiverUsername }),
    });
}

export async function createGroupChat(chatName: string, participants: string[]): Promise<any> {
    return fetchAPI('/chats/create-group', {
        method: 'POST',
        body: JSON.stringify({ chatName, participants }),
    });
}

export async function sendMessage(chatId: string, message: string): Promise<any> {
    return fetchAPI('/chats/send-message', {
        method: 'POST',
        body: JSON.stringify({ chatId, message }),
    });
}

// Вставьте эту функцию в apiClient.ts
export async function fetchChatMessages(chatId: string): Promise<any> {
    return fetchAPI(`/chats/${chatId}/messages`, { method: 'GET' });
}

export async function getChats(): Promise<any> {
    return fetchAPI('/chats', { method: 'GET' });
}

export async function getUserFriends(): Promise<any> {
    return fetchAPI('/friends', { method: 'GET' });
}

export async function addUserFriend(friendUsername: string): Promise<any> {
    return fetchAPI('/friends/add', {
        method: 'POST',
        body: JSON.stringify({ friendUsername }),
    });
}

export async function acceptUserFriendRequest(friendId: string): Promise<any> {
    return fetchAPI('/friends/confirm', {
        method: 'POST',
        body: JSON.stringify({ friendId: Number(friendId) }),
    });
}

export async function removeUserFriend(friendUsername: string): Promise<any> {
    return fetchAPI('/friends/remove', {
        method: 'DELETE',
        body: JSON.stringify({ friendUsername }),
    });
}
