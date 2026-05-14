import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { RegisterUsers } from './features/auth/register-users/register-users';
import { Header } from './shared/header/header';
import { Users } from './admin/users/users';
import { RegisterEmployees } from './admin/register-employees/register-employees';
import { Home } from './features/home/home';
import { RegisterAccidents } from './features/register-accidents/register-accidents';
import { UserProfile } from './features/user-profile/user-profile';
import { AccidentDetail } from './features/accident-detail/accident-detail';

export const routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path:'login',
        component: Login
    },
    {
        path: 'register-users',
        component: RegisterUsers
    },
    {
        path: 'users',
        component: Users
    },
    {
        path: 'admin-register',
        component: RegisterEmployees
    },
    {
        path:'home',
        component:Home
    },
    {
        path:'register-accidents',
        component: RegisterAccidents
    },
    {
        path:'profile',
        component: UserProfile
    },
    {
        path:'accident-detail',
        component: AccidentDetail
    }
];
