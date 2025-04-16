import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LucideAngularModule, LogIn } from 'lucide-angular';

@Component({
    selector: 'app-nav',
    imports: [RouterModule, LucideAngularModule],
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.css',
})
export class NavComponent {
    LoginIcon = LogIn;
}
