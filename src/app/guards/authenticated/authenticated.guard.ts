import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

/**
 * Authenticated guard.
 * Passes authenticated users only.
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService, private readonly router: Router) {}

  public canActivate(): Observable<boolean> {
    return this.firebaseService.anonUser$.pipe(
      map(anon => !anon),
      tap(user => {
        if (!user) {
          void this.router.navigate(['index']);
        }
      }),
    );
  }
}
