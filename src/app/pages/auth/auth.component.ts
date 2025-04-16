import { Component } from '@angular/core';
import { LoginComponent } from '../../components/login/login.component';
import { RegisterComponent } from '../../components/register/register.component';

@Component({
    selector: 'app-auth',
    imports: [LoginComponent, RegisterComponent],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.css',
})
export class AuthComponent {}
