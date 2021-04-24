import { AbstractControl, FormGroup } from '@angular/forms';

export interface ILoginFormValue {
  email: string;
  password: string;
}

export interface ILoginForm extends FormGroup {
  controls: {
    email: AbstractControl;
    password: AbstractControl;
  };
}
