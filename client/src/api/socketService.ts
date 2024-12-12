// src/api/socketService.ts
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:3000'); // Адрес вашего сервера

// Слушаем подключение
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

// Отправка сигнала "offer" (приглашение на звонок)
export const sendOffer = (offer: any) => {
    socket.emit('offer', offer);
};

// Получение сигнала "offer" (приглашение от другого пользователя)
export const onOfferReceived = (callback: (offer: any) => void) => {
    socket.on('offer', callback);
};

// Отправка сигнала "answer" (ответ на звонок)
export const sendAnswer = (answer: any) => {
    socket.emit('answer', answer);
};

// Получение сигнала "answer" (ответ от другого пользователя)
export const onAnswerReceived = (callback: (answer: any) => void) => {
    socket.on('answer', callback);
};

// Отправка сигнала "candidate" (для WebRTC ICE candidates)
export const sendCandidate = (candidate: RTCIceCandidate) => {
    socket.emit('candidate', candidate);
};

// Получение сигнала "candidate" (для ICE candidates)
export const onCandidateReceived = (callback: (candidate: RTCIceCandidate) => void) => {
    socket.on('candidate', callback);
};

// Отправка сигнала для начала демонстрации экрана
export const sendScreenShareOffer = (offer: any) => {
    socket.emit('screen-share-offer', offer);
};

// Получение сигнала для начала демонстрации экрана
export const onScreenShareOfferReceived = (callback: (offer: any) => void) => {
    socket.on('screen-share-offer', callback);
};

// Отправка сигнала для завершения демонстрации экрана
export const sendScreenShareEnd = () => {
    socket.emit('screen-share-end');
};

// Слушаем события отключения
socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});

export default socket;
