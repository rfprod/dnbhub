import { Component, OnInit, OnDestroy } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

import { MatAutocompleteSelectedEvent, MatBottomSheet, MatBottomSheetRef, MatBottomSheetConfig } from '@angular/material';

import { DataSnapshot, DatabaseReference } from '@angular/fire/database/interfaces';

import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { RegularExpressionsService } from 'src/app/services/regular-expressions/regular-expressions.service';
import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';
import { SoundcloudService } from 'src/app/services';

import { IBrand } from 'src/app/interfaces/brand/brand.interface';
import { BottomSheetTextDetailsComponent } from '../bottom-sheet-text-details/bottom-sheet-text-details.component';
import { take } from 'rxjs/operators';
import { IBrandForm } from 'src/app/interfaces/brand/brand-form.interface';

/**
 * Application admin component.
 */
@Component({
  selector: 'app-admin',
  templateUrl: './app-admin.component.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppAdminComponent implements OnInit, OnDestroy {

  /**
   * AppAdminComponent constructor.
   * @param emitter Event emitter service
   * @param firebase Firebase service
   * @param soundcloud Soundcloud service
   * @param regx Regular expressions service
   * @param fb Form builder
   */
  constructor(
    private emitter: EventEmitterService,
    public firebase: FirebaseService,
    private soundcloud: SoundcloudService,
    private regx: RegularExpressionsService,
    private bottomSheet: MatBottomSheet,
    private fb: FormBuilder
  ) {}

  /**
   * Bottom sheet text details component reference.
   */
  private bottomSheetRef: MatBottomSheetRef<BottomSheetTextDetailsComponent>;

  /**
   * Company details object.
   */
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
        index: number|null;
        key: string|null;
        object: any|null;
      }
    };
    edit: {
      brand: {
        key: string|null
      }
    };
    create: {
      brand: boolean;
    };
    preview: {
      submission: any|null
    };
    blog: {
      existingIDs: string[]|null
    };
  } = {
    emails: {
      messages: {},
      messagesKeys: [],
      blogSubmissions: {},
      blogSubmissionsKeys: []
    },
    brands: {},
    brandsKeys: [],
    users: {},
    usersKeys: [],
    selected: {
      brand: {
        index: null,
        key: null,
        object: null
      }
    },
    edit: {
      brand: {
        key: null
      }
    },
    create: {
      brand: false
    },
    preview: {
      submission: null
    },
    blog: {
      existingIDs: null
    }
  };

  /**
   * Returns object values.
   * @param object input object
   */
  public getObjectValues(object: object): Iterable<any> {
    return Object.values(object);
  }

  /**
   * Gets email messages from firebase.
   */
  private getEmailMessages(): Promise<any> {
    const def = new CustomDeferredService();
    (this.firebase.getDB('emails/messages') as Promise<DataSnapshot>)
      .then((snapshot: DataSnapshot) => {
        const response = snapshot.val();
        this.details.emails.messages = response;
        this.details.emails.messagesKeys = (response) ? Object.keys(response) : [];
        console.log('this.details.emails.messages', this.details.emails.messages);
        console.log('this.details.emails.messagesKeys', this.details.emails.messagesKeys);
        def.resolve();
      }).catch((error: string) => {
        console.log('getEmailMessages, error', error);
        def.reject();
      });
    return def.promise;
  }

  /**
   * Gets blog post submissions sent over email from firebase.
   */
  private getEmailBlogSubmissions(): Promise<any> {
    const def = new CustomDeferredService();
    (this.firebase.getDB('emails/blogSubmissions') as Promise<DataSnapshot>)
      .then((snapshot: DataSnapshot) => {
        const response = snapshot.val();
        this.details.emails.blogSubmissions = response;
        this.details.emails.blogSubmissionsKeys = (response) ? Object.keys(response) : [];
        console.log('this.details.emails.blogSubmissions', this.details.emails.blogSubmissions);
        console.log('this.details.emails.blogSubmissionsKeys', this.details.emails.blogSubmissionsKeys);
        def.resolve();
      }).catch((error: string) => {
        console.log('getEmailBlogSubmissions, error', error);
        def.reject();
      });
    return def.promise;
  }

  /**
   * Resolves if there're no blog submissions.
   */
  public noEmailBlogSubmissions(): boolean {
    return !this.details.emails.blogSubmissionsKeys.length ? true : false;
  }

  /**
   * Resolves if there're no email messages.
   */
  public noEmailMessages(): boolean {
    return !this.details.emails.messagesKeys.length ? true : false;
  }

  /**
   * Resolves if there're no brands.
   */
  public noBrands(): boolean {
    return !this.details.brandsKeys.length ? true : false;
  }

  /**
   * Gets brands from firebase.
   */
  private getBrands(): Promise<any> {
    const def = new CustomDeferredService();
    (this.firebase.getDB('brands') as Promise<DataSnapshot>)
      .then((snapshot: DataSnapshot) => {
        const response = snapshot.val();
        this.details.brands = (response) ? response : {};
        this.details.brandsKeys = (response) ? Object.keys(response) : [];
        console.log('this.details.brands', this.details.brands);
        def.resolve();
      }).catch((error: string) => {
        console.log('getBrands, error', error);
        def.reject();
      });
    return def.promise;
  }

  /**
   * Gets users from firebase.
   */
  private getUsers(): Promise<any> {
    const def = new CustomDeferredService();
    (this.firebase.getDB('users') as Promise<DataSnapshot>)
      .then((snapshot: DataSnapshot) => {
        const response = snapshot.val();
        this.details.users = (response) ? response : {};
        this.details.usersKeys = (response) ? Object.keys(response) : [];
        console.log('this.details.users', this.details.users);
        def.resolve();
      }).catch((error: string) => {
        console.log('getUsers, error', error);
        def.reject();
      });
    return def.promise;
  }

  /**
   * Gets existing blog entries ids.
   */
  public getExistingBlogEntriesIDs(): Promise<any> {
    const def = new CustomDeferredService();
    (this.firebase.getDB('blogEntriesIDs') as Promise<DataSnapshot>)
      .then((snapshot: DataSnapshot) => {
        const response = snapshot.val();
        this.details.blog.existingIDs = response[0];
        console.log('existingBlogEntriesIDs, existingIDs', this.details.blog.existingIDs);
      }).catch((error: string) => {
        console.log('getExistingBlogEntriesIDs, error', error);
      });
    return def.promise;
  };

  /**
   * Deletes email message.
   * @param index email message key index
   */
  public deleteMessage(index: number): Promise<any> {
    const def = new CustomDeferredService();
    const dbKey: string = this.details.emails.messagesKeys[index];
    (this.firebase.getDB(`email/messages/${dbKey}`, true) as DatabaseReference).remove()
      .then(() => {
        console.log(`message id ${dbKey} was successfully deleted`);
        this.details.emails.messagesKeys.splice(index, 1);
        delete this.details.emails.messages[dbKey];
      }).catch((error: string) => {
        console.log('deleteMessage, error', error);
      });
    return def.promise;
  }

  /**
   * Deletes email blog submission.
   * @param index blog post email submission key index
   */
  public deleteEmailBlogSubmission(index: number): Promise<any> {
    const def = new CustomDeferredService();
    const dbKey: string = this.details.emails.messagesKeys[index];
    (this.firebase.getDB(`emails/blogSubmissions/${dbKey}`, true) as DatabaseReference).remove()
      .then(() => {
        console.log(`blog submission id ${dbKey} was successfully deleted`);
        this.details.emails.blogSubmissionsKeys.splice(index, 1);
        delete this.details.emails.blogSubmissions[dbKey];
      }).catch((error: string) => {
        console.log('deleteBlogSubmission, error', error);
      });
    return def.promise;
  }

  /**
   * Deletes brand.
   * @param index brand key index
   */
  public deleteBrand(index: number): Promise<any> {
    const def = new CustomDeferredService();
    const dbKey: string = this.details.brandsKeys[index];
    (this.firebase.getDB(`brands/${dbKey}`, true) as DatabaseReference).remove()
      .then(() => {
        console.log(`brand id ${dbKey} was successfully deleted`);
        /*
        *	update local models
        */
        this.details.brandsKeys.splice(index, 1);
        delete this.details.brands[dbKey];
      }).catch((error: string) => {
        console.log('deleteBrand, error', error);
      });
    return def.promise;
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
    this.details.selected.brand.index = this.details.brandsKeys.indexOf(event.option.value);
    this.details.selected.brand.object = this.details.brands[this.details.selected.brand.key];
    console.log('this.details.selected.brand', this.details.selected.brand);
  }

  /**
   * Returns selected brand object.
   */
  public getSelectedBrand(): IBrand {
    return this.details.selected.brand.object;
  }

  /**
   * Brand autocomplete form control.
   */
  public brandAutocompleteControl: FormControl = new FormControl();

  /**
   * Returns matched brands for autocomplete.
   */
  public getMatchedBrands(): string[] {
    // console.log('getMatchedBrands, this.brandAutocompleteControl.value', this.brandAutocompleteControl.value);
    const matchedKeys = this.details.brandsKeys.filter((item: string) => new RegExp(this.brandAutocompleteControl.value, 'i').test(item));
    // console.log('matchedKeys', matchedKeys);
    return matchedKeys;
  }

  /**
   * Approves blog submission sent over email.
   * @param index blog post email submission key index
   */
  public approveEmailSubmission(index: number): Promise<any> {
    const def = new CustomDeferredService();
    // TODO: implement this method
    return def.promise;
  }

  /**
   * Shows email message text.
   * @param emailMessage email message
   */
  public showMessageText(emailMessage: any): void {
    this.bottomSheetRef = this.bottomSheet.open(BottomSheetTextDetailsComponent, {
      data: {
        text: emailMessage.message
      }
    } as MatBottomSheetConfig);

    this.bottomSheetRef.afterDismissed().pipe(take(1)).subscribe(
      (result: any) => {
        console.log('bottomSheetRef dismissed, result', result);
      }
    );
  }

  /**
   * Shows blog post submission preview.
   * @param index blog post index
   */
  public showSubmissionPreview(index: number): Promise<any> {
    const def = new CustomDeferredService();
    const dbKey = this.details.emails.blogSubmissionsKeys[index];
    const selectedSubmission = this.details.emails.blogSubmissions[dbKey];
    this.soundcloud.SC.get(`/resolve?url=${selectedSubmission.link}`).then((data) => {
      console.log('data', data);
      this.details.preview.submission = data;
      this.details.preview.submission.description = this.soundcloud.processDescription(this.details.preview.submission.description);
      def.resolve();
    });
    return def.promise;
  }

  /**
   * Returns soundcloud widget link.
   * @param soundcloudPlaylistID soundcloud playlist id
   */
  public soundcloudWidgetLink(soundcloudPlaylistID: number): SafeResourceUrl {
    return this.soundcloud.widgetLink.playlist(soundcloudPlaylistID);
  };

  /**
   * Resolves if soundcloud link should be shown.
   * @param soundcloudPlaylistID soundcloud playlist id
   */
  public showSoundcloudWidgetLink(soundcloudPlaylistID: number): SafeResourceUrl {
    return (this.soundcloud.widgetLink.playlist(soundcloudPlaylistID) !== '#') ? true : false;
  };

  /**
   * Resets blog post submission preview.
   */
  public hideSubmissionPreview(): void {
    this.details.preview.submission = null;
  }

  /**
   * Resolves if submission is already added.
   * @param index in array
   */
  public submissionAlreadyAdded(index: string): Promise<any> {
    const def = new CustomDeferredService();
    let added = false;
    if (!this.details.blog.existingIDs) {
      console.log('Unable to add blog posts, existingBlogEntriesIDs is not initialized yet');
      added = true;
      def.resolve(added);
    } else {
      const dbKey = this.details.emails.blogSubmissionsKeys[index];
      const selectedSubmission = this.details.emails.blogSubmissions[dbKey];
      if (selectedSubmission) {
        if (!selectedSubmission.id) {
          /*
          *	resolve submission and save result temporarily
          */
          this.soundcloud.SC.get(`/resolve?url=${selectedSubmission.link}`).then((data) => {
            this.details.emails.blogSubmissions[dbKey].id = data.id;
            this.details.emails.blogSubmissions[dbKey].scData = data;
            added = (this.details.blog.existingIDs.includes(data.id)) ? true : added;
            def.resolve(added);
          });
        } else {
          added = (this.details.blog.existingIDs.includes(selectedSubmission.id)) ? true : added;
          def.resolve(added);
        }
      } else {
        def.reject(new Error('Error: selectedSubmission is falsy'));
      }
    }
    return def.promise;
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
  public editBrand(index: number): void {
    console.log(`edit brand, keyIndex: ${index}`);
    if (index !== null) {
      const dbKey = this.details.brandsKeys[index];
      this.details.edit.brand.key = (dbKey !== this.details.edit.brand.key) ? dbKey : null;
      console.log('this.details.edit.brand.key', this.details.edit.brand.key);
      if (this.details.edit.brand.key) {
        const brand = this.details.brands[dbKey];
        this.initializeBrandForm(brand);
      }
    } else {
      this.details.edit.brand.key = null;
    }
  }

  /**
   * Edit brand form.
   */
  public editBrandForm: IBrandForm;

  /**
   * Initializes brand form.
   * @param brand selected brand object
   */
  private initializeBrandForm(brand?: IBrand): void {
    console.log('initializeBrandForm, brand', brand);
    this.editBrandForm = this.fb.group({
      name: [brand ? brand.name || '' : '', Validators.compose([Validators.required, Validators.minLength(5)])],
      bandcamp: [brand ? brand.bandcamp || '' : '', Validators.compose([Validators.required, Validators.pattern(this.regx.patterns.links.bandcamp)])],
      facebook: [brand ? brand.facebook || '' : '', Validators.compose([Validators.required, Validators.pattern(this.regx.patterns.links.facebook)])],
      instagram: [brand ? brand.instagram || '' : '', Validators.compose([Validators.required, Validators.pattern(this.regx.patterns.links.instagram)])],
      soundcloud: [brand ? brand.soundcloud || '' : '', Validators.compose([Validators.required, Validators.pattern(this.regx.patterns.links.soundcloud)])],
      twitter: [brand ? brand.twitter || '' : '', Validators.compose([Validators.required, Validators.pattern(this.regx.patterns.links.twitter)])],
      website: [brand ? brand.website || '' : '', Validators.compose([Validators.required, Validators.pattern(this.regx.patterns.links.website)])],
      youtube: [brand ? brand.youtube || '' : '', Validators.compose([Validators.required, Validators.pattern(this.regx.patterns.links.youtube)])]
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
    const def = new CustomDeferredService();
    const dbKey: string = this.details.selected.brand.key;
    const newBrandValues: IBrand = this.editBrandForm.value;
    (this.firebase.getDB(`brands/${dbKey}`, true) as DatabaseReference).update(newBrandValues)
      .then(() => {
        console.log(`brand id ${dbKey} was successfully deleted`);
        this.updateLocalBrandModel(dbKey, newBrandValues);
        this.selectBrand(null);
      }).catch((error: string) => {
        console.log('updateBrand, error', error);
      });
    return def.promise;
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
    const def = new CustomDeferredService();
    const formData: any = this.editBrandForm.value;
    (this.firebase.getDB('brands', true) as DatabaseReference)
      .child(this.editBrandForm.controls.name.value)
      .set(formData)
      .then(() => {
        console.log('brand values set');
        this.createBrand();
        this.getBrands()
          .then(() => def.resolve());
      }).catch((error) => def.reject(error));
    return def.promise;
  }

  public approveUserSubmission(playlistId: number): Promise<any> {
    const def = new CustomDeferredService();
    // TODO: implement this method
    // former name: approvePost()
    return def.promise;
  }

  public rejectUserSubmission(playlistId: number): Promise<any> {
    const def = new CustomDeferredService();
    // TODO: implement this method
    // former name: rejectPost()
    return def.promise;
  }

  public deleteUserSubmission(dbKey: number): Promise<any> {
    const def = new CustomDeferredService();
    // TODO: implement this method
    return def.promise;
  }

  private checkAndAddUserPlaylist(): Promise<any> {
    const def = new CustomDeferredService();
    // TODO: implement this method
    return def.promise;
  }

  /**
   * Lifecycle hook called on component initialization.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppAdminComponent initialized');
    this.getEmailMessages()
      .then(() => this.getEmailBlogSubmissions())
      .then(() => this.getBrands())
      .then(() => this.getUsers())
      .then(() => this.getExistingBlogEntriesIDs());
  }

  /**
   * Lifecycle hook called on component destruction.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppAdminComponent destroyed');
    (this.firebase.getDB('emails/messages', true) as DatabaseReference).off();
    (this.firebase.getDB('emails/blogSubmissions', true) as DatabaseReference).off();
    (this.firebase.getDB('blogEntriesIDs', true) as DatabaseReference).off();
    (this.firebase.getDB('brands', true) as DatabaseReference).off();
    (this.firebase.getDB('users', true) as DatabaseReference).off();
  }
}
