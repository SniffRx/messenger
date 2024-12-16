import {ObjectId} from "mongodb";

export interface CreateChatPostRequest {
    Headers: {
        Authorization: string;
    };
    Body: {
        id: number;
    };
}

export interface CreateGroupChatRequest {
    Headers: {
        Authorization: string;
    };
    Body: {
        participants: string[];
        chatName: string;
    };
}

export interface GetChatsRequest {
    Headers: {
        Authorization: string;
    };
}

export interface SendMessageRequest {
    Headers: {
        Authorization: string;
    };
    Body: {
        chatId: string;
        message: string;
    };
}

// Определяем интерфейс для документа чата
export interface ChatDocument {
    _id: ObjectId;
    participants: number[]; // Список участников чата
    messages: Message[]; // Сообщения в чате
}

export interface Message {
    senderId: number;
    content: string;
    messageType: string;
    createdAt: Date;
}