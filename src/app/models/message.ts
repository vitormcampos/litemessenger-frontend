import { User } from './user';

export interface Message {
    id: string;
    chatId: string;
    userId: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
}

export interface Chat {
    id: string;
    users: User[];
    lastMessage?: Message;
    updatedAt: Date;
}
