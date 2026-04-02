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
import { Subscription } from 'rxjs';
import { UserStore } from '../../stores/user/user.store';
import { User } from '../../models/user';
import { Chat, Message } from '../../models/message';
import { firstValueFrom, map } from 'rxjs';
import { CurrentChatStore } from '../../stores/current-chat/current-chat.store';
import { MessageService } from '../../services/message/message.service';
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
    private readonly messageService = inject(MessageService);
    private readonly chatService = inject(ChatService);
    private readonly userStore = inject(UserStore);
    private readonly currentChatStore = inject(CurrentChatStore);

    @ViewChild('messagesContainer')
    messagesContainer!: ElementRef<HTMLDivElement>;

    private messagesSubscription?: Subscription;

    chatId = toSignal(
        this.route.paramMap.pipe(map((params) => params.get('id')))
    );

    chat = signal<Chat | null>(null);

    otherUser = computed(() => {
        const chat = this.chat();
        const currentUserId = this.userStore.currentUser()?.id;
        if (!chat || !currentUserId) return null;

        return chat.users.find((p) => p.id !== currentUserId) || null;
    });

    messages = signal<Message[]>([]);
    newMessage = signal('');
    isLoading = signal(false);

    private shouldScrollToBottom = true;

    readonly currentUser = this.userStore.currentUser;

    async ngOnInit() {
        if (isPlatformServer(this.platformId)) {
            return;
        }

        const chatId = this.chatId();
        if (chatId) {
            const chat = await firstValueFrom(this.chatService.getChat(chatId));
            this.chat.set(chat);
            this.currentChatStore.setCurrentChat(chat);

            const loadedMessages = await firstValueFrom(
                this.chatService.getMessages(chatId)
            );
            this.messages.set(loadedMessages);
        }

        await this.messageService.connect();

        if (chatId) {
            await this.messageService.joinChat(chatId);
        }

        this.messagesSubscription = this.messageService
            .newMessages.subscribe((msg) => {
                const currentChatId = this.chatId();
                if (msg.chatId === currentChatId) {
                    this.messages.update((msgs) => [...msgs, msg]);
                    this.shouldScrollToBottom = true;
                }
            });
    }

    ngAfterViewChecked() {
        if (this.shouldScrollToBottom) {
            this.scrollToBottom();
            this.shouldScrollToBottom = false;
        }
    }

    async ngOnDestroy() {
        const chatId = this.chatId();
        if (chatId) {
            await this.messageService.leaveChat(chatId);
        }
        await this.messageService.disconnect();
        this.messagesSubscription?.unsubscribe();
    }

    async sendMessage() {
        const content = this.newMessage().trim();
        if (!content) return;

        await this.messageService.sendMessage(this.chatId() || '', content);
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

    formatTime(date: Date | string): string {
        return new Date(date).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    isFromCurrentUser(message: Message): boolean {
        return message.userId === this.currentUser()?.id;
    }

    private scrollToBottom() {
        if (this.messagesContainer) {
            const container = this.messagesContainer.nativeElement;
            container.scrollTop = container.scrollHeight;
        }
    }
}
