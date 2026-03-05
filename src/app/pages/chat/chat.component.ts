import {
    Component,
    inject,
    signal,
    computed,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef,
    AfterViewChecked,
    PLATFORM_ID,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformServer } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStore } from '../../stores/user/user.store';
import { User } from '../../models/user';
import { Chat, Message } from '../../models/message';
import { firstValueFrom, map, tap } from 'rxjs';
import { CurrentChatStore } from '../../stores/current-chat/current-chat.store';
import { ChatService } from '../../services/chat/chat.service';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
    private readonly route = inject(ActivatedRoute);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly chatService = inject(ChatService);
    private readonly userStore = inject(UserStore);
    private readonly currentChatStore = inject(CurrentChatStore);

    @ViewChild('messagesContainer')
    messagesContainer!: ElementRef<HTMLDivElement>;

    chatId = toSignal(
        this.route.paramMap.pipe(
            map((params) => params.get('id')),
            tap((chatId) => {
                this.currentChatStore.setCurrentChatId(chatId);
            })
        )
    );

    chat = computed(async () => {
        const chatId = this.chatId();
        if (!chatId) return null;

        const chat = await firstValueFrom(this.chatService.getChat(chatId));
        return chat;
    });

    otherUser = computed(() => {
        const chat = this.chat();
        const currentUserId = this.userStore.currentUser()?.id;
        if (!chat || !currentUserId) return null;

        return { id: '1', name: 'John Doe' }; // chat.participants.find((p) => p.id !== currentUserId) || null;
    });

    messages = toSignal(this.chatService.getMessages());
    newMessage = signal('');
    isLoading = signal(false);

    private shouldScrollToBottom = false;

    readonly currentUser = this.userStore.currentUser;

    async ngOnInit() {
        if (isPlatformServer(this.platformId)) {
            return;
        }

        await this.chatService.connect();
    }

    ngAfterViewChecked() {
        if (this.shouldScrollToBottom) {
            this.scrollToBottom();
            this.shouldScrollToBottom = false;
        }
    }

    async ngOnDestroy() {
        await this.chatService.disconnect();
    }

    sendMessage() {
        const content = this.newMessage().trim();
        if (!content) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            chatId: this.chatId() || '',
            senderId: this.currentUser()?.id || '',
            receiverId: this.otherUser()?.id || '',
            content: content,
            timestamp: new Date(),
            isRead: false,
        };

        this.chatService.sendMessage(newMsg.chatId, newMsg.content);
        this.newMessage.set('');
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    getInitials(user: User | null): string {
        if (!user?.name) return '?';
        return user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    formatTime(date: Date): string {
        return new Date(date).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    isFromCurrentUser(message: Message): boolean {
        return message.senderId === this.currentUser()?.id;
    }

    private scrollToBottom() {
        if (this.messagesContainer) {
            const container = this.messagesContainer.nativeElement;
            container.scrollTop = container.scrollHeight;
        }
    }
}
