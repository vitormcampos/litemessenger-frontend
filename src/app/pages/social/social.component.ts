import { Component } from '@angular/core';
import { NavComponent } from '../../components/nav/nav.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-social',
    standalone: true,
    imports: [NavComponent, SidebarComponent],
    templateUrl: './social.component.html',
    styleUrl: './social.component.css',
})
export class SocialComponent {}
