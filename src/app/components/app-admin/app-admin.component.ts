import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseReference, DatabaseSnapshotExists } from '@angular/fire/database/interfaces';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SafeResourceUrl } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { IEmailMessage, IEmailSubmission } from 'src/app/interfaces/admin';
import { BlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { IBrandForm } from 'src/app/interfaces/brand/brand-form.interface';
import { Brand } from 'src/app/interfaces/brand/brand.interface';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { RegularExpressionsService } from 'src/app/services/regular-expressions/regular-expressions.service';
import { AdminService } from 'src/app/state/admin/admin.service';
import { SoundcloudApiService } from 'src/app/state/soundcloud/soundcloud-api.service';
import { ETIMEOUT } from 'src/app/utils';

import { BottomSheetTextDetailsComponent } from '../bottom-sheet-text-details/bottom-sheet-text-details.component';

/**
 * Application admin component.
 */
@Component({
  selector: 'app-admin',
  templateUrl: './app-admin.component.html',
  styleUrls: ['./app-admin.component.scss'],
  host: {
    class: 'mat-body-1',
  },
})
export class AppAdminComponent implements OnInit, OnDestroy {
  public readonly anonUser$ = this.firebase.anonUser$;

  /**
   * Bottom sheet text details component reference.
   */
  private bottomSheetRef: MatBottomSheetRef<BottomSheetTextDetailsComponent>;

  public details: {
    emails: {
      messages: any;
      messagesKeys: string[];
      blogSubmissions: any;
      blogSubmissionsKeys: string[];
    };
    brands: any;
    brandsKeys: string[];
    users: any;
    usersKeys: string[];
    selected: {
      brand: {
        index: number | null;
        key: string | null;
        object: any | null;
      };
    };
    edit: {
      brand: {
        key: string | null;
      };
    };
    create: {
      brand: boolean;
    };
    preview: {
      submission: any | null;
    };
    blog: {
      existingIDs: string[] | null;
    };
  } = {
    emails: {
      messages: {},
      messagesKeys: [],
      blogSubmissions: {},
      blogSubmissionsKeys: [],
    },
    brands: {},
    brandsKeys: [],
    users: {},
    usersKeys: [],
    selected: {
      brand: {
        index: null,
        key: null,
        object: null,
      },
    },
    edit: {
      brand: {
        key: null,
      },
    },
    create: {
      brand: false,
    },
    preview: {
      submission: null,
    },
    blog: {
      existingIDs: [],
    },
  };

  public readonly emailMessages$ = this.admin.emailMessages$;

  public readonly emailSubmissions$ = this.admin.emailSubmissions$;

  public readonly brands$ = this.admin.brands$;

  public readonly users$ = this.admin.users$;

  public readonly blogEntriesIDs$ = this.admin.blogEntriesIDs$;

  /**
   * Brand autocomplete form control.
   */
  public brandAutocompleteControl: FormControl = new FormControl();

  /**
   * Edit brand form.
   */
  public editBrandForm: IBrandForm;

  constructor(
    public readonly firebase: FirebaseService,
    private readonly soundcloud: SoundcloudApiService,
    private readonly admin: AdminService,
    private readonly regx: RegularExpressionsService,
    private readonly bottomSheet: MatBottomSheet,
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
  ) {}

  public displayMessage(message: string): void {
    this.snackBar.open(message, null, {
      duration: ETIMEOUT.SHORT,
    });
  }

  private getEmailMessages() {
    this.admin.getEmailMessages().subscribe();
  }

  private getEmailBlogSubmissions() {
    this.admin.getEmailSubmissions().subscribe();
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

  /**
   * Deletes email message.
   */
  public deleteMessage(dbKey: string): Promise<any> {
    const promise = (this.firebase.getDB(`email/messages/${dbKey}`, true) as DatabaseReference)
      .remove()
      .then(() => {
        console.log(`message id ${dbKey} was successfully deleted`);
        this.getEmailMessages();
      })
      .catch((error: string) => {
        console.log('deleteMessage, error', error);
      });
    return promise;
  }

  /**
   * Deletes email blog submission.
   */
  public deleteEmailBlogSubmission(dbKey: string): Promise<any> {
    const promise = (this.firebase.getDB(
      `emails/blogSubmissions/${dbKey}`,
      true,
    ) as DatabaseReference)
      .remove()
      .then(() => {
        console.log(`blog submission id ${dbKey} was successfully deleted`);
        this.getEmailBlogSubmissions();
      })
      .catch((error: string) => {
        console.log('deleteBlogSubmission, error', error);
      });
    return promise;
  }

  /**
   * Deletes brand.
   */
  public deleteBrand(dbKey: string): Promise<any> {
    const promise = (this.firebase.getDB(`brands/${dbKey}`, true) as DatabaseReference)
      .remove()
      .then(() => {
        console.log(`brand id ${dbKey} was successfully deleted`);
        this.getBrands();
      })
      .catch((error: string) => {
        console.log('deleteBrand, error', error);
      });
    return promise;
  }

  /**
   * Selects brand.
   * Resets selection when null is passed as a parameter.
   * @param key brand key from firebase
   */
  public selectBrand(key: string): void {
    this.details.selected.brand.key = key;
    this.details.selected.brand.index = this.details.brandsKeys.indexOf(key);
    this.details.selected.brand.object = this.getSelectedBrand();
    if (key === null) {
      this.details.selected.brand.key = null;
      this.details.selected.brand.index = null;
      this.details.selected.brand.object = null;
    }
  }

  /**
   * Selects brand from list.
   */
  public selectBrandFromList(event: MatAutocompleteSelectedEvent): void {
    console.log('selectBrandFromList, event', event);
    this.details.selected.brand.key = event.option.value;
    this.details.selected.brand.index = this.details.brandsKeys.indexOf(
      this.details.selected.brand.key,
    );
    this.details.selected.brand.object = this.details.brands[this.details.selected.brand.key];
    console.log('this.details.selected.brand', this.details.selected.brand);
  }

  /**
   * Returns selected brand object.
   * @param keys indicates if selected brand keys should be returned
   */
  public getSelectedBrand(keys?: boolean): Brand {
    let result = new Brand();
    if (this.brandIsSelected('', true)) {
      result = keys
        ? Object.keys(this.details.selected.brand.object)
        : this.details.selected.brand.object;
    }
    return result;
  }

  /**
   * Resolves if any brand is selected.
   * @param brandKey brand key
   * @param anyBrand indicates if method should resolve if any brand is selected overriding first parameter
   */
  public brandIsSelected(brandKey: string, anyBrand?: boolean): boolean {
    console.log(
      'brandIsSelected, brandKey',
      brandKey,
      'anyBrand',
      anyBrand,
      'selected.brand.key',
      this.details.selected.brand.key,
    );
    let result = false;
    if (
      this.details.selected.brand.index >= 0 &&
      this.details.selected.brand.key &&
      this.details.selected.brand.object
    ) {
      if (this.details.selected.brand.key === brandKey || anyBrand) {
        result = true;
      }
    }
    return result;
  }

  /**
   * Returns matched brands for autocomplete.
   */
  public getMatchedBrands(): string[] {
    const matchedKeys = this.details.brandsKeys.filter((item: string) =>
      new RegExp(this.brandAutocompleteControl.value, 'i').test(item),
    );
    // console.log('matchedKeys', matchedKeys);
    return matchedKeys;
  }

  /**
   * Approves blog submission sent over email.
   * @param index blog post email submission key index
   */
  public approveEmailSubmission(submission: IEmailSubmission): Promise<any> {
    console.log('TODO: approve submission', submission);
    return this.firebase.blogEntryExistsByValue(submission.key).then(result => {
      console.log('blogEntryExistsByValue', result);
      if (result) {
        /*
         *	entry does exist, call delete submission automatically
         */
        return this.deleteEmailSubmission(submission.key);
      }
      return this.soundcloud.SC.get(`/resolve?url=${submission.link}`).then(scData => {
        console.log('scData', scData);
        /*
         *	create new records, delete submission record
         */
        const valuesObj: BlogPost = new BlogPost();
        valuesObj.code = `${scData.user.username.replace(
          /\s/,
          '',
        )}${scData.permalink.toUpperCase()}`;
        valuesObj.links = this.getSelectedBrand();
        valuesObj.playlistId = scData.id;
        valuesObj.soundcloudUserId = scData.user.id;
        console.log('valuesObj', valuesObj);
        return this.firebase
          .addBlogPost(valuesObj)
          .then(() => {
            console.log('blog entry values set');
            this.getEmailBlogSubmissions();
            this.getBlogEntriesIDs();
            this.selectBrand(null);
            return this.deleteEmailSubmission(submission.key);
          })
          .catch((error: any) => {
            console.log('error setting blod entry values', error);
            this.selectBrand(null);
          });
      });
    });
  }

  /**
   * Deletes email submission by key index.
   */
  public deleteEmailSubmission(dbKey: string): Promise<any> {
    const promise = (this.firebase.getDB(
      `emails/blogSubmissions/${dbKey}`,
      true,
    ) as DatabaseReference)
      .remove()
      .then(() => {
        console.log(`submission id ${dbKey} was successfully deleted`);
        this.getEmailBlogSubmissions();
      })
      .catch(error => {
        console.log('error deleting email submission', error);
      });
    return promise;
  }

  /**
   * Shows email message text.
   * @param emailMessage email message
   */
  public showMessageText(emailMessage: IEmailMessage): void {
    this.bottomSheetRef = this.bottomSheet.open(BottomSheetTextDetailsComponent, {
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
   */
  public showSubmissionPreview(submission: IEmailSubmission): Promise<any> {
    return (this.soundcloud.SC.get(`/resolve?url=${submission.link}`) as Promise<any>).then(
      data => {
        console.log('data', data);
        this.details.preview.submission = data;
        this.details.preview.submission.description = this.soundcloud.processDescription(
          this.details.preview.submission.description,
        );
        return data;
      },
    );
  }

  /**
   * Returns soundcloud widget link.
   * @param soundcloudPlaylistID soundcloud playlist id
   */
  public soundcloudWidgetLink(soundcloudPlaylistID: number): SafeResourceUrl {
    const link: SafeResourceUrl = this.soundcloud.widgetLink.playlist(soundcloudPlaylistID);
    return link;
  }

  /**
   * Resolves if soundcloud link should be shown.
   * @param soundcloudPlaylistID soundcloud playlist id
   */
  public showSoundcloudWidgetLink(soundcloudPlaylistID: number): SafeResourceUrl {
    return this.soundcloud.widgetLink.playlist(soundcloudPlaylistID) !== '#' ? true : false;
  }

  /**
   * Return user submitted playlist.
   * @param userKey user key
   * @param submittedPlaylist submitted playlist key
   */
  public getUserSubmittedPlaylistObject(userKey: string, submittedPlaylist: string): any {
    console.log(
      'getUserSubmittedPlaylistObject, userKey',
      userKey,
      'submittedPlaylist',
      submittedPlaylist,
    );
    const playlist: any = this.details.users[userKey].submittedPlaylists[submittedPlaylist];
    console.log('playlist', playlist);
    return playlist;
  }

  /**
   * Resets blog post submission preview.
   */
  public hideSubmissionPreview(): void {
    this.details.preview.submission = null;
  }

  /**
   * Resolves if submission is already added.
   */
  public submissionAlreadyAdded(submission: IEmailSubmission): boolean {
    return this.details.blog.existingIDs.includes(submission.key);
  }

  /**
   * Resolves if brand is currently editable.
   * @param dbKey firebase brand key
   */
  public isBrandCurrentlyEditable(dbKey: string): boolean {
    return dbKey === this.details.edit.brand.key;
  }

  /**
   * Switches Edit Brand mode.
   * Toggles Edit Brand mode off if the same item is selected as an editable.
   */
  public editBrand(dbKey: string): void {
    console.log(`edit brand, dbKey: ${dbKey}`);
    this.details.edit.brand.key = dbKey !== this.details.edit.brand.key ? dbKey : null;
    console.log('this.details.edit.brand.key', this.details.edit.brand.key);
    if (this.details.edit.brand.key) {
      const brand = this.details.brands[dbKey];
      this.initializeBrandForm(brand);
    }
  }

  /**
   * Initializes brand form.
   * @param brand selected brand object
   */
  private initializeBrandForm(brand?: Brand): void {
    console.log('initializeBrandForm, brand', brand);
    this.editBrandForm = this.fb.group({
      name: [
        brand ? brand.name || '' : '',
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
      bandcamp: [
        brand ? brand.bandcamp || '' : '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.regx.patterns.links.bandcamp),
        ]),
      ],
      facebook: [
        brand ? brand.facebook || '' : '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.regx.patterns.links.facebook),
        ]),
      ],
      instagram: [
        brand ? brand.instagram || '' : '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.regx.patterns.links.instagram),
        ]),
      ],
      soundcloud: [
        brand ? brand.soundcloud || '' : '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.regx.patterns.links.soundcloud),
        ]),
      ],
      twitter: [
        brand ? brand.twitter || '' : '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.regx.patterns.links.twitter),
        ]),
      ],
      website: [
        brand ? brand.website || '' : '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.regx.patterns.links.website),
        ]),
      ],
      youtube: [
        brand ? brand.youtube || '' : '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.regx.patterns.links.youtube),
        ]),
      ],
    }) as IBrandForm;
  }

  /**
   * Submits brand form.
   */
  public submitBrandForm(): void {
    if (this.editBrandForm.valid) {
      if (this.details.create.brand) {
        this.submitNewBrand();
      } else {
        this.updateBrand();
      }
    } else {
      console.log('submitBrandForm, invalid intput', this.editBrandForm);
    }
  }

  /**
   * Updates local brand model.
   * @param dbKey Database key
   * @param newValues New brand values
   */
  private updateLocalBrandModel(dbKey: string, newValues): void {
    const index: number = this.details.brandsKeys.indexOf(dbKey);
    this.details.brands[index] = newValues;
  }

  /**
   * Updates brand.
   */
  private updateBrand(): Promise<any> {
    const dbKey: string = this.details.selected.brand.key;
    const newBrandValues: Brand = this.editBrandForm.value;
    return (this.firebase.getDB(`brands/${dbKey}`, true) as DatabaseReference)
      .update(newBrandValues)
      .then(() => {
        console.log(`brand id ${dbKey} was successfully deleted`);
        this.updateLocalBrandModel(dbKey, newBrandValues);
        this.selectBrand(null);
      })
      .catch((error: string) => {
        console.log('updateBrand, error', error);
      });
  }

  /**
   * Switches create brand mode.
   */
  public createBrand(): IBrandForm {
    if (!this.details.create.brand) {
      this.initializeBrandForm();
    } else {
      this.editBrandForm = null;
    }
    this.details.create.brand = !this.details.create.brand;
    return this.editBrandForm;
  }

  /**
   * Submits new brand.
   */
  public submitNewBrand(): Promise<any> {
    const formData: any = this.editBrandForm.value;
    return (this.firebase.getDB('brands', true) as DatabaseReference)
      .child(this.editBrandForm.controls.name.value)
      .set(formData)
      .then(() => {
        console.log('brand values set');
        this.createBrand();
        this.getBrands();
      })
      .catch(error => error);
  }

  public approveUserSubmission(playlistId: number): Promise<any> {
    const dbKey = playlistId;
    console.log('TODO: approve post, playlistID/dbkey', dbKey);
    const selectedSubmission = {
      id: dbKey,
      scData: null,
    };
    console.log('TODO: approve submission', selectedSubmission);
    return (this.soundcloud.SC.get(`/playlists/${dbKey}`) as Promise<any>).then(data => {
      console.log('any data', data);
      selectedSubmission.scData = data;
      return this.checkAndAddUserPlaylist(selectedSubmission);
    });
  }

  /**
   * Rejects user submission.
   * @param playlistId playlist id
   */
  public rejectUserSubmission(playlistId: number): Promise<any> {
    return this.deleteUserSubmission(playlistId);
  }

  /**
   * Deletes user submission.
   * @param dbKey user submission database key
   */
  public deleteUserSubmission(dbKey: number): Promise<any> {
    const userKey = this.firebase.fire.user.uid;
    return (this.firebase.getDB(
      `users/${userKey}/submittedPlaylists/${dbKey}`,
      true,
    ) as DatabaseReference)
      .remove()
      .then(() => {
        console.log(`user ${userKey} submission ${dbKey} was successfully deleted`);
        delete this.details.users[userKey].submittedPlaylists[dbKey];
      })
      .catch((error: any) => {
        console.log('error deleting user submission', error);
      });
  }

  /**
   * Checks and adds user submission.
   * @param selectedSubmission user submitted playlist
   */
  private checkAndAddUserPlaylist(selectedSubmission: { id: number; scData: any }): Promise<any> {
    console.log('checkAndAddUserPlaylist, selectedSubmission', selectedSubmission);
    return this.firebase
      .blogEntryExistsByValue(selectedSubmission.id.toString())
      .then((result: DatabaseSnapshotExists<any>) => {
        console.log('blogEntryExistsByValue', result);
        if (result) {
          /*
           *	entry does exist, call delete submission automatically
           */

          this.getUsers();
          return this.deleteUserSubmission(selectedSubmission.id);
        }
        /*
         *	create new records, delete submission record
         */
        const valuesObj: BlogPost = new BlogPost();
        valuesObj.code =
          selectedSubmission.scData.user.username.replace(/\s/, '') +
          selectedSubmission.scData.permalink.toUpperCase();
        valuesObj.links = this.getSelectedBrand();
        valuesObj.playlistId = selectedSubmission.scData.id;
        valuesObj.soundcloudUserId = selectedSubmission.scData.user.id;
        console.log(valuesObj);
        return this.firebase
          .addBlogPost(valuesObj)
          .then(() => {
            console.log('blog entry values set');
            this.getUsers();
            this.getBlogEntriesIDs();
            this.selectBrand(null);
            return this.deleteUserSubmission(selectedSubmission.id);
          })
          .catch((error: any) => {
            console.log('error setting blod entry values', error);
            this.selectBrand(null);
          });
      });
  }

  /**
   * Lifecycle hook called on component initialization.
   */
  public ngOnInit(): void {
    this.getEmailMessages();
    this.getEmailBlogSubmissions();
    this.getBrands();
    this.getUsers();
    this.getBlogEntriesIDs();
  }

  /**
   * Lifecycle hook called on component destruction.
   */
  public ngOnDestroy(): void {
    (this.firebase.getDB('emails/messages', true) as DatabaseReference).off();
    (this.firebase.getDB('emails/blogSubmissions', true) as DatabaseReference).off();
    (this.firebase.getDB('blogEntriesIDs', true) as DatabaseReference).off();
    (this.firebase.getDB('brands', true) as DatabaseReference).off();
    (this.firebase.getDB('users', true) as DatabaseReference).off();
  }
}
