import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DnbhubMaterialModule } from '../../modules/material/custom-material.module';
import { DnbhubAdminEmailsComponent } from './admin-emails.component';

describe('DnbhubAdminEmailsComponent', () => {
  let component: DnbhubAdminEmailsComponent;
  let fixture: ComponentFixture<DnbhubAdminEmailsComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        imports: [DnbhubMaterialModule],
        declarations: [DnbhubAdminEmailsComponent],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DnbhubAdminEmailsComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
