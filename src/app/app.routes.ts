import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';
import { GuideComponent } from './pages/guide/guide.component';
import { ProjectComponent } from './pages/project/project.component';
import { CreditsComponent } from './pages/credits/credits.component';
import { AccountComponent } from './pages/account/account.component';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { 
        path: 'home',
        component: HomeComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            }
        ]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'vehicles',
                component: VehiclesComponent
            },
            {
                path: 'guide',
                component: GuideComponent
            },
            {
                path: 'project',
                component: ProjectComponent
            },
            {
                path: 'credits',
                component: CreditsComponent
            },
            {
                path: 'account',
                component: AccountComponent
            }
        ]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    // { path: '**', redirectTo: 'home' }
];
