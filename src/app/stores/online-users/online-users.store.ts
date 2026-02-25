import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
    providedIn: 'root',
})
export class OnlineUsersStore {
    private onlineUsers = new BehaviorSubject<User[]>([]);

    getOnlineUsers() {
        return this.onlineUsers.asObservable();
    }

    setOnlineUsers(users: User[]) {
        this.onlineUsers.next(users);
    }
}
