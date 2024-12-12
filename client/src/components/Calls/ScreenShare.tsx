// src/components/Calls/ScreenShare.tsx
import { useRef, useState } from 'react';
import { sendScreenShareOffer, sendScreenShareEnd } from '../../api/socketService';

const ScreenShare = () => {
    const [isSharing, setIsSharing] = useState(false);
    const peerRef = useRef<any>(null);

    const startScreenShare = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            if (peerRef.current) {
                peerRef.current.addStream(stream);
                sendScreenShareOffer({ stream }); // Отправляем информацию о начале демонстрации экрана
                setIsSharing(true);
            }
        } catch (err) {
            console.error('Error sharing screen:', err);
        }
    };

    const stopScreenShare = () => {
        sendScreenShareEnd(); // Завершаем демонстрацию экрана
        setIsSharing(false);
    };

    return (
        <div>
            {!isSharing ? (
                <button onClick={startScreenShare}>Start Screen Share</button>
            ) : (
                <button onClick={stopScreenShare}>Stop Screen Share</button>
            )}
        </div>
    );
};

export default ScreenShare;
