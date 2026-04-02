import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chat, Message } from '../../models/message';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private readonly httpClient = inject(HttpClient);

    private readonly chatsUrl = import.meta.env.NG_APP_API_URL + '/chat';

    private readonly messages = new BehaviorSubject<Message[]>([]);

    getChat(chatId: string) {
        return this.httpClient.get<Chat>(this.chatsUrl + `/${chatId}`);
    }

    getMessages(chatId: string) {
        return this.httpClient.get<Message[]>(this.chatsUrl + `/${chatId}/messages`);
    }

    createChat(participantEmail: string) {
        return this.httpClient.post<Chat>(this.chatsUrl, {
            userEmail: participantEmail,
        });
    }

    getChats() {
        return this.httpClient.get<Chat[]>(this.chatsUrl);
    }

    getMessagesObservable() {
        return this.messages.asObservable();
    }

    updateMessages(messages: Message[]) {
        this.messages.next(messages);
    }

    addMessage(message: Message) {
        this.messages.next([...this.messages.value, message]);
    }
}
