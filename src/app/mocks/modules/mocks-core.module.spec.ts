import { TestBed, waitForAsync } from '@angular/core/testing';

import { DnbhubMocksCoreModule } from './mocks-core.module';

describe('DnbhubMocksCoreModule', () => {
  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        imports: [DnbhubMocksCoreModule],
      }).compileComponents();
    }),
  );

  it('should be defined', () => {
    expect(DnbhubMocksCoreModule).toBeDefined();
  });
});
