export interface LoginRequest {
    Body: {
        email: string,
        password: string
    }
}

export interface RegisterRequest {
    Body: {
        email: string,
        username: string,
        password: string,
    }
}

export interface SignalMessage {
    type: "call-offer" | "call-answer" | "call-ice-candidate" | "call-start" | "screen-share-start" | "screen-share-end";
    groupId?: string;
    recipientId?: string;
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidate;
    callerId?: string;
}

export interface ChatMessage {
    type: "chat-message";
    chatId: string;
    senderId: string;
    content: string;
    createdAt: string; // ISO формат
}

export interface ChatEvent {
    type: "join-chat" | "leave-chat" | "send-message";
    chatId: string;
    userId: string;
    content?: string; // Только для отправки сообщения
}