import { async, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';

import { DnbhubStoreAction } from './dnbhub-store.actions';
import { DnbhubStoreState } from './dnbhub-store.state';

describe('DnbhubStore actions', () => {
  let store: Store;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([DnbhubStoreState])],
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  it('should create an action and add an item', () => {
    store.dispatch(
      new DnbhubStoreAction({
        scrollTopValue: 1,
      }),
    );
    store
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .select(state => state.dnbhubStore)
      .subscribe((items: string[]) => {
        expect(items).toEqual(
          jasmine.objectContaining({
            previousScrollTopValue: 1,
          }),
        );
      });
  });
});
