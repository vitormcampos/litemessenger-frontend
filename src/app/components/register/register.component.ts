import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationsService } from '../../stores/notifications/notifications.service';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
})
export class RegisterComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly notificationService = inject(NotificationsService);

    registerForm = this.formBuilder.group(
        {
            username: ['', [Validators.required]],
            email: ['', Validators.required, Validators.email],
            password: ['', Validators.required],
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
            console.warn('Form is invalid', this.registerForm.errors);
            return;
        }

        const { username, email, password, confirmPassword } =
            this.registerForm.value;

        this.authService
            .register(username!, email!, password!, confirmPassword!)
            .subscribe({
                next: (response) => {
                    this.notificationService.add({
                        type: 'success',
                        message: 'Cadastro realizado com sucesso!',
                    });
                },
                error: (error) => {
                    this.notificationService.add({
                        type: 'danger',
                        message: 'Erro ao realizar o cadastro!',
                    });
                },
            });
    }
}
