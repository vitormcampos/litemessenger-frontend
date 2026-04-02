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
    SEND_MESSAGE: 'SendMessage',
    RECEIVE_MESSAGE: 'ReceiveMessage',
};

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    private readonly cookieService = inject(CookieService);

    private readonly messagesHubUrl =
        import.meta.env.NG_APP_WS_URL + '/messages';
    private connection!: HubConnection;

    private readonly messages = new BehaviorSubject<Message[]>([]);

    async sendMessage(chatId: string, content: string) {
        await this.connection.send(socketMessageTypes.SEND_MESSAGE, {
            chatId,
            content,
        });
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
