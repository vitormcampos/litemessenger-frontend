import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { tap } from 'rxjs';

import { NotificationsService } from '../../stores/notifications/notifications.service';

@Component({
    selector: 'app-notifications',
    imports: [AsyncPipe],
    templateUrl: './notifications.component.html',
    styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
    private readonly notificationService = inject(NotificationsService);

    notifications$ = this.notificationService.get().pipe(tap(console.log));
}
