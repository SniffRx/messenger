import { FastifyInstance } from "fastify";
import {showFriends} from "./friends/show";
import {addFriends} from "./friends/add";
import {removeFriends} from "./friends/remove";
import {login} from "./login";
import {register} from "./register";
import {confirmFriend} from "./friends/confirm";
import {createChat} from "./chats/create";
import websocketRoutes from "./websocket";
import {getChats} from "./chats/show";
import {showFriendRequests} from "./friends/showRequests";
import {sendMessage} from "./chats/send";
import {getChatMessages} from "./chats/messages";

export async function registerRoutes(server: FastifyInstance) {
    await login(server);
    await register(server);

    await showFriends(server);
    await showFriendRequests(server);

    await addFriends(server);
    await removeFriends(server);
    await confirmFriend(server);

    await getChats(server);
    await createChat(server);
    await sendMessage(server);
    await getChatMessages(server);

    await websocketRoutes(server);
}
