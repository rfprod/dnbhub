import { async, TestBed } from '@angular/core/testing';

import { DnbhubMocksCoreModule } from './mocks-core.module';

describe('DnbhubMocksCoreModule', () => {
  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      imports: [DnbhubMocksCoreModule],
    }).compileComponents();
  }));

  it('should be defined', () => {
    expect(DnbhubMocksCoreModule).toBeDefined();
  });
});
