import { FormGroup, AbstractControl } from '@angular/forms';

/**
 * Email form interface.
 */
export interface IEmailForm extends FormGroup {
  controls: {
    email: AbstractControl;
    name: AbstractControl;
    header: AbstractControl;
    message: AbstractControl;
    domain: AbstractControl;
  };
}
