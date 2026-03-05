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
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStore } from '../../stores/user/user.store';
import { User } from '../../models/user';
import { Message } from '../../models/message';
import { map, tap } from 'rxjs';
import { CurrentChatStore } from '../../stores/current-chat.store';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
    private readonly route = inject(ActivatedRoute);
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

    messages = signal<Message[]>([]);
    newMessage = signal('');
    isLoading = signal(true);

    private shouldScrollToBottom = false;

    readonly currentUser = this.userStore.currentUser;

    readonly otherUser = computed(() => {
        const chatIdValue = this.chatId();
        const users = this.userStore.loggedInUsers();
        return users.find((u) => u.id === chatIdValue) || null;
    });

    ngOnInit() {
        this.loadMessages();
    }

    ngAfterViewChecked() {
        if (this.shouldScrollToBottom) {
            this.scrollToBottom();
            this.shouldScrollToBottom = false;
        }
    }

    ngOnDestroy() {}

    private loadMessages() {
        this.isLoading.set(true);

        setTimeout(() => {
            this.isLoading.set(false);
            this.shouldScrollToBottom = true;
        }, 300);
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

        this.messages.update((msgs) => [...msgs, newMsg]);
        this.newMessage.set('');
        this.shouldScrollToBottom = true;
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
