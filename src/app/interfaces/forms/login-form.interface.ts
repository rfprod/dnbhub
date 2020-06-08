import { AbstractControl, FormGroup } from '@angular/forms';

export interface ILoginFormValue {
  email: string;
  password: string;
}

/**
 * Login form interface.
 */
export interface ILoginForm extends FormGroup {
  controls: {
    email: AbstractControl;
    password: AbstractControl;
  };
}
