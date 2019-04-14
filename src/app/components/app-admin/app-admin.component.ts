import { Component, OnInit, OnDestroy } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';

import { MatAutocompleteSelectedEvent } from '@angular/material';

import { DataSnapshot, DatabaseReference } from '@angular/fire/database/interfaces';

import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { RegularExpressionsService } from 'src/app/services/regular-expressions/regular-expressions.service';
import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';
import { SoundcloudService } from 'src/app/services';

import { IBrand } from 'src/app/interfaces/brand/brand.interface';

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
   * @param emitter Event emitter service
   * @param firebase Firebase service
   * @param soundcloud Soundcloud service
   * @param regx Regular expressions service
   */
  constructor(
    private emitter: EventEmitterService,
    public firebase: FirebaseService,
    private soundcloud: SoundcloudService,
    private regExp: RegularExpressionsService
  ) {}

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
        console.log('this.details.users', this.details.brands);
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
   * @param key brand key from firebase
   */
  public selectBrand(key: string): void {
    this.details.selected.brand.key = key;
    this.details.selected.brand.object = this.getSelectedBrand();
    if (key === null) {
      this.details.selected.brand.key = null;
      this.details.selected.brand.object = null;
    }
  }

  /**
   * Selects brand from list.
   */
  public selectBrandFromList(event: MatAutocompleteSelectedEvent): void {
    console.log('selectBrandFromList, event', event);
    this.details.selected.brand.key = event.option.value;
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
    console.log('getMatchedBrands, this.brandAutocompleteControl.value', this.brandAutocompleteControl.value);
    const matchedKeys = this.details.brandsKeys.filter((item: string) => new RegExp(this.brandAutocompleteControl.value, 'i').test(item));
    console.log('matchedKeys', matchedKeys);
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
   */
  public showMessageText(): Promise<any> {
    const def = new CustomDeferredService();
    // TODO: implement this method
    return def.promise;
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
   * Resolves if brand is editable.
   * @param dbKey firebase brand key
   */
  public isBrandEditable(dbKey: string): boolean {
    return dbKey === this.details.edit.brand.key;
  }

  /**
   * Resolves if submission is already added.
   */
  public editBrand(index: number): void {
    console.log(`edit brand, keyIndex: ${index}`);
    /*
    *	toggles mode off if the same item is selected as an editable
    */
    const dbKey = this.details.brandsKeys[index];
    this.details.edit.brand.key = (dbKey !== this.details.edit.brand.key) ? dbKey : null;
  }

  /**
   * Updates brand.
   */
  public updateBrand(): Promise<any> {
    const def = new CustomDeferredService();
    // TODO: implement this method
    return def.promise;
  }

  /**
   * Creates brand.
   */
  public createBrand(): Promise<any> {
    const def = new CustomDeferredService();
    // TODO: implement this method
    return def.promise;
  }

  /**
   * Submit new brand.
   */
  public submitNewBrand(): Promise<any> {
    const def = new CustomDeferredService();
    // TODO: implement this method
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
