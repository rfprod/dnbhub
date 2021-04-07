import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { combineLatest, from } from 'rxjs';
import { concatMap, first, map, switchMap, take, tap } from 'rxjs/operators';
import { IEmailMessage } from 'src/app/interfaces/admin';
import { DnbhubBlogPost, DnbhubBlogPostLinks } from 'src/app/interfaces/blog/blog-post.interface';
import { DnbhubBrand } from 'src/app/interfaces/brand/brand.interface';
import { IBrandForm } from 'src/app/interfaces/brand/brand-form.interface';
import { DnbhubAdminService } from 'src/app/state/admin/admin.service';
import { DnbhubFirebaseService } from 'src/app/state/firebase/firebase.service';
import { DnbhubFirebaseState } from 'src/app/state/firebase/firebase.store';
import { DnbhubSoundcloudApiService } from 'src/app/state/soundcloud/soundcloud-api.service';
import { TIMEOUT } from 'src/app/utils';
import { regExpPatterns } from 'src/app/utils/regexp.util';

import {
  ISoundcloudPlaylist,
  playlistDefaultValues,
} from '../../interfaces/soundcloud/soundcloud-playlist.config';
import { DnbhubBottomSheetTextDetailsComponent } from '../bottom-sheet-text-details/bottom-sheet-text-details.component';
import { DnbhubBrandDialogComponent } from '../brand-dialog/brand-dialog.component';

