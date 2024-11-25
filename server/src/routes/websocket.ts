import { FastifyInstance } from 'fastify';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

interface SignalMessage {
    type: string;
    groupId?: string;
    recipientId?: string;
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidate;
    callerId?: string;
}

const clients: Map<string, WebSocket> = new Map();

export default async function websocketRoutes(fastify: FastifyInstance) {
    const wss = new WebSocketServer({ noServer: true });

    fastify.server.on('upgrade', (request, socket, head) => {
        if (request.url === '/ws') {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        }
    });

    wss.on('connection', (ws) => {
        const clientId = uuidv4();
        clients.set(clientId, ws);

        ws.on('message', (data) => {
            const message: SignalMessage = JSON.parse(data.toString());
            switch (message.type) {
                case 'call-offer':
                case 'call-answer':
                case 'call-ice-candidate':
                    forwardSignal(message);
                    break;
                case 'call-start':
                    notifyGroup(message.groupId!, { type: 'call-start', callerId: clientId });
                    break;
                case 'screen-share-start':
                    notifyGroup(message.groupId!, { type: 'screen-share-start', screenId: clientId });
                    break;
                case 'screen-share-end':
                    notifyGroup(message.groupId!, { type: 'screen-share-end', screenId: clientId });
                    break;
                default:
                    console.error('Unknown message type:', message.type);
            }
        });

        ws.on('close', () => {
            clients.delete(clientId);
        });
    });

    function forwardSignal(message: SignalMessage) {
        const recipientWs = clients.get(message.recipientId!);
        if (recipientWs) {
            recipientWs.send(JSON.stringify(message));
        }
    }

    function notifyGroup(groupId: string, payload: Record<string, any>) {
        // Здесь можно использовать вашу логику для отправки сообщений в группу
        clients.forEach((client) => {
            client.send(JSON.stringify(payload));
        });
    }
}
