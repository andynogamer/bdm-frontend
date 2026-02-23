import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { RegisterUsers } from './features/auth/register-users/register-users';

export const routes: Routes = [
    {
        path:'login',
        component: Login
    },
    {
        path: 'register-users',
        component: RegisterUsers
    }
];
