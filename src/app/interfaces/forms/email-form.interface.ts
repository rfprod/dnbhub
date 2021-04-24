import { AbstractControl, FormGroup } from '@angular/forms';

export interface IEmailFormValue {
  email: string;
  name: string;
  header: string;
  message: string;
  domain: string;
}

export interface IEmailForm extends FormGroup {
  controls: {
    email: AbstractControl;
    name: AbstractControl;
    header: AbstractControl;
    message: AbstractControl;
    domain: AbstractControl;
  };
}
