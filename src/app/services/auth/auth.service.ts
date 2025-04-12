import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private readonly httpClient = inject(HttpClient);

	private readonly authUrl = import.meta.env.NG_APP_API_URL + "/account";

	login(email: string, password: string) {
		return this.httpClient.post<string>(
			`${this.authUrl}/login`,
			{ email, password },
			{
				responseType: "text" as "json",
			},
		);
	}

	register(
		username: string,
		email: string,
		password: string,
		confirmPassword: string,
	) {
		return this.httpClient.post<string>(`${this.authUrl}/register`, {
			username,
			email,
			password,
			confirmPassword,
		});
	}
}
