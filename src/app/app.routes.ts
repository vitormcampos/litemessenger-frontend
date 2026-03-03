import { Routes } from '@angular/router';
import { SocialComponent } from './pages/social/social.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        canActivate: [authGuard],
        path: 'social',
        component: SocialComponent,
    },
    {
        canActivate: [authGuard],
        path: 'chat/:id',
        component: ChatComponent,
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
