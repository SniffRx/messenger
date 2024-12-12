const API_BASE_URL = 'http://127.0.0.1:3000/';

// Helper function to send requests
async function fetchAPI(endpoint: string, options: RequestInit = {}): Promise<any> {
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

// Example API calls
export async function getUserFriends(): Promise<any> {
    return fetchAPI('/friends', {
        method: 'GET',
    });
}

export async function addUserFriend(friendId: string): Promise<any> {
    return fetchAPI('/friends', {
        method: 'POST',
        body: JSON.stringify({ friendId }),
    });
}

export async function acceptUserFriendRequest(requestId: string): Promise<any> {
    return fetchAPI(`/friends/requests/${requestId}`, {
        method: 'PUT', // Assuming a PUT request for accepting requests
    });
}

export async function removeUserFriend(friendId: string): Promise<any> {
    return fetchAPI(`/friends/${friendId}`, {
        method: 'DELETE',
    });
}
