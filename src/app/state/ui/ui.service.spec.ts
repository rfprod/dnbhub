import { async, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { getTestBedConfig, newTestBedMetadata } from 'src/app/mocks/utils/test-bed-config.mock';

import { UiService } from './ui.service';

describe('UiService', () => {
  let service: UiService;

  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({});
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  beforeEach(async(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(_ => {
        service = TestBed.inject(UiService);
      });
  }));

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
