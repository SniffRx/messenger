import {FastifyInstance} from 'fastify';
import {WebSocketServer, WebSocket} from 'ws';
import {v4 as uuidv4} from 'uuid';
import {SignalMessage} from "./types";

const clients: Map<string, WebSocket> = new Map(); // Маппинг пользователей по их ID
const groups: Map<string, Set<string>> = new Map(); // Группы пользователей для видеозвонков

export default async function websocketRoutes(fastify: FastifyInstance) {
    const wss = new WebSocketServer({noServer: true});

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
        console.log(`User connected: ${clientId}`);

        ws.on('message', (data) => {
            const message: SignalMessage = JSON.parse(data.toString());
            switch (message.type) {
                case 'call-offer':
                case 'call-answer':
                case 'call-ice-candidate':
                    forwardSignal(message);
                    break;
                case 'call-start':
                    joinGroup(message.groupId!, clientId);
                    notifyGroup(message.groupId!, {type: 'call-start', callerId: clientId});
                    break;
                case 'screen-share-start':
                    notifyGroup(message.groupId!, {type: 'screen-share-start', screenId: clientId});
                    break;
                case 'screen-share-end':
                    notifyGroup(message.groupId!, {type: 'screen-share-end', screenId: clientId});
                    break;
                default:
                    console.error('Unknown message type:', message.type);
            }
        });

        // ws.on('close', () => clients.delete(clientId));
        ws.on('close', () => {
            clients.delete(clientId);
            leaveGroup(clientId);
            console.log(`User disconnected: ${clientId}`);
        });
    });

    function forwardSignal(message: SignalMessage) {
        const recipientWs = clients.get(message.recipientId!);
        if (recipientWs) {
            recipientWs.send(JSON.stringify(message));
        }
    }

    // Функция для уведомления всей группы
    function notifyGroup(groupId: string, payload: Record<string, any>) {
        const group = groups.get(groupId);
        if (group) {
            group.forEach((clientId) => {
                const clientWs = clients.get(clientId);
                if (clientWs) {
                    clientWs.send(JSON.stringify(payload));
                }
            });
        }
    }

    // Функция для добавления пользователя в группу
    function joinGroup(groupId: string, clientId: string) {
        if (!groups.has(groupId)) {
            groups.set(groupId, new Set());
        }
        groups.get(groupId)?.add(clientId);
    }

    // Функция для удаления пользователя из группы
    function leaveGroup(clientId: string) {
        groups.forEach((group, groupId) => {
            if (group.has(clientId)) {
                group.delete(clientId);
                if (group.size === 0) {
                    groups.delete(groupId); // Удаляем пустую группу
                }
            }
        });
    }
}