@Component({
  selector: 'dnbhub-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubAdminComponent implements OnInit {
  public readonly privilegedAccess$ = this.store.select(DnbhubFirebaseState.privilegedAccess);

  /**
   * Bottom sheet text details component reference.
   */
  private bottomSheetRef?: MatBottomSheetRef<DnbhubBottomSheetTextDetailsComponent>;

  public readonly emails$ = this.admin.emails$;

  public readonly brands$ = this.admin.brands$;

  /**
   * Brand autocomplete form control.
   */
  public brandAutocompleteControl: FormControl = new FormControl();

  public readonly matchedBrands$ = this.brandAutocompleteControl.valueChanges.pipe(
    concatMap(changes =>
      this.brands$.pipe(
        first(),
        map(brands => ({ changes, brands })),
      ),
    ),
    map(({ changes, brands }) => {
      const matchedKeys = brands.filter(item =>
        new RegExp(this.brandAutocompleteControl.value, 'i').test(item.key ?? ''),
      );
      return matchedKeys;
    }),
  );

  public readonly users$ = this.admin.users$;

  /**
   * Edit brand form.
   */
  public editBrandForm?: IBrandForm;

  public readonly blogEntriesIDs$ = this.admin.blogEntriesIDs$;

  public readonly selectedBrand$ = this.admin.selectedBrand$;

  public readonly selectedSubmission$ = this.admin.selectedSubmission$.pipe(
    map(submission => {
      const widgetLink =
        submission !== null ? this.soundcloud.widgetLink.playlist(submission.id) : '#';
      const showWidget = widgetLink !== '#' ? true : false;
      return { submission, widgetLink, showWidget };
    }),
  );

  constructor(
    private readonly store: Store,
    public readonly firebase: DnbhubFirebaseService,
    private readonly soundcloud: DnbhubSoundcloudApiService,
    private readonly admin: DnbhubAdminService,
    private readonly bottomSheet: MatBottomSheet,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {}

  public displayMessage(message: string): void {
    this.snackBar.open(message, void 0, {
      duration: TIMEOUT.SHORT,
    });
  }

  private getEmails() {
    void this.admin.getEmails().subscribe();
  }

  private getBrands() {
    void this.admin.getBrands().subscribe();
  }

  private getUsers() {
    void this.admin.getUsers().subscribe();
  }

  public getBlogEntriesIDs() {
    void this.admin.getBlogEntriesIDs().subscribe();
  }

  public editBrand(key?: string): void {
    void this.admin
      .selectBrand(key)
      .pipe(
        tap(brand => {
          if (typeof brand !== 'undefined') {
            this.showBrandDialog(brand);
          }
        }),
      )
      .subscribe();
  }

  public createBrand(): void {
    const brand = new DnbhubBrand();
    this.showBrandDialog(brand);
  }

  public showBrandDialog(brand: DnbhubBrand): void {
    const minNameLength = 5;
    const dialog = this.dialog.open(DnbhubBrandDialogComponent, {
      height: '85vh',
      width: '95vw',
      maxWidth: '1680',
      maxHeight: '1024',
      autoFocus: true,
      disableClose: false,
      data: {
        brand,
        regexp: regExpPatterns.links,
        minNameLength,
      },
    });
    void dialog
      .afterClosed()
      .pipe(
        first(),
        tap(() => {
          this.selectBrand(void 0);
        }),
      )
      .subscribe();
  }

  /**
   * Deletes email message.
   */
  public deleteMessage(dbKey: string) {
    const promise = this.firebase.getList(`email/messages/${dbKey}`).remove();
    void from(promise)
      .pipe(
        tap(() => {
          this.getEmails();
        }),
      )
      .subscribe();
  }

  /**
   * Selects brand.
   * Resets selection when null is passed as a parameter.
   * @param key brand key from firebase
   */
  public selectBrand(key?: string): void {
    void this.admin.selectBrand(key).subscribe();
  }

  /**
   * Selects brand from list.
   */
  public selectBrandFromList(event: MatAutocompleteSelectedEvent): void {
    console.warn('selectBrandFromList', event);
    const key = event.option.value;
    void this.selectBrand(key);
  }

  /**
   * Shows email message text.
   * @param emailMessage email message
   */
  public showMessageText(emailMessage: IEmailMessage): void {
    this.bottomSheetRef = this.bottomSheet.open(DnbhubBottomSheetTextDetailsComponent, {
      data: {
        text: emailMessage.message,
      },
    } as MatBottomSheetConfig);

    void this.bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe(() => {
        this.bottomSheetRef = void 0;
      });
  }

  /**
   * Shows blog post submission preview.
   * TODO: check if this method is currently used and use it if it is not.
   */
  public showSubmissionPreview(playlistId: number) {
    const promise = this.soundcloud.sc
      .get<ISoundcloudPlaylist>(`/playlists/${playlistId}`)
      .then(data => {
        const submittedPlaylist = data;
        submittedPlaylist.description = this.soundcloud.processDescription(
          submittedPlaylist.description,
        );
        void this.admin.selectSubmission(submittedPlaylist);
        return data;
      });
    const observable = from(promise);
    void observable.subscribe();
  }

  /**
   * Resets blog post submission preview.
   */
  public hideSubmissionPreview(): void {
    void this.admin.selectSubmission(void 0);
  }

  /**
   * Resolves if submission is already added.
   */
  public submissionAlreadyAdded$(key: string) {
    return this.admin.blogEntriesIDs$.pipe(
      map(existingIDs => {
        return existingIDs.includes(parseInt(key, 10));
      }),
    );
  }

  public approveUserSubmission(playlistId: number) {
    const dbKey = playlistId;
    console.warn('TODO: approve post, playlistID/dbkey', dbKey);
    const selectedSubmission: { id: number; scData: ISoundcloudPlaylist } = {
      id: dbKey,
      scData: { ...playlistDefaultValues },
    };
    console.warn('TODO: approve submission', selectedSubmission);
    const promise = this.soundcloud.sc
      .get<ISoundcloudPlaylist>(`/playlists/${dbKey}`)
      .then(data => {
        console.warn('any data', data);
        selectedSubmission.scData = data;
      });
    const observable = from(promise).pipe(
      tap(() => {
        this.checkAndAddUserPlaylist(selectedSubmission);
      }),
    );
    void observable.subscribe();
  }

  /**
   * Rejects user submission.
   * @param playlistId playlist id
   */
  public rejectUserSubmission(playlistId: number) {
    void this.deleteUserSubmission(playlistId).subscribe();
  }

  /**
   * Deletes user submission.
   * @param dbKey user submission database key
   */
  public deleteUserSubmission(dbKey: number) {
    return this.firebase.fireAuth.user.pipe(
      map(user => user?.uid ?? ''),
      switchMap(userKey => {
        const promise = this.firebase
          .getList(`users/${userKey}/submittedPlaylists/${dbKey}`)
          .remove()
          .then(() => {
            console.warn(`user ${userKey} submission ${dbKey} was successfully deleted`);
            this.getUsers();
          })
          .catch(error => {
            throw error;
          });
        return from(promise);
      }),
    );
  }

  /**
   * Checks and adds user submission.
   * @param selectedSubmission user submitted playlist
   */
  private checkAndAddUserPlaylist(selectedSubmission: { id: number; scData: ISoundcloudPlaylist }) {
    console.warn('checkAndAddUserPlaylist, selectedSubmission', selectedSubmission);
    void combineLatest([
      this.selectedBrand$,
      this.firebase.blogEntryExistsByValue(selectedSubmission.id.toString()),
    ])
      .pipe(
        concatMap(([brand, blogEntry]) => {
          if (Boolean(blogEntry)) {
            /*
             *	entry does exist, call delete submission automatically
             */

            this.getUsers();
            return this.deleteUserSubmission(selectedSubmission.id);
          }

          const code =
            selectedSubmission.scData.user.username.replace(/\s/, '') +
            selectedSubmission.scData.permalink.toUpperCase();
          const links = new DnbhubBlogPostLinks({ ...brand });
          const playlistId = selectedSubmission.scData.id;
          const soundcloudUserId = selectedSubmission.scData.user.id.toString();
          const data = { code, links, playlistId, soundcloudUserId } as DnbhubBlogPost;

          const valuesObj = new DnbhubBlogPost(data);
          console.warn('valuesObj', valuesObj);
          return this.firebase.addBlogPost(valuesObj);
        }),
        concatMap(
          () => {
            this.getUsers();
            this.getBlogEntriesIDs();
            this.selectBrand();
            return this.deleteUserSubmission(selectedSubmission.id);
          },
          () => {
            this.selectBrand();
          },
        ),
      )
      .subscribe();
  }

  /**
   * Lifecycle hook called on component initialization.
   */
  public ngOnInit(): void {
    this.getEmails();
    this.getBrands();
    this.getUsers();
    this.getBlogEntriesIDs();
  }
}
