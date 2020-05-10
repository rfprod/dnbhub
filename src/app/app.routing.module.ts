import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppAboutComponent } from 'src/app/components/app-about/app-about.component';
import { AppAdminComponent } from 'src/app/components/app-admin/app-admin.component';
import { AppBlogComponent } from 'src/app/components/app-blog/app-blog.component';
import { AppFreedownloadsComponent } from 'src/app/components/app-freedownloads/app-freedownloads.component';
import { AppIndexComponent } from 'src/app/components/app-index/app-index.component';
import { AppRepostsComponent } from 'src/app/components/app-reposts/app-reposts.component';
import { AppSinglesComponent } from 'src/app/components/app-singles/app-singles.component';
import { AppUserComponent } from 'src/app/components/app-user/app-user.component';
import { AuthenticatedGuard } from 'src/app/guards/authenticated/authenticated.guard';

export const APP_ROUTES: Routes = [
  { path: 'index', component: AppIndexComponent },
  { path: 'singles', component: AppSinglesComponent },
  { path: 'freedownloads', component: AppFreedownloadsComponent },
  { path: 'reposts', component: AppRepostsComponent },
  { path: 'blog', component: AppBlogComponent },
  { path: 'user', component: AppUserComponent, canActivate: [AuthenticatedGuard] },
  { path: 'admin', component: AppAdminComponent, canActivate: [AuthenticatedGuard] },
  { path: 'about', component: AppAboutComponent },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: '**', redirectTo: 'index' },
];

/**
 * Application routing module.
 */
@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
