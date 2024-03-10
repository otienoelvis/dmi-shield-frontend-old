import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './services/authentication.service';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/authentication',
        pathMatch: 'full',
      }, {
        path: 'dashboard',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      }, {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.module').then(
            (m) => m.UicomponentsModule
          ),
      }, {
        path: 'extra',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/extra/extra.module').then((m) => m.ExtraModule),
      }, {
        path: 'analytics',
        loadChildren: () =>
          import('./pages/analytics/analytics.module').then((m) => m.AnalyticsModule),
      }, {
        path: 'settings',
        canActivate: [AuthGuard], data: { roles: [1, 2] },
        loadChildren: () =>
          import('./pages/settings/settings.module').then((m) => m.SettingsModule),
      }, {
        path: 'users',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/users/users.module').then((m) => m.UsersModule),
      }
    ]
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
