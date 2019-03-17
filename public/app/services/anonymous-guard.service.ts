import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { FirebaseService } from './firebase.service';

/**
 * Anonimous guard service.
 */
@Injectable()
export class AnonymousGuard implements CanActivate {

  /**
   * @param firebaseService Firebase service
   * @param router Router - application router
   */
  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  /**
   * Protects paths from anonimous users.
   */
  public canActivate(): boolean {
    return !this.firebaseService.anonUser() ? true : false;
  }

}
