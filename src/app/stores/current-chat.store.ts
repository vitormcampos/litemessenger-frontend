import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CurrentChatStore {
    readonly currentChatId = signal<string | null>(null);

    setCurrentChatId(chatId: string | null) {
        this.currentChatId.set(chatId);
    }
}
