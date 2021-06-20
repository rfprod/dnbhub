import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';

import { getTestBedConfig, newTestBedMetadata } from '../../mocks/utils/test-bed-config.mock';
import { DnbhubBlogService } from './blog.service';
import { DnbhubBlogApiService } from './blog-api.service';

describe('DnbhubBlogService', () => {
  let service: DnbhubBlogService;

  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({
    providers: [
      {
        provide: DnbhubBlogApiService,
        useValue: {
          getPosts$: of([]),
        },
      },
      {
        provide: DnbhubBlogService,
        useFactory: (store: Store, api: DnbhubBlogApiService) => new DnbhubBlogService(store, api),
        deps: [Store, DnbhubBlogApiService],
      },
    ],
  });
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule(testBedConfig)
        .compileComponents()
        .then(() => {
          service = TestBed.inject(DnbhubBlogService);
        });
    }),
  );

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
