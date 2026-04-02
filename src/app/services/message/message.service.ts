import { inject, Injectable } from '@angular/core';
import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
} from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { AUTH_KEY } from '../../interceptors/auth.interceptor';
import { Message } from '../../models/message';
import { CookieService } from '../cookie/cookie.service';

const socketMessageTypes = {
    SEND_MESSAGE: 'SendMessage',
    RECEIVE_MESSAGE: 'ReceiveMessage',
    JOIN_CHAT: 'JoinChat',
    LEAVE_CHAT: 'LeaveChat',
};

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    private readonly cookieService = inject(CookieService);

    private readonly messagesHubUrl =
        import.meta.env.NG_APP_WS_URL + '/messages';
    private connection!: HubConnection;

    private readonly newMessage$ = new Subject<Message>();

    get newMessages() {
        return this.newMessage$.asObservable();
    }

    async sendMessage(chatId: string, content: string) {
        await this.connection.send(
            socketMessageTypes.SEND_MESSAGE,
            chatId,
            content
        );
    }

    async joinChat(chatId: string) {
        await this.connection.send(socketMessageTypes.JOIN_CHAT, chatId);
    }

    async leaveChat(chatId: string) {
        await this.connection.send(socketMessageTypes.LEAVE_CHAT, chatId);
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
                this.newMessage$.next(message);
            }
        );
    }

    async disconnect() {
        if (this.connection) {
            await this.connection.stop();
        }
    }
}
