export interface LoginRequest {
    Body: {
        username: string,
        password: string
    }
}

export interface RegisterRequest {
    Body: {
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