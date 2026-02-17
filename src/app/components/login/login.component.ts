import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { CookieService } from '../../services/cookie/cookie.service';
import { userStore } from '../../stores/user/user.store';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(AuthService);
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
                this.cookieService.set('token', response);
                this.authService.getCurrentUser().subscribe({
                    next: (user) => {
                        userStore.setCurrentUser({
                            id: user.id,
                            username: user.name,
                            email: user.email,
                        });
                        this.router.navigate(['/social']);
                    },
                    error: () => {
                        this.router.navigate(['/social']);
                    },
                });
            },
            error: () => {
                alert('Credenciais inválidas. Tente novamente.');
            },
        });
    }
}
