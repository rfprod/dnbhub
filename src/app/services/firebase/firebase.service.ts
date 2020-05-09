import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  DatabaseReference,
  DatabaseSnapshotExists,
  DataSnapshot,
} from '@angular/fire/database/interfaces';
import { from, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AppEnvironmentConfig } from 'src/app/app.environment';
import { IFirebaseENVInterface } from 'src/app/interfaces';
import { IBlogPost } from 'src/app/interfaces/blog/blog-post.interface';
import { CustomDeferredService } from 'src/app/services/custom-deferred/custom-deferred.service';

/**
 * Firebase service, uses Angular Fire.
 */
@Injectable()
export class FirebaseService {
  /**
   * @param fireDB Firebase database
   * @param fireAuth Firebase auth
   */
  constructor(
    private readonly fireDB: AngularFireDatabase,
    private readonly fireAuth: AngularFireAuth,
  ) {
    this.fireAuthUserSubscription();
  }

  /**
   * Application environment: Firebase API.
   */
  private readonly config: IFirebaseENVInterface = new AppEnvironmentConfig().firebase;

  /**
   * Angular fire public shortcuts.
   */
  public fire: {
    db: firebase.database.Database;
    auth: AngularFireAuth;
    authUser: firebase.User;
  } = {
    db: this.fireDB.database,
    auth: this.fireAuth,
    authUser: null,
  };

  /**
   * Indicates if user is anonymous.
   */
  public anonUser(): Observable<firebase.User> {
    return from(this.fireAuth.currentUser);
  }

  private fireAuthUserSubscription(): void {
    this.fireAuth.user.subscribe(
      (user: firebase.User) => {
        this.fire.authUser = user;
      },
      (error: any) => {
        console.warn('FirebaseService, delete, fireAuth.user, error', error);
      },
    );
  }

  /**
   * Gets firebase database
   * @param collection firebase collection name
   * @param refOnly indicates if db reference only should be returned
   */
  public getDB(
    collection:
      | 'about'
      | 'blog'
      | 'blogEntriesIDs'
      | 'brands'
      | 'emails'
      | 'freedownloads'
      | 'users'
      | string,
    refOnly?: boolean,
  ): Promise<DataSnapshot> | DatabaseReference {
    const db: Promise<DataSnapshot> | DatabaseReference = !refOnly
      ? this.fireDB.database.ref('/' + collection).once('value')
      : this.fireDB.database.ref('/' + collection);
    // console.warn('firebaseService, getDB', db);
    return db;
  }

  /**
   * Resolves if user has privileged access.
   */
  public privilegedAccess(): boolean {
    return !this.fire.authUser
      ? false
      : this.fire.authUser.uid !== this.config.privilegedAccessUID
      ? false
      : true;
  }

  /**
   * Authenticates user with provided credentials.
   * @param mode login mode
   * @param payload login payload
   */
  public authenticate(
    mode: 'email' | 'twitter',
    payload: { email: string; password: string },
  ): Promise<any> {
    const def = new CustomDeferredService<any>();
    console.warn('mode:', mode);
    console.warn('payload:', payload);

    if (mode === 'email') {
      this.fireAuth
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then((success: any) => {
          // console.warn('auth success', success);
          def.resolve(success);
        })
        .catch((error: any) => {
          // console.warn('auth error', error);
          def.reject(error);
        });
    }

    if (mode === 'twitter') {
      /*
       *	TODO
       *	https://firebase.google.com/docs/auth/web/twitter-login?authuser=0
       */
      def.reject({
        TODO:
          'twitter authentication - https://firebase.google.com/docs/auth/web/twitter-login?authuser=0',
      });
    }
    return def.promise;
  }

  /**
   * Signs user out.
   */
  public signout(): Observable<void> {
    console.warn('signout', this.fireAuth);
    return from(this.fireAuth.currentUser).pipe(
      concatMap(user => {
        if (Boolean(user)) {
          return from(this.fireAuth.signOut());
        }
        return of<void>();
      }),
    );
  }

  /**
   * Creates a user
   * @param payload user credentials
   */
  public create(payload: { email: string; password: string }): Promise<any> {
    const def = new CustomDeferredService<any>();
    this.fireAuth
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(success => {
        // console.warn('auth success', success);
        def.resolve(success);
      })
      .catch(error => {
        // console.warn('auth error', error);
        def.reject(error);
      });
    return def.promise;
  }

