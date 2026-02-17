import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../../models/notification';

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    private notifications = new BehaviorSubject<Notification[]>([]);

    add(notification: Notification): string {
        const id = crypto.randomUUID();
        const newNotification = { ...notification, id };
        
        const current = this.notifications.value;
        this.notifications.next([...current, newNotification]);

        setTimeout(() => {
            this.remove(id);
        }, 5000);

        return id;
    }

    remove(id: string): void {
        const current = this.notifications.value;
        this.notifications.next(current.filter(n => n.id !== id));
    }

    get(): Observable<Notification[]> {
        return this.notifications.asObservable();
    }
}
