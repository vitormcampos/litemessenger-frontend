import { isPlatformServer } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
    HubConnectionBuilder,
    HubConnection,
    HttpTransportType,
} from '@microsoft/signalr';
import { CookieService } from '../cookie/cookie.service';
import { AUTH_KEY } from '../../interceptors/auth.interceptor';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly cookieService = inject(CookieService);

    private readonly chatUrl = import.meta.env.NG_APP_WS_URL + '/chats';

    constructor() {
        if (isPlatformServer(this.platformId)) {
            return;
        }

        const connection = new HubConnectionBuilder()
            .withUrl(this.chatUrl, {
                accessTokenFactory: () => {
                    return this.cookieService.get(AUTH_KEY) ?? '';
                },
                transport: HttpTransportType.WebSockets,
                skipNegotiation: true,
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
