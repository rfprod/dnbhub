import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
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
  public canActivate(): boolean {
    const can: boolean = !this.firebaseService.anonUser() ? true : false;
    if (!can) {
      this.router.navigate(['index']);
    }
    return can;
  }
}
