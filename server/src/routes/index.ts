import { FastifyInstance } from "fastify";
import {showFriends} from "./friends/show";
import {addFriends} from "./friends/add";
import {removeFriends} from "./friends/remove";
import {login} from "./login";
import {register} from "./register";
import {confirmFriend} from "./friends/confirm";
import {createChat} from "./chats/create";

export async function registerRoutes(server: FastifyInstance) {
    await login(server);
    await register(server);
    await showFriends(server);
    await addFriends(server);
    await removeFriends(server);
    await confirmFriend(server);
    await createChat(server);
}
