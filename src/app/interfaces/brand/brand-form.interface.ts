import { AbstractControl, FormGroup } from '@angular/forms';

/**
 * Brand form interface.
 */
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
