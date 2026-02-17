import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userStore } from '../../stores/user/user.store';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
    readonly currentUser = userStore.currentUser;
    readonly username = userStore.username;
    readonly loggedInUsers = userStore.loggedInUsers;
}
