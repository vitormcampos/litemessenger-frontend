import { signal, computed, Injectable } from '@angular/core';
import { User } from '../../models/user';

@Injectable({ providedIn: 'root' })
export class UserStore {
    readonly currentUser = signal<User | null>(null);
    readonly loggedInUsers = signal<User[]>([]);

    readonly isLoggedIn = computed(() => this.currentUser() !== null);
    readonly username = computed(() => this.currentUser()?.name ?? '');

    setCurrentUser(user: User | null) {
        this.currentUser.set(user);
    }

    setLoggedInUsers(users: User[]) {
        const otherUsers = users.filter((u) => u.id !== this.currentUser()?.id);
        this.loggedInUsers.set([...otherUsers]);
    }

    logout() {
        this.currentUser.set(null);
    }
}
