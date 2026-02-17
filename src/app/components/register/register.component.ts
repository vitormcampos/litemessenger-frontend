import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationsService } from '../../stores/notifications/notifications.service';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
})
export class RegisterComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly notificationService = inject(NotificationsService);
    private readonly router = inject(Router);

    registerForm = this.formBuilder.group(
        {
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
        },
        {
            validators: this.passwordMatchValidator,
        }
    );

    passwordMatchValidator(form: any) {
        return form.get('password')?.value ===
            form.get('confirmPassword')?.value
            ? null
            : { mismatch: true };
    }

    submit() {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        const { username, email, password, confirmPassword } =
            this.registerForm.value;

        this.authService
            .register(username!, email!, password!, confirmPassword!)
            .subscribe({
                next: () => {
                    this.notificationService.add({
                        type: 'success',
                        message: 'Cadastro realizado com sucesso!',
                    });
                    this.router.navigate(['/login']);
                },
                error: () => {
                    this.notificationService.add({
                        type: 'danger',
                        message: 'Erro ao realizar o cadastro!',
                    });
                },
            });
    }
}
