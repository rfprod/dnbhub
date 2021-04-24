import { AbstractControl, FormGroup } from '@angular/forms';

export interface IBrandForm extends FormGroup {
  controls: {
    name: AbstractControl;
    bandcamp: AbstractControl;
    facebook: AbstractControl;
    instagram: AbstractControl;
    soundcloud: AbstractControl;
    twitter: AbstractControl;
    website: AbstractControl;
    youtube: AbstractControl;
  };
}
