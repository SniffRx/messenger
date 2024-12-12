// src/components/Calls/VideoCall.tsx
import { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { sendOffer, onOfferReceived, sendAnswer, onAnswerReceived, onCandidateReceived } from '../../api/socketService';

const VideoCall = () => {
    const userVideo = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<any>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [callStatus, setCallStatus] = useState<string>('');

    useEffect(() => {
        // Запрос к медиа-устройствам
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (userVideo.current) {
                    userVideo.current.srcObject = stream;
                }

                // Инициализация Peer-соединения
                peerRef.current = new SimplePeer({ initiator: true, trickle: false });
                peerRef.current.addStream(stream);

                peerRef.current.on('signal', (data: any) => {
                    sendOffer(data); // Отправка сигнала на сервер
                });

                peerRef.current.on('connect', () => {
                    setIsConnected(true);
                });

                peerRef.current.on('stream', (remoteStream: MediaStream) => {
                    const remoteVideo = document.createElement('video');
                    remoteVideo.srcObject = remoteStream;
                    remoteVideo.autoplay = true;
                    document.body.appendChild(remoteVideo);
                });

                // Получаем предложение от других пользователей
                onOfferReceived((offer: any) => {
                    peerRef.current.signal(offer);
                });

                // Получаем ответ от другого пользователя
                onAnswerReceived((answer: any) => {
                    peerRef.current.signal(answer);
                });

                // Получаем кандидатов
                onCandidateReceived((candidate: RTCIceCandidate) => {
                    peerRef.current.addIceCandidate(candidate);
                });
            })
            .catch((err) => {
                console.error('Error accessing media devices:', err);
            });

        return () => {
            peerRef.current.destroy();
        };
    }, []);

    const handleAnswerCall = () => {
        const answer = { type: 'answer', sdp: '...' }; // Пример ответа
        sendAnswer(answer);
        setCallStatus('In call');
    };

    return (
        <div>
            <video ref={userVideo} autoPlay muted />
            {isConnected ? (
                <div>
                    <div>{callStatus}</div>
                    <button onClick={handleAnswerCall}>Answer Call</button>
                </div>
            ) : (
                <div>Waiting for call...</div>
            )}
        </div>
    );
};

export default VideoCall;
