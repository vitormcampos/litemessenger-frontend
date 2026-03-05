import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
} from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { AUTH_KEY } from '../../interceptors/auth.interceptor';
import { Chat, Message } from '../../models/message';
import { CookieService } from '../cookie/cookie.service';

const socketMessageTypes = {
    SEND_MESSAGE: 'sendMessage',
    RECEIVE_MESSAGE: 'receiveMessage',
};

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private readonly httpClient = inject(HttpClient);
    private readonly cookieService = inject(CookieService);

    private readonly messagesHubUrl =
        import.meta.env.NG_APP_WS_URL + '/messages';
    private readonly messagesUrl = import.meta.env.NG_APP_API_URL + '/messages';
    private readonly chatsUrl = import.meta.env.NG_APP_API_URL + '/chats';
    private connection!: HubConnection;

    private readonly messages = new BehaviorSubject<Message[]>([]);

    getChat(chatId: string) {
        return this.httpClient.get<Chat>(this.chatsUrl + `/${chatId}`);
    }

    getAllByChat(chatId: string) {
        return this.httpClient.get<Message[]>(this.messagesUrl + `/${chatId}`);
    }

    sendMessage(chatId: string, content: string) {
        this.messages.next([
            ...this.messages.value,
            { chatId, content } as Message,
        ]);

        this.connection.send(socketMessageTypes.SEND_MESSAGE, {
            chatId,
            content,
        });
    }

    getMessages() {
        return this.messages.asObservable();
    }

    async connect() {
        this.connection = new HubConnectionBuilder()
            .withUrl(this.messagesHubUrl, {
                accessTokenFactory: () => {
                    return this.cookieService.get(AUTH_KEY) ?? '';
                },
                transport: HttpTransportType.WebSockets,
                skipNegotiation: true,
            })
            .withAutomaticReconnect()
            .build();

        await this.connection.start();

        this.connection.on(
            socketMessageTypes.RECEIVE_MESSAGE,
            (message: Message) => {
                this.messages.next([...this.messages.value, message]);
            }
        );
    }

    async disconnect() {
        if (this.connection) {
            await this.connection.stop();
        }
    }
}
