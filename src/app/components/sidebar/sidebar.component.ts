import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, tap } from 'rxjs';
import { ChatService } from '../../services/chat/chat.service';
import { UserStore } from '../../stores/user/user.store';
import { CurrentChatStore } from '../../stores/current-chat.store';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
    private readonly userStore = inject(UserStore);
    private readonly currentChatStore = inject(CurrentChatStore);
    private readonly chatService = inject(ChatService);

    readonly currentChatId = this.currentChatStore.currentChatId;

    readonly currentUser = this.userStore.currentUser;
    readonly username = this.userStore.username;
    readonly onlineUsers = this.userStore.loggedInUsers;
}
