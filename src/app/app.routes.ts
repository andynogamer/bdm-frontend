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
import { roleGuard } from './core/guards/role.guard';
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
        canActivate: [publicGuard] // <-- APLICADO AQUÍ
    },
    {
        path: 'users',
        component: Users,
        canActivate: [roleGuard(2)]
    },
    {
        path: 'admin-register',
        component: RegisterEmployees,
        canActivate: [roleGuard(2)]
    },
    {
        path:'home',
        component:Home,
        canActivate: [roleGuard(0)]
    },
    {
        path:'register-accidents',
        component: RegisterAccidents,
        canActivate: [roleGuard(1)]
    },
    {
        path:'profile',
        component: UserProfile,
        canActivate: [roleGuard(0)]
    },
    {
        path:'accident-detail/:id',
        component: AccidentDetail,
        canActivate: [roleGuard(0)]
    },
    {
        path: 'companies',
        component: Companies,
        canActivate: [roleGuard(2)]
    },
    {
        path: 'register-company',
        component: RegisterCompany,
        canActivate: [roleGuard(2)]
    },
    {
        path: 'policies',
        component: Policies,
        canActivate: [roleGuard(2)]
    },
    {
        path: 'register-policy',
        component: RegisterPolicy,
        canActivate: [roleGuard(2)]
    },
    {
        path: 'edit-company/:id',
        component: EditCompany,
        canActivate: [roleGuard(2)]
    },
    {
        path: 'edit-policy/:id',
        component: EditPolicy,
        canActivate: [roleGuard(2)]
    },
    
    // Ruta comodín por si escriben una URL que no existe
    {
        path: '**',
        redirectTo: 'home' 
    }
];