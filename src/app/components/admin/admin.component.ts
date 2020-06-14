import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseReference } from '@angular/fire/database/interfaces';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, from } from 'rxjs';
import { concatMap, filter, map, take, tap } from 'rxjs/operators';
import { IEmailMessage } from 'src/app/interfaces/admin';
import { BlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { IBrandForm } from 'src/app/interfaces/brand/brand-form.interface';
import { Brand } from 'src/app/interfaces/brand/brand.interface';
import { DnbhubFirebaseService } from 'src/app/services/firebase/firebase.service';
import { DnbhubRegularExpressionsService } from 'src/app/services/regular-expressions/regular-expressions.service';
import { DnbhubAdminService } from 'src/app/state/admin/admin.service';
import { DnbhubSoundcloudApiService } from 'src/app/state/soundcloud/soundcloud-api.service';
import { ETIMEOUT } from 'src/app/utils';

import { SoundcloudPlaylist } from '../../interfaces/soundcloud/soundcloud-playlist.config';
import { DnbhubBottomSheetTextDetailsComponent } from '../bottom-sheet-text-details/bottom-sheet-text-details.component';
import { DnbhubBrandDialogComponent } from '../brand-dialog/brand-dialog.component';

/**
 * Application admin component.
 */
@Component({
  selector: 'dnbhub-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnbhubAdminComponent implements OnInit, OnDestroy {
  public readonly anonUser$ = this.firebase.anonUser$;

  /**
   * Bottom sheet text details component reference.
   */
  private bottomSheetRef: MatBottomSheetRef<DnbhubBottomSheetTextDetailsComponent>;

  public readonly emails$ = this.admin.emails$;

  public readonly brands$ = this.admin.brands$;

  public readonly matchedBrands$ = this.brands$.pipe(
    map(brands => {
      const matchedKeys = brands.filter(item =>
        new RegExp(this.brandAutocompleteControl.value, 'i').test(item.key),
      );
      // console.log('matchedKeys', matchedKeys);
      return matchedKeys;
    }),
  );

  public readonly users$ = this.admin.users$;

  public readonly blogEntriesIDs$ = this.admin.blogEntriesIDs$;

  public readonly selectedBrand$ = this.admin.selectedBrand$;

  public readonly selectedSubmission$ = this.admin.selectedSubmission$.pipe(
    filter(submission => Boolean(submission)),
    map(submission => {
      const widgetLink = this.soundcloud.widgetLink.playlist(submission.id);
      const showWidget = widgetLink !== '#' ? true : false;
      return { submission, widgetLink, showWidget };
    }),
  );

  /**
   * Brand autocomplete form control.
   */
  public brandAutocompleteControl: FormControl = new FormControl();

  /**
   * Edit brand form.
   */
  public editBrandForm: IBrandForm;

  constructor(
    public readonly firebase: DnbhubFirebaseService,
    private readonly soundcloud: DnbhubSoundcloudApiService,
    private readonly admin: DnbhubAdminService,
    private readonly regx: DnbhubRegularExpressionsService,
    private readonly bottomSheet: MatBottomSheet,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {}

  public displayMessage(message: string): void {
    this.snackBar.open(message, null, {
      duration: ETIMEOUT.SHORT,
    });
  }

  private getEmails() {
    this.admin.getEmails().subscribe();
  }

  private getBrands() {
    this.admin.getBrands().subscribe();
  }

  private getUsers() {
    this.admin.getUsers().subscribe();
  }

  public getBlogEntriesIDs() {
    this.admin.getBlogEntriesIDs().subscribe();
  }

  public editBrand(key?: string): void {
    this.admin
      .selectBrand(key)
      .pipe(
        tap(brand => {
          this.showBrandDialog(brand);
        }),
      )
      .subscribe();
  }

  public createBrand(): void {
    const brand = new Brand();
    this.showBrandDialog(brand);
  }

  public showBrandDialog(brand: Brand): void {
    const minNameLength = 5;
    this.dialog.open(DnbhubBrandDialogComponent, {
      height: '85vh',
      width: '95vw',
      maxWidth: '1680',
      maxHeight: '1024',
      autoFocus: true,
      disableClose: false,
      data: {
        brand,
        regexp: this.regx.patterns.links,
        minNameLength,
      },
    });
  }

  /**
   * Deletes email message.
   */
  public deleteMessage(dbKey: string) {
    const promise = (this.firebase.getDB(
      `email/messages/${dbKey}`,
      true,
    ) as DatabaseReference).remove();
    from(promise)
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
    this.admin.selectBrand(key).subscribe();
  }

  /**
   * Selects brand from list.
   */
  public selectBrandFromList(event: MatAutocompleteSelectedEvent): void {
    const key = event.option.value;
    this.admin.selectBrand(key).subscribe();
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

    this.bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe(() => {
        this.bottomSheetRef = null;
      });
  }

  /**
   * Shows blog post submission preview.
   * TODO: check if this method is currently used and use it if it is not.
   */
  public showSubmissionPreview(playlistId: number) {
    const promise = this.soundcloud.SC.get(`/playlists/${playlistId}`).then(
      (data: SoundcloudPlaylist) => {
        console.log('data', data);
        const submittedPlaylist = data;
        submittedPlaylist.description = this.soundcloud.processDescription(
          submittedPlaylist.description,
        );
        this.admin.selectSubmission(submittedPlaylist);
        return data;
      },
    );
    const observable = from(promise);
    observable.subscribe();
  }

  /**
   * Resets blog post submission preview.
   */
  public hideSubmissionPreview(): void {
    this.admin.selectSubmission(null);
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
    const selectedSubmission = {
      id: dbKey,
      scData: null,
    };
    console.warn('TODO: approve submission', selectedSubmission);
    const promise = this.soundcloud.SC.get(`/playlists/${dbKey}`).then(data => {
      console.warn('any data', data);
      selectedSubmission.scData = data;
    });
    const observable = from(promise).pipe(
      tap(() => {
        this.checkAndAddUserPlaylist(selectedSubmission);
      }),
    );
    observable.subscribe();
  }

  /**
   * Rejects user submission.
   * @param playlistId playlist id
   */
  public rejectUserSubmission(playlistId: number) {
    this.deleteUserSubmission(playlistId).subscribe();
  }

  /**
   * Deletes user submission.
   * @param dbKey user submission database key
   */
  public deleteUserSubmission(dbKey: number) {
    const userKey = this.firebase.fire.user.uid;
    const promise = (this.firebase.getDB(
      `users/${userKey}/submittedPlaylists/${dbKey}`,
      true,
    ) as DatabaseReference)
      .remove()
      .then(() => {
        console.warn(`user ${userKey} submission ${dbKey} was successfully deleted`);
        this.getUsers();
      })
      .catch(error => {
        throw error;
      });
    const observable = from(promise);
    return observable;
  }

  /**
   * Checks and adds user submission.
   * @param selectedSubmission user submitted playlist
   */
  private checkAndAddUserPlaylist(selectedSubmission: { id: number; scData: SoundcloudPlaylist }) {
    console.warn('checkAndAddUserPlaylist, selectedSubmission', selectedSubmission);
    combineLatest([
      this.selectedBrand$,
      this.firebase.blogEntryExistsByValue(selectedSubmission.id.toString()),
    ])
      .pipe(
        concatMap(([brand, blogEntry]) => {
          if (blogEntry) {
            /*
             *	entry does exist, call delete submission automatically
             */

            this.getUsers();
            return this.deleteUserSubmission(selectedSubmission.id);
          }

          const valuesObj: BlogPost = new BlogPost();
          valuesObj.code =
            selectedSubmission.scData.user.username.replace(/\s/, '') +
            selectedSubmission.scData.permalink.toUpperCase();
          valuesObj.links = { ...brand };
          valuesObj.playlistId = selectedSubmission.scData.id;
          valuesObj.soundcloudUserId = selectedSubmission.scData.user.id.toString();
          console.warn(valuesObj);
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

  /**
   * Lifecycle hook called on component destruction.
   */
  public ngOnDestroy(): void {
    (this.firebase.getDB('emails/messages', true) as DatabaseReference).off();
    (this.firebase.getDB('blogEntriesIDs', true) as DatabaseReference).off();
    (this.firebase.getDB('brands', true) as DatabaseReference).off();
    (this.firebase.getDB('users', true) as DatabaseReference).off();
  }
}
