import { async, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { getTestBedConfig, newTestBedMetadata } from 'src/app/mocks/utils/test-bed-config.mock';

import { DnbhubAboutService } from './about.service';

describe('DnbhubAboutService', () => {
  let service: DnbhubAboutService;

  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({});
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  beforeEach(async(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(() => {
        service = TestBed.inject(DnbhubAboutService);
      });
  }));

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