  /**
   * Sends password reset link to user's email.
   * @param email user email
   */
  public resetUserPassword(email: string): Promise<any> {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  /**
   * Deletes a user
   * @param email user email
   * @param password user password
   */
  public async delete(email: string, password: string): Promise<any> {
    const def = new CustomDeferredService<any>();
    const credential: any = await this.fireAuth.signInWithEmailAndPassword(email, password);

    this.fire.authUser
      .reauthenticateAndRetrieveDataWithCredential(credential)
      .then(() => {
        // console.warn('successfully reauthenticated');
        return (this.getDB('users/' + this.fire.authUser.uid, true) as DatabaseReference).remove(); // delete user db profile also
      })
      .then(() => {
        return this.fire.authUser.delete();
      })
      .then(() => {
        def.resolve(true);
      })
      .catch(error => {
        def.reject(error);
      });
    return def.promise;
  }

  /**
   * Checks authentication for errors.
   */
  public authErrorCheck(): void {
    const typeError = new TypeError(
      'firebaseService, user DB record action error: there seems to be no authenticated users',
    );
    if (!this.fireAuth.user) {
      throw typeError;
    } else if (this.fireAuth.user && !Boolean(this.fire.authUser.uid)) {
      throw typeError;
    }
  }

  /**
   * Checks database user id.
   */
  public checkDBuserUID(): Promise<{ exists: boolean; created: boolean } | any> {
    const def = new CustomDeferredService<any>();
    this.authErrorCheck();
    (this.getDB('users/' + this.fire.authUser.uid) as Promise<DataSnapshot>)
      .then((snapshot: DataSnapshot) => {
        console.warn('checking user db profile');
        if (!Boolean(snapshot.val())) {
          console.warn('creating user db profile');
          (this.getDB('users/' + this.fire.authUser.uid, true) as DatabaseReference)
            .set({
              created: new Date().getTime(),
            })
            .then(() => {
              console.warn('created user db profile');
              def.resolve({ exists: false, created: true });
            })
            .catch(error => {
              console.warn('error creating user db profile', error);
              def.reject({ exists: false, created: false });
            });
        } else {
          def.resolve({ exists: true, created: false });
        }
      })
      .catch(error => {
        console.warn('checkDBuserUID, user db profile check:', error);
        def.reject(error);
      });
    return def.promise;
  }

  /**
   * Sets new values for database user.
   * @param valuesObj new values object
   */
  public setDBuserNewValues(valuesObj: {
    submittedPlaylists?: any[];
    sc_code?: string;
    sc_oauth_token?: string;
    sc_id?: string;
  }): Promise<{ valuesSet: boolean } | any> {
    const def = new CustomDeferredService<any>();
    this.authErrorCheck();
    this.checkDBuserUID()
      .then(data => {
        console.warn('checkDBuserUID', JSON.stringify(data));
        (this.getDB('users/' + this.fire.authUser.uid, true) as DatabaseReference)
          .update(valuesObj)
          .then(() => {
            console.warn('user db profile values set');
            def.resolve({ valuesSet: true });
          })
          .catch(error => {
            console.warn('error setting user db profile values', error);
            def.reject({ valuesSet: false });
          });
      })
      .catch(error => {
        console.warn('setDBuserValues, user db profile check error', error);
        def.reject(error);
      });
    return def.promise;
  }

  /**
   * Resolves if blog entry exists by value
   * @param dbKey blog entry database key
   */
  public blogEntryExistsByValue(dbKey: string): Promise<any> {
    const def = new CustomDeferredService();
    (this.getDB('blogEntriesIDs', true) as DatabaseReference)
      .orderByValue()
      .equalTo(dbKey)
      .on('value', (snapshot: DatabaseSnapshotExists<any>) => {
        const response = snapshot.val();
        // console.warn('blogEntryExists, blogEntriesIDs response', response);
        // null - not found
        def.resolve(response);
      });
    return def.promise;
  }

  /**
   * Resolves if blog entry exists by child value
   * @param childKey child key
   * @param value child key value
   */
  public blogEntryExistsByChildValue(childKey: string, value: any): Promise<any> {
    const def = new CustomDeferredService();
    (this.getDB('blog', true) as DatabaseReference)
      .orderByChild(childKey)
      .equalTo(value)
      .on('value', snapshot => {
        const response = snapshot.val();
        // console.warn('blogEntryExists, blogEntriesIDs response', response);
        // null - not found
        def.resolve(response);
      });
    return def.promise;
  }

  /**
   * Adds blog post to database.
   * @param valuesObj blog post model
   */
  public addBlogPost(valuesObj: IBlogPost): Promise<any> {
    /*
     *	create new records, delete submission record
     */
    const def = new CustomDeferredService();
    this.authErrorCheck();
    this.checkDBuserUID()
      .then((data: any) => {
        console.warn('checkDBuserUID', JSON.stringify(data));
        (this.getDB('blogEntriesIDs', true) as DatabaseReference)
          .orderByValue()
          .once('value', (snapshot: DataSnapshot) => {
            const idsArray = snapshot.val();
            console.warn('idsArray', idsArray);
            idsArray[0].push(valuesObj.playlistId);
            (this.getDB('blogEntriesIDs', true) as DatabaseReference)
              .set(idsArray) // update blog entries ids
              .then(() => {
                const newRecord = (this.getDB('blog', true) as DatabaseReference).push(); // update blog
                newRecord
                  .set(valuesObj)
                  .then(() => {
                    console.warn('blog post added');
                    def.resolve({ valuesSet: true });
                  })
                  .catch((error: any) => {
                    console.warn('error adding blog post entry', error);
                    def.reject({ valuesSet: false });
                  });
              })
              .catch((error: any) => {
                console.warn(
                  'error adding blog post entry ref to blogEntriesIDs collection',
                  error,
                );
                def.reject({ valuesSet: false });
              });
          });
      })
      .catch(error => {
        console.warn('addBlogPost, user db profile check error', error);
        def.reject(error);
      });
    return def.promise;
  }
}
