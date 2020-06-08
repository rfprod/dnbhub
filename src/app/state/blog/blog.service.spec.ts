import { async, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { getTestBedConfig, newTestBedMetadata } from 'src/app/mocks/utils/test-bed-config.mock';

import { DnbhubBlogService } from './blog.service';

describe('DnbhubBlogService', () => {
  let service: DnbhubBlogService;

  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({});
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  beforeEach(async(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(() => {
        service = TestBed.inject(DnbhubBlogService);
      });
  }));

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
