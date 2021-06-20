import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';

import { getTestBedConfig, newTestBedMetadata } from '../../mocks/utils/test-bed-config.mock';
import { DnbhubSoundcloudService } from './soundcloud.service';

describe('DnbhubSoundcloudService', () => {
  let service: DnbhubSoundcloudService;

  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({});
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule(testBedConfig)
        .compileComponents()
        .then(() => {
          service = TestBed.inject(DnbhubSoundcloudService);
        });
    }),
  );

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
