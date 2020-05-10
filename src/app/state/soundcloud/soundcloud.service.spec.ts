import { async, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { getTestBedConfig, newTestBedMetadata } from 'src/app/mocks/utils/test-bed-config.mock';

import { SoundcloudService } from './soundcloud.service';

describe('SoundcloudService', () => {
  let service: SoundcloudService;

  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({});
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  beforeEach(async(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(_ => {
        service = TestBed.inject(SoundcloudService);
      });
  }));

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
