import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppIndexComponent } from './components/app-index.component';
import { AppSinglesComponent } from './components/app-singles.component';
import { AppFreedownloadsComponent } from './components/app-freedownloads.component';
import { AppRepostsComponent } from './components/app-reposts.component';
import { AppBlogComponent } from './components/app-blog.component';
import { AppAboutComponent } from './components/app-about.component';
import { AppUserComponent } from './components/app-user.component';
import { AppAdminComponent } from './components/app-admin.component';

import { AnonymousGuard } from './services/anonymous-guard.service';

export const APP_ROUTES: Routes = [
  { path: 'index', component: AppIndexComponent },
  { path: 'singles', component: AppSinglesComponent },
  { path: 'freedownloads', component: AppFreedownloadsComponent },
  { path: 'reposts', component: AppRepostsComponent },
  { path: 'blog', component: AppBlogComponent },
  { path: 'user', component: AppUserComponent, canActivate: [AnonymousGuard] },
  { path: 'admin', component: AppAdminComponent, canActivate: [AnonymousGuard] },
  { path: 'about', component: AppAboutComponent },
  { path: '', redirectTo: 'index', pathMatch: 'full'},
  { path: '**', redirectTo: 'index' }
];

/**
 * Application routing module.
 */
@NgModule({
  imports: [ RouterModule.forRoot(APP_ROUTES) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
