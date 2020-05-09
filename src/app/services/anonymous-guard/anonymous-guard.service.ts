import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

/**
 * Anonimous guard service.
 */
@Injectable()
export class AnonymousGuard implements CanActivate {
  /**
   * @param firebaseService Firebase service
   * @param router Router - application router
   */
  constructor(private readonly firebaseService: FirebaseService, private readonly router: Router) {}

  /**
   * Protects paths from anonimous users.
   */
  public canActivate(): Observable<boolean> {
    return this.firebaseService.anonUser().pipe(
      tap(user => {
        if (!user) {
          void this.router.navigate(['index']);
        }
      }),
      map(user => (user ? true : false)),
    );
  }
}
