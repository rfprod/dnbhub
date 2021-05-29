import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { DnbhubAboutComponent } from './components/about/about.component';
import { DnbhubAdminComponent } from './components/admin/admin.component';
import { DnbhubBlogComponent } from './components/blog/blog.component';
import { DnbhubIndexComponent } from './components/index/index.component';
import { DnbhubPlaylistsComponent } from './components/playlists/playlists.component';
import { DnbhubUserComponent } from './components/user/user.component';
import { DnbhubAuthenticatedGuard } from './guards/authenticated/authenticated.guard';

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

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES, <ExtraOptions>{
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class DnbhubRoutingModule {}
