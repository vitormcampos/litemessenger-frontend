import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
    HubConnectionBuilder,
    HubConnection,
    HttpTransportType,
} from '@microsoft/signalr';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private readonly platformId = inject(PLATFORM_ID);

    private readonly chatUrl = import.meta.env.NG_APP_WS_URL + '/chats';

    constructor() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const connection = new HubConnectionBuilder()
            .withUrl(this.chatUrl, {
                accessTokenFactory: () => {
                    return localStorage.getItem('token') ?? '';
                },
                transport: HttpTransportType.WebSockets,
            })
            .configureLogging('debug')
            .withAutomaticReconnect()
            .build();

        connection
            .start()
            .then(() => {
                console.log('Conexão iniciada com WebSocket!');

                this.registerEvents(connection);
            })
            .catch((err) =>
                console.error('Erro ao conectar:', this.chatUrl, err)
            );
    }

    registerEvents(connection: HubConnection) {
        connection
            .send('sendMessage', 'ola mundo', 'ola mundo resposta')
            .then(console.log);
        connection.on('receiveMessage', console.log);
    }
}
