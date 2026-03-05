export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
}

export interface Chat {
    id: string;
    participants: string[];
    lastMessage?: Message;
    updatedAt: Date;
}
