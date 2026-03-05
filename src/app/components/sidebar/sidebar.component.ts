import { CommonModule, isPlatformServer } from '@angular/common';
import {
    Component,
    inject,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { UserStore } from '../../stores/user/user.store';
import { CurrentChatStore } from '../../stores/current-chat/current-chat.store';
import { UserStatusService } from '../../services/user-status/user-status.service';
import { filter, map } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly userStatusService = inject(UserStatusService);
    private readonly userStore = inject(UserStore);
    private readonly currentChatStore = inject(CurrentChatStore);

    readonly currentChatId = this.currentChatStore.currentChatId;
    readonly currentUser = this.userStore.currentUser;
    readonly username = this.userStore.username;
    loggedInUsers = toSignal(
        this.userStatusService
            .getLoggedInUsers()
            .pipe(
                map((users) =>
                    users.filter((u) => u.id !== this.currentUser()?.id)
                )
            )
    );

    async ngOnInit(): Promise<void> {
        if (isPlatformServer(this.platformId)) {
            return;
        }

        await this.userStatusService.connect();
    }
    async ngOnDestroy(): Promise<void> {
        await this.userStatusService.disconnect();
    }
}
