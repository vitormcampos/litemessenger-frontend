import { isPlatformServer } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
    HubConnectionBuilder,
    HubConnection,
    HttpTransportType,
} from '@microsoft/signalr';
import { CookieService } from '../cookie/cookie.service';
import { AUTH_KEY } from '../../interceptors/auth.interceptor';
import { UserStore } from '../../stores/user/user.store';
import { HttpClient } from '@angular/common/http';
import { Message } from '../../models/message';

const socketMessageTypes = {
    SEND_MESSAGE: 'sendMessage',
    RECEIVE_MESSAGE: 'receiveMessage',
    UPDATE_ONLINE_USERS: 'updateOnlineUsers',
};

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly httpClient = inject(HttpClient);
    private readonly cookieService = inject(CookieService);
    private readonly userStore = inject(UserStore);

    private readonly chatUrl = import.meta.env.NG_APP_WS_URL + '/chats';
    private readonly messagesUrl = import.meta.env.NG_APP_API_URL + '/messages';

    private connection!: HubConnection;

    constructor() {
        if (isPlatformServer(this.platformId)) {
            return;
        }

        this.connection = new HubConnectionBuilder()
            .withUrl(this.chatUrl, {
                accessTokenFactory: () => {
                    return this.cookieService.get(AUTH_KEY) ?? '';
                },
                transport: HttpTransportType.WebSockets,
                skipNegotiation: true,
            })
            .withAutomaticReconnect()
            .build();

        this.connection
            .start()
            .then(() => {
                console.log('Conexão iniciada com WebSocket!');

                this.connection.on(
                    socketMessageTypes.RECEIVE_MESSAGE,
                    console.log
                );

                this.connection.on(
                    socketMessageTypes.UPDATE_ONLINE_USERS,
                    (users) => {
                        this.userStore.setLoggedInUsers(users);
                    }
                );
            })
            .catch((err) =>
                console.error('Erro ao conectar:', this.chatUrl, err)
            );
    }

    getAllByChat(chatId: string) {
        return this.httpClient.get<Message[]>(this.messagesUrl + `/${chatId}`);
    }

    sendMessage(chatId: string, content: string) {
        return this.connection.send(socketMessageTypes.SEND_MESSAGE, {
            chatId,
            content,
        });
    }
}
