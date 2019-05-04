import { TestBed, async } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { DnbhubStoreState } from './dnbhub-store.state';
import { DnbhubStoreAction } from './dnbhub-store.actions';

describe('DnbhubStore actions', () => {
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([DnbhubStoreState])]
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  it('should create an action and add an item', () => {
    store.dispatch(new DnbhubStoreAction('item-1'));
    store.select(state => state.dnbhubStore.items).subscribe((items: string[]) => {
      expect(items).toEqual(jasmine.objectContaining([ 'item-1' ]));
    });
  });

});
