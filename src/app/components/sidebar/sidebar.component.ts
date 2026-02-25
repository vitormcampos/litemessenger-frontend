import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../stores/user/user.store';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
    private readonly userStore = inject(UserStore);

    readonly currentUser = this.userStore.currentUser;
    readonly username = this.userStore.username;
    readonly loggedInUsers = this.userStore.loggedInUsers;
}
