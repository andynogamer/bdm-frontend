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
import { Companies } from './admin/companies/companies';
import { RegisterCompany } from './admin/register-company/register-company';
import { Policies } from './features/policies/policies';
import { RegisterPolicy } from './features/register-policy/register-policy';
import { EditCompany } from './admin/edit-company/edit-company';
import { EditPolicy } from './features/edit-policy/edit-policy';

// IMPORTAMOS NUESTROS GUARDIANES
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
    // --- RUTAS PÚBLICAS (Solo si NO estás logueado) ---
    {
        path: '',
        component: Login,
        canActivate: [publicGuard] // <-- APLICADO AQUÍ
    },
    {
        path:'login',
        component: Login,
        canActivate: [publicGuard] // <-- APLICADO AQUÍ
    },
    
    // --- RUTAS PRIVADAS (Solo si SÍ estás logueado) ---
    {
        path: 'register-users',
        component: RegisterUsers,
        canActivate: [authGuard] // <-- APLICADO AQUÍ
    },
    {
        path: 'users',
        component: Users,
        canActivate: [authGuard]
    },
    {
        path: 'admin-register',
        component: RegisterEmployees,
        canActivate: [authGuard]
    },
    {
        path:'home',
        component:Home,
        canActivate: [authGuard]
    },
    {
        path:'register-accidents',
        component: RegisterAccidents,
        canActivate: [authGuard]
    },
    {
        path:'profile',
        component: UserProfile,
        canActivate: [authGuard]
    },
    {
        path:'accident-detail/:id',
        component: AccidentDetail,
        canActivate: [authGuard]
    },
    {
        path: 'companies',
        component: Companies,
        canActivate: [authGuard]
    },
    {
        path: 'register-company',
        component: RegisterCompany,
        canActivate: [authGuard]
    },
    {
        path: 'policies',
        component: Policies,
        canActivate: [authGuard]
    },
    {
        path: 'register-policy',
        component: RegisterPolicy,
        canActivate: [authGuard]
    },
    {
        path: 'edit-company/:id',
        component: EditCompany,
        canActivate: [authGuard]
    },
    {
        path: 'edit-policy/:id',
        component: EditPolicy,
        canActivate: [authGuard]
    },
    
    // Ruta comodín por si escriben una URL que no existe
    {
        path: '**',
        redirectTo: 'home' 
    }
];