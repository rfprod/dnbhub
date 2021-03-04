import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DnbhubMaterialModule } from '../../modules/material/custom-material.module';
import { DnbhubUserPlaylistActionsComponent } from './user-playlist-actions.component';

describe('DnbhubUserPlaylistActionsComponent', () => {
  let component: DnbhubUserPlaylistActionsComponent;
  let fixture: ComponentFixture<DnbhubUserPlaylistActionsComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        imports: [DnbhubMaterialModule],
        declarations: [DnbhubUserPlaylistActionsComponent],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DnbhubUserPlaylistActionsComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
