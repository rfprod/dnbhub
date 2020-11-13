import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DnbhubAboutComponent } from 'src/app/components/about/about.component';
import { DnbhubAdminComponent } from 'src/app/components/admin/admin.component';
import { DnbhubBlogComponent } from 'src/app/components/blog/blog.component';
import { DnbhubIndexComponent } from 'src/app/components/index/index.component';
import { DnbhubPlaylistsComponent } from 'src/app/components/playlists/playlists.component';
import { DnbhubUserComponent } from 'src/app/components/user/user.component';
import { DnbhubAuthenticatedGuard } from 'src/app/guards/authenticated/authenticated.guard';

export const APP_ROUTES: Routes = [
  { path: 'index', component: DnbhubIndexComponent },
  { path: 'playlists', component: DnbhubPlaylistsComponent },
  { path: 'blog', component: DnbhubBlogComponent },
  { path: 'user', component: DnbhubUserComponent, canActivate: [DnbhubAuthenticatedGuard] },
  { path: 'admin', component: DnbhubAdminComponent, canActivate: [DnbhubAuthenticatedGuard] },
  { path: 'about', component: DnbhubAboutComponent },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: '**', redirectTo: 'index' },
];

/**
 * Application routing module.
 */
@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class DnbhubRoutingModule {}
