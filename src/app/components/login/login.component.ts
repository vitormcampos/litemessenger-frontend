import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { AuthService } from "../../services/auth/auth.service";

@Component({
	selector: "app-login",
	imports: [ReactiveFormsModule],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.css",
})
export class LoginComponent {
	private readonly formBuilder = inject(FormBuilder);
	private readonly authService = inject(AuthService);

	loginForm = this.formBuilder.group({
		email: ["", Validators.required],
		password: ["", Validators.required],
	});

	submit() {
		if (this.loginForm.invalid) {
			console.warn("Form is invalid");
			return;
		}

		const { email, password } = this.loginForm.value;

		this.authService.login(email!, password!).subscribe({
			next: (response) => {
				alert("Login successful!");

				localStorage.setItem("token", response);
			},
			error: (error) => {
				console.error("Login failed", error);
			},
		});
	}
}
