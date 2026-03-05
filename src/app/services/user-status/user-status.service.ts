import { inject, Injectable } from '@angular/core';
import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
} from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { AUTH_KEY } from '../../interceptors/auth.interceptor';
import { User } from '../../models/user';
import { CookieService } from '../cookie/cookie.service';

const socketStatusTypes = {
    UPDATE_ONLINE_USERS: 'updateOnlineUsers',
};

@Injectable({
    providedIn: 'root',
})
export class UserStatusService {
    private readonly cookieService = inject(CookieService);

    private readonly statusUrl = import.meta.env.NG_APP_WS_URL + '/user-status';
    private connection!: HubConnection;

    private readonly loggedInUsers = new BehaviorSubject<User[]>([]);

    getLoggedInUsers(): Observable<User[]> {
        return this.loggedInUsers.asObservable();
    }

    async connect() {
        this.connection = new HubConnectionBuilder()
            .withUrl(this.statusUrl, {
                accessTokenFactory: () => {
                    return this.cookieService.get(AUTH_KEY) ?? '';
                },
                transport: HttpTransportType.WebSockets,
                skipNegotiation: true,
            })
            .withAutomaticReconnect()
            .build();

        await this.connection.start();

        this.connection.on(socketStatusTypes.UPDATE_ONLINE_USERS, (users) => {
            this.loggedInUsers.next(users);
        });
    }

    async disconnect() {
        if (this.connection) {
            await this.connection.stop();
        }
    }
}
