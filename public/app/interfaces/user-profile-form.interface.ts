import { FormGroup, AbstractControl } from '@angular/forms';

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
