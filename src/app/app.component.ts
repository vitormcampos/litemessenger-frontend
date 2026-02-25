import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ChatService } from './services/chat/chat.service';
import { AuthService } from './services/auth/auth.service';
import { UserStore } from './stores/user/user.store';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NotificationsComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {}
