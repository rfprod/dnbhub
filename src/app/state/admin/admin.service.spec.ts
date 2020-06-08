import { async, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { getTestBedConfig, newTestBedMetadata } from 'src/app/mocks/utils/test-bed-config.mock';

import { DnbhubAdminService } from './admin.service';

describe('DnbhubAdminService', () => {
  let service: DnbhubAdminService;

  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({});
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  beforeEach(async(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(() => {
        service = TestBed.inject(DnbhubAdminService);
      });
  }));

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
