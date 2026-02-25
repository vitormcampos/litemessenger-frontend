import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { CookieService } from '../../services/cookie/cookie.service';
import { UserStore } from '../../stores/user/user.store';
import { AUTH_KEY } from '../../interceptors/auth.interceptor';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly userStore = inject(UserStore);
    private readonly cookieService = inject(CookieService);
    private readonly router = inject(Router);

    loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
    });

    submit() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        const { email, password } = this.loginForm.value;

        this.authService.login(email!, password!).subscribe({
            next: (response) => {
                this.cookieService.set(AUTH_KEY, response);
                this.router.navigate(['/social']);
            },
            error: () => {
                alert('Credenciais inválidas. Tente novamente.');
            },
        });
    }
}
