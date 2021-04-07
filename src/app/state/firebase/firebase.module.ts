import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { DnbhubFirebaseState } from './firebase.store';

@NgModule({
  imports: [NgxsModule.forFeature([DnbhubFirebaseState])],
})
export class DnbhubFirebaseStoreModule {}
