import { AbstractControl, FormGroup } from '@angular/forms';

export interface IUserProfile {
  email: string;
  name: string;
  password: string;
}

export interface IUserProfileForm extends FormGroup {
  controls: {
    email: AbstractControl;
    name: AbstractControl;
    password: AbstractControl;
  };
}
