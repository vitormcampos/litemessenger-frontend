import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CookieService {
    private readonly platformId = inject(PLATFORM_ID);

    get(name: string): string | null {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }

        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }

        return null;
    }

    set(
        name: string,
        value: string,
        days: number = 7,
        path: string = '/'
    ): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        const expiresStr = `expires=${expires.toUTCString()}`;

        document.cookie = `${name}=${encodeURIComponent(value)};${expiresStr};path=${path};SameSite=Lax`;
    }

    remove(name: string, path: string = '/'): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
    }
}
