import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DnbhubMaterialModule } from '../../modules/material/custom-material.module';
import { DnbhubAdminBrandsComponent } from './admin-brands.component';

describe('DnbhubAdminBrandsComponent', () => {
  let component: DnbhubAdminBrandsComponent;
  let fixture: ComponentFixture<DnbhubAdminBrandsComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        imports: [DnbhubMaterialModule],
        declarations: [DnbhubAdminBrandsComponent],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DnbhubAdminBrandsComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
