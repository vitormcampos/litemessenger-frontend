import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Notification } from '../../models/notification';

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    private notifications = new BehaviorSubject<Notification[]>([]);

    add(notification: Notification) {
        this.notifications.next([notification]);

        timer(5000).subscribe(() => {
            //this.notifications.next([]);
        });
    }

    get(): Observable<Notification[]> {
        return this.notifications.asObservable();
    }
}
