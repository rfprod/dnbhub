import { AbstractControl, FormGroup } from '@angular/forms';

/**
 * User profile interface.
 */
export interface UserProfile {
  email: string;
  name: string;
  password: string;
}

/**
 * User profile form group interface.
 */
export interface IUserProfileForm extends FormGroup {
  controls: {
    email: AbstractControl;
    name: AbstractControl;
    password: AbstractControl;
  };
}
