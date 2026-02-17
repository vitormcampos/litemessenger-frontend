import { signal, computed } from '@angular/core';
import { User } from '../../models/user';

class UserStore {
    readonly currentUser = signal<User | null>(null);
    readonly loggedInUsers = signal<User[]>([]);

    readonly isLoggedIn = computed(() => this.currentUser() !== null);
    readonly username = computed(() => this.currentUser()?.username ?? '');

    setCurrentUser(user: User | null) {
        this.currentUser.set(user);
    }

    setLoggedInUsers(users: User[]) {
        this.loggedInUsers.set(users);
    }

    addLoggedInUser(user: User) {
        this.loggedInUsers.update((users) => [...users, user]);
    }

    removeLoggedInUser(userId: string) {
        this.loggedInUsers.update((users) =>
            users.filter((u) => u.id !== userId)
        );
    }

    logout() {
        this.currentUser.set(null);
    }
}

export const userStore = new UserStore();
