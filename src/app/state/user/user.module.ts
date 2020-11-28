import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { DnbhubUserState } from './user.store';

@NgModule({
  imports: [NgxsModule.forFeature([DnbhubUserState])],
})
export class DnbhubUserStoreModule {}
