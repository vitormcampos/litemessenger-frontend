import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../stores/user/user.store';
import { OnlineUsersStore } from '../../stores/online-users/online-users.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChatService } from '../../services/chat/chat.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
    private readonly userStore = inject(UserStore);
    private readonly chatService = inject(ChatService);

    readonly currentUser = this.userStore.currentUser;
    readonly username = this.userStore.username;
    readonly onlineUsers = this.userStore.loggedInUsers;
}
