import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';

import { getTestBedConfig, newTestBedMetadata } from '../../mocks/utils/test-bed-config.mock';
import { DnbhubUiService } from './ui.service';

describe('DnbhubUiService', () => {
  let service: DnbhubUiService;

  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({});
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule(testBedConfig)
        .compileComponents()
        .then(() => {
          service = TestBed.inject(DnbhubUiService);
        });
    }),
  );

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
