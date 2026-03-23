import { Injectable, signal } from '@angular/core';
import { Chat } from '../../models/message';

@Injectable({
    providedIn: 'root',
})
export class CurrentChatStore {
    readonly currentChatId = signal<string | null>(null);
    readonly currentChat = signal<Chat | null>(null);

    setCurrentChatId(chatId: string | null) {
        this.currentChatId.set(chatId);
    }

    setCurrentChat(chat: Chat) {
        this.currentChat.set(chat);
    }
}
