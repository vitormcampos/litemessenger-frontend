import { CommonModule, isPlatformServer } from '@angular/common';
import {
    Component,
    inject,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { UserStore } from '../../stores/user/user.store';
import { CurrentChatStore } from '../../stores/current-chat/current-chat.store';
import { UserStatusService } from '../../services/user-status/user-status.service';
import { filter, interval, map, switchMap, timer } from 'rxjs';
import { ChatService } from '../../services/chat/chat.service';
import { Chat } from '../../models/message';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly router = inject(Router);
    private readonly userStore = inject(UserStore);
    private readonly currentChatStore = inject(CurrentChatStore);
    private readonly chatService = inject(ChatService);
    private readonly userStatusService = inject(UserStatusService);

    readonly currentChatId = this.currentChatStore.currentChatId;
    readonly currentUser = this.userStore.currentUser;
    readonly username = this.userStore.username;

    readonly chats = signal<Chat[]>([]);

    ngOnInit() {
        if (isPlatformServer(this.platformId)) {
            return;
        }

        timer(0, 10000)
            .pipe(
                filter(() => this.userStore.isLoggedIn()),
                switchMap(() => this.chatService.getChats())
            )
            .subscribe({
                next: (chats) => {
                    this.chats.set(chats);
                },
                error: (err) => {
                    console.error('Failed to fetch chats:', err);
                },
            });

        this.userStatusService.connect().catch((err) => {
            console.error('Failed to connect to user status service:', err);
        });
    }

    addContact() {
        const newContactEmail = prompt(
            'Enter the email of the contact you want to add:'
        );
        if (newContactEmail) {
            this.chatService.createChat(newContactEmail).subscribe({
                next: async (chat) => {
                    await this.router.navigate(['/chat', chat.id]);
                },
                error: (err) => {
                    console.error('Failed to create chat:', err);
                    alert('Failed to create chat. Please try again.');
                },
            });
        }
    }
}
