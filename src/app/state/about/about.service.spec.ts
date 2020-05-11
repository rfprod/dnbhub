import { async, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { getTestBedConfig, newTestBedMetadata } from 'src/app/mocks/utils/test-bed-config.mock';

import { AboutService } from './about.service';

describe('AboutService', () => {
  let service: AboutService;

  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({});
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  beforeEach(async(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(_ => {
        service = TestBed.inject(AboutService);
      });
  }));

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
