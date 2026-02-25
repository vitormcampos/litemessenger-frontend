import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AuthService } from '../../services/auth/auth.service';
import { ChatService } from '../../services/chat/chat.service';
import { UserStore } from '../../stores/user/user.store';

@Component({
    selector: 'app-social',
    standalone: true,
    imports: [SidebarComponent],
    templateUrl: './social.component.html',
    styleUrl: './social.component.css',
})
export class SocialComponent implements OnInit {
    private readonly chatService = inject(ChatService);
    private readonly authService = inject(AuthService);
    private readonly userStore = inject(UserStore);

    ngOnInit() {
        this.authService.getCurrentUser().subscribe({
            next: (user) => {
                this.userStore.setCurrentUser({
                    id: user.id,
                    username: user.name,
                    email: user.email,
                });
            },
            error: () => {},
        });
    }
}
