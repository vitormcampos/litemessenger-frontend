import { Injectable } from '@angular/core';
import {
    HubConnectionBuilder,
    HubConnection,
    HttpTransportType,
} from '@microsoft/signalr';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private readonly chatUrl = import.meta.env.NG_APP_WS_URL + '/chats';

    constructor() {
        const token = localStorage.getItem('token');
        if (token) {
            const connection = new HubConnectionBuilder()
                .withUrl(this.chatUrl, {
                    accessTokenFactory: () => token,
                    transport: HttpTransportType.WebSockets,
                })
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
    }

    registerEvents(connection: HubConnection) {
        connection
            .send('sendMessage', 'ola mundo', 'ola mundo resposta')
            .then(console.log);
        connection.on('receiveMessage', console.log);
    }
}
