import { AbstractControl, FormGroup } from '@angular/forms';

/**
 * Login form interface.
 */
export interface ILoginForm extends FormGroup {
  controls: {
    email: AbstractControl;
    password: AbstractControl;
  };
}
